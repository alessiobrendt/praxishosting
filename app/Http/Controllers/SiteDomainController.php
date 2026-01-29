<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Models\Site;
use App\Services\DnsVerificationService;
use App\Services\SslCheckService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteDomainController extends Controller
{
    public function __construct(
        protected DnsVerificationService $dnsVerificationService,
        protected SslCheckService $sslCheckService
    ) {
    }

    public function index(Site $site): Response
    {
        $this->authorize('view', $site);

        $site->load('domains');

        return Inertia::render('sites/domains/Index', [
            'site' => $site,
            'baseDomain' => config('domains.base_domain', 'praxishosting.abrendt.de'),
        ]);
    }

    public function store(Request $request, Site $site): RedirectResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'domain' => ['required', 'string', 'max:255', 'regex:/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i'],
        ]);

        $domainName = strtolower(trim($validated['domain']));

        // Check if domain already exists for this site
        if ($site->domains()->where('domain', $domainName)->exists()) {
            return back()->withErrors(['domain' => __('Diese Domain ist bereits hinzugefügt.')]);
        }

        // Check if domain exists for another site
        if (Domain::where('domain', $domainName)->where('site_id', '!=', $site->id)->exists()) {
            return back()->withErrors(['domain' => __('Diese Domain wird bereits von einer anderen Site verwendet.')]);
        }

        // Wenn eine Custom-Domain hinzugefügt wird, sollte sie primär werden
        // und die Subdomain sollte nicht mehr primär sein
        $isPrimary = !$site->domains()->where('is_primary', true)->where('type', '!=', 'subdomain')->exists();

        // Setze alle anderen Domains (außer Subdomain) auf nicht-primär
        if ($isPrimary) {
            $site->domains()->where('type', '!=', 'subdomain')->update(['is_primary' => false]);
        }

        $domain = $site->domains()->create([
            'domain' => $domainName,
            'type' => 'custom',
            'is_primary' => $isPrimary,
            'is_verified' => false,
        ]);

        // Try to verify DNS immediately
        $this->dnsVerificationService->updateVerificationStatus($domain);

        // Try to check SSL status
        try {
            $this->sslCheckService->updateDomainStatus($domain);
        } catch (\Exception $e) {
            // SSL check might fail if domain is not yet pointing to us
        }

        return back()->with('success', __('Domain erfolgreich hinzugefügt.'));
    }

    public function verify(Request $request, Site $site, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($domain->site_id !== $site->id) {
            abort(404);
        }

        $this->dnsVerificationService->updateVerificationStatus($domain);
        $this->sslCheckService->updateDomainStatus($domain);

        return back()->with('success', __('Domain-Verifizierung durchgeführt.'));
    }

    public function setPrimary(Request $request, Site $site, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($domain->site_id !== $site->id) {
            abort(404);
        }

        // Unset other primary domains
        $site->domains()->where('is_primary', true)->update(['is_primary' => false]);

        // Set this as primary
        $domain->update(['is_primary' => true]);

        return back()->with('success', __('Domain als primär gesetzt.'));
    }

    public function destroy(Site $site, Domain $domain): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($domain->site_id !== $site->id) {
            abort(404);
        }

        // Subdomains können nicht gelöscht werden
        if ($domain->type === 'subdomain') {
            return back()->withErrors(['domain' => __('Subdomains können nicht entfernt werden.')]);
        }

        $domain->delete();

        return back()->with('success', __('Domain erfolgreich entfernt.'));
    }
}
