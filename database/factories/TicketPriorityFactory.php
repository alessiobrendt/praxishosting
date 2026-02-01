<?php

namespace Database\Factories;

use App\Models\TicketPriority;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketPriority>
 */
class TicketPriorityFactory extends Factory
{
    protected $model = TicketPriority::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'color' => fake()->hexColor(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
