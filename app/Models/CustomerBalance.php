<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerBalance extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = ['user_id', 'balance'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<BalanceTransaction>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(BalanceTransaction::class, 'user_id', 'user_id');
    }
}
