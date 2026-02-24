<?php

namespace App\Services\ControlPanels;

use App\Contracts\ControlPanelContract;
use App\Models\HostingServer;
use Exception;
use HCGCloud\Pterodactyl\Pterodactyl as PterodactylSdk;
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
     * Create a Pterodactyl user and game server.
     * Params: email, username, first_name, last_name, password, server_name, nest_id, egg_id,
     * memory, disk, cpu, swap, io, databases, backups, (optional) allocation_id or location_ids for deploy.
     *
     * @param  array<string, mixed>  $params
     */
    public function createAccount(array $params): bool
    {
        $sdk = $this->getSdk();

        $email = (string) ($params['email'] ?? '');
        $username = (string) ($params['username'] ?? Str::slug($params['server_name'] ?? 'user').'_'.Str::random(4));
        $firstName = (string) ($params['first_name'] ?? '');
        $lastName = (string) ($params['last_name'] ?? '');
        $password = (string) ($params['password'] ?? '');
        $serverName = (string) ($params['server_name'] ?? 'Game Server');

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
            Log::error('Pterodactyl createAccount error', [
                'server' => $this->server->name ?? null,
                'error' => $e->getMessage(),
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

        $sdk = $this->getSdk();
        $egg = $sdk->nest_eggs->get($nestId, $eggId);
        $dockerImage = $params['docker_image'] ?? (is_object($egg) ? ($egg->docker_image ?? '') : ($egg['attributes']['docker_image'] ?? ''));
        $startup = $params['startup'] ?? (is_object($egg) ? ($egg->startup ?? '') : ($egg['attributes']['startup'] ?? ''));

        $memory = (int) ($params['memory'] ?? 512);
        $swap = (int) ($params['swap'] ?? 0);
        $disk = (int) ($params['disk'] ?? 5120);
        $io = (int) ($params['io'] ?? 500);
        $cpu = (int) ($params['cpu'] ?? 0);
        $databases = (int) ($params['databases'] ?? 0);
        $backups = (int) ($params['backups'] ?? 0);
        $allocations = (int) ($params['allocations'] ?? 1);

        $payload = [
            'name' => (string) ($params['server_name'] ?? 'Game Server'),
            'user' => $userId,
            'egg' => $eggId,
            'docker_image' => $dockerImage,
            'startup' => $startup,
            'limits' => [
                'memory' => $memory,
                'swap' => $swap,
                'disk' => $disk,
                'io' => $io,
                'cpu' => $cpu,
            ],
            'feature_limits' => [
                'databases' => $databases,
                'backups' => $backups,
                'allocations' => $allocations,
            ],
            'environment' => $params['environment'] ?? [],
            'start_on_completion' => (bool) ($params['start_on_completion'] ?? true),
        ];

        if (isset($params['allocation_id']) && (int) $params['allocation_id'] > 0) {
            $payload['allocation'] = [
                'default' => (int) $params['allocation_id'],
                'additional' => [],
            ];
        } elseif (! empty($params['location_ids'])) {
            $payload['deploy'] = [
                'locations' => is_array($params['location_ids']) ? $params['location_ids'] : [$params['location_ids']],
                'dedicated_ip' => (bool) ($params['dedicated_ip'] ?? false),
                'port_range' => $params['port_range'] ?? [],
            ];
        } else {
            $payload['deploy'] = [
                'locations' => [],
                'dedicated_ip' => false,
                'port_range' => [],
            ];
        }

        return $payload;
    }

    /**
     * Get nests (for admin dropdown).
     *
     * @return array<int, array<string, mixed>>
     */
    /**
     * Get nests (for admin dropdown).
     *
     * @return array<int, mixed>
     */
    public function getNests(): array
    {
        $sdk = $this->getSdk();
        $list = $sdk->nests->paginate(1, ['per_page' => 100]);

        return is_object($list) && method_exists($list, 'all') ? $list->all() : ($list['data'] ?? []);
    }

    /**
     * Get eggs for a nest.
     *
     * @return array<int, mixed>
     */
    public function getEggs(int $nestId): array
    {
        $sdk = $this->getSdk();
        $nest = $sdk->nest_eggs->paginate($nestId, 1, ['per_page' => 100]);

        return is_object($nest) && method_exists($nest, 'all') ? $nest->all() : ($nest['data'] ?? []);
    }
}
