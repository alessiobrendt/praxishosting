<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\SiteSubscription;
use App\Notifications\SubscriptionRenewalInvoiceCreatedNotification;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Stripe\Exception\InvalidRequestException;
use Stripe\StripeClient;

class CreateSiteRenewalInvoicesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create renewal invoices for site subscriptions ending within this many days.
     */
    public function __construct(
        public int $daysAheadMin = 7,
        public int $daysAheadMax = 14
    ) {}

    public function handle(InvoicePdfService $pdfService, InvoiceEInvoiceService $eInvoiceService): void
    {
        $from = Carbon::now()->addDays($this->daysAheadMin)->startOfDay();
        $to = Carbon::now()->addDays($this->daysAheadMax)->endOfDay();

        SiteSubscription::query()
            ->with(['site.user', 'site'])
            ->whereHas('site', fn ($q) => $q->where('is_legacy', false)->where('status', 'active'))
            ->whereNotNull('current_period_ends_at')
            ->whereBetween('current_period_ends_at', [$from, $to])
            ->where(function ($q): void {
                $q->where('cancel_at_period_end', false)
                    ->orWhereNull('cancel_at_period_end');
            })
            ->get()
            ->each(function (SiteSubscription $sub) use ($pdfService, $eInvoiceService): void {
                $this->createRenewalInvoiceIfMissing($sub, $pdfService, $eInvoiceService);
            });
    }

    protected function createRenewalInvoiceIfMissing(
        SiteSubscription $sub,
        InvoicePdfService $pdfService,
        InvoiceEInvoiceService $eInvoiceService
    ): void {
        $periodEndsAt = $sub->current_period_ends_at;
        $nextPeriodStart = $periodEndsAt->copy();

        $existing = Invoice::query()
            ->where('site_subscription_id', $sub->id)
            ->where('type', 'subscription_renewal')
            ->where('billing_period_start', $nextPeriodStart->toDateString())
            ->whereIn('status', ['draft', 'sent', 'pending'])
            ->exists();

        if ($existing) {
            return;
        }

        $amount = $this->getRenewalAmount($sub);
        if ($amount === null || $amount <= 0) {
            return;
        }

        $user = $sub->site->user;
        if (! $user) {
            return;
        }

        $year = (int) date('Y');
        $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
        $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'site_subscription_id' => $sub->id,
            'number' => $number,
            'type' => 'subscription_renewal',
            'amount' => $amount,
            'tax' => 0,
            'status' => 'sent',
            'billing_period_start' => $nextPeriodStart,
            'billing_period_end' => $nextPeriodStart->copy()->addMonth(),
            'invoice_date' => now(),
            'due_date' => $periodEndsAt,
            'metadata' => ['renewal_for_period_end' => $periodEndsAt->toIso8601String()],
        ]);

        InvoiceLineItem::create([
            'invoice_id' => $invoice->id,
            'position' => 1,
            'description' => 'Abo-Verlängerung '.$sub->site->name,
            'quantity' => 1,
            'unit' => 'Monat',
            'unit_price' => $amount,
            'amount' => $amount,
        ]);

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

        $user->notify(new SubscriptionRenewalInvoiceCreatedNotification($invoice->fresh(['siteSubscription.site'])));
    }

    protected function getRenewalAmount(SiteSubscription $sub): ?float
    {
        $priceId = $sub->stripe_price_id;
        if (! $priceId) {
            return null;
        }

        try {
            $stripe = new StripeClient(config('cashier.secret'));
            $price = $stripe->prices->retrieve($priceId);
        } catch (InvalidRequestException $e) {
            report($e);

            return null;
        }

        $unitAmount = $price->unit_amount ?? 0;
        $currency = strtolower($price->currency ?? 'eur');

        if ($currency === 'eur') {
            return (float) ($unitAmount / 100);
        }

        return (float) $unitAmount / 100;
    }
}
