<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudflareDnsService
{
    protected string $zoneId;

    protected string $apiToken;

    public function __construct(?string $zoneId = null, ?string $apiToken = null)
    {
        $this->zoneId = $zoneId ?? (string) config('services.cloudflare.zone_id', '');
        $this->apiToken = $apiToken ?? (string) config('services.cloudflare.api_token', '');
    }

    /**
     * Check if Cloudflare is configured.
     */
    public function isConfigured(): bool
    {
        return $this->zoneId !== '' && $this->apiToken !== '';
    }

    /**
     * List DNS records (optionally filtered by type and name).
     *
     * @param  array{type?: string, name?: string}  $params
     * @return array<int, array<string, mixed>>
     */
    protected function listRecords(array $params = []): array
    {
        if (! $this->isConfigured()) {
            return [];
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->apiToken,
            'Content-Type' => 'application/json',
        ])->timeout(15)->get(
            'https://api.cloudflare.com/client/v4/zones/'.$this->zoneId.'/dns_records',
            $params
        );

        if (! $response->successful()) {
            Log::warning('Cloudflare listRecords failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        $data = $response->json();
        $result = $data['result'] ?? [];

        return is_array($result) ? $result : [];
    }

    /**
     * List all SRV records from the zone (paginated API).
     *
     * @return array<int, array<string, mixed>>
     */
    public function listAllSrvRecords(): array
    {
        if (! $this->isConfigured()) {
            return [];
        }

        $all = [];
        $page = 1;
        $perPage = 100;

        do {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiToken,
                'Content-Type' => 'application/json',
            ])->timeout(15)->get(
                'https://api.cloudflare.com/client/v4/zones/'.$this->zoneId.'/dns_records',
                ['type' => 'SRV', 'per_page' => $perPage, 'page' => $page]
            );

            if (! $response->successful()) {
                Log::warning('Cloudflare listAllSrvRecords failed', [
                    'status' => $response->status(),
                    'page' => $page,
                ]);
                break;
            }

            $data = $response->json();
            $result = $data['result'] ?? [];
            if (! is_array($result)) {
                break;
            }
            foreach ($result as $record) {
                $all[] = $record;
            }
            $totalCount = (int) ($data['result_info']['total_count'] ?? 0);
            $page++;
        } while (count($all) < $totalCount && count($result) === $perPage);

        return $all;
    }

    /**
     * Delete a single DNS record by its Cloudflare record ID.
     */
    public function deleteSrvRecordById(string $recordId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->apiToken,
        ])->timeout(15)->delete(
            'https://api.cloudflare.com/client/v4/zones/'.$this->zoneId.'/dns_records/'.$recordId
        );

        if (! $response->successful()) {
            Log::warning('Cloudflare deleteSrvRecordById failed', [
                'record_id' => $recordId,
                'status' => $response->status(),
            ]);

            throw new \RuntimeException('Cloudflare API: Eintrag konnte nicht gelöscht werden.');
        }
    }

    /**
     * Check if an SRV record already exists for the given name.
     * Name can be relative (e.g. _minecraft._tcp.myserver) or FQDN; Cloudflare may store as FQDN.
     */
    public function srvRecordExists(string $recordName): bool
    {
        $zoneDomain = (string) config('services.cloudflare.zone_domain', '');
        $nameToCheck = $recordName;
        if ($zoneDomain !== '' && ! str_ends_with(strtolower($recordName), strtolower('.'.$zoneDomain))) {
            $nameToCheck = $recordName.'.'.$zoneDomain;
        }
        $records = $this->listRecords(['type' => 'SRV', 'name' => $nameToCheck]);
        if (count($records) > 0) {
            return true;
        }
        $records = $this->listRecords(['type' => 'SRV', 'name' => $recordName]);

        return count($records) > 0;
    }

    /**
     * Build the SRV record name for the given subdomain, service and protocol (relative to zone).
     * Format: _service._protocol.name (e.g. _minecraft._tcp.server-ataliq-vd4tsm.neroserv.cloud).
     * Service should already have leading underscore (e.g. _minecraft); protocol is normalized to _tcp/_udp/_tls.
     */
    public function buildSrvRecordName(string $subdomain, string $service, string $protocol): string
    {
        if ($service === '' || $protocol === 'none' || $protocol === '') {
            return '';
        }

        $protocol = strtolower(trim($protocol));
        if ($protocol !== '' && $protocol[0] !== '_') {
            $protocol = '_'.$protocol;
        }

        return strtolower($service.'.'.$protocol.'.'.$subdomain);
    }

    /**
     * Create an SRV record. Name is relative to zone (e.g. _minecraft._tcp.myserver).
     * Target is the node FQDN; port is the allocation port.
     */
    public function createSrvRecord(string $name, string $target, int $port, int $priority = 0, int $weight = 0): void
    {
        if (! $this->isConfigured()) {
            throw new \RuntimeException('Cloudflare DNS is not configured (CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN).');
        }

        $target = rtrim($target, '.');
        $targetWithDot = str_contains($target, '.') ? $target.'.' : $target.'.';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->apiToken,
            'Content-Type' => 'application/json',
        ])->timeout(15)->post(
            'https://api.cloudflare.com/client/v4/zones/'.$this->zoneId.'/dns_records',
            [
                'type' => 'SRV',
                'name' => $name,
                'data' => [
                    'priority' => $priority,
                    'weight' => $weight,
                    'port' => $port,
                    'target' => $targetWithDot,
                ],
            ]
        );

        if (! $response->successful()) {
            $body = $response->json();
            $errors = $body['errors'][0] ?? [];
            $message = is_array($errors) ? ($errors['message'] ?? $response->reason()) : $response->reason();

            throw new \RuntimeException('Cloudflare API: '.$message);
        }
    }

    /**
     * Delete an SRV record by name (relative to zone, e.g. _minecraft._tcp.myserver).
     * If multiple records match the name, all are deleted.
     */
    public function deleteSrvRecord(string $name): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $zoneDomain = (string) config('services.cloudflare.zone_domain', '');
        $nameToFind = $name;
        if ($zoneDomain !== '' && ! str_ends_with(strtolower($name), strtolower('.'.$zoneDomain))) {
            $nameToFind = $name.'.'.$zoneDomain;
        }
        $records = $this->listRecords(['type' => 'SRV', 'name' => $nameToFind]);
        if (count($records) === 0) {
            $records = $this->listRecords(['type' => 'SRV', 'name' => $name]);
        }
        foreach ($records as $record) {
            $id = $record['id'] ?? null;
            if ($id === null) {
                continue;
            }
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiToken,
            ])->timeout(15)->delete(
                'https://api.cloudflare.com/client/v4/zones/'.$this->zoneId.'/dns_records/'.$id
            );
            if (! $response->successful()) {
                Log::warning('Cloudflare deleteSrvRecord failed', [
                    'name' => $name,
                    'record_id' => $id,
                    'status' => $response->status(),
                ]);
            }
        }
    }
}
