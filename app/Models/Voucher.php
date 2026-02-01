<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Voucher extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'balance',
        'use_type',
        'user_id',
        'redeemed_at',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
            'redeemed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isRedeemed(): bool
    {
        return $this->redeemed_at !== null;
    }

    public static function generateCode(): string
    {
        do {
            $code = strtoupper(Str::random(12));
        } while (static::where('code', $code)->exists());

        return $code;
    }
}
