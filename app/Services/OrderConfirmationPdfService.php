<?php

namespace App\Services;

use App\Models\OrderConfirmation;
use App\Models\Setting;
use Spatie\LaravelPdf\Facades\Pdf;

class OrderConfirmationPdfService
{
    /**
     * Generate PDF for an order confirmation and save to storage.
     *
     * @return string|null Relative path (e.g. "order_confirmations/2026/AB-2026-00001.pdf") or null on failure
     */
    public function generate(OrderConfirmation $orderConfirmation): ?string
    {
        $orderConfirmation->load(['user', 'quote', 'lineItems']);

        $year = $orderConfirmation->order_date->format('Y');
        $filename = str_replace(['/', ' '], ['-', '_'], $orderConfirmation->number).'.pdf';
        $relativePath = "order_confirmations/{$year}/{$filename}";

        try {
            Pdf::view('order_confirmations.pdf', [
                'orderConfirmation' => $orderConfirmation,
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
