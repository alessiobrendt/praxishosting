<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHostingPlanRequest;
use App\Http\Requests\Admin\UpdateHostingPlanRequest;
use App\Models\Brand;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Services\ControlPanels\PterodactylClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HostingPlanController extends Controller
{
    /**
     * Option IDs available for plan_options when panel_type is pterodactyl (same keys as config in Edit form).
     *
     * @return array<int, array{value: string, label: string}>
     */
    protected static function availableOptionIdsPterodactyl(): array
    {
        $keys = [
            'memory' => 'RAM (memory)',
            'disk' => 'Disk',
            'cpu' => 'CPU',
            'swap' => 'Swap',
            'io' => 'IO',
            'nest_id' => 'Nest',
            'egg_id' => 'Egg',
            'node' => 'Node',
            'location_ids' => 'Location(s)',
            'databases' => 'Databases',
            'backups' => 'Backups',
            'additional_allocations' => 'Additional Allocations',
            'port_array' => 'Port Array',
            'port_range' => 'Port Range',
            'cpu_pinning' => 'CPU Pinning',
        ];

        $out = [];
        foreach ($keys as $value => $label) {
            $out[] = ['value' => $value, 'label' => $label];
        }

        return $out;
    }

    /**
     * Option IDs available for plan_options when panel_type is plesk.
     *
     * @return array<int, array{value: string, label: string}>
     */
    protected static function availableOptionIdsPlesk(): array
    {
        return [
            ['value' => 'disk_gb', 'label' => 'Disk (GB)'],
            ['value' => 'traffic_gb', 'label' => 'Traffic (GB)'],
            ['value' => 'domains', 'label' => 'Domains'],
            ['value' => 'subdomains', 'label' => 'Subdomains'],
            ['value' => 'mailboxes', 'label' => 'Mailboxes'],
            ['value' => 'databases', 'label' => 'Databases'],
        ];
    }

    /**
     * Option IDs available for plan_options when panel_type is teamspeak.
     *
     * @return array<int, array{value: string, label: string}>
     */
    protected static function availableOptionIdsTeamspeak(): array
    {
        return [
            ['value' => 'slots', 'label' => 'Slots'],
        ];
    }

    protected function currentBrand(Request $request): ?Brand
    {
        $brand = $request->attributes->get('current_brand');

        return $brand ?? Brand::getDefault();
    }

    /**
     * Return Pterodactyl API options for the given panel server (locations, nodes, nests, optional eggs).
     */
    public function pterodactylOptions(Request $request): JsonResponse
    {
        $this->authorize('viewAny', HostingPlan::class);

        $serverId = $request->integer('hosting_server_id');
        if ($serverId < 1) {
            return response()->json(['message' => 'hosting_server_id is required'], 400);
        }

        $server = HostingServer::query()
            ->where('id', $serverId)
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->first();

        if (! $server) {
            return response()->json(['message' => 'Pterodactyl server not found or inactive'], 404);
        }

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($server);

            $locations = $client->getLocations();
            $nodes = $client->getNodes();
            $nestsRaw = $client->getNests();
            $nests = [];
            foreach ($nestsRaw as $n) {
                $attrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
                $id = (int) ($attrs['id'] ?? 0);
                $name = (string) ($attrs['name'] ?? 'Nest '.$id);
                if ($id > 0) {
                    $nests[] = ['id' => $id, 'name' => $name];
                }
            }

            $eggs = [];
            $nestId = $request->integer('nest_id');
            if ($nestId > 0) {
                $eggsRaw = $client->getEggs($nestId);
                foreach ($eggsRaw as $e) {
                    $attrs = is_array($e) ? ($e['attributes'] ?? $e) : (array) $e;
                    $id = (int) ($attrs['id'] ?? 0);
                    $name = (string) ($attrs['name'] ?? 'Egg '.$id);
                    if ($id > 0) {
                        $eggs[] = ['id' => $id, 'name' => $name];
                    }
                }
            }

            return response()->json([
                'locations' => $locations,
                'nodes' => $nodes,
                'nests' => $nests,
                'eggs' => $eggs,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Failed to load Pterodactyl options: '.$e->getMessage()], 502);
        }
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', HostingPlan::class);

        $query = HostingPlan::query()->with('brand')->withCount(['webspaceAccounts', 'gameServerAccounts']);
        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null) {
            $query->where('brand_id', $currentBrand->id);
        }
        $plans = $query->orderBy('sort_order')->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('admin/hosting-plans/Index', [
            'hostingPlans' => $plans,
            'brandFeatures' => $currentBrand?->getFeaturesArray() ?? ['webspace' => true, 'gaming' => false],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', HostingPlan::class);

        $currentBrand = $this->currentBrand($request);
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? ['webspace' => true, 'gaming' => false];
        $allowedPanelTypes = [];
        if ($brandFeatures['webspace'] ?? false) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }
        $gamingEnabled = ($brandFeatures['gaming'] ?? false) || $currentBrand?->key === 'gaming';
        if ($gamingEnabled) {
            $allowedPanelTypes[] = ['value' => 'pterodactyl', 'label' => 'Pterodactyl'];
        }
        $teamspeakEnabled = ($brandFeatures['teamspeak'] ?? false) || ($brandFeatures['gaming'] ?? false);
        if ($teamspeakEnabled) {
            $allowedPanelTypes[] = ['value' => 'teamspeak', 'label' => 'TeamSpeak'];
        }
        if (empty($allowedPanelTypes)) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }

        $pterodactylHostingServers = HostingServer::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        $teamspeakHostingServers = HostingServer::query()
            ->where('panel_type', 'teamspeak')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        return Inertia::render('admin/hosting-plans/Create', [
            'allowedPanelTypes' => $allowedPanelTypes,
            'pterodactylHostingServers' => $pterodactylHostingServers,
            'teamspeakHostingServers' => $teamspeakHostingServers,
            'availableOptionIdsPterodactyl' => static::availableOptionIdsPterodactyl(),
            'availableOptionIdsPlesk' => static::availableOptionIdsPlesk(),
            'availableOptionIdsTeamspeak' => static::availableOptionIdsTeamspeak(),
        ]);
    }

    public function store(StoreHostingPlanRequest $request): RedirectResponse
    {
        $currentBrand = $this->currentBrand($request);
        $brandId = $currentBrand?->id ?? Brand::query()->value('id');
        $data = array_merge($request->validated(), [
            'brand_id' => $brandId,
        ]);
        if (($data['panel_type'] ?? '') === 'pterodactyl') {
            $data['plesk_package_name'] = $data['plesk_package_name'] ?? '';
            $serverId = $data['hosting_server_id'] ?? null;
            if ($serverId && HostingServer::where('id', $serverId)->where('panel_type', 'pterodactyl')->exists()) {
                $data['hosting_server_id'] = $serverId;
            } else {
                $data['hosting_server_id'] = null;
            }
        } elseif (($data['panel_type'] ?? '') === 'teamspeak') {
            $serverId = $data['hosting_server_id'] ?? null;
            if ($serverId && HostingServer::where('id', $serverId)->where('panel_type', 'teamspeak')->exists()) {
                $data['hosting_server_id'] = $serverId;
            } else {
                $data['hosting_server_id'] = null;
            }
        } else {
            $data['hosting_server_id'] = null;
        }
        $plan = HostingPlan::query()->create($data);

        $productType = match ($plan->panel_type ?? 'plesk') {
            'pterodactyl' => 'game_server',
            'teamspeak' => 'teamspeak',
            default => 'webspace',
        };
        $plan->product()->create([
            'brand_id' => $plan->brand_id,
            'name' => $plan->name,
            'key' => Str::slug($plan->name).'_'.Str::random(4),
            'type' => $productType,
            'is_active' => $plan->is_active,
            'sort_order' => $plan->sort_order,
        ]);

        return to_route('admin.hosting-plans.index');
    }

    public function show(Request $request, HostingPlan $hostingPlan): Response
    {
        $this->authorize('view', $hostingPlan);
        $this->ensureBrandMatches($request, $hostingPlan->brand_id);

        $hostingPlan->load(['product', 'webspaceAccounts' => fn ($q) => $q->latest()->limit(10)]);

        return Inertia::render('admin/hosting-plans/Show', [
            'hostingPlan' => $hostingPlan,
        ]);
    }

    public function edit(Request $request, HostingPlan $hostingPlan): Response
    {
        $this->authorize('update', $hostingPlan);
        $this->ensureBrandMatches($request, $hostingPlan->brand_id);

        $currentBrand = $this->currentBrand($request);
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? ['webspace' => true, 'gaming' => false];
        $allowedPanelTypes = [];
        if ($brandFeatures['webspace'] ?? false) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }
        $gamingEnabled = ($brandFeatures['gaming'] ?? false) || $currentBrand?->key === 'gaming';
        if ($gamingEnabled) {
            $allowedPanelTypes[] = ['value' => 'pterodactyl', 'label' => 'Pterodactyl'];
        }
        $teamspeakEnabled = ($brandFeatures['teamspeak'] ?? false) || ($brandFeatures['gaming'] ?? false);
        if ($teamspeakEnabled) {
            $allowedPanelTypes[] = ['value' => 'teamspeak', 'label' => 'TeamSpeak'];
        }
        if (empty($allowedPanelTypes)) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }

        $pterodactylHostingServers = HostingServer::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        $teamspeakHostingServers = HostingServer::query()
            ->where('panel_type', 'teamspeak')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        return Inertia::render('admin/hosting-plans/Edit', [
            'hostingPlan' => $hostingPlan,
            'allowedPanelTypes' => $allowedPanelTypes,
            'pterodactylHostingServers' => $pterodactylHostingServers,
            'teamspeakHostingServers' => $teamspeakHostingServers,
            'availableOptionIdsPterodactyl' => static::availableOptionIdsPterodactyl(),
            'availableOptionIdsPlesk' => static::availableOptionIdsPlesk(),
            'availableOptionIdsTeamspeak' => static::availableOptionIdsTeamspeak(),
        ]);
    }

    public function update(UpdateHostingPlanRequest $request, HostingPlan $hostingPlan): RedirectResponse
    {
        $this->ensureBrandMatches($request, $hostingPlan->brand_id);
        $data = $request->validated();
        unset($data['brand_id']);
        if (($data['panel_type'] ?? '') === 'pterodactyl') {
            $serverId = $data['hosting_server_id'] ?? null;
            if ($serverId && HostingServer::where('id', $serverId)->where('panel_type', 'pterodactyl')->exists()) {
                $data['hosting_server_id'] = $serverId;
            } else {
                $data['hosting_server_id'] = null;
            }
        } elseif (($data['panel_type'] ?? '') === 'teamspeak') {
            $serverId = $data['hosting_server_id'] ?? null;
            if ($serverId && HostingServer::where('id', $serverId)->where('panel_type', 'teamspeak')->exists()) {
                $data['hosting_server_id'] = $serverId;
            } else {
                $data['hosting_server_id'] = null;
            }
        } else {
            $data['hosting_server_id'] = null;
        }
        $hostingPlan->update($data);

        $productType = match ($hostingPlan->panel_type ?? 'plesk') {
            'pterodactyl' => 'game_server',
            'teamspeak' => 'teamspeak',
            default => 'webspace',
        };
        $hostingPlan->product?->update([
            'name' => $hostingPlan->name,
            'type' => $productType,
            'is_active' => $hostingPlan->is_active,
            'sort_order' => $hostingPlan->sort_order,
        ]);

        return to_route('admin.hosting-plans.show', $hostingPlan);
    }

    public function destroy(Request $request, HostingPlan $hostingPlan): RedirectResponse
    {
        $this->authorize('delete', $hostingPlan);
        $this->ensureBrandMatches($request, $hostingPlan->brand_id);

        $hostingPlan->product?->delete();
        $hostingPlan->delete();

        return to_route('admin.hosting-plans.index');
    }

    protected function ensureBrandMatches(Request $request, ?int $resourceBrandId): void
    {
        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $resourceBrandId !== null && $currentBrand->id !== $resourceBrandId) {
            abort(404);
        }
    }
}
