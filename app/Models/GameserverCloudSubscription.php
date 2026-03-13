<?php

namespace App\Models;

use App\Models\Concerns\HasProductShares;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class GameserverCloudSubscription extends Model
{
    use HasProductShares;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'user_id',
        'gameserver_cloud_plan_id',
        'plan_display_user_defined',
        'custom_max_cpu',
        'custom_max_memory_mb',
        'custom_max_disk_gb',
        'custom_price',
        'mollie_subscription_id',
        'mollie_payment_id',
        'current_period_ends_at',
        'cancel_at_period_end',
        'ends_at',
        'status',
        'auto_renew_with_balance',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'current_period_ends_at' => 'datetime',
            'plan_display_user_defined' => 'boolean',
            'custom_price' => 'decimal:2',
            'cancel_at_period_end' => 'boolean',
            'ends_at' => 'datetime',
            'auto_renew_with_balance' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gameserverCloudPlan(): BelongsTo
    {
        return $this->belongsTo(GameserverCloudPlan::class);
    }

    /**
     * @return HasMany<GameServerAccount, $this>
     */
    public function gameServerAccounts(): HasMany
    {
        return $this->hasMany(GameServerAccount::class);
    }

    public function getUsedCpu(): int
    {
        return (int) $this->gameServerAccounts()->get()->sum(function (GameServerAccount $account) {
            $a = $account->allocation;
            if (! is_array($a)) {
                return 0;
            }

            return (int) ($a['cpu'] ?? 0);
        });
    }

    public function getUsedMemoryMb(): int
    {
        return (int) $this->gameServerAccounts()->get()->sum(function (GameServerAccount $account) {
            $a = $account->allocation;
            if (! is_array($a)) {
                return 0;
            }

            return (int) ($a['memory_mb'] ?? 0);
        });
    }

    public function getUsedDiskMb(): int
    {
        return (int) $this->gameServerAccounts()->get()->sum(function (GameServerAccount $account) {
            $a = $account->allocation;
            if (! is_array($a)) {
                return 0;
            }

            return (int) ($a['disk_mb'] ?? 0);
        });
    }

    public function getEffectiveMaxCpu(): int
    {
        if ($this->plan_display_user_defined && $this->custom_max_cpu !== null) {
            return (int) $this->custom_max_cpu;
        }
        $config = $this->gameserverCloudPlan?->config ?? [];

        return (int) ($config['max_cpu'] ?? 0);
    }

    public function getEffectiveMaxMemoryMb(): int
    {
        if ($this->plan_display_user_defined && $this->custom_max_memory_mb !== null) {
            return (int) $this->custom_max_memory_mb;
        }
        $config = $this->gameserverCloudPlan?->config ?? [];

        return (int) ($config['max_memory_mb'] ?? 0);
    }

    public function getEffectiveMaxDiskMb(): int
    {
        if ($this->plan_display_user_defined && $this->custom_max_disk_gb !== null) {
            return (int) $this->custom_max_disk_gb * 1024;
        }
        $config = $this->gameserverCloudPlan?->config ?? [];
        $maxGb = (int) ($config['max_disk_gb'] ?? 0);

        return $maxGb * 1024;
    }

    public function getRemainingCpu(): int
    {
        return max(0, $this->getEffectiveMaxCpu() - $this->getUsedCpu());
    }

    public function getRemainingMemoryMb(): int
    {
        return max(0, $this->getEffectiveMaxMemoryMb() - $this->getUsedMemoryMb());
    }

    public function getRemainingDiskMb(): int
    {
        return max(0, $this->getEffectiveMaxDiskMb() - $this->getUsedDiskMb());
    }

    public function getDisplayPrice(): ?float
    {
        if ($this->plan_display_user_defined && $this->custom_price !== null) {
            return (float) $this->custom_price;
        }
        $plan = $this->gameserverCloudPlan;

        return $plan !== null ? (float) $plan->price : null;
    }

    public function isSuspendedOrExpired(): bool
    {
        if ($this->status === 'suspended' || $this->status === 'cancelled') {
            return true;
        }

        return $this->current_period_ends_at !== null && $this->current_period_ends_at->isPast();
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
        static::creating(function (GameserverCloudSubscription $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
