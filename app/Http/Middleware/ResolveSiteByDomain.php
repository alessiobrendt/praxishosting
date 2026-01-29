<?php

namespace App\Http\Middleware;

use App\Models\Domain;
use App\Services\SiteRenderService;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ResolveSiteByDomain
{
    public function __construct(
        protected SiteRenderService $siteRenderService
    ) {}

    /**
     * Handle an incoming request. If the host is a registered site domain and path is /,
     * resolve the site and return the site-render response. Otherwise pass through.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET') || ! $request->is('/')) {
            return $next($request);
        }

        $host = strtolower($request->getHost());
        $mainAppHosts = config('domains.main_app_hosts', []);

        if (in_array($host, $mainAppHosts, true)) {
            return $next($request);
        }

        $domain = Domain::query()
            ->where('domain', $host)
            ->with(['site.template.pages'])
            ->first();

        if (! $domain && str_ends_with($host, '.test')) {
            $hostWithoutTest = substr($host, 0, -5);
            $domain = Domain::query()
                ->where('domain', $hostWithoutTest)
                ->with(['site.template.pages'])
                ->first();
        }

        if (! $domain) {
            abort(404);
        }

        $site = $domain->site;

        if ($site->status !== 'active') {
            abort(404);
        }

        $data = $this->siteRenderService->resolveRenderData($site);

        $inertiaResponse = Inertia::render('site-render/Home', [
            'site' => $site->only(['id', 'name', 'slug']),
            'templateSlug' => $site->template->slug,
            'pageData' => $data['pageData'],
            'colors' => $data['colors'],
            'generalInformation' => $data['generalInformation'],
        ]);

        return $inertiaResponse->toResponse($request);
    }
}
