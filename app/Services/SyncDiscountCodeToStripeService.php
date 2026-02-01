<?php

namespace App\Services;

use App\Models\DiscountCode;
use Stripe\StripeClient;

class SyncDiscountCodeToStripeService
{
    public function __construct(
        protected StripeClient $stripe
    ) {}

    /**
     * Create or update Stripe Coupon and Promotion Code so the discount code works at Stripe Checkout.
     */
    public function sync(DiscountCode $discountCode): void
    {
        if (! $discountCode->is_active) {
            $this->deactivatePromotionCode($discountCode);

            return;
        }

        $needsNewCoupon = ! $discountCode->stripe_promotion_code_id
            || $discountCode->wasChanged(['code', 'type', 'value', 'recurrence']);

        if ($needsNewCoupon) {
            $this->deleteExistingPromotionCodeIfUnused($discountCode);
            $this->createCouponAndPromotionCode($discountCode);
        } else {
            $this->updatePromotionCode($discountCode);
        }
    }

    /**
     * Deactivate the Stripe Promotion Code when the discount code is deactivated.
     */
    public function deactivatePromotionCode(DiscountCode $discountCode): void
    {
        if (! $discountCode->stripe_promotion_code_id) {
            return;
        }

        try {
            $this->stripe->promotionCodes->update($discountCode->stripe_promotion_code_id, ['active' => false]);
        } catch (\Stripe\Exception\InvalidRequestException) {
            // Promotion code may already be deleted or invalid
        }
    }

    /**
     * Delete Stripe objects when the discount code is deleted (best effort).
     */
    public function onDiscountCodeDeleted(DiscountCode $discountCode): void
    {
        $this->deleteExistingPromotionCodeIfUnused($discountCode);
    }

    protected function deleteExistingPromotionCodeIfUnused(DiscountCode $discountCode): void
    {
        $promoId = $discountCode->stripe_promotion_code_id;
        if (! $promoId) {
            return;
        }

        try {
            $promo = $this->stripe->promotionCodes->retrieve($promoId);
            if (($promo->times_redeemed ?? 0) === 0) {
                $promo->delete();
            }
        } catch (\Stripe\Exception\InvalidRequestException) {
            // Already deleted or invalid
        }

        $discountCode->update([
            'stripe_coupon_id' => null,
            'stripe_promotion_code_id' => null,
        ]);
    }

    protected function createCouponAndPromotionCode(DiscountCode $discountCode): void
    {
        $couponParams = $this->buildCouponParams($discountCode);
        $coupon = $this->stripe->coupons->create($couponParams);

        $promoParams = [
            'coupon' => $coupon->id,
            'code' => $discountCode->code,
            'active' => $discountCode->is_active,
        ];
        if ($discountCode->valid_until) {
            $promoParams['expires_at'] = $discountCode->valid_until->timestamp;
        }
        if ($discountCode->max_redemptions !== null) {
            $promoParams['max_redemptions'] = $discountCode->max_redemptions;
        }

        $promo = $this->stripe->promotionCodes->create($promoParams);

        $discountCode->update([
            'stripe_coupon_id' => $coupon->id,
            'stripe_promotion_code_id' => $promo->id,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function buildCouponParams(DiscountCode $discountCode): array
    {
        $duration = $discountCode->recurrence === 'recurring' ? 'forever' : 'once';
        $params = ['duration' => $duration];

        if ($discountCode->type === 'percent') {
            $params['percent_off'] = min(100, (float) $discountCode->value);
        } else {
            $params['amount_off'] = (int) round((float) $discountCode->value * 100);
            $params['currency'] = config('cashier.currency', 'eur');
        }

        return $params;
    }

    protected function updatePromotionCode(DiscountCode $discountCode): void
    {
        if (! $discountCode->stripe_promotion_code_id) {
            return;
        }

        $params = ['active' => $discountCode->is_active];
        if ($discountCode->valid_until) {
            $params['expires_at'] = $discountCode->valid_until->timestamp;
        }
        if ($discountCode->max_redemptions !== null) {
            $params['max_redemptions'] = $discountCode->max_redemptions;
        }

        $this->stripe->promotionCodes->update($discountCode->stripe_promotion_code_id, $params);
    }
}
