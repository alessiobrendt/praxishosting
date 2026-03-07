<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePterodactylEggConfigRequest;
use App\Models\HostingServer;
use App\Models\PterodactylEggConfig;
use App\Services\ControlPanels\PterodactylClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PterodactylEggController extends Controller
{
    protected function ensurePterodactyl(HostingServer $hostingServer): void
    {
        if (($hostingServer->getAttribute('panel_type') ?? '') !== 'pterodactyl') {
            abort(404, 'Hosting server is not a Pterodactyl panel.');
        }
    }

    protected function getClient(HostingServer $hostingServer): PterodactylClient
    {
        $client = app(PterodactylClient::class);
        $client->setServer($hostingServer);

        return $client;
    }

    /**
     * List nests for a Pterodactyl hosting server.
     */
    public function nests(Request $request, HostingServer $hostingServer): Response|RedirectResponse
    {
        $this->authorize('view', $hostingServer);
        $this->ensurePterodactyl($hostingServer);

        try {
            $client = $this->getClient($hostingServer);
            $nestsRaw = $client->getNests();
        } catch (\Throwable $e) {
            return redirect()->route('admin.hosting-servers.show', $hostingServer)
                ->with('error', 'Pterodactyl API: '.$e->getMessage());
        }

        $nests = [];
        foreach ($nestsRaw as $n) {
            $attrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
            $id = (int) ($attrs['id'] ?? 0);
            if ($id < 1) {
                continue;
            }
            $nests[] = [
                'id' => $id,
                'name' => (string) ($attrs['name'] ?? 'Nest '.$id),
                'description' => (string) ($attrs['description'] ?? ''),
            ];
        }

        return Inertia::render('admin/pterodactyl-eggs/NestsIndex', [
            'hostingServer' => [
                'id' => $hostingServer->id,
                'name' => $hostingServer->name ?? $hostingServer->hostname,
                'hostname' => $hostingServer->hostname,
            ],
            'nests' => $nests,
        ]);
    }

    /**
     * List eggs for a nest.
     */
    public function eggs(Request $request, HostingServer $hostingServer, int $nest): Response|RedirectResponse
    {
        $this->authorize('view', $hostingServer);
        $this->ensurePterodactyl($hostingServer);

        try {
            $client = $this->getClient($hostingServer);
            $eggsRaw = $client->getEggs($nest);
        } catch (\Throwable $e) {
            return redirect()->route('admin.hosting-servers.pterodactyl-nests.index', $hostingServer)
                ->with('error', 'Pterodactyl API: '.$e->getMessage());
        }

        $eggs = [];
        foreach ($eggsRaw as $e) {
            $attrs = is_array($e) ? ($e['attributes'] ?? $e) : (array) $e;
            $id = (int) ($attrs['id'] ?? 0);
            if ($id < 1) {
                continue;
            }
            $eggs[] = [
                'id' => $id,
                'name' => (string) ($attrs['name'] ?? 'Egg '.$id),
                'description' => (string) ($attrs['description'] ?? ''),
            ];
        }

        $nestName = 'Nest '.$nest;
        foreach ($client->getNests() as $n) {
            $attrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
            if ((int) ($attrs['id'] ?? 0) === $nest) {
                $nestName = (string) ($attrs['name'] ?? $nestName);
                break;
            }
        }

        return Inertia::render('admin/pterodactyl-eggs/EggsIndex', [
            'hostingServer' => [
                'id' => $hostingServer->id,
                'name' => $hostingServer->name ?? $hostingServer->hostname,
                'hostname' => $hostingServer->hostname,
            ],
            'nest' => ['id' => $nest, 'name' => $nestName],
            'eggs' => $eggs,
        ]);
    }

    /**
     * Show single egg with variables and saved config.
     */
    public function showEgg(Request $request, HostingServer $hostingServer, int $nest, int $egg): Response|RedirectResponse
    {
        $this->authorize('view', $hostingServer);
        $this->ensurePterodactyl($hostingServer);

        try {
            $client = $this->getClient($hostingServer);
            $eggData = $client->getEggWithVariables($nest, $egg);
        } catch (\Throwable $e) {
            return redirect()->route('admin.hosting-servers.pterodactyl-nests.eggs.index', [$hostingServer, 'nest' => $nest])
                ->with('error', 'Pterodactyl API: '.$e->getMessage());
        }

        $attrs = $eggData['attributes'] ?? $eggData;
        $variablesData = $attrs['relationships']['variables']['data'] ?? $eggData['relationships']['variables']['data'] ?? [];
        $variables = [];
        foreach ($variablesData as $v) {
            $va = $v['attributes'] ?? $v;
            $variables[] = [
                'id' => (int) ($va['id'] ?? 0),
                'name' => (string) ($va['name'] ?? ''),
                'env_variable' => (string) ($va['env_variable'] ?? ''),
                'default_value' => (string) ($va['default_value'] ?? ''),
                'rules' => (string) ($va['rules'] ?? ''),
                'user_viewable' => (bool) ($va['user_viewable'] ?? true),
                'user_editable' => (bool) ($va['user_editable'] ?? true),
            ];
        }

        $eggConfig = PterodactylEggConfig::query()
            ->where('hosting_server_id', $hostingServer->id)
            ->where('nest_id', $nest)
            ->where('egg_id', $egg)
            ->first();

        $config = $eggConfig?->config ?? [];
        $variableDefaults = $config['variable_defaults'] ?? [];
        $requiredEnvVariables = $config['required_env_variables'] ?? [];

        $nestName = 'Nest '.$nest;
        foreach ($client->getNests() as $n) {
            $nAttrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
            if ((int) ($nAttrs['id'] ?? 0) === $nest) {
                $nestName = (string) ($nAttrs['name'] ?? $nestName);
                break;
            }
        }

        return Inertia::render('admin/pterodactyl-eggs/EggShow', [
            'hostingServer' => [
                'id' => $hostingServer->id,
                'name' => $hostingServer->name ?? $hostingServer->hostname,
                'hostname' => $hostingServer->hostname,
            ],
            'nest' => ['id' => $nest, 'name' => $nestName],
            'egg' => [
                'id' => $egg,
                'name' => (string) ($attrs['name'] ?? 'Egg '.$egg),
                'description' => (string) ($attrs['description'] ?? ''),
                'docker_image' => (string) ($attrs['docker_image'] ?? ''),
                'startup' => (string) ($attrs['startup'] ?? ''),
            ],
            'variables' => $variables,
            'config' => [
                'variable_defaults' => $variableDefaults,
                'required_env_variables' => $requiredEnvVariables,
                'subdomain_srv_protocol' => (string) ($config['subdomain_srv_protocol'] ?? ''),
                'subdomain_protocol_type' => (string) ($config['subdomain_protocol_type'] ?? 'none'),
            ],
        ]);
    }

    /**
     * Update egg config (variable defaults, required, subdomain settings).
     */
    public function updateConfig(UpdatePterodactylEggConfigRequest $request, HostingServer $hostingServer, int $nest, int $egg): RedirectResponse
    {
        $this->authorize('update', $hostingServer);
        $this->ensurePterodactyl($hostingServer);

        $config = $request->validated('config') ?? [];
        $config['variable_defaults'] = $config['variable_defaults'] ?? [];
        $config['required_env_variables'] = $config['required_env_variables'] ?? [];
        $config['subdomain_srv_protocol'] = $config['subdomain_srv_protocol'] ?? '';
        $config['subdomain_protocol_type'] = $config['subdomain_protocol_type'] ?? 'none';

        PterodactylEggConfig::query()->updateOrCreate(
            [
                'hosting_server_id' => $hostingServer->id,
                'nest_id' => $nest,
                'egg_id' => $egg,
            ],
            ['config' => $config]
        );

        return redirect()->route('admin.hosting-servers.pterodactyl-nests.eggs.show', [$hostingServer, 'nest' => $nest, 'egg' => $egg])
            ->with('success', 'Egg-Konfiguration gespeichert.');
    }
}
