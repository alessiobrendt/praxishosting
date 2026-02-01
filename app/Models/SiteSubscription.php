<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SiteSubscription extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'site_id',
        'stripe_subscription_id',
        'stripe_price_id',
        'stripe_status',
        'current_period_ends_at',
        'cancel_at_period_end',
        'ends_at',
        'renewal_type',
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
        ];
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Invoices for this subscription.
     *
     * @return HasMany<Invoice>
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
