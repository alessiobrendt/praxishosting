<?php

namespace App\Listeners;

use App\Models\SiteSubscription;
use Carbon\Carbon;
use Laravel\Cashier\Events\WebhookReceived;

class SyncSiteSubscriptionFromStripeWebhook
{
    public function handle(WebhookReceived $event): void
    {
        $type = $event->payload['type'] ?? null;
        $object = $event->payload['data']['object'] ?? null;

        if (! $object) {
            return;
        }

        if ($type === 'customer.subscription.created' || $type === 'customer.subscription.updated') {
            $this->syncSiteSubscription($object);
        }

        if ($type === 'customer.subscription.deleted') {
            $this->markSubscriptionEnded($object);
        }
    }

    protected function syncSiteSubscription(array $data): void
    {
        $siteSubscription = SiteSubscription::where('stripe_subscription_id', $data['id'])->first();

        if (! $siteSubscription) {
            return;
        }

        $firstItem = $data['items']['data'][0] ?? null;
        $currentPeriodEnd = isset($data['current_period_end'])
            ? Carbon::createFromTimestamp($data['current_period_end'])
            : null;
        $endsAt = isset($data['ended_at']) && $data['ended_at']
            ? Carbon::createFromTimestamp($data['ended_at'])
            : null;

        $siteSubscription->update([
            'stripe_status' => $data['status'] ?? $siteSubscription->stripe_status,
            'stripe_price_id' => $firstItem['price']['id'] ?? $siteSubscription->stripe_price_id,
            'current_period_ends_at' => $currentPeriodEnd ?? $siteSubscription->current_period_ends_at,
            'cancel_at_period_end' => (bool) ($data['cancel_at_period_end'] ?? false),
            'ends_at' => $endsAt ?? $siteSubscription->ends_at,
        ]);
    }

    protected function markSubscriptionEnded(array $data): void
    {
        $siteSubscription = SiteSubscription::where('stripe_subscription_id', $data['id'])->first();

        if (! $siteSubscription) {
            return;
        }

        $endsAt = isset($data['ended_at']) && $data['ended_at']
            ? Carbon::createFromTimestamp($data['ended_at'])
            : now();

        $siteSubscription->update([
            'stripe_status' => 'canceled',
            'ends_at' => $endsAt,
        ]);
    }
}
