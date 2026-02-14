<?php

namespace App\Models;

use App\Services\SitePageDataResolver;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Site extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'user_id',
        'template_id',
        'name',
        'slug',
        'domain_type',
        'domain',
        'custom_colors',
        'favicon_url',
        'custom_page_data',
        'status',
        'is_legacy',
        'has_page_designer',
        'use_normalized_pages',
        'published_version_id',
        'draft_version_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'custom_colors' => 'array',
            'custom_page_data' => 'array',
            'is_legacy' => 'boolean',
            'has_page_designer' => 'boolean',
            'use_normalized_pages' => 'boolean',
        ];
    }

    /**
     * Resolve custom_page_data: when use_normalized_pages, build from site_pages/site_blocks.
     */
    protected function customPageData(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value): ?array {
                if ($this->use_normalized_pages ?? false) {
                    return app(SitePageDataResolver::class)->buildFromRelational($this);
                }
                if ($value === null) {
                    return null;
                }

                return is_string($value) ? json_decode($value, true) : $value;
            },
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Subscription for this site (1 Site = 1 Subscription for "Meine Seiten").
     *
     * @return HasOne<SiteSubscription>
     */
    public function siteSubscription(): HasOne
    {
        return $this->hasOne(SiteSubscription::class);
    }

    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    /**
     * Users who can edit this site (collaborators).
     *
     * @return BelongsToMany<User>
     */
    public function collaborators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'site_user')
            ->withPivot(['invited_by', 'invited_at'])
            ->withTimestamps();
    }

    /**
     * Invitations for this site.
     *
     * @return HasMany<SiteInvitation>
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(SiteInvitation::class);
    }

    /**
     * Versions of this site.
     *
     * @return HasMany<SiteVersion>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(SiteVersion::class);
    }

    /**
     * Published version of this site.
     *
     * @return BelongsTo<SiteVersion>
     */
    public function publishedVersion(): BelongsTo
    {
        return $this->belongsTo(SiteVersion::class, 'published_version_id');
    }

    /**
     * Draft version of this site.
     *
     * @return BelongsTo<SiteVersion>
     */
    public function draftVersion(): BelongsTo
    {
        return $this->belongsTo(SiteVersion::class, 'draft_version_id');
    }

    /**
     * Support tickets related to this site.
     *
     * @return HasMany<Ticket>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Contact form submissions for this site.
     *
     * @return HasMany<ContactSubmission>
     */
    public function contactSubmissions(): HasMany
    {
        return $this->hasMany(ContactSubmission::class);
    }

    /**
     * Newsletter subscriptions for this site.
     *
     * @return HasMany<NewsletterSubscription>
     */
    public function newsletterSubscriptions(): HasMany
    {
        return $this->hasMany(NewsletterSubscription::class);
    }

    /**
     * Newsletter posts (news) for this site.
     *
     * @return HasMany<NewsletterPost>
     */
    public function newsletterPosts(): HasMany
    {
        return $this->hasMany(NewsletterPost::class);
    }

    /**
     * Normalized pages for this site (when using site_pages instead of custom_page_data JSON).
     *
     * @return HasMany<SitePage>
     */
    public function sitePages(): HasMany
    {
        return $this->hasMany(SitePage::class);
    }

    /**
     * Normalized blocks for this site (when using site_blocks instead of custom_page_data JSON).
     *
     * @return HasMany<SiteBlock>
     */
    public function siteBlocks(): HasMany
    {
        return $this->hasMany(SiteBlock::class);
    }

    /**
     * Media files for this site (images, etc.).
     *
     * @return HasMany<SiteMedia>
     */
    public function siteMedia(): HasMany
    {
        return $this->hasMany(SiteMedia::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Create a version snapshot (used by SiteObserver and SiteDesignerController).
     *
     * @return \App\Models\SiteVersion
     */
    public function createVersionSnapshot(int $userId)
    {
        $latestVersion = $this->versions()->latest('version_number')->first();
        $versionNumber = $latestVersion ? $latestVersion->version_number + 1 : 1;

        $version = SiteVersion::create([
            'site_id' => $this->id,
            'version_number' => $versionNumber,
            'name' => "Version {$versionNumber}",
            'description' => 'Automatisch erstellt',
            'custom_page_data' => $this->custom_page_data,
            'custom_colors' => $this->custom_colors,
            'is_published' => false,
            'created_by' => $userId,
        ]);

        $this->update(['draft_version_id' => $version->id]);

        return $version;
    }

    protected static function booted(): void
    {
        static::creating(function (Site $site): void {
            if (empty($site->uuid)) {
                $site->uuid = (string) Str::uuid();
            }
        });
    }
}
