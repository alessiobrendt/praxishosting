<?php

namespace App\Http\Middleware;

use App\Http\Controllers\SiteSeoController;
use App\Models\Domain;
use App\Models\Setting;
use App\Services\SiteRenderService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ResolveSiteByDomain
{
    public function __construct(
        protected SiteRenderService $siteRenderService
    ) {}

    /**
     * Handle an incoming request. If the host is a registered site domain and path is /
     * or an allowed subpage, resolve the site and return the site-render response.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET')) {
            return $next($request);
        }

        if ($request->is('api/verify-domain')) {
            return $next($request);
        }

        $host = strtolower($request->getHost());

        Log::debug('ResolveSiteByDomain request', ['host' => $host, 'path' => $request->path()]);

        $domain = Domain::query()
            ->where('domain', $host)
            ->with(['site'])
            ->first();

        if (! $domain && str_ends_with($host, '.test')) {
            $hostWithoutTest = substr($host, 0, -5);
            $domain = Domain::query()
                ->where('domain', $hostWithoutTest)
                ->with(['site'])
                ->first();
        }

        if (! $domain) {
            $mainAppHosts = Setting::getMainAppHosts();
            Log::debug('ResolveSiteByDomain no domain', ['host' => $host, 'mainAppHosts' => $mainAppHosts]);
            if (in_array($host, $mainAppHosts, true)) {
                return $next($request);
            }

            abort(404);
        }

        $site = $domain->site;

        if ($site->status !== 'active') {
            abort(404);
        }

        $site->unsetRelation('template');
        $site->load(['template.pages']);

        $path = trim($request->path(), '/');
        if ($path === 'sitemap.xml') {
            return app(SiteSeoController::class)->sitemap($request, $site);
        }
        if ($path === 'robots.txt') {
            return app(SiteSeoController::class)->robotsTxt($request, $site);
        }
        $pageSlug = $path === '' ? null : $path;

        $normalizedSlug = $this->siteRenderService->normalizePageSlug($pageSlug, $site);
        $isActive = $this->siteRenderService->isPageActive($site->custom_page_data, $normalizedSlug);

        Log::debug('ResolveSiteByDomain', [
            'host' => $host,
            'path' => $path,
            'pageSlug' => $pageSlug,
            'normalizedSlug' => $normalizedSlug,
            'isActive' => $isActive,
        ]);

        if ($pageSlug !== null && $normalizedSlug === 'index') {
            abort(404);
        }
        if ($normalizedSlug !== 'index' && ! $isActive) {
            abort(404);
        }
        $data = $this->siteRenderService->resolveRenderData($site, null, null, $normalizedSlug);

        View::share('appearance', 'light');

        $assetBaseUrl = rtrim(config('app.url'), '/');
        if (str_starts_with($assetBaseUrl, 'http://')) {
            $assetBaseUrl = 'https://'.substr($assetBaseUrl, 7);
        }
        URL::forceRootUrl($assetBaseUrl);
        URL::forceScheme('https');
        config(['app.asset_url' => $assetBaseUrl]);

        $canonicalUrl = $request->url();

        $inertiaResponse = Inertia::render('site-render/Home', [
            'site' => array_merge($site->only(['uuid', 'name', 'slug']), ['favicon_url' => $site->favicon_url]),
            'templateSlug' => $site->template->slug,
            'pageData' => $data['pageData'],
            'colors' => $data['colors'],
            'generalInformation' => $data['generalInformation'],
            'pageSlug' => $normalizedSlug,
            'canonicalUrl' => $canonicalUrl,
        ]);

        $response = $inertiaResponse->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');

        return $response;
    }
}
