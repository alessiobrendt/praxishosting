<?php

namespace App\Services\ControlPanels;

use App\Models\HostingServer;
use App\Models\TeamSpeakServerAccount;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use PlanetTeamSpeak\TeamSpeak3Framework\Helper\StringHelper;
use PlanetTeamSpeak\TeamSpeak3Framework\Node\Host;
use PlanetTeamSpeak\TeamSpeak3Framework\Node\Server;
use PlanetTeamSpeak\TeamSpeak3Framework\TeamSpeak3;
use Throwable;

class TeamSpeakClient
{
    protected ?HostingServer $server = null;

    protected ?Host $host = null;

    public function setServer(HostingServer $server): void
    {
        $this->server = $server;
        $this->host = null;
    }

    /**
     * Build Server Query URI from HostingServer config.
     * Config: host, query_port, username, password (optional encrypted).
     */
    protected function getConnectionUri(): string
    {
        if (! $this->server) {
            throw new \RuntimeException('TeamSpeak server not configured');
        }

        $config = $this->server->config ?? [];
        $host = $config['host'] ?? $this->server->hostname ?? $this->server->ip_address ?? '127.0.0.1';
        $port = (int) ($config['query_port'] ?? $this->server->port ?? 10011);
        $username = $config['username'] ?? $this->server->api_username ?? 'serveradmin';
        $password = $config['password'] ?? null;

        if ($password === null && ! empty($config['password_encrypted'])) {
            try {
                $password = Crypt::decryptString($config['password_encrypted']);
            } catch (Throwable) {
                throw new \RuntimeException('TeamSpeak: failed to decrypt password');
            }
        }

        if ($password === null || $password === '') {
            throw new \RuntimeException('TeamSpeak: password must be set in server config');
        }

        $password = str_replace([' ', '|', ';', '\\', '/'], ['\\s', '\\p', '\\;', '\\\\', '\\/'], $password);

        return sprintf(
            'serverquery://%s:%s@%s:%d/',
            $username,
            $password,
            $host,
            $port
        );
    }

    protected function getHost(): Host
    {
        if ($this->host !== null) {
            return $this->host;
        }

        $uri = $this->getConnectionUri();
        $node = TeamSpeak3::factory($uri);

        if (! $node instanceof Host) {
            throw new \RuntimeException('TeamSpeak: expected Host instance');
        }

        $this->host = $node;

        return $this->host;
    }

