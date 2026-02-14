<?php

namespace App\Services;

use App\Models\Site;
use App\Models\SiteBlock;
use App\Models\SitePage;
use Illuminate\Support\Facades\DB;

class SitePageDataResolver
{
    /**
     * Sync custom_page_data array into site_pages and site_blocks (replace existing).
     */
    public function syncToRelational(Site $site, array $customPageData): void
    {
        DB::transaction(function () use ($site, $customPageData) {
            $site->siteBlocks()->delete();
            $site->sitePages()->delete();

            $slugToPage = $this->extractPagesFromCustomPageData($customPageData, $site);
            $templatePages = $site->template?->pages ?? collect();

            $order = 0;
            foreach ($slugToPage as $slug => $pageData) {
                $templatePage = $templatePages->firstWhere('slug', $slug);
                $seo = $pageData['seo'] ?? [];
                $seo = is_array($seo) ? $seo : [];
                $sitePage = SitePage::create([
                    'site_id' => $site->id,
                    'slug' => $slug,
                    'name' => $pageData['name'] ?? $slug,
                    'meta_title' => $seo['meta_title'] ?? null,
                    'meta_description' => $seo['meta_description'] ?? null,
                    'og_title' => $seo['og_title'] ?? null,
                    'og_description' => $seo['og_description'] ?? null,
                    'og_image' => $seo['og_image'] ?? null,
                    'robots' => $seo['robots'] ?? null,
                    'twitter_card' => $seo['twitter_card'] ?? null,
                    'twitter_title' => $seo['twitter_title'] ?? null,
                    'twitter_description' => $seo['twitter_description'] ?? null,
                    'twitter_image' => $seo['twitter_image'] ?? null,
                    'order' => $order++,
                    'is_custom' => $pageData['is_custom'] ?? false,
                    'is_active' => $pageData['is_active'] ?? true,
                    'template_page_id' => $templatePage?->id,
                ]);

                $layoutComponents = $pageData['layout_components'] ?? [];
                $this->syncBlocks($site, $sitePage, $layoutComponents);
            }

            $site->update(['use_normalized_pages' => true]);
        });
    }

    /**
     * @return array<string, array{name: string, is_custom: bool, is_active: bool, layout_components: array}>
     */
    private function extractPagesFromCustomPageData(array $customPageData, Site $site): array
    {
        $result = [];
        $templatePages = $site->template?->pages ?? collect();
        $pagesMeta = $customPageData['pages_meta'] ?? [];
        $pages = $customPageData['pages'] ?? [];
        $customPages = $customPageData['custom_pages'] ?? [];

        $indexLayout = $customPageData['layout_components'] ?? [];
        $indexMeta = $pagesMeta['index'] ?? [];
        $indexSeo = $indexMeta['seo'] ?? [];
        $result['index'] = [
            'name' => 'Startseite',
            'is_custom' => false,
            'is_active' => ($indexMeta['active'] ?? true) === true,
            'seo' => is_array($indexSeo) ? $indexSeo : [],
            'layout_components' => is_array($indexLayout) ? $indexLayout : [],
        ];

        $order = 1;
        foreach ($templatePages as $tp) {
            if ($tp->slug === 'index') {
                continue;
            }
            $pageData = $pages[$tp->slug] ?? [];
            $meta = $pagesMeta[$tp->slug] ?? [];
            $metaSeo = $meta['seo'] ?? [];
            $result[$tp->slug] = [
                'name' => $tp->name ?? $tp->slug,
                'is_custom' => false,
                'is_active' => ($meta['active'] ?? false) === true,
                'seo' => is_array($metaSeo) ? $metaSeo : [],
                'layout_components' => $pageData['layout_components'] ?? [],
            ];
        }

        foreach (is_array($customPages) ? $customPages : [] as $cp) {
            if (! isset($cp['slug']) || ! is_string($cp['slug']) || $cp['slug'] === '' || isset($result[$cp['slug']])) {
                continue;
            }
            $pageData = $pages[$cp['slug']] ?? [];
            $meta = $pagesMeta[$cp['slug']] ?? [];
            $metaSeo = $meta['seo'] ?? [];
            $result[$cp['slug']] = [
                'name' => $cp['name'] ?? $cp['slug'],
                'is_custom' => true,
                'is_active' => true,
                'seo' => is_array($metaSeo) ? $metaSeo : [],
                'layout_components' => $pageData['layout_components'] ?? [],
            ];
        }

        return $result;
    }

