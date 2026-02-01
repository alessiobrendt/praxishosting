<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\PaymentFailedNotification;
use Laravel\Cashier\Events\WebhookReceived;

class SendPaymentFailedNotification
{
    public function handle(WebhookReceived $event): void
    {
        if (($event->payload['type'] ?? null) !== 'invoice.payment_failed') {
            return;
        }

        $object = $event->payload['data']['object'] ?? null;
        if (! $object) {
            return;
        }

        $customerId = $object['customer'] ?? null;
        $user = $customerId ? User::where('stripe_id', $customerId)->first() : null;
        if (! $user) {
            return;
        }

        $amountDue = isset($object['amount_due']) ? number_format($object['amount_due'] / 100, 2, ',', '.') : '';
        $invoiceNumber = $object['number'] ?? $object['id'] ?? '';

        $user->notify(new PaymentFailedNotification($invoiceNumber, $amountDue));
    }
}
