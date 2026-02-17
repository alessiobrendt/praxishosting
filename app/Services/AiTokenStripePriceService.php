<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use RuntimeException;
use Stripe\Exception\InvalidRequestException as StripeInvalidRequestException;
use Stripe\StripeClient;

class AiTokenStripePriceService
{
    private const CACHE_PREFIX = 'billing.ai_token_stripe_price.';

    private const CACHE_TTL_DAYS = 365;

    public function __construct(
        protected StripeClient $stripe
    ) {}

    /**
     * Returns the Stripe Price ID for the given token package amount.
     * Creates and caches a one-time Stripe Price if needed.
     */
    public function getPriceId(int $tokenAmount): ?string
    {
        $productId = config('billing.stripe_ai_tokens_product_id');
        if (! $productId) {
            return null;
        }

        $packages = config('billing.ai_token_packages', []);
        if (! is_array($packages) || ! array_key_exists($tokenAmount, $packages)) {
            return null;
        }

        $priceEur = $packages[$tokenAmount];
        if ($priceEur === null || $priceEur === '') {
            return null;
        }

        $priceEur = (float) $priceEur;
        $cacheKey = self::CACHE_PREFIX.$tokenAmount.'.'.number_format($priceEur, 2, '.', '');

        $priceId = Cache::get($cacheKey);
        if ($priceId) {
            try {
                $this->stripe->prices->retrieve($priceId);

                return $priceId;
            } catch (StripeInvalidRequestException) {
                Cache::forget($cacheKey);
            }
        }

        $unitAmountCents = (int) round($priceEur * 100);

        try {
            $price = $this->stripe->prices->create([
                'product' => $productId,
                'unit_amount' => $unitAmountCents,
                'currency' => 'eur',
            ]);
        } catch (StripeInvalidRequestException $e) {
            if (str_contains($e->getMessage(), 'No such product')) {
                throw new RuntimeException(
                    'Stripe-Produkt für AI-Tokens nicht gefunden. Bitte in Stripe ein Produkt anlegen (z. B. "AI Tokens") '
                    .'und die Produkt-ID (prod_…) in .env als STRIPE_AI_TOKENS_PRODUCT_ID eintragen.',
                    0,
                    $e
                );
            }
            throw $e;
        }

        Cache::put($cacheKey, $price->id, now()->addDays(self::CACHE_TTL_DAYS));

        return $price->id;
    }
}
