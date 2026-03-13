<?php

namespace App\Http\Controllers;

use App\Models\BalanceTransaction;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\GameServerAccount;
use App\Models\TeamSpeakServerAccount;
use App\Models\WebspaceAccount;
use App\Services\AiTokenService;
use App\Services\MollieCustomerService;
use App\Support\MollieWebhookUrl;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Mollie\Api\MollieApiClient;

class BillingController extends Controller
{
    public function index(Request $request, AiTokenService $aiTokenService): Response
    {
        $user = $request->user();

        $packages = config('billing.ai_token_packages', []);
        $aiTokenPackages = [];
        foreach ($packages as $amount => $priceEur) {
            if ($priceEur !== null && $priceEur !== '') {
                $eur = (float) $priceEur;
                $aiTokenPackages[] = [
                    'amount' => $amount,
                    'label' => number_format($amount, 0, ',', '.').' Tokens ('.number_format($eur, 2, ',', '.').' €)',
                ];
            }
        }

        $invoices = $user->invoices()
            ->latest('invoice_date')
            ->limit(50)
            ->get(['uuid', 'number', 'amount', 'status', 'invoice_date', 'pdf_path', 'invoice_xml_path'])
            ->map(fn ($inv) => array_merge($inv->toArray(), [
                'invoice_date' => $inv->invoice_date ? Carbon::parse($inv->invoice_date)->format('d.m.Y') : null,
            ]));

        $paymentMethodSummary = null;
        if ($user->hasMollieCustomerId()) {
            $paymentMethodSummary = [
                'brand' => 'mollie',
                'last4' => null,
            ];
        }

        $payload = [
            'invoices' => $invoices,
            'billingPortalUrl' => route('billing.portal'),
            'paymentMethodSummary' => $paymentMethodSummary,
        ];

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];

        if ($brandFeatures['ai_tokens'] ?? true) {
            $payload['aiTokensEnabled'] = true;
            $payload['aiTokenBalance'] = $aiTokenService->getBalance($user);
            $payload['aiTokenPackages'] = $aiTokenPackages;
        } else {
            $payload['aiTokensEnabled'] = false;
            $payload['aiTokenBalance'] = 0;
            $payload['aiTokenPackages'] = [];
        }

        if ($brandFeatures['prepaid_balance'] ?? false) {
            $customerBalance = CustomerBalance::where('user_id', $user->id)->first();
            $payload['prepaidEnabled'] = true;
            $payload['customerBalance'] = $customerBalance ? (float) $customerBalance->balance : 0.0;
            $payload['balanceTransactions'] = BalanceTransaction::where('user_id', $user->id)
                ->latest()
                ->limit(20)
                ->get(['id', 'amount', 'type', 'description', 'created_at'])
                ->map(fn (BalanceTransaction $tx) => [
                    'id' => $tx->id,
                    'amount' => (float) $tx->amount,
                    'type' => $tx->type,
                    'description' => $tx->description,
                    'created_at' => $tx->created_at->format('d.m.Y H:i'),
                ])
                ->values()
                ->all();
        }

        if ($brandFeatures['balance_topup'] ?? false) {
            $payload['balanceTopUpEnabled'] = true;
            $payload['balanceTopUpMinAmount'] = (float) config('billing.balance_topup_min_amount', 5);
            $payload['balanceCheckoutUrl'] = route('billing.balance.checkout');
        }

