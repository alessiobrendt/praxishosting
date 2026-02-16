<?php

namespace App\Services;

use App\Models\TldPricelist;
use Illuminate\Support\Facades\Cache;

class DomainPricingService
{
    public function __construct(
        protected SkrimeApiService $skrimeApi
    ) {}

    /**
     * Get pricelist from Skrime, cached for 1 hour.
     *
     * @return array<int, array{tld: string, create: string, renew: string, transfer: string, restore: string, offer: bool, offerTypes: array}>
     */
    public function getPricelist(): array
    {
        return Cache::remember('skrime_pricelist', 3600, function () {
            return $this->skrimeApi->getPricelist();
        });
    }

    /**
     * Get purchase price for a TLD (create or renew). Uses tld_pricelist first, then Skrime cache.
     */
    public function getPurchasePrice(string $tld, string $type = 'create'): float
    {
        $tldKey = strtolower(ltrim($tld, '.'));
        if ($tldKey === '') {
            return 0;
        }

        $row = TldPricelist::query()->where('tld', $tldKey)->first();
        if ($row) {
            $price = $type === 'renew' ? (float) $row->renew_price : (float) $row->create_price;

            return $price > 0 ? round($price, 2) : $this->getPurchasePriceFromSkrime($tldKey, $type);
        }

        return $this->getPurchasePriceFromSkrime($tldKey, $type);
    }

    /**
     * Get purchase price from Skrime pricelist cache only.
     */
    protected function getPurchasePriceFromSkrime(string $tldKey, string $type): float
    {
        $list = $this->getPricelist();
        $key = $type === 'renew' ? 'renew' : 'create';
        foreach ($list as $row) {
            if (strtolower((string) ($row['tld'] ?? '')) === $tldKey) {
                return (float) ($row[$key] ?? 0);
            }
        }

        return 0;
    }

    /**
     * Calculate sale price from purchase price. Uses tld_pricelist margin if present, else config.
     */
    public function calculateSalePrice(float $purchasePrice, string $tld = ''): float
    {
        $tldKey = strtolower(ltrim($tld, '.'));
        $row = $tldKey !== '' ? TldPricelist::query()->where('tld', $tldKey)->first() : null;
        if ($row) {
            $marginType = $row->margin_type ?? 'fixed';
            $marginValue = (float) ($row->margin_value ?? 0);
            if ($marginType === 'percent') {
                return round($purchasePrice * (1 + $marginValue / 100), 2);
            }

            return round($purchasePrice + $marginValue, 2);
        }

        $tlds = config('skrime.tlds', []);
        $marginType = $tlds[$tldKey]['margin_type'] ?? config('skrime.margin_type', 'fixed');
        $marginValue = (float) ($tlds[$tldKey]['margin_value'] ?? config('skrime.margin_value', 0));
        if ($marginType === 'percent') {
            return round($purchasePrice * (1 + $marginValue / 100), 2);
        }

        return round($purchasePrice + $marginValue, 2);
    }

    /**
     * Get sale price for a TLD and type (create/renew).
     */
    public function getSalePrice(string $tld, string $type = 'create'): float
    {
        $purchase = $this->getPurchasePrice($tld, $type);

        return $this->calculateSalePrice($purchase, $tld);
    }

    /**
     * Get pricing info for a TLD (purchase, sale, margin) for create.
     *
     * @return array{purchase_price: float, sale_price: float, margin: float, tld: string}
     */
    public function getPricingForTld(string $tld, string $type = 'create'): array
    {
        $purchase = $this->getPurchasePrice($tld, $type);
        $sale = $this->calculateSalePrice($purchase, $tld);

        return [
            'purchase_price' => round($purchase, 2),
            'sale_price' => $sale,
            'margin' => round($sale - $purchase, 2),
            'tld' => $tld,
        ];
    }
}
