<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHostingServerRequest;
use App\Http\Requests\Admin\UpdateHostingServerRequest;
use App\Models\Brand;
use App\Models\HostingServer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HostingServerController extends Controller
{
    protected function currentBrand(Request $request): ?Brand
    {
        $brand = $request->attributes->get('current_brand');

        return $brand ?? Brand::getDefault();
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', HostingServer::class);

        $currentBrand = $this->currentBrand($request);
        $servers = HostingServer::query()
            ->with('brand')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/hosting-servers/Index', [
            'hostingServers' => $servers,
            'brandFeatures' => $currentBrand?->getFeaturesArray() ?? ['webspace' => true, 'gaming' => false],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', HostingServer::class);

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

        return Inertia::render('admin/hosting-servers/Create', [
            'allowedPanelTypes' => $allowedPanelTypes,
        ]);
    }

    public function store(StoreHostingServerRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['brand_id'] = $data['brand_id'] ?? null;
        if (($data['panel_type'] ?? '') === 'pterodactyl') {
            $data['api_token'] = $data['api_token'] ?? '';
        }
        HostingServer::query()->create($data);

        return to_route('admin.hosting-servers.index');
    }

    public function show(Request $request, HostingServer $hostingServer): Response
    {
        $this->authorize('view', $hostingServer);

        $hostingServer->loadCount(['webspaceAccounts', 'gameServerAccounts']);

        return Inertia::render('admin/hosting-servers/Show', [
            'hostingServer' => $hostingServer,
        ]);
    }

    public function edit(Request $request, HostingServer $hostingServer): Response
    {
        $this->authorize('update', $hostingServer);

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

        return Inertia::render('admin/hosting-servers/Edit', [
            'hostingServer' => $hostingServer,
            'allowedPanelTypes' => $allowedPanelTypes,
        ]);
    }

    public function update(UpdateHostingServerRequest $request, HostingServer $hostingServer): RedirectResponse
    {
        $data = $request->validated();
        if (empty($data['api_token'] ?? '')) {
            unset($data['api_token']);
        }
        unset($data['brand_id']);
        $hostingServer->update($data);

        return to_route('admin.hosting-servers.show', $hostingServer);
    }

    public function destroy(Request $request, HostingServer $hostingServer): RedirectResponse
    {
        $this->authorize('delete', $hostingServer);

        $hostingServer->delete();

        return to_route('admin.hosting-servers.index');
    }
}
