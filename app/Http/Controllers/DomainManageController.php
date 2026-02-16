<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDomainWhoisRequest;
use App\Models\ResellerDomain;
use App\Services\DomainPricingService;
use App\Services\SkrimeApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DomainManageController extends Controller
{
    public function show(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime, DomainPricingService $pricing): InertiaResponse|RedirectResponse
    {
        $this->authorize('view', $reseller_domain);

        $nameservers = [];
        try {
            $result = $skrime->getNameserver($reseller_domain->domain);
            $nameservers = $result['nameserver'] ?? [];
        } catch (\Throwable) {
            // ignore
        }

        $renewPrice = null;
        if ($reseller_domain->tld) {
            $renewPrice = $pricing->getPricingForTld($reseller_domain->tld, 'renew')['sale_price'] ?? null;
        }

        $domain = [
            'id' => $reseller_domain->id,
            'domain' => $reseller_domain->domain,
            'status' => $reseller_domain->status,
            'expires_at' => $reseller_domain->expires_at?->format('d.m.Y'),
            'auto_renew' => $reseller_domain->auto_renew,
            'nameservers' => $nameservers,
            'renew_price' => $renewPrice,
        ];

        $easyDnsPresets = collect(config('domain-easy-dns.presets', []))
            ->map(fn (array $preset, string $id): array => array_merge($preset, ['id' => $id]))
            ->values()
            ->all();

        return Inertia::render('domains/Show', [
            'domain' => $domain,
            'easy_dns_presets' => $easyDnsPresets,
        ]);
    }

    public function authcode(ResellerDomain $reseller_domain, SkrimeApiService $skrime): JsonResponse
    {
        $this->authorize('view', $reseller_domain);

        try {
            $code = $skrime->getAuthcode($reseller_domain->domain);

            return response()->json(['authcode' => $code]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function updateNameserver(
        \App\Http\Requests\UpdateDomainNameserverRequest $request,
        ResellerDomain $reseller_domain,
        SkrimeApiService $skrime
    ): RedirectResponse {
        try {
            $skrime->setNameserver($reseller_domain->domain, $request->validated('nameservers'));
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Nameserver konnten nicht gesetzt werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'Nameserver aktualisiert.');
    }

    public function dns(ResellerDomain $reseller_domain, SkrimeApiService $skrime): JsonResponse|RedirectResponse
    {
        $this->authorize('view', $reseller_domain);

        try {
            $records = $skrime->getDns($reseller_domain->domain);

            return response()->json(['records' => $records]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function updateDns(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $this->authorize('update', $reseller_domain);

        $request->validate([
            'records' => ['required', 'array'],
            'records.*.name' => ['required', 'string', 'max:255'],
            'records.*.type' => ['required', 'string', 'in:A,AAAA,CNAME,ALIAS,MX,SRV,TXT,CAA,PTR,TLSA,DS,DNSKEY'],
            'records.*.data' => ['required', 'string', 'max:65535'],
        ]);

        $records = array_map(fn ($r) => [
            'name' => $r['name'],
            'type' => $r['type'],
            'data' => $r['data'],
        ], $request->input('records', []));

        try {
            $skrime->setDns($reseller_domain->domain, $records);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'DNS-Zone konnte nicht gespeichert werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'DNS-Zone aktualisiert.');
    }

    public function getDnssec(ResellerDomain $reseller_domain, SkrimeApiService $skrime): JsonResponse
    {
        $this->authorize('view', $reseller_domain);

        try {
            $data = $skrime->getDnssec($reseller_domain->domain);

            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function setDnssec(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $this->authorize('update', $reseller_domain);

        $request->validate([
            'flags' => ['required', 'integer', 'in:256,257'],
            'algorithm' => ['required', 'integer', 'in:3,5,6,7,8,10,12,13,14,15,16,17,23'],
            'publicKey' => ['required', 'string', 'max:4096'],
        ]);

        try {
            $skrime->setDnssec($reseller_domain->domain, [
                'flags' => (int) $request->input('flags'),
                'algorithm' => (int) $request->input('algorithm'),
                'publicKey' => $request->input('publicKey'),
            ]);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'DNSSEC konnte nicht gesetzt werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'DNSSEC aktiviert.');
    }

    public function deleteDnssec(ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $this->authorize('update', $reseller_domain);

        try {
            $skrime->deleteDnssec($reseller_domain->domain);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'DNSSEC konnte nicht deaktiviert werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'DNSSEC deaktiviert.');
    }

    public function renew(ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $this->authorize('update', $reseller_domain);

        if (! $reseller_domain->skrime_id) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Domain hat keine Skrime-ID.');
        }

        try {
            $data = $skrime->renewProduct(domain: $reseller_domain->domain);
            $reseller_domain->update([
                'expires_at' => isset($data['expireAt']) ? \Carbon\Carbon::parse($data['expireAt']) : null,
            ]);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Verlängerung fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'Domain verlängert.');
    }

    public function setAutoRenew(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $this->authorize('update', $reseller_domain);

        $request->validate(['auto_renew' => ['required', 'boolean']]);
        $enabled = (bool) $request->input('auto_renew');

        if (! $reseller_domain->skrime_id) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Domain hat keine Skrime-ID.');
        }

        try {
            $skrime->setAutoRenew($enabled, domain: $reseller_domain->domain);
            $reseller_domain->update(['auto_renew' => $enabled]);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Auto-Verlängerung konnte nicht gesetzt werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', $enabled ? 'Auto-Verlängerung aktiviert.' : 'Auto-Verlängerung deaktiviert.');
    }

    public function getContact(ResellerDomain $reseller_domain, SkrimeApiService $skrime): JsonResponse
    {
        $this->authorize('view', $reseller_domain);

        try {
            $data = $skrime->getContact($reseller_domain->domain);

            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function updateContact(
        \App\Http\Requests\UpdateDomainContactRequest $request,
        ResellerDomain $reseller_domain,
        SkrimeApiService $skrime
    ): RedirectResponse {
        $contact = $request->validated('contact');
        $normalized = [
            'firstname' => trim((string) ($contact['firstname'] ?? '')),
            'lastname' => trim((string) ($contact['lastname'] ?? '')),
            'street' => trim((string) ($contact['street'] ?? '')),
            'number' => trim((string) ($contact['number'] ?? '')),
            'postcode' => trim((string) ($contact['postcode'] ?? '')),
            'city' => trim((string) ($contact['city'] ?? '')),
            'state' => trim((string) ($contact['state'] ?? '')),
            'country' => trim((string) ($contact['country'] ?? '')),
            'email' => trim((string) ($contact['email'] ?? '')),
            'phone' => trim((string) ($contact['phone'] ?? '')),
        ];
        if (! empty(trim((string) ($contact['company'] ?? '')))) {
            $normalized['company'] = trim((string) $contact['company']);
        }

        try {
            $skrime->setContact($reseller_domain->domain, $normalized);
        } catch (\Throwable $e) {
            return redirect()->route('domains.manage.show', $reseller_domain)
                ->with('error', 'Kontaktdaten konnten nicht gespeichert werden: '.$e->getMessage());
        }

        return redirect()->route('domains.manage.show', $reseller_domain)
            ->with('success', 'Kontaktdaten aktualisiert.');
    }

    public function updateWhoisPrivacy(
        UpdateDomainWhoisRequest $request,
        ResellerDomain $reseller_domain,
        SkrimeApiService $skrime
    ): JsonResponse {
        $privacy = $request->validated('privacy');

        try {
            $data = $skrime->updateWhoisPrivacy($reseller_domain->domain, $privacy);

            return response()->json([
                'response' => 'Successfully updated whois settings',
                'state' => 'success',
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Get raw whois lookup result for the domain (public whois record).
     */
    public function getWhoisLookup(ResellerDomain $reseller_domain): JsonResponse
    {
        $this->authorize('view', $reseller_domain);

        $domain = $reseller_domain->domain;
        if (! preg_match('/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i', $domain)) {
            return response()->json(['error' => 'Ungültiger Domainname'], 422);
        }

        $output = [];
        $returnCode = -1;
        @exec('whois '.escapeshellarg($domain).' 2>&1', $output, $returnCode);
        $text = implode("\n", $output);

        if ($text === '' && $returnCode !== 0) {
            return response()->json([
                'error' => 'Whois-Abfrage auf diesem Server nicht verfügbar (whois-Befehl fehlt oder fehlgeschlagen).',
                'whois' => '',
            ]);
        }

        return response()->json(['whois' => $text]);
    }
}
