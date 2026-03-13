<?php

namespace App\Models;

use App\Models\Concerns\HasProductShares;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ResellerDomain extends Model
{
    use HasFactory, HasProductShares;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'domain',
        'user_id',
        'skrime_id',
        'status',
        'registered_at',
        'expires_at',
        'auto_renew',
        'purchase_price',
        'sale_price',
        'tld',
        'metadata',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'registered_at' => 'date',
            'expires_at' => 'date',
            'auto_renew' => 'boolean',
            'purchase_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function profitMargin(): float
    {
        $purchase = (float) $this->purchase_price;
        $sale = (float) $this->sale_price;
        if ($purchase <= 0) {
            return 0;
        }

        return round($sale - $purchase, 2);
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (ResellerDomain $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
