<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use Stripe\Exception\ApiErrorException;

class SiteSubscriptionController extends Controller
{
    /**
     * Cancel the site's subscription at period end (user must own the site).
     */
    public function cancel(Request $request, Site $site): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($site->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer der Site kann das Abo kündigen.');
        }

        $site->load('siteSubscription');
        $subscription = $site->siteSubscription;

        if (! $subscription || ! $subscription->stripe_subscription_id) {
            return redirect()
                ->route('sites.show', $site)
                ->with('error', 'Kein Abo mit dieser Site verknüpft.');
        }

        try {
            Cashier::stripe()->subscriptions->update($subscription->stripe_subscription_id, [
                'cancel_at_period_end' => true,
            ]);
        } catch (ApiErrorException $e) {
            return redirect()
                ->route('sites.show', $site)
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
        }

        $subscription->update(['cancel_at_period_end' => true]);

        return redirect()
            ->route('sites.show', $site)
            ->with('success', 'Ihr Abo wurde zum Periodenende gekündigt.');
    }
}
