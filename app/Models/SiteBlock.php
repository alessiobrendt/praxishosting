<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SiteBlock extends Model
{
    protected $fillable = [
        'site_id',
        'site_page_id',
        'parent_id',
        'type',
        'data',
        'position',
        'uuid',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function sitePage(): BelongsTo
    {
        return $this->belongsTo(SitePage::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(SiteBlock::class, 'parent_id');
    }

    /**
     * @return HasMany<SiteBlock>
     */
    public function children(): HasMany
    {
        return $this->hasMany(SiteBlock::class, 'parent_id')->orderBy('position');
    }
}
