<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
            'is_admin' => false,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Indicate that the model has a PIN set.
     */
    public function withPin(string $pin = '1234'): static
    {
        return $this->state(fn (array $attributes) => [
            'pin_hash' => Hash::make($pin),
            'pin_length' => strlen($pin),
        ]);
    }

    /**
     * Indicate that the model is in PIN lockout.
     */
    public function withPinLockout(): static
    {
        return $this->state(fn (array $attributes) => [
            'pin_lockout_until' => now()->addMinutes(config('security.pin.lockout_minutes', 15)),
        ]);
    }

    /**
     * Indicate that the model has a complete billing profile (for checkout).
     */
    public function withBillingProfile(): static
    {
        return $this->state(fn (array $attributes) => [
            'street' => fake()->streetAddress(),
            'postal_code' => fake()->postcode(),
            'city' => fake()->city(),
            'country' => 'DE',
            'company' => fake()->optional(0.3)->company(),
        ]);
    }
}
