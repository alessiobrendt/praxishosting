<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameServerAccount;
use App\Services\CloudflareDnsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubdomainsController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GameServerAccount::class);

        $cloudflare = app(CloudflareDnsService::class);
        $cloudflareConfigured = $cloudflare->isConfigured();
        $zoneDomain = (string) config('services.cloudflare.zone_domain', '');
        $srvRecords = [];

        if ($cloudflareConfigured) {
            $rawRecords = $cloudflare->listAllSrvRecords();

            $accountsBySrvName = $this->getAccountsBySrvRecordName();

            foreach ($rawRecords as $record) {
                $recordId = $record['id'] ?? '';
                $name = $record['name'] ?? '';
                $data = $record['data'] ?? [];
                $target = is_array($data) ? ($data['target'] ?? '') : '';
                $port = is_array($data) ? (int) ($data['port'] ?? 0) : 0;
                $normalizedName = $this->normalizeSrvRecordName($name, $zoneDomain);
                $account = $accountsBySrvName[$normalizedName] ?? null;

                $srvRecords[] = [
                    'record_id' => $recordId,
                    'name' => $name,
                    'target' => is_string($target) ? rtrim($target, '.') : '',
                    'port' => $port,
                    'game_server_account' => $account,
                ];
            }
        }

        return Inertia::render('admin/subdomains/Index', [
            'srvRecords' => $srvRecords,
            'zoneDomain' => $zoneDomain,
            'cloudflareConfigured' => $cloudflareConfigured,
        ]);
    }

    public function destroy(Request $request, string $recordId): RedirectResponse
    {
        $this->authorize('viewAny', GameServerAccount::class);

        $cloudflare = app(CloudflareDnsService::class);
        if (! $cloudflare->isConfigured()) {
            return redirect()->route('admin.subdomains.index')
                ->with('error', 'Cloudflare ist nicht konfiguriert.');
        }

        try {
            $cloudflare->deleteSrvRecordById($recordId);

            return redirect()->route('admin.subdomains.index')
                ->with('success', 'SRV-Eintrag wurde aus Cloudflare gelöscht.');
        } catch (\Throwable $e) {
            return redirect()->route('admin.subdomains.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Normalize Cloudflare record name (strip zone domain) for matching.
     */
    private function normalizeSrvRecordName(string $name, string $zoneDomain): string
    {
        $name = trim($name);
        if ($zoneDomain !== '' && str_ends_with(strtolower($name), strtolower('.'.$zoneDomain))) {
            return substr($name, 0, -strlen('.'.$zoneDomain));
        }

        return $name;
    }

    /**
     * @return array<string, array{id: int, name: string, url: string}>
     */
    private function getAccountsBySrvRecordName(): array
    {
        $accounts = GameServerAccount::query()
            ->whereNotNull('gameserver_cloud_subscription_id')
            ->get();

        $map = [];
        foreach ($accounts as $account) {
            $allocation = $account->allocation ?? [];
            $srvName = $allocation['srv_record_name'] ?? null;
            if ($srvName !== null && $srvName !== '') {
                $map[$srvName] = [
                    'id' => $account->id,
                    'name' => $account->name,
                    'url' => route('admin.gaming-accounts.show', $account),
                ];
            }
        }

        return $map;
    }
}
