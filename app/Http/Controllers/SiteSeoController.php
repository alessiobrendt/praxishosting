<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Services\SiteRenderService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SiteSeoController extends Controller
{
    public function __construct(
        protected SiteRenderService $siteRenderService
    ) {}

    public function sitemap(Request $request, Site $site): Response
    {
        if ($site->status !== 'active') {
            abort(404);
        }

        $baseUrl = $this->getSiteBaseUrl($request, $site);
        $slugs = $this->siteRenderService->getAllowedPageSlugs($site);
        $customPageData = $site->custom_page_data ?? [];
        $activeSlugs = ['index'];
        foreach ($slugs as $slug) {
            if ($slug === 'index' || $this->siteRenderService->isPageActive($customPageData, $slug)) {
                $activeSlugs[] = $slug;
            }
        }
        $activeSlugs = array_values(array_unique($activeSlugs));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($activeSlugs as $slug) {
            $loc = $slug === 'index' ? $baseUrl : rtrim($baseUrl, '/').'/'.$slug;
            $xml .= '  <url>'."\n";
            $xml .= '    <loc>'.htmlspecialchars($loc).'</loc>'."\n";
            $xml .= '    <changefreq>weekly</changefreq>'."\n";
            $xml .= '    <priority>'.($slug === 'index' ? '1.0' : '0.8').'</priority>'."\n";
            $xml .= '  </url>'."\n";
        }
        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function robotsTxt(Request $request, Site $site): Response
    {
        if ($site->status !== 'active') {
            abort(404);
        }

        $baseUrl = $this->getSiteBaseUrl($request, $site);
        $sitemapUrl = rtrim($baseUrl, '/').'/sitemap.xml';

        $txt = "User-agent: *\n";
        $txt .= "Allow: /\n";
        $txt .= 'Sitemap: '.$sitemapUrl."\n";

        return response($txt, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    private function getSiteBaseUrl(Request $request, Site $site): string
    {
        $host = $request->getHost();
        $domain = $site->domains()->where('domain', $host)->first()
            ?? $site->domains()->where('domain', $host.'.test')->first()
            ?? $site->domains()->where('is_primary', true)->first()
            ?? $site->domains()->first();

        if ($domain) {
            $scheme = $request->getScheme();

            return $scheme.'://'.$domain->domain;
        }

        return rtrim(config('app.url'), '/').'/site/'.$site->slug;
    }
}
