<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Requests\RenewGamingAccountRequest;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\GameServerAccount;
use App\Services\BalancePaymentService;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\MollieCustomerService;
use App\Services\SyncHostingPlanStripePriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Checkout;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;
use RuntimeException;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Exception\InvalidRequestException;
use Stripe\StripeClient;

class GamingAccountController extends Controller
{
    use \App\Http\Controllers\Concerns\RedirectsToMollieSubscriptionFirstPayment;

    protected function ensureGamingFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];

        if (! ($features['gaming'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'Game-Server werden für diese Marke nicht angeboten.');
        }

        return null;
    }

    /**
     * List current user's game server accounts.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $accounts = $request->user()
            ->gameServerAccounts()
            ->with(['hostingPlan', 'hostingServer', 'gameserverCloudSubscription.gameserverCloudPlan'])
            ->latest()
            ->get();

        $serverOverviews = [];
        $client = null;
        $maxOverview = 20;
        $count = 0;
        foreach ($accounts as $account) {
            if ($count >= $maxOverview) {
                break;
            }
            if (! $account->identifier || ! $account->hostingServer) {
                continue;
            }
            try {
                $client = $client ?? app(PterodactylClient::class);
                $overview = $client->getServerOverview($account);
                if ($overview !== null) {
                    $serverOverviews[(string) $account->id] = $overview;
                    $count++;
                }
            } catch (\Throwable) {
                continue;
            }
        }

        return Inertia::render('gaming-accounts/Index', [
            'gameServerAccounts' => $accounts,
            'serverOverviews' => $serverOverviews,
        ]);
    }

    /**
     * Show one game server account with login link. Only owner.
     */
    public function show(Request $request, GameServerAccount $gameServerAccount): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(404);
        }

        $gameServerAccount->load('hostingPlan', 'hostingServer', 'gameserverCloudSubscription.gameserverCloudPlan');

        $config = $gameServerAccount->hostingServer?->config ?? [];
        $panelUrl = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $loginUrl = $panelUrl && $gameServerAccount->identifier
            ? $panelUrl.'/server/'.$gameServerAccount->identifier
            : null;

        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $canRenew = $this->accountCanRenew($gameServerAccount);
        $renewalAmount = $canRenew ? $gameServerAccount->getMonthlyRenewalAmount() : 0.0;
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance) {
            $balance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        $isSuspendedOrExpired = $gameServerAccount->isSuspendedOrExpired();

        $gameserverCloudSubscription = null;
        $cloudSubscriptionUrl = null;
        if ($gameServerAccount->isCloudAccount() && $gameServerAccount->gameserverCloudSubscription) {
            $sub = $gameServerAccount->gameserverCloudSubscription;
            $gameserverCloudSubscription = [
                'id' => $sub->id,
                'current_period_ends_at' => $sub->current_period_ends_at?->toIso8601String(),
                'cancel_at_period_end' => $sub->cancel_at_period_end,
                'plan' => ['name' => $sub->gameserverCloudPlan?->name ?? 'Cloud'],
            ];
            $cloudSubscriptionUrl = route('gaming.cloud.subscriptions.show', $sub->id);
        }

        return Inertia::render('gaming-accounts/Show', [
            'gameServerAccount' => $gameServerAccount,
            'loginUrl' => $loginUrl,
            'userEmail' => $request->user()->email,
            'serverOverview' => $serverOverview,
            'canRenew' => $canRenew,
            'renewalAmount' => $renewalAmount,
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'renewUrl' => route('gaming-accounts.renew', $gameServerAccount),
            'isSuspendedOrExpired' => $isSuspendedOrExpired,
            'auto_renew_with_balance' => (bool) $gameServerAccount->auto_renew_with_balance,
            'has_mollie_subscription' => ! empty($gameServerAccount->mollie_subscription_id),
            'gameserverCloudSubscription' => $gameserverCloudSubscription,
            'cloudSubscriptionUrl' => $cloudSubscriptionUrl,
        ]);
    }

    /**
     * Send power action (start, stop, restart) to the game server. Only owner.
     */
    public function power(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(404);
        }

        if ($gameServerAccount->isSuspendedOrExpired()) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie zuerst.');
        }

        $action = $request->input('action', '');
        if (! in_array($action, ['start', 'stop', 'restart', 'kill'], true)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Ungültige Aktion.');
        }

        try {
            $client = app(PterodactylClient::class);
            $client->sendPowerAction($gameServerAccount, $action);
        } catch (\Throwable $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Aktion fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Befehl gesendet.');
    }

    /**
     * Return current server overview (for live polling). Only owner.
     */
    public function overview(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            return response()->json(['error' => 'not found'], 404);
        }

        if ($gameServerAccount->isSuspendedOrExpired()) {
            return response()->json(['error' => 'suspended', 'serverOverview' => null], 403);
        }

        $gameServerAccount->load('hostingServer');
        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        return response()->json(['serverOverview' => $serverOverview]);
    }

    /**
     * Ensure user owns the account and is not suspended. Returns JSON error response or null.
     */
    private function ensureAccountOwnerApi(Request $request, GameServerAccount $gameServerAccount): ?JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }
        if ($gameServerAccount->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        if ($gameServerAccount->isSuspendedOrExpired()) {
            return response()->json(['success' => false, 'message' => 'Server gesperrt oder abgelaufen.'], 403);
        }
        $gameServerAccount->load('hostingServer');
        if (! $gameServerAccount->identifier || ! $gameServerAccount->hostingServer) {
            return response()->json(['success' => false, 'message' => 'Server nicht bereit.'], 400);
        }

        return null;
    }

    /**
     * Get websocket ticket for console. Only owner.
     */
    public function consoleWebsocket(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $ticket = $client->getWebsocketTicket($gameServerAccount);

            return response()->json(['success' => true, 'token' => $ticket['token'], 'socket' => $ticket['socket']]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Send console command. Only owner.
     */
    public function consoleCommand(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $command = $request->input('command', '');
        if (! is_string($command) || trim($command) === '') {
            return response()->json(['success' => false, 'message' => 'Befehl fehlt.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->sendConsoleCommand($gameServerAccount, $command);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * List files. Only owner.
     */
    public function filesList(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $directory = $request->input('directory', '/');
        if (! is_string($directory)) {
            $directory = '/';
        }
        try {
            $client = app(PterodactylClient::class);
            $files = $client->listFiles($gameServerAccount, $directory);

            return response()->json(['success' => true, 'files' => $files]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Read file contents. Only owner.
     */
    public function filesContents(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $path = $request->input('path', $request->input('file', '/'));
        if (! is_string($path)) {
            $path = '/';
        }
        try {
            $client = app(PterodactylClient::class);
            $content = $client->getFileContents($gameServerAccount, $path);

            return response()->json(['success' => true, 'content' => $content]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Write file. Only owner.
     */
    public function filesWrite(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $path = $request->input('path', '');
        $content = $request->input('content', '');
        if (! is_string($path) || $path === '') {
            return response()->json(['success' => false, 'message' => 'Pfad fehlt.'], 422);
        }
        if (! is_string($content)) {
            $content = '';
        }
        try {
            $client = app(PterodactylClient::class);
            $client->writeFile($gameServerAccount, $path, $content);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Download file (proxy stream). Only owner.
     */
    public function filesDownload(Request $request, GameServerAccount $gameServerAccount): JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $path = $request->input('path', $request->input('file', ''));
        if (! is_string($path) || $path === '') {
            return response()->json(['success' => false, 'message' => 'Pfad fehlt.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $response = $client->getFileDownloadResponse($gameServerAccount, $path);
            if (! $response->successful()) {
                $body = $response->json();
                $msg = $body['errors'][0]['detail'] ?? $response->reason();

                return response()->json(['success' => false, 'message' => $msg], 502);
            }
            $filename = basename($path) ?: 'download';
            $headers = [
                'Content-Type' => $response->header('Content-Type') ?? 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="'.addslashes($filename).'"',
            ];

            return response()->streamDownload(
                fn () => print ($response->body()),
                $filename,
                $headers
            );
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Create directory. Only owner.
     */
    public function filesCreateFolder(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $root = $request->input('root', '/');
        $name = $request->input('name', '');
        if (! is_string($root)) {
            $root = '/';
        }
        if (! is_string($name) || $name === '') {
            return response()->json(['success' => false, 'message' => 'Ordnername fehlt.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->createFolder($gameServerAccount, $root, $name);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Delete files/directories. Only owner.
     */
    public function filesDelete(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $root = $request->input('root', '/');
        $files = $request->input('files', []);
        if (! is_string($root)) {
            $root = '/';
        }
        if (! is_array($files)) {
            return response()->json(['success' => false, 'message' => 'files muss ein Array sein.'], 422);
        }
        $files = array_values(array_filter(array_map(fn ($f) => is_string($f) ? $f : null, $files)));
        if (count($files) === 0) {
            return response()->json(['success' => false, 'message' => 'Keine Dateien angegeben.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->deleteFiles($gameServerAccount, $root, $files);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Rename files. Only owner.
     */
    public function filesRename(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $root = $request->input('root', '/');
        $files = $request->input('files', []);
        if (! is_string($root)) {
            $root = '/';
        }
        if (! is_array($files)) {
            return response()->json(['success' => false, 'message' => 'files muss ein Array von {from, to} sein.'], 422);
        }
        $pairs = [];
        foreach ($files as $item) {
            if (is_array($item) && isset($item['from'], $item['to']) && is_string($item['from']) && is_string($item['to'])) {
                $pairs[] = ['from' => $item['from'], 'to' => $item['to']];
            }
        }
        if (count($pairs) === 0) {
            return response()->json(['success' => false, 'message' => 'Keine gültigen Umbenennungen.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->renameFiles($gameServerAccount, $root, $pairs);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Upload file (proxy to Pterodactyl signed URL). Only owner.
     */
    public function filesUpload(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $directory = $request->input('directory', '/');
        if (! is_string($directory)) {
            $directory = '/';
        }
        $uploadedFile = $request->file('file') ?? $request->file('files');
        if (! $uploadedFile) {
            return response()->json(['success' => false, 'message' => 'Keine Datei hochgeladen.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $signedUrl = $client->getUploadUrl($gameServerAccount, $directory);

            $response = \Illuminate\Support\Facades\Http::attach(
                'files',
                file_get_contents($uploadedFile->getRealPath()),
                $uploadedFile->getClientOriginalName()
            )->post($signedUrl);

            if (! $response->successful()) {
                $body = $response->json();
                $message = $body['errors'][0]['detail'] ?? $body['errors'][0]['code'] ?? $response->reason();

                return response()->json(['success' => false, 'message' => $message], 502);
            }

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Compress files to zip. Only owner.
     */
    public function filesCompress(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $root = $request->input('root', '/');
        $files = $request->input('files', []);
        if (! is_string($root)) {
            $root = '/';
        }
        if (! is_array($files)) {
            return response()->json(['success' => false, 'message' => 'files muss ein Array sein.'], 422);
        }
        $files = array_values(array_filter(array_map(fn ($f) => is_string($f) ? $f : null, $files)));
        if (count($files) === 0) {
            return response()->json(['success' => false, 'message' => 'Keine Dateien angegeben.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->compressFiles($gameServerAccount, $root, $files);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Decompress zip archive. Only owner.
     */
    public function filesDecompress(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $root = $request->input('root', '/');
        $file = $request->input('file', '');
        if (! is_string($root)) {
            $root = '/';
        }
        if (! is_string($file) || $file === '') {
            return response()->json(['success' => false, 'message' => 'Dateiname fehlt.'], 422);
        }
        try {
            $client = app(PterodactylClient::class);
            $client->decompressFile($gameServerAccount, $root, $file);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * List backups. Only owner.
     */
    public function backupsList(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $backups = $client->listBackups($gameServerAccount);

            return response()->json(['success' => true, 'backups' => $backups]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Create backup. Only owner.
     */
    public function backupsCreate(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $name = $request->input('name', '');
        $options = [];
        if (is_string($name) && $name !== '') {
            $options['name'] = $name;
        }
        try {
            $client = app(PterodactylClient::class);
            $backup = $client->createBackup($gameServerAccount, $options);

            return response()->json(['success' => true, 'backup' => $backup]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Get backup download URL (signed). Only owner.
     */
    public function backupsDownload(Request $request, GameServerAccount $gameServerAccount, string $backupUuid): JsonResponse|RedirectResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $result = $client->getBackupDownloadUrl($gameServerAccount, $backupUuid);
            $url = $result['url'] ?? '';
            if ($url === '') {
                return response()->json(['success' => false, 'message' => 'Download-URL nicht verfügbar.'], 502);
            }

            return redirect()->away($url);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Restore backup. Only owner.
     */
    public function backupsRestore(Request $request, GameServerAccount $gameServerAccount, string $backupUuid): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $client->restoreBackup($gameServerAccount, $backupUuid, true);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Delete backup. Only owner.
     */
    public function backupsDelete(Request $request, GameServerAccount $gameServerAccount, string $backupUuid): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $client->deleteBackup($gameServerAccount, $backupUuid);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * List schedules. Only owner.
     */
    public function schedulesList(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $schedules = $client->listSchedules($gameServerAccount);

            return response()->json(['success' => true, 'schedules' => $schedules]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Create schedule. Only owner.
     */
    public function schedulesCreate(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $payload = [
            'name' => $request->input('name', 'Schedule'),
            'minute' => $request->input('minute', '0'),
            'hour' => $request->input('hour', '3'),
            'day_of_month' => $request->input('day_of_month', '*'),
            'month' => $request->input('month', '*'),
            'day_of_week' => $request->input('day_of_week', '*'),
            'is_active' => $request->boolean('is_active', true),
            'only_when_online' => $request->boolean('only_when_online', false),
        ];
        foreach (['name', 'minute', 'hour', 'day_of_month', 'month', 'day_of_week'] as $key) {
            if (! is_string($payload[$key])) {
                $payload[$key] = $key === 'name' ? 'Schedule' : ($key === 'minute' ? '0' : ($key === 'hour' ? '3' : '*'));
            }
        }
        try {
            $client = app(PterodactylClient::class);
            $schedule = $client->createSchedule($gameServerAccount, $payload);

            return response()->json(['success' => true, 'schedule' => $schedule]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Delete schedule. Only owner.
     */
    public function schedulesDelete(Request $request, GameServerAccount $gameServerAccount, int $schedule): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $client->deleteSchedule($gameServerAccount, $schedule);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Execute schedule now. Only owner.
     */
    public function schedulesExecute(Request $request, GameServerAccount $gameServerAccount, int $schedule): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $client->executeSchedule($gameServerAccount, $schedule);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Get a single schedule with tasks. Only owner.
     */
    public function schedulesShow(Request $request, GameServerAccount $gameServerAccount, int $schedule): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $scheduleData = $client->getSchedule($gameServerAccount, $schedule);

            return response()->json(['success' => true, 'schedule' => $scheduleData]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Create a task on a schedule. Only owner.
     * Body: action (command|power|backup), payload (string), time_offset (int), continue_on_failure (bool, optional).
     */
    public function scheduleTasksCreate(Request $request, GameServerAccount $gameServerAccount, int $schedule): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        $action = $request->string('action')->toString();
        if (! in_array($action, ['command', 'power', 'backup'], true)) {
            return response()->json(['success' => false, 'message' => 'Invalid action.'], 422);
        }
        $payload = [
            'action' => $action,
            'payload' => $request->string('payload')->toString(),
            'time_offset' => (int) $request->input('time_offset', 0),
            'continue_on_failure' => $request->boolean('continue_on_failure', false),
        ];
        if ($payload['time_offset'] < 0 || $payload['time_offset'] > 900) {
            $payload['time_offset'] = max(0, min(900, $payload['time_offset']));
        }
        try {
            $client = app(PterodactylClient::class);
            $task = $client->createScheduleTask($gameServerAccount, $schedule, $payload);

            return response()->json(['success' => true, 'task' => $task]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Delete a schedule task. Only owner.
     */
    public function scheduleTasksDelete(Request $request, GameServerAccount $gameServerAccount, int $schedule, int $task): JsonResponse
    {
        $err = $this->ensureAccountOwnerApi($request, $gameServerAccount);
        if ($err !== null) {
            return $err;
        }
        try {
            $client = app(PterodactylClient::class);
            $client->deleteScheduleTask($gameServerAccount, $schedule, $task);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 502);
        }
    }

    /**
     * Renew (extend) a prepaid game server: pay with balance or Stripe one-time.
     */
    public function renew(RenewGamingAccountRequest $request, GameServerAccount $gameServerAccount): RedirectResponse|Response
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht über diese Seite verlängert werden.');
        }

        $periodMonths = (int) $request->validated('period_months', 1);
        $amount = round($gameServerAccount->getMonthlyRenewalAmount() * $periodMonths, 2);
        $user = $request->user();
        $paymentMethod = $request->validated('payment_method');

        if ($paymentMethod === 'balance') {
            $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
            $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
            if (! ($brandFeatures['prepaid_balance'] ?? false)) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', 'Zahlung mit Guthaben ist für diese Marke nicht aktiviert.');
            }

            try {
                app(BalancePaymentService::class)->pay(
                    $user,
                    $amount,
                    'game_server_renewal',
                    'Game-Server Verlängerung: '.$gameServerAccount->name,
                    ['description' => 'Verlängerung Game-Server '.$gameServerAccount->name.' (ID '.$gameServerAccount->id.')']
                );
            } catch (InsufficientBalanceException $e) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', $e->getMessage());
            }

            $from = $gameServerAccount->current_period_ends_at && $gameServerAccount->current_period_ends_at->isFuture()
                ? $gameServerAccount->current_period_ends_at
                : now();
            $wasSuspended = $gameServerAccount->status === 'suspended';
            $gameServerAccount->update([
                'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
                'status' => 'active',
            ]);
            if ($wasSuspended && $gameServerAccount->hostingServer && $gameServerAccount->pterodactyl_server_id) {
                try {
                    $client = app(PterodactylClient::class);
                    $client->unsuspendServer($gameServerAccount->fresh());
                } catch (\Throwable) {
                    // status already active; Pterodactyl unsuspend can be retried manually if needed
                }
            }

            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('success', 'Der Game-Server wurde erfolgreich verlängert.');
        }

        $priceId = $plan->stripe_price_id;
        if (! $priceId) {
            try {
                $priceId = app(SyncHostingPlanStripePriceService::class)->ensurePriceId($plan);
            } catch (RuntimeException $e) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', $e->getMessage());
            }
        }
        if (! $priceId) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Kein Stripe-Preis für dieses Paket. Bitte im Admin unter Hosting-Pläne einen Preis angeben.');
        }

        $metadata = [
            'type' => 'game_server_renewal',
            'game_server_account_id' => (string) $gameServerAccount->id,
            'user_id' => (string) $user->id,
            'period_months' => (string) $periodMonths,
        ];

        try {
            if ($periodMonths === 1) {
                $checkout = Checkout::customer($user)
                    ->allowPromotionCodes()
                    ->create($priceId, [
                        'mode' => StripeSession::MODE_PAYMENT,
                        'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
                        'cancel_url' => route('gaming-accounts.show', $gameServerAccount),
                        'metadata' => $metadata,
                    ]);

                return Inertia::location($checkout->redirect()->getTargetUrl());
            }

            $stripe = new StripeClient(config('cashier.secret'));
            $pricePerMonthCents = (int) round((float) $plan->price * 100);
            $params = [
                'mode' => StripeSession::MODE_PAYMENT,
                'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('gaming-accounts.show', $gameServerAccount),
                'metadata' => $metadata,
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => config('cashier.currency', 'eur'),
                            'unit_amount' => $pricePerMonthCents,
                            'product_data' => [
                                'name' => 'Game-Server Verlängerung',
                                'description' => $periodMonths.' Monat(e) – '.$gameServerAccount->name,
                            ],
                        ],
                        'quantity' => $periodMonths,
                    ],
                ],
            ];
            if ($user->mollie_customer_id) {
                $params['customer'] = $user->mollie_customer_id;
            } else {
                $params['customer_email'] = $user->email;
            }
            $session = $stripe->checkout->sessions->create($params);
            $url = $session->url ?? null;
            if (! $url || ! str_starts_with($url, 'https://')) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', 'Stripe Checkout konnte nicht erstellt werden.');
            }

            return Inertia::location($url);
        } catch (InvalidRequestException $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Cancel subscription at period end (Mollie). Only owner.
     */
    public function cancelSubscription(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann das Abo kündigen.');
        }

        if (! $gameServerAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem Game-Server verknüpft.');
        }

        $user = $request->user();
        if (! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $gameServerAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
        }

        $gameServerAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'Ihr Game-Server-Abo wurde zum Periodenende gekündigt.');
    }

    /**
     * Enable or disable auto-renew with balance for this prepaid game server.
     */
    public function setAutoRenewWithBalance(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann Auto Renew verwalten.');
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['prepaid_balance'] ?? false)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Auto Renew mit Guthaben ist für diese Marke nicht verfügbar.');
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht für Auto Renew mit Guthaben eingerichtet werden.');
        }

        $enabled = $request->boolean('enabled', true);

        $gameServerAccount->update(['auto_renew_with_balance' => $enabled]);

        $message = $enabled
            ? 'Auto Renew mit Guthaben wurde aktiviert. Am letzten Tag vor Ablauf wird automatisch verlängert, wenn genug Guthaben vorhanden ist.'
            : 'Auto Renew mit Guthaben wurde deaktiviert.';

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', $message);
    }

    /**
     * Create a Mollie subscription for automatic monthly renewal of this game server.
     */
    public function createMollieSubscription(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann ein Mollie-Abo einrichten.');
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht für ein Mollie-Abo eingerichtet werden.');
        }

        $user = $request->user();
        try {
            $customerId = app(MollieCustomerService::class)->ensureCustomer($user);
            $user->refresh();
        } catch (MollieApiException $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Mollie-Kunde konnte nicht angelegt werden: '.$e->getMessage());
        }

        $amount = $gameServerAccount->getMonthlyRenewalAmount();
        if ($amount <= 0) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Kein gültiger Preis für dieses Paket.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $subscriptionParams = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'interval' => '1 month',
            'description' => 'Game-Server Abo: '.$gameServerAccount->name,
        ];

        try {
            $subscription = app(MollieApiClient::class)->subscriptions->createForId(
                $customerId,
                $subscriptionParams
            );
        } catch (MollieApiException $e) {
            return $this->redirectToMollieFirstPaymentForSubscription(
                $request,
                $user,
                $amount,
                $currency,
                'Game-Server Abo: '.$gameServerAccount->name,
                'gaming',
                $gameServerAccount->id,
                'gaming-accounts.show',
                [$gameServerAccount],
                'Dieser Game-Server kann nicht für ein Mollie-Abo eingerichtet werden.'
            );
        }

        $gameServerAccount->update([
            'mollie_subscription_id' => $subscription->id,
            'renewal_type' => 'auto',
            'cancel_at_period_end' => false,
        ]);

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die Abbuchung erfolgt monatlich automatisch.');
    }

    protected function accountCanRenew(GameServerAccount $account): bool
    {
        $renewalType = $account->renewal_type ?? 'manual';
        if ($renewalType !== 'manual' || $account->mollie_subscription_id !== null) {
            return false;
        }

        $plan = $account->hostingPlan;
        if (! $plan || ! $plan->is_active) {
            return false;
        }

        return $account->getMonthlyRenewalAmount() > 0;
    }

    protected function getBalancePeriodMonths(Request $request, \App\Models\User $user): int
    {
        $brand = $request->attributes->get('current_brand') ?? $user->brand ?? Brand::getDefault();
        $features = $brand?->getFeaturesArray() ?? [];

        return max(1, min(24, (int) ($features['balance_period_months'] ?? config('billing.balance_period_months', 1))));
    }
}
