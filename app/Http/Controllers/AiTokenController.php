<?php

namespace App\Http\Controllers;

use App\Http\Requests\AiTokenCheckoutRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Laravel\Cashier\Checkout;
use Stripe\Checkout\Session as StripeSession;

class AiTokenController extends Controller
{
    public function checkout(AiTokenCheckoutRequest $request): Response|RedirectResponse
    {
        $user = $request->user();
        $tokenAmount = (int) $request->validated('token_amount');

        $priceId = config("billing.ai_token_packages.{$tokenAmount}");
        if (! $priceId) {
            return redirect()
                ->route('billing.index')
                ->with('error', 'Dieses AI-Token-Paket ist derzeit nicht verfügbar.');
        }

        try {
            $checkout = Checkout::customer($user)
                ->allowPromotionCodes()
                ->create($priceId, [
                    'mode' => StripeSession::MODE_PAYMENT,
                    'success_url' => route('billing.index').'?ai_tokens=success',
                    'cancel_url' => route('billing.index').'?ai_tokens=cancelled',
                    'metadata' => [
                        'ai_token_purchase' => '1',
                        'user_id' => (string) $user->id,
                        'token_amount' => (string) $tokenAmount,
                    ],
                ]);

            return Inertia::location($checkout->url);
        } catch (\Throwable $e) {
            Log::error('AI token checkout failed', [
                'user_id' => $user->id,
                'token_amount' => $tokenAmount,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('billing.index')
                ->with('error', 'Checkout konnte nicht gestartet werden. Bitte später erneut versuchen.');
        }
    }
}
