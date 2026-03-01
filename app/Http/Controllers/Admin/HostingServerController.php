<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHostingServerRequest;
use App\Http\Requests\Admin\UpdateHostingServerRequest;
use App\Models\Brand;
use App\Models\HostingServer;
use App\Services\ControlPanels\PleskClient;
use App\Services\ControlPanels\PterodactylClient;
use Illuminate\Http\JsonResponse;
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

        $pterodactylNodes = null;
        $panelType = $hostingServer->getAttribute('panel_type') ?? 'plesk';
        if ($panelType === 'pterodactyl') {
            try {
                $client = app(PterodactylClient::class);
                $client->setServer($hostingServer);
                $pterodactylNodes = $client->getNodesOverview();
            } catch (\Throwable) {
                $pterodactylNodes = null;
            }
        }

        return Inertia::render('admin/hosting-servers/Show', [
            'hostingServer' => $hostingServer,
            'pterodactylNodes' => $pterodactylNodes,
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

        $hostingServerData = $hostingServer->toArray();
        $hostingServerData['panel_type'] = $hostingServer->getAttribute('panel_type') ?? 'plesk';

        return Inertia::render('admin/hosting-servers/Edit', [
            'hostingServer' => $hostingServerData,
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

    public function check(Request $request, HostingServer $hostingServer): JsonResponse
    {
        $this->authorize('view', $hostingServer);

        $panelType = $hostingServer->getAttribute('panel_type') ?? 'plesk';

        if ($panelType === 'pterodactyl') {
            $client = app(PterodactylClient::class);
            $client->setServer($hostingServer);
            $result = $client->testConnection();
        } else {
            $client = app(PleskClient::class);
            $client->setServer($hostingServer);
            $result = $client->testConnection();
        }

        $hostingServer->update([
            'api_checked_at' => now(),
            'api_check_status' => $result['success'] ? 'ok' : 'error',
            'api_check_message' => $result['message'],
        ]);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'panel_type' => $panelType,
            'info' => $result['info'] ?? null,
            'checked_at' => $hostingServer->api_checked_at?->format('c'),
        ]);
    }
}
