<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelPdf\Facades\Pdf;

class InvoicePdfService
{
    /**
     * Generate PDF for an invoice and save to storage.
     * Stores under storage/app/invoices/{year}/{invoice_number}.pdf
     *
     * @return string|null Relative path (e.g. "invoices/2026/INV-2026-00001.pdf") or null on failure
     */
    public function generate(Invoice $invoice): ?string
    {
        $invoice->load(['user', 'siteSubscription.site', 'lineItems']);

        $year = $invoice->invoice_date->format('Y');
        $filename = str_replace(['/', ' '], ['-', '_'], $invoice->number).'.pdf';
        $relativePath = "invoices/{$year}/{$filename}";

        try {
            Pdf::view('invoices.pdf', [
                'invoice' => $invoice,
                'company' => Setting::getInvoiceCompany(),
            ])
                ->format('a4')
                ->disk('local')
                ->save($relativePath);

            return $relativePath;
        } catch (\Throwable) {
            return null;
        }
    }
}
