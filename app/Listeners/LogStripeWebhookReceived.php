<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Cache;
use Laravel\Cashier\Events\WebhookReceived;

class LogStripeWebhookReceived
{
    public const CACHE_KEY = 'stripe_last_webhook_at';

    public function handle(WebhookReceived $event): void
    {
        Cache::put(self::CACHE_KEY, now()->toIso8601String(), now()->addDays(30));
    }
}
