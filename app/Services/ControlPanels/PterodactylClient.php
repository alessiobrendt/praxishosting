<?php

namespace App\Services\ControlPanels;

use App\Contracts\ControlPanelContract;
use App\Models\GameServerAccount;
use App\Models\HostingServer;
use Exception;
use HCGCloud\Pterodactyl\Pterodactyl as PterodactylSdk;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PterodactylClient implements ControlPanelContract
{
    protected ?HostingServer $server = null;

    protected ?PterodactylSdk $sdk = null;

    /** @var array{identifier?: string, pterodactyl_server_id?: int, pterodactyl_user_id?: int, name?: string} */
    protected array $lastCreatedServerData = [];

    public function setServer(HostingServer $server): void
    {
        $this->server = $server;
        $this->sdk = null;
    }

    protected function getSdk(): PterodactylSdk
    {
        if (! $this->server) {
            throw new Exception('Pterodactyl server not configured');
        }

        if ($this->sdk !== null) {
            return $this->sdk;
        }

        $config = $this->server->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = $config['api_key'] ?? $this->server->api_token ?? '';

        if ($baseUri === '' || $apiKey === '') {
            throw new Exception('Pterodactyl: base_uri and api_key must be set in server config');
        }

        $this->sdk = new PterodactylSdk($baseUri, $apiKey, 'application');

        return $this->sdk;
    }

    /**
     * Raw GET request to Pterodactyl Application API (for endpoints not exposed by SDK).
     *
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    protected function apiRequest(string $path, array $query = []): array
    {
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = $config['api_key'] ?? $this->server?->api_token ?? '';
        if ($baseUri === '' || $apiKey === '') {
            throw new Exception('Pterodactyl: base_uri and api_key must be set in server config');
        }
        $url = $baseUri.$path;
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => 'application/json',
        ])->timeout(15)->get($url, $query);
        if (! $response->successful()) {
            $body = $response->json();
            $msg = $body['errors'][0]['detail'] ?? $body['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl API: '.$msg);
        }

        return $response->json() ?? [];
    }

    /**
     * Raw request to Pterodactyl Client API (resources, power). Uses client_api_key if set, else api_key.
     *
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>
     */
    protected function clientApiRequest(string $path, string $method = 'GET', array $body = []): array
    {
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = (string) ($config['client_api_key'] ?? $config['api_key'] ?? $this->server?->api_token ?? '');
        if ($baseUri === '' || $apiKey === '') {
            throw new Exception('Pterodactyl: base_uri and (client_api_key or api_key) must be set for client API');
        }
        $url = $baseUri.$path;
        $request = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => 'application/json',
        ])->timeout(15);
        $response = $method === 'POST' || $method === 'PATCH' || $method === 'PUT'
            ? $request->withBody(json_encode($body), 'application/json')->{strtolower($method)}($url)
            : $request->get($url);
        if (! $response->successful()) {
            $resBody = $response->json();
            $msg = $resBody['errors'][0]['detail'] ?? $resBody['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl Client API: '.$msg);
        }

        return $response->json() ?? [];
    }

    /**
     * Get server overview (status, allocation, limits, usage) for a game server account.
     * Uses Application API for server/details and optional Client API for live resources/power.
     *
     * @return array{name: string, status: string, allocation: string, limits: array{memory: int, disk: int, cpu: float}, usage: array{memory_bytes: int, disk_bytes: int, cpu_absolute: float, network_rx_bytes: int, network_tx_bytes: int}, can_power: bool}|null
     */
    public function getServerOverview(GameServerAccount $account): ?array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->pterodactyl_server_id || ! $account->identifier) {
            return null;
        }
        $this->setServer($server);

        try {
            $data = $this->apiRequest('/api/application/servers/'.$account->pterodactyl_server_id);
            $attrs = $data['attributes'] ?? $data;
            $allocationId = $attrs['allocation'] ?? null;
            $nodeId = $attrs['node'] ?? null;
            $allocation = '—';
            if ($allocationId && $nodeId) {
                $allocData = $this->apiRequest('/api/application/nodes/'.$nodeId.'/allocations', ['per_page' => 100]);
                foreach ($allocData['data'] ?? [] as $alloc) {
                    $a = $alloc['attributes'] ?? $alloc;
                    if ((int) ($a['id'] ?? 0) === (int) $allocationId) {
                        $ip = $a['ip'] ?? '';
                        $port = $a['port'] ?? '';
                        $alias = $a['alias'] ?? null;
                        if ($ip && $port !== '') {
                            $allocation = $alias ? $alias.':'.$port : $ip.':'.$port;
                        }
                        break;
                    }
                }
            }
            $limits = [
                'memory' => (int) ($attrs['limits']['memory'] ?? 0),
                'disk' => (int) ($attrs['limits']['disk'] ?? 0),
                'cpu' => (float) ($attrs['limits']['cpu'] ?? 0),
                'swap' => (int) ($attrs['limits']['swap'] ?? 0),
                'io' => (int) ($attrs['limits']['io'] ?? 0),
            ];
            $status = (string) ($attrs['status'] ?? 'offline');
            $usage = [
                'memory_bytes' => 0,
                'disk_bytes' => 0,
                'cpu_absolute' => 0.0,
                'network_rx_bytes' => 0,
                'network_tx_bytes' => 0,
            ];
            $canPower = false;
            $config = $this->server?->config ?? [];
            if (! empty($config['client_api_key']) || ! empty($config['api_key'])) {
                try {
                    $res = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/resources');
                    $resAttrs = $res['attributes'] ?? $res;
                    $status = (string) ($resAttrs['current_state'] ?? $status);
                    $usage = [
                        'memory_bytes' => (int) ($resAttrs['resources']['memory_bytes'] ?? 0),
                        'disk_bytes' => (int) ($resAttrs['resources']['disk_bytes'] ?? 0),
                        'cpu_absolute' => (float) ($resAttrs['resources']['cpu_absolute'] ?? 0),
                        'network_rx_bytes' => (int) ($resAttrs['resources']['network_rx_bytes'] ?? 0),
                        'network_tx_bytes' => (int) ($resAttrs['resources']['network_tx_bytes'] ?? 0),
                    ];
                    $canPower = true;
                } catch (\Throwable $e) {
                    Log::debug('Pterodactyl: could not fetch client resources', ['error' => $e->getMessage()]);
                }
            }

            return [
                'name' => (string) ($attrs['name'] ?? $account->name),
                'status' => $status,
                'allocation' => $allocation,
                'limits' => $limits,
                'usage' => $usage,
                'can_power' => $canPower,
                'is_installing' => ($attrs['status'] ?? null) === 'installing',
                'suspended' => (bool) ($attrs['suspended'] ?? false),
            ];
        } catch (\Throwable $e) {
            Log::debug('Pterodactyl getServerOverview failed', ['account_id' => $account->id, 'error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Send power action (start, stop, restart, kill) via Client API.
     */
    public function sendPowerAction(GameServerAccount $account, string $signal): void
    {
        $valid = ['start', 'stop', 'restart', 'kill'];
        if (! in_array($signal, $valid, true)) {
            throw new Exception('Pterodactyl: invalid power signal');
        }
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/power', 'POST', ['signal' => $signal]);
    }

    /**
     * Test API connection (Application API). Returns ['success' => bool, 'message' => string].
     */
    public function testConnection(): array
    {
        if (! $this->server) {
            return ['success' => false, 'message' => 'Server not configured'];
        }

        try {
            $this->apiRequest('/api/application/nodes', ['per_page' => 1]);

            return ['success' => true, 'message' => 'Connection successful'];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get locations for dropdown (id => short name).
     *
     * @return array<int, array{id: int, name: string}>
     */
    public function getLocations(): array
    {
        $data = $this->apiRequest('/api/application/locations', ['per_page' => 100]);
        $out = [];
        foreach ($data['data'] ?? [] as $item) {
            $attrs = $item['attributes'] ?? $item;
            $id = (int) ($attrs['id'] ?? 0);
            $name = (string) ($attrs['short'] ?? $attrs['name'] ?? 'Location '.$id);
            if ($id > 0) {
                $out[] = ['id' => $id, 'name' => $name];
            }
        }

        return $out;
    }

    /**
     * Get nodes for dropdown (id => name).
     *
     * @return array<int, array{id: int, name: string}>
     */
    public function getNodes(): array
    {
        $data = $this->apiRequest('/api/application/nodes', ['per_page' => 100]);
        $out = [];
        foreach ($data['data'] ?? [] as $item) {
            $attrs = $item['attributes'] ?? $item;
            $id = (int) ($attrs['id'] ?? 0);
            $name = (string) ($attrs['name'] ?? 'Node '.$id);
            if ($id > 0) {
                $out[] = ['id' => $id, 'name' => $name];
            }
        }

        return $out;
    }

    /**
     * Get nodes with memory/disk totals and allocated resources for admin overview.
     * Returns null on API failure.
     *
     * @return array<int, array{id: int, name: string, fqdn: string, memory_total_mb: int, disk_total_mb: int, memory_allocated_mb: int, disk_allocated_mb: int, maintenance_mode: bool}>|null
     */
    public function getNodesOverview(): ?array
    {
        try {
            $data = $this->apiRequest('/api/application/nodes', ['per_page' => 100]);
            $out = [];
            foreach ($data['data'] ?? [] as $item) {
                $attrs = $item['attributes'] ?? $item;
                $id = (int) ($attrs['id'] ?? 0);
                if ($id === 0) {
                    continue;
                }
                $allocated = $attrs['allocated_resources'] ?? [];
                $out[] = [
                    'id' => $id,
                    'name' => (string) ($attrs['name'] ?? 'Node '.$id),
                    'fqdn' => (string) ($attrs['fqdn'] ?? ''),
                    'memory_total_mb' => (int) ($attrs['memory'] ?? 0),
                    'disk_total_mb' => (int) ($attrs['disk'] ?? 0),
                    'memory_allocated_mb' => (int) ($allocated['memory'] ?? 0),
                    'disk_allocated_mb' => (int) ($allocated['disk'] ?? 0),
                    'maintenance_mode' => (bool) ($attrs['maintenance_mode'] ?? false),
                ];
            }

            return $out;
        } catch (\Throwable $e) {
            Log::debug('Pterodactyl getNodesOverview failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Create a Pterodactyl user and game server.
     * Params: email, username, first_name, last_name, password, server_name, nest_id, egg_id,
     * memory, disk, cpu, swap, io, databases, backups, (optional) allocation_id or location_ids for deploy.
     *
     * @param  array<string, mixed>  $params
     */
    public function createAccount(array $params): bool
    {
        $sdk = $this->getSdk();

        $email = trim((string) ($params['email'] ?? ''));
        $username = $this->sanitizePterodactylUsername(
            (string) ($params['username'] ?? Str::slug($params['server_name'] ?? 'user').'_'.Str::random(4))
        );
        $firstName = trim((string) ($params['first_name'] ?? ''));
        $lastName = trim((string) ($params['last_name'] ?? ''));
        $password = (string) ($params['password'] ?? '');
        $serverName = $this->sanitizePterodactylServerName((string) ($params['server_name'] ?? 'Game Server'));

        if ($firstName === '') {
            $firstName = $username;
        }
        if ($lastName === '') {
            $lastName = '.';
        }

        if ($email === '') {
            throw new Exception('Pterodactyl: email is required');
        }

        try {
            $user = $this->findOrCreateUser($sdk, $email, $username, $firstName, $lastName, $password);
            $userId = is_object($user) && isset($user->id) ? (int) $user->id : (int) $user['id'] ?? 0;
            if ($userId === 0 && is_array($user)) {
                $userId = (int) ($user['attributes']['id'] ?? 0);
            }
            if ($userId === 0) {
                throw new Exception('Pterodactyl: could not resolve user id after create');
            }

            $nodeId = isset($params['node']) ? (int) $params['node'] : 0;
            if ($nodeId > 0) {
                $allocationId = $this->resolveAllocationIdForNode($params);
                if ($allocationId > 0) {
                    $params['allocation_id'] = $allocationId;
                }
            } else {
                $allocationId = $this->resolveDeployableAllocation($params);
                if ($allocationId > 0) {
                    $params['allocation_id'] = $allocationId;
                }
            }

            $serverPayload = $this->buildServerCreationPayload($params, $userId);
            $serverPayload['name'] = $serverName;
            $serverPayload['user'] = $userId;

            $server = $sdk->servers->create($serverPayload);
            $serverId = is_object($server) && isset($server->id) ? $server->id : ($server['attributes']['id'] ?? null);
            $identifier = is_object($server) && isset($server->identifier) ? $server->identifier : ($server['attributes']['identifier'] ?? null);

            $this->lastCreatedServerData = [
                'identifier' => $identifier,
                'pterodactyl_server_id' => $serverId,
                'pterodactyl_user_id' => $userId,
                'name' => $serverName,
            ];

            Log::info('Pterodactyl server created', [
                'server' => $this->server->hostname ?? $this->server->name,
                'server_name' => $serverName,
                'identifier' => $identifier,
            ]);

            return true;
        } catch (\Throwable $e) {
            $paramsForLog = $params;
            unset($paramsForLog['password']);
            $previous = $e->getPrevious();
            $detail = $previous ? $previous->getMessage() : null;
            Log::error('Pterodactyl createAccount error', [
                'server' => $this->server->name ?? null,
                'error' => $e->getMessage(),
                'detail' => $detail,
                'params' => $paramsForLog,
            ]);

            throw new Exception('Pterodactyl: '.$e->getMessage(), (int) $e->getCode(), $e);
        }
    }

    /**
     * @param  array<string, mixed>  $params  Must include 'identifier' for the server.
     */
    public function getLoginUrl(array $params): ?string
    {
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $identifier = $params['identifier'] ?? null;

        if ($baseUri === '' || $identifier === '') {
            return null;
        }

        return $baseUri.'/server/'.$identifier;
    }

    /**
     * Find user by email or create new one.
     *
     * @return object|array<string, mixed>
     */
    protected function findOrCreateUser(PterodactylSdk $sdk, string $email, string $username, string $firstName, string $lastName, string $password): object|array
    {
        try {
            $list = $sdk->users->paginate(1, ['filter' => ['email' => $email]]);
            $data = is_object($list) ? (method_exists($list, 'all') ? $list->all() : ($list->data ?? [])) : ($list['data'] ?? []);
            if (is_array($data) && count($data) > 0) {
                $first = $data[0];

                return is_object($first) ? $first : $first;
            }
        } catch (\Throwable) {
            // ignore, create new
        }

        $payload = [
            'email' => $email,
            'username' => $username,
            'first_name' => $firstName,
            'last_name' => $lastName,
        ];
        if ($password !== '') {
            $payload['password'] = $password;
        }

        return $sdk->users->create($payload);
    }

    /**
     * Return data of the last server created by createAccount (identifier, pterodactyl_server_id, pterodactyl_user_id, name).
     *
     * @return array{identifier?: string, pterodactyl_server_id?: int, pterodactyl_user_id?: int, name?: string}
     */
    public function getLastCreatedServerData(): array
    {
        return $this->lastCreatedServerData;
    }

    /**
     * Resolve a free allocation from any deployable node (used when no specific node is set).
     * Avoids NoViableAllocationException by choosing the allocation ourselves instead of letting the panel decide.
     *
     * @param  array<string, mixed>  $params  Must include memory, disk; optional location_ids
     * @return int Allocation id, or 0 if none found
     */
    protected function resolveDeployableAllocation(array $params): int
    {
        $memory = (int) ($params['memory'] ?? 512);
        $disk = (int) ($params['disk'] ?? 5120);
        $locationIds = $params['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        if (empty($locationIds)) {
            $locations = $this->getLocations();
            $locationIds = array_column($locations, 'id');
        }
        $query = [
            'memory' => $memory,
            'disk' => $disk,
            'include' => ['allocations'],
        ];
        if (! empty($locationIds)) {
            $query['location_ids'] = array_map('intval', $locationIds);
        }
        $data = $this->apiRequest('/api/application/nodes/deployable', $query);
        $nodes = $data['data'] ?? [];
        foreach ($nodes as $node) {
            $allocations = $node['relationships']['allocations']['data'] ?? $node['attributes']['relationships']['allocations']['data'] ?? [];
            foreach ($allocations as $alloc) {
                $a = $alloc['attributes'] ?? $alloc;
                if (! empty($a['assigned'])) {
                    continue;
                }
                $allocId = (int) ($a['id'] ?? 0);
                if ($allocId > 0) {
                    return $allocId;
                }
            }
        }
        if (empty($nodes)) {
            throw new Exception('Pterodactyl: No deployable nodes found (insufficient memory/disk on nodes or no locations). Add capacity or select other locations.');
        }

        throw new Exception('Pterodactyl: No free port allocations on any deployable node. Add more allocations in the panel (Nodes → Node → Allocations).');
    }

    /**
     * When plan has a specific node, resolve a free allocation on that node via deployable API.
     *
     * @param  array<string, mixed>  $params  Must include node (id), memory, disk; optional location_ids
     * @return int Allocation id, or 0 if none found
     */
    protected function resolveAllocationIdForNode(array $params): int
    {
        $nodeId = (int) ($params['node'] ?? 0);
        $memory = (int) ($params['memory'] ?? 512);
        $disk = (int) ($params['disk'] ?? 5120);
        $locationIds = $params['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $query = [
            'memory' => $memory,
            'disk' => $disk,
            'include' => ['allocations'],
        ];
        if (! empty($locationIds)) {
            $query['location_ids'] = array_map('intval', $locationIds);
        }
        $data = $this->apiRequest('/api/application/nodes/deployable', $query);
        $nodes = $data['data'] ?? [];
        foreach ($nodes as $node) {
            $attrs = $node['attributes'] ?? $node;
            $id = (int) ($attrs['id'] ?? 0);
            if ($id !== $nodeId) {
                continue;
            }
            $allocations = $node['relationships']['allocations']['data'] ?? $attrs['relationships']['allocations']['data'] ?? [];
            foreach ($allocations as $alloc) {
                $a = $alloc['attributes'] ?? $alloc;
                if (! empty($a['assigned'])) {
                    continue;
                }
                $allocId = (int) ($a['id'] ?? 0);
                if ($allocId > 0) {
                    return $allocId;
                }
            }
            throw new Exception('Pterodactyl: No available allocations on the selected node.');
        }
        $nodeName = 'Unknown';
        try {
            $one = $this->apiRequest('/api/application/nodes/'.$nodeId);
            $nodeName = $one['attributes']['name'] ?? $nodeId;
        } catch (\Throwable) {
        }
        throw new Exception("Pterodactyl: The selected node '{$nodeName}' is not suitable for deployment (insufficient resources, maintenance, or not in selected locations).");
    }

    /**
     * Sanitize server name for Pterodactyl (length + allowed chars).
     */
    protected function sanitizePterodactylServerName(string $name): string
    {
        $name = trim(preg_replace('/[^\p{L}\p{N}\s\-_.]/u', '', $name) ?? '');
        if ($name === '') {
            return 'Game Server';
        }

        return mb_substr($name, 0, 191);
    }

    /**
     * Sanitize username for Pterodactyl (alphanumeric + underscore, 1–191 chars).
     */
    protected function sanitizePterodactylUsername(string $username): string
    {
        $username = preg_replace('/[^a-zA-Z0-9_]/', '', $username);
        if ($username === '' || strlen($username) < 1) {
            $username = 'user_'.Str::random(6);
        }

        return substr($username, 0, 191);
    }

    /**
     * Build server creation payload from params (and optional plan config).
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    protected function buildServerCreationPayload(array $params, int $userId): array
    {
        $nestId = (int) ($params['nest_id'] ?? 0);
        $eggId = (int) ($params['egg_id'] ?? 0);
        if ($nestId === 0 || $eggId === 0) {
            throw new Exception('Pterodactyl: nest_id and egg_id are required');
        }

        $eggData = $this->apiRequest('/api/application/nests/'.$nestId.'/eggs/'.$eggId, ['include' => 'variables']);
        $attrs = $eggData['attributes'] ?? $eggData;
        if (empty($attrs)) {
            throw new Exception('Pterodactyl: could not fetch egg data');
        }
        $dockerImage = (string) ($attrs['docker_image'] ?? '');
        $startup = (string) ($attrs['startup'] ?? '');

        $environment = [];
        $variables = $attrs['relationships']['variables']['data'] ?? $eggData['relationships']['variables']['data'] ?? [];
        foreach ($variables as $variable) {
            $v = $variable['attributes'] ?? $variable;
            $key = $v['env_variable'] ?? null;
            $default = $v['default_value'] ?? '';
            if ($key !== null && $key !== '') {
                $environment[$key] = $params[$key] ?? $params['environment'][$key] ?? $default;
            }
        }

        $memory = (int) ($params['memory'] ?? 512);
        $swap = (int) ($params['swap'] ?? 0);
        $disk = (int) ($params['disk'] ?? 5120);
        $io = (int) ($params['io'] ?? 500);
        $cpu = (int) ($params['cpu'] ?? 0);
        $cpuPinning = $params['cpu_pinning'] ?? null;
        $databases = (int) ($params['databases'] ?? 0);
        $backups = (int) ($params['backups'] ?? 0);
        $allocations = (int) ($params['allocations'] ?? $params['additional_allocations'] ?? 1);
        if ($allocations < 1) {
            $allocations = 1;
        }

        $limits = [
            'memory' => $memory,
            'swap' => $swap,
            'disk' => $disk,
            'io' => $io,
            'cpu' => $cpu,
        ];
        if ($cpuPinning !== null && $cpuPinning !== '') {
            $limits['threads'] = (string) $cpuPinning;
        }

        $payload = [
            'name' => (string) ($params['server_name'] ?? 'Game Server'),
            'user' => $userId,
            'egg' => $eggId,
            'docker_image' => $dockerImage,
            'startup' => $startup,
            'limits' => $limits,
            'feature_limits' => [
                'databases' => $databases,
                'backups' => $backups,
                'allocations' => $allocations,
            ],
            'environment' => $environment,
            'skip_scripts' => (bool) ($params['skip_scripts'] ?? false),
            'oom_disabled' => ! (bool) ($params['oom_killer'] ?? false),
            'start_on_completion' => (bool) ($params['start_on_completion'] ?? true),
        ];

        if (isset($params['allocation_id']) && (int) $params['allocation_id'] > 0) {
            $payload['allocation'] = [
                'default' => (int) $params['allocation_id'],
                'additional' => [],
            ];
        } else {
            $locationIds = $params['location_ids'] ?? [];
            if (! is_array($locationIds)) {
                $locationIds = $locationIds ? [$locationIds] : [];
            }
            if (empty($locationIds)) {
                $locations = $this->getLocations();
                $locationIds = array_column($locations, 'id');
            }
            if (empty($locationIds)) {
                throw new Exception('Pterodactyl: No locations available for deployment. Configure at least one location in the panel or select Location(s) in the hosting plan.');
            }
            $payload['deploy'] = [
                'locations' => $locationIds,
                'dedicated_ip' => (bool) ($params['dedicated_ip'] ?? false),
                'port_range' => $params['port_range'] ?? [],
            ];
        }

        return $payload;
    }

    /**
     * Get nests (for admin dropdown). Uses same API as BetterPterodactyl: GET /api/application/nests.
     *
     * @return array<int, mixed>
     */
    public function getNests(): array
    {
        $data = $this->apiRequest('/api/application/nests', ['per_page' => 100]);

        return $data['data'] ?? [];
    }

    /**
     * Get eggs for a nest. Uses same API as BetterPterodactyl: GET /api/application/nests/{id}/eggs.
     *
     * @return array<int, mixed>
     */
    public function getEggs(int $nestId): array
    {
        $data = $this->apiRequest('/api/application/nests/'.$nestId.'/eggs', ['per_page' => 100]);

        return $data['data'] ?? [];
    }
}
