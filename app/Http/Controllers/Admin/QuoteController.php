<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuoteRequest;
use App\Models\AdminActivityLog;
use App\Models\Quote;
use App\Models\QuoteLineItem;
use App\Models\User;
use App\Services\QuotePdfService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class QuoteController extends Controller
{
    public function index(Request $request): Response
    {
        $quotes = Quote::query()
            ->with('user:id,name,email')
            ->latest('invoice_date')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Quote $q) => array_merge($q->toArray(), [
                'invoice_date' => $q->invoice_date?->format('d.m.Y'),
                'valid_until' => $q->valid_until?->format('d.m.Y'),
            ]));

        return Inertia::render('admin/quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function create(): Response
    {
        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        return Inertia::render('admin/quotes/Create', [
            'customers' => $customers,
        ]);
    }

    public function store(StoreQuoteRequest $request, QuotePdfService $pdfService): RedirectResponse
    {
        $data = $request->validated();
        $invoiceDate = Carbon::parse($data['invoice_date']);
        $year = $invoiceDate->format('Y');

        $count = Quote::whereYear('invoice_date', $year)->count();
        $nextNum = $count + 1;
        $number = 'ANG-'.$year.'-'.str_pad((string) $nextNum, 5, '0', STR_PAD_LEFT);

        $amount = 0;
        foreach ($data['line_items'] as $row) {
            $amount += (float) $row['amount'];
        }

        $quote = Quote::create([
            'user_id' => $data['user_id'],
            'number' => $number,
            'status' => $data['status'] ?? 'draft',
            'invoice_date' => $invoiceDate,
            'valid_until' => isset($data['valid_until']) ? Carbon::parse($data['valid_until']) : null,
            'amount' => $amount,
            'tax' => 0,
        ]);

        foreach ($data['line_items'] as $row) {
            QuoteLineItem::create([
                'quote_id' => $quote->id,
                'position' => (int) $row['position'],
                'description' => $row['description'],
                'quantity' => (float) $row['quantity'],
                'unit' => $row['unit'] ?? 'Stück',
                'unit_price' => (float) $row['unit_price'],
                'amount' => (float) $row['amount'],
            ]);
        }

        $pdfPath = $pdfService->generate($quote->fresh(['user', 'lineItems']));
        if ($pdfPath) {
            $quote->update(['pdf_path' => $pdfPath]);
        }

        AdminActivityLog::log($request->user()->id, 'quote_created', Quote::class, $quote->id, null, ['number' => $quote->number, 'amount' => $quote->amount]);

        return redirect()->route('admin.quotes.index')->with('success', 'Angebot erstellt.');
    }

    public function show(Quote $quote): Response
    {
        $quote->load(['user:id,name,email', 'lineItems']);

        return Inertia::render('admin/quotes/Show', [
            'quote' => array_merge($quote->toArray(), [
                'invoice_date' => $quote->invoice_date?->format('d.m.Y'),
                'valid_until' => $quote->valid_until?->format('d.m.Y'),
            ]),
        ]);
    }

    public function pdf(Quote $quote): BinaryFileResponse
    {
        if (! $quote->pdf_path || ! Storage::disk('local')->exists($quote->pdf_path)) {
            abort(404, 'Angebots-PDF ist nicht verfügbar.');
        }

        return response()->file(Storage::disk('local')->path($quote->pdf_path), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Angebot-'.$quote->number.'.pdf"',
        ]);
    }
}
