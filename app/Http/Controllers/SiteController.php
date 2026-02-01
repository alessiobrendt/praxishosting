<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\Template;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $sites = $user->sites()
            ->with('template', 'siteSubscription')
            ->latest()
            ->get();

        $collaboratingSites = $user->collaboratingSites()
            ->with('template', 'user')
            ->latest()
            ->get();

        return Inertia::render('sites/Index', [
            'sites' => $sites,
            'collaboratingSites' => $collaboratingSites,
        ]);
    }

    public function create(Request $request): Response
    {
        $templateId = $request->query('template');
        $template = $templateId ? Template::find($templateId) : null;

        return Inertia::render('sites/Create', [
            'template' => $template,
            'templates' => Template::where('is_active', true)->get(['id', 'name', 'slug', 'price']),
        ]);
    }

    /**
     * Validate and redirect to Stripe Checkout (site is created after payment in CheckoutController::success).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:templates,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        if (! $request->user()->hasCompleteBillingProfile()) {
            return redirect()
                ->route('profile.edit')
                ->with('error', 'Bitte vervollständigen Sie Ihre Rechnungsadresse unter Einstellungen, um fortzufahren.');
        }

        $request->session()->put('checkout_meine_seiten', [
            'template_id' => $validated['template_id'],
            'name' => $validated['name'],
        ]);

        return redirect()->route('checkout.redirect');
    }

    public function show(Request $request, Site $site): Response
    {
        $this->authorize('view', $site);

        $site->load([
            'template',
            'siteSubscription',
            'collaborators',
            'user',
            'invitations' => function ($query) {
                $query->whereNull('accepted_at')->where('expires_at', '>', now());
            },
            'domains',
            'versions' => function ($query) {
                $query->latest('version_number')->limit(5);
            },
            'publishedVersion',
            'draftVersion',
        ]);

        $siteArray = $site->toArray();
        if (! empty($siteArray['site_subscription']['current_period_ends_at'] ?? null)) {
            $siteArray['site_subscription']['current_period_ends_at'] = Carbon::parse($siteArray['site_subscription']['current_period_ends_at'])->format('d.m.Y');
        }

        $user = $request->user();
        $paymentMethodSummary = null;
        if ($user->hasDefaultPaymentMethod()) {
            $paymentMethodSummary = [
                'brand' => $user->pm_type,
                'last4' => $user->pm_last_four,
            ];
        }

        return Inertia::render('sites/Show', [
            'site' => $siteArray,
            'baseDomain' => \App\Models\Setting::getBaseDomain(),
            'billingPortalUrl' => route('billing.portal'),
            'paymentMethodSummary' => $paymentMethodSummary,
        ]);
    }

    public function edit(Site $site): Response
    {
        $this->authorize('update', $site);

        $site->load('template');

        return Inertia::render('sites/Edit', [
            'site' => $site,
        ]);
    }

    /**
     * Show the Page Designer (Premium). Only when site has_page_designer and template supports component registry.
     */
    public function design(Site $site): Response
    {
        $this->authorize('update', $site);

        if (! $site->has_page_designer) {
            abort(403, 'Page Designer is not enabled for this site.');
        }

        $site->unsetRelation('template');
        $site->load(['template.pages']);

        return Inertia::render('PageDesigner/PageDesigner', [
            'mode' => 'site',
            'site' => $site,
            'baseDomain' => \App\Models\Setting::getBaseDomain(),
        ]);
    }

    public function update(Request $request, Site $site): RedirectResponse
    {
        $this->authorize('update', $site);

        // Page Designer sends custom_page_data/custom_colors as JSON strings via FormData
        $merge = [];
        if (is_string($request->custom_page_data)) {
            $decoded = json_decode($request->custom_page_data, true);
            $merge['custom_page_data'] = is_array($decoded) ? $decoded : null;
        }
        if (is_string($request->custom_colors)) {
            $decoded = json_decode($request->custom_colors, true);
            $merge['custom_colors'] = is_array($decoded) ? $decoded : null;
        }
        if ($merge !== []) {
            $request->merge($merge);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'custom_colors' => ['nullable', 'array'],
            'custom_page_data' => ['nullable', 'array'],
        ]);

        if (isset($validated['custom_page_data']['pages_meta'])) {
            $validated['custom_page_data']['pages_meta']['index'] = array_merge(
                $validated['custom_page_data']['pages_meta']['index'] ?? [],
                ['active' => true],
            );
        }

        $site->update(array_filter($validated));

        return to_route('sites.show', $site);
    }

    public function destroy(Site $site): RedirectResponse
    {
        $this->authorize('delete', $site);

        $site->delete();

        return to_route('sites.index');
    }

    public function indexImages(Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $directory = "sites/{$site->id}/images";
        if (! Storage::disk('public')->exists($directory)) {
            return response()->json(['urls' => []]);
        }

        $files = Storage::disk('public')->files($directory);
        $urls = array_map(
            fn (string $path) => asset('storage/'.$path),
            $files
        );

        return response()->json(['urls' => array_values($urls)]);
    }

    public function uploadImage(Request $request, Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $path = $request->file('image')->store(
            "sites/{$site->id}/images",
            'public'
        );

        return response()->json([
            'url' => asset('storage/'.$path),
        ]);
    }
}
