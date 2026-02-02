<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNewsletterPostRequest;
use App\Jobs\SendNewsletterPostJob;
use App\Models\Site;
use App\Services\SiteRenderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function __construct(
        protected SiteRenderService $siteRenderService
    ) {}

    /**
     * Newsletter: Sites with newsletter module, subscribers, and news writing.
     */
    public function newsletter(Request $request): Response
    {
        $user = $request->user();
        $sites = $this->getSitesWithModule($user, 'newsletter');

        $sitesWithSubscribers = $sites->map(function (Site $site) {
            return [
                'uuid' => $site->uuid,
                'name' => $site->name,
                'slug' => $site->slug,
                'subscribers_count' => $site->newsletterSubscriptions()->whereNull('unsubscribed_at')->count(),
            ];
        });

        return Inertia::render('modules/Newsletter/Index', [
            'sites' => $sitesWithSubscribers,
        ]);
    }

    /**
     * Kontaktformular: Contact form submissions.
     */
    public function contact(Request $request): Response
    {
        $user = $request->user();
        $sites = $this->getSitesWithModule($user, 'contactform');

        $sitesWithSubmissions = $sites->map(function (Site $site) {
            $labels = $this->siteRenderService->getModuleLabelsForSite($site, 'contactform');

            return [
                'uuid' => $site->uuid,
                'name' => $site->name,
                'slug' => $site->slug,
                'submissions_count' => $site->contactSubmissions()->count(),
                'module_label' => $labels !== [] ? implode(', ', $labels) : null,
            ];
        });

        return Inertia::render('modules/Contact/Index', [
            'sites' => $sitesWithSubmissions,
        ]);
    }

    /**
     * Newsletter management for a specific site (news editor, subscribers).
     */
    public function newsletterSite(Request $request, Site $site): Response|RedirectResponse
    {
        $this->authorize('view', $site);

        if (! in_array('newsletter', $this->siteRenderService->getActiveModulesForSite($site), true)) {
            abort(404);
        }

        $posts = $site->newsletterPosts()
            ->orderByDesc('created_at')
            ->get(['id', 'subject', 'status', 'sent_at', 'created_at']);

        return Inertia::render('modules/NewsletterSite', [
            'site' => $site->only(['uuid', 'name', 'slug']),
            'subscribers_count' => $site->newsletterSubscriptions()->whereNull('unsubscribed_at')->count(),
            'posts' => $posts,
        ]);
    }

    /**
     * Store newsletter post (draft or send).
     */
    public function storePost(StoreNewsletterPostRequest $request, Site $site): RedirectResponse
    {
        if (! in_array('newsletter', $this->siteRenderService->getActiveModulesForSite($site), true)) {
            abort(404);
        }

        $validated = $request->validated();
        $post = $site->newsletterPosts()->create([
            'subject' => $validated['subject'],
            'body' => $validated['body'],
            'status' => 'draft',
        ]);

        if ($validated['action'] === 'send') {
            SendNewsletterPostJob::dispatch($post);
        }

        return redirect()
            ->route('modules.newsletter.site', ['site' => $site->uuid])
            ->with('success', $validated['action'] === 'send'
                ? 'Newsletter wird an die Abonnenten gesendet.'
                : 'Entwurf gespeichert.');
    }

    /**
     * Contact form submissions for a specific site.
     */
    public function contactSubmissions(Request $request, Site $site): Response
    {
        $this->authorize('view', $site);

        if (! in_array('contactform', $this->siteRenderService->getActiveModulesForSite($site), true)) {
            abort(404);
        }

        $submissions = $site->contactSubmissions()
            ->orderByDesc('created_at')
            ->limit(100)
            ->get(['id', 'name', 'email', 'subject', 'message', 'custom_fields', 'created_at']);

        return Inertia::render('modules/ContactSubmissions', [
            'site' => $site->only(['uuid', 'name', 'slug']),
            'submissions' => $submissions,
        ]);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Site>
     */
    protected function getSitesWithModule($user, string $moduleType): \Illuminate\Database\Eloquent\Collection
    {
        $sites = $user->sites()->with('template.pages')->get();
        $collaborating = $user->collaboratingSites()->with('template.pages')->get();
        $allSites = $sites->merge($collaborating)->unique('id');

        return $allSites->filter(function (Site $site) use ($moduleType) {
            return in_array($moduleType, $this->siteRenderService->getActiveModulesForSite($site), true);
        });
    }
}
