<?php

namespace App\Services;

use App\Models\Site;

class SiteRenderService
{
    /**
     * Allowed page slugs for multi-page support. Subpages only when template supports them.
     *
     * @var list<string>
     */
    public const ALLOWED_PAGE_SLUGS = ['index', 'notfallinformationen', 'patienteninformationen'];

    /**
     * Resolve pageData and colors for a site, optionally merged with draft data.
     * When $pageSlug is set, resolves that page from custom_page_data.pages[$pageSlug] (or root for index).
     * When $allowUnknownSlug is true (e.g. preview), the requested slug is used as-is so subpages render correctly.
     *
     * @return array{pageData: array<string, mixed>, colors: array<string, string>, generalInformation: array<string, mixed>}
     */
    public function resolveRenderData(Site $site, ?array $draftPageData = null, ?array $draftColors = null, ?string $pageSlug = null, bool $allowUnknownSlug = false): array
    {
        $pageSlug = $this->normalizePageSlug($pageSlug, $site, $draftPageData ?? $site->custom_page_data, $allowUnknownSlug);
        $templatePages = $site->template->pages ?? collect();
        $templatePageData = $site->template->page_data ?? [];

        $source = $draftPageData ?? $site->custom_page_data;
        $pageData = $this->resolvePageDataForSlug($source, $templatePageData, $templatePages, $pageSlug);

        $colors = $draftColors ?? $site->custom_colors ?? ($templatePageData['colors'] ?? []);
        if (isset($pageData['colors']) && is_array($pageData['colors'])) {
            $colors = array_merge($colors, $pageData['colors']);
        }

        if (empty($pageData['layout_components']) || ! is_array($pageData['layout_components'])) {
            $pageData['layout_components'] = $this->buildLayoutComponentsFromLegacy($pageData);
        }

        $generalInformation = $templatePageData['site'] ?? [];
        if (isset($templatePageData['branding'])) {
            $generalInformation['branding'] = $templatePageData['branding'];
        }
        if (isset($templatePageData['navigation'])) {
            $generalInformation['navigation'] = $templatePageData['navigation'];
        }
        if (isset($templatePageData['footer'])) {
            $generalInformation['footer'] = $templatePageData['footer'];
        }

        return [
            'pageData' => $pageData,
            'colors' => $colors,
            'generalInformation' => $generalInformation,
        ];
    }

    /**
     * Allowed page slugs for this site: template page slugs + custom_pages slugs.
     *
     * @param  array<string, mixed>|null  $customPageData
     * @return list<string>
     */
    public function getAllowedPageSlugs(Site $site, ?array $customPageData = null): array
    {
        $customPageData = $customPageData ?? $site->custom_page_data;
        $slugs = ['index'];
        $templatePages = $site->template?->pages ?? collect();
        foreach ($templatePages as $p) {
            $slugs[] = $p->slug;
        }
        $customPages = $customPageData['custom_pages'] ?? [];
        if (is_array($customPages)) {
            foreach ($customPages as $cp) {
                if (isset($cp['slug']) && is_string($cp['slug']) && $cp['slug'] !== '') {
                    $slugs[] = $cp['slug'];
                }
            }
        }

        return array_values(array_unique($slugs));
    }

    /**
     * Normalize page slug: null/empty => 'index'; invalid or unknown => 'index'.
     * When $allowUnknown is true (e.g. preview), pass through any non-empty slug so that page is rendered.
     *
     * @param  array<string, mixed>|null  $customPageData
     */
    public function normalizePageSlug(?string $pageSlug, ?Site $site = null, ?array $customPageData = null, bool $allowUnknown = false): string
    {
        if ($pageSlug === null || $pageSlug === '') {
            return 'index';
        }

        if ($allowUnknown) {
            return $pageSlug;
        }

        if ($site !== null) {
            $allowed = $this->getAllowedPageSlugs($site, $customPageData);

            return in_array($pageSlug, $allowed, true) ? $pageSlug : 'index';
        }

        return in_array($pageSlug, self::ALLOWED_PAGE_SLUGS, true) ? $pageSlug : 'index';
    }

    /**
     * Whether a page is active for display/nav. Index is always active.
     *
     * @param  array<string, mixed>|null  $customPageData
     */
    public function isPageActive(?array $customPageData, string $pageSlug): bool
    {
        if ($pageSlug === 'index') {
            return true;
        }

        if ($customPageData === null) {
            return true;
        }

        $meta = $customPageData['pages_meta'][$pageSlug] ?? null;
        if (! is_array($meta)) {
            return true;
        }

        return ($meta['active'] ?? true) === true;
    }

