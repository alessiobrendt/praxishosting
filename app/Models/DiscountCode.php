<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'type',
        'value',
        'recurrence',
        'valid_from',
        'valid_until',
        'max_redemptions',
        'times_redeemed',
        'is_active',
        'stripe_coupon_id',
        'stripe_promotion_code_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
            'times_redeemed' => 'integer',
            'max_redemptions' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->valid_from && now()->lt($this->valid_from)) {
            return false;
        }
        if ($this->valid_until && now()->gt($this->valid_until)) {
            return false;
        }
        if ($this->max_redemptions !== null && $this->times_redeemed >= $this->max_redemptions) {
            return false;
        }

        return true;
    }
}
