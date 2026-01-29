<?php

namespace Database\Factories;

use App\Models\Template;
use App\Models\TemplatePage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TemplatePage>
 */
class TemplatePageFactory extends Factory
{
    protected $model = TemplatePage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(2, true);

        return [
            'template_id' => Template::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'order' => 0,
            'data' => [
                'hero' => [
                    'heading' => fake()->sentence(),
                    'text' => fake()->paragraph(),
                    'buttons' => [],
                    'image' => null,
                ],
            ],
        ];
    }
}
