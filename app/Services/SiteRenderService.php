<?php

namespace App\Services;

use App\Models\Site;
use App\Models\User;

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
        $useTemplateOnly = $draftPageData === null
            && ($site->custom_page_data === null || $site->custom_page_data === []);
        $contentFromTemplateOnly = $useTemplateOnly;
        $pageData = $this->resolvePageDataForSlug($source, $templatePageData, $templatePages, $pageSlug, $contentFromTemplateOnly);

        $templateSlug = $site->template->slug ?? null;
        $templateDefaultColors = config("template-colors.{$templateSlug}", config('template-colors.default', []));

        $colors = $templateDefaultColors;

        $fromSource = $draftColors ?? $site->custom_colors;
        if (! empty($fromSource) && is_array($fromSource)) {
            $colors = array_merge($colors, $fromSource);
        }

        $fromPage = isset($pageData['colors']) && is_array($pageData['colors']) ? $pageData['colors'] : [];
        if (! empty($fromPage)) {
            $colors = array_merge($colors, $fromPage);
        }

        if (empty($pageData['layout_components']) || ! is_array($pageData['layout_components'])) {
            $pageData['layout_components'] = $this->buildLayoutComponentsFromLegacy($pageData);
        }

        $pagesMeta = $source['pages_meta'] ?? [];
        $pageMeta = is_array($pagesMeta[$pageSlug] ?? null) ? $pagesMeta[$pageSlug] : [];
        $pageData['seo'] = $pageMeta['seo'] ?? [];

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
        $generalInformation['active_modules'] = $this->resolveActiveModules($source ?? [], $templatePages);

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
     * New template pages (no pages_meta entry) are inactive until explicitly activated.
     *
     * @param  array<string, mixed>|null  $customPageData
     */
    public function isPageActive(?array $customPageData, string $pageSlug): bool
    {
        if ($pageSlug === 'index') {
            return true;
        }

        if ($customPageData === null) {
            return false;
        }

        $customPages = $customPageData['custom_pages'] ?? [];
        if (is_array($customPages)) {
            foreach ($customPages as $cp) {
                if (isset($cp['slug']) && $cp['slug'] === $pageSlug) {
                    return true;
                }
            }
        }

        $meta = $customPageData['pages_meta'][$pageSlug] ?? null;
        if (! is_array($meta)) {
            return false;
        }

        return ($meta['active'] ?? false) === true;
    }

    /**
     * Resolve raw page data array for a given slug. When contentFromTemplateOnly is true (public view),
     * use template only; when false (preview with draft), merge template with source.
     *
     * @param  array<string, mixed>|null  $source  Site custom_page_data or draft; used for content only when contentFromTemplateOnly is false.
     * @param  array<string, mixed>  $templatePageData
     * @param  \Illuminate\Support\Collection<int, \App\Models\TemplatePage>  $templatePages
     * @return array<string, mixed>
     */
    protected function resolvePageDataForSlug(?array $source, array $templatePageData, $templatePages, string $pageSlug, bool $contentFromTemplateOnly = true): array
    {
        if ($pageSlug === 'index') {
            return $this->resolveIndexPageData($source, $templatePageData, $templatePages, $contentFromTemplateOnly);
        }

        $templatePage = $templatePages->firstWhere('slug', $pageSlug);
        $templateDefaults = $templatePage && is_array($templatePage->data) ? $templatePage->data : [];
        $custom = $source !== null && isset($source['pages'][$pageSlug]) && is_array($source['pages'][$pageSlug]) ? $source['pages'][$pageSlug] : null;

        if ($contentFromTemplateOnly) {
            $merged = $templatePage ? $templateDefaults : ($custom ?? []);
            $layout = $merged['layout_components'] ?? null;

            return [
                'layout_components' => is_array($layout) && $layout !== [] ? $layout : [],
            ];
        }

        $merged = array_merge($templateDefaults, $custom ?? []);
        $layout = $merged['layout_components'] ?? null;

        return [
            'layout_components' => is_array($layout) && $layout !== [] ? $layout : [],
        ];
    }

    /**
     * Resolve index page. When contentFromTemplateOnly is true (public view), use template only;
     * when false (preview with draft), merge template with source.
     *
     * @param  array<string, mixed>|null  $source  Site custom_page_data or draft; used for content only when contentFromTemplateOnly is false.
     * @param  array<string, mixed>  $templatePageData
     * @param  \Illuminate\Support\Collection<int, \App\Models\TemplatePage>  $templatePages
     * @return array<string, mixed>
     */
    protected function resolveIndexPageData(?array $source, array $templatePageData, $templatePages, bool $contentFromTemplateOnly = true): array
    {
        $indexPage = $templatePages->first(fn ($p) => $p->slug === 'index') ?? $templatePages->sortBy('order')->first();
        $fromTemplate = $indexPage && is_array($indexPage->data) ? $indexPage->data : [];
        $base = array_merge($templatePageData, $fromTemplate);

        if ($contentFromTemplateOnly) {
            return $base;
        }

        if ($source === null || $source === []) {
            return $base;
        }

        $hasPages = isset($source['pages']) && is_array($source['pages']);
        $fromPagesIndex = $hasPages
            && isset($source['pages']['index'])
            && is_array($source['pages']['index'])
            ? $source['pages']['index']
            : null;

        $layoutFromRoot = isset($source['layout_components']) && is_array($source['layout_components'])
            ? $source['layout_components']
            : [];
        $layoutFromPagesIndex = $fromPagesIndex !== null
            && isset($fromPagesIndex['layout_components'])
            && is_array($fromPagesIndex['layout_components'])
            ? $fromPagesIndex['layout_components']
            : [];
        $layoutFromBase = isset($base['layout_components']) && is_array($base['layout_components'])
            ? $base['layout_components']
            : [];

        $layout = $layoutFromRoot !== []
            ? $layoutFromRoot
            : ($layoutFromPagesIndex !== [] ? $layoutFromPagesIndex : $layoutFromBase);

        return array_merge($base, $source, [
            'layout_components' => $layout,
        ]);
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

    /**
     * Resolve active module types (e.g. newsletter) from layout_components across all pages.
     * Modules that show in navbar (e.g. newsletter) are detected by their block type.
     *
     * @param  array<string, mixed>  $customPageData
     * @param  \Illuminate\Support\Collection<int, \App\Models\TemplatePage>  $templatePages
     * @return list<string>
     */
    protected function resolveActiveModules(array $customPageData, $templatePages): array
    {
        $types = [];
        $sources = [];

        $root = $customPageData;
        if (isset($root['layout_components']) && is_array($root['layout_components'])) {
            $sources[] = $root['layout_components'];
        }
        if (isset($root['pages']) && is_array($root['pages'])) {
            foreach ($root['pages'] as $page) {
                if (is_array($page) && isset($page['layout_components']) && is_array($page['layout_components'])) {
                    $sources[] = $page['layout_components'];
                }
            }
        }
        foreach ($templatePages as $tp) {
            if (is_array($tp->data ?? null) && isset($tp->data['layout_components']) && is_array($tp->data['layout_components'])) {
                $sources[] = $tp->data['layout_components'];
            }
        }

        $moduleTypes = ['newsletter', 'contactform'];
        foreach ($sources as $components) {
            foreach ($this->collectBlockTypes($components) as $type) {
                if (in_array($type, $moduleTypes, true) && ! in_array($type, $types, true)) {
                    $types[] = $type;
                }
            }
        }

        return $types;
    }

    /**
     * Recursively collect block types from layout_components.
     *
     * @param  array<int, array{type?: string, children?: array}>  $components
     * @return array<string>
     */
    protected function collectBlockTypes(array $components): array
    {
        $types = [];
        foreach ($components as $c) {
            if (is_array($c) && isset($c['type']) && is_string($c['type'])) {
                $types[] = $c['type'];
                if (isset($c['children']) && is_array($c['children'])) {
                    $types = array_merge($types, $this->collectBlockTypes($c['children']));
                }
            }
        }

        return $types;
    }

    /**
     * Recursively collect moduleLabels for blocks of a given type.
     *
     * @param  array<int, array{type?: string, data?: array{moduleLabel?: string}, children?: array}>  $components
     * @return list<string>
     */
    public function collectModuleLabels(array $components, string $moduleType): array
    {
        $labels = [];
        foreach ($components as $c) {
            if (! is_array($c)) {
                continue;
            }
            if (isset($c['type']) && $c['type'] === $moduleType) {
                $label = $c['data']['moduleLabel'] ?? '';
                if (is_string($label) && trim($label) !== '') {
                    $labels[] = trim($label);
                }
            }
            if (isset($c['children']) && is_array($c['children'])) {
                $labels = array_merge($labels, $this->collectModuleLabels($c['children'], $moduleType));
            }
        }

        return array_values(array_unique($labels));
    }

    /**
     * Get module labels for a site (e.g. "Haupt-Newsletter", "Kontakt Impressum").
     *
     * @return list<string>
     */
    public function getModuleLabelsForSite(Site $site, string $moduleType): array
    {
        $site->loadMissing('template.pages');
        $custom = $site->custom_page_data ?? [];
        $labels = [];

        $root = $custom;
        if (isset($root['layout_components']) && is_array($root['layout_components'])) {
            $labels = array_merge($labels, $this->collectModuleLabels($root['layout_components'], $moduleType));
        }
        if (isset($root['pages']) && is_array($root['pages'])) {
            foreach ($root['pages'] as $page) {
                if (is_array($page) && isset($page['layout_components']) && is_array($page['layout_components'])) {
                    $labels = array_merge($labels, $this->collectModuleLabels($page['layout_components'], $moduleType));
                }
            }
        }
        foreach ($site->template?->pages ?? [] as $tp) {
            if (is_array($tp->data ?? null) && isset($tp->data['layout_components']) && is_array($tp->data['layout_components'])) {
                $labels = array_merge($labels, $this->collectModuleLabels($tp->data['layout_components'], $moduleType));
            }
        }

        return array_values(array_unique($labels));
    }

    /**
     * Get active module types (newsletter, contactform) across all sites the user can access.
     *
     * @return list<string>
     */
    public function getActiveModulesForUser(User $user): array
    {
        $sites = $user->sites()->with('template.pages')->get();
        $collaborating = $user->collaboratingSites()->with('template.pages')->get();
        $allSites = $sites->merge($collaborating)->unique('id');

        $active = [];
        foreach ($allSites as $site) {
            $custom = $site->custom_page_data ?? [];
            $templatePages = $site->template?->pages ?? collect();
            foreach ($this->resolveActiveModules($custom, $templatePages) as $type) {
                if (! in_array($type, $active, true)) {
                    $active[] = $type;
                }
            }
        }

        return $active;
    }

    /**
     * Get active module types for a single site.
     *
     * @return list<string>
     */
    public function getActiveModulesForSite(Site $site): array
    {
        $site->loadMissing('template.pages');
        $custom = $site->custom_page_data ?? [];
        $templatePages = $site->template?->pages ?? collect();

        return $this->resolveActiveModules($custom, $templatePages);
    }
}
