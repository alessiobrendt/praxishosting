<?php

namespace App\Services;

use App\Models\Site;

class SiteRenderService
{
    /**
     * Resolve pageData and colors for a site, optionally merged with draft data.
     *
     * @return array{pageData: array<string, mixed>, colors: array<string, string>, generalInformation: array<string, mixed>}
     */
    public function resolveRenderData(Site $site, ?array $draftPageData = null, ?array $draftColors = null): array
    {
        $pages = $site->template->pages ?? collect();
        $templatePageData = $site->template->page_data ?? [];

        if ($draftPageData !== null) {
            $pageData = $draftPageData;
        } elseif ($site->custom_page_data !== null) {
            $pageData = $site->custom_page_data;
        } elseif ($pages->isNotEmpty()) {
            $indexPage = $pages->first(fn ($p) => $p->slug === 'index') ?? $pages->sortBy('order')->first();
            $pageData = $indexPage->data ?? [];
        } else {
            $pageData = $templatePageData;
        }

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
