<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Domain extends Model
{
    use HasFactory;
    /**
     * @var list<string>
     */
    protected $fillable = [
        'site_id',
        'domain',
        'type',
        'is_primary',
        'is_verified',
        'ssl_status',
        'ssl_expires_at',
        'ssl_checked_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'is_verified' => 'boolean',
            'ssl_expires_at' => 'datetime',
            'ssl_checked_at' => 'datetime',
        ];
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
