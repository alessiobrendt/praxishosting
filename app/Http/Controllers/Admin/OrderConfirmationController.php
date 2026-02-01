<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrderConfirmationRequest;
use App\Models\OrderConfirmation;
use App\Models\OrderConfirmationLineItem;
use App\Models\Quote;
use App\Models\User;
use App\Services\OrderConfirmationPdfService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OrderConfirmationController extends Controller
{
    public function index(Request $request): Response
    {
        $orderConfirmations = OrderConfirmation::query()
            ->with('user:id,name,email', 'quote:id,number')
            ->latest('order_date')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (OrderConfirmation $oc) => array_merge($oc->toArray(), [
                'order_date' => $oc->order_date?->format('d.m.Y'),
            ]));

        return Inertia::render('admin/order-confirmations/Index', [
            'orderConfirmations' => $orderConfirmations,
        ]);
    }

    public function create(Request $request): Response
    {
        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        $fromQuote = null;
        $quoteId = $request->query('from_quote');
        if ($quoteId) {
            $quote = Quote::with(['user:id,name,email', 'lineItems'])->find($quoteId);
            if ($quote) {
                $fromQuote = array_merge($quote->toArray(), [
                    'invoice_date' => $quote->invoice_date?->format('Y-m-d'),
                    'line_items' => $quote->lineItems->map(fn ($item) => [
                        'position' => $item->position,
                        'description' => $item->description,
                        'quantity' => (float) $item->quantity,
                        'unit' => $item->unit ?? 'Stück',
                        'unit_price' => (float) $item->unit_price,
                        'amount' => (float) $item->amount,
                    ])->values()->all(),
                ]);
            }
        }

        return Inertia::render('admin/order-confirmations/Create', [
            'customers' => $customers,
            'fromQuote' => $fromQuote,
        ]);
    }

    public function store(StoreOrderConfirmationRequest $request, OrderConfirmationPdfService $pdfService): RedirectResponse
    {
        $data = $request->validated();
        $orderDate = Carbon::parse($data['order_date']);
        $year = $orderDate->format('Y');

        $count = OrderConfirmation::whereYear('order_date', $year)->count();
        $nextNum = $count + 1;
        $number = 'AB-'.$year.'-'.str_pad((string) $nextNum, 5, '0', STR_PAD_LEFT);

        $amount = 0;
        foreach ($data['line_items'] as $row) {
            $amount += (float) $row['amount'];
        }

        $orderConfirmation = OrderConfirmation::create([
            'user_id' => $data['user_id'],
            'quote_id' => $data['quote_id'] ?? null,
            'number' => $number,
            'order_date' => $orderDate,
            'amount' => $amount,
            'tax' => 0,
        ]);

        foreach ($data['line_items'] as $row) {
            OrderConfirmationLineItem::create([
                'order_confirmation_id' => $orderConfirmation->id,
                'position' => (int) $row['position'],
                'description' => $row['description'],
                'quantity' => (float) $row['quantity'],
                'unit' => $row['unit'] ?? 'Stück',
                'unit_price' => (float) $row['unit_price'],
                'amount' => (float) $row['amount'],
            ]);
        }

        $pdfPath = $pdfService->generate($orderConfirmation->fresh(['user', 'quote', 'lineItems']));
        if ($pdfPath) {
            $orderConfirmation->update(['pdf_path' => $pdfPath]);
        }

        return redirect()->route('admin.order-confirmations.index')->with('success', 'Auftragsbestätigung erstellt.');
    }

    public function show(OrderConfirmation $orderConfirmation): Response
    {
        $orderConfirmation->load(['user:id,name,email,company,street,postal_code,city,country', 'quote:id,number', 'lineItems']);

        return Inertia::render('admin/order-confirmations/Show', [
            'orderConfirmation' => array_merge($orderConfirmation->toArray(), [
                'order_date' => $orderConfirmation->order_date?->format('d.m.Y'),
            ]),
        ]);
    }

    public function pdf(OrderConfirmation $orderConfirmation): BinaryFileResponse
    {
        if (! $orderConfirmation->pdf_path || ! Storage::disk('local')->exists($orderConfirmation->pdf_path)) {
            abort(404, 'Auftragsbestätigungs-PDF ist nicht verfügbar.');
        }

        return response()->file(Storage::disk('local')->path($orderConfirmation->pdf_path), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Auftragsbestätigung-'.$orderConfirmation->number.'.pdf"',
        ]);
    }
}
