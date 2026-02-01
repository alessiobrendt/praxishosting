<?php

namespace App\Services;

use App\Models\Quote;
use App\Models\Setting;
use Spatie\LaravelPdf\Facades\Pdf;

class QuotePdfService
{
    /**
     * Generate PDF for a quote and save to storage.
     *
     * @return string|null Relative path (e.g. "quotes/2026/ANG-2026-00001.pdf") or null on failure
     */
    public function generate(Quote $quote): ?string
    {
        $quote->load(['user', 'lineItems']);

        $year = $quote->invoice_date->format('Y');
        $filename = str_replace(['/', ' '], ['-', '_'], $quote->number).'.pdf';
        $relativePath = "quotes/{$year}/{$filename}";

        try {
            Pdf::view('quotes.pdf', [
                'quote' => $quote,
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
