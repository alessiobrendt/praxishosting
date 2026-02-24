<?php

namespace Paymenter\Extensions\Servers\BetterPterodactyl;

use App\Classes\Extension\Server;
use App\Mail\Mail as TemplateMail;
use App\Models\Service;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\View;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class BetterPterodactyl extends Server
{
    protected static bool $remixIconsInjected = false;

    protected string $viewDirectory = __DIR__.'/resources/views';

    private function injectRemixIcons(): string
    {
        if (self::$remixIconsInjected) {
            return '';
        }
        self::$remixIconsInjected = true;

        return '<style>@import url("https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css");</style>';
    }

    private function renderView(string $template, array $data = []): string
    {
        try {
            $path = $this->viewDirectory.'/'.$template.'.blade.php';
            if (! file_exists($path)) {
                throw new \Exception("View file not found: {$template}.blade.php");
            }

            return View::file($path, array_merge($data, [
                'iconAssets' => $this->injectRemixIcons(),
            ]))->render();
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to render view', [
                'template' => $template,
                'error' => $e->getMessage(),
            ]);

            return '<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6"><h3 class="text-lg font-semibold text-red-800 dark:text-red-200">View Error</h3><p class="text-red-700 dark:text-red-300">Failed to render view: '.htmlspecialchars($e->getMessage()).'</p></div>';
        }
    }

    private function logMessage(string $level, string $message, array $context = [], bool $force = false): void
    {
        $level = strtolower($level);
        $alwaysLog = ['emergency', 'alert', 'critical', 'error'];

        if ($force || in_array($level, $alwaysLog, true)) {
            Log::log($level, $message, $context);

            return;
        }

        if ($this->shouldLogVerbose()) {
            Log::log($level, $message, $context);
        }
    }

    private function shouldLogVerbose(): bool
    {
        return (bool) $this->config('verbose_logging');
    }

    private function configBool(string $key, bool $default = false): bool
    {
        $value = $this->config($key);
        if ($value === null) {
            return $default;
        }
        if (is_bool($value)) {
            return $value;
        }
        if (is_numeric($value)) {
            return (bool) $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $default;
    }

    private function storeEncryptedPassword(Service $service, string $password): void
    {
        $encrypted = Crypt::encryptString($password);
        $service->properties()->updateOrCreate([
            'key' => 'current_password',
        ], [
            'name' => 'Current Password',
            'value' => $encrypted,
        ]);
    }

    private function decryptStoredPassword(Service $service): ?string
    {
        $passwordProperty = $service->properties()->where('key', 'current_password')->first();
        if (! $passwordProperty || ! $passwordProperty->value) {
            return null;
        }

        $storedValue = $passwordProperty->value;
        try {
            return Crypt::decryptString($storedValue);
        } catch (DecryptException $e) {
            $this->storeEncryptedPassword($service, $storedValue);

            return $storedValue;
        }
    }

    private function maskedPasswordPlaceholder(): string
    {
        return '***************';
    }

    private function passwordPreview(string $password): string
    {
        $length = strlen($password);
        if ($length <= 4) {
            return str_repeat('•', $length);
        }
        $start = substr($password, 0, 2);
        $end = substr($password, -2);

        return $start.str_repeat('•', max($length - 4, 0)).$end;
    }

    private function resolveServerMetadata(Service $service): array
    {
        $serviceProperties = $service->properties()->pluck('value', 'key')->toArray();
        $serverName = $serviceProperties['server_name'] ?? null;
        $serverIdentifier = $serviceProperties['server_identifier'] ?? null;

        if (! $serverName || ! $serverIdentifier) {
            try {
                $server = $this->getServer($service->id, raw: true);
                if ($server && isset($server['attributes'])) {
                    $serverName = $serverName ?? $server['attributes']['name'];
                    $serverIdentifier = $serverIdentifier ?? $server['attributes']['identifier'];
                }
            } catch (\Exception $e) {
                $serverName = $serverName ?? 'Unknown Server';
                $serverIdentifier = $serverIdentifier ?? 'Unknown';
            }
        }

        return [
            'serverName' => $serverName,
            'serverIdentifier' => $serverIdentifier,
            'panelUrl' => $this->config('host'),
        ];
    }

    private function sendSecurityMail(Service $service, string $type, array $meta = []): void
    {
        if (! $this->shouldSendSecurityMail($type)) {
            return;
        }

        $userEmail = $service->properties()->where('key', 'user_email')->value('value')
            ?? $service->user->email
            ?? null;

        if (! $userEmail) {
            return;
        }

        $ip = request()?->ip() ?? 'Unknown';
        $timestamp = now()->toDayDateTimeString();
        $metadata = $this->resolveServerMetadata($service);

        switch ($type) {
            case 'sso':
                $subject = 'Security Alert: Auto Login Used';
                $title = 'Auto Login Triggered';
                $intro = 'Your Pterodactyl panel was accessed via the Auto Login button.';
                $details = [
                    'Server Identifier' => $metadata['serverIdentifier'] ?? 'Unknown',
                    'User ID' => $meta['user_id'] ?? 'Unknown',
                    'IP Address' => $ip,
                    'Time' => $timestamp,
                ];
                break;
            case 'reveal':
                $subject = 'Security Notice: Password Revealed';
                $title = 'Password Reveal Requested';
                $intro = 'The saved Pterodactyl password was revealed from your client area.';
                $details = [
                    'Server Identifier' => $metadata['serverIdentifier'] ?? 'Unknown',
                    'Password Preview' => $meta['password_preview'] ?? 'Not available',
                    'IP Address' => $ip,
                    'Time' => $timestamp,
                ];
                break;
            case 'generated':
                $subject = 'Security Alert: Password Regenerated';
                $title = 'New Password Generated';
                $intro = 'A new Pterodactyl password has been generated from your client area.';
                $details = [
                    'Server Identifier' => $metadata['serverIdentifier'] ?? 'Unknown',
                    'Password Preview' => $meta['password_preview'] ?? 'Not available',
                    'IP Address' => $ip,
                    'Time' => $timestamp,
                ];
                break;
            default:
                $subject = 'Security Notice';
                $title = 'Security Notification';
                $intro = 'A security related action occurred on your account.';
                $details = [
                    'Server Identifier' => $metadata['serverIdentifier'] ?? 'Unknown',
                    'IP Address' => $ip,
                    'Time' => $timestamp,
                ];
        }

        $details['Panel URL'] = $metadata['panelUrl'] ?? $this->config('host');

        if (! $this->configBool('security_email_include_server_name', true)) {
            unset($details['Server Name']);
        } elseif (! empty($metadata['serverName'])) {
            $details = ['Server Name' => $metadata['serverName']] + $details;
        }

        $markdownTable = "| Detail | Value |\n| :----- | :----- |\n";
        foreach ($details as $label => $value) {
            if ($value !== null && $value !== '') {
                $markdownTable .= '| '.$label.' | '.$value." |\n";
            }
        }

        $body = <<<MD
# {$title}

{$intro}

{$markdownTable}

If you did not perform this action please reset your password immediately and contact support.
MD;

        $template = (object) [
            'subject' => $subject,
            'body' => $body,
            'bcc' => null,
            'cc' => null,
            'enabled' => true,
        ];

        $mailData = array_merge($meta, [
            'title' => $title,
            'intro' => $intro,
        ]);

        try {
            Mail::to($userEmail)->send(new TemplateMail($template, $mailData));
        } catch (\Throwable $e) {
            $this->logMessage('error', 'BetterPterodactyl security mail failed', [
                'service_id' => $service->id,
                'email' => $userEmail,
                'type' => $type,
                'error' => $e->getMessage(),
            ], true);
        }
    }

    private function shouldSendSecurityMail(string $type): bool
    {
        if (! $this->configBool('security_email_enable', true)) {
            return false;
        }

        $map = [
            'sso' => 'security_email_auto_login',
            'reveal' => 'security_email_reveal_password',
            'generated' => 'security_email_generate_password',
        ];

        $key = $map[$type] ?? null;
        if ($key === null) {
            return true;
        }

        return $this->configBool($key, true);
    }

    public function getConfig($values = []): array
    {
        return [
            [
                'name' => 'Notice',
                'type' => 'placeholder',
                'label' => new HtmlString(
                    'Enhanced Pterodactyl integration with SSO, secure password management, and advanced security features for Paymenter.
                     <br><br><small><i>Need support? Join our Discord at <a href="https://discord.gg/DP3atuhnsB">https://discord.gg/DP3atuhnsB</a></i></small>'
                ),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'Connection Settings',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'host',
                'type' => 'text',
                'label' => 'Pterodactyl URL',
                'description' => 'The full URL to your Pterodactyl panel (e.g., https://panel.example.com)',
                'required' => true,
                'validation' => 'url',
            ],
            [
                'name' => 'api_key',
                'type' => 'text',
                'label' => 'Application API Key',
                'description' => 'Application API key from your Pterodactyl panel (Admin Area → Application API)',
                'required' => true,
                'encrypted' => true,
            ],
            [
                'name' => 'client_api_key',
                'type' => 'text',
                'label' => 'Client API Key',
                'description' => 'Client API key for real-time server management (start/stop/restart, resource usage). Get this from your Pterodactyl panel: Account → API Credentials → Create API Key. Required for Server Overview tab features.',
                'required' => false,
                'encrypted' => true,
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'Single Sign-On (SSO)',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'sso_secret',
                'type' => 'text',
                'label' => 'SSO Secret Key',
                'description' => 'Secret key for SSO authentication. Leave empty to disable SSO functionality.',
                'required' => false,
                'encrypted' => true,
            ],
            [
                'name' => 'sso_endpoint',
                'type' => 'text',
                'label' => 'SSO Endpoint Path',
                'description' => 'Path on the panel that handles SSO requests',
                'required' => false,
                'default' => '/sso-wemx/',
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'Customer Options',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'allow_custom_server_name',
                'type' => 'checkbox',
                'label' => 'Allow Custom Server Name',
                'default' => true,
                'description' => 'Allow customers to specify a custom server name during checkout.',
                'database_type' => 'boolean',
            ],
            [
                'name' => 'allow_customer_egg_selection',
                'type' => 'checkbox',
                'label' => 'Allow Customer Egg Selection',
                'default' => false,
                'description' => 'Allow customers to choose which egg they want from the nest configured in the product.',
                'database_type' => 'boolean',
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'Advanced Options',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'verbose_logging',
                'type' => 'checkbox',
                'label' => 'Enable Verbose Logging',
                'default' => false,
                'description' => 'Log detailed diagnostics for SSO and API interactions (for troubleshooting).',
                'database_type' => 'boolean',
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'Security Notifications',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => '',
                'type' => 'placeholder',
                'label' => new HtmlString(''),
            ],
            [
                'name' => 'security_email_enable',
                'type' => 'checkbox',
                'label' => 'Enable Security Email Alerts',
                'default' => true,
                'description' => 'Send email notifications when sensitive actions occur.',
                'database_type' => 'boolean',
            ],
            [
                'name' => 'security_email_auto_login',
                'type' => 'checkbox',
                'label' => 'Alert On Auto Login (SSO)',
                'default' => true,
                'description' => 'Notify customers when they use the Auto Login feature.',
                'database_type' => 'boolean',
            ],
            [
                'name' => 'security_email_reveal_password',
                'type' => 'checkbox',
                'label' => 'Alert On Password Reveal',
                'default' => true,
                'description' => 'Notify customers when their password is revealed.',
                'database_type' => 'boolean',
            ],
            [
                'name' => 'security_email_generate_password',
                'type' => 'checkbox',
                'label' => 'Alert On Password Generation',
                'default' => true,
                'description' => 'Notify customers when a new password is generated.',
                'database_type' => 'boolean',
            ],
            [
                'name' => 'security_email_include_server_name',
                'type' => 'checkbox',
                'label' => 'Include Server Name In Alerts',
                'default' => true,
                'description' => 'Include the server name in security email notifications.',
                'database_type' => 'boolean',
            ],
        ];
    }

    public function testConfig(): bool|string
    {
        try {
            $this->request('/api/application/servers', 'GET');
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        return true;
    }

    public function getCheckoutConfig($product, $values = [], $settings = [])
    {
        $config = [];

        if ($this->configBool('allow_custom_server_name', true)) {
            $config[] = [
                'name' => 'server_name',
                'label' => 'Server Name',
                'type' => 'text',
                'required' => true,
                'description' => 'Enter a name for your server',
                'placeholder' => 'My Game Server',
                'validation' => 'required|string|max:255',
            ];
        }

        $globalEggSelectionEnabled = $this->configBool('allow_customer_egg_selection', false);
        $productAllowsEggSelection = ! empty($settings['allow_egg_selection_override']);

        if ($globalEggSelectionEnabled && $productAllowsEggSelection && ! empty($settings['nest_id'])) {
            try {
                $eggs = $this->request('/api/application/nests/'.$settings['nest_id'].'/eggs');
                $eggOptions = [];

                foreach ($eggs['data'] as $egg) {
                    $eggOptions[$egg['attributes']['id']] = $egg['attributes']['name'];
                }

                if (! empty($eggOptions)) {
                    $config[] = [
                        'name' => 'selected_egg_id',
                        'label' => 'Server Type',
                        'type' => 'select',
                        'options' => $eggOptions,
                        'required' => true,
                        'description' => 'Choose which type of server you want to create',
                        'default' => $settings['egg_id'] ?? null,
                    ];
                }
            } catch (\Exception $e) {
                $this->logMessage('warning', 'Failed to fetch eggs for customer selection', [
                    'nest_id' => $settings['nest_id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $config;
    }

    public function request($url, $method = 'get', $data = []): array
    {
        $reqUrl = rtrim($this->config('host'), '/').$url;
        $requestId = (string) Str::uuid();
        $method = strtolower((string) $method);
        $methodName = strtoupper($method);

        $isClientApi = str_starts_with($url, '/api/client/');
        $apiKey = $isClientApi && $this->config('client_api_key')
            ? $this->config('client_api_key')
            : $this->config('api_key');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$apiKey,
                'Accept' => 'application/json',
            ])->connectTimeout(5)
                ->timeout(15)
                ->retry(1, 250)
                ->$method($reqUrl, $data);
        } catch (ConnectionException $e) {
            $this->logMessage('error', 'BetterPterodactyl API request connection failure', [
                'request_id' => $requestId,
                'method' => $methodName,
                'url' => $reqUrl,
                'message' => $e->getMessage(),
            ]);
            throw new \Exception('Unable to reach the Pterodactyl API. Please try again later.');
        } catch (\Throwable $e) {
            $this->logMessage('error', 'BetterPterodactyl API request unexpected exception', [
                'request_id' => $requestId,
                'method' => $methodName,
                'url' => $reqUrl,
                'message' => $e->getMessage(),
            ]);
            throw new \Exception('Unexpected error while communicating with the Pterodactyl API.');
        }

        if (! $response->successful()) {
            $statusCode = $response->status();
            $body = $response->json();
            $errorMessage = data_get($body, 'errors.0.detail')
                ?? data_get($body, 'errors.0.code')
                ?? $response->reason();

            $this->logMessage('warning', 'BetterPterodactyl API request returned error response', [
                'request_id' => $requestId,
                'method' => $methodName,
                'url' => $reqUrl,
                'status' => $statusCode,
                'error' => $errorMessage,
            ]);

            if ($statusCode === 401 || $statusCode === 403 ||
                (is_string($errorMessage) && stripos($errorMessage, 'unauthorized') !== false)) {

                $isClientApi = str_starts_with($url, '/api/client/');
                $apiKeyType = $isClientApi ? 'Client API Key' : 'Application API Key';

                if ($statusCode === 401) {
                    throw new \Exception("Authentication failed: The {$apiKeyType} is invalid or expired. Please check your API key configuration in the server module settings.");
                } elseif ($statusCode === 403) {
                    throw new \Exception("Authorization failed: The {$apiKeyType} does not have the required permissions. Please ensure your API key has the necessary read/write permissions in your Pterodactyl panel (Admin Area → Application API → Edit API Key).");
                } else {
                    throw new \Exception("Authorization error: The {$apiKeyType} may not have the required permissions. Please verify your API key configuration and permissions in your Pterodactyl panel.");
                }
            }

            throw new \Exception($errorMessage ?: 'Pterodactyl API responded with an error.');
        }

        return $response->json() ?? [];
    }

    public function getProductConfig($values = []): array
    {
        if (! $this->config('api_key')) {
            throw new \Exception('Application API Key is not configured. Please configure it in the server module settings.');
        }

        $nodeList = [];
        $locationList = [];
        $nestList = [];
        $eggList = [];

        try {
            $nodes = $this->request('/api/application/nodes');
            foreach ($nodes['data'] ?? [] as $node) {
                $nodeList[$node['attributes']['id']] = $node['attributes']['name'];
            }
        } catch (\Exception $e) {
            $this->logMessage('error', 'Failed to fetch nodes in getProductConfig', [
                'error' => $e->getMessage(),
            ]);
            if (str_contains(strtolower($e->getMessage()), 'unauthorized')) {
                throw new \Exception('Unable to fetch nodes: The Application API Key does not have the required permissions. Please ensure your API key has "Read" permissions for Nodes, Locations, and Nests in your Pterodactyl panel (Admin Area → Application API → Edit API Key).');
            }
            throw new \Exception('Failed to fetch nodes from Pterodactyl API: '.$e->getMessage());
        }

        try {
            $location = $this->request('/api/application/locations');
            foreach ($location['data'] ?? [] as $location) {
                $locationList[$location['attributes']['id']] = $location['attributes']['short'];
            }
        } catch (\Exception $e) {
            $this->logMessage('error', 'Failed to fetch locations in getProductConfig', [
                'error' => $e->getMessage(),
            ]);
            if (str_contains(strtolower($e->getMessage()), 'unauthorized')) {
                throw new \Exception('Unable to fetch locations: The Application API Key does not have the required permissions. Please ensure your API key has "Read" permissions for Locations in your Pterodactyl panel (Admin Area → Application API → Edit API Key).');
            }
            throw new \Exception('Failed to fetch locations from Pterodactyl API: '.$e->getMessage());
        }

        try {
            $nests = $this->request('/api/application/nests');
            foreach ($nests['data'] ?? [] as $nest) {
                $nestList[$nest['attributes']['id']] = $nest['attributes']['name'];
            }
        } catch (\Exception $e) {
            $this->logMessage('error', 'Failed to fetch nests in getProductConfig', [
                'error' => $e->getMessage(),
            ]);
            if (str_contains(strtolower($e->getMessage()), 'unauthorized')) {
                throw new \Exception('Unable to fetch nests: The Application API Key does not have the required permissions. Please ensure your API key has "Read" permissions for Nests in your Pterodactyl panel (Admin Area → Application API → Edit API Key).');
            }
            throw new \Exception('Failed to fetch nests from Pterodactyl API: '.$e->getMessage());
        }

        if (isset($values['nest_id']) && $values['nest_id'] !== '') {
            try {
                $eggs = $this->request('/api/application/nests/'.$values['nest_id'].'/eggs');
                foreach ($eggs['data'] ?? [] as $egg) {
                    $eggList[$egg['attributes']['id']] = $egg['attributes']['name'];
                }
            } catch (\Exception $e) {
                $this->logMessage('warning', 'Failed to fetch eggs in getProductConfig', [
                    'nest_id' => $values['nest_id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $using_port_array = isset($values['port_array']) && $values['port_array'] !== '';

        return [
            [
                'name' => 'location_ids',
                'label' => 'Location(s)',
                'type' => 'select',
                'description' => 'Location(s) where the server will be installed',
                'options' => $locationList,
                'multiple' => true,
                'database_type' => 'array',
                'required' => false,
            ],
            [
                'name' => 'node',
                'label' => 'Node',
                'type' => 'select',
                'description' => 'Fill in to install the server on a specific node',
                'options' => $nodeList,
            ],
            [
                'name' => 'nest_id',
                'label' => 'Nest',
                'type' => 'select',
                'options' => $nestList,
                'description' => 'Select the nest that contains the eggs/game types for this product',
                'required' => true,
                'live' => true,
            ],
            [
                'name' => 'egg_id',
                'label' => 'Default Egg',
                'type' => 'select',
                'options' => $eggList,
                'required' => true,
                'description' => 'Default egg for this product (can be overridden by customer if egg selection is enabled)',
            ],
            [
                'name' => 'allow_egg_selection_override',
                'label' => 'Allow Customer Egg Selection',
                'type' => 'checkbox',
                'description' => 'Allow customers to choose from all eggs in this nest during checkout (requires global setting to be enabled)',
                'required' => false,
                'default' => false,
            ],
            [
                'name' => 'memory',
                'label' => 'Memory',
                'type' => 'number',
                'suffix' => 'MiB',
                'required' => true,
                'validation' => 'numeric',
                'min_value' => 0,
                'description' => 'Set to 0 for unlimited',
            ],
            [
                'name' => 'swap',
                'label' => 'Swap',
                'type' => 'number',
                'min_value' => -1,
                'suffix' => 'MiB',
                'required' => true,
                'description' => 'Set to -1 for unlimited, or to 0 to disable swap',
            ],
            [
                'name' => 'disk',
                'label' => 'Disk',
                'type' => 'number',
                'suffix' => 'MiB',
                'required' => true,
                'min_value' => 0,
                'description' => 'Set to 0 for unlimited',
            ],
            [
                'name' => 'io',
                'label' => 'IO Weight',
                'type' => 'number',
                'required' => true,
                'default' => 500,
                'min_value' => 10,
                'max_value' => 1000,
                'description' => 'The IO Weight is the priority given to this server for disk access.',
                'hint' => new HtmlString('<a href="https://docs.docker.com/engine/reference/run/#block-io-bandwidth-blkio-constraint" target="_blank">Documentation</a>'),
            ],
            [
                'name' => 'cpu',
                'label' => 'CPU Limit',
                'type' => 'number',
                'required' => true,
                'min_value' => 0,
                'suffix' => '%',
                'description' => 'Set to 0 for unlimited',
            ],
            [
                'name' => 'cpu_pinning',
                'label' => 'CPU Pinning',
                'type' => 'text',
                'description' => 'Leave empty for no pinning. Used to specify what threads should be used. Example: 0,2-4,5,6',
                'validation' => 'regex:/^[0-9]+(?:-[0-9]+)?(?:,[0-9]+(?:-[0-9]+)?)*$/',
            ],
            [
                'name' => 'databases',
                'label' => 'Databases',
                'type' => 'number',
                'required' => true,
                'min_value' => 0,
            ],
            [
                'name' => 'backups',
                'label' => 'Backups',
                'type' => 'number',
                'required' => true,
                'min_value' => 0,
            ],
            [
                'name' => 'additional_allocations',
                'label' => 'Additional Allocations',
                'type' => 'number',
                'required' => true,
                'min_value' => 0,
            ],
            [
                'name' => 'port_array',
                'label' => 'Port Array',
                'type' => 'text',
                'description' => 'Used to assign ports to egg variables.',
                'hint' => new HtmlString('<a href="https://paymenter.org/docs/extensions/pterodactyl#port-array" target="_blank">Documentation</a>'),
                'live' => true,
                'validation' => 'json',
            ],
            [
                'name' => 'port_range',
                'label' => 'Port ranges',
                'type' => 'tags',
                'description' => '',
                'database_type' => 'array',
                'required' => false,
                'disabled' => $using_port_array,
            ],
            [
                'name' => 'skip_scripts',
                'label' => 'Skip Egg Install Script',
                'description' => 'If the selected Egg has an install script attached to it, the script will run during the install. If you would like to skip this step, check this box.',
                'type' => 'checkbox',
            ],
            [
                'name' => 'dedicated_ip',
                'label' => 'Dedicated IP',
                'description' => 'Assigns the server an allocation whose IP is not being used by any other server.',
                'type' => 'checkbox',
                'disabled' => $using_port_array,
            ],
            [
                'name' => 'start_on_completion',
                'label' => 'Start on completion',
                'description' => 'Start server automatically after installation.',
                'type' => 'checkbox',
            ],
            [
                'name' => 'oom_killer',
                'label' => 'Enable OOM Killer',
                'description' => 'Terminates the server if it breaches the memory limits. Enabling OOM killer may cause server processes to exit unexpectedly.',
                'type' => 'checkbox',
            ],
        ];
    }

    public function createServer(Service $service, $settings, $properties)
    {
        if ($this->getServer($service->id, failIfNotFound: false)) {
            throw new \Exception('Server already exists');
        }
        $settings = array_merge($settings, $properties);

        if (! empty($properties['selected_egg_id'])) {
            $settings['egg_id'] = $properties['selected_egg_id'];
            $this->logMessage('info', 'Customer selected custom egg', [
                'service_id' => $service->id,
                'selected_egg_id' => $properties['selected_egg_id'],
                'default_egg_id' => $settings['egg_id'] ?? 'none',
            ]);
        }

        if (! isset($settings['nest_id']) || $settings['nest_id'] === '') {
            throw new \Exception('Nest ID is missing. Please select a nest.');
        }
        if (! isset($settings['egg_id']) || $settings['egg_id'] === '') {
            throw new \Exception('Egg ID is missing. Please select an egg.');
        }

        $eggData = $this->request('/api/application/nests/'.$settings['nest_id'].'/eggs/'.$settings['egg_id'], data: ['include' => 'variables']);
        if (! isset($eggData['attributes'])) {
            throw new \Exception('Could not fetch egg data');
        }
        $environment = [];
        foreach ($eggData['attributes']['relationships']['variables']['data'] as $variable) {
            $environment[$variable['attributes']['env_variable']] = $settings[$variable['attributes']['env_variable']] ?? $variable['attributes']['default_value'];
        }

        $orderUser = $service->user;
        $user = $this->request('/api/application/users', 'get', ['filter' => ['email' => $orderUser->email]])['data'][0]['attributes']['id'] ?? null;

        if (! $user) {
            $user = $this->request('/api/application/users', 'post', [
                'email' => $orderUser->email,
                'username' => (preg_replace('/[^a-zA-Z0-9]/', '', strtolower(Str::transliterate($orderUser->name))) ?? Str::random(8)).'_'.Str::random(4),
                'first_name' => $orderUser->first_name ?? '',
                'last_name' => $orderUser->last_name ?? '',
            ])['attributes']['id'];
            $returnData['created_user'] = true;
        }

        $deploymentData = $this->generateDeploymentData($settings, $environment);
        $serverName = $properties['server_name'] ?? $settings['servername'] ?? $service->product->name.' #'.$service->id;

        $serverCreationData = [
            'external_id' => (string) $service->id,
            'name' => $serverName,
            'user' => (int) $user,
            'egg' => $settings['egg_id'],
            'docker_image' => $eggData['attributes']['docker_image'],
            'startup' => $eggData['attributes']['startup'],
            'environment' => $deploymentData['environment'],
            'skip_scripts' => $settings['skip_scripts'] ?? false,
            'oom_disabled' => ! ($settings['oom_killer'] ?? false),
            'limits' => [
                'memory' => (int) $settings['memory'],
                'swap' => (int) $settings['swap'],
                'disk' => (int) $settings['disk'],
                'io' => (int) $settings['io'],
                'threads' => $settings['cpu_pinning'] ?? null,
                'cpu' => (int) $settings['cpu'],
            ],
            'feature_limits' => [
                'databases' => (int) $settings['databases'],
                'allocations' => $deploymentData['allocations_needed'] + (int) $settings['additional_allocations'],
                'backups' => (int) $settings['backups'],
            ],
            'start_on_completion' => $settings['start_on_completion'] ?? false,
        ];
        if ($deploymentData['auto_deploy']) {
            $serverCreationData['deploy'] = [
                'locations' => $settings['location_ids'] ?? [],
                'dedicated_ip' => $settings['dedicated_ip'] ?? false,
                'port_range' => $settings['port_range'] ?? [],
            ];
        } else {
            $serverCreationData['allocation'] = $deploymentData['allocation'];
        }

        $server = $this->request('/api/application/servers', 'post', $serverCreationData);

        $service->properties()->updateOrCreate([
            'key' => 'user_id',
        ], [
            'name' => 'Pterodactyl User ID',
            'value' => $user,
        ]);

        $service->properties()->updateOrCreate([
            'key' => 'server_id',
        ], [
            'name' => 'Pterodactyl Server ID',
            'value' => $server['attributes']['id'],
        ]);

        $service->properties()->updateOrCreate([
            'key' => 'server_identifier',
        ], [
            'name' => 'Pterodactyl Server Identifier',
            'value' => $server['attributes']['identifier'],
        ]);

        $service->properties()->updateOrCreate([
            'key' => 'server_name',
        ], [
            'name' => 'Server Name',
            'value' => $serverName,
        ]);

        $userEmail = $orderUser->email;
        $service->properties()->updateOrCreate([
            'key' => 'user_email',
        ], [
            'name' => 'User Email',
            'value' => $userEmail,
        ]);

        return [
            'server' => $server['attributes']['id'],
            'link' => $this->config('host').'/server/'.$server['attributes']['identifier'],
        ];
    }

    private function generateDeploymentData($settings, $environment)
    {
        if (! isset($settings['port_array']) || $settings['port_array'] === '') {
            if ($settings['node']) {
                $nodes = $this->request('/api/application/nodes/deployable', 'get', [
                    'memory' => $settings['memory'],
                    'disk' => $settings['disk'],
                    'location_ids' => $settings['location_ids'] ?? [],
                    'include' => ['allocations'],
                ]);
                $nodes = collect($nodes['data']);
                $nodes_by_id = $nodes->mapWithKeys(fn ($node) => [$node['attributes']['id'] => $node['attributes']]);

                if (! $nodes_by_id->has($settings['node'])) {
                    $nodeName = 'Unknown';
                    $nodeDetails = null;
                    try {
                        $nodeDetails = $this->request('/api/application/nodes/'.$settings['node']);
                        if (isset($nodeDetails['attributes']['name'])) {
                            $nodeName = $nodeDetails['attributes']['name'];
                        }
                    } catch (\Exception $e) {
                    }

                    $errorMessage = "The selected node '{$nodeName}' is not suitable for deployment. ";
                    $reasons = [];

                    if (! empty($settings['location_ids'])) {
                        $reasons[] = 'The node may not be in the selected location(s)';
                    }

                    $reasons[] = 'The node may not have enough available memory (required: '.number_format($settings['memory']).' MB)';
                    $reasons[] = 'The node may not have enough available disk space (required: '.number_format($settings['disk']).' MB)';
                    $reasons[] = 'The node may be in maintenance mode or disabled';

                    if ($nodeDetails && isset($nodeDetails['attributes'])) {
                        $nodeAttrs = $nodeDetails['attributes'];
                        $maintenance = $nodeAttrs['maintenance_mode'] ?? false;

                        if ($maintenance) {
                            $reasons[] = 'The node is currently in maintenance mode';
                        }

                        $allocatedResources = $nodeAttrs['allocated_resources'] ?? null;
                        if ($allocatedResources && is_array($allocatedResources)) {
                            $allocatedMemory = $allocatedResources['memory'] ?? 0;
                            $allocatedDisk = $allocatedResources['disk'] ?? 0;
                            $totalMemory = $nodeAttrs['memory'] ?? 0;
                            $totalDisk = $nodeAttrs['disk'] ?? 0;

                            if ($totalMemory > 0) {
                                $freeMemory = $totalMemory - $allocatedMemory;
                                if ($freeMemory < $settings['memory']) {
                                    $reasons[] = 'Node has insufficient memory (available: '.number_format($freeMemory).' MB, required: '.number_format($settings['memory']).' MB)';
                                }
                            }

                            if ($totalDisk > 0) {
                                $freeDisk = $totalDisk - $allocatedDisk;
                                if ($freeDisk < $settings['disk']) {
                                    $reasons[] = 'Node has insufficient disk space (available: '.number_format($freeDisk).' MB, required: '.number_format($settings['disk']).' MB)';
                                }
                            }
                        }
                    }

                    $errorMessage .= 'Possible reasons: '.implode(', ', array_unique($reasons)).'. ';
                    $errorMessage .= 'Please either remove the node selection to allow auto-deployment, select a different node, or adjust the resource requirements.';

                    throw new \Exception($errorMessage);
                }
                $node = $nodes_by_id->get($settings['node']);
                $availablePorts = collect($node['relationships']['allocations']['data']);
                $availablePorts = $availablePorts
                    ->filter(fn ($port) => ! $port['attributes']['assigned'])
                    ->map(
                        fn ($port) => [
                            'port' => $port['attributes']['port'],
                            'id' => $port['attributes']['id'],
                        ]
                    );
                if ($availablePorts->isEmpty()) {
                    throw new \Exception('No available allocations found on the selected node.');
                }
                $allocation = $availablePorts->first();
                $environment['SERVER_PORT'] = $allocation['port'];

                return [
                    'auto_deploy' => false,
                    'environment' => $environment,
                    'allocations_needed' => 1,
                    'allocation' => [
                        'default' => $allocation['id'],
                        'additional' => [],
                    ],
                ];
            }

            return [
                'auto_deploy' => true,
                'environment' => $environment,
                'allocations_needed' => 1,
            ];
        }

        try {
            $port_array = json_decode($settings['port_array'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('JSON decode error: '.json_last_error_msg());
            }
        } catch (\Exception $e) {
            throw new \Exception('Invalid JSON in port array');
        }

        if (! is_array($port_array)) {
            throw new \Exception('Port array must be an array');
        }

        $nodes = $this->request('/api/application/nodes/deployable', 'get', [
            'memory' => $settings['memory'],
            'disk' => $settings['disk'],
            'location_ids' => $settings['location_ids'] ?? [],
            'include' => ['allocations'],
        ]);
        $nodes = collect($nodes['data']);
        $nodes_by_id = $nodes->mapWithKeys(fn ($node) => [$node['attributes']['id'] => $node['attributes']]);

        if ($settings['node']) {
            if (! $nodes_by_id->has($settings['node'])) {
                $nodeName = 'Unknown';
                $nodeDetails = null;
                try {
                    $nodeDetails = $this->request('/api/application/nodes/'.$settings['node']);
                    if (isset($nodeDetails['attributes']['name'])) {
                        $nodeName = $nodeDetails['attributes']['name'];
                    }
                } catch (\Exception $e) {
                }

                $errorMessage = "The selected node '{$nodeName}' is not suitable for deployment. ";
                $reasons = [];

                if (! empty($settings['location_ids'])) {
                    $reasons[] = 'The node may not be in the selected location(s)';
                }

                $reasons[] = 'The node may not have enough available memory (required: '.number_format($settings['memory']).' MB)';
                $reasons[] = 'The node may not have enough available disk space (required: '.number_format($settings['disk']).' MB)';
                $reasons[] = 'The node may be in maintenance mode or disabled';

                if ($nodeDetails && isset($nodeDetails['attributes'])) {
                    $nodeAttrs = $nodeDetails['attributes'];
                    $maintenance = $nodeAttrs['maintenance_mode'] ?? false;

                    if ($maintenance) {
                        $reasons[] = 'The node is currently in maintenance mode';
                    }

                    $allocatedResources = $nodeAttrs['allocated_resources'] ?? null;
                    if ($allocatedResources && is_array($allocatedResources)) {
                        $allocatedMemory = $allocatedResources['memory'] ?? 0;
                        $allocatedDisk = $allocatedResources['disk'] ?? 0;
                        $totalMemory = $nodeAttrs['memory'] ?? 0;
                        $totalDisk = $nodeAttrs['disk'] ?? 0;

                        if ($totalMemory > 0) {
                            $freeMemory = $totalMemory - $allocatedMemory;
                            if ($freeMemory < $settings['memory']) {
                                $reasons[] = 'Node has insufficient memory (available: '.number_format($freeMemory).' MB, required: '.number_format($settings['memory']).' MB)';
                            }
                        }

                        if ($totalDisk > 0) {
                            $freeDisk = $totalDisk - $allocatedDisk;
                            if ($freeDisk < $settings['disk']) {
                                $reasons[] = 'Node has insufficient disk space (available: '.number_format($freeDisk).' MB, required: '.number_format($settings['disk']).' MB)';
                            }
                        }
                    }
                }

                $errorMessage .= 'Possible reasons: '.implode(', ', array_unique($reasons)).'. ';
                $errorMessage .= 'Please either remove the node selection to allow auto-deployment, select a different node, or adjust the resource requirements.';

                throw new \Exception($errorMessage);
            }

            $node = $nodes_by_id->get($settings['node']);
            $availablePorts = collect($node['relationships']['allocations']['data']);
            $availablePorts = $availablePorts
                ->filter(fn ($port) => ! $port['attributes']['assigned'])
                ->map(
                    fn ($port) => [
                        'port' => $port['attributes']['port'],
                        'id' => $port['attributes']['id'],
                    ]
                );

            $free_allocations_needed = 0;
            foreach ($port_array as $key => $value) {
                $free_allocations_needed += is_array($value) ? count($value) : 1;
            }

            if (count($availablePorts) < $free_allocations_needed) {
                throw new \Exception("Not enough allocations found for deployment. Found: {$availablePorts->count()}, Required: {$free_allocations_needed}");
            }
        } else {
            foreach ($nodes as $index => $node) {
                $availablePorts = collect($node['attributes']['relationships']['allocations']['data']);
                $availablePorts = $availablePorts
                    ->filter(fn ($port) => ! $port['attributes']['assigned'])
                    ->map(
                        fn ($port) => [
                            'port' => $port['attributes']['port'],
                            'id' => $port['attributes']['id'],
                        ]
                    );

                $free_allocations_needed = 0;
                foreach ($port_array as $key => $value) {
                    $free_allocations_needed += is_array($value) ? count($value) : 1;
                }

                if (count($availablePorts) < $free_allocations_needed) {
                    if ($index == $nodes->count() - 1) {
                        throw new \Exception('No nodes with suitable allocations found for deployment');
                    }

                    continue;
                }
                break;
            }
        }

        $allocations = [];
        foreach ($port_array as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $port) {
                    $allocation = $availablePorts->where('port', $port)->first();
                    if (! $allocation) {
                        $allocation = $availablePorts->where('port', '>', $port)->first();
                        if (! $allocation) {
                            $allocation = $availablePorts->random();
                        }
                        if (! $allocation) {
                            throw new \Exception('Could not find a port to assign');
                        }
                    }
                    $allocations[$key][] = $allocation;
                    $availablePorts = $availablePorts->reject(function ($port) use ($allocation) {
                        return $port['id'] == $allocation['id'];
                    });
                }
            } else {
                $allocation = $availablePorts->where('port', $value)->first();
                if (! $allocation) {
                    $allocation = $availablePorts->where('port', '>', $value)->first();
                    if (! $allocation) {
                        $allocation = $availablePorts->random();
                    }
                    if (! $allocation) {
                        throw new \Exception('Could not find a port to assign');
                    }
                }
                $allocations[$key] = $allocation;
                $availablePorts = $availablePorts->reject(function ($port) use ($allocation) {
                    return $port['id'] == $allocation['id'];
                });
            }
        }

        $allocationIds = [];
        foreach ($allocations as $key => $value) {
            if ($key !== 'NONE') {
                if (isset($environment[$key])) {
                    $environment[$key] = $value['port'];
                }
            }

            if ($key !== 'SERVER_PORT') {
                if (is_array($value) && isset($value[0])) {
                    foreach ($value as $v) {
                        $allocationIds[] = $v['id'];
                    }
                } else {
                    $allocationIds[] = $value['id'];
                }
            }
        }

        return [
            'auto_deploy' => false,
            'allocations_needed' => $free_allocations_needed,
            'environment' => $environment,
            'allocation' => [
                'default' => $allocations['SERVER_PORT']['id'],
                'additional' => $allocationIds,
            ],
        ];
    }

    private function getServer($id, $failIfNotFound = true, $raw = false)
    {
        try {
            $response = $this->request('/api/application/servers/external/'.$id);
        } catch (\Exception $e) {
            if ($failIfNotFound) {
                throw new \Exception('Server not found');
            } else {
                return false;
            }
        }
        if ($raw) {
            return $response;
        }

        return $response['attributes']['id'] ?? false;
    }

    public function suspendServer(Service $service, $settings, $properties)
    {
        $server = $this->getServer($service->id);
        $this->request('/api/application/servers/'.$server.'/suspend', 'post');

        return true;
    }

    public function unsuspendServer(Service $service, $settings, $properties)
    {
        $server = $this->getServer($service->id);
        $this->request('/api/application/servers/'.$server.'/unsuspend', 'post');

        return true;
    }

    public function terminateServer(Service $service, $settings, $properties)
    {
        $server = $this->getServer($service->id);
        $this->request('/api/application/servers/'.$server, 'delete');

        return true;
    }

    public function upgradeServer(Service $service, $settings, $properties)
    {
        $server = $this->getServer($service->id, raw: true);
        $settings = array_merge($settings, $properties);

        $updateServerData = [
            'allocation' => $server['attributes']['allocation'],
            'memory' => (int) $settings['memory'],
            'swap' => (int) $settings['swap'],
            'disk' => (int) $settings['disk'],
            'io' => (int) $settings['io'],
            'cpu' => (int) $settings['cpu'],
            'threads' => $settings['cpu_pinning'] ?? null,
            'feature_limits' => [
                'databases' => $settings['databases'],
                'allocations' => $settings['additional_allocations'],
                'backups' => $settings['backups'],
            ],
        ];

        $this->request('/api/application/servers/'.$server['attributes']['id'].'/build', 'patch', $updateServerData);

        $eggData = $this->request('/api/application/nests/'.$settings['nest_id'].'/eggs/'.$settings['egg_id'], data: ['include' => 'variables']);

        if (! isset($eggData['attributes'])) {
            throw new \Exception('Could not fetch egg data');
        }

        $environment = [];
        foreach ($eggData['attributes']['relationships']['variables']['data'] as $variable) {
            if (isset($server['attributes']['container']['environment'][$variable['attributes']['env_variable']])) {
                $environment[$variable['attributes']['env_variable']] = $server['attributes']['container']['environment'][$variable['attributes']['env_variable']];
            } else {
                $environment[$variable['attributes']['env_variable']] = $settings[$variable['attributes']['env_variable']] ?? $variable['attributes']['default_value'];
            }
        }

        $updateServerData = [
            'environment' => $environment,
            'skip_scripts' => $settings['skip_scripts'] ?? false,
            'oom_disabled' => ! ($settings['oom_killer'] ?? false),
            'egg' => $settings['egg_id'],
            'image' => $server['attributes']['container']['image'] ?? $eggData['attributes']['docker_image'],
            'startup' => $server['attributes']['container']['startup_command'] ?? $settings['startup'] ?? $eggData['attributes']['startup'],
        ];

        $this->request('/api/application/servers/'.$server['attributes']['id'].'/startup', 'patch', $updateServerData);

        return true;
    }

    public function getActions(Service $service): array
    {
        $serverIdentifier = null;
        try {
            $server = $this->getServer($service->id, raw: true);
            $serverIdentifier = $server['attributes']['identifier'] ?? null;
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch server in getActions, using stored identifier', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);
        }

        if (! $serverIdentifier) {
            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
        }

        if (! $serverIdentifier) {
            $this->logMessage('error', 'BetterPterodactyl: No server identifier available', [
                'service_id' => $service->id,
            ]);

            return [
                [
                    'name' => 'server_overview',
                    'type' => 'view',
                    'label' => 'Overview',
                    'function' => 'getServerOverviewView',
                ],
            ];
        }

        $actions = [
            [
                'name' => 'server_overview',
                'type' => 'view',
                'label' => 'Overview',
                'function' => 'getServerOverviewView',
            ],
            [
                'name' => 'access_panel',
                'type' => 'button',
                'label' => 'Go to Panel',
                'url' => $this->config('host').'/server/'.$serverIdentifier,
            ],
        ];

        $userIdProperty = $service->properties()->where('key', 'user_id')->first();

        if ($this->config('sso_secret') && $userIdProperty) {
            $actions[] = [
                'name' => 'auto_login',
                'type' => 'button',
                'label' => 'Login to Panel',
                'url' => '?tab=server_overview&action=sso_redirect',
            ];
        }

        $actions[] = [
            'name' => 'show_credentials',
            'type' => 'view',
            'label' => 'Access',
            'function' => 'getCredentialsView',
        ];

        $actions[] = [
            'name' => 'reveal_password',
            'type' => 'view',
            'label' => 'Password',
            'function' => 'getRevealPasswordView',
        ];

        $actions[] = [
            'name' => 'change_server_name',
            'type' => 'view',
            'label' => 'Rename Server',
            'function' => 'getChangeServerNameView',
        ];

        return $actions;
    }

    public function getServerOverviewView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->query('action')) {
            $action = $request->query('action');
            if ($action === 'sso_redirect') {
                return $this->ssoLink($service);
            }

            return $this->handleQuickAction($service, $action);
        }

        try {
            $serverId = $service->properties()->where('key', 'server_id')->value('value');
            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');

            if (! $serverId || ! $serverIdentifier) {
                throw new \Exception('Server information not found');
            }

            $serverData = $this->request('/api/application/servers/'.$serverId);
            $server = $serverData['attributes'];
            $resourceData = $this->getServerResources($serverIdentifier);

            $allocationId = $server['allocation'] ?? null;
            $allocation = 'Not assigned';

            if ($allocationId) {
                try {
                    $allocationsData = $this->request('/api/application/nodes/'.$server['node'].'/allocations?per_page=100');
                    $allocationsList = $allocationsData['data'] ?? [];

                    foreach ($allocationsList as $alloc) {
                        if (($alloc['attributes']['id'] ?? null) == $allocationId) {
                            $ip = $alloc['attributes']['ip'] ?? '';
                            $port = $alloc['attributes']['port'] ?? '';
                            $alias = $alloc['attributes']['alias'] ?? null;

                            if ($ip && $port) {
                                $allocation = $alias ? $alias.':'.$port : $ip.':'.$port;
                                break;
                            }
                        }
                    }
                } catch (\Exception $e) {
                    $this->logMessage('debug', 'BetterPterodactyl: Failed to fetch allocation info', [
                        'allocation_id' => $allocationId,
                        'node_id' => $server['node'] ?? null,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $viewData = [
                'serverName' => $server['name'],
                'serverIdentifier' => $serverIdentifier,
                'status' => $resourceData['current_state'] ?? 'offline',
                'isInstalling' => ($server['status'] ?? null) === 'installing',
                'installProgress' => ($server['status'] ?? null) === 'installing' ? 'In Progress' : 'Completed',
                'limits' => [
                    'memory' => $server['limits']['memory'] ?? 0,
                    'disk' => $server['limits']['disk'] ?? 0,
                    'cpu' => $server['limits']['cpu'] ?? 0,
                    'swap' => $server['limits']['swap'] ?? 0,
                    'io' => $server['limits']['io'] ?? 0,
                ],
                'usage' => [
                    'memory' => $resourceData['resources']['memory_bytes'] ?? 0,
                    'disk' => $resourceData['resources']['disk_bytes'] ?? 0,
                    'cpu' => $resourceData['resources']['cpu_absolute'] ?? 0,
                    'network_rx' => $resourceData['resources']['network_rx_bytes'] ?? 0,
                    'network_tx' => $resourceData['resources']['network_tx_bytes'] ?? 0,
                ],
                'node' => $server['node'] ?? 'Unknown',
                'allocation' => $allocation,
                'createdAt' => $server['created_at'] ?? null,
                'suspended' => $server['suspended'] ?? false,
                'panelUrl' => $this->config('host'),
            ];

            return $this->renderView('server-overview', $viewData);

        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load server overview', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('server-overview-error', [
                'errorMessage' => 'Failed to load server information: '.$e->getMessage(),
            ]);
        }
    }

    private function getServerResources(string $serverIdentifier): array
    {
        if (! $this->config('client_api_key')) {
            $this->logMessage('debug', 'BetterPterodactyl: Client API key not configured, skipping resource fetch', [
                'server_identifier' => $serverIdentifier,
            ]);

            return [];
        }

        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/resources');

            $this->logMessage('debug', 'BetterPterodactyl: Successfully fetched server resources', [
                'server_identifier' => $serverIdentifier,
                'has_attributes' => isset($response['attributes']),
            ]);

            return $response['attributes'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch server resources', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [];
        }
    }

    private function handleQuickAction(Service $service, string $action): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured. Please contact your administrator.');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');

            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $validActions = ['start', 'stop', 'restart', 'kill'];

            if (! in_array($action, $validActions)) {
                throw new \Exception('Invalid action');
            }

            $this->request('/api/client/servers/'.$serverIdentifier.'/power', 'post', [
                'signal' => $action,
            ]);

            $this->logMessage('info', 'BetterPterodactyl: Quick action executed', [
                'service_id' => $service->id,
                'action' => $action,
                'server_identifier' => $serverIdentifier,
            ]);

            $request = request();
            $currentTab = $request ? $request->query('tab', 'server_overview') : 'server_overview';

            return '<script>window.location.href = "?tab='.htmlspecialchars($currentTab, ENT_QUOTES).'";</script>';

        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Quick action failed', [
                'service_id' => $service->id,
                'action' => $action,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('server-overview-error', [
                'errorMessage' => 'Failed to execute action: '.$e->getMessage(),
            ]);
        }
    }

    public function ssoLink(Service $service): string
    {
        $panelBaseUrl = trim((string) $this->config('host'));
        if ($panelBaseUrl === '') {
            return '<script>window.location.href = "/";</script>';
        }

        $panelBaseUrl = rtrim($panelBaseUrl, '/');
        $fallbackUrl = $panelBaseUrl;
        $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
        if ($serverIdentifier) {
            $fallbackUrl = $panelBaseUrl.'/server/'.$serverIdentifier;
        }

        try {
            $userIdProperty = $service->properties()->where('key', 'user_id')->first();
            $secret = trim((string) $this->config('sso_secret'));

            if ($secret === '') {
                $this->logMessage('warning', 'BetterPterodactyl: SSO secret not configured', [
                    'service_id' => $service->id,
                ]);

                return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
            }

            if (! $userIdProperty || ! $userIdProperty->value) {
                $this->logMessage('warning', 'BetterPterodactyl: User ID not found for SSO', [
                    'service_id' => $service->id,
                ]);

                return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
            }
        } catch (\Throwable $e) {
            $this->logMessage('error', 'BetterPterodactyl: Initial SSO validation failed', [
                'service_id' => $service->id,
                'message' => $e->getMessage(),
            ]);

            return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
        }

        try {
            $endpoint = $this->config('sso_endpoint') ?: '/sso-wemx/';
            $endpoint = '/'.ltrim($endpoint, '/');
            if (substr($endpoint, -1) !== '/') {
                $endpoint .= '/';
            }

            $ssoUrl = $panelBaseUrl.$endpoint;

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-Requested-With' => 'XMLHttpRequest',
            ])->connectTimeout(5)
                ->timeout(10)
                ->retry(1, 200)
                ->get($ssoUrl, [
                    'sso_secret' => $secret,
                    'user_id' => $userIdProperty->value,
                ]);

            if (! $response->successful()) {
                $this->logMessage('warning', 'BetterPterodactyl: SSO endpoint returned error response', [
                    'service_id' => $service->id,
                    'status' => $response->status(),
                ]);

                return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
            }

            $data = $response->json();
            if (! is_array($data)) {
                $this->logMessage('warning', 'BetterPterodactyl: Invalid SSO response payload', [
                    'service_id' => $service->id,
                    'response_type' => gettype($data),
                ]);

                return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
            }

            $redirect = $data['redirect']
                ?? $data['redirect_url']
                ?? null;

            if ($redirect && ! $this->isSafeRedirect($redirect)) {
                $this->logMessage('warning', 'BetterPterodactyl: Unsafe redirect blocked', [
                    'service_id' => $service->id,
                    'redirect' => $redirect,
                ]);
                $redirect = null;
            }

            if (! $redirect) {
                $token = $data['token'] ?? null;
                if (is_string($token) && $token !== '') {
                    $redirect = $panelBaseUrl.'/sso-login?token='.urlencode($token);
                }
            }

            if ($redirect) {
                $this->sendSecurityMail($service, 'sso', [
                    'user_id' => $userIdProperty->value ?? null,
                    'server_identifier' => $serverIdentifier,
                ]);
            }

            $finalUrl = $redirect ?: $fallbackUrl;

            return '<script>window.location.href = "'.htmlspecialchars($finalUrl, ENT_QUOTES).'";</script>';
        } catch (ConnectionException $e) {
            $this->logMessage('warning', 'BetterPterodactyl: SSO endpoint unreachable', [
                'service_id' => $service->id,
                'message' => $e->getMessage(),
            ]);

            return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
        } catch (\Throwable $e) {
            $this->logMessage('error', 'BetterPterodactyl: SSO handling failed', [
                'service_id' => $service->id,
                'message' => $e->getMessage(),
            ]);

            return '<script>window.location.href = "'.htmlspecialchars($fallbackUrl, ENT_QUOTES).'";</script>';
        }
    }

    public function getSsoRedirectView(Service $service, $settings, $properties, $view): string
    {
        $panelBaseUrl = trim((string) $this->config('host'));
        if ($panelBaseUrl === '') {
            $redirectUrl = '/';
        } else {
            $panelBaseUrl = rtrim($panelBaseUrl, '/');
            $fallbackUrl = $panelBaseUrl;
            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if ($serverIdentifier) {
                $fallbackUrl = $panelBaseUrl.'/server/'.$serverIdentifier;
            }

            $redirectUrl = $fallbackUrl;

            try {
                $userIdProperty = $service->properties()->where('key', 'user_id')->first();
                $secret = trim((string) $this->config('sso_secret'));

                if ($secret !== '' && $userIdProperty && $userIdProperty->value) {
                    try {
                        $endpoint = $this->config('sso_endpoint') ?: '/sso-wemx/';
                        $endpoint = '/'.ltrim($endpoint, '/');
                        if (substr($endpoint, -1) !== '/') {
                            $endpoint .= '/';
                        }

                        $ssoUrl = $panelBaseUrl.$endpoint;

                        $response = Http::withHeaders([
                            'Accept' => 'application/json',
                            'X-Requested-With' => 'XMLHttpRequest',
                        ])->connectTimeout(5)
                            ->timeout(10)
                            ->retry(1, 200)
                            ->get($ssoUrl, [
                                'sso_secret' => $secret,
                                'user_id' => $userIdProperty->value,
                            ]);

                        if ($response->successful()) {
                            $data = $response->json();
                            if (is_array($data)) {
                                $redirect = $data['redirect']
                                    ?? $data['redirect_url']
                                    ?? null;

                                if ($redirect && ! $this->isSafeRedirect($redirect)) {
                                    $this->logMessage('warning', 'BetterPterodactyl: Unsafe redirect blocked', [
                                        'service_id' => $service->id,
                                        'redirect' => $redirect,
                                    ]);
                                    $redirect = null;
                                }

                                if (! $redirect) {
                                    $token = $data['token'] ?? null;
                                    if (is_string($token) && $token !== '') {
                                        $redirect = $panelBaseUrl.'/sso-login?token='.urlencode($token);
                                    }
                                }

                                if ($redirect) {
                                    $this->sendSecurityMail($service, 'sso', [
                                        'user_id' => $userIdProperty->value ?? null,
                                        'server_identifier' => $serverIdentifier,
                                    ]);
                                    $redirectUrl = $redirect;
                                }
                            }
                        }
                    } catch (\Throwable $e) {
                    }
                }
            } catch (\Throwable $e) {
            }
        }

        $iconAssets = $this->injectRemixIcons();
        $escapedUrl = htmlspecialchars($redirectUrl, ENT_QUOTES, 'UTF-8');

        return $iconAssets.'
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Redirecting to Panel</h3>
    </div>
    
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        Please wait while we redirect you to the control panel...
    </p>

    <div class="bg-background border border-neutral rounded-md px-4 py-3 text-center">
        <p style="color:var(--text-secondary); font-size:0.875rem;">
            Redirecting...
        </p>
    </div>
</div>

<script>
    (function() {
        window.location.href = '.json_encode($redirectUrl, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT).';
    })();
</script>';
    }

    private function isSafeRedirect(string $url): bool
    {
        $url = trim($url);
        if ($url === '') {
            return false;
        }

        $panelHost = parse_url(trim((string) $this->config('host')), PHP_URL_HOST);
        if (! $panelHost) {
            return false;
        }

        $parsed = parse_url($url);
        if ($parsed === false) {
            return false;
        }

        if (! isset($parsed['host'])) {
            $path = $parsed['path'] ?? '';

            return $path === '' || str_starts_with($path, '/');
        }

        return strcasecmp($parsed['host'], $panelHost) === 0;
    }

    public function getCredentialsView(Service $service, $settings, $properties, $view): string
    {
        $serviceProperties = $service->properties()->pluck('value', 'key')->toArray();
        $userEmail = $serviceProperties['user_email'] ?? $service->user->email;

        $metadata = $this->resolveServerMetadata($service);
        $hasStoredPassword = (bool) $service->properties()->where('key', 'current_password')->first();

        return $this->renderView('credentials', [
            'serverName' => $metadata['serverName'],
            'serverIdentifier' => $metadata['serverIdentifier'],
            'userEmail' => $userEmail,
            'panelUrl' => $metadata['panelUrl'],
            'revealAction' => $hasStoredPassword ? 'reveal_password' : null,
            'maskedPassword' => $this->maskedPasswordPlaceholder(),
        ]);
    }

    public function getRevealPasswordView(Service $service, $settings, $properties, $view): string
    {
        $request = request();
        $shouldGenerate = false;

        if ($request) {
            $shouldGenerate = (bool) $request->query('confirm_generate_password', false);
        } elseif (isset($_GET['confirm_generate_password'])) {
            $shouldGenerate = (bool) $_GET['confirm_generate_password'];
        }

        if ($shouldGenerate) {
            try {
                $result = $this->generateNewPasswordInternal($service);
                $newPassword = $result['password'];

                $metadata = $this->resolveServerMetadata($service);
                $userEmail = $service->properties()->where('key', 'user_email')->value('value') ?? $service->user->email;

                return $this->renderView('password-generated', [
                    'serverName' => $metadata['serverName'],
                    'serverIdentifier' => $metadata['serverIdentifier'],
                    'userEmail' => $userEmail,
                    'panelUrl' => $metadata['panelUrl'],
                    'password' => $newPassword,
                    'autoHideMilliseconds' => 20000,
                ]);
            } catch (\Exception $e) {
                $this->logMessage('error', 'BetterPterodactyl password generation failed', [
                    'service_id' => $service->id,
                    'error' => $e->getMessage(),
                ], true);

                return $this->renderView('password-error', [
                    'heading' => 'Password Generation Failed',
                    'message' => $e->getMessage(),
                ]);
            }
        }

        $metadata = $this->resolveServerMetadata($service);
        $userEmail = $service->properties()->where('key', 'user_email')->value('value') ?? $service->user->email;
        $password = $this->decryptStoredPassword($service);

        if (! $password) {
            return $this->renderView('password-reveal-missing', [
                'serverName' => $metadata['serverName'],
                'serverIdentifier' => $metadata['serverIdentifier'],
                'panelUrl' => $metadata['panelUrl'],
            ]);
        }

        $this->sendSecurityMail($service, 'reveal', [
            'password_preview' => $this->passwordPreview($password),
            'server_identifier' => $metadata['serverIdentifier'],
        ]);

        return $this->renderView('password-reveal', [
            'serverName' => $metadata['serverName'],
            'serverIdentifier' => $metadata['serverIdentifier'],
            'userEmail' => $userEmail,
            'panelUrl' => $metadata['panelUrl'],
            'password' => $password,
            'autoHideMilliseconds' => 15000,
        ]);
    }

    public function generateNewPasswordInternal(Service $service): array
    {
        try {
            $userIdProperty = $service->properties()->where('key', 'user_id')->first();
            $userEmailProperty = $service->properties()->where('key', 'user_email')->first();

            if (! $userIdProperty || ! $userIdProperty->value) {
                throw new \Exception('User ID not found. Cannot generate new password.');
            }

            $userEmail = $userEmailProperty?->value ?? $service->user->email;

            if (! $userEmail) {
                throw new \Exception('User email not found. Cannot generate new password.');
            }

            $newPassword = $this->generateSecurePassword();
            $currentUser = $this->request('/api/application/users/'.$userIdProperty->value, 'get');

            $updateData = [
                'email' => $userEmail,
                'username' => $currentUser['attributes']['username'],
                'first_name' => $currentUser['attributes']['first_name'],
                'last_name' => $currentUser['attributes']['last_name'],
                'password' => $newPassword,
            ];

            $this->logMessage('info', 'BetterPterodactyl updating user password', [
                'service_id' => $service->id,
                'user_id' => $userIdProperty->value,
                'email' => $userEmail,
                'update_data' => array_merge($updateData, ['password' => '[REDACTED]']),
            ]);

            $this->request('/api/application/users/'.$userIdProperty->value, 'patch', $updateData);
            $this->storeEncryptedPassword($service, $newPassword);

            $this->logMessage('info', 'BetterPterodactyl password generated successfully', [
                'service_id' => $service->id,
                'user_id' => $userIdProperty->value,
            ]);

            $this->sendSecurityMail($service, 'generated', [
                'password_preview' => $this->passwordPreview($newPassword),
                'server_identifier' => $service->properties()->where('key', 'server_identifier')->value('value'),
            ]);

            return [
                'password' => $newPassword,
                'message' => 'Password updated successfully!',
            ];

        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl password generation failed', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \Exception('Failed to generate new password: '.$e->getMessage());
        }
    }

    private function generateSecurePassword(): string
    {
        $length = 16;
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        $password = '';

        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $password;
    }

    private function isAdminContext(): bool
    {
        $request = request();
        if (! $request) {
            return false;
        }

        $currentUrl = $request->url() ?? '';
        if (str_contains($currentUrl, '/admin/')) {
            return true;
        }

        $referer = $request->header('referer', '');
        if (str_contains($referer, '/admin/')) {
            return true;
        }

        $routeName = $request->route()?->getName() ?? '';
        if (str_starts_with($routeName, 'filament.admin.')) {
            return true;
        }

        try {
            if (auth()->guard('web')->check()) {
                $user = auth()->guard('web')->user();
                if ($user && method_exists($user, 'hasRole') && $user->hasRole('admin')) {
                    return true;
                }
            }
        } catch (\Exception $e) {
        }

        return false;
    }

    public function getEditServerPropertiesView(Service $service, $settings, $properties, $view): string
    {
        $request = request();
        if ($request && $request->query('update_server_properties')) {
            return $this->handleUpdateServerProperties($service, $request->query());
        }

        $serviceProperties = $service->properties()->pluck('value', 'key')->toArray();

        return $this->renderView('admin/edit-properties', [
            'serverId' => $serviceProperties['server_id'] ?? '',
            'serverName' => $serviceProperties['server_name'] ?? '',
            'serverIdentifier' => $serviceProperties['server_identifier'] ?? '',
            'userId' => $serviceProperties['user_id'] ?? '',
            'userEmail' => $serviceProperties['user_email'] ?? $service->user->email,
        ]);
    }

    public function getChangeServerNameView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->query('update_server_name')) {
            $newServerName = $request->query('new_server_name');

            return $this->handleChangeServerName($service, ['new_server_name' => $newServerName]);
        }

        $metadata = $this->resolveServerMetadata($service);

        return $this->renderView('change-server-name', [
            'currentServerName' => $metadata['serverName'],
            'serverIdentifier' => $metadata['serverIdentifier'],
            'panelUrl' => $metadata['panelUrl'],
        ]);
    }

    private function handleChangeServerName(Service $service, array $payload): string
    {
        try {
            $newServerName = trim($payload['new_server_name'] ?? '');
            $oldServerName = $service->properties()->where('key', 'server_name')->value('value') ?? 'Unknown Server';

            if ($newServerName === '') {
                return $this->renderSuccessMessage('info', 'No Changes', 'Server name was not changed.', 'show_credentials');
            }

            if (strlen($newServerName) > 255) {
                return $this->renderSuccessMessage('error', 'Invalid Input', 'Server name is too long (max 255 characters)', 'change_server_name');
            }

            if ($newServerName === $oldServerName) {
                return $this->renderSuccessMessage('info', 'No Changes', 'Server name was not changed.', 'show_credentials');
            }

            $serverId = $service->properties()->where('key', 'server_id')->value('value');
            if (! $serverId) {
                throw new \Exception('Server ID not found in service properties');
            }

            $userId = $service->properties()->where('key', 'user_id')->value('value');
            if (! $userId) {
                throw new \Exception('User ID not found in service properties');
            }

            $this->request('/api/application/servers/'.$serverId.'/details', 'patch', [
                'name' => $newServerName,
                'user' => (int) $userId,
            ]);

            $service->properties()->updateOrCreate([
                'key' => 'server_name',
            ], [
                'name' => 'Server Name',
                'value' => $newServerName,
            ]);

            $this->logMessage('info', 'BetterPterodactyl: Server name changed by customer', [
                'service_id' => $service->id,
                'user_id' => $service->user->id,
                'old_name' => $oldServerName,
                'new_name' => $newServerName,
            ]);

            $this->sendSecurityMail($service, 'server_name_changed', [
                'old_server_name' => $oldServerName,
                'new_server_name' => $newServerName,
                'server_identifier' => $service->properties()->where('key', 'server_identifier')->value('value'),
            ]);

            return $this->renderSuccessMessage('success', 'Server Renamed', 'Your server has been renamed to "'.$newServerName.'"', 'show_credentials');

        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to change server name', [
                'service_id' => $service->id,
                'user_id' => $service->user->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderSuccessMessage('error', 'Update Failed', 'Failed to update server name: '.$e->getMessage(), 'change_server_name');
        }
    }

    private function renderSuccessMessage(string $type, string $title, string $message, string $redirectTab): string
    {
        $iconClass = $type === 'success' ? 'ri-check-circle-line' : 'ri-error-warning-line';
        $bgClass = $type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        $textClass = $type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

        return $this->renderView('success-message', [
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'redirectTab' => $redirectTab,
            'iconClass' => $iconClass,
            'bgClass' => $bgClass,
            'textClass' => $textClass,
        ]);
    }

    private function handleUpdateServerProperties(Service $service, array $payload): string
    {
        try {
            $serverId = trim($payload['server_id'] ?? '');
            $serverName = trim($payload['server_name'] ?? '');
            $serverIdentifier = trim($payload['server_identifier'] ?? '');
            $userId = trim($payload['user_id'] ?? '');
            $userEmail = trim($payload['user_email'] ?? '');

            $errors = [];
            if ($serverId === '') {
                $errors[] = 'Server ID is required';
            }
            if ($serverName === '') {
                $errors[] = 'Server Name is required';
            }
            if ($serverIdentifier === '') {
                $errors[] = 'Server Identifier is required';
            }
            if ($userId === '') {
                $errors[] = 'User ID is required';
            }
            if ($userEmail === '') {
                $errors[] = 'User Email is required';
            } elseif (! filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'User Email must be a valid address';
            }

            if ($errors) {
                return $this->renderView('admin/update-error', [
                    'title' => 'Validation Error',
                    'messages' => $errors,
                ]);
            }

            $propertiesToUpdate = [
                'server_id' => ['name' => 'Pterodactyl Server ID', 'value' => $serverId],
                'server_name' => ['name' => 'Server Name', 'value' => $serverName],
                'server_identifier' => ['name' => 'Pterodactyl Server Identifier', 'value' => $serverIdentifier],
                'user_id' => ['name' => 'Pterodactyl User ID', 'value' => $userId],
                'user_email' => ['name' => 'User Email', 'value' => $userEmail],
            ];

            foreach ($propertiesToUpdate as $key => $data) {
                $service->properties()->updateOrCreate([
                    'key' => $key,
                ], [
                    'name' => $data['name'],
                    'value' => $data['value'],
                ]);
            }

            $this->logMessage('info', 'BetterPterodactyl v2 server properties updated', [
                'service_id' => $service->id,
                'updated_properties' => array_keys($propertiesToUpdate),
                'admin_action' => true,
                'version' => 'v2',
            ]);

            return $this->renderView('admin/update-success', [
                'serverId' => $serverId,
                'serverName' => $serverName,
                'serverIdentifier' => $serverIdentifier,
                'userId' => $userId,
                'userEmail' => $userEmail,
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl v2 failed to update server properties', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'version' => 'v2',
            ]);

            return $this->renderView('admin/update-error', [
                'title' => 'Update Failed (v2)',
                'messages' => [$e->getMessage()],
            ]);
        }
    }

    public function getConsoleView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post') && $request->query('console_action')) {
            return $this->handleConsoleAction($service, $request->query('console_action'), $request->input('command'));
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable console access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $websocketData = $this->getWebsocketData($serverIdentifier);

            return $this->renderView('console', [
                'serverIdentifier' => $serverIdentifier,
                'panelUrl' => $this->config('host'),
                'websocketData' => $websocketData,
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load console', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Console Error',
                'message' => 'Failed to load console: '.$e->getMessage(),
            ]);
        }
    }

    public function getFileBrowserView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleFileBrowserAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable file browser access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $directory = $request ? $request->query('directory', '/') : '/';
            $files = $this->getServerFiles($serverIdentifier, $directory);

            return $this->renderView('file-browser', [
                'serverIdentifier' => $serverIdentifier,
                'currentDirectory' => $directory,
                'files' => $files,
                'panelUrl' => $this->config('host'),
                'clientApiKey' => $this->config('client_api_key') ?? '',
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load file browser', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'File Browser Error',
                'message' => 'Failed to load file browser: '.$e->getMessage(),
            ]);
        }
    }

    public function getBackupsView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleBackupAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable backups access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $backups = $this->getServerBackups($serverIdentifier);

            return $this->renderView('backups', [
                'serverIdentifier' => $serverIdentifier,
                'backups' => $backups,
                'panelUrl' => $this->config('host'),
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load backups', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Backups Error',
                'message' => 'Failed to load backups: '.$e->getMessage(),
            ]);
        }
    }

    public function getDatabasesView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleDatabaseAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable database access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $databases = $this->getServerDatabases($serverIdentifier);

            return $this->renderView('databases', [
                'serverIdentifier' => $serverIdentifier,
                'databases' => $databases,
                'panelUrl' => $this->config('host'),
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load databases', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Databases Error',
                'message' => 'Failed to load databases: '.$e->getMessage(),
            ]);
        }
    }

    public function getNetworkView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleNetworkAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable network management.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $allocations = $this->getServerAllocations($serverIdentifier);
            $serverId = $service->properties()->where('key', 'server_id')->value('value');
            $serverData = $this->request('/api/application/servers/'.$serverId);
            $server = $serverData['attributes'];

            return $this->renderView('network', [
                'serverIdentifier' => $serverIdentifier,
                'allocations' => $allocations,
                'server' => $server,
                'panelUrl' => $this->config('host'),
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load network', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Network Error',
                'message' => 'Failed to load network information: '.$e->getMessage(),
            ]);
        }
    }

    public function getSchedulesView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleScheduleAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable schedules access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $schedules = $this->getServerSchedules($serverIdentifier);

            return $this->renderView('schedules', [
                'serverIdentifier' => $serverIdentifier,
                'schedules' => $schedules,
                'panelUrl' => $this->config('host'),
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load schedules', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Schedules Error',
                'message' => 'Failed to load schedules: '.$e->getMessage(),
            ]);
        }
    }

    public function getSettingsView(Service $service, $settings, $properties, $view): string
    {
        $request = request();

        if ($request && $request->isMethod('post')) {
            return $this->handleSettingsAction($service, $request->all());
        }

        try {
            if (! $this->config('client_api_key')) {
                return $this->renderView('error', [
                    'title' => 'Client API Key Required',
                    'message' => 'The Client API key is not configured. Please contact your administrator to enable settings access.',
                ]);
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            if (! $serverIdentifier) {
                throw new \Exception('Server identifier not found');
            }

            $serverId = $service->properties()->where('key', 'server_id')->value('value');
            $serverData = $this->request('/api/application/servers/'.$serverId);
            $server = $serverData['attributes'];
            $startup = $this->getServerStartup($serverIdentifier);
            $variables = $this->getServerVariables($serverIdentifier);

            return $this->renderView('settings', [
                'serverIdentifier' => $serverIdentifier,
                'server' => $server,
                'startup' => $startup,
                'variables' => $variables,
                'panelUrl' => $this->config('host'),
            ]);
        } catch (\Exception $e) {
            $this->logMessage('error', 'BetterPterodactyl: Failed to load settings', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
            ]);

            return $this->renderView('error', [
                'title' => 'Settings Error',
                'message' => 'Failed to load settings: '.$e->getMessage(),
            ]);
        }
    }

    private function getWebsocketData(string $serverIdentifier): array
    {
        if (! $this->config('client_api_key')) {
            throw new \Exception('Client API key is not configured');
        }

        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/websocket');
            $data = $response['data'] ?? [];

            $panelUrl = rtrim($this->config('host'), '/');
            $host = parse_url($panelUrl, PHP_URL_HOST);
            $scheme = parse_url($panelUrl, PHP_URL_SCHEME);
            $wsScheme = $scheme === 'https' ? 'wss' : 'ws';

            $data['socket'] = $data['socket'] ?? ($wsScheme.'://'.$host.'/api/servers/'.$serverIdentifier.'/ws');
            $data['token'] = $data['token'] ?? '';

            return $data;
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch websocket data', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function handleConsoleAction(Service $service, string $action, ?string $command = null): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');

            if ($action === 'send_command' && $command) {
                $this->request('/api/client/servers/'.$serverIdentifier.'/command', 'post', [
                    'command' => $command,
                ]);
            }

            return '<script>window.location.href = "?tab=console";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Console Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerFiles(string $serverIdentifier, string $directory): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/files/list', 'get', [
                'directory' => $directory,
            ]);

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch files', [
                'server_identifier' => $serverIdentifier,
                'directory' => $directory,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleFileBrowserAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'upload':
                    break;
                case 'delete':
                    if (isset($data['files'])) {
                        foreach ($data['files'] as $file) {
                            $this->request('/api/client/servers/'.$serverIdentifier.'/files/delete', 'post', [
                                'root' => '/',
                                'files' => [$file],
                            ]);
                        }
                    }
                    break;
                case 'create_folder':
                    if (isset($data['name'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/files/create-folder', 'post', [
                            'root' => $data['root'] ?? '/',
                            'name' => $data['name'],
                        ]);
                    }
                    break;
            }

            return '<script>window.location.href = "?tab=file_browser&directory=" + encodeURIComponent("'.($data['directory'] ?? '/').'");</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'File Browser Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerBackups(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/backups');

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch backups', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleBackupAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'create':
                    $this->request('/api/client/servers/'.$serverIdentifier.'/backups', 'post', [
                        'name' => $data['name'] ?? 'Backup '.date('Y-m-d H:i:s'),
                    ]);
                    break;
                case 'restore':
                    if (isset($data['backup_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/backups/'.$data['backup_id'].'/restore', 'post');
                    }
                    break;
                case 'delete':
                    if (isset($data['backup_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/backups/'.$data['backup_id'], 'delete');
                    }
                    break;
                case 'download':
                    if (isset($data['backup_id'])) {
                        $response = $this->request('/api/client/servers/'.$serverIdentifier.'/backups/'.$data['backup_id'].'/download');

                        return json_encode(['download_url' => $response['attributes']['url'] ?? '']);
                    }
                    break;
            }

            return '<script>window.location.href = "?tab=backups";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Backup Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerDatabases(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/databases');

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch databases', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleDatabaseAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'create':
                    $this->request('/api/client/servers/'.$serverIdentifier.'/databases', 'post', [
                        'database' => $data['database'] ?? '',
                        'remote' => $data['remote'] ?? '%',
                    ]);
                    break;
                case 'reset_password':
                    if (isset($data['database_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/databases/'.$data['database_id'].'/reset-password', 'post');
                    }
                    break;
                case 'delete':
                    if (isset($data['database_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/databases/'.$data['database_id'], 'delete');
                    }
                    break;
            }

            return '<script>window.location.href = "?tab=databases";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Database Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerAllocations(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/network/allocations');

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch allocations', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleNetworkAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'set_primary':
                    if (isset($data['allocation_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/network/allocations/'.$data['allocation_id'].'/primary', 'post');
                    }
                    break;
                case 'set_note':
                    if (isset($data['allocation_id']) && isset($data['notes'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/network/allocations/'.$data['allocation_id'], 'post', [
                            'notes' => $data['notes'],
                        ]);
                    }
                    break;
            }

            return '<script>window.location.href = "?tab=network";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Network Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerSchedules(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/schedules');

            return $response['data'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch schedules', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleScheduleAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'create':
                    $this->request('/api/client/servers/'.$serverIdentifier.'/schedules', 'post', [
                        'name' => $data['name'] ?? '',
                        'cron' => $data['cron'] ?? '',
                        'is_active' => $data['is_active'] ?? true,
                    ]);
                    break;
                case 'update':
                    if (isset($data['schedule_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/schedules/'.$data['schedule_id'], 'patch', [
                            'name' => $data['name'] ?? '',
                            'cron' => $data['cron'] ?? '',
                            'is_active' => $data['is_active'] ?? true,
                        ]);
                    }
                    break;
                case 'delete':
                    if (isset($data['schedule_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/schedules/'.$data['schedule_id'], 'delete');
                    }
                    break;
                case 'execute':
                    if (isset($data['schedule_id'])) {
                        $this->request('/api/client/servers/'.$serverIdentifier.'/schedules/'.$data['schedule_id'].'/execute', 'post');
                    }
                    break;
            }

            return '<script>window.location.href = "?tab=schedules";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Schedule Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function getServerStartup(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/startup');

            return $response['attributes'] ?? [];
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch startup', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function getServerVariables(string $serverIdentifier): array
    {
        try {
            $response = $this->request('/api/client/servers/'.$serverIdentifier.'/startup');
            $environment = $response['attributes']['env'] ?? [];

            return $environment;
        } catch (\Exception $e) {
            $this->logMessage('warning', 'BetterPterodactyl: Failed to fetch variables', [
                'server_identifier' => $serverIdentifier,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function handleSettingsAction(Service $service, array $data): string
    {
        try {
            if (! $this->config('client_api_key')) {
                throw new \Exception('Client API key is not configured');
            }

            $serverIdentifier = $service->properties()->where('key', 'server_identifier')->value('value');
            $action = $data['action'] ?? '';

            switch ($action) {
                case 'update_startup':
                    $this->request('/api/client/servers/'.$serverIdentifier.'/startup/variable', 'post', [
                        'key' => $data['key'] ?? '',
                        'value' => $data['value'] ?? '',
                    ]);
                    break;
                case 'update_image':
                    $this->request('/api/client/servers/'.$serverIdentifier.'/startup', 'put', [
                        'docker_image' => $data['docker_image'] ?? '',
                    ]);
                    break;
            }

            return '<script>window.location.href = "?tab=settings";</script>';
        } catch (\Exception $e) {
            return $this->renderView('error', [
                'title' => 'Settings Action Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function migrateOption(string $key, ?string $value)
    {
        return match ($key) {
            'egg' => ['key' => 'egg_id', 'value' => $value],
            'nest' => ['key' => 'nest_id', 'value' => $value],
            'allocation' => ['key' => 'additional_allocations', 'value' => $value],
            'location' => ['key' => 'location_ids', 'value' => json_encode([$value]), 'type' => 'array'],
            default => ['key' => $key, 'value' => $value]
        };
    }
}
