<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHostingPlanRequest;
use App\Http\Requests\Admin\UpdateHostingPlanRequest;
use App\Models\Brand;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Services\SyncHostingPlanStripePriceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HostingPlanController extends Controller
{
    protected function currentBrand(Request $request): ?Brand
    {
        $brand = $request->attributes->get('current_brand');

        return $brand ?? Brand::getDefault();
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
        if (empty($allowedPanelTypes)) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }

        $pterodactylHostingServers = HostingServer::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        return Inertia::render('admin/hosting-plans/Create', [
            'allowedPanelTypes' => $allowedPanelTypes,
            'pterodactylHostingServers' => $pterodactylHostingServers,
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
        } else {
            $data['hosting_server_id'] = null;
        }
        $plan = HostingPlan::query()->create($data);

        $productType = ($plan->panel_type ?? 'plesk') === 'pterodactyl' ? 'game_server' : 'webspace';
        $plan->product()->create([
            'brand_id' => $plan->brand_id,
            'name' => $plan->name,
            'key' => Str::slug($plan->name).'_'.Str::random(4),
            'type' => $productType,
            'is_active' => $plan->is_active,
            'sort_order' => $plan->sort_order,
        ]);

        try {
            app(SyncHostingPlanStripePriceService::class)->sync($plan);
        } catch (\Throwable) {
            // Stripe nicht konfiguriert oder Fehler – Plan ist trotzdem gespeichert
        }

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
        if (empty($allowedPanelTypes)) {
            $allowedPanelTypes[] = ['value' => 'plesk', 'label' => 'Plesk'];
        }

        $pterodactylHostingServers = HostingServer::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'hostname'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name ?? $s->hostname, 'hostname' => $s->hostname]);

        return Inertia::render('admin/hosting-plans/Edit', [
            'hostingPlan' => $hostingPlan,
            'allowedPanelTypes' => $allowedPanelTypes,
            'pterodactylHostingServers' => $pterodactylHostingServers,
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
        } else {
            $data['hosting_server_id'] = null;
        }
        $hostingPlan->update($data);

        $hostingPlan->product?->update([
            'name' => $hostingPlan->name,
            'type' => ($hostingPlan->panel_type ?? 'plesk') === 'pterodactyl' ? 'game_server' : 'webspace',
            'is_active' => $hostingPlan->is_active,
            'sort_order' => $hostingPlan->sort_order,
        ]);

        try {
            app(SyncHostingPlanStripePriceService::class)->sync($hostingPlan);
        } catch (\Throwable) {
            // Stripe nicht konfiguriert oder Fehler – Plan ist trotzdem gespeichert
        }

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
