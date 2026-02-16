<?php

namespace App\Jobs;

use App\Models\ResellerDomain;
use App\Services\SkrimeApiService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncResellerDomainsJob implements ShouldQueue
{
    use Queueable;

    public function handle(SkrimeApiService $skrime): void
    {
        ResellerDomain::query()
            ->whereNotNull('skrime_id')
            ->get()
            ->each(function (ResellerDomain $domain) use ($skrime): void {
                try {
                    $data = $skrime->getProduct(domain: $domain->domain);
                } catch (\Throwable $e) {
                    Log::warning('SyncResellerDomains: getProduct failed', [
                        'domain' => $domain->domain,
                        'error' => $e->getMessage(),
                    ]);

                    return;
                }

                $state = $data['state'] ?? 'active';
                $status = in_array($state, ['cancelled', 'deleted', 'canceled'], true) ? 'cancelled' : $state;
                $expiresAt = isset($data['expireAt']) ? Carbon::parse($data['expireAt']) : null;

                $domain->update([
                    'status' => $status,
                    'expires_at' => $expiresAt,
                    'auto_renew' => (bool) ($data['autoRenew'] ?? false),
                ]);
            });
    }
}
