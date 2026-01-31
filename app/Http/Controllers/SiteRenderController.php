<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Services\SiteRenderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class SiteRenderController extends Controller
{
    private const PREVIEW_DRAFT_KEY = 'site_preview_draft';

    public function __construct(
        protected SiteRenderService $siteRenderService
    ) {}

    /**
     * @param  string|null  $pageSlug  Optional segment for subpages (e.g. notfallinformationen).
     */
    public function show(Request $request, Site $site, ?string $pageSlug = null): Response|RedirectResponse
    {
        if ($site->status !== 'active') {
            abort(404);
        }

        $site->unsetRelation('template');
        $site->load(['template.pages']);
        $normalizedSlug = $this->siteRenderService->normalizePageSlug($pageSlug, $site);
        if ($normalizedSlug !== 'index' && ! $this->siteRenderService->isPageActive($site->custom_page_data, $normalizedSlug)) {
            return redirect()->route('site-render.show', ['site' => $site->slug]);
        }
        $data = $this->siteRenderService->resolveRenderData($site, null, null, $normalizedSlug);

        return Inertia::render('site-render/Home', [
            'site' => $site->only(['id', 'name', 'slug']),
            'templateSlug' => $site->template->slug,
            'pageData' => $data['pageData'],
            'colors' => $data['colors'],
            'generalInformation' => $data['generalInformation'],
            'pageSlug' => $normalizedSlug,
        ]);
    }

    /**
     * Preview a site with optional draft data (for iframe in Edit page).
     * GET: render with draft from session if present, else saved data.
     * Page slug: from path segment (e.g. /sites/1/preview/testas) or query ?page=testas.
     * When design_mode=1, designMode is passed so the layout can make sections clickable (postMessage).
     */
    public function preview(Request $request, Site $site, ?string $pageSlug = null): Response
    {
        $this->authorize('update', $site);

        $site->load(['template.pages']);

        $key = self::PREVIEW_DRAFT_KEY.'.'.$site->id;
        $draft = session($key);
        $draftPageData = isset($draft['custom_page_data']) ? $draft['custom_page_data'] : null;
        $draftColors = isset($draft['custom_colors']) ? $draft['custom_colors'] : null;

        $pageSlug = $pageSlug ?? $request->query('page');
        $requestedSlug = is_string($pageSlug) ? $pageSlug : null;
        $data = $this->siteRenderService->resolveRenderData($site, $draftPageData, $draftColors, $requestedSlug, true);
        $normalizedSlug = $requestedSlug ?? 'index';

        $designMode = $request->boolean('design_mode');

        return Inertia::render('site-render/Home', [
            'site' => $site->only(['id', 'name', 'slug']),
            'templateSlug' => $site->template->slug,
            'pageData' => $data['pageData'],
            'colors' => $data['colors'],
            'generalInformation' => $data['generalInformation'],
            'designMode' => $designMode,
            'pageSlug' => $normalizedSlug,
        ]);
    }

    /**
     * Store draft data in session for preview. Called by Edit page before refreshing iframe.
     */
    public function storePreviewDraft(Request $request, Site $site): HttpResponse|RedirectResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'custom_page_data' => ['nullable', 'array'],
            'custom_colors' => ['nullable', 'array'],
        ]);

        session([self::PREVIEW_DRAFT_KEY.'.'.$site->id => $validated]);

        return $request->expectsJson()
            ? response()->json(['ok' => true])
            : redirect()->route('sites.preview', $site);
    }
}
