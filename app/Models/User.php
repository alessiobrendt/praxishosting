<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Billable, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'pin_hash',
        'pin_length',
        'inactivity_lock_minutes',
        'street',
        'postal_code',
        'city',
        'country',
        'company',
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

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
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

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
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
     * Quotes for this customer.
     *
     * @return HasMany<Quote>
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Order confirmations for this customer.
     *
     * @return HasMany<OrderConfirmation>
     */
    public function orderConfirmations(): HasMany
    {
        return $this->hasMany(OrderConfirmation::class);
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
}
