<?php

namespace App\Http\Middleware;

use App\Models\Domain;
use App\Models\Setting;
use App\Services\SiteRenderService;
use Closure;
use Illuminate\Http\Request;
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

        $path = trim($request->path(), '/');
        $pageSlug = null;
        if ($path === '') {
            $pageSlug = null;
        } elseif (in_array($path, ['notfallinformationen', 'patienteninformationen'], true)) {
            $pageSlug = $path;
        } else {
            return $next($request);
        }

        $host = strtolower($request->getHost());
        $mainAppHosts = Setting::getMainAppHosts();

        if (in_array($host, $mainAppHosts, true)) {
            return $next($request);
        }

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
            abort(404);
        }

        $site = $domain->site;

        if ($site->status !== 'active') {
            abort(404);
        }

        $site->unsetRelation('template');
        $site->load(['template.pages']);

        $normalizedSlug = $this->siteRenderService->normalizePageSlug($pageSlug, $site);
        if ($normalizedSlug !== 'index' && ! $this->siteRenderService->isPageActive($site->custom_page_data, $normalizedSlug)) {
            return redirect('/');
        }
        $data = $this->siteRenderService->resolveRenderData($site, null, null, $normalizedSlug);

        View::share('appearance', 'light');

        $inertiaResponse = Inertia::render('site-render/Home', [
            'site' => $site->only(['uuid', 'name', 'slug']),
            'templateSlug' => $site->template->slug,
            'pageData' => $data['pageData'],
            'colors' => $data['colors'],
            'generalInformation' => $data['generalInformation'],
            'pageSlug' => $normalizedSlug,
        ]);

        $response = $inertiaResponse->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');

        return $response;
    }
}
