<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'number',
        'status',
        'valid_until',
        'invoice_date',
        'amount',
        'tax',
        'pdf_path',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'valid_until' => 'date',
            'invoice_date' => 'date',
            'amount' => 'decimal:2',
            'tax' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<QuoteLineItem>
     */
    public function lineItems(): HasMany
    {
        return $this->hasMany(QuoteLineItem::class)->orderBy('position');
    }
}
