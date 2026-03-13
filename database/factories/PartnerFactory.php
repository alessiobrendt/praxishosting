<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Partner>
 */
class PartnerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'description' => fake()->optional()->sentence(),
            'image_path' => null,
            'user_id' => null,
            'discount_percent' => fake()->numberBetween(0, 30),
            'expires_at' => null,
            'is_active' => true,
        ];
    }
}
