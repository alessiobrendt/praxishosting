<?php

namespace Database\Factories;

use App\Models\TicketCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketCategory>
 */
class TicketCategoryFactory extends Factory
{
    protected $model = TicketCategory::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional(0.5)->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
