<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'site_subscription_id',
        'stripe_invoice_id',
        'number',
        'type',
        'amount',
        'tax',
        'status',
        'billing_period_start',
        'billing_period_end',
        'invoice_date',
        'due_date',
        'pdf_path',
        'invoice_xml_path',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'tax' => 'decimal:2',
            'billing_period_start' => 'date',
            'billing_period_end' => 'date',
            'invoice_date' => 'date',
            'due_date' => 'date',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function siteSubscription(): BelongsTo
    {
        return $this->belongsTo(SiteSubscription::class);
    }

    /**
     * @return HasMany<InvoiceLineItem>
     */
    public function lineItems(): HasMany
    {
        return $this->hasMany(InvoiceLineItem::class)->orderBy('position');
    }

    /**
     * @return HasMany<InvoiceDunningLetter>
     */
    public function dunningLetters(): HasMany
    {
        return $this->hasMany(InvoiceDunningLetter::class)->orderBy('level');
    }
}
