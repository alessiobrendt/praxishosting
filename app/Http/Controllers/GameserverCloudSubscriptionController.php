<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Requests\StoreCloudServerRequest;
use App\Http\Requests\UpdateCloudServerResourcesRequest;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\GameServerAccount;
use App\Models\GameserverCloudSubscription;
use App\Models\PterodactylEggConfig;
use App\Services\BalancePaymentService;
use App\Services\CloudflareDnsService;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\MollieCustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

class GameserverCloudSubscriptionController extends Controller
{
    use \App\Http\Controllers\Concerns\RedirectsToMollieSubscriptionFirstPayment;

    protected function ensureGameserverCloudFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];
        if (! ($features['gameserver_cloud'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'Gameserver Cloud wird für diese Marke nicht angeboten.');
        }

        return null;
    }

    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $subscriptions = $request->user()
            ->gameserverCloudSubscriptions()
            ->with('gameserverCloudPlan')
            ->latest()
            ->get()
            ->map(function (GameserverCloudSubscription $sub) {
                $plan = $sub->gameserverCloudPlan;
                $config = $plan->config ?? [];

                return [
                    'id' => $sub->id,
                    'status' => $sub->status,
                    'current_period_ends_at' => $sub->current_period_ends_at?->toIso8601String(),
                    'plan' => [
                        'id' => $plan->id,
                        'name' => $plan->name,
                        'price' => (string) $plan->price,
                        'config' => $config,
                    ],
                    'used_cpu' => $sub->getUsedCpu(),
                    'used_memory_mb' => $sub->getUsedMemoryMb(),
                    'used_disk_mb' => $sub->getUsedDiskMb(),
                    'remaining_cpu' => $sub->getRemainingCpu(),
                    'remaining_memory_mb' => $sub->getRemainingMemoryMb(),
                    'remaining_disk_mb' => $sub->getRemainingDiskMb(),
                ];
            });

        return Inertia::render('gaming/cloud/SubscriptionsIndex', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function show(Request $request, GameserverCloudSubscription $subscription): Response|RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        $subscription->load('gameserverCloudPlan.hostingServer', 'gameServerAccounts');

        $plan = $subscription->gameserverCloudPlan;
        $config = $plan->config ?? [];
        $nests = [];
        $hostingServer = $plan->hostingServer;
        if ($hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $client->setServer($hostingServer);
                $nestsRaw = $client->getNests();
                foreach ($nestsRaw as $n) {
                    $attrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
                    $nestId = (int) ($attrs['id'] ?? 0);
                    $nestName = (string) ($attrs['name'] ?? 'Nest '.$nestId);
                    if ($nestId < 1) {
                        continue;
                    }
                    $eggs = [];
                    try {
                        $eggsRaw = $client->getEggs($nestId);
                        foreach ($eggsRaw as $e) {
                            $eAttrs = is_array($e) ? ($e['attributes'] ?? $e) : (array) $e;
                            $eggId = (int) ($eAttrs['id'] ?? 0);
                            $eggName = (string) ($eAttrs['name'] ?? 'Egg '.$eggId);
                            if ($eggId > 0) {
                                $eggs[] = ['id' => $eggId, 'name' => $eggName];
                            }
                        }
                    } catch (\Throwable $e) {
                        Log::warning('GameserverCloudSubscription show: could not load eggs for nest', ['nest_id' => $nestId, 'error' => $e->getMessage()]);
                    }
                    $nests[] = ['id' => $nestId, 'name' => $nestName, 'eggs' => $eggs];
                }
            } catch (\Throwable $e) {
                Log::warning('GameserverCloudSubscription show: could not load nests', ['subscription_id' => $subscription->id, 'error' => $e->getMessage()]);
            }
        }

        $maxCpu = (int) ($config['max_cpu'] ?? 0);
        $maxMemoryMb = (int) ($config['max_memory_mb'] ?? 0);
        $maxDiskGb = (int) ($config['max_disk_gb'] ?? 0);
        $totalCpu = $subscription->getUsedCpu() + $subscription->getRemainingCpu();
        $totalMemoryMb = $subscription->getUsedMemoryMb() + $subscription->getRemainingMemoryMb();
        $totalDiskMb = $subscription->getUsedDiskMb() + $subscription->getRemainingDiskMb();

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance) {
            $balance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        return Inertia::render('gaming/cloud/SubscriptionShow', [
            'subscription' => [
                'id' => $subscription->id,
                'status' => $subscription->status,
                'current_period_ends_at' => $subscription->current_period_ends_at?->toIso8601String(),
                'created_at' => $subscription->created_at?->toIso8601String(),
                'plan' => [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => (string) $plan->price,
                    'config' => $config,
                ],
                'nests' => $nests,
                'used_cpu' => $subscription->getUsedCpu(),
                'used_memory_mb' => $subscription->getUsedMemoryMb(),
                'used_disk_mb' => $subscription->getUsedDiskMb(),
                'remaining_cpu' => $subscription->getRemainingCpu(),
                'remaining_memory_mb' => $subscription->getRemainingMemoryMb(),
                'remaining_disk_mb' => $subscription->getRemainingDiskMb(),
                'max_cpu' => $maxCpu,
                'max_memory_mb' => $maxMemoryMb,
                'max_disk_gb' => $maxDiskGb,
                'total_cpu' => $totalCpu,
                'total_memory_mb' => $totalMemoryMb,
                'total_disk_mb' => $totalDiskMb,
                'game_server_accounts' => $this->mapGameServerAccountsForShow($subscription->gameServerAccounts, $nests),
            ],
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'renewUrl' => route('gaming.cloud.subscriptions.renew', $subscription),
            'auto_renew_with_balance' => (bool) ($subscription->auto_renew_with_balance ?? false),
            'has_mollie_subscription' => ! empty($subscription->mollie_subscription_id),
            'balanceUrl' => route('gaming.cloud.subscriptions.auto-renew-balance', $subscription),
            'mollieUrl' => route('gaming.cloud.subscriptions.auto-renew-mollie-subscription', $subscription),
            'domainsSearchUrl' => route('domains.search'),
        ]);
    }

    /**
     * Return egg variables for the selected nest/egg (for dynamic create-server form).
     * Includes default_value (from egg config or egg) and required_from_user from PterodactylEggConfig.
     */
    public function eggVariables(Request $request, GameserverCloudSubscription $subscription): JsonResponse
    {
        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        $nestId = $request->integer('nest_id');
        $eggId = $request->integer('egg_id');
        if ($nestId < 1 || $eggId < 1) {
            return response()->json(['variables' => []]);
        }

        $plan = $subscription->gameserverCloudPlan;
        $server = $plan->hostingServer;
        if (! $server) {
            return response()->json(['variables' => []]);
        }

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($server);
            $eggData = $client->getEggWithVariables($nestId, $eggId);
        } catch (\Throwable $e) {
            Log::warning('eggVariables: failed to fetch egg', ['error' => $e->getMessage()]);

            return response()->json(['variables' => []]);
        }

        $eggConfig = PterodactylEggConfig::query()
            ->where('hosting_server_id', $server->id)
            ->where('nest_id', $nestId)
            ->where('egg_id', $eggId)
            ->first();

        $config = $eggConfig?->config ?? [];
        $variableDefaults = $config['variable_defaults'] ?? [];
        $requiredEnvVariables = array_flip($config['required_env_variables'] ?? []);

        $variablesData = $eggData['attributes']['relationships']['variables']['data']
            ?? $eggData['relationships']['variables']['data']
            ?? [];
        $variables = [];
        foreach ($variablesData as $v) {
            $va = $v['attributes'] ?? $v;
            $envVar = (string) ($va['env_variable'] ?? '');
            if ($envVar === '') {
                continue;
            }
            $defaultValue = $variableDefaults[$envVar] ?? $va['default_value'] ?? '';
            $variables[] = [
                'id' => (int) ($va['id'] ?? 0),
                'name' => (string) ($va['name'] ?? ''),
                'env_variable' => $envVar,
                'default_value' => $defaultValue,
                'rules' => (string) ($va['rules'] ?? ''),
                'user_viewable' => (bool) ($va['user_viewable'] ?? true),
                'user_editable' => (bool) ($va['user_editable'] ?? true),
                'required_from_user' => isset($requiredEnvVariables[$envVar]),
            ];
        }

        return response()->json(['variables' => $variables]);
    }

    public function storeServer(StoreCloudServerRequest $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        if ($subscription->status !== 'active' && ! $subscription->current_period_ends_at?->isFuture()) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Das Abo ist nicht aktiv. Bitte verlängern Sie zuerst.');
        }

        $plan = $subscription->gameserverCloudPlan;
        $config = $plan->config ?? [];
        $remainingCpu = $subscription->getRemainingCpu();
        $remainingMemoryMb = $subscription->getRemainingMemoryMb();
        $remainingDiskMb = $subscription->getRemainingDiskMb();

        $cpu = (int) $request->input('cpu');
        $memoryMb = (int) $request->input('memory_mb');
        $diskMb = (int) $request->input('disk_mb');

        if ($cpu > $remainingCpu || $memoryMb > $remainingMemoryMb || $diskMb > $remainingDiskMb) {
            Log::info('Cloud server create: resources exceed quota', [
                'subscription_id' => $subscription->id,
                'requested' => ['cpu' => $cpu, 'memory_mb' => $memoryMb, 'disk_mb' => $diskMb],
                'remaining' => ['cpu' => $remainingCpu, 'memory_mb' => $remainingMemoryMb, 'disk_mb' => $remainingDiskMb],
            ]);

            $hint = [];
            if ($remainingCpu <= 0) {
                $hint[] = 'CPU-Kontingent ist aufgebraucht oder im Plan nicht gesetzt (Admin: Gameserver-Cloud-Pläne → Plan bearbeiten → config: max_cpu).';
            }
            if ($remainingDiskMb <= 0) {
                $hint[] = 'Disk-Kontingent ist aufgebraucht oder im Plan nicht gesetzt (Admin: config: max_disk_gb).';
            }
            if ($remainingMemoryMb < $memoryMb) {
                $hint[] = 'Nicht genug freies RAM.';
            }
            $message = 'Die gewählten Ressourcen übersteigen das verfügbare Kontingent.';
            if (count($hint) > 0) {
                $message .= ' '.implode(' ', $hint);
            }

            return redirect()->back()
                ->withErrors(['allocation' => $message])
                ->withInput();
        }

        $server = $plan->hostingServer;
        if (! $server) {
            Log::warning('Cloud server create: no hosting server for plan', [
                'subscription_id' => $subscription->id,
                'plan_id' => $plan->id,
            ]);

            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Für diesen Plan ist kein Pterodactyl-Server konfiguriert.');
        }

        Log::info('Cloud server create: start', [
            'subscription_id' => $subscription->id,
            'plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'user_id' => $request->user()?->id,
        ]);

        $user = $request->user();
        $name = $request->input('name') ? trim($request->input('name')) : null;
        $nestId = (int) $request->input('nest_id') ?: (int) ($config['nest_id'] ?? 1);
        $eggId = (int) $request->input('egg_id');
        if ($nestId < 1) {
            $nestId = 1;
        }
        if ($eggId < 1) {
            $eggId = (int) ($config['egg_id'] ?? 1);
        }
        $environment = $request->input('environment');
        if (! is_array($environment)) {
            $environment = [];
        }

        $eggConfig = PterodactylEggConfig::query()
            ->where('hosting_server_id', $server->id)
            ->where('nest_id', $nestId)
            ->where('egg_id', $eggId)
            ->first();
        $eggConfigData = $eggConfig?->config ?? [];
        $requiredEnvVars = $eggConfigData['required_env_variables'] ?? [];
        if (is_array($requiredEnvVars) && count($requiredEnvVars) > 0) {
            foreach ($requiredEnvVars as $key) {
                $key = (string) $key;
                $val = $environment[$key] ?? null;
                if ($val === null || trim((string) $val) === '') {
                    Log::info('Cloud server create: validation failed (required env)', [
                        'subscription_id' => $subscription->id,
                        'missing_key' => $key,
                    ]);

                    return redirect()->back()
                        ->withErrors(['environment.'.$key => 'Dieses Feld ist erforderlich.'])
                        ->withInput();
                }
            }
        }

        $customSubdomain = $request->input('custom_subdomain') ? trim((string) $request->input('custom_subdomain')) : null;
        $srvProtocol = (string) ($eggConfigData['subdomain_srv_protocol'] ?? '');
        $protocolType = (string) ($eggConfigData['subdomain_protocol_type'] ?? 'none');
        $cloudflareDnsForSrv = app(CloudflareDnsService::class);
        $willCreateSrv = $srvProtocol !== '' && $protocolType !== 'none' && $cloudflareDnsForSrv->isConfigured();

        $subdomainForDns = null;
        if ($willCreateSrv) {
            if ($customSubdomain !== null && $customSubdomain !== '') {
                $subdomainForDns = $customSubdomain;
                $srvName = $cloudflareDnsForSrv->buildSrvRecordName($subdomainForDns, $srvProtocol, $protocolType);
                if ($srvName !== '' && $cloudflareDnsForSrv->srvRecordExists($srvName)) {
                    Log::info('Cloud server create: subdomain already taken', [
                        'subscription_id' => $subscription->id,
                        'srv_name' => $srvName,
                    ]);

                    return redirect()->back()
                        ->with('error', 'Diese Subdomain ist bereits vergeben.')
                        ->withInput();
                }
            }
        }

        $locationIds = $config['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $portRange = $config['port_range'] ?? [];
        if (! is_array($portRange)) {
            $portRange = $portRange ? [$portRange] : [];
        }

        $serverName = $name ?: 'Server '.Str::random(6);
        if ($willCreateSrv && $subdomainForDns === null) {
            $slug = strtolower((string) preg_replace('/[^a-z0-9-]/', '', Str::slug($serverName)));
            $subdomainForDns = ($slug !== '' ? $slug : 'server').'-'.Str::lower(Str::random(6));
        }
        Log::debug('Cloud server create: creating local account', [
            'server_name' => $serverName,
            'nest_id' => $nestId,
            'egg_id' => $eggId,
            'memory_mb' => $memoryMb,
            'cpu' => $cpu,
            'disk_mb' => $diskMb,
            'location_ids' => $locationIds,
        ]);

        $account = $user->gameServerAccounts()->create([
            'hosting_plan_id' => null,
            'gameserver_cloud_subscription_id' => $subscription->id,
            'hosting_server_id' => $server->id,
            'name' => $serverName,
            'status' => 'pending',
            'allocation' => [
                'cpu' => $cpu,
                'memory_mb' => $memoryMb,
                'disk_mb' => $diskMb,
                'nest_id' => $nestId,
                'egg_id' => $eggId,
            ],
        ]);

        $password = Str::password(20);
        $params = [
            'email' => $user->email,
            'username' => str_replace([' ', '.'], '_', Str::lower($user->name)).'_'.Str::random(4),
            'first_name' => $user->name,
            'last_name' => '',
            'password' => $password,
            'server_name' => $serverName,
            'nest_id' => $nestId,
            'egg_id' => $eggId,
            'memory' => $memoryMb,
            'disk' => $diskMb,
            'swap' => 0,
            'io' => (int) ($config['io'] ?? 500),
            'cpu' => $cpu,
            'databases' => 0,
            'backups' => 0,
            'allocations' => 1,
            'location_ids' => $locationIds,
            'port_range' => $portRange,
            'start_on_completion' => true,
            'skip_scripts' => false,
            'environment' => $environment,
        ];

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($server);
            Log::info('Cloud server create: calling Pterodactyl createAccount', [
                'account_id' => $account->id,
                'hosting_server_id' => $server->id,
                'nest_id' => $nestId,
                'egg_id' => $eggId,
            ]);
            $client->createAccount($params);
            $created = $client->getLastCreatedServerData();
            Log::info('Cloud server create: Pterodactyl createAccount succeeded', [
                'account_id' => $account->id,
                'pterodactyl_server_id' => $created['pterodactyl_server_id'] ?? null,
                'identifier' => $created['identifier'] ?? null,
            ]);
            $allocation = [
                'cpu' => $cpu,
                'memory_mb' => $memoryMb,
                'disk_mb' => $diskMb,
                'nest_id' => $nestId,
                'egg_id' => $eggId,
            ];
            if ($subdomainForDns !== null && $subdomainForDns !== '') {
                $suffix = (string) ($config['subdomain_suffix'] ?? '.neroserv.cloud');
                $allocation['subdomain'] = strtolower($subdomainForDns).(str_starts_with($suffix, '.') ? $suffix : '.'.$suffix);
            }
            $account->update([
                'pterodactyl_server_id' => $created['pterodactyl_server_id'] ?? null,
                'pterodactyl_user_id' => $created['pterodactyl_user_id'] ?? null,
                'identifier' => $created['identifier'] ?? null,
                'credentials_encrypted' => Crypt::encryptString(json_encode([
                    'email' => $user->email,
                    'password' => $password,
                ])),
                'status' => 'active',
                'allocation' => $allocation,
            ]);
            Log::debug('Cloud server created', ['account_id' => $account->id]);

            if ($subdomainForDns !== null && $subdomainForDns !== '') {
                $protocolTypeForSrv = $protocolType === 'none' ? 'tcp' : $protocolType;
                $cloudflareDns = app(CloudflareDnsService::class);
                if ($srvProtocol !== '' && $cloudflareDns->isConfigured()) {
                    try {
                        $nodeAndPort = $client->getNodeFqdnAndPortForServer((int) $created['pterodactyl_server_id']);
                        if ($nodeAndPort !== null) {
                            $srvName = $cloudflareDns->buildSrvRecordName($subdomainForDns, $srvProtocol, $protocolTypeForSrv);
                            if ($srvName !== '') {
                                $cloudflareDns->createSrvRecord(
                                    $srvName,
                                    $nodeAndPort['node_fqdn'],
                                    $nodeAndPort['port']
                                );
                                $account->update([
                                    'allocation' => array_merge($account->allocation ?? [], ['srv_record_name' => $srvName]),
                                ]);
                            }
                        }
                    } catch (\Throwable $dnsEx) {
                        Log::warning('Cloud server: Cloudflare SRV create failed', [
                            'account_id' => $account->id,
                            'error' => $dnsEx->getMessage(),
                        ]);
                    }
                }
            }

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('success', 'Der Game-Server wurde angelegt.');
        } catch (\Throwable $e) {
            $account->delete();
            Log::error('Cloud server create failed', [
                'message' => $e->getMessage(),
                'exception' => $e::class,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Server konnte nicht angelegt werden: '.$e->getMessage())
                ->withInput();
        }
    }

    public function destroyServer(Request $request, GameserverCloudSubscription $subscription, GameServerAccount $gameServerAccount): RedirectResponse
    {
        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }
        if ($gameServerAccount->gameserver_cloud_subscription_id !== $subscription->id) {
            abort(404);
        }

        $srvRecordName = $gameServerAccount->allocation['srv_record_name'] ?? null;
        if ($gameServerAccount->hostingServer && $gameServerAccount->pterodactyl_server_id) {
            try {
                $client = app(PterodactylClient::class);
                $client->deleteServer($gameServerAccount);
            } catch (\Throwable $e) {
                Log::warning('Cloud server Pterodactyl delete failed', [
                    'game_server_account_id' => $gameServerAccount->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        if ($srvRecordName !== null && $srvRecordName !== '') {
            try {
                $cloudflare = app(CloudflareDnsService::class);
                if ($cloudflare->isConfigured()) {
                    $cloudflare->deleteSrvRecord((string) $srvRecordName);
                }
            } catch (\Throwable $e) {
                Log::warning('Cloud server: Cloudflare SRV delete failed', [
                    'game_server_account_id' => $gameServerAccount->id,
                    'srv_record_name' => $srvRecordName,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        $gameServerAccount->delete();

        return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
            ->with('success', 'Der Server wurde gelöscht.');
    }

    public function updateServerResources(
        UpdateCloudServerResourcesRequest $request,
        GameserverCloudSubscription $subscription,
        GameServerAccount $gameServerAccount
    ): RedirectResponse {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->status !== 'active' && ! $subscription->current_period_ends_at?->isFuture()) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Das Abo ist nicht aktiv. Bitte verlängern Sie zuerst.');
        }

        if (! $gameServerAccount->hostingServer || ! $gameServerAccount->pterodactyl_server_id) {
            return redirect()->back()
                ->with('error', 'Der Server ist noch nicht bereit oder wurde nicht gefunden.');
        }

        $plan = $subscription->gameserverCloudPlan;
        $config = $plan->config ?? [];
        $cpu = (int) $request->input('cpu');
        $memoryMb = (int) $request->input('memory_mb');
        $diskMb = (int) $request->input('disk_mb');

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
            Log::error('Cloud server update resources: Pterodactyl failed', [
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
        ]);

        return redirect()->back()
            ->with('success', 'Ressourcen wurden aktualisiert.');
    }

    public function renew(Request $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        $validated = $request->validate([
            'period_months' => ['required', 'integer', 'in:1,3,6,12'],
            'payment_method' => ['nullable', 'string', 'in:mollie,balance'],
        ]);

        $periodMonths = (int) $validated['period_months'];
        $plan = $subscription->gameserverCloudPlan;
        $amount = round((float) $plan->price * $periodMonths, 2);
        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $paymentMethod = $validated['payment_method'] ?? 'mollie';

        if ($paymentMethod === 'balance' && ($brandFeatures['prepaid_balance'] ?? false) && $amount > 0) {
            $user = $request->user();
            try {
                app(BalancePaymentService::class)->pay($user, $amount, 'gameserver_cloud_renewal', 'Gameserver Cloud Verlängerung: '.$plan->name, [
                    'description' => 'Cloud-Abo Verlängerung '.$plan->name.' – '.$periodMonths.' Monat(e)',
                ]);
            } catch (InsufficientBalanceException $e) {
                return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                    ->with('error', $e->getMessage());
            }

            $from = $subscription->current_period_ends_at && $subscription->current_period_ends_at->isFuture()
                ? $subscription->current_period_ends_at
                : now();
            $subscription->update([
                'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
                'status' => 'active',
            ]);
            foreach ($subscription->gameServerAccounts()->where('status', 'suspended')->get() as $account) {
                if ($account->hostingServer && $account->pterodactyl_server_id) {
                    try {
                        $client = app(PterodactylClient::class);
                        $client->unsuspendServer($account);
                    } catch (\Throwable) {
                        // continue
                    }
                }
                $account->update(['status' => 'active']);
            }

            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('success', 'Ihr Cloud-Abo wurde mit Guthaben verlängert.');
        }

        return app(CheckoutController::class)->buildCloudGamingRenewRedirect($request, $subscription, $periodMonths);
    }

    public function powerAll(Request $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        $action = $request->input('action', '');
        if (! in_array($action, ['start_all', 'stop_all'], true)) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Ungültige Aktion.');
        }

        $signal = $action === 'start_all' ? 'start' : 'stop';
        $client = app(PterodactylClient::class);
        $count = 0;
        foreach ($subscription->gameServerAccounts as $account) {
            if ($account->isSuspendedOrExpired() || ! $account->identifier) {
                continue;
            }
            try {
                $client->sendPowerAction($account, $signal);
                $count++;
            } catch (\Throwable $e) {
                Log::warning('powerAll: failed for account', ['account_id' => $account->id, 'error' => $e->getMessage()]);
            }
        }

        $message = $signal === 'start'
            ? ($count > 0 ? "{$count} Server werden gestartet." : 'Keine Server gestartet.')
            : ($count > 0 ? "{$count} Server werden gestoppt." : 'Keine Server gestoppt.');

        return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
            ->with('success', $message);
    }

    public function setAutoRenewWithBalance(Request $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['prepaid_balance'] ?? false)) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Auto Renew mit Guthaben ist für diese Marke nicht verfügbar.');
        }

        if ($subscription->status !== 'active' && $subscription->current_period_ends_at?->isPast()) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Dieses Abo kann nicht für Auto Renew mit Guthaben eingerichtet werden.');
        }

        $enabled = $request->boolean('enabled', true);
        $subscription->update(['auto_renew_with_balance' => $enabled]);

        $message = $enabled
            ? 'Auto Renew mit Guthaben wurde aktiviert. Am letzten Tag vor Ablauf wird automatisch verlängert, wenn genug Guthaben vorhanden ist.'
            : 'Auto Renew mit Guthaben wurde deaktiviert.';

        return redirect()
            ->route('gaming.cloud.subscriptions.show', $subscription->id)
            ->with('success', $message);
    }

    public function createMollieSubscription(Request $request, GameserverCloudSubscription $subscription): RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        if ($subscription->status !== 'active' && $subscription->current_period_ends_at?->isPast()) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Dieses Abo kann nicht für ein Mollie-Abo eingerichtet werden.');
        }

        if (! empty($subscription->mollie_subscription_id)) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('info', 'Für dieses Abo ist bereits ein Mollie-Abo eingerichtet.');
        }

        $user = $request->user();
        try {
            app(MollieCustomerService::class)->ensureCustomer($user);
            $user->refresh();
        } catch (MollieApiException $e) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Mollie-Kunde konnte nicht angelegt werden: '.$e->getMessage());
        }

        $plan = $subscription->gameserverCloudPlan;
        $amount = (float) $plan->price;
        if ($amount <= 0) {
            return redirect()
                ->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Kein gültiger Preis für diesen Plan.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $subscriptionParams = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'interval' => '1 month',
            'description' => 'Gameserver Cloud Abo: '.$plan->name,
        ];

        try {
            $mollieSubscription = app(MollieApiClient::class)->subscriptions->createForId(
                $user->mollie_customer_id,
                $subscriptionParams
            );
        } catch (MollieApiException $e) {
            return $this->redirectToMollieFirstPaymentForSubscription(
                $request,
                $user,
                $amount,
                $currency,
                'Gameserver Cloud Abo: '.$plan->name,
                'gameserver_cloud_subscription',
                $subscription->id,
                'gaming.cloud.subscriptions.show',
                [$subscription->id],
                'Dieses Abo kann nicht für ein Mollie-Abo eingerichtet werden.'
            );
        }

        $subscription->update([
            'mollie_subscription_id' => $mollieSubscription->id,
            'cancel_at_period_end' => false,
        ]);

        return redirect()
            ->route('gaming.cloud.subscriptions.show', $subscription->id)
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die Abbuchung erfolgt monatlich automatisch.');
    }

    public function powerServer(Request $request, GameserverCloudSubscription $subscription, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($subscription->user_id !== $request->user()->id) {
            abort(404);
        }

        if ($gameServerAccount->gameserver_cloud_subscription_id !== $subscription->id) {
            abort(404);
        }

        if ($gameServerAccount->isSuspendedOrExpired()) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie zuerst.');
        }

        $action = $request->input('action', '');
        if (! in_array($action, ['start', 'stop', 'restart'], true)) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Ungültige Aktion.');
        }

        try {
            $client = app(PterodactylClient::class);
            $client->sendPowerAction($gameServerAccount, $action);
        } catch (\Throwable $e) {
            return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
                ->with('error', 'Aktion fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()->route('gaming.cloud.subscriptions.show', $subscription->id)
            ->with('success', 'Befehl gesendet.');
    }

    /**
     * @param  \Illuminate\Support\Collection<int, GameServerAccount>  $accounts
     * @param  array<int, array{id: int, name: string, eggs: array<int, array{id: int, name: string}>}>  $nests
     * @return array<int, array{id: int, name: string, status: string, identifier: string|null, allocation: array|null, nest_name: string, egg_name: string, server_status: string}>
     */
    protected function mapGameServerAccountsForShow($accounts, array $nests): array
    {
        $nestNames = [];
        $eggNames = [];
        foreach ($nests as $nest) {
            $nestNames[$nest['id']] = $nest['name'];
            foreach ($nest['eggs'] ?? [] as $egg) {
                $eggNames[$nest['id'].'_'.$egg['id']] = $egg['name'];
            }
        }

        $client = app(PterodactylClient::class);
        $result = [];
        foreach ($accounts as $a) {
            $allocation = is_array($a->allocation) ? $a->allocation : [];
            $nestId = (int) ($allocation['nest_id'] ?? 0);
            $eggId = (int) ($allocation['egg_id'] ?? 0);

            $serverStatus = 'offline';
            $overview = null;
            if ($a->identifier && $a->hostingServer) {
                try {
                    $client->setServer($a->hostingServer);
                    $overview = $client->getServerOverview($a);
                    if ($overview !== null) {
                        $serverStatus = (string) ($overview['status'] ?? 'offline');
                        if ($nestId < 1 && isset($overview['nest_id'])) {
                            $nestId = (int) $overview['nest_id'];
                        }
                        if ($eggId < 1 && isset($overview['egg_id'])) {
                            $eggId = (int) $overview['egg_id'];
                        }
                    }
                } catch (\Throwable $e) {
                    Log::debug('Subscription show: could not get server overview', ['account_id' => $a->id, 'error' => $e->getMessage()]);
                }
            }

            $nestName = $nestNames[$nestId] ?? '—';
            $eggName = $eggNames[$nestId.'_'.$eggId] ?? '—';

            $result[] = [
                'id' => $a->id,
                'name' => $a->name,
                'status' => $a->status,
                'identifier' => $a->identifier,
                'allocation' => $a->allocation,
                'nest_name' => $nestName,
                'egg_name' => $eggName,
                'server_status' => $serverStatus,
            ];
        }

        return $result;
    }
}
