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
     * POST request to Pterodactyl Application API (e.g. suspend, unsuspend).
     */
    protected function apiPost(string $path): void
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
        ])->timeout(15)->post($url);
        if (! $response->successful()) {
            $body = $response->json();
            $msg = $body['errors'][0]['detail'] ?? $body['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl API: '.$msg);
        }
    }

    /**
     * DELETE request to Pterodactyl Application API (e.g. delete server).
     */
    protected function apiDelete(string $path): void
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
        ])->timeout(30)->delete($url);
        if (! $response->successful()) {
            $body = $response->json();
            $msg = $body['errors'][0]['detail'] ?? $body['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl API: '.$msg);
        }
    }

    /**
     * PATCH request to Pterodactyl Application API (e.g. update server build).
     *
     * @param  array<string, mixed>  $data
     */
    protected function apiPatch(string $path, array $data): void
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
            'Content-Type' => 'application/json',
        ])->timeout(15)->patch($url, $data);
        if (! $response->successful()) {
            $body = $response->json();
            $msg = $body['errors'][0]['detail'] ?? $body['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl API: '.$msg);
        }
    }

    /**
     * Update server build (limits, feature_limits) on an existing Pterodactyl server.
     *
     * @param  array<string, mixed>  $params  memory, disk, swap, io, cpu, databases, backups, allocations
     */
    public function updateServerBuild(int $pterodactylServerId, array $params): void
    {
        $memory = (int) ($params['memory'] ?? 512);
        $swap = (int) ($params['swap'] ?? 0);
        $disk = (int) ($params['disk'] ?? 5120);
        $io = (int) ($params['io'] ?? 500);
        $cpu = (int) ($params['cpu'] ?? 0);
        $databases = (int) ($params['databases'] ?? 0);
        $backups = (int) ($params['backups'] ?? 0);
        $allocations = (int) ($params['allocations'] ?? 1);
        if ($allocations < 1) {
            $allocations = 1;
        }

        $payload = [
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
        ];

        $this->apiPatch('/api/application/servers/'.$pterodactylServerId.'/build', $payload);
    }

    /**
     * Suspend a server (Application API). Use when account period has expired.
     */
    public function suspendServer(GameServerAccount $account): void
    {
        if (! $account->pterodactyl_server_id || ! $account->hostingServer) {
            throw new Exception('Pterodactyl: server id or hosting server missing');
        }
        $this->setServer($account->hostingServer);
        $this->apiPost('/api/application/servers/'.$account->pterodactyl_server_id.'/suspend');
    }

    /**
     * Unsuspend a server (Application API). Use after successful renewal.
     */
    public function unsuspendServer(GameServerAccount $account): void
    {
        if (! $account->pterodactyl_server_id || ! $account->hostingServer) {
            throw new Exception('Pterodactyl: server id or hosting server missing');
        }
        $this->setServer($account->hostingServer);
        $this->apiPost('/api/application/servers/'.$account->pterodactyl_server_id.'/unsuspend');
    }

    /**
     * Delete a server from the panel (Application API). Use after grace period.
     */
    public function deleteServer(GameServerAccount $account): void
    {
        if (! $account->pterodactyl_server_id || ! $account->hostingServer) {
            throw new Exception('Pterodactyl: server id or hosting server missing');
        }
        $this->setServer($account->hostingServer);
        $this->apiDelete('/api/application/servers/'.$account->pterodactyl_server_id);
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
        if ($method === 'DELETE') {
            $response = $request->delete($url);
        } elseif ($method === 'POST' || $method === 'PATCH' || $method === 'PUT') {
            $response = $request->withBody(json_encode($body), 'application/json')->{strtolower($method)}($url);
        } else {
            $response = $request->get($url);
        }
        if (! $response->successful()) {
            $resBody = $response->json();
            $msg = $resBody['errors'][0]['detail'] ?? $resBody['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl Client API: '.$msg);
        }

        return $response->json() ?? [];
    }

    /**
     * Client API request that may return 204 No Content. Returns null on 204.
     *
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>|null
     */
    protected function clientApiRequestAllow204(string $path, string $method = 'GET', array $body = []): ?array
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
        ])->timeout(30);
        if ($method === 'DELETE') {
            $response = $request->delete($url);
        } elseif ($method === 'POST' || $method === 'PATCH' || $method === 'PUT') {
            $response = $request->withBody(json_encode($body), 'application/json')->{strtolower($method)}($url);
        } else {
            $response = $request->get($url);
        }
        if (! $response->successful()) {
            $resBody = $response->json();
            $msg = $resBody['errors'][0]['detail'] ?? $resBody['errors'][0]['code'] ?? $response->reason();

            throw new Exception('Pterodactyl Client API: '.$msg);
        }
        if ($response->status() === 204) {
            return null;
        }

        return $response->json() ?? [];
    }

    /**
     * Get websocket ticket for console. Returns ['token' => string, 'socket' => string].
     *
     * @return array{token: string, socket: string}
     */
    public function getWebsocketTicket(GameServerAccount $account): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/websocket');
        $attrs = $data['data'] ?? $data['attributes'] ?? $data;

        return [
            'token' => (string) ($attrs['token'] ?? ''),
            'socket' => (string) ($attrs['socket'] ?? ''),
        ];
    }

    /**
     * Send console command via Client API.
     */
    public function sendConsoleCommand(GameServerAccount $account, string $command): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/command', 'POST', ['command' => $command]);
    }

    /**
     * List files in a directory. Returns list of file objects (attributes: name, is_file, size, modified_at, etc.).
     *
     * @return array<int, array<string, mixed>>
     */
    public function listFiles(GameServerAccount $account, string $directory = '/'): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $path = '/api/client/servers/'.$account->identifier.'/files/list';
        $query = http_build_query(['directory' => $directory]);
        $data = $this->clientApiRequest($path.($query ? '?'.$query : ''));

        $list = [];
        foreach ($data['data'] ?? [] as $item) {
            $list[] = $item['attributes'] ?? $item;
        }

        return $list;
    }

    /**
     * Read file contents as text. For binary files consider download endpoint.
     */
    public function getFileContents(GameServerAccount $account, string $filePath): string
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = (string) ($config['client_api_key'] ?? $config['api_key'] ?? $this->server?->api_token ?? '');
        $url = $baseUri.'/api/client/servers/'.$account->identifier.'/files/contents?file='.rawurlencode($filePath);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => 'application/json',
        ])->timeout(15)->get($url);
        if (! $response->successful()) {
            $resBody = $response->json();
            $msg = $resBody['errors'][0]['detail'] ?? $response->reason();

            throw new Exception('Pterodactyl Client API: '.$msg);
        }

        return $response->body();
    }

    /**
     * Get raw HTTP response for file download (controller can stream to user).
     */
    public function getFileDownloadResponse(GameServerAccount $account, string $filePath): \Illuminate\Http\Client\Response
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = (string) ($config['client_api_key'] ?? $config['api_key'] ?? $this->server?->api_token ?? '');
        $url = $baseUri.'/api/client/servers/'.$account->identifier.'/files/download?file='.rawurlencode($filePath);

        return Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => '*/*',
        ])->timeout(60)->get($url);
    }

    /**
     * Write file contents (text). Content-Type is text/plain.
     */
    public function writeFile(GameServerAccount $account, string $filePath, string $content): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $config = $this->server?->config ?? [];
        $baseUri = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $apiKey = (string) ($config['client_api_key'] ?? $config['api_key'] ?? $this->server?->api_token ?? '');
        $url = $baseUri.'/api/client/servers/'.$account->identifier.'/files/write?file='.rawurlencode($filePath);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'text/plain',
        ])->timeout(15)->withBody($content, 'text/plain')->post($url);
        if (! $response->successful()) {
            $resBody = $response->json();
            $msg = $resBody['errors'][0]['detail'] ?? $response->reason();

            throw new Exception('Pterodactyl Client API: '.$msg);
        }
    }

    /**
     * Create a directory. root = parent path (e.g. "/"), name = new folder name.
     */
    public function createFolder(GameServerAccount $account, string $root, string $name): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/files/create-folder', 'POST', [
            'root' => $root,
            'name' => $name,
        ]);
    }

    /**
     * Delete files or directories. root = parent path, files = array of names.
     *
     * @param  array<int, string>  $files
     */
    public function deleteFiles(GameServerAccount $account, string $root, array $files): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/files/delete', 'POST', [
            'root' => $root,
            'files' => $files,
        ]);
    }

    /**
     * Rename/move files. root = parent path, files = array of [from => string, to => string].
     *
     * @param  array<int, array{from: string, to: string}>  $files
     */
    public function renameFiles(GameServerAccount $account, string $root, array $files): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/files/rename', 'PUT', [
            'root' => $root,
            'files' => $files,
        ]);
    }

    /**
     * Get signed upload URL for a directory. Returns the URL string to POST files to.
     */
    public function getUploadUrl(GameServerAccount $account, string $directory = '/'): string
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $path = '/api/client/servers/'.$account->identifier.'/files/upload';
        $query = http_build_query(['directory' => $directory]);
        $data = $this->clientApiRequest($path.($query ? '?'.$query : ''));

        return (string) (($data['attributes'] ?? $data)['url'] ?? '');
    }

    /**
     * Compress files into a zip archive. root = parent path, files = array of file/folder names.
     *
     * @param  array<int, string>  $files
     */
    public function compressFiles(GameServerAccount $account, string $root, array $files): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/files/compress', 'POST', [
            'root' => $root,
            'files' => $files,
        ]);
    }

    /**
     * Decompress an archive. root = parent path, file = archive file name.
     */
    public function decompressFile(GameServerAccount $account, string $root, string $file): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/files/decompress', 'POST', [
            'root' => $root,
            'file' => $file,
        ]);
    }

    /**
     * Get backup list. Returns array of backup attributes (uuid, name, bytes, created_at, is_successful, etc.).
     *
     * @return array<int, array<string, mixed>>
     */
    public function listBackups(GameServerAccount $account): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/backups');
        $list = [];
        foreach ($data['data'] ?? [] as $item) {
            $list[] = $item['attributes'] ?? $item;
        }

        return $list;
    }

    /**
     * Create backup. Returns backup attributes.
     *
     * @param  array{name?: string, ignored?: string, is_locked?: bool}  $options
     * @return array<string, mixed>
     */
    public function createBackup(GameServerAccount $account, array $options = []): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/backups', 'POST', $options);

        return $data['attributes'] ?? $data;
    }

    /**
     * Get backup download URL (signed). Returns ['url' => string].
     *
     * @return array{url: string}
     */
    public function getBackupDownloadUrl(GameServerAccount $account, string $backupUuid): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/backups/'.$backupUuid.'/download');

        return ['url' => (string) (($data['attributes'] ?? $data)['url'] ?? '')];
    }

    /**
     * Delete backup.
     */
    public function deleteBackup(GameServerAccount $account, string $backupUuid): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/backups/'.$backupUuid, 'DELETE');
    }

    /**
     * Restore backup.
     */
    public function restoreBackup(GameServerAccount $account, string $backupUuid, bool $truncate = true): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204(
            '/api/client/servers/'.$account->identifier.'/backups/'.$backupUuid.'/restore',
            'POST',
            ['truncate' => $truncate]
        );
    }

    /**
     * List schedules. Returns array of schedule attributes (id, name, cron, is_active, next_run_at, etc.).
     *
     * @return array<int, array<string, mixed>>
     */
    public function listSchedules(GameServerAccount $account): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/schedules');
        $list = [];
        foreach ($data['data'] ?? [] as $item) {
            $list[] = $item['attributes'] ?? $item;
        }

        return $list;
    }

    /**
     * Create schedule. Cron: minute, hour, day_of_month, month, day_of_week.
     *
     * @param  array{name: string, minute: string, hour: string, day_of_month: string, month: string, day_of_week: string, is_active?: bool, only_when_online?: bool}  $payload
     * @return array<string, mixed>
     */
    public function createSchedule(GameServerAccount $account, array $payload): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/schedules', 'POST', $payload);

        return $data['attributes'] ?? $data;
    }

    /**
     * Update schedule (PATCH). Partial payload allowed.
     *
     * @param  array<string, mixed>  $payload
     */
    public function updateSchedule(GameServerAccount $account, int $scheduleId, array $payload): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId, 'POST', $payload);
    }

    /**
     * Delete schedule.
     */
    public function deleteSchedule(GameServerAccount $account, int $scheduleId): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId, 'DELETE');
    }

    /**
     * Execute schedule now.
     */
    public function executeSchedule(GameServerAccount $account, int $scheduleId): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204('/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId.'/execute', 'POST');
    }

    /**
     * Get a single schedule with its tasks.
     *
     * @return array<string, mixed> schedule attributes including relationships.tasks
     */
    public function getSchedule(GameServerAccount $account, int $scheduleId): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest('/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId);

        return $data['attributes'] ?? $data;
    }

    /**
     * Create a task on a schedule. Payload: action (command|power|backup), payload (string), time_offset (int), continue_on_failure (bool).
     *
     * @param  array{action: string, payload: string, time_offset: int, continue_on_failure?: bool}  $payload
     * @return array<string, mixed> task attributes
     */
    public function createScheduleTask(GameServerAccount $account, int $scheduleId, array $payload): array
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $data = $this->clientApiRequest(
            '/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId.'/tasks',
            'POST',
            $payload
        );

        return $data['attributes'] ?? $data;
    }

    /**
     * Delete a schedule task.
     */
    public function deleteScheduleTask(GameServerAccount $account, int $scheduleId, int $taskId): void
    {
        $server = $account->hostingServer;
        if (! $server || ! $account->identifier) {
            throw new Exception('Pterodactyl: server or identifier missing');
        }
        $this->setServer($server);
        $this->clientApiRequestAllow204(
            '/api/client/servers/'.$account->identifier.'/schedules/'.$scheduleId.'/tasks/'.$taskId,
            'DELETE'
        );
    }

    /**
     * Get server overview (status, allocation, limits, usage) for a game server account.
     * Uses Application API for server/details and optional Client API for live resources/power.
     *
     * @return array{name: string, status: string, allocation: string, allocation_host?: string|null, allocation_port?: int|null, limits: array, usage: array, can_power: bool, nest_id?: int|null, egg_id?: int|null}|null
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
            $allocationHost = null;
            $allocationPort = null;
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
                            $allocationHost = $alias ?: $ip;
                            $allocationPort = (int) $port;
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

            $nestId = (int) ($attrs['nest'] ?? $attrs['nest_id'] ?? 0);
            $eggId = (int) ($attrs['egg'] ?? $attrs['egg_id'] ?? 0);

            return [
                'name' => (string) ($attrs['name'] ?? $account->name),
                'status' => $status,
                'allocation' => $allocation,
                'allocation_host' => $allocationHost,
                'allocation_port' => $allocationPort,
                'limits' => $limits,
                'usage' => $usage,
                'can_power' => $canPower,
                'is_installing' => ($attrs['status'] ?? null) === 'installing',
                'suspended' => (bool) ($attrs['suspended'] ?? false),
                'nest_id' => $nestId > 0 ? $nestId : null,
                'egg_id' => $eggId > 0 ? $eggId : null,
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
            Log::debug('Pterodactyl createAccount: findOrCreateUser', ['email' => $email, 'username' => $username]);
            $user = $this->findOrCreateUser($sdk, $email, $username, $firstName, $lastName, $password);
            $userId = is_object($user) && isset($user->id) ? (int) $user->id : (int) $user['id'] ?? 0;
            if ($userId === 0 && is_array($user)) {
                $userId = (int) ($user['attributes']['id'] ?? 0);
            }
            if ($userId === 0) {
                throw new Exception('Pterodactyl: could not resolve user id after create');
            }
            Log::debug('Pterodactyl createAccount: user resolved', ['user_id' => $userId]);

            $nodeId = isset($params['node']) ? (int) $params['node'] : 0;
            if ($nodeId > 0) {
                $allocationId = $this->resolveAllocationIdForNode($params);
                if ($allocationId > 0) {
                    $params['allocation_id'] = $allocationId;
                }
                Log::debug('Pterodactyl createAccount: allocation for node', ['node_id' => $nodeId, 'allocation_id' => $allocationId ?? 0]);
            } else {
                $allocationId = $this->resolveDeployableAllocation($params);
                if ($allocationId > 0) {
                    $params['allocation_id'] = $allocationId;
                }
                Log::debug('Pterodactyl createAccount: deployable allocation', ['allocation_id' => $allocationId]);
            }

            $serverPayload = $this->buildServerCreationPayload($params, $userId);
            $serverPayload['name'] = $serverName;
            $serverPayload['user'] = $userId;
            Log::info('Pterodactyl createAccount: creating server', [
                'server_name' => $serverName,
                'user_id' => $userId,
                'nest_id' => $serverPayload['nest_id'] ?? null,
                'egg_id' => $serverPayload['egg_id'] ?? null,
                'allocation_id' => $serverPayload['allocation_id'] ?? null,
            ]);

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
            $logContext = [
                'server' => $this->server->name ?? null,
                'error' => $e->getMessage(),
                'detail' => $detail,
                'exception' => $e::class,
                'params' => $paramsForLog,
            ];
            if ($previous instanceof \GuzzleHttp\Exception\RequestException && $previous->hasResponse()) {
                $body = (string) $previous->getResponse()->getBody();
                $logContext['response_body'] = strlen($body) > 2000 ? substr($body, 0, 2000).'...' : $body;
                $logContext['response_status'] = $previous->getResponse()->getStatusCode();
            }
            Log::error('Pterodactyl createAccount error', $logContext);

            $msg = $e->getMessage();
            if (str_contains($msg, 'No nodes satisfying the requirements') || str_contains($msg, 'could not be found')) {
                $memory = (int) ($params['memory'] ?? 512);
                $disk = (int) ($params['disk'] ?? 5120);
                $msg = "Kein Node mit freien Ressourcen gefunden (benötigt: {$memory} MB RAM, {$disk} MB Disk). Im Pterodactyl-Panel prüfen: Nodes → freie Kapazität, Allocations → ungenutzte Ports.";
            }

            throw new Exception('Pterodactyl: '.$msg, (int) $e->getCode(), $e);
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
     * Tries with plan location_ids first; if no node is found, retries without location filter.
     *
     * @param  array<string, mixed>  $params  Must include memory, disk; optional location_ids
     * @return int Allocation id
     */
    protected function resolveDeployableAllocation(array $params): int
    {
        $locationIds = $params['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $triedWithLocations = ! empty($locationIds);
        if (empty($locationIds)) {
            $locations = $this->getLocations();
            $locationIds = array_column($locations, 'id');
        }

        $allocId = $this->fetchDeployableAllocation((int) ($params['memory'] ?? 512), (int) ($params['disk'] ?? 5120), $locationIds);
        if ($allocId > 0) {
            return $allocId;
        }

        if ($triedWithLocations) {
            $allocId = $this->fetchDeployableAllocation((int) ($params['memory'] ?? 512), (int) ($params['disk'] ?? 5120), []);
            if ($allocId > 0) {
                Log::info('Pterodactyl: deployable allocation found without location filter (fallback).');

                return $allocId;
            }
        }

        $memory = (int) ($params['memory'] ?? 512);
        $disk = (int) ($params['disk'] ?? 5120);
        throw new Exception(
            'Pterodactyl: Kein Node mit freien Ressourcen gefunden. '
            ."Benötigt: {$memory} MB RAM, {$disk} MB Disk. "
            .'Bitte im Panel prüfen: Nodes haben genug freie Kapazität? Unter Nodes → Allocations sind ungenutzte Ports vorhanden?'
        );
    }

    /**
     * Call deployable API and return first free allocation id, or 0.
     *
     * @param  array<int>  $locationIds  Empty = any location
     */
    protected function fetchDeployableAllocation(int $memory, int $disk, array $locationIds): int
    {
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

        return 0;
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

    /**
     * Get a single egg with variables. GET /api/application/nests/{nest}/eggs/{egg}?include=variables.
     *
     * @return array<string, mixed> API response (object, attributes, relationships.variables)
     */
    public function getEggWithVariables(int $nestId, int $eggId): array
    {
        return $this->apiRequest('/api/application/nests/'.$nestId.'/eggs/'.$eggId, ['include' => 'variables']);
    }

    /**
     * Get node details by id. GET /api/application/nodes/{id}. Returns attributes (id, name, fqdn, etc.).
     *
     * @return array<string, mixed> Node attributes
     */
    public function getNodeById(int $nodeId): array
    {
        $data = $this->apiRequest('/api/application/nodes/'.$nodeId);

        return $data['attributes'] ?? $data;
    }

    /**
     * Get node FQDN and allocation port for a Pterodactyl server (by Application API server id).
     * Used after server creation to create DNS SRV record.
     *
     * @return array{node_fqdn: string, port: int}|null
     */
    public function getNodeFqdnAndPortForServer(int $pterodactylServerId): ?array
    {
        try {
            $data = $this->apiRequest('/api/application/servers/'.$pterodactylServerId);
            $attrs = $data['attributes'] ?? $data;
            $allocationId = (int) ($attrs['allocation'] ?? 0);
            $nodeId = (int) ($attrs['node'] ?? 0);
            if ($allocationId < 1 || $nodeId < 1) {
                return null;
            }
            $allocData = $this->apiRequest('/api/application/nodes/'.$nodeId.'/allocations', ['per_page' => 100]);
            $port = 0;
            foreach ($allocData['data'] ?? [] as $alloc) {
                $a = $alloc['attributes'] ?? $alloc;
                if ((int) ($a['id'] ?? 0) === $allocationId) {
                    $port = (int) ($a['port'] ?? 0);
                    break;
                }
            }
            if ($port < 1) {
                return null;
            }
            $nodeAttrs = $this->getNodeById($nodeId);
            $fqdn = (string) ($nodeAttrs['fqdn'] ?? $nodeAttrs['name'] ?? '');
            if ($fqdn === '') {
                return null;
            }

            return ['node_fqdn' => $fqdn, 'port' => $port];
        } catch (\Throwable $e) {
            Log::debug('Pterodactyl getNodeFqdnAndPortForServer failed', ['server_id' => $pterodactylServerId, 'error' => $e->getMessage()]);

            return null;
        }
    }
}
