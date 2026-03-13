<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lab404\Impersonate\Models\Impersonate;
use Laravel\Cashier\Billable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Billable, HasApiTokens, HasFactory, Impersonate, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'brand_id',
        'name',
        'email',
        'password',
        'google_id',
        'discord_id',
        'is_admin',
        'rank',
        'pin_hash',
        'pin_length',
        'inactivity_lock_minutes',
        'street',
        'street_number',
        'postal_code',
        'city',
        'state',
        'country',
        'company',
        'phone',
        'ticket_signature',
        'admin_dashboard_layout',
        'notification_preferences',
        'discord_notification_consent_at',
        'mollie_customer_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'pin_hash',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
            'pin_lockout_until' => 'datetime',
            'admin_dashboard_layout' => 'array',
            'notification_preferences' => 'array',
            'discord_notification_consent_at' => 'datetime',
        ];
    }

    /**
     * Get the attributes that should be appended to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['has_pin'];

    /**
     * Whether the user has a PIN set (for frontend without exposing pin_hash).
     */
    public function getHasPinAttribute(): bool
    {
        return $this->pin_hash !== null;
    }

    public function hasPin(): bool
    {
        return $this->pin_hash !== null;
    }

    /**
     * Whether the user has a Mollie customer ID (for billing/checkout).
     */
    public function hasMollieCustomerId(): bool
    {
        return ! empty($this->{$this->getMollieCustomerIdColumn()});
    }

    /**
     * Compatibility with Stripe-style checks. For Mollie, having a customer ID is treated as payment method ready.
     */
    public function hasDefaultPaymentMethod(): bool
    {
        return $this->hasMollieCustomerId();
    }

    /**
     * Daily support PIN for support requests (deterministic: user_id + secret + date).
     * Valid until end of day (midnight next day in app timezone).
     */
    public function getSupportPin(?Carbon $date = null): string
    {
        $date = $date ?? Carbon::today(config('app.timezone'));
        $secret = config('support.pin_secret');
        $input = $this->id.'|'.$secret.'|'.$date->format('Y-m-d');
        $hash = hash_hmac('sha256', $input, $secret);
        $num = hexdec(substr($hash, 0, 6)) % 1000000;

        return str_pad((string) $num, 6, '0', STR_PAD_LEFT);
    }

    /**
     * End of current day (midnight of next day) in app timezone — when the support PIN expires.
     */
    public function getSupportPinValidUntil(): Carbon
    {
        return Carbon::today(config('app.timezone'))->addDay()->startOfDay();
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Reseller domains assigned to this customer.
     *
     * @return HasMany<ResellerDomain>
     */
    public function resellerDomains(): HasMany
    {
        return $this->hasMany(ResellerDomain::class);
    }

    /**
     * Webspace accounts (Plesk hosting) owned by this user.
     *
     * @return HasMany<WebspaceAccount>
     */
    public function webspaceAccounts(): HasMany
    {
        return $this->hasMany(WebspaceAccount::class);
    }

    /**
     * Game server accounts (Pterodactyl) owned by this user.
     *
     * @return HasMany<GameServerAccount>
     */
    public function gameServerAccounts(): HasMany
    {
        return $this->hasMany(GameServerAccount::class);
    }

    /**
     * TeamSpeak server accounts owned by this user.
     *
     * @return HasMany<TeamSpeakServerAccount>
     */
    public function teamSpeakServerAccounts(): HasMany
    {
        return $this->hasMany(TeamSpeakServerAccount::class);
    }

    /**
     * Gameserver Cloud subscriptions owned by this user.
     *
     * @return HasMany<GameserverCloudSubscription>
     */
    public function gameserverCloudSubscriptions(): HasMany
    {
        return $this->hasMany(GameserverCloudSubscription::class);
    }

    /**
     * Product shares granted to this user (products shared with them).
     *
     * @return HasMany<ProductShare>
     */
    public function productShares(): HasMany
    {
        return $this->hasMany(ProductShare::class);
    }

    /**
     * Sites this user can edit as a collaborator.
     *
     * @return BelongsToMany<Site>
     */
    public function collaboratingSites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class, 'site_user')
            ->withPivot(['invited_by', 'invited_at'])
            ->withTimestamps();
    }

    /**
     * Groups this user belongs to (many-to-many).
     *
     * @return BelongsToMany<Group>
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'user_group')->withTimestamps();
    }

    /**
     * Whether the user has the given permission (via groups or wildcard *).
     * Super-admin (is_admin) has all permissions. Permission '*' grants everything.
     */
    public function hasPermission(string $key): bool
    {
        if ($this->is_admin) {
            return true;
        }

        $permissionKeys = $this->groups()
            ->with('permissions')
            ->get()
            ->flatMap(fn (Group $group) => $group->permissions->pluck('key'))
            ->unique()
            ->values();

        if ($permissionKeys->contains('*')) {
            return true;
        }

        return $permissionKeys->contains($key);
    }

    /**
     * Labels of all groups assigned to this user (for display in admin header).
     *
     * @return array<int, string>
     */
    public function groupLabels(): array
    {
        return $this->groups()->pluck('label')->values()->all();
    }

    /**
     * Groups with label and color for admin header pills.
     *
     * @return array<int, array{label: string, color: string|null}>
     */
    public function groupLabelsWithColors(): array
    {
        return $this->groups()
            ->orderBy('name')
            ->get(['label', 'color'])
            ->map(fn (Group $g) => ['label' => $g->label, 'color' => $g->color])
            ->values()
            ->all();
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    /**
     * Whether this user can impersonate other users (only admins).
     */
    public function canImpersonate(): bool
    {
        return $this->is_admin;
    }

    /**
     * Whether this user can be impersonated (no other admins).
     */
    public function canBeImpersonated(): bool
    {
        return ! $this->is_admin;
    }

    /**
     * Find a user by social provider and provider user ID.
     */
    public static function findByProvider(string $provider, string $id): ?User
    {
        $column = match ($provider) {
            'google' => 'google_id',
            'discord' => 'discord_id',
            default => null,
        };

        if ($column === null) {
            return null;
        }

        return static::query()->where($column, $id)->first();
    }

    /**
     * Whether the user has a name set (non-empty).
     */
    public function hasName(): bool
    {
        return $this->name !== null && trim($this->name) !== '';
    }

    /**
     * Invoices for this customer.
     *
     * @return HasMany<Invoice>
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Admin notes on this customer.
     *
     * @return HasMany<CustomerNote>
     */
    public function customerNotes(): HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }

    /**
     * Customer balance (Guthaben).
     *
     * @return HasOne<CustomerBalance>
     */
    public function customerBalance(): HasOne
    {
        return $this->hasOne(CustomerBalance::class);
    }

    /**
     * Balance transactions (credits/debits).
     *
     * @return HasMany<BalanceTransaction>
     */
    public function balanceTransactions(): HasMany
    {
        return $this->hasMany(BalanceTransaction::class);
    }

    /**
     * AI token balance.
     *
     * @return HasOne<AiTokenBalance>
     */
    public function aiTokenBalance(): HasOne
    {
        return $this->hasOne(AiTokenBalance::class);
    }

    /**
     * AI token transactions.
     *
     * @return HasMany<AiTokenTransaction>
     */
    public function aiTokenTransactions(): HasMany
    {
        return $this->hasMany(AiTokenTransaction::class);
    }

    /**
     * Support tickets created by this user (as customer).
     *
     * @return HasMany<Ticket>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Support tickets assigned to this user (as admin).
     *
     * @return HasMany<Ticket>
     */
    public function assignedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assigned_to');
    }

    /**
     * Whether the user has a complete billing profile (required for checkout).
     */
    public function hasCompleteBillingProfile(): bool
    {
        $required = ['name', 'street', 'postal_code', 'city', 'country'];

        foreach ($required as $field) {
            $value = $this->{$field};
            if ($value === null || trim((string) $value) === '') {
                return false;
            }
        }

        return true;
    }

    /**
     * Whether the user has all contact data required for domain order (Skrime/WHOIS).
     * No empty or placeholder values may be sent.
     */
    public function hasCompleteDomainContact(): bool
    {
        $required = ['name', 'street', 'postal_code', 'city', 'state', 'country', 'email', 'phone'];
        foreach ($required as $field) {
            $value = $this->{$field};
            if ($value === null || trim((string) $value) === '') {
                return false;
            }
        }
        $number = $this->street_number ?? '';
        if ($number === null || trim((string) $number) === '') {
            if (preg_match('/\s+([0-9]+[a-zA-Z]?)\s*$/', trim((string) $this->street ?? ''), $m)) {
                $number = $m[1];
            }
        }
        if ($number === null || trim((string) $number) === '') {
            return false;
        }

        return true;
    }

    /**
     * Get the Discord user ID for the discord notification channel.
     */
    public function routeNotificationForDiscord(object $notification): ?string
    {
        return $this->discord_id ? (string) $this->discord_id : null;
    }

    /**
     * Get the notification channels the user prefers for a given notification type.
     * Used by Notification::via() to respect user preferences (none, email, discord).
     *
     * @return array<int, string>
     */
    public function getPreferredNotificationChannels(string $type): array
    {
        $preference = $this->notification_preferences[$type] ?? 'email';

        return match ($preference) {
            'none' => [],
            'discord' => ['discord'],
            'email' => ['transactional_mail'],
            'email_discord' => ['transactional_mail', 'discord'],
            default => ['transactional_mail'],
        };
    }
}
