<?php

namespace App\Listeners;

use App\Models\Invoice;
use App\Models\User;
use App\Notifications\InvoiceCreatedNotification;
use App\Services\AiTokenService;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;

class AddAiTokensFromStripeWebhook
{
    public function __construct(
        protected AiTokenService $aiTokenService,
        protected InvoicePdfService $invoicePdfService,
        protected InvoiceEInvoiceService $invoiceEInvoiceService
    ) {}

    public function handle(WebhookReceived $event): void
    {
        if (($event->payload['type'] ?? null) !== 'checkout.session.completed') {
            return;
        }

        $session = $event->payload['data']['object'] ?? null;
        if (! $session) {
            return;
        }

        $metadata = $session['metadata'] ?? [];
        if (($metadata['ai_token_purchase'] ?? null) !== '1') {
            return;
        }

        $sessionId = $session['id'] ?? null;
        if (! $sessionId) {
            return;
        }

        if (Invoice::where('metadata->stripe_checkout_session_id', $sessionId)->exists()) {
            Log::debug('AI token webhook: session already processed', ['session_id' => $sessionId]);

            return;
        }

        $userId = $metadata['user_id'] ?? null;
        $tokenAmount = isset($metadata['token_amount']) ? (int) $metadata['token_amount'] : 0;

        if (! $userId || $tokenAmount <= 0) {
            Log::warning('AI token webhook: missing user_id or token_amount', [
                'session_id' => $sessionId,
                'metadata' => $metadata,
            ]);

            return;
        }

        $user = User::find($userId);
        if (! $user) {
            Log::warning('AI token webhook: user not found', ['user_id' => $userId, 'session_id' => $sessionId]);

            return;
        }

        $amountTotal = isset($session['amount_total']) ? (float) ($session['amount_total'] / 100) : 0;

        $year = date('Y');
        $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
        $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'site_subscription_id' => null,
            'stripe_invoice_id' => null,
            'number' => $number,
            'type' => 'ai_tokens',
            'amount' => $amountTotal,
            'tax' => 0,
            'status' => 'paid',
            'billing_period_start' => null,
            'billing_period_end' => null,
            'invoice_date' => now(),
            'metadata' => [
                'stripe_checkout_session_id' => $sessionId,
                'token_amount' => $tokenAmount,
            ],
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

        $this->aiTokenService->addFromPurchase(
            $user,
            $tokenAmount,
            "AI-Token-Paket {$tokenAmount} gekauft (Stripe)"
        );

        Log::info('AI token purchase processed', [
            'user_id' => $user->id,
            'token_amount' => $tokenAmount,
            'invoice_id' => $invoice->id,
            'session_id' => $sessionId,
        ]);
    }
}
