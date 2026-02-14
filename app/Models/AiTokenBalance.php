<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiTokenBalance extends Model
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
            'balance' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<AiTokenTransaction>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(AiTokenTransaction::class, 'user_id', 'user_id');
    }

    public function hasEnough(int $tokens): bool
    {
        return $this->balance >= $tokens;
    }
}
