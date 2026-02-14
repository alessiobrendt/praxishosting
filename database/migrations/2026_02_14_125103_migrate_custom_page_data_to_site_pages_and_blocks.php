<?php

use App\Models\Site;
use App\Models\SiteBlock;
use App\Models\SitePage;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Migrate custom_page_data (JSON) into site_pages and site_blocks.
     */
    public function up(): void
    {
        $sites = Site::query()
            ->where('has_page_designer', true)
            ->whereNotNull('custom_page_data')
            ->where('use_normalized_pages', false)
            ->with('template.pages')
            ->get();

        foreach ($sites as $site) {
            $this->migrateSite($site);
        }
    }

    /**
     * Reverse the migrations.
     * Delete site_pages/site_blocks for migrated sites; clear use_normalized_pages.
     */
    public function down(): void
    {
        $siteIds = Site::where('use_normalized_pages', true)->pluck('id');
        SiteBlock::whereIn('site_id', $siteIds)->delete();
        SitePage::whereIn('site_id', $siteIds)->delete();
        Site::whereIn('id', $siteIds)->update(['use_normalized_pages' => false]);
    }

    private function migrateSite(Site $site): void
    {
        $customPageData = $site->custom_page_data;
        if (! is_array($customPageData)) {
            return;
        }

        $slugToPage = [];
        $templatePages = $site->template?->pages ?? collect();

        // Index page
        $slugToPage['index'] = [
            'slug' => 'index',
            'name' => 'Startseite',
            'order' => 0,
            'is_custom' => false,
            'is_active' => true,
            'template_page_id' => $templatePages->firstWhere('slug', 'index')?->id,
            'layout_components' => $customPageData['layout_components'] ?? [],
        ];

        // Template subpages (from custom_page_data.pages)
        $pages = $customPageData['pages'] ?? [];
        $pagesMeta = $customPageData['pages_meta'] ?? [];
        $order = 1;
        foreach ($templatePages as $tp) {
            if ($tp->slug === 'index') {
                continue;
            }
            $slug = $tp->slug;
            $pageData = $pages[$slug] ?? [];
            $meta = $pagesMeta[$slug] ?? [];
            $slugToPage[$slug] = [
                'slug' => $slug,
                'name' => $tp->name ?? $slug,
                'order' => $order++,
                'is_custom' => false,
                'is_active' => ($meta['active'] ?? false) === true,
                'template_page_id' => $tp->id,
                'layout_components' => $pageData['layout_components'] ?? [],
            ];
        }

        // Custom pages
        $customPages = $customPageData['custom_pages'] ?? [];
        if (is_array($customPages)) {
            foreach ($customPages as $cp) {
                if (! isset($cp['slug']) || ! is_string($cp['slug']) || $cp['slug'] === '') {
                    continue;
                }
                $slug = $cp['slug'];
                if (isset($slugToPage[$slug])) {
                    continue;
                }
                $slugToPage[$slug] = [
                    'slug' => $slug,
                    'name' => $cp['name'] ?? $slug,
                    'order' => $cp['order'] ?? $order++,
                    'is_custom' => true,
                    'is_active' => true,
                    'template_page_id' => null,
                    'layout_components' => ($pages[$slug] ?? [])['layout_components'] ?? [],
                ];
            }
        }

        DB::transaction(function () use ($site, $slugToPage) {
            foreach ($slugToPage as $slug => $pageData) {
                $sitePage = SitePage::create([
                    'site_id' => $site->id,
                    'slug' => $pageData['slug'],
                    'name' => $pageData['name'],
                    'order' => $pageData['order'],
                    'is_custom' => $pageData['is_custom'],
                    'is_active' => $pageData['is_active'],
                    'template_page_id' => $pageData['template_page_id'],
                ]);

                $this->migrateBlocks($site, $sitePage, $pageData['layout_components']);
            }

            $site->update(['use_normalized_pages' => true]);
        });
    }

    /**
     * @param  array<int, array{id?: string, type?: string, data?: array, children?: array}>  $components
     */
    private function migrateBlocks(Site $site, SitePage $sitePage, array $components, ?int $parentId = null, int $position = 0): void
    {
        foreach ($components as $idx => $comp) {
            if (! is_array($comp)) {
                continue;
            }
            $blockId = $comp['id'] ?? 'block_'.uniqid();
            $type = $comp['type'] ?? 'section';
            $data = $comp['data'] ?? [];
            $children = $comp['children'] ?? [];

            $block = SiteBlock::create([
                'site_id' => $site->id,
                'site_page_id' => $sitePage->id,
                'parent_id' => $parentId,
                'type' => $type,
                'data' => $data,
                'position' => $position + $idx,
                'uuid' => $blockId,
            ]);

            if (! empty($children)) {
                $this->migrateBlocks($site, $sitePage, $children, $block->id, 0);
            }
        }
    }
};