    /**
     * Resolve raw page data array for a given slug from source (draft or custom_page_data) and template.
     *
     * @param  array<string, mixed>|null  $source
     * @param  array<string, mixed>  $templatePageData
     * @param  \Illuminate\Support\Collection<int, \App\Models\TemplatePage>  $templatePages
     * @return array<string, mixed>
     */
    protected function resolvePageDataForSlug(?array $source, array $templatePageData, $templatePages, string $pageSlug): array
    {
        if ($pageSlug === 'index') {
            return $this->resolveIndexPageData($source, $templatePageData, $templatePages);
        }

        $templatePage = $templatePages->firstWhere('slug', $pageSlug);
        $templateDefaults = $templatePage && is_array($templatePage->data) ? $templatePage->data : [];
        $custom = null;
        if ($source !== null && isset($source['pages'][$pageSlug]) && is_array($source['pages'][$pageSlug])) {
            $custom = $source['pages'][$pageSlug];
        }
        $merged = array_merge($templateDefaults, $custom ?? []);
        $layout = $merged['layout_components'] ?? null;

        return [
            'layout_components' => is_array($layout) && $layout !== [] ? $layout : [],
        ];
    }

    /**
     * Resolve index page: root has precedence over pages.index for backward compatibility.
     *
     * @param  array<string, mixed>|null  $source
     * @param  array<string, mixed>  $templatePageData
     * @param  \Illuminate\Support\Collection<int, \App\Models\TemplatePage>  $templatePages
     * @return array<string, mixed>
     */
    protected function resolveIndexPageData(?array $source, array $templatePageData, $templatePages): array
    {
        if ($source === null) {
            $indexPage = $templatePages->first(fn ($p) => $p->slug === 'index') ?? $templatePages->sortBy('order')->first();

            return $indexPage && is_array($indexPage->data) ? $indexPage->data : $templatePageData;
        }

        $hasPages = isset($source['pages']) && is_array($source['pages']);
        $fromRoot = $source;
        $fromPagesIndex = $hasPages && isset($source['pages']['index']) && is_array($source['pages']['index'])
            ? $source['pages']['index']
            : null;

        if ($fromPagesIndex !== null && (! isset($fromRoot['layout_components']) || ! is_array($fromRoot['layout_components']) || $fromRoot['layout_components'] === [])) {
            $pageData = array_merge($source, ['layout_components' => $fromPagesIndex['layout_components'] ?? []]);
        } else {
            $pageData = $fromRoot;
        }

        return $pageData;
    }

    /**
     * Build layout_components array from legacy page_data (header, hero, about, hours, cta, footer).
     * Single flat list; used when layout_components is missing or empty.
     *
     * @param  array<string, mixed>  $pageData
     * @return array<int, array{id: string, type: string, data: array}>
     */
    public function buildLayoutComponentsFromLegacy(array $pageData): array
    {
        $components = [];

        $components[] = [
            'id' => 'header_legacy',
            'type' => 'header',
            'data' => isset($pageData['header']) && is_array($pageData['header']) ? $pageData['header'] : [],
        ];
        $components[] = [
            'id' => 'hero_legacy',
            'type' => 'hero',
            'data' => isset($pageData['hero']) && is_array($pageData['hero']) ? $pageData['hero'] : [],
        ];
        $components[] = [
            'id' => 'about_legacy',
            'type' => 'about',
            'data' => isset($pageData['about']) && is_array($pageData['about']) ? $pageData['about'] : [],
        ];
        $components[] = [
            'id' => 'hours_legacy',
            'type' => 'hours',
            'data' => isset($pageData['hours']) && is_array($pageData['hours']) ? $pageData['hours'] : [],
        ];
        $components[] = [
            'id' => 'cta_legacy',
            'type' => 'cta',
            'data' => isset($pageData['cta']) && is_array($pageData['cta']) ? $pageData['cta'] : [],
        ];
        $components[] = [
            'id' => 'footer_legacy',
            'type' => 'footer',
            'data' => isset($pageData['footer']) && is_array($pageData['footer']) ? $pageData['footer'] : [],
        ];

        return $components;
    }
}
