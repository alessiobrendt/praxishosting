<?php

namespace App\Services;

use App\Exceptions\InsufficientBalanceException;
use App\Models\BalanceTransaction;
use App\Models\CustomerBalance;
use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\User;
use App\Notifications\InvoiceCreatedNotification;
use Illuminate\Support\Facades\DB;

class BalancePaymentService
{
    public function __construct(
        protected InvoicePdfService $invoicePdfService,
        protected InvoiceEInvoiceService $invoiceEInvoiceService
    ) {}

    /**
     * Pay an amount from the user's balance: create invoice, debit transaction, reduce balance.
     *
     * @param  array{description: string}  $lineItemDescription  e.g. ['description' => 'Webspace Paket X']
     */
    public function pay(User $user, float $amount, string $invoiceType, string $description, array $lineItemDescription): Invoice
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Amount must be positive.');
        }

        return DB::transaction(function () use ($user, $amount, $invoiceType, $description, $lineItemDescription) {
            $balance = CustomerBalance::where('user_id', $user->id)->lockForUpdate()->first();
            $currentBalance = $balance ? (float) $balance->balance : 0.0;

            if ($currentBalance < $amount) {
                throw new InsufficientBalanceException('Das Guthaben reicht für diese Zahlung nicht aus.');
            }

            $year = date('Y');
            $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
            $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

            $invoice = Invoice::create([
                'user_id' => $user->id,
                'site_subscription_id' => null,
                'stripe_invoice_id' => null,
                'number' => $number,
                'type' => $invoiceType,
                'amount' => $amount,
                'tax' => 0,
                'status' => 'paid',
                'billing_period_start' => null,
                'billing_period_end' => null,
                'invoice_date' => now(),
                'metadata' => ['payment_method' => 'balance'],
            ]);

            InvoiceLineItem::create([
                'invoice_id' => $invoice->id,
                'position' => 1,
                'description' => $lineItemDescription['description'] ?? $description,
                'quantity' => 1,
                'unit' => 'Stück',
                'unit_price' => $amount,
                'amount' => $amount,
            ]);

            BalanceTransaction::create([
                'user_id' => $user->id,
                'amount' => -$amount,
                'type' => 'payment_application',
                'description' => $description,
                'reference_type' => Invoice::class,
                'reference_id' => $invoice->id,
            ]);

            $balance = CustomerBalance::firstOrCreate(
                ['user_id' => $user->id],
                ['balance' => 0]
            );
            $balance->decrement('balance', $amount);

            try {
                $pdfPath = $this->invoicePdfService->generate($invoice->fresh(['user', 'lineItems']));
                if ($pdfPath) {
                    $invoice->update(['pdf_path' => $pdfPath]);
                }
            } catch (\Throwable $e) {
                report($e);
            }

            try {
                $xmlPath = $this->invoiceEInvoiceService->generate($invoice->fresh(['user', 'lineItems']));
                if ($xmlPath) {
                    $invoice->update(['invoice_xml_path' => $xmlPath]);
                }
            } catch (\Throwable $e) {
                report($e);
            }

            $invoice->user->notify(new InvoiceCreatedNotification($invoice->fresh()));

            return $invoice->fresh();
        });
    }

    /**
     * Pay an existing invoice from the user's balance: debit balance, mark invoice as paid.
     */
    public function payExistingInvoice(User $user, Invoice $invoice): void
    {
        if ($invoice->user_id !== $user->id) {
            throw new \InvalidArgumentException('Invoice does not belong to this user.');
        }
        if ($invoice->status === 'paid') {
            return;
        }

        $amount = (float) $invoice->amount;
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Invoice amount must be positive.');
        }

        DB::transaction(function () use ($user, $invoice, $amount): void {
            $balance = CustomerBalance::where('user_id', $user->id)->lockForUpdate()->first();
            $currentBalance = $balance ? (float) $balance->balance : 0.0;

            if ($currentBalance < $amount) {
                throw new InsufficientBalanceException('Das Guthaben reicht für diese Rechnung nicht aus.');
            }

            BalanceTransaction::create([
                'user_id' => $user->id,
                'amount' => -$amount,
                'type' => 'payment_application',
                'description' => 'Rechnung '.$invoice->number.' bezahlt',
                'reference_type' => Invoice::class,
                'reference_id' => $invoice->id,
            ]);

            $balance = CustomerBalance::firstOrCreate(
                ['user_id' => $user->id],
                ['balance' => 0]
            );
            $balance->decrement('balance', $amount);

            $invoice->update([
                'status' => 'paid',
                'metadata' => array_merge($invoice->metadata ?? [], ['payment_method' => 'balance']),
            ]);
        });

        $invoice->refresh();
        try {
            $pdfPath = $this->invoicePdfService->generate($invoice->fresh(['user.brand', 'siteSubscription.site', 'lineItems']));
            if ($pdfPath) {
                $invoice->update(['pdf_path' => $pdfPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }
        try {
            $xmlPath = $this->invoiceEInvoiceService->generate($invoice->fresh(['user', 'lineItems']));
            if ($xmlPath) {
                $invoice->update(['invoice_xml_path' => $xmlPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
