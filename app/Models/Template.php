<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'page_data',
        'preview_image',
        'is_active',
        'price',
        'stripe_price_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'page_data' => 'array',
            'is_active' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Pages belonging to this template.
     *
     * @return HasMany<TemplatePage>
     */
    public function pages(): HasMany
    {
        return $this->hasMany(TemplatePage::class)->orderBy('order');
    }
}
