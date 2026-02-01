<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'site_id' => null,
            'ticket_category_id' => TicketCategory::factory(),
            'ticket_priority_id' => TicketPriority::factory(),
            'subject' => fake()->sentence(),
            'status' => 'open',
        ];
    }
}
