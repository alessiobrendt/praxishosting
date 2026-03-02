<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\Setting;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class VoidUnpaidInvoicesAfterGraceJob implements ShouldQueue
{
    use Queueable;

    public function handle(InvoicePdfService $pdfService, InvoiceEInvoiceService $eInvoiceService): void
    {
        $gracePeriodDays = (int) (Setting::get('billing_grace_period_days') ?? config('billing.grace_period_days', 7));
        $deadline = Carbon::now()->subDays($gracePeriodDays);

        Invoice::query()
            ->whereIn('status', ['sent', 'pending'])
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $deadline)
            ->with(['user.brand', 'siteSubscription.site', 'lineItems'])
            ->get()
            ->each(function (Invoice $invoice) use ($pdfService, $eInvoiceService): void {
                $invoice->update(['status' => 'cancelled']);

                try {
                    $pdfPath = $pdfService->generate($invoice->fresh(['user.brand', 'siteSubscription.site', 'lineItems']));
                    if ($pdfPath) {
                        $invoice->update(['pdf_path' => $pdfPath]);
                    }
                } catch (\Throwable $e) {
                    report($e);
                }

                try {
                    $xmlPath = $eInvoiceService->generate($invoice->fresh(['user', 'lineItems']));
                    if ($xmlPath) {
                        $invoice->update(['invoice_xml_path' => $xmlPath]);
                    }
                } catch (\Throwable $e) {
                    report($e);
                }
            });
    }
}
