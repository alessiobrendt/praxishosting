<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterPost extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'site_id',
        'subject',
        'body',
        'status',
        'sent_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }
}
