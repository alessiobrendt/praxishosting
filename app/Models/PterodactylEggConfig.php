<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PterodactylEggConfig extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'hosting_server_id',
        'nest_id',
        'egg_id',
        'config',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'nest_id' => 'integer',
            'egg_id' => 'integer',
            'config' => 'array',
        ];
    }

    public function hostingServer(): BelongsTo
    {
        return $this->belongsTo(HostingServer::class);
    }
}
