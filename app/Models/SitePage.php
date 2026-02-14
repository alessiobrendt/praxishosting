<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SitePage extends Model
{
    protected $fillable = [
        'site_id',
        'slug',
        'name',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image',
        'robots',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'order',
        'is_custom',
        'is_active',
        'template_page_id',
    ];

    protected function casts(): array
    {
        return [
            'is_custom' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function templatePage(): BelongsTo
    {
        return $this->belongsTo(TemplatePage::class, 'template_page_id');
    }

    /**
     * Root blocks for this page (parent_id null).
     *
     * @return HasMany<SiteBlock>
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(SiteBlock::class)->whereNull('parent_id')->orderBy('position');
    }

    /**
     * All blocks for this page (any parent).
     *
     * @return HasMany<SiteBlock>
     */
    public function allBlocks(): HasMany
    {
        return $this->hasMany(SiteBlock::class)->orderBy('position');
    }
}
