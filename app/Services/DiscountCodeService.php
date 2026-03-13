<?php

namespace App\Services;

use App\Models\DiscountCode;

class DiscountCodeService
{
    /**
     * Resolve a discount code by string (case-insensitive) and return the model if valid.
     */
    public function resolve(string $code): ?DiscountCode
    {
        if ($code === '') {
            return null;
        }

        $model = DiscountCode::query()
            ->whereRaw('LOWER(code) = ?', [strtolower(trim($code))])
            ->first();

        if (! $model || ! $model->isValid()) {
            return null;
        }

        return $model;
    }

    /**
     * Compute discount amount for a given total and period.
     * - first_period: discount applies only to the first period's share of the total.
     * - entire_duration: discount applies to the full total.
     *
     * @return array{discount_amount: float, final_amount: float, discount_code: DiscountCode}
     */
    public function computeDiscount(DiscountCode $discountCode, float $totalAmount, int $periodMonths): array
    {
        $periodMonths = max(1, $periodMonths);
        $firstPeriodShare = $totalAmount / $periodMonths;

        $discountableAmount = ($discountCode->applies_to ?? 'entire_duration') === 'first_period'
            ? $firstPeriodShare
            : $totalAmount;

        $value = (float) $discountCode->value;
        if ($discountCode->type === 'percent') {
            $discountAmount = round($discountableAmount * ($value / 100), 2);
        } else {
            $discountAmount = round(min($value, $discountableAmount), 2);
        }

        $discountAmount = min($discountAmount, $totalAmount);
        $finalAmount = round($totalAmount - $discountAmount, 2);

        return [
            'discount_amount' => $discountAmount,
            'final_amount' => max(0, $finalAmount),
            'discount_code' => $discountCode,
        ];
    }

    /**
     * Validate code and return discount info for the given amount/period, or null if invalid.
     *
     * @return array{valid: true, discount_amount: float, final_amount: float, code: string}|array{valid: false, message: string}|null
     */
    public function validateForCheckout(string $code, float $totalAmount, int $periodMonths = 1): ?array
    {
        $discountCode = $this->resolve($code);
        if (! $discountCode) {
            return [
                'valid' => false,
                'message' => 'Rabattcode ungültig, abgelaufen oder bereits ausgeschöpft.',
            ];
        }

        $result = $this->computeDiscount($discountCode, $totalAmount, $periodMonths);

        return [
            'valid' => true,
            'discount_amount' => $result['discount_amount'],
            'final_amount' => $result['final_amount'],
            'code' => $discountCode->code,
        ];
    }

    public function incrementRedemption(DiscountCode $discountCode): void
    {
        $discountCode->increment('times_redeemed');
    }
}
