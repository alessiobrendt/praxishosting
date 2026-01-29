<?php

namespace Database\Factories;

use App\Models\Domain;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Domain>
 */
class DomainFactory extends Factory
{
    protected $model = Domain::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'site_id' => Site::factory(),
            'domain' => fake()->domainName(),
            'type' => 'subdomain',
            'is_primary' => true,
            'is_verified' => false,
        ];
    }
}