        return Inertia::render('billing/Index', $payload);
    }

    /**
     * Abo-Verwaltung: Liste aller Abos (Game-Server + Webspace) mit Mollie-Subscription, Kündigung zum Periodenende.
     */
    public function subscriptions(Request $request): Response
    {
        $user = $request->user();

        $gameServerSubscriptions = GameServerAccount::where('user_id', $user->id)
            ->whereNotNull('mollie_subscription_id')
            ->with('hostingPlan')
            ->get()
            ->map(fn (GameServerAccount $a) => [
                'id' => $a->id,
                'type' => 'gaming',
                'name' => $a->name,
                'plan_name' => $a->hostingPlan?->name,
                'current_period_ends_at' => $a->current_period_ends_at?->toIso8601String(),
                'cancel_at_period_end' => (bool) $a->cancel_at_period_end,
                'show_url' => route('gaming-accounts.show', $a),
                'cancel_url' => route('gaming-accounts.subscription.cancel', $a),
            ])
            ->values()
            ->all();

        $webspaceSubscriptions = WebspaceAccount::where('user_id', $user->id)
            ->whereNotNull('mollie_subscription_id')
            ->with('hostingPlan')
            ->get()
            ->map(fn (WebspaceAccount $a) => [
                'id' => $a->id,
                'type' => 'webspace',
                'name' => $a->domain,
                'plan_name' => $a->hostingPlan?->name,
                'current_period_ends_at' => $a->current_period_ends_at?->toIso8601String(),
                'cancel_at_period_end' => (bool) $a->cancel_at_period_end,
                'show_url' => route('webspace-accounts.show', $a),
                'cancel_url' => route('webspace-accounts.subscription.cancel', $a),
            ])
            ->values()
            ->all();

        $teamSpeakSubscriptions = TeamSpeakServerAccount::where('user_id', $user->id)
            ->whereNotNull('mollie_subscription_id')
            ->with('hostingPlan')
            ->get()
            ->map(fn (TeamSpeakServerAccount $a) => [
                'id' => $a->id,
                'type' => 'teamspeak',
                'name' => $a->name,
                'plan_name' => $a->hostingPlan?->name,
                'current_period_ends_at' => $a->current_period_ends_at?->toIso8601String(),
                'cancel_at_period_end' => (bool) $a->cancel_at_period_end,
                'show_url' => route('teamspeak-accounts.show', $a),
                'cancel_url' => route('teamspeak-accounts.subscription.cancel', $a),
            ])
            ->values()
            ->all();

        return Inertia::render('billing/Subscriptions', [
            'gameServerSubscriptions' => $gameServerSubscriptions,
            'webspaceSubscriptions' => $webspaceSubscriptions,
            'teamSpeakSubscriptions' => $teamSpeakSubscriptions,
        ]);
    }

    public function balanceCheckout(\App\Http\Requests\BalanceCheckoutRequest $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response
    {
        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['balance_topup'] ?? false)) {
            return redirect()->route('billing.index')->with('error', 'Guthaben-Aufladung ist für diese Marke nicht aktiviert.');
        }

        $user = $request->user();
        $amount = (float) $request->validated('amount');
        $amountCents = (int) round($amount * 100);

        try {
            $mollie = app(MollieApiClient::class);
            $currency = strtoupper(config('cashier.currency', 'eur'));
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'Guthaben aufladen: '.number_format($amount, 2, ',', '.').' €',
                'redirectUrl' => route('billing.index').'?balance=success',
                'metadata' => [
                    'balance_topup' => '1',
                    'user_id' => (string) $user->id,
                    'amount_eur' => (string) $amount,
                ],
            ];
            $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
            $webhookUrl = MollieWebhookUrl::get();
            if ($webhookUrl !== null) {
                $params['webhookUrl'] = $webhookUrl;
            }
            $method = $request->validated('method');
            if (is_string($method) && $method !== '') {
                $params['method'] = $method;
            }
            $payment = $mollie->payments->create($params);
            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()->route('billing.index')->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }

            return Inertia::location($checkoutUrl);
        } catch (\Throwable $e) {
            Log::error('Billing Guthaben-Checkout: Mollie-Fehler', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            report($e);
            $message = 'Checkout konnte nicht gestartet werden.';
            if (str_contains($e->getMessage(), 'API key') || str_contains($e->getMessage(), 'Invalid API key')) {
                $message = 'Mollie API-Key fehlt oder ist ungültig. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen).';
            } elseif (str_contains($e->getMessage(), 'webhook') && str_contains($e->getMessage(), 'unreachable')) {
                $message = 'Mollie konnte die Webhook-URL nicht erreichen. Lokal: APP_URL nutzt .test/localhost – entweder MOLLIE_WEBHOOK_URL (ngrok-URL) setzen oder die Anwendung wurde angepasst, sodass der Webhook lokal weggelassen wird. Bitte Seite neu laden und erneut versuchen.';
            } elseif (config('app.debug')) {
                $message .= ' '.$e->getMessage();
            } else {
                $message .= ' Details in storage/logs/laravel.log.';
            }

            return redirect()->route('billing.index')->with('error', $message);
        }
    }
}
