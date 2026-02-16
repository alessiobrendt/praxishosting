<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTldPricelistBulkRequest;
use App\Jobs\SyncTldPricelistJob;
use App\Models\TldPricelist;
use App\Services\DomainPricingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TldPricelistController extends Controller
{
    public function index(Request $request, DomainPricingService $pricing): Response
    {
        $query = TldPricelist::query()->orderBy('tld');

        if ($request->filled('search')) {
            $search = strtolower(ltrim($request->string('search')->trim()->toString(), '.'));
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('tld', $search)
                        ->orWhere('tld', 'like', '%.'.$search);
                });
            }
        }

        $paginator = $query->paginate(25)->withQueryString();

        $items = collect($paginator->items())->map(function (TldPricelist $row) use ($pricing) {
            $info = $pricing->getPricingForTld($row->tld, 'create');

            return [
                'id' => $row->id,
                'tld' => $row->tld,
                'create_price' => (float) $row->create_price,
                'renew_price' => (float) $row->renew_price,
                'margin_type' => $row->margin_type,
                'margin_value' => (float) $row->margin_value,
                'sale_price' => $info['sale_price'],
            ];
        })->values()->all();

        return Inertia::render('admin/domains/TldPricelist', [
            'items' => $items,
            'links' => $paginator->linkCollection()->toArray(),
            'filters' => [
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    public function sync(): RedirectResponse
    {
        SyncTldPricelistJob::dispatch();

        return redirect()->route('admin.domains.tld-pricelist.index')->with(
            'success',
            'Pricelist-Import in die Warteschlange gestellt. Seite in 1–2 Minuten neu laden. (Queue-Worker: php artisan queue:work)'
        );
    }

    public function bulk(UpdateTldPricelistBulkRequest $request): RedirectResponse
    {
        $tlds = $request->validated('tlds', []);
        $marginType = $request->validated('margin_type');
        $marginValue = (float) $request->validated('margin_value');

        $query = TldPricelist::query();
        if (! empty($tlds)) {
            $query->whereIn('tld', array_map('strtolower', $tlds));
        }
        $count = $query->update([
            'margin_type' => $marginType,
            'margin_value' => $marginValue,
        ]);

        return redirect()->route('admin.domains.tld-pricelist.index')->with('success', "Marge für {$count} TLD(s) aktualisiert.");
    }
}
