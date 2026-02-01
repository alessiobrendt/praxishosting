<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderConfirmation extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'quote_id',
        'number',
        'order_date',
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
            'order_date' => 'date',
            'amount' => 'decimal:2',
            'tax' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * @return HasMany<OrderConfirmationLineItem>
     */
    public function lineItems(): HasMany
    {
        return $this->hasMany(OrderConfirmationLineItem::class)->orderBy('position');
    }
}
