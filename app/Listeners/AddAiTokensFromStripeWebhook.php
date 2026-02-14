<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\AiTokenService;
use Laravel\Cashier\Events\WebhookReceived;

class AddAiTokensFromStripeWebhook
{
    public function __construct(
        protected AiTokenService $aiTokenService
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

        $userId = $metadata['user_id'] ?? null;
        $tokenAmount = isset($metadata['token_amount']) ? (int) $metadata['token_amount'] : 0;

        if (! $userId || $tokenAmount <= 0) {
            return;
        }

        $user = User::find($userId);
        if (! $user) {
            return;
        }

        $this->aiTokenService->addFromPurchase(
            $user,
            $tokenAmount,
            "AI-Token-Paket {$tokenAmount} gekauft (Stripe)"
        );
    }
}
