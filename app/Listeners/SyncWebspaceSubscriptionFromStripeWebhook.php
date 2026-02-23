<?php

namespace App\Listeners;

use App\Models\WebspaceAccount;
use App\Notifications\WebspaceDeactivatedNotification;
use App\Services\ControlPanels\PleskClient;
use Carbon\Carbon;
use Laravel\Cashier\Events\WebhookReceived;

class SyncWebspaceSubscriptionFromStripeWebhook
{
    public function handle(WebhookReceived $event): void
    {
        $type = $event->payload['type'] ?? null;
        $object = $event->payload['data']['object'] ?? null;

        if (! $object) {
            return;
        }

        if ($type === 'customer.subscription.updated') {
            $this->syncWebspaceSubscription($object);
        }

        if ($type === 'customer.subscription.deleted') {
            $this->markWebspaceSubscriptionEnded($object);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function syncWebspaceSubscription(array $data): void
    {
        $account = WebspaceAccount::where('stripe_subscription_id', $data['id'])->first();

        if (! $account) {
            return;
        }

        $firstItem = $data['items']['data'][0] ?? null;
        $currentPeriodEnd = isset($data['current_period_end'])
            ? Carbon::createFromTimestamp($data['current_period_end'])
            : null;
        $endsAt = isset($data['ended_at']) && $data['ended_at']
            ? Carbon::createFromTimestamp($data['ended_at'])
            : null;

        $account->update([
            'stripe_price_id' => $firstItem['price']['id'] ?? $account->stripe_price_id,
            'current_period_ends_at' => $currentPeriodEnd ?? $account->current_period_ends_at,
            'cancel_at_period_end' => (bool) ($data['cancel_at_period_end'] ?? false),
            'ends_at' => $endsAt ?? $account->ends_at,
        ]);

        $status = $data['status'] ?? null;
        if (in_array($status, ['past_due', 'unpaid', 'canceled'], true) && $account->hostingServer) {
            $plesk = app(PleskClient::class);
            $plesk->setServer($account->hostingServer);
            $plesk->suspendAccount($account->plesk_username);
            $account->update(['status' => 'suspended']);
            $account->user?->notify(new WebspaceDeactivatedNotification($account));
        } elseif ($status === 'active' && $account->status === 'suspended' && $account->hostingServer) {
            $plesk = app(PleskClient::class);
            $plesk->setServer($account->hostingServer);
            $plesk->unsuspendAccount($account->plesk_username);
            $account->update(['status' => 'active']);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function markWebspaceSubscriptionEnded(array $data): void
    {
        $account = WebspaceAccount::where('stripe_subscription_id', $data['id'])->first();

        if (! $account) {
            return;
        }

        $endsAt = isset($data['ended_at']) && $data['ended_at']
            ? Carbon::createFromTimestamp($data['ended_at'])
            : now();

        if ($account->hostingServer) {
            $plesk = app(PleskClient::class);
            $plesk->setServer($account->hostingServer);
            $plesk->terminateAccount($account->plesk_username);
        }

        $account->update([
            'status' => 'terminated',
            'ends_at' => $endsAt,
        ]);
        $account->user?->notify(new WebspaceDeactivatedNotification($account));
    }
}
