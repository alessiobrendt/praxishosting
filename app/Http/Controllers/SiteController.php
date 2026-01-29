<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function index(Request $request): Response
    {
        $sites = $request->user()
            ->sites()
            ->with('template')
            ->latest()
            ->get();

        $collaboratingSites = $request->user()
            ->collaboratingSites()
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:templates,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $template = Template::findOrFail($validated['template_id']);
        $slug = Str::slug($validated['name']).'-'.Str::random(6);
        $baseDomain = config('domains.base_domain', 'praxishosting.abrendt.de');
        $subdomain = $slug.'.'.$baseDomain;

        $site = $request->user()->sites()->create([
            'template_id' => $template->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'domain_type' => 'subdomain',
            'status' => 'active',
        ]);

        // Automatisch Subdomain als Domain-Eintrag erstellen
        $site->domains()->create([
            'domain' => $subdomain,
            'type' => 'subdomain',
            'is_primary' => true, // Subdomain ist standardmäßig primär, bis eine Custom-Domain hinzugefügt wird
            'is_verified' => true, // Subdomains sind automatisch verifiziert
        ]);

        return to_route('sites.show', $site);
    }

    public function show(Site $site): Response
    {
        $this->authorize('view', $site);

        $site->load([
            'template',
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

        return Inertia::render('sites/Show', [
            'site' => $site,
            'baseDomain' => config('domains.base_domain', 'praxishosting.abrendt.de'),
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

    public function update(Request $request, Site $site): RedirectResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'custom_colors' => ['nullable', 'array'],
            'custom_page_data' => ['nullable', 'array'],
        ]);

        $site->update(array_filter($validated));

        return to_route('sites.show', $site);
    }

    public function destroy(Site $site): RedirectResponse
    {
        $this->authorize('delete', $site);

        $site->delete();

        return to_route('sites.index');
    }

    public function uploadImage(Request $request, Site $site): \Illuminate\Http\JsonResponse
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
