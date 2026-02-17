<?php

namespace App\Services;

use App\Models\Template;
use RuntimeException;
use Stripe\Exception\InvalidRequestException as StripeInvalidRequestException;
use Stripe\StripeClient;

class SyncTemplateStripePriceService
{
    public function __construct(
        protected StripeClient $stripe
    ) {}

    /**
     * Ensure the template has a Stripe Price ID. Creates or updates the Stripe Price
     * when the template has a price set (including 0 for free tier). Stripe Prices are
     * immutable; on price change a new Price is created.
     */
    public function sync(Template $template): void
    {
        $productId = config('billing.stripe_meine_seiten_product_id');
        if (! $productId) {
            return;
        }

        if ($template->price === null) {
            return;
        }

        $priceAmount = (float) $template->price;
        $unitAmountCents = (int) round($priceAmount * 100);

        if ($template->stripe_price_id) {
            try {
                $existingPrice = $this->stripe->prices->retrieve($template->stripe_price_id);
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
                throw new RuntimeException(
                    'Stripe-Produkt nicht gefunden. Bitte im Stripe-Dashboard ein Produkt anlegen (z. B. "Meine Seiten") '
                    .'und die Produkt-ID (prod_…) in .env als STRIPE_MEINE_SEITEN_PRODUCT_ID eintragen.',
                    0,
                    $e
                );
            }
            throw $e;
        }

        $template->update(['stripe_price_id' => $price->id]);
    }

    /**
     * Ensure the template has a Stripe Price ID; create from template price if missing.
     * Returns the Stripe Price ID or null.
     */
    public function ensurePriceId(Template $template): ?string
    {
        if ($template->stripe_price_id) {
            return $template->stripe_price_id;
        }

        $productId = config('billing.stripe_meine_seiten_product_id');
        if (! $productId) {
            return null;
        }

        if ($template->price === null) {
            return null;
        }

        $priceAmount = (float) $template->price;
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
                throw new RuntimeException(
                    'Stripe-Produkt nicht gefunden. Bitte im Stripe-Dashboard ein Produkt anlegen (z. B. "Meine Seiten") '
                    .'und die Produkt-ID (prod_…) in .env als STRIPE_MEINE_SEITEN_PRODUCT_ID eintragen.',
                    0,
                    $e
                );
            }
            throw $e;
        }

        $template->update(['stripe_price_id' => $price->id]);

        return $price->id;
    }
}