    /**
     * @param  array<int, array{id?: string, type?: string, data?: array, children?: array}>  $components
     */
    private function syncBlocks(Site $site, SitePage $sitePage, array $components, ?int $parentId = null, int $position = 0): void
    {
        foreach ($components as $idx => $comp) {
            if (! is_array($comp)) {
                continue;
            }
            $uuid = $comp['id'] ?? 'block_'.uniqid();
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
                'uuid' => $uuid,
            ]);

            if (! empty($children)) {
                $this->syncBlocks($site, $sitePage, $children, $block->id, 0);
            }
        }
    }

    /**
     * Build custom_page_data array from site_pages and site_blocks (relational structure).
     *
     * @return array<string, mixed>
     */
    public function buildFromRelational(Site $site): array
    {
        $site->loadMissing(['sitePages' => fn ($q) => $q->orderBy('order'), 'sitePages.allBlocks']);

        $result = [
            'layout_components' => [],
            'pages' => [],
            'pages_meta' => [],
            'custom_pages' => [],
        ];

        foreach ($site->sitePages as $page) {
            $allBlocks = $page->allBlocks->sortBy('position')->values();
            $layoutComponents = $this->blocksToTree($allBlocks);

            if ($page->slug === 'index') {
                $result['layout_components'] = $layoutComponents;
            } else {
                $result['pages'][$page->slug] = [
                    'layout_components' => $layoutComponents,
                ];
            }

            $seo = [];
            if ($page->meta_title) {
                $seo['meta_title'] = $page->meta_title;
            }
            if ($page->meta_description) {
                $seo['meta_description'] = $page->meta_description;
            }
            if ($page->og_title) {
                $seo['og_title'] = $page->og_title;
            }
            if ($page->og_description) {
                $seo['og_description'] = $page->og_description;
            }
            if ($page->og_image) {
                $seo['og_image'] = $page->og_image;
            }
            if ($page->robots) {
                $seo['robots'] = $page->robots;
            }
            if ($page->twitter_card) {
                $seo['twitter_card'] = $page->twitter_card;
            }
            if ($page->twitter_title) {
                $seo['twitter_title'] = $page->twitter_title;
            }
            if ($page->twitter_description) {
                $seo['twitter_description'] = $page->twitter_description;
            }
            if ($page->twitter_image) {
                $seo['twitter_image'] = $page->twitter_image;
            }
            $result['pages_meta'][$page->slug] = array_merge(
                ['active' => $page->is_active],
                $seo ? ['seo' => $seo] : [],
            );

            if ($page->is_custom) {
                $result['custom_pages'][] = [
                    'slug' => $page->slug,
                    'name' => $page->name ?? $page->slug,
                    'order' => $page->order,
                ];
            }
        }

        usort($result['custom_pages'], fn (array $a, array $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));

        return $result;
    }

    /**
     * Convert flat SiteBlock collection to nested tree structure (id, type, data, children).
     *
     * @param  \Illuminate\Support\Collection<int, SiteBlock>  $allBlocks
     * @return array<int, array{id: string, type: string, data: array, children: array}>
     */
    private function blocksToTree($allBlocks): array
    {
        $byParent = $allBlocks->groupBy(fn (SiteBlock $b) => $b->parent_id ?? 'root');
        $roots = $byParent->get('root', collect());

        return $roots->map(fn (SiteBlock $block) => $this->blockToNode($block, $byParent))->values()->all();
    }

    /**
     * @param  \Illuminate\Support\Collection<string, \Illuminate\Support\Collection<int, SiteBlock>>  $byParent
     * @return array{id: string, type: string, data: array, children: array}
     */
    private function blockToNode(SiteBlock $block, $byParent): array
    {
        $children = $byParent->get($block->id, collect());
        $childrenTree = $children->map(fn (SiteBlock $child) => $this->blockToNode($child, $byParent))->values()->all();

        return [
            'id' => $block->uuid ?? 'block_'.$block->id,
            'type' => $block->type,
            'data' => $block->data ?? [],
            'children' => $childrenTree,
        ];
    }
}
