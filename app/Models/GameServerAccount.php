<?php

namespace App\Models;

use App\Services\HostingPlanOptionSurchargeService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameServerAccount extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'hosting_plan_id',
        'hosting_server_id',
        'product_id',
        'name',
        'pterodactyl_server_id',
        'pterodactyl_user_id',
        'identifier',
        'credentials_encrypted',
        'status',
        'mollie_subscription_id',
        'mollie_payment_id',
        'current_period_ends_at',
        'cancel_at_period_end',
        'ends_at',
        'renewal_type',
        'auto_renew_with_balance',
        'option_values',
        'custom_monthly_price',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'current_period_ends_at' => 'datetime',
            'cancel_at_period_end' => 'boolean',
            'ends_at' => 'datetime',
            'auto_renew_with_balance' => 'boolean',
            'option_values' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hostingPlan(): BelongsTo
    {
        return $this->belongsTo(HostingPlan::class);
    }

    public function hostingServer(): BelongsTo
    {
        return $this->belongsTo(HostingServer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Effective monthly renewal amount (custom price, or plan price + option surcharge).
     */
    public function getMonthlyRenewalAmount(): float
    {
        $custom = (float) ($this->custom_monthly_price ?? 0);
        if ($custom > 0) {
            return round($custom, 2);
        }
        $plan = $this->hostingPlan;
        if (! $plan || ! $plan->is_active) {
            return 0.0;
        }
        $base = (float) ($plan->price ?? 0);
        $optionChoices = is_array($this->option_values) ? $this->option_values : [];
        $surcharge = app(HostingPlanOptionSurchargeService::class)->computeSurcharge($plan, $optionChoices);

        return round($base + $surcharge, 2);
    }

    /**
     * True if the account is suspended or period has ended (no control, only renew).
     */
    public function isSuspendedOrExpired(): bool
    {
        if ($this->status === 'suspended') {
            return true;
        }

        return $this->current_period_ends_at !== null && $this->current_period_ends_at->isPast();
    }
}
