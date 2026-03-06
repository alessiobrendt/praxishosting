<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\TeamSpeakServerAccount;
use App\Models\TeamSpeakSnapshot;
use App\Services\BalancePaymentService;
use App\Services\ControlPanels\TeamSpeakClient;
use App\Services\MollieCustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

class TeamSpeakAccountController extends Controller
{
    use \App\Http\Controllers\Concerns\RedirectsToMollieSubscriptionFirstPayment;

    protected function ensureTeamSpeakFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];

        if (! ($features['teamspeak'] ?? false) && ! ($features['gaming'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'TeamSpeak-Server werden für diese Marke nicht angeboten.');
        }

        return null;
    }

    protected function authorizeAccount(Request $request, TeamSpeakServerAccount $account): void
    {
        if ($account->user_id !== $request->user()->id) {
            abort(404);
        }
    }

    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $accounts = $request->user()
            ->teamSpeakServerAccounts()
            ->with(['hostingPlan', 'hostingServer'])
            ->latest()
            ->get();

        $serverInfos = [];
        $client = null;
        $count = 0;
        $maxOverview = 20;
        foreach ($accounts as $account) {
            if ($count >= $maxOverview || ! $account->virtual_server_id || ! $account->hostingServer) {
                continue;
            }
            try {
                $client = $client ?? app(TeamSpeakClient::class);
                $client->setServer($account->hostingServer);
                $info = $client->getServerInfo($account->virtual_server_id);
                if ($info !== null) {
                    $serverInfos[(string) $account->id] = $info;
                    $count++;
                }
            } catch (\Throwable) {
                continue;
            }
        }

        return Inertia::render('teamspeak-accounts/Index', [
            'teamSpeakServerAccounts' => $accounts,
            'serverInfos' => $serverInfos,
        ]);
    }

    public function show(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): Response|RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        $teamSpeakServerAccount->load('hostingPlan', 'hostingServer');

        $snapshots = $teamSpeakServerAccount->snapshots()
            ->orderByDesc('created_at')
            ->get(['id', 'created_at']);

        $serverInfo = null;
        $tokens = [];
        $viewerTree = ['server' => [], 'channels' => [], 'clients' => []];
        if ($teamSpeakServerAccount->hostingServer && $teamSpeakServerAccount->virtual_server_id) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($teamSpeakServerAccount->hostingServer);
                $serverInfo = $client->getServerInfo($teamSpeakServerAccount->virtual_server_id);
                $tokens = $client->listPrivilegeKeys($teamSpeakServerAccount->virtual_server_id);
                $viewerTree = $client->getViewerTree($teamSpeakServerAccount->virtual_server_id);
            } catch (\Throwable $e) {
                Log::debug('TeamSpeak show: API error', ['message' => $e->getMessage()]);
            }
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $canRenew = $this->accountCanRenew($teamSpeakServerAccount);
        $renewalAmount = $canRenew ? $teamSpeakServerAccount->getMonthlyRenewalAmount() : 0.0;
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance) {
            $balance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        $isSuspendedOrExpired = $teamSpeakServerAccount->isSuspendedOrExpired();

        return Inertia::render('teamspeak-accounts/Show', [
            'teamSpeakServerAccount' => $teamSpeakServerAccount,
            'serverInfo' => $serverInfo,
            'tokens' => $tokens,
            'snapshots' => $snapshots,
            'viewerTree' => $viewerTree,
            'canRenew' => $canRenew,
            'renewalAmount' => $renewalAmount,
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'renewUrl' => route('teamspeak-accounts.renew', $teamSpeakServerAccount),
            'isSuspendedOrExpired' => $isSuspendedOrExpired,
            'auto_renew_with_balance' => (bool) $teamSpeakServerAccount->auto_renew_with_balance,
            'has_mollie_subscription' => ! empty($teamSpeakServerAccount->mollie_subscription_id),
        ]);
    }

    public function overview(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): JsonResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return response()->json(['error' => 'unauthorized'], 403);
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($teamSpeakServerAccount->isSuspendedOrExpired()) {
            return response()->json(['error' => 'suspended', 'serverInfo' => null, 'viewerTree' => null], 403);
        }

        $serverInfo = null;
        $viewerTree = ['server' => [], 'channels' => [], 'clients' => []];
        if ($teamSpeakServerAccount->hostingServer && $teamSpeakServerAccount->virtual_server_id) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($teamSpeakServerAccount->hostingServer);
                $serverInfo = $client->getServerInfo($teamSpeakServerAccount->virtual_server_id);
                $viewerTree = $client->getViewerTree($teamSpeakServerAccount->virtual_server_id);
            } catch (\Throwable) {
                // keep null
            }
        }

        return response()->json(['serverInfo' => $serverInfo, 'viewerTree' => $viewerTree]);
    }

    public function power(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($teamSpeakServerAccount->isSuspendedOrExpired()) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Der Server ist gesperrt oder abgelaufen. Bitte zuerst verlängern.');
        }

        $action = $request->input('action', 'stop');
        if (! in_array($action, ['stop', 'start'], true)) {
            $action = 'stop';
        }

        if (! $teamSpeakServerAccount->hostingServer || ! $teamSpeakServerAccount->virtual_server_id) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Kein virtueller Server zugewiesen.');
        }

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            if ($action === 'stop') {
                $client->stopVirtualServer($teamSpeakServerAccount->virtual_server_id);
            } else {
                $client->startVirtualServer($teamSpeakServerAccount->virtual_server_id);
            }
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Aktion fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', $action === 'stop' ? 'Server wurde gestoppt.' : 'Server wurde gestartet.');
    }

    public function reinstall(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($teamSpeakServerAccount->isSuspendedOrExpired()) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Der Server ist gesperrt oder abgelaufen. Bitte zuerst verlängern.');
        }

        if (! $teamSpeakServerAccount->hostingServer || ! $teamSpeakServerAccount->virtual_server_id) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Kein virtueller Server zugewiesen.');
        }

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $client->deleteVirtualServer($teamSpeakServerAccount->virtual_server_id);
        } catch (\Throwable $e) {
            Log::warning('TeamSpeak reinstall: delete failed', ['account_id' => $teamSpeakServerAccount->id, 'message' => $e->getMessage()]);
        }

        $teamSpeakServerAccount->update(['virtual_server_id' => null, 'port' => null]);

        $slots = (int) (($teamSpeakServerAccount->option_values['slots'] ?? null) ?: 32);
        if ($slots < 1) {
            $slots = 32;
        }
        $config = $teamSpeakServerAccount->hostingServer->config ?? [];
        $minPort = (int) ($config['port_range_min'] ?? 10072);
        $maxPort = (int) ($config['port_range_max'] ?? 10221);

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $port = $client->getNextAvailablePort($minPort, $maxPort);
            $created = $client->createVirtualServer($teamSpeakServerAccount->name, $port, $slots);
            $teamSpeakServerAccount->update([
                'virtual_server_id' => $created['virtual_server_id'],
                'port' => $created['port'],
            ]);
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Neuinstallation fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Server wurde neu eingerichtet.');
    }

    public function renew(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse|Response
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if (! $this->accountCanRenew($teamSpeakServerAccount)) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Dieser TeamSpeak-Server kann nicht über diese Seite verlängert werden.');
        }

        $request->validate([
            'payment_method' => ['required', 'string', 'in:balance,mollie'],
            'period_months' => ['nullable', 'integer', 'min:1', 'max:12'],
        ]);

        $periodMonths = (int) $request->input('period_months', 1);
        $amount = round($teamSpeakServerAccount->getMonthlyRenewalAmount() * $periodMonths, 2);
        $user = $request->user();
        $paymentMethod = $request->input('payment_method', 'mollie');

        if ($paymentMethod === 'balance') {
            $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
            $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
            if (! ($brandFeatures['prepaid_balance'] ?? false)) {
                return redirect()
                    ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                    ->with('error', 'Zahlung mit Guthaben ist für diese Marke nicht aktiviert.');
            }

            if ($amount > 0) {
                try {
                    app(BalancePaymentService::class)->pay(
                        $user,
                        $amount,
                        'teamspeak_renewal',
                        'TeamSpeak-Server Verlängerung: '.$teamSpeakServerAccount->name,
                        ['description' => 'Verlängerung TeamSpeak-Server '.$teamSpeakServerAccount->name]
                    );
                } catch (InsufficientBalanceException $e) {
                    return redirect()
                        ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                        ->with('error', $e->getMessage());
                }
            }

            $from = $teamSpeakServerAccount->current_period_ends_at && $teamSpeakServerAccount->current_period_ends_at->isFuture()
                ? $teamSpeakServerAccount->current_period_ends_at
                : now();
            $wasSuspended = $teamSpeakServerAccount->status === 'suspended';
            $teamSpeakServerAccount->update([
                'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
                'status' => 'active',
            ]);
            if ($wasSuspended && $teamSpeakServerAccount->hostingServer && $teamSpeakServerAccount->virtual_server_id) {
                try {
                    $client = app(TeamSpeakClient::class);
                    $client->setServer($teamSpeakServerAccount->hostingServer);
                    $client->startVirtualServer($teamSpeakServerAccount->virtual_server_id);
                } catch (\Throwable) {
                    // continue
                }
            }

            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('success', 'Der TeamSpeak-Server wurde erfolgreich verlängert.');
        }

        return app(CheckoutController::class)->buildTeamSpeakRenewRedirect($request, $teamSpeakServerAccount, $periodMonths);
    }

    public function updateName(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        $name = $request->validate(['name' => ['required', 'string', 'max:255']])['name'];

        $teamSpeakServerAccount->update(['name' => $name]);

        if ($teamSpeakServerAccount->virtual_server_id && $teamSpeakServerAccount->hostingServer) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($teamSpeakServerAccount->hostingServer);
                $client->setServerName($teamSpeakServerAccount->virtual_server_id, $name);
            } catch (\Throwable $e) {
                Log::debug('TeamSpeak setServerName failed', ['message' => $e->getMessage()]);
            }
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Name wurde aktualisiert.');
    }

    public function createToken(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($teamSpeakServerAccount->isSuspendedOrExpired() || ! $teamSpeakServerAccount->virtual_server_id || ! $teamSpeakServerAccount->hostingServer) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Token können derzeit nicht erstellt werden.');
        }

        $description = (string) $request->input('description', '');

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $token = $client->createPrivilegeKey($teamSpeakServerAccount->virtual_server_id, 0, $description);
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Token konnte nicht erstellt werden: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Token erstellt. Der Token lautet: '.$token);
    }

    public function deleteToken(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        $token = (string) $request->input('token', '');
        if ($token === '') {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Kein Token angegeben.');
        }

        if (! $teamSpeakServerAccount->virtual_server_id || ! $teamSpeakServerAccount->hostingServer) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Aktion nicht möglich.');
        }

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $client->deletePrivilegeKey($teamSpeakServerAccount->virtual_server_id, $token);
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Token konnte nicht gelöscht werden: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Token wurde gelöscht.');
    }

    public function createBackup(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($teamSpeakServerAccount->isSuspendedOrExpired() || ! $teamSpeakServerAccount->virtual_server_id || ! $teamSpeakServerAccount->hostingServer) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Backup kann derzeit nicht erstellt werden.');
        }

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $snapshotData = $client->createSnapshot($teamSpeakServerAccount->virtual_server_id);
            TeamSpeakSnapshot::create([
                'team_speak_server_account_id' => $teamSpeakServerAccount->id,
                'snapshot' => $snapshotData,
            ]);
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Backup konnte nicht erstellt werden: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Snapshot wurde erstellt.');
    }

    public function deployBackup(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount, TeamSpeakSnapshot $snapshot): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($snapshot->team_speak_server_account_id !== (int) $teamSpeakServerAccount->id) {
            abort(404);
        }

        if ($teamSpeakServerAccount->isSuspendedOrExpired() || ! $teamSpeakServerAccount->virtual_server_id || ! $teamSpeakServerAccount->hostingServer) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Backup kann derzeit nicht wiederhergestellt werden.');
        }

        $snapshotData = $snapshot->snapshot ?? '';
        if ($snapshotData === '') {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Dieses Backup enthält keine Snapshot-Daten. Bitte ein neues Backup erstellen.');
        }

        try {
            $client = app(TeamSpeakClient::class);
            $client->setServer($teamSpeakServerAccount->hostingServer);
            $client->deploySnapshot($teamSpeakServerAccount->virtual_server_id, $snapshotData);
        } catch (\Throwable $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Wiederherstellung fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Backup wurde wiederhergestellt.');
    }

    public function destroyBackup(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount, TeamSpeakSnapshot $snapshot): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if ($snapshot->team_speak_server_account_id !== (int) $teamSpeakServerAccount->id) {
            abort(404);
        }

        $snapshot->delete();

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Backup wurde gelöscht.');
    }

    /**
     * Cancel subscription at period end (Mollie). Only owner.
     */
    public function cancelSubscription(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($teamSpeakServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann das Abo kündigen.');
        }

        if (! $teamSpeakServerAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem TeamSpeak-Server verknüpft.');
        }

        $user = $request->user();
        if (! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $teamSpeakServerAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
        }

        $teamSpeakServerAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'Ihr TeamSpeak-Server-Abo wurde zum Periodenende gekündigt.');
    }

    /**
     * Enable or disable auto-renew with balance for this prepaid TeamSpeak server.
     */
    public function setAutoRenewWithBalance(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['prepaid_balance'] ?? false)) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Auto Renew mit Guthaben ist für diese Marke nicht verfügbar.');
        }

        if (! $this->accountCanRenew($teamSpeakServerAccount)) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Dieser TeamSpeak-Server kann nicht für Auto Renew mit Guthaben eingerichtet werden.');
        }

        $enabled = $request->boolean('enabled', true);

        $teamSpeakServerAccount->update(['auto_renew_with_balance' => $enabled]);

        $message = $enabled
            ? 'Auto Renew mit Guthaben wurde aktiviert. Am letzten Tag vor Ablauf wird automatisch verlängert, wenn genug Guthaben vorhanden ist.'
            : 'Auto Renew mit Guthaben wurde deaktiviert.';

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', $message);
    }

    /**
     * Create a Mollie subscription for automatic monthly renewal of this TeamSpeak server.
     */
    public function createMollieSubscription(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }
        $this->authorizeAccount($request, $teamSpeakServerAccount);

        if (! $this->accountCanRenew($teamSpeakServerAccount)) {
            $message = 'Dieser TeamSpeak-Server kann nicht für ein Mollie-Abo eingerichtet werden. ';
            if ($teamSpeakServerAccount->mollie_subscription_id) {
                $message .= 'Es ist bereits ein Abo aktiv.';
            } elseif (($teamSpeakServerAccount->renewal_type ?? 'manual') !== 'manual') {
                $message .= 'Nur manuell verlängerte Server können umgestellt werden.';
            } else {
                $plan = $teamSpeakServerAccount->hostingPlan;
                $monthlyAmount = $teamSpeakServerAccount->getMonthlyRenewalAmount();
                if (! $plan || ! $plan->is_active) {
                    $message .= 'Das aktuelle Paket ist nicht verfügbar.';
                } elseif ($monthlyAmount <= 0) {
                    $message .= 'Das aktuelle Paket hat keinen gültigen monatlichen Preis (Basispreis oder Paket-Optionen wie Slots). Bitte kontaktieren Sie uns – wir tragen den Preis ein und richten das Abo ein.';
                } else {
                    $message .= 'Bitte zuerst den Server um mindestens 1 Monat verlängern.';
                }
            }

            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', $message);
        }

        $user = $request->user();
        try {
            $customerId = app(MollieCustomerService::class)->ensureCustomer($user);
            $user->refresh();
        } catch (MollieApiException $e) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Mollie-Kunde konnte nicht angelegt werden: '.$e->getMessage());
        }

        $amount = $teamSpeakServerAccount->getMonthlyRenewalAmount();
        if ($amount <= 0) {
            return redirect()
                ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
                ->with('error', 'Kein gültiger Preis für dieses Paket. Bitte im Admin unter Hosting-Pakete einen monatlichen Preis oder Paket-Optionen (z. B. Slots) mit Preis eintragen, oder FALLBACK_MONTHLY_PRICE_TEAMSPEAK in der .env setzen.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $subscriptionParams = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'interval' => '1 month',
            'description' => 'TeamSpeak-Server Abo: '.$teamSpeakServerAccount->name,
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
                'TeamSpeak-Server Abo: '.$teamSpeakServerAccount->name,
                'teamspeak',
                $teamSpeakServerAccount->id,
                'teamspeak-accounts.show',
                [$teamSpeakServerAccount],
                'Dieser TeamSpeak-Server kann nicht für ein Mollie-Abo eingerichtet werden.'
            );
        }

        $teamSpeakServerAccount->update([
            'mollie_subscription_id' => $subscription->id,
            'renewal_type' => 'auto',
            'cancel_at_period_end' => false,
        ]);

        return redirect()
            ->route('teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die Abbuchung erfolgt monatlich automatisch.');
    }

    protected function accountCanRenew(TeamSpeakServerAccount $account): bool
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
}
