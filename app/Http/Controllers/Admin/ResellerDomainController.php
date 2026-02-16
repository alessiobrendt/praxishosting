<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignResellerDomainCustomerRequest;
use App\Http\Requests\Admin\UpdateResellerDomainNameserverRequest;
use App\Jobs\SyncAllResellerDomainsJob;
use App\Models\ResellerDomain;
use App\Models\User;
use App\Services\DomainPricingService;
use App\Services\SkrimeApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResellerDomainController extends Controller
{
    public function import(Request $request, SkrimeApiService $skrime): RedirectResponse
    {
        $request->validate([
            'domain' => ['required_without:product_id', 'nullable', 'string', 'max:253'],
            'product_id' => ['required_without:domain', 'nullable', 'string', 'max:36'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);
        $domain = $request->input('domain');
        $productId = $request->input('product_id');
        $userId = $request->input('user_id');

        try {
            $data = $skrime->getProduct($productId, $domain);
        } catch (\Throwable $e) {
            return redirect()->route('admin.domains.index')->with('error', 'Produkt konnte nicht von Skrime geladen werden: '.$e->getMessage());
        }

        $productInfo = $data['productInfo'] ?? [];
        $domainName = $productInfo['domain'] ?? $domain;
        if (! $domainName) {
            return redirect()->route('admin.domains.index')->with('error', 'Domain konnte nicht ermittelt werden.');
        }
        if (ResellerDomain::where('domain', $domainName)->exists()) {
            return redirect()->route('admin.domains.index')->with('error', 'Domain '.$domainName.' ist bereits in der Liste.');
        }

        $expiresAt = isset($data['expireAt']) ? \Carbon\Carbon::parse($data['expireAt']) : null;
        $tld = substr(strrchr($domainName, '.'), 1) ?: null;
        $purchasePrice = null;
        $salePrice = null;
        if ($tld) {
            $pricing = app(DomainPricingService::class)->getPricingForTld($tld, 'create');
            if ($pricing['purchase_price'] > 0) {
                $purchasePrice = $pricing['purchase_price'];
                $salePrice = $pricing['sale_price'];
            }
        }
        ResellerDomain::create([
            'domain' => $domainName,
            'user_id' => $userId ?: null,
            'skrime_id' => $data['id'] ?? null,
            'status' => $data['state'] ?? 'active',
            'registered_at' => isset($data['createdAt']) ? \Carbon\Carbon::parse($data['createdAt']) : null,
            'expires_at' => $expiresAt,
            'auto_renew' => (bool) ($data['autoRenew'] ?? false),
            'tld' => $tld,
            'purchase_price' => $purchasePrice,
            'sale_price' => $salePrice,
        ]);

        return redirect()->route('admin.domains.index')->with('success', 'Domain '.$domainName.' wurde importiert.');
    }

    public function syncFromSkrime(): RedirectResponse
    {
        SyncAllResellerDomainsJob::dispatch();

        return redirect()->route('admin.domains.index')->with(
            'success',
            'Domain-Sync von Skrime in die Warteschlange gestellt. Seite in 1–2 Minuten neu laden. (Queue-Worker: php artisan queue:work)'
        );
    }

    public function index(Request $request, DomainPricingService $pricing): Response
    {
        $query = ResellerDomain::query()->with('user:id,name,email');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('customer_id')) {
            $query->where('user_id', $request->integer('customer_id'));
        }

        $domains = $query->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(function (ResellerDomain $d) use ($pricing) {
                $arr = $d->toArray();
                $arr['expires_at'] = $d->expires_at?->format('d.m.Y');
                $arr['registered_at'] = $d->registered_at?->format('d.m.Y');
                if ($d->purchase_price !== null && $d->sale_price !== null) {
                    $arr['profit_margin'] = $d->profitMargin();
                } else {
                    $tldPricing = $d->tld ? $pricing->getPricingForTld($d->tld, 'create') : null;
                    $arr['purchase_price'] = $arr['purchase_price'] ?? ($tldPricing['purchase_price'] ?? null);
                    $arr['sale_price'] = $arr['sale_price'] ?? ($tldPricing['sale_price'] ?? null);
                    $arr['profit_margin'] = $tldPricing ? round(($tldPricing['sale_price'] ?? 0) - ($tldPricing['purchase_price'] ?? 0), 2) : $d->profitMargin();
                }

                return $arr;
            });

        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        $stats = [
            'total' => ResellerDomain::query()->count(),
            'without_skrime' => ResellerDomain::query()->whereNull('skrime_id')->count(),
        ];

        return Inertia::render('admin/domains/Index', [
            'domains' => $domains,
            'customers' => $customers,
            'stats' => $stats,
            'pagination' => [
                'current_page' => $domains->currentPage(),
                'last_page' => $domains->lastPage(),
                'total' => $domains->total(),
                'per_page' => $domains->perPage(),
            ],
        ]);
    }

    public function show(ResellerDomain $reseller_domain, DomainPricingService $pricing): Response|RedirectResponse
    {
        $reseller_domain->load('user:id,name,email');

        $nameservers = [];
        try {
            $result = app(SkrimeApiService::class)->getNameserver($reseller_domain->domain);
            $nameservers = $result['nameserver'] ?? [];
        } catch (\Throwable) {
            // ignore
        }

        $domainArray = $reseller_domain->toArray();
        $domainArray['expires_at'] = $reseller_domain->expires_at?->format('d.m.Y');
        $domainArray['registered_at'] = $reseller_domain->registered_at?->format('d.m.Y');
        if ($reseller_domain->purchase_price !== null && $reseller_domain->sale_price !== null) {
            $domainArray['profit_margin'] = $reseller_domain->profitMargin();
        } else {
            $tldPricing = $reseller_domain->tld ? $pricing->getPricingForTld($reseller_domain->tld, 'create') : null;
            $domainArray['purchase_price'] = $domainArray['purchase_price'] ?? ($tldPricing['purchase_price'] ?? null);
            $domainArray['sale_price'] = $domainArray['sale_price'] ?? ($tldPricing['sale_price'] ?? null);
            $domainArray['profit_margin'] = $tldPricing ? round(($tldPricing['sale_price'] ?? 0) - ($tldPricing['purchase_price'] ?? 0), 2) : $reseller_domain->profitMargin();
        }
        $domainArray['nameservers'] = $nameservers;

        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        return Inertia::render('admin/domains/Show', [
            'domain' => $domainArray,
            'customers' => $customers,
        ]);
    }

    public function updateCustomer(AssignResellerDomainCustomerRequest $request, ResellerDomain $reseller_domain): RedirectResponse
    {
        $reseller_domain->update(['user_id' => $request->validated('user_id')]);

        return redirect()->route('admin.domains.show', $reseller_domain)->with('success', 'Kunde zugewiesen.');
    }

    public function renew(ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        if (! $reseller_domain->skrime_id) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'Domain hat keine Skrime-ID.');
        }

        try {
            $data = $skrime->renewProduct(domain: $reseller_domain->domain);
            $reseller_domain->update([
                'expires_at' => isset($data['expireAt']) ? \Carbon\Carbon::parse($data['expireAt']) : null,
            ]);
        } catch (\Throwable $e) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'Verlängerung fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()->route('admin.domains.show', $reseller_domain)->with('success', 'Domain verlängert.');
    }

    public function setAutoRenew(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        $request->validate(['auto_renew' => ['required', 'boolean']]);
        $enabled = (bool) $request->input('auto_renew');

        if (! $reseller_domain->skrime_id) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'Domain hat keine Skrime-ID.');
        }

        try {
            $skrime->setAutoRenew($enabled, domain: $reseller_domain->domain);
            $reseller_domain->update(['auto_renew' => $enabled]);
        } catch (\Throwable $e) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'Auto-Renew konnte nicht gesetzt werden: '.$e->getMessage());
        }

        return redirect()->route('admin.domains.show', $reseller_domain)->with('success', $enabled ? 'Auto-Verlängerung aktiviert.' : 'Auto-Verlängerung deaktiviert.');
    }

    public function authcode(ResellerDomain $reseller_domain, SkrimeApiService $skrime): JsonResponse
    {
        try {
            $code = $skrime->getAuthcode($reseller_domain->domain);

            return response()->json(['authcode' => $code]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function cancel(ResellerDomain $reseller_domain): RedirectResponse
    {
        $reseller_domain->update(['status' => 'cancelled']);

        return redirect()->route('admin.domains.show', $reseller_domain)->with('success', 'Domain als gekündigt markiert.');
    }

    public function updateNameserver(UpdateResellerDomainNameserverRequest $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
        try {
            $skrime->setNameserver($reseller_domain->domain, $request->validated('nameservers'));
        } catch (\Throwable $e) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'Nameserver konnten nicht gesetzt werden: '.$e->getMessage());
        }

        return redirect()->route('admin.domains.show', $reseller_domain)->with('success', 'Nameserver aktualisiert.');
    }

    public function dns(ResellerDomain $reseller_domain, SkrimeApiService $skrime): Response|RedirectResponse
    {
        try {
            $records = $skrime->getDns($reseller_domain->domain);
        } catch (\Throwable $e) {
            return redirect()->route('admin.domains.show', $reseller_domain)->with('error', 'DNS-Zone konnte nicht geladen werden: '.$e->getMessage());
        }

        return Inertia::render('admin/domains/Dns', [
            'domain' => $reseller_domain->only(['id', 'domain']),
            'records' => $records,
        ]);
    }

    public function updateDns(Request $request, ResellerDomain $reseller_domain, SkrimeApiService $skrime): RedirectResponse
    {
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
            return redirect()->route('admin.domains.dns', $reseller_domain)->with('error', 'DNS-Zone konnte nicht gespeichert werden: '.$e->getMessage());
        }

        return redirect()->route('admin.domains.dns', $reseller_domain)->with('success', 'DNS-Zone aktualisiert.');
    }
}
