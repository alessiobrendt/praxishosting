<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGameServerAccountRequest;
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
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

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

    public function cloudIndex(Request $request): Response
    {
        $this->authorize('viewAny', GameServerAccount::class);

        $currentBrand = $this->currentBrand($request);
        $features = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($features['gameserver_cloud'] ?? false)) {
            return Inertia::render('admin/gameserver-cloud-accounts/Index', [
                'gameServerAccounts' => [
                    'data' => [],
                    'links' => [],
                ],
                'brandHasGameserverCloud' => false,
            ]);
        }

        $query = GameServerAccount::query()
            ->with(['user', 'hostingServer', 'gameserverCloudSubscription.gameserverCloudPlan'])
            ->whereNotNull('gameserver_cloud_subscription_id')
            ->whereHas('gameserverCloudSubscription.gameserverCloudPlan', fn ($q) => $q->where('brand_id', $currentBrand->id))
            ->latest();

        $accounts = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/gameserver-cloud-accounts/Index', [
            'gameServerAccounts' => $accounts,
            'brandHasGameserverCloud' => true,
        ]);
    }

    public function show(Request $request, GameServerAccount $gameServerAccount): Response
    {
        $this->authorize('view', $gameServerAccount);

        $currentBrand = $this->currentBrand($request);
        $isCloud = $gameServerAccount->gameserver_cloud_subscription_id !== null;
        if ($currentBrand !== null) {
            if ($isCloud) {
                $sub = $gameServerAccount->gameserverCloudSubscription;
                if (! $sub || ! $sub->gameserverCloudPlan || $sub->gameserverCloudPlan->brand_id !== $currentBrand->id) {
                    abort(404);
                }
            } else {
                if (! $gameServerAccount->hostingPlan || $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
                    abort(404);
                }
            }
        }

        $gameServerAccount->load(['user', 'hostingPlan', 'hostingServer', 'product', 'gameserverCloudSubscription.gameserverCloudPlan']);

        $panelUrl = $gameServerAccount->hostingServer?->config['base_uri'] ?? $gameServerAccount->hostingServer?->config['host'] ?? '';
        $loginUrl = $panelUrl && $gameServerAccount->identifier
            ? rtrim($panelUrl, '/').'/server/'.$gameServerAccount->identifier
            : null;

        $payload = $gameServerAccount->toArray();
        $payload['monthly_amount'] = $gameServerAccount->getMonthlyRenewalAmount();

        return Inertia::render('admin/gaming-accounts/Show', [
            'gameServerAccount' => $payload,
            'loginUrl' => $loginUrl,
        ]);
    }

    /**
     * Cancel Mollie subscription at period end (admin).
     */
    public function cancelSubscription(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $this->authorize('update', $gameServerAccount);

        if ($gameServerAccount->isCloudAccount()) {
            return redirect()->back()->with('error', 'Cloud-Server werden über das Cloud-Abo verwaltet.');
        }

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        if (! $gameServerAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem Game-Server verknüpft.');
        }

        $user = $gameServerAccount->user;
        if (! $user || ! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $gameServerAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden: '.$e->getMessage());
        }

        $gameServerAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'Game-Server-Abo wurde zum Periodenende gekündigt.');
    }

    public function edit(Request $request, GameServerAccount $gameServerAccount): Response|RedirectResponse
    {
        $this->authorize('update', $gameServerAccount);

        $currentBrand = $this->currentBrand($request);

        if ($gameServerAccount->isCloudAccount()) {
            $gameServerAccount->load(['user', 'hostingServer', 'gameserverCloudSubscription.gameserverCloudPlan']);
            $plan = $gameServerAccount->gameserverCloudSubscription?->gameserverCloudPlan;
            if ($currentBrand !== null && $plan && $plan->brand_id !== $currentBrand->id) {
                abort(404);
            }
            $planConfig = $plan->config ?? [];
            $allocation = $gameServerAccount->allocation ?? [];
            $optionValues = array_merge(
                $gameServerAccount->option_values ?? [],
                [
                    'memory' => (int) ($allocation['memory_mb'] ?? 0),
                    'disk' => (int) ($allocation['disk_mb'] ?? 0),
                    'cpu' => (int) ($allocation['cpu'] ?? 0),
                    'swap' => (int) ($gameServerAccount->option_values['swap'] ?? 0),
                    'io' => (int) ($gameServerAccount->option_values['io'] ?? 500),
                    'databases' => (int) ($gameServerAccount->option_values['databases'] ?? 0),
                    'backups' => (int) ($gameServerAccount->option_values['backups'] ?? 0),
                ]
            );
            $hostingPlanConfig = [
                'memory' => (int) ($planConfig['max_memory_mb'] ?? 0),
                'disk' => (int) (($planConfig['max_disk_gb'] ?? 0) * 1024),
                'cpu' => (int) ($planConfig['max_cpu'] ?? 0),
                'swap' => 0,
                'io' => 500,
                'databases' => 0,
                'backups' => 0,
            ];
            $accountData = $gameServerAccount->toArray();
            $accountData['option_values'] = $optionValues;
            $accountData['hosting_plan'] = $plan ? ['id' => $plan->id, 'name' => $plan->name] : null;

            return Inertia::render('admin/gaming-accounts/Edit', [
                'gameServerAccount' => $accountData,
                'hostingPlanConfig' => $hostingPlanConfig,
                'isCloudAccount' => true,
            ]);
        }

        if ($currentBrand !== null && $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $gameServerAccount->load(['user', 'hostingPlan', 'hostingServer', 'product']);

        return Inertia::render('admin/gaming-accounts/Edit', [
            'gameServerAccount' => $gameServerAccount,
            'hostingPlanConfig' => $gameServerAccount->hostingPlan->config ?? [],
            'isCloudAccount' => false,
        ]);
    }

    public function update(UpdateGameServerAccountRequest $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $currentBrand = $this->currentBrand($request);

        if ($gameServerAccount->isCloudAccount()) {
            $gameServerAccount->load(['hostingServer', 'gameserverCloudSubscription.gameserverCloudPlan']);
            if ($currentBrand !== null && $gameServerAccount->gameserverCloudSubscription?->gameserverCloudPlan?->brand_id !== $currentBrand->id) {
                abort(404);
            }
            $data = $request->validated();
            $optionValues = array_merge(
                $gameServerAccount->option_values ?? [],
                $data['option_values'] ?? []
            );
            $memoryMb = (int) ($optionValues['memory'] ?? 0);
            $diskMb = (int) ($optionValues['disk'] ?? 0);
            $cpu = (int) ($optionValues['cpu'] ?? 0);
            $allocation = $gameServerAccount->allocation ?? [];
            $allocation['memory_mb'] = $memoryMb;
            $allocation['disk_mb'] = $diskMb;
            $allocation['cpu'] = $cpu;
            $gameServerAccount->update([
                'name' => $data['name'],
                'status' => $data['status'],
                'option_values' => $optionValues,
                'allocation' => $allocation,
            ]);

            if ($gameServerAccount->pterodactyl_server_id && $gameServerAccount->hostingServer) {
                $params = [
                    'memory' => $memoryMb,
                    'disk' => $diskMb,
                    'swap' => (int) ($optionValues['swap'] ?? 0),
                    'io' => (int) ($optionValues['io'] ?? 500),
                    'cpu' => $cpu,
                    'databases' => (int) ($optionValues['databases'] ?? 0),
                    'backups' => (int) ($optionValues['backups'] ?? 0),
                ];
                try {
                    $ptero = app(PterodactylClient::class);
                    $ptero->setServer($gameServerAccount->hostingServer);
                    $ptero->updateServerBuild($gameServerAccount->pterodactyl_server_id, $params);
                } catch (\Throwable $e) {
                    Log::warning('Admin gaming update: Pterodactyl sync failed (cloud)', [
                        'account_id' => $gameServerAccount->id,
                        'message' => $e->getMessage(),
                    ]);

                    return redirect()
                        ->route('admin.gaming-accounts.show', $gameServerAccount)
                        ->with('warning', 'Account gespeichert, aber Pterodactyl-Limits konnten nicht aktualisiert werden: '.$e->getMessage());
                }
            }

            return redirect()
                ->route('admin.gaming-accounts.show', $gameServerAccount)
                ->with('success', 'Game-Server-Account aktualisiert.');
        }

        if ($currentBrand !== null && $gameServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $data = $request->validated();
        $optionValues = array_merge(
            $gameServerAccount->option_values ?? [],
            $data['option_values'] ?? []
        );
        $update = [
            'name' => $data['name'],
            'status' => $data['status'],
            'option_values' => $optionValues,
            'current_period_ends_at' => ! empty($data['current_period_ends_at']) ? $data['current_period_ends_at'] : null,
            'custom_monthly_price' => isset($data['custom_monthly_price']) && $data['custom_monthly_price'] !== '' && $data['custom_monthly_price'] !== null ? (float) $data['custom_monthly_price'] : null,
        ];

        $gameServerAccount->update($update);

        if ($gameServerAccount->pterodactyl_server_id && $gameServerAccount->hostingServer) {
            $plan = $gameServerAccount->hostingPlan;
            $config = $plan->config ?? [];
            $params = [
                'memory' => (int) ($optionValues['memory'] ?? $config['memory'] ?? 512),
                'disk' => (int) ($optionValues['disk'] ?? $config['disk'] ?? 5120),
                'swap' => (int) ($optionValues['swap'] ?? $config['swap'] ?? 0),
                'io' => (int) ($optionValues['io'] ?? $config['io'] ?? 500),
                'cpu' => (int) ($optionValues['cpu'] ?? $config['cpu'] ?? 0),
                'databases' => (int) ($optionValues['databases'] ?? $config['databases'] ?? 0),
                'backups' => (int) ($optionValues['backups'] ?? $config['backups'] ?? 0),
            ];
            try {
                $ptero = app(PterodactylClient::class);
                $ptero->setServer($gameServerAccount->hostingServer);
                $ptero->updateServerBuild($gameServerAccount->pterodactyl_server_id, $params);
            } catch (\Throwable $e) {
                Log::warning('Admin gaming update: Pterodactyl sync failed', [
                    'account_id' => $gameServerAccount->id,
                    'message' => $e->getMessage(),
                ]);

                return redirect()
                    ->route('admin.gaming-accounts.show', $gameServerAccount)
                    ->with('warning', 'Account gespeichert, aber Pterodactyl-Limits konnten nicht aktualisiert werden: '.$e->getMessage());
            }
        }

        return redirect()
            ->route('admin.gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Game-Server-Account aktualisiert.');
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
        $locationIds = $config['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $portRange = $config['port_range'] ?? [];
        if (! is_array($portRange)) {
            $portRange = $portRange ? [$portRange] : [];
        }
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
            'swap' => (int) ($config['swap'] ?? 0),
            'io' => (int) ($config['io'] ?? 500),
            'cpu' => (int) ($config['cpu'] ?? 0),
            'databases' => (int) ($config['databases'] ?? 0),
            'backups' => (int) ($config['backups'] ?? 0),
            'allocations' => 1 + (int) ($config['additional_allocations'] ?? 0),
            'location_ids' => $locationIds,
            'node' => isset($config['node']) ? (int) $config['node'] : null,
            'dedicated_ip' => (bool) ($config['dedicated_ip'] ?? false),
            'port_range' => $portRange,
            'start_on_completion' => ($config['start_on_completion'] ?? true),
            'skip_scripts' => (bool) ($config['skip_scripts'] ?? false),
            'oom_killer' => (bool) ($config['oom_killer'] ?? false),
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