    /**
     * Test Server Query connection. Returns ['success' => bool, 'message' => string, 'info' => array|null].
     *
     * @return array{success: bool, message: string, info?: array}
     */
    public function testConnection(): array
    {
        if (! $this->server) {
            return ['success' => false, 'message' => 'Server not configured'];
        }

        $config = $this->server->config ?? [];
        $host = $config['host'] ?? $this->server->hostname ?? '';
        $port = (int) ($config['query_port'] ?? $this->server->port ?? 10011);

        try {
            $this->getHost();

            return [
                'success' => true,
                'message' => 'TeamSpeak Server Query verbunden ('.$host.':'.$port.')',
                'info' => ['host' => $host, 'query_port' => $port],
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create a virtual server. Port must be from the allowed range (e.g. 10072–10221).
     *
     * @return array{virtual_server_id: int, port: int, token: string|null}
     */
    public function createVirtualServer(string $name, int $port, int $maxClients): array
    {
        $host = $this->getHost();

        $properties = [
            'virtualserver_name' => $name,
            'virtualserver_maxclients' => $maxClients,
        ];

        if ($port > 0) {
            $properties['virtualserver_port'] = $port;
        }

        $detail = $host->serverCreate($properties);

        $virtualServerId = (int) ($detail['sid'] ?? $detail['virtualserver_id'] ?? 0);
        $assignedPort = (int) ($detail['virtualserver_port'] ?? 0);
        $token = $detail['token'] ?? null;

        if ($assignedPort === 0 && $virtualServerId > 0) {
            $server = $host->serverGetById($virtualServerId);
            $assignedPort = (int) $server['virtualserver_port'];
        }

        return [
            'virtual_server_id' => $virtualServerId,
            'port' => $assignedPort,
            'token' => $token,
        ];
    }

    public function stopVirtualServer(int $virtualServerId): void
    {
        $this->getHost()->serverStop($virtualServerId);
    }

    public function startVirtualServer(int $virtualServerId): void
    {
        $this->getHost()->serverStart($virtualServerId);
    }

    public function deleteVirtualServer(int $virtualServerId): void
    {
        $this->getHost()->serverDelete($virtualServerId);
    }

    /**
     * Get virtual server info (connection string, uptime, clients, version, etc.).
     *
     * @return array<string, mixed>|null
     */
    public function getServerInfo(int $virtualServerId): ?array
    {
        try {
            $host = $this->getHost();
            $server = $host->serverGetById($virtualServerId);

            $config = $this->server->config ?? [];
            $hostAddr = $config['host'] ?? $this->server->hostname ?? $this->server->ip_address ?? '127.0.0.1';
            $voicePort = (int) $server['virtualserver_port'];

            return [
                'address' => $hostAddr.':'.$voicePort,
                'connection_uri' => 'ts3server://'.$hostAddr.'?port='.$voicePort,
                'virtualserver_uptime' => (int) ($server['virtualserver_uptime'] ?? 0),
                'virtualserver_clientsonline' => (int) ($server['virtualserver_clientsonline'] ?? 0),
                'virtualserver_queryclientsonline' => (int) ($server['virtualserver_queryclientsonline'] ?? 0),
                'virtualserver_maxclients' => (int) ($server['virtualserver_maxclients'] ?? 0),
                'virtualserver_version' => (string) ($server['virtualserver_version'] ?? ''),
                'virtualserver_name' => (string) ($server['virtualserver_name'] ?? ''),
                'virtualserver_status' => (string) ($server['virtualserver_status'] ?? 'unknown'),
            ];
        } catch (Throwable $e) {
            Log::warning('TeamSpeak getServerInfo failed', [
                'virtual_server_id' => $virtualServerId,
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Set virtual server name.
     */
    public function setServerName(int $virtualServerId, string $name): void
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);
        $server->modify(['virtualserver_name' => $name]);
    }

    /**
     * Set virtual server max clients (slots).
     */
    public function setServerMaxClients(int $virtualServerId, int $maxClients): void
    {
        $maxClients = max(1, min(9999, $maxClients));
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);
        $server->modify(['virtualserver_maxclients' => $maxClients]);
    }

    /**
     * List privilege keys (tokens) for the virtual server.
     *
     * @return array<int, array{token: string, group: string, description: string}>
     */
    public function listPrivilegeKeys(int $virtualServerId): array
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);

        $raw = $server->privilegeKeyList(true);
        $list = [];
        foreach ($raw as $token => $row) {
            $list[] = [
                'token' => $token,
                'group' => is_string($row['token_id1'] ?? null) ? $row['token_id1'] : 'Group '.($row['token_id1'] ?? ''),
                'description' => (string) ($row['token_description'] ?? ''),
            ];
        }

        return $list;
    }

    /**
     * Resolve the server group ID to use for token creation. If $serverGroupId is 0, returns the first
     * regular server group ID from servergrouplist (avoids serverGroupIdentify/GetProfiles which can trigger convert error).
     */
    protected function resolveTokenServerGroupId(Server $server, int $serverGroupId): int
    {
        if ($serverGroupId !== 0) {
            return (int) $serverGroupId;
        }

        $rows = $server->request('servergrouplist')->toArray();
        foreach ($rows as $row) {
            $type = (int) ($row['type'] ?? -1);
            if ($type === TeamSpeak3::GROUP_DBTYPE_REGULAR) {
                return (int) ($row['sgid'] ?? 0);
            }
        }

        return 1;
    }

    /**
     * Create a privilege key (server group token). If $serverGroupId is 0, uses the first regular server group.
     * Uses raw command and servergrouplist to avoid framework paths that trigger "convert error".
     *
     * @return string The token string.
     */
    public function createPrivilegeKey(int $virtualServerId, int $serverGroupId = 0, string $description = ''): string
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);

        $groupId = $this->resolveTokenServerGroupId($server, $serverGroupId);
        if ($groupId < 1) {
            throw new \RuntimeException('TeamSpeak: no regular server group found for token');
        }

        if ($description !== '') {
            $params = [
                'tokentype' => TeamSpeak3::TOKEN_SERVERGROUP,
                'tokenid1' => $groupId,
                'tokenid2' => 0,
                'tokendescription' => $description,
            ];
            $result = $server->execute('privilegekeyadd', $params)->toList();
        } else {
            $cmd = sprintf(
                'privilegekeyadd tokentype=0 tokenid1=%d tokenid2=0',
                $groupId
            );
            $result = $server->request($cmd)->toList();
        }

        return (string) ($result['token'] ?? '');
    }

