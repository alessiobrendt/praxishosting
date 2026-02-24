<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\HostingServer;
use App\Services\ControlPanels\PterodactylClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GameServerAccountController extends Controller
{
    protected function currentBrand(Request $request): ?Brand
    {
        $brand = $request->attributes->get('current_brand');

        return $brand ?? Brand::getDefault();
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GameServerAccount::class);

        $currentBrand = $this->currentBrand($request);
        $features = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($features['gaming'] ?? false)) {
            return Inertia::render('admin/gaming-accounts/Index', [
                'gameServerAccounts' => [
                    'data' => [],
                    'links' => [],
                ],
                'brandHasGaming' => false,
            ]);
        }

        $query = GameServerAccount::query()
            ->with(['user', 'hostingPlan', 'hostingServer', 'product'])
            ->whereHas('hostingPlan', fn ($q) => $q->where('brand_id', $currentBrand->id))
            ->latest();

        $accounts = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/gaming-accounts/Index', [
            'gameServerAccounts' => $accounts,
            'brandHasGaming' => true,
        ]);
    }

    public function show(Request $request, GameServerAccount $gameServerAccount): Response
    {
        $this->authorize('view', $gameServerAccount);

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $gameServerAccount->load(['user', 'hostingPlan', 'hostingServer', 'product']);

        $panelUrl = $gameServerAccount->hostingServer?->config['base_uri'] ?? $gameServerAccount->hostingServer?->config['host'] ?? '';
        $loginUrl = $panelUrl && $gameServerAccount->identifier
            ? rtrim($panelUrl, '/').'/server/'.$gameServerAccount->identifier
            : null;

        return Inertia::render('admin/gaming-accounts/Show', [
            'gameServerAccount' => $gameServerAccount,
            'loginUrl' => $loginUrl,
        ]);
    }

    /**
     * Retry Pterodactyl provisioning for a pending game server account.
     */
    public function retryProvisioning(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $this->authorize('update', $gameServerAccount);

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        if ($gameServerAccount->status !== 'pending') {
            return redirect()->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Nur Accounts mit Status „pending“ können neu provisioniert werden.');
        }

        $plan = $gameServerAccount->hostingPlan;
        if (! $plan || $plan->panel_type !== 'pterodactyl') {
            return redirect()->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Paket ist kein Pterodactyl-Paket.');
        }

        $server = null;
        if ($plan->hosting_server_id) {
            $server = HostingServer::query()
                ->where('id', $plan->hosting_server_id)
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }
        if (! $server) {
            $server = HostingServer::query()
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }

        if (! $server) {
            return redirect()->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Kein aktiver Pterodactyl-Panel-Server verfügbar. Bitte im Hosting-Paket einen Panel-Server zuweisen.');
        }

        $user = $gameServerAccount->user;
        $password = Str::password(20);
        $config = $plan->config ?? [];
        $params = [
            'email' => $user->email,
            'username' => str_replace([' ', '.'], '_', Str::lower($user->name)).'_'.Str::random(4),
            'first_name' => $user->name,
            'last_name' => '',
            'password' => $password,
            'server_name' => $gameServerAccount->name,
            'nest_id' => (int) ($config['nest_id'] ?? 1),
            'egg_id' => (int) ($config['egg_id'] ?? 1),
            'memory' => (int) ($config['memory'] ?? 512),
            'disk' => (int) ($config['disk'] ?? 5120),
            'cpu' => (int) ($config['cpu'] ?? 0),
            'databases' => (int) ($config['databases'] ?? 0),
            'backups' => (int) ($config['backups'] ?? 0),
            'allocations' => 1,
        ];

        $gameServerAccount->update(['hosting_server_id' => $server->id]);

        try {
            $ptero = app(PterodactylClient::class);
            $ptero->setServer($server);
            $ptero->createAccount($params);
            $created = $ptero->getLastCreatedServerData();
            $gameServerAccount->update([
                'pterodactyl_server_id' => $created['pterodactyl_server_id'] ?? null,
                'pterodactyl_user_id' => $created['pterodactyl_user_id'] ?? null,
                'identifier' => $created['identifier'] ?? null,
                'credentials_encrypted' => Crypt::encryptString(json_encode([
                    'email' => $user->email,
                    'password' => $password,
                ])),
                'status' => 'active',
            ]);
            Log::info('Admin retry provisioning: Pterodactyl server created', ['account_id' => $gameServerAccount->id]);

            return redirect()->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('success', 'Installation wurde erfolgreich ausgeführt. Der Game-Server ist jetzt aktiv.');
        } catch (\Throwable $e) {
            Log::error('Admin retry provisioning: Pterodactyl createAccount exception', [
                'account_id' => $gameServerAccount->id,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Installation fehlgeschlagen: '.$e->getMessage());
        }
    }
}
