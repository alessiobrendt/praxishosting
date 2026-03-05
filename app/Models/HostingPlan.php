<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class HostingPlan extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'brand_id',
        'hosting_server_id',
        'panel_type',
        'config',
        'name',
        'plesk_package_name',
        'disk_gb',
        'traffic_gb',
        'domains',
        'subdomains',
        'mailboxes',
        'databases',
        'price',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'config' => 'array',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Pterodactyl hosting server to use for provisioning (only for panel_type pterodactyl).
     *
     * @return BelongsTo<HostingServer|null, HostingPlan>
     */
    public function hostingServer(): BelongsTo
    {
        return $this->belongsTo(HostingServer::class);
    }

    /**
     * Product entry for this plan (Webspace sellable).
     *
     * @return MorphOne<Product>
     */
    public function product(): MorphOne
    {
        return $this->morphOne(Product::class, 'productable');
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
        return $this->hasMany(GameServerAccount::class);
    }

    /**
     * @return HasMany<TeamSpeakServerAccount>
     */
    public function teamSpeakServerAccounts(): HasMany
    {
        return $this->hasMany(TeamSpeakServerAccount::class);
    }
}
