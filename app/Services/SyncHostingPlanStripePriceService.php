<?php

namespace App\Services;

use App\Models\HostingPlan;
use RuntimeException;
use Stripe\Exception\InvalidRequestException as StripeInvalidRequestException;
use Stripe\StripeClient;

class SyncHostingPlanStripePriceService
{
    public function __construct(
        protected StripeClient $stripe
    ) {}

    protected function productIdForPlan(HostingPlan $plan): ?string
    {
        $panelType = $plan->panel_type ?? 'plesk';

        return $panelType === 'pterodactyl'
            ? config('billing.stripe_game_server_product_id')
            : config('billing.stripe_webspace_product_id');
    }

    /**
     * Ensure the hosting plan has a Stripe Price ID. Creates or updates the Stripe Price
     * when the plan has a price set. Stripe Prices are immutable; on price change a new
     * Price is created. Call after save in Admin.
     */
    public function sync(HostingPlan $plan): void
    {
        $productId = $this->productIdForPlan($plan);
        if (! $productId) {
            return;
        }

        if ($plan->price === null) {
            return;
        }

        $priceAmount = (float) $plan->price;
        $unitAmountCents = (int) round($priceAmount * 100);

        if ($plan->stripe_price_id) {
            try {
                $existingPrice = $this->stripe->prices->retrieve($plan->stripe_price_id);
                if (isset($existingPrice->unit_amount) && (int) $existingPrice->unit_amount === $unitAmountCents) {
                    return;
                }
            } catch (StripeInvalidRequestException) {
                // Price may have been deleted in Stripe; create new one
            }
        }

        try {
            $price = $this->stripe->prices->create([
                'product' => $productId,
                'unit_amount' => $unitAmountCents,
                'currency' => 'eur',
                'recurring' => [
                    'interval' => 'month',
                ],
            ]);
        } catch (StripeInvalidRequestException $e) {
            if (str_contains($e->getMessage(), 'No such product')) {
                $configKey = ($plan->panel_type ?? 'plesk') === 'pterodactyl'
                    ? 'STRIPE_GAME_SERVER_PRODUCT_ID'
                    : 'STRIPE_WEBSPACE_PRODUCT_ID';
                throw new RuntimeException(
                    'Stripe-Produkt nicht gefunden. Bitte im Stripe-Dashboard ein Produkt anlegen und die Produkt-ID (prod_…) in .env als '.$configKey.' eintragen.',
                    0,
                    $e
                );
            }
            throw $e;
        }

        $plan->update(['stripe_price_id' => $price->id]);
    }

    /**
     * Ensure the plan has a Stripe Price ID; create from plan price if missing.
     * Returns the Stripe Price ID or null if product/price not configured.
     */
    public function ensurePriceId(HostingPlan $plan): ?string
    {
        if ($plan->stripe_price_id) {
            return $plan->stripe_price_id;
        }

        $productId = $this->productIdForPlan($plan);
        if (! $productId) {
            return null;
        }

        if ($plan->price === null) {
            return null;
        }

        $priceAmount = (float) $plan->price;
        $unitAmountCents = (int) round($priceAmount * 100);

        try {
            $price = $this->stripe->prices->create([
                'product' => $productId,
                'unit_amount' => $unitAmountCents,
                'currency' => 'eur',
                'recurring' => [
                    'interval' => 'month',
                ],
            ]);
        } catch (StripeInvalidRequestException $e) {
            if (str_contains($e->getMessage(), 'No such product')) {
                $configKey = ($plan->panel_type ?? 'plesk') === 'pterodactyl'
                    ? 'STRIPE_GAME_SERVER_PRODUCT_ID'
                    : 'STRIPE_WEBSPACE_PRODUCT_ID';
                throw new RuntimeException(
                    'Stripe-Produkt nicht gefunden. Bitte im Stripe-Dashboard ein Produkt anlegen und die Produkt-ID (prod_…) in .env als '.$configKey.' eintragen.',
                    0,
                    $e
                );
            }
            throw $e;
        }

        $plan->update(['stripe_price_id' => $price->id]);

        return $price->id;
    }
}
