<?php

namespace App\Services;

use App\Models\InvoiceDunningLetter;
use App\Models\Setting;
use Spatie\LaravelPdf\Facades\Pdf;

class DunningPdfService
{
    /**
     * Generate PDF for a dunning letter and save to storage.
     *
     * @return string|null Relative path or null on failure
     */
    public function generate(InvoiceDunningLetter $dunningLetter): ?string
    {
        $dunningLetter->load(['invoice.user', 'invoice.lineItems']);

        $invoice = $dunningLetter->invoice;
        $level = $dunningLetter->level;
        $relativePath = "invoices/dunning/{$invoice->id}_{$level}.pdf";

        try {
            Pdf::view('invoices.dunning', [
                'invoice' => $invoice,
                'dunningLetter' => $dunningLetter,
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