    /**
     * Delete a privilege key by token string.
     */
    public function deletePrivilegeKey(int $virtualServerId, string $token): void
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);
        $server->privilegeKeyDelete($token);
    }

    /**
     * Create a server snapshot (backup). Uses framework snapshotCreate() so format matches snapshotDeploy.
     * Reply lines are joined with | by the framework; we store as returned (raw protocol form).
     */
    public function createSnapshot(int $virtualServerId): string
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);

        $raw = $server->snapshotCreate(TeamSpeak3::SNAPSHOT_STRING);
        $this->logSnapshotDebug('create', $raw);

        return $raw;
    }

    /**
     * Deploy a server snapshot (restore). Tries framework snapshotDeploy first; on "invalid parameter"
     * falls back to raw request with pipes escaped so server sees one parameter.
     */
    public function deploySnapshot(int $virtualServerId, string $snapshot): void
    {
        $host = $this->getHost();
        $server = $host->serverGetById($virtualServerId);

        if ($snapshot === '') {
            throw new \InvalidArgumentException('TeamSpeak: snapshot data is empty');
        }

        $this->logSnapshotDebug('deploy_input', $snapshot);

        try {
            $server->snapshotDeploy($snapshot, TeamSpeak3::SNAPSHOT_STRING);
            Log::debug('TeamSpeak snapshot deploy succeeded via framework snapshotDeploy()');

            return;
        } catch (\Throwable $e) {
            $msg = $e->getMessage();
            Log::warning('TeamSpeak snapshotDeploy (framework) failed', ['message' => $msg]);
            if (str_contains($msg, 'invalid parameter') || str_contains($msg, 'parameter count')) {
                $snapshot = $this->normalizeSnapshotForDeploy($snapshot);
                $escaped = $this->escapeSnapshotForDeploy($snapshot);
                $this->logSnapshotDebug('deploy_escaped', $escaped);
                $server->request('serversnapshotdeploy '.$escaped);
                Log::debug('TeamSpeak snapshot deploy sent via request(serversnapshotdeploy +escaped)');

                return;
            }
            throw $e;
        }
    }

    /**
     * Escape snapshot for Server Query: space→\s, pipe→\p so the server sees one parameter.
     */
    private function escapeSnapshotForDeploy(string $snapshot): string
    {
        if ($this->looksLikeProtocolEscaped($snapshot)) {
            return str_replace('|', '\\p', $snapshot);
        }

        return (string) StringHelper::factory($snapshot)->escape()->toUtf8();
    }

    private function looksLikeProtocolEscaped(string $s): bool
    {
        return str_contains($s, '\\s') || str_contains($s, '\\p');
    }

    /**
     * Strip optional "virtualserver_snapshot=" prefix so we do not duplicate the key when deploying.
     */
    private function normalizeSnapshotForDeploy(string $snapshot): string
    {
        $prefix = 'virtualserver_snapshot=';
        if (str_starts_with($snapshot, $prefix)) {
            return substr($snapshot, strlen($prefix));
        }

        return $snapshot;
    }

    /**
     * Debug: log snapshot length, snippet, and character stats to trace create/deploy format.
     */
    private function logSnapshotDebug(string $phase, string $snapshot): void
    {
        $len = strlen($snapshot);
        $snippet = $len > 0 ? substr($snapshot, 0, 250) : '';
        $hasNewline = str_contains($snapshot, "\n") || str_contains($snapshot, "\r");
        $pipeCount = substr_count($snapshot, '|');
        $backslashP = substr_count($snapshot, '\\p');
        $backslashS = substr_count($snapshot, '\\s');
        $literalSpace = substr_count($snapshot, ' ');

        Log::debug('TeamSpeak snapshot '.$phase, [
            'length' => $len,
            'snippet_start' => $snippet,
            'has_newline' => $hasNewline,
            'pipe_count' => $pipeCount,
            'escaped_p_count' => $backslashP,
            'escaped_s_count' => $backslashS,
            'literal_space_count' => $literalSpace,
        ]);
    }

    /**
     * Get channel and client tree for viewer (simplified).
     *
     * @return array{server: array, channels: array, clients: array}
     */
    public function getViewerTree(int $virtualServerId): array
    {
        try {
            $host = $this->getHost();
            $server = $host->serverGetById($virtualServerId);

            $channelList = $server->channelList();
            $clientList = $server->clientList();

            $channels = [];
            foreach ($channelList as $channel) {
                $channels[] = [
                    'id' => $channel->getId(),
                    'name' => (string) $channel['channel_name'],
                    'order' => (int) ($channel['channel_order'] ?? 0),
                ];
            }

            $clients = [];
            foreach ($clientList as $client) {
                $clients[] = [
                    'id' => $client->getId(),
                    'nickname' => (string) ($client['client_nickname'] ?? ''),
                    'type' => (int) ($client['client_type'] ?? 0),
                    'channel_id' => (int) ($client['cid'] ?? 0),
                ];
            }

            return [
                'server' => [
                    'id' => $server->getId(),
                    'name' => (string) $server['virtualserver_name'],
                    'clients_online' => (int) $server['virtualserver_clientsonline'],
                    'maxclients' => (int) $server['virtualserver_maxclients'],
                ],
                'channels' => $channels,
                'clients' => $clients,
            ];
        } catch (Throwable $e) {
            Log::warning('TeamSpeak getViewerTree failed', [
                'virtual_server_id' => $virtualServerId,
                'message' => $e->getMessage(),
            ]);

            return ['server' => [], 'channels' => [], 'clients' => []];
        }
    }

    /**
     * Get next available port from the configured range. Uses existing accounts on this server to skip used ports.
     */
    public function getNextAvailablePort(int $minPort = 10072, int $maxPort = 10221): int
    {
        $usedPorts = TeamSpeakServerAccount::query()
            ->where('hosting_server_id', $this->server->id)
            ->whereNotNull('port')
            ->pluck('port')
            ->map(fn ($p) => (int) $p)
            ->flip()
            ->all();

        try {
            $host = $this->getHost();
            $list = $host->serverList();
            if (is_array($list)) {
                foreach ($list as $s) {
                    $port = (int) $s['virtualserver_port'];
                    $usedPorts[$port] = true;
                }
            }
        } catch (Throwable) {
            // use only DB ports
        }

        for ($port = $minPort; $port <= $maxPort; $port++) {
            if (! isset($usedPorts[$port])) {
                return $port;
            }
        }

        throw new \RuntimeException('TeamSpeak: no free port in range '.$minPort.'-'.$maxPort);
    }
}
