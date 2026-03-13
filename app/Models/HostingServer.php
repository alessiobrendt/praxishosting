<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HostingServer extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'brand_id',
        'panel_type',
        'config',
        'name',
        'hostname',
        'port',
        'use_ssl',
        'ip_address',
        'api_token',
        'api_username',
        'is_active',
        'api_checked_at',
        'api_check_status',
        'api_check_message',
        'bind_zone_content',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'port' => 'integer',
            'use_ssl' => 'boolean',
            'is_active' => 'boolean',
            'config' => 'array',
            'api_checked_at' => 'datetime',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function usesRestApi(): bool
    {
        return ! empty($this->api_username);
    }

    /**
     * @return HasMany<WebspaceAccount>
     */
    public function webspaceAccounts(): HasMany
    {
        return $this->hasMany(WebspaceAccount::class);
    }

    /**
     * @return HasMany<GameServerAccount>
     */
    public function gameServerAccounts(): HasMany
    {
        return $this->hasMany(GameServerAccount::class, 'hosting_server_id');
    }

    /**
     * @return HasMany<TeamSpeakServerAccount>
     */
    public function teamSpeakServerAccounts(): HasMany
    {
        return $this->hasMany(TeamSpeakServerAccount::class, 'hosting_server_id');
    }

    /**
     * @return HasMany<PterodactylEggConfig>
     */
    public function pterodactylEggConfigs(): HasMany
    {
        return $this->hasMany(PterodactylEggConfig::class);
    }
}
