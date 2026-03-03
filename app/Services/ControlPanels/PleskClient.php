<?php

namespace App\Services\ControlPanels;

use App\Models\HostingServer;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use PleskX\Api\Client as PleskXmlClient;
use PleskX\Api\Exception as PleskApiException;

class PleskClient
{
    protected Client $client;

    protected ?HostingServer $server = null;

    protected ?string $apiKey = null;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'verify' => false,
        ]);
    }

    public function setServer(HostingServer $server): void
    {
        $this->server = $server;
        $this->apiKey = $server->api_token;
    }

    /**
     * Plesk XML-RPC client (plesk/api-php-lib) for reseller-compatible operations.
     */
    protected function getPleskXmlClient(): PleskXmlClient
    {
        $host = $this->server->hostname;
        $port = $this->server->port !== null && (int) $this->server->port > 0 ? (int) $this->server->port : 8443;
        $protocol = ($this->server->use_ssl ?? true) ? 'https' : 'http';

        $plesk = new PleskXmlClient($host, $port, $protocol);
        if (! empty($this->server->api_username)) {
            $plesk->setCredentials($this->server->api_username, $this->server->api_token);
        } else {
            $plesk->setSecretKey($this->server->api_token);
        }

        return $plesk;
    }

    /**
     * IP for new webspace must be from the reseller's IP pool (not just any server IP).
     * Only the in HostingServer configured ip_address is used so you can set one that is in your pool.
     */
    protected function resolveIpForNewWebspace(): string
    {
        if (empty($this->server->ip_address)) {
            throw new Exception(
                'Plesk: Für die Webspace-Anlage muss unter Hosting-Server eine IP eingetragen sein, die in Ihrem Reseller-IP-Pool liegt. '
                .'In Plesk: Als Reseller anmelden → IP-Adressen – eine davon (z. B. Shared-IP) im Hosting-Server eintragen.'
            );
        }

        return trim($this->server->ip_address);
    }

    /**
     * Create a Plesk webspace account via XML API (reseller-compatible).
     * Uses plesk/api-php-lib: customer then webspace.
     */
    public function createAccount(string $username, string $domain, string $package, string $password, ?string $email = null): bool
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        $email = $email ?? 'webspace@placeholder.local';

        try {
            $plesk = $this->getPleskXmlClient();
            $plesk->customer()->create([
                'cname' => $username,
                'pname' => $username,
                'login' => $username,
                'passwd' => $password,
                'email' => $email,
            ]);
            $ipForWebspace = $this->resolveIpForNewWebspace();
            $plesk->webspace()->create(
                [
                    'name' => $domain,
                    'owner-login' => $username,
                    'ip_address' => $ipForWebspace,
                ],
                [
                    'ftp_login' => $username,
                    'ftp_password' => $password,
                    'php' => 'true',
                    'ssl' => 'true',
                    'webstat' => 'awstats',
                    'www-root' => "/var/www/vhosts/{$domain}",
                ],
                $package
            );
            Log::info('Plesk XML API account created', ['server' => $this->server->hostname, 'domain' => $domain]);

            return true;
        } catch (PleskApiException $e) {
            Log::error('Plesk XML API create account error', [
                'server' => $this->server->hostname,
                'domain' => $domain,
                'error' => $e->getMessage(),
            ]);

            throw new Exception('Plesk: '.$e->getMessage(), (int) $e->getCode(), $e);
        }
    }

    /**
     * Create a session token for the customer to log into Plesk panel (XML API server.create_session).
     * Returns the session ID or null on failure.
     */
    public function createCustomerSession(string $pleskUsername, string $clientIp): ?string
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        try {
            $plesk = $this->getPleskXmlClient();

            return $plesk->session()->create($pleskUsername, $clientIp);
        } catch (PleskApiException $e) {
            Log::warning('Plesk create_session failed', [
                'server' => $this->server->hostname,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    public function suspendAccount(string $username): bool
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        try {
            return $this->getPleskXmlClient()->customer()->disable('login', $username);
        } catch (PleskApiException $e) {
            Log::error('Plesk XML API suspend error', ['server' => $this->server->hostname, 'error' => $e->getMessage()]);

            return false;
        }
    }

    public function unsuspendAccount(string $username): bool
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        try {
            return $this->getPleskXmlClient()->customer()->enable('login', $username);
        } catch (PleskApiException $e) {
            Log::error('Plesk XML API unsuspend error', ['server' => $this->server->hostname, 'error' => $e->getMessage()]);

            return false;
        }
    }

    public function changePackage(string $username, string $newPackage): bool
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        try {
            $plesk = $this->getPleskXmlClient();
            $planGuid = null;
            foreach ($plesk->servicePlan()->getAll() as $plan) {
                if (($plan->name ?? '') === $newPackage && ! empty($plan->guid)) {
                    $planGuid = $plan->guid;
                    break;
                }
            }
            if ($planGuid === null) {
                Log::warning('Plesk changePackage: plan not found', ['plan' => $newPackage]);

                return false;
            }
            $customer = $plesk->customer()->get('login', $username);
            $webspaces = $plesk->webspace()->getAll();
            $ok = true;
            foreach ($webspaces as $ws) {
                if ($ws->ownerId === $customer->id) {
                    $plesk->webspace()->request([
                        'switch-subscription' => [
                            'filter' => ['name' => $ws->name],
                            'plan-guid' => $planGuid,
                        ],
                    ]);
                }
            }

            return $ok;
        } catch (PleskApiException $e) {
            Log::error('Plesk XML API change package error', ['server' => $this->server->hostname, 'error' => $e->getMessage()]);

            return false;
        }
    }

    public function terminateAccount(string $username): bool
    {
        if (! $this->server) {
            throw new Exception('Server not configured');
        }

        try {
            $plesk = $this->getPleskXmlClient();
            $customer = $plesk->customer()->get('login', $username);
            $webspaces = $plesk->webspace()->getAll();
            foreach ($webspaces as $ws) {
                if ($ws->ownerId === $customer->id) {
                    $plesk->webspace()->delete('name', $ws->name);
                }
            }

            return $plesk->customer()->delete('login', $username);
        } catch (PleskApiException $e) {
            Log::error('Plesk XML API terminate error', ['server' => $this->server->hostname, 'error' => $e->getMessage()]);

            return false;
        }
    }

    public function addAddon(string $username, string $addon): bool
    {
        $xml = $this->buildXmlRequest('site-addon.add', [
            'filter' => ['owner-login' => $username],
            'addon' => ['name' => $addon],
        ]);

        return $this->makeXmlApiCall($xml);
    }

    public function removeAddon(string $username, string $addon): bool
    {
        $xml = $this->buildXmlRequest('site-addon.del', [
            'filter' => ['owner-login' => $username],
            'addon' => ['name' => $addon],
        ]);

        return $this->makeXmlApiCall($xml);
    }

    /**
     * Test connection (XML API). Uses service plans list so Reseller API keys work.
     * Returns ['success' => bool, 'message' => string, 'info' => array|null].
     */
    public function testConnection(): array
    {
        if (! $this->server) {
            return ['success' => false, 'message' => 'Server not configured'];
        }

        try {
            $plans = $this->getPleskXmlClient()->servicePlan()->getAll();
            $count = is_countable($plans) ? count($plans) : 0;

            return [
                'success' => true,
                'message' => 'Connection successful',
                'info' => [
                    'service_plans_count' => $count,
                ],
            ];
        } catch (PleskApiException $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * List service plans (XML API). Returns array of plans with name, id, limits.
     *
     * @return array<int, array{name: string, id: int, disk_quota: mixed, bandwidth: mixed, domains: mixed, mailboxes: mixed, databases: mixed}>
     */
    public function getPackages(): array
    {
        if (! $this->server) {
            return [];
        }

        try {
            $items = $this->getPleskXmlClient()->servicePlan()->getAll();
            $plans = [];
            foreach ($items as $plan) {
                $plans[] = [
                    'name' => $plan->name ?? '',
                    'id' => $plan->id ?? 0,
                    'disk_quota' => null,
                    'bandwidth' => null,
                    'domains' => null,
                    'mailboxes' => null,
                    'databases' => null,
                ];
            }

            return $plans;
        } catch (Exception $e) {
            Log::warning('Plesk getPackages error', ['server' => $this->server->hostname, 'error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Get resource usage (stat + disk_usage) for a webspace via Plesk XML API.
     * Returns null on failure or if server not set.
     *
     * @return array{disk_bytes: int, domains_used: int, subdomains_used: int, mailboxes_used: int, databases_used: int}|null
     */
    public function getWebspaceResourceUsage(string $domain): ?array
    {
        if (! $this->server) {
            return null;
        }

        try {
            $plesk = $this->getPleskXmlClient();
            $packet = $plesk->getPacket();
            $webspace = $packet->addChild('webspace');
            $get = $webspace->addChild('get');
            $get->addChild('filter')->addChild('name', $domain);
            $dataset = $get->addChild('dataset');
            $dataset->addChild('stat');
            $dataset->addChild('disk_usage');

            $response = $plesk->request($packet, PleskXmlClient::RESPONSE_FULL);

            $result = $response->xpath('//result[status="ok"]');
            if (! $result || ! isset($result[0]->data)) {
                return null;
            }

            $data = $result[0]->data;
            $diskBytes = 0;
            if (isset($data->disk_usage)) {
                $du = $data->disk_usage;
                foreach (['httpdocs', 'httpsdocs', 'subdomains', 'web_users', 'anonftp', 'logs', 'dbases', 'mailboxes', 'webapps', 'maillists', 'domaindumps', 'configs', 'chroot'] as $key) {
                    if (isset($du->{$key}) && (string) $du->{$key} !== '') {
                        $diskBytes += (int) $du->{$key};
                    }
                }
            }

            $stat = $data->stat ?? null;
            $domainsUsed = 1;
            $subdomainsUsed = $stat && isset($stat->subdom) ? (int) $stat->subdom : 0;
            $mailboxesUsed = $stat && isset($stat->box) ? (int) $stat->box : 0;
            $databasesUsed = $stat && isset($stat->db) ? (int) $stat->db : 0;

            return [
                'disk_bytes' => $diskBytes,
                'domains_used' => $domainsUsed,
                'subdomains_used' => $subdomainsUsed,
                'mailboxes_used' => $mailboxesUsed,
                'databases_used' => $databasesUsed,
            ];
        } catch (PleskApiException $e) {
            Log::warning('Plesk getWebspaceResourceUsage failed', [
                'server' => $this->server->hostname,
                'domain' => $domain,
                'error' => $e->getMessage(),
            ]);

            return null;
        } catch (Exception $e) {
            Log::warning('Plesk getWebspaceResourceUsage error', [
                'server' => $this->server->hostname,
                'domain' => $domain,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    protected function getBaseUrl(): string
    {
        $protocol = ($this->server->use_ssl ?? true) ? 'https' : 'http';
        $host = $this->server->hostname;
        $port = $this->server->port;
        $port = $port === null || $port === '' ? null : (int) $port;
        if ($port !== null && $port > 0) {
            return $protocol.'://'.$host.':'.$port;
        }

        return $protocol.'://'.$host;
    }

    protected function makeXmlApiCall(string $xml): bool
    {
        $url = $this->getBaseUrl().'/api/v2/cli/server/';
        $headers = [
            'Content-Type' => 'text/xml',
            'HTTP_AUTH_KEY' => $this->apiKey,
            'KEY' => $this->apiKey,
        ];

        try {
            $response = $this->client->request('POST', $url, [
                'headers' => $headers,
                'body' => $xml,
            ]);

            $result = simplexml_load_string($response->getBody()->getContents());

            if ((string) $result->status === 'ok') {
                Log::info('Plesk API call successful', ['server' => $this->server->hostname]);

                return true;
            }

            Log::error('Plesk API call failed', [
                'server' => $this->server->hostname,
                'error' => (string) $result->errtext,
            ]);

            return false;
        } catch (GuzzleException $e) {
            Log::error('Plesk API call error', [
                'server' => $this->server->hostname,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    protected function buildXmlRequest(string $command, array $params): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<packet version="1.6.9.1">';
        $xml .= "<{$command}>";
        $xml .= $this->arrayToXml($params);
        $xml .= "</{$command}>";
        $xml .= '</packet>';

        return $xml;
    }

    /**
     * @param  array<string, mixed>  $array
     */
    protected function arrayToXml(array $array): string
    {
        $xml = '';
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                if (isset($value['name']) && isset($value['value'])) {
                    $xml .= '<'.$key.' name="'.htmlspecialchars($value['name'], ENT_XML1).'">'.htmlspecialchars((string) $value['value'], ENT_XML1).'</'.$key.'>';
                } else {
                    $xml .= '<'.$key.'>'.$this->arrayToXml($value).'</'.$key.'>';
                }
            } else {
                $xml .= '<'.$key.'>'.htmlspecialchars((string) $value, ENT_XML1).'</'.$key.'>';
            }
        }

        return $xml;
    }
}
