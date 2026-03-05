<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHostingServerRequest;
use App\Http\Requests\Admin\UpdateHostingServerRequest;
use App\Models\Brand;
use App\Models\HostingServer;
use App\Services\ControlPanels\PleskClient;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\ControlPanels\TeamSpeakClient;
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
        $teamspeakEnabled = ($brandFeatures['teamspeak'] ?? false) || ($brandFeatures['gaming'] ?? false);
        if ($teamspeakEnabled) {
            $allowedPanelTypes[] = ['value' => 'teamspeak', 'label' => 'TeamSpeak'];
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
        if (($data['panel_type'] ?? '') === 'teamspeak') {
            $config = $data['config'] ?? [];
            if (empty($data['hostname'] ?? '') && ! empty($config['host'] ?? '')) {
                $data['hostname'] = $config['host'];
            }
        }
        HostingServer::query()->create($data);

        return to_route('admin.hosting-servers.index');
    }

    public function show(Request $request, HostingServer $hostingServer): Response
    {
        $this->authorize('view', $hostingServer);

        $hostingServer->loadCount(['webspaceAccounts', 'gameServerAccounts', 'teamSpeakServerAccounts']);

        $pterodactylNodes = null;
        $teamspeakStats = null;
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

        if ($panelType === 'teamspeak') {
            $teamspeakStats = $this->teamspeakStats($hostingServer);
        }

        return Inertia::render('admin/hosting-servers/Show', [
            'hostingServer' => $hostingServer,
            'pterodactylNodes' => $pterodactylNodes,
            'teamspeakStats' => $teamspeakStats,
        ]);
    }

    /**
     * @return array{accounts_count: int, total_slots: int, monthly_revenue: float, monthly_cost: float, monthly_profit: float, cost_per_slot_per_month: float}
     */
    private function teamspeakStats(HostingServer $hostingServer): array
    {
        $accounts = $hostingServer->teamSpeakServerAccounts()
            ->with('hostingPlan:id,price')
            ->get();

        $totalSlots = 0;
        $monthlyRevenue = 0.0;

        foreach ($accounts as $account) {
            $slots = (int) (($account->option_values['slots'] ?? null) ?: 32);
            if ($slots < 1) {
                $slots = 32;
            }
            $totalSlots += $slots;
            $plan = $account->hostingPlan;
            if ($plan && $plan->price !== null) {
                $monthlyRevenue += (float) $plan->price;
            }
        }

        $costPerSlot = (float) config('billing.teamspeak_cost_per_slot_per_month', 0.12);
        $monthlyCost = round($totalSlots * $costPerSlot, 2);
        $monthlyProfit = round($monthlyRevenue - $monthlyCost, 2);

        return [
            'accounts_count' => $accounts->count(),
            'total_slots' => $totalSlots,
            'monthly_revenue' => round($monthlyRevenue, 2),
            'monthly_cost' => $monthlyCost,
            'monthly_profit' => $monthlyProfit,
            'cost_per_slot_per_month' => $costPerSlot,
        ];
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
        $teamspeakEnabled = ($brandFeatures['teamspeak'] ?? false) || ($brandFeatures['gaming'] ?? false);
        $isTeamSpeakServer = ($hostingServer->getAttribute('panel_type') ?? '') === 'teamspeak';
        if ($teamspeakEnabled || $isTeamSpeakServer) {
            $allowedPanelTypes[] = ['value' => 'teamspeak', 'label' => 'TeamSpeak'];
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
        if (($data['panel_type'] ?? '') === 'teamspeak' && isset($data['config']) && trim((string) ($data['config']['password'] ?? '')) === '') {
            unset($data['config']['password']);
            $data['config'] = array_merge($hostingServer->config ?? [], $data['config']);
        }
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

        try {
            if ($panelType === 'pterodactyl') {
                $client = app(PterodactylClient::class);
                $client->setServer($hostingServer);
                $result = $client->testConnection();
            } elseif ($panelType === 'teamspeak') {
                $client = app(TeamSpeakClient::class);
                $client->setServer($hostingServer);
                $result = $client->testConnection();
            } else {
                $client = app(PleskClient::class);
                $client->setServer($hostingServer);
                $result = $client->testConnection();
            }
        } catch (\Throwable $e) {
            $hostingServer->update([
                'api_checked_at' => now(),
                'api_check_status' => 'error',
                'api_check_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'panel_type' => $panelType,
                'info' => null,
                'checked_at' => $hostingServer->api_checked_at?->format('c'),
            ]);
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
