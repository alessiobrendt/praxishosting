<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Stripe\Exception\ApiErrorException;

class BillingPortalController extends Controller
{
    /**
     * Redirect the user to Stripe Customer Billing Portal (payment method, invoices, subscription).
     */
    public function redirect(Request $request): RedirectResponse
    {
        $user = $request->user();
        $returnUrl = route('billing.index');

        if (! $user->hasStripeId()) {
            return redirect()
                ->to($returnUrl)
                ->with('info', 'Sie haben noch keine Zahlungsmethode hinterlegt. Diese wird beim ersten Abo-Abschluss angelegt.');
        }

        try {
            return $user->redirectToBillingPortal($returnUrl);
        } catch (ApiErrorException $e) {
            return redirect()
                ->to($returnUrl)
                ->with('error', 'Stripe Billing Portal ist derzeit nicht erreichbar. Bitte versuchen Sie es später erneut.');
        }
    }
}
