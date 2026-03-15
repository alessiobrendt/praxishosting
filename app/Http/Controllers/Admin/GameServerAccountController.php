<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCloudServerResourcesRequest as AdminUpdateCloudServerResourcesRequest;
use App\Http\Requests\Admin\UpdateCloudSubscriptionPeriodAndStatusRequest;
use App\Http\Requests\Admin\UpdateGameServerAccountRequest;
use App\Http\Requests\Admin\UpdateGameserverCloudSubscriptionRequest;
use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\GameserverCloudPlan;
use App\Models\GameserverCloudSubscription;
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
                'subscriptions' => [
                    'data' => [],
                    'links' => [],
                ],
                'brandHasGameserverCloud' => false,
            ]);
        }

        $query = GameserverCloudSubscription::query()
            ->with(['user', 'gameserverCloudPlan', 'gameServerAccounts'])
            ->whereHas('gameserverCloudPlan', fn ($q) => $q->where('brand_id', $currentBrand->id))
            ->latest();

        $subscriptions = $query->paginate(15)->withQueryString()->through(function (GameserverCloudSubscription $sub) {
            $plan = $sub->gameserverCloudPlan;
            $config = $plan->config ?? [];

            return [
                'id' => $sub->id,
                'uuid' => $sub->uuid,
                'user' => $sub->user ? [
                    'id' => $sub->user->id,
                    'name' => $sub->user->name,
                    'email' => $sub->user->email,
                ] : null,
                'gameserver_cloud_plan' => [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'config' => $config,
                ],
                'status' => $sub->status,
                'current_period_ends_at' => $sub->current_period_ends_at?->toIso8601String(),
                'used_cpu' => $sub->getUsedCpu(),
                'used_memory_mb' => $sub->getUsedMemoryMb(),
                'used_disk_mb' => $sub->getUsedDiskMb(),
                'remaining_cpu' => $sub->getRemainingCpu(),
                'remaining_memory_mb' => $sub->getRemainingMemoryMb(),
                'remaining_disk_mb' => $sub->getRemainingDiskMb(),
                'max_cpu' => (int) ($config['max_cpu'] ?? 0),
                'max_memory_mb' => (int) ($config['max_memory_mb'] ?? 0),
                'max_disk_gb' => (int) ($config['max_disk_gb'] ?? 0),
                'servers_count' => $sub->gameServerAccounts->count(),
            ];
        });

        return Inertia::render('admin/gameserver-cloud-accounts/Index', [
            'subscriptions' => $subscriptions,
            'brandHasGameserverCloud' => true,
        ]);
    }

    public function cloudShow(Request $request, GameserverCloudSubscription $subscription): Response
    {
        $this->authorize('viewAny', GameServerAccount::class);

        $currentBrand = $this->currentBrand($request);
        $features = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($features['gameserver_cloud'] ?? false)) {
            abort(404);
        }

        if ($subscription->gameserverCloudPlan === null || $subscription->gameserverCloudPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $subscription->load(['user', 'gameserverCloudPlan', 'gameServerAccounts.hostingServer']);

        $plan = $subscription->gameserverCloudPlan;
        $config = $plan->config ?? [];

        $gameserverCloudPlans = GameserverCloudPlan::query()
            ->where('brand_id', $currentBrand->id)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (GameserverCloudPlan $p) => ['id' => $p->id, 'name' => $p->name])
            ->values()
            ->all();

        $subscriptionPayload = [
            'id' => $subscription->id,
            'uuid' => $subscription->uuid,
            'user' => $subscription->user ? [
                'id' => $subscription->user->id,
                'name' => $subscription->user->name,
                'email' => $subscription->user->email,
            ] : null,
            'gameserver_cloud_plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'config' => $config,
            ],
            'plan_display_user_defined' => (bool) $subscription->plan_display_user_defined,
            'status' => $subscription->status,
            'current_period_ends_at' => $subscription->current_period_ends_at?->toIso8601String(),
            'cancel_at_period_end' => (bool) $subscription->cancel_at_period_end,
            'used_cpu' => $subscription->getUsedCpu(),
            'used_memory_mb' => $subscription->getUsedMemoryMb(),
            'used_disk_mb' => $subscription->getUsedDiskMb(),
            'remaining_cpu' => $subscription->getRemainingCpu(),
            'remaining_memory_mb' => $subscription->getRemainingMemoryMb(),
            'remaining_disk_mb' => $subscription->getRemainingDiskMb(),
            'max_cpu' => $subscription->getEffectiveMaxCpu(),
            'max_memory_mb' => $subscription->getEffectiveMaxMemoryMb(),
            'max_disk_gb' => (int) ($subscription->getEffectiveMaxDiskMb() / 1024),
            'custom_max_cpu' => $subscription->custom_max_cpu,
            'custom_max_memory_mb' => $subscription->custom_max_memory_mb,
            'custom_max_disk_gb' => $subscription->custom_max_disk_gb,
            'custom_price' => $subscription->custom_price !== null ? (string) $subscription->custom_price : null,
            'display_price' => $subscription->getDisplayPrice() !== null ? (string) round($subscription->getDisplayPrice(), 2) : null,
        ];

        $gameServerAccounts = $subscription->gameServerAccounts->map(function (GameServerAccount $acc) {
            $allocation = is_array($acc->allocation) ? $acc->allocation : [];

            return [
                'id' => $acc->id,
                'uuid' => $acc->uuid,
                'name' => $acc->name,
                'identifier' => $acc->identifier,
                'status' => $acc->status,
                'allocation_manually_set' => (bool) $acc->allocation_manually_set,
                'allocation' => [
                    'cpu' => (int) ($allocation['cpu'] ?? 0),
                    'memory_mb' => (int) ($allocation['memory_mb'] ?? 0),
                    'disk_mb' => (int) ($allocation['disk_mb'] ?? 0),
                ],
            ];
        })->values()->all();

        return Inertia::render('admin/gameserver-cloud-accounts/Show', [
            'subscription' => $subscriptionPayload,
            'gameServerAccounts' => $gameServerAccounts,
            'gameserverCloudPlans' => $gameserverCloudPlans,
        ]);
    }

    public function cloudUpdate(UpdateGameserverCloudSubscriptionRequest $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        $currentBrand = $this->currentBrand($request);
        if ($subscription->gameserverCloudPlan === null || $subscription->gameserverCloudPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $planDisplayUserDefined = $request->boolean('plan_display_user_defined');

        $data = ['plan_display_user_defined' => $planDisplayUserDefined];
        if ($planDisplayUserDefined) {
            $data['custom_max_cpu'] = $request->input('custom_max_cpu') !== null && $request->input('custom_max_cpu') !== ''
                ? (int) $request->input('custom_max_cpu')
                : null;
            $data['custom_max_memory_mb'] = $request->input('custom_max_memory_mb') !== null && $request->input('custom_max_memory_mb') !== ''
                ? (int) $request->input('custom_max_memory_mb')
                : null;
            $data['custom_max_disk_gb'] = $request->input('custom_max_disk_gb') !== null && $request->input('custom_max_disk_gb') !== ''
                ? (int) $request->input('custom_max_disk_gb')
                : null;
            $data['custom_price'] = $request->input('custom_price') !== null && $request->input('custom_price') !== ''
                ? (float) $request->input('custom_price')
                : null;
        } else {
            $data['gameserver_cloud_plan_id'] = $request->validated('gameserver_cloud_plan_id');
            $data['custom_max_cpu'] = null;
            $data['custom_max_memory_mb'] = null;
            $data['custom_max_disk_gb'] = null;
            $data['custom_price'] = null;
        }

        $subscription->update($data);

        $message = $planDisplayUserDefined
            ? 'Benutzer definiert (Ressourcen und Preis) gespeichert.'
            : 'Der Cloud-Plan wurde geändert.';

        return redirect()->route('admin.gameserver-cloud-accounts.show', $subscription)
            ->with('success', $message);
    }

    public function cloudUpdatePeriodAndStatus(
        UpdateCloudSubscriptionPeriodAndStatusRequest $request,
        GameserverCloudSubscription $subscription
    ): RedirectResponse {
        $currentBrand = $this->currentBrand($request);
        if ($subscription->gameserverCloudPlan === null || $subscription->gameserverCloudPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $data = [];
        if ($request->has('current_period_ends_at')) {
            $data['current_period_ends_at'] = $request->date('current_period_ends_at');
        }
        if ($request->has('status')) {
            $data['status'] = $request->string('status')->toString();
        }
        if ($request->has('cancel_at_period_end')) {
            $data['cancel_at_period_end'] = $request->boolean('cancel_at_period_end');
        }

        if ($data !== []) {
            $subscription->update($data);
        }

        return redirect()->route('admin.gameserver-cloud-accounts.show', $subscription)
            ->with('success', 'Laufzeit und Status wurden gespeichert.');
    }

    public function cloudUpdateServerResources(
        AdminUpdateCloudServerResourcesRequest $request,
        GameserverCloudSubscription $subscription,
        GameServerAccount $gameServerAccount
    ): RedirectResponse {
        $currentBrand = $this->currentBrand($request);
        if ($subscription->gameserverCloudPlan === null || $subscription->gameserverCloudPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }
        if ($gameServerAccount->gameserver_cloud_subscription_id !== $subscription->id) {
            abort(404);
        }

        if (! $gameServerAccount->hostingServer || ! $gameServerAccount->pterodactyl_server_id) {
            return redirect()->back()
                ->with('error', 'Der Server ist noch nicht bereit oder wurde nicht gefunden.');
        }

        $plan = $subscription->gameserverCloudPlan;
        $config = $plan->config ?? [];
        $cpu = (int) $request->validated('cpu');
        $memoryMb = (int) $request->validated('memory_mb');
        $diskMb = (int) $request->validated('disk_mb');

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($gameServerAccount->hostingServer);
            $client->updateServerBuild($gameServerAccount->pterodactyl_server_id, [
                'memory' => $memoryMb,
                'disk' => $diskMb,
                'cpu' => $cpu,
                'swap' => 0,
                'io' => (int) ($config['io'] ?? 500),
                'databases' => 0,
                'backups' => 0,
                'allocations' => 1,
            ]);
        } catch (\Throwable $e) {
            Log::error('Admin cloud server update resources: Pterodactyl failed', [
                'game_server_account_id' => $gameServerAccount->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()
                ->with('error', 'Ressourcen konnten nicht aktualisiert werden: '.$e->getMessage())
                ->withInput();
        }

        $allocation = is_array($gameServerAccount->allocation) ? $gameServerAccount->allocation : [];
        $gameServerAccount->update([
            'allocation' => array_merge($allocation, [
                'cpu' => $cpu,
                'memory_mb' => $memoryMb,
                'disk_mb' => $diskMb,
            ]),
            'allocation_manually_set' => true,
        ]);

        return redirect()->back()
            ->with('success', 'Ressourcen wurden angepasst. Plan wird als „Benutzer definiert“ angezeigt.');
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
