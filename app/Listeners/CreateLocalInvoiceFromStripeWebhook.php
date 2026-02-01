<?php

namespace App\Listeners;

use App\Models\Invoice;
use App\Models\SiteSubscription;
use App\Models\User;
use App\Notifications\InvoiceCreatedNotification;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use Carbon\Carbon;
use Laravel\Cashier\Events\WebhookReceived;

class CreateLocalInvoiceFromStripeWebhook
{
    public function __construct(
        protected InvoicePdfService $invoicePdfService,
        protected InvoiceEInvoiceService $invoiceEInvoiceService
    ) {}

    public function handle(WebhookReceived $event): void
    {
        if (($event->payload['type'] ?? null) !== 'invoice.paid') {
            return;
        }

        $object = $event->payload['data']['object'] ?? null;
        if (! $object) {
            return;
        }

        $stripeInvoiceId = $object['id'] ?? null;
        if (! $stripeInvoiceId) {
            return;
        }

        if (Invoice::where('stripe_invoice_id', $stripeInvoiceId)->exists()) {
            return;
        }

        $customerId = $object['customer'] ?? null;
        $user = $customerId ? User::where('stripe_id', $customerId)->first() : null;
        if (! $user) {
            return;
        }

        $subscriptionId = $object['subscription'] ?? null;
        $siteSubscription = null;
        if ($subscriptionId) {
            $siteSubscription = SiteSubscription::where('stripe_subscription_id', $subscriptionId)->first();
        }

        $amountPaid = (float) (($object['amount_paid'] ?? 0) / 100);
        $periodStart = isset($object['period_start']) ? Carbon::createFromTimestamp($object['period_start']) : null;
        $periodEnd = isset($object['period_end']) ? Carbon::createFromTimestamp($object['period_end']) : null;

        $year = date('Y');
        $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
        $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'site_subscription_id' => $siteSubscription?->id,
            'stripe_invoice_id' => $stripeInvoiceId,
            'number' => $number,
            'type' => 'subscription',
            'amount' => $amountPaid,
            'tax' => 0,
            'status' => 'paid',
            'billing_period_start' => $periodStart,
            'billing_period_end' => $periodEnd,
            'invoice_date' => now(),
            'metadata' => ['stripe_invoice' => $object['id']],
        ]);

        try {
            $pdfPath = $this->invoicePdfService->generate($invoice);
            if ($pdfPath) {
                $invoice->update(['pdf_path' => $pdfPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }

        try {
            $xmlPath = $this->invoiceEInvoiceService->generate($invoice);
            if ($xmlPath) {
                $invoice->update(['invoice_xml_path' => $xmlPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }

        $invoice->user->notify(new InvoiceCreatedNotification($invoice));
    }
}
