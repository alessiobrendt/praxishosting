<?php

namespace App\Http\Controllers\Concerns;

use App\Support\MollieWebhookUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

trait RedirectsToMollieSubscriptionFirstPayment
{
    /**
     * Create a Mollie first payment (sequenceType first) and redirect to Mollie checkout so the customer can set up a mandate.
     * After successful payment, CheckoutController creates the subscription and links it to the account.
     *
     * @param  array<int, mixed>  $showRouteParams
     */
    protected function redirectToMollieFirstPaymentForSubscription(
        Request $request,
        \App\Models\User $user,
        float $amount,
        string $currency,
        string $description,
        string $accountType,
        int $accountId,
        string $showRouteName,
        array $showRouteParams,
        string $errorMessage
    ): RedirectResponse {
        $mollie = app(MollieApiClient::class);
        $params = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'description' => $description,
            'redirectUrl' => route('checkout.success'),
            'metadata' => [
                'type' => 'mollie_subscription_first',
                'account_type' => $accountType,
                'account_id' => (string) $accountId,
                'user_id' => (string) $user->id,
            ],
            'customerId' => $user->mollie_customer_id,
            'sequenceType' => 'first',
        ];
        $webhookUrl = MollieWebhookUrl::get();
        if ($webhookUrl !== null) {
            $params['webhookUrl'] = $webhookUrl;
        }
        try {
            $payment = $mollie->payments->create($params);
        } catch (MollieApiException $e) {
            return redirect()->route($showRouteName, $showRouteParams)
                ->with('error', 'Weiterleitung zu Mollie fehlgeschlagen: '.$e->getMessage());
        }
        $checkoutUrl = $payment->getCheckoutUrl();
        if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
            return redirect()->route($showRouteName, $showRouteParams)
                ->with('error', $errorMessage);
        }
        $request->session()->put('pending_mollie_payment_id', $payment->id);

        return redirect()->away($checkoutUrl);
    }
}
