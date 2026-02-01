<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreManualInvoiceRequest;
use App\Http\Requests\Admin\UpdateManualInvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\InvoiceLineItem;
use App\Models\Setting;
use App\Models\User;
use App\Services\DunningPdfService;
use App\Services\InvoicePdfService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::query()
            ->with('user:id,name,email')
            ->latest('invoice_date')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Invoice $inv) => array_merge($inv->toArray(), [
                'invoice_date' => $inv->invoice_date ? Carbon::parse($inv->invoice_date)->format('d.m.Y') : null,
            ]));

        return Inertia::render('admin/invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(): Response
    {
        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        return Inertia::render('admin/invoices/Create', [
            'customers' => $customers,
        ]);
    }

    public function store(StoreManualInvoiceRequest $request, InvoicePdfService $pdfService): RedirectResponse
    {
        $data = $request->validated();
        $invoiceDate = Carbon::parse($data['invoice_date']);
        $year = $invoiceDate->format('Y');

        $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
        $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

        $amount = 0;
        foreach ($data['line_items'] as $row) {
            $amount += (float) $row['amount'];
        }

        $invoice = Invoice::create([
            'user_id' => $data['user_id'],
            'number' => $number,
            'type' => 'manual',
            'amount' => $amount,
            'tax' => 0,
            'status' => $data['status'] ?? 'draft',
            'invoice_date' => $invoiceDate,
            'due_date' => isset($data['due_date']) ? Carbon::parse($data['due_date']) : null,
        ]);

        foreach ($data['line_items'] as $row) {
            InvoiceLineItem::create([
                'invoice_id' => $invoice->id,
                'position' => (int) $row['position'],
                'description' => $row['description'],
                'quantity' => (float) $row['quantity'],
                'unit' => $row['unit'] ?? 'Stück',
                'unit_price' => (float) $row['unit_price'],
                'amount' => (float) $row['amount'],
            ]);
        }

        $pdfPath = $pdfService->generate($invoice->fresh(['user', 'lineItems']));
        if ($pdfPath) {
            $invoice->update(['pdf_path' => $pdfPath]);
        }

        return redirect()->route('admin.invoices.index')->with('success', 'Rechnung erstellt.');
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load(['user:id,name,email', 'lineItems', 'dunningLetters']);

        return Inertia::render('admin/invoices/Show', [
            'invoice' => array_merge($invoice->toArray(), [
                'invoice_date' => $invoice->invoice_date?->format('d.m.Y'),
                'due_date' => $invoice->due_date?->format('d.m.Y'),
            ]),
        ]);
    }

    public function edit(Invoice $invoice): Response|RedirectResponse
    {
        if ($invoice->type !== 'manual') {
            return redirect()->route('admin.invoices.index')->with('error', 'Nur manuelle Rechnungen können bearbeitet werden.');
        }

        $invoice->load('lineItems');
        $customers = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]);

        return Inertia::render('admin/invoices/Edit', [
            'invoice' => array_merge($invoice->toArray(), [
                'invoice_date' => $invoice->invoice_date?->format('Y-m-d'),
                'due_date' => $invoice->due_date?->format('Y-m-d'),
            ]),
            'customers' => $customers,
        ]);
    }

    public function update(UpdateManualInvoiceRequest $request, Invoice $invoice, InvoicePdfService $pdfService): RedirectResponse
    {
        if ($invoice->type !== 'manual') {
            return redirect()->route('admin.invoices.index')->with('error', 'Nur manuelle Rechnungen können bearbeitet werden.');
        }

        $data = $request->validated();
        $amount = 0;
        foreach ($data['line_items'] as $row) {
            $amount += (float) $row['amount'];
        }

        $invoice->update([
            'invoice_date' => Carbon::parse($data['invoice_date']),
            'due_date' => isset($data['due_date']) ? Carbon::parse($data['due_date']) : null,
            'status' => $data['status'] ?? $invoice->status,
            'amount' => $amount,
        ]);

        $invoice->lineItems()->delete();
        foreach ($data['line_items'] as $row) {
            InvoiceLineItem::create([
                'invoice_id' => $invoice->id,
                'position' => (int) $row['position'],
                'description' => $row['description'],
                'quantity' => (float) $row['quantity'],
                'unit' => $row['unit'] ?? 'Stück',
                'unit_price' => (float) $row['unit_price'],
                'amount' => (float) $row['amount'],
            ]);
        }

        $pdfPath = $pdfService->generate($invoice->fresh(['user', 'lineItems']));
        if ($pdfPath) {
            $invoice->update(['pdf_path' => $pdfPath]);
        }

        return redirect()->route('admin.invoices.index')->with('success', 'Rechnung aktualisiert.');
    }

    public function storeDunningLetter(Invoice $invoice, DunningPdfService $dunningPdfService): RedirectResponse
    {
        $existingLevels = $invoice->dunningLetters()->pluck('level')->all();
        $nextLevel = 1;
        foreach ([1, 2, 3] as $level) {
            if (! in_array($level, $existingLevels, true)) {
                $nextLevel = $level;
                break;
            }
            $nextLevel = $level + 1;
        }
        if ($nextLevel > 3) {
            return redirect()->route('admin.invoices.show', $invoice)->with('error', 'Maximal 3 Mahnungen pro Rechnung.');
        }

        $feeAmount = Setting::getDunningFee($nextLevel);
        $dunningLetter = InvoiceDunningLetter::create([
            'invoice_id' => $invoice->id,
            'level' => $nextLevel,
            'sent_at' => now(),
            'fee_amount' => $feeAmount,
        ]);

        $pdfPath = $dunningPdfService->generate($dunningLetter->fresh(['invoice.user', 'invoice.lineItems']));
        if ($pdfPath) {
            $dunningLetter->update(['pdf_path' => $pdfPath]);
        }

        return redirect()->route('admin.invoices.show', $invoice)->with('success', "{$nextLevel}. Mahnung erstellt.");
    }

    public function dunningPdf(Invoice $invoice, InvoiceDunningLetter $dunningLetter): BinaryFileResponse
    {
        if ($dunningLetter->invoice_id !== $invoice->id) {
            abort(404);
        }
        if (! $dunningLetter->pdf_path || ! Storage::disk('local')->exists($dunningLetter->pdf_path)) {
            abort(404, 'Mahnungs-PDF ist nicht verfügbar.');
        }

        return response()->file(Storage::disk('local')->path($dunningLetter->pdf_path), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Mahnung-'.$invoice->number.'-'.$dunningLetter->level.'.pdf"',
        ]);
    }

    /**
     * Export invoices as CSV for date range (Umsatz-Export).
     */
    public function export(Request $request): StreamedResponse
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from'))->startOfDay() : null;
        $to = $request->query('to') ? Carbon::parse($request->query('to'))->endOfDay() : null;

        $query = Invoice::query()
            ->with('user:id,name,email')
            ->where('status', 'paid')
            ->orderBy('invoice_date');

        if ($from) {
            $query->where('invoice_date', '>=', $from);
        }
        if ($to) {
            $query->where('invoice_date', '<=', $to);
        }

        $filename = 'rechnungen-export-'.($from ? $from->format('Y-m-d') : 'alle').'-'.($to ? $to->format('Y-m-d') : 'bis-jetzt').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            // BOM for UTF-8 so Excel recognises encoding
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['Nummer', 'Datum', 'Kunde', 'E-Mail', 'Betrag', 'Status'], ';');
            foreach ($query->cursor() as $inv) {
                $amount = $inv->amount !== null
                    ? number_format((float) $inv->amount, 2, ',', '')
                    : '';
                fputcsv($handle, [
                    $inv->number,
                    $inv->invoice_date ? Carbon::parse($inv->invoice_date)->format('d.m.Y') : '',
                    $inv->user?->name ?? '',
                    $inv->user?->email ?? '',
                    $amount,
                    $inv->status,
                ], ';');
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
