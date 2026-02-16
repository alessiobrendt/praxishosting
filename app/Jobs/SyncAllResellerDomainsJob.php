<?php

namespace App\Jobs;

use App\Models\ResellerDomain;
use App\Services\DomainPricingService;
use App\Services\SkrimeApiService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncAllResellerDomainsJob implements ShouldQueue
{
    use Queueable;

    public int $timeout = 300;

    public function handle(SkrimeApiService $skrime, DomainPricingService $pricing): void
    {
        try {
            $products = $skrime->getProducts('domain');
        } catch (\Throwable $e) {
            Log::error('SyncAllResellerDomainsJob: getProducts failed', ['error' => $e->getMessage()]);

            throw $e;
        }

        $created = 0;
        $updated = 0;

        foreach ($products as $data) {
            $productInfo = $data['productInfo'] ?? [];
            $domainName = $productInfo['domain'] ?? $data['domain'] ?? null;
            if (! $domainName || ! is_string($domainName)) {
                continue;
            }
            $domainName = strtolower(trim($domainName));
            $skrimeId = $data['id'] ?? $data['productId'] ?? null;
            $state = $data['state'] ?? 'active';
            $status = in_array($state, ['cancelled', 'deleted', 'canceled'], true) ? 'cancelled' : $state;
            $expiresAt = isset($data['expireAt']) ? Carbon::parse($data['expireAt']) : null;
            $createdAt = isset($data['createdAt']) ? Carbon::parse($data['createdAt']) : null;
            $autoRenew = (bool) ($data['autoRenew'] ?? false);
            $tld = substr(strrchr($domainName, '.'), 1) ?: null;

            $existing = ResellerDomain::query()->where('domain', $domainName)->first()
                ?? ($skrimeId ? ResellerDomain::query()->where('skrime_id', $skrimeId)->first() : null);

            if ($existing) {
                $existing->update([
                    'skrime_id' => $skrimeId ?? $existing->skrime_id,
                    'status' => $status,
                    'expires_at' => $expiresAt,
                    'auto_renew' => $autoRenew,
                    'registered_at' => $existing->registered_at ?? $createdAt,
                ]);
                $updated++;
            } else {
                $purchasePrice = null;
                $salePrice = null;
                if ($tld) {
                    $info = $pricing->getPricingForTld($tld, 'create');
                    if (($info['purchase_price'] ?? 0) > 0) {
                        $purchasePrice = $info['purchase_price'];
                        $salePrice = $info['sale_price'];
                    }
                }
                ResellerDomain::create([
                    'domain' => $domainName,
                    'user_id' => null,
                    'skrime_id' => $skrimeId,
                    'status' => $status,
                    'registered_at' => $createdAt,
                    'expires_at' => $expiresAt,
                    'auto_renew' => $autoRenew,
                    'tld' => $tld,
                    'purchase_price' => $purchasePrice,
                    'sale_price' => $salePrice,
                ]);
                $created++;
            }
        }

        Log::info('SyncAllResellerDomainsJob: completed', [
            'total' => count($products),
            'created' => $created,
            'updated' => $updated,
        ]);
    }
}
