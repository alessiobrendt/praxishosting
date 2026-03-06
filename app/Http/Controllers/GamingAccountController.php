<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Requests\RenewGamingAccountRequest;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\GameServerAccount;
use App\Services\BalancePaymentService;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\MollieCustomerService;
use App\Services\SyncHostingPlanStripePriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Checkout;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;
use RuntimeException;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Exception\InvalidRequestException;
use Stripe\StripeClient;

class GamingAccountController extends Controller
{
    use \App\Http\Controllers\Concerns\RedirectsToMollieSubscriptionFirstPayment;

    protected function ensureGamingFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];

        if (! ($features['gaming'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'Game-Server werden für diese Marke nicht angeboten.');
        }

        return null;
    }

    /**
     * List current user's game server accounts.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $accounts = $request->user()
            ->gameServerAccounts()
            ->with(['hostingPlan', 'hostingServer'])
            ->latest()
            ->get();

        $serverOverviews = [];
        $client = null;
        $maxOverview = 20;
        $count = 0;
        foreach ($accounts as $account) {
            if ($count >= $maxOverview) {
                break;
            }
            if (! $account->identifier || ! $account->hostingServer) {
                continue;
            }
            try {
                $client = $client ?? app(PterodactylClient::class);
                $overview = $client->getServerOverview($account);
                if ($overview !== null) {
                    $serverOverviews[(string) $account->id] = $overview;
                    $count++;
                }
            } catch (\Throwable) {
                continue;
            }
        }

        return Inertia::render('gaming-accounts/Index', [
            'gameServerAccounts' => $accounts,
            'serverOverviews' => $serverOverviews,
        ]);
    }

    /**
     * Show one game server account with login link. Only owner.
     */
    public function show(Request $request, GameServerAccount $gameServerAccount): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(404);
        }

        $gameServerAccount->load('hostingPlan', 'hostingServer');

        $config = $gameServerAccount->hostingServer?->config ?? [];
        $panelUrl = rtrim((string) ($config['base_uri'] ?? $config['host'] ?? ''), '/');
        $loginUrl = $panelUrl && $gameServerAccount->identifier
            ? $panelUrl.'/server/'.$gameServerAccount->identifier
            : null;

        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $canRenew = $this->accountCanRenew($gameServerAccount);
        $renewalAmount = $canRenew && $gameServerAccount->hostingPlan
            ? (float) $gameServerAccount->hostingPlan->price
            : 0.0;
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance) {
            $balance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        $isSuspendedOrExpired = $gameServerAccount->isSuspendedOrExpired();

        return Inertia::render('gaming-accounts/Show', [
            'gameServerAccount' => $gameServerAccount,
            'loginUrl' => $loginUrl,
            'userEmail' => $request->user()->email,
            'serverOverview' => $serverOverview,
            'canRenew' => $canRenew,
            'renewalAmount' => $renewalAmount,
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'renewUrl' => route('gaming-accounts.renew', $gameServerAccount),
            'isSuspendedOrExpired' => $isSuspendedOrExpired,
            'auto_renew_with_balance' => (bool) $gameServerAccount->auto_renew_with_balance,
            'has_mollie_subscription' => ! empty($gameServerAccount->mollie_subscription_id),
        ]);
    }

    /**
     * Send power action (start, stop, restart) to the game server. Only owner.
     */
    public function power(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(404);
        }

        if ($gameServerAccount->isSuspendedOrExpired()) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie zuerst.');
        }

        $action = $request->input('action', '');
        if (! in_array($action, ['start', 'stop', 'restart'], true)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Ungültige Aktion.');
        }

        try {
            $client = app(PterodactylClient::class);
            $client->sendPowerAction($gameServerAccount, $action);
        } catch (\Throwable $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Aktion fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Befehl gesendet.');
    }

    /**
     * Return current server overview (for live polling). Only owner.
     */
    public function overview(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            return response()->json(['error' => 'not found'], 404);
        }

        if ($gameServerAccount->isSuspendedOrExpired()) {
            return response()->json(['error' => 'suspended', 'serverOverview' => null], 403);
        }

        $gameServerAccount->load('hostingServer');
        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        return response()->json(['serverOverview' => $serverOverview]);
    }

    /**
     * Renew (extend) a prepaid game server: pay with balance or Stripe one-time.
     */
    public function renew(RenewGamingAccountRequest $request, GameServerAccount $gameServerAccount): RedirectResponse|Response
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht über diese Seite verlängert werden.');
        }

        $plan = $gameServerAccount->hostingPlan;
        $periodMonths = (int) $request->validated('period_months', 1);
        $amount = (float) $plan->price * $periodMonths;
        $user = $request->user();
        $paymentMethod = $request->validated('payment_method');

        if ($paymentMethod === 'balance') {
            $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
            $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
            if (! ($brandFeatures['prepaid_balance'] ?? false)) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', 'Zahlung mit Guthaben ist für diese Marke nicht aktiviert.');
            }

            try {
                app(BalancePaymentService::class)->pay(
                    $user,
                    $amount,
                    'game_server_renewal',
                    'Game-Server Verlängerung: '.$gameServerAccount->name,
                    ['description' => 'Verlängerung Game-Server '.$gameServerAccount->name.' (ID '.$gameServerAccount->id.')']
                );
            } catch (InsufficientBalanceException $e) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', $e->getMessage());
            }

            $from = $gameServerAccount->current_period_ends_at && $gameServerAccount->current_period_ends_at->isFuture()
                ? $gameServerAccount->current_period_ends_at
                : now();
            $wasSuspended = $gameServerAccount->status === 'suspended';
            $gameServerAccount->update([
                'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
                'status' => 'active',
            ]);
            if ($wasSuspended && $gameServerAccount->hostingServer && $gameServerAccount->pterodactyl_server_id) {
                try {
                    $client = app(PterodactylClient::class);
                    $client->unsuspendServer($gameServerAccount->fresh());
                } catch (\Throwable) {
                    // status already active; Pterodactyl unsuspend can be retried manually if needed
                }
            }

            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('success', 'Der Game-Server wurde erfolgreich verlängert.');
        }

        $priceId = $plan->stripe_price_id;
        if (! $priceId) {
            try {
                $priceId = app(SyncHostingPlanStripePriceService::class)->ensurePriceId($plan);
            } catch (RuntimeException $e) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', $e->getMessage());
            }
        }
        if (! $priceId) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Kein Stripe-Preis für dieses Paket. Bitte im Admin unter Hosting-Pläne einen Preis angeben.');
        }

        $metadata = [
            'type' => 'game_server_renewal',
            'game_server_account_id' => (string) $gameServerAccount->id,
            'user_id' => (string) $user->id,
            'period_months' => (string) $periodMonths,
        ];

        try {
            if ($periodMonths === 1) {
                $checkout = Checkout::customer($user)
                    ->allowPromotionCodes()
                    ->create($priceId, [
                        'mode' => StripeSession::MODE_PAYMENT,
                        'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
                        'cancel_url' => route('gaming-accounts.show', $gameServerAccount),
                        'metadata' => $metadata,
                    ]);

                return Inertia::location($checkout->redirect()->getTargetUrl());
            }

            $stripe = new StripeClient(config('cashier.secret'));
            $pricePerMonthCents = (int) round((float) $plan->price * 100);
            $params = [
                'mode' => StripeSession::MODE_PAYMENT,
                'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('gaming-accounts.show', $gameServerAccount),
                'metadata' => $metadata,
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => config('cashier.currency', 'eur'),
                            'unit_amount' => $pricePerMonthCents,
                            'product_data' => [
                                'name' => 'Game-Server Verlängerung',
                                'description' => $periodMonths.' Monat(e) – '.$gameServerAccount->name,
                            ],
                        ],
                        'quantity' => $periodMonths,
                    ],
                ],
            ];
            if ($user->mollie_customer_id) {
                $params['customer'] = $user->mollie_customer_id;
            } else {
                $params['customer_email'] = $user->email;
            }
            $session = $stripe->checkout->sessions->create($params);
            $url = $session->url ?? null;
            if (! $url || ! str_starts_with($url, 'https://')) {
                return redirect()
                    ->route('gaming-accounts.show', $gameServerAccount)
                    ->with('error', 'Stripe Checkout konnte nicht erstellt werden.');
            }

            return Inertia::location($url);
        } catch (InvalidRequestException $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Cancel subscription at period end (Mollie). Only owner.
     */
    public function cancelSubscription(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann das Abo kündigen.');
        }

        if (! $gameServerAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem Game-Server verknüpft.');
        }

        $user = $request->user();
        if (! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $gameServerAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
        }

        $gameServerAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'Ihr Game-Server-Abo wurde zum Periodenende gekündigt.');
    }

    /**
     * Enable or disable auto-renew with balance for this prepaid game server.
     */
    public function setAutoRenewWithBalance(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann Auto Renew verwalten.');
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['prepaid_balance'] ?? false)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Auto Renew mit Guthaben ist für diese Marke nicht verfügbar.');
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht für Auto Renew mit Guthaben eingerichtet werden.');
        }

        $enabled = $request->boolean('enabled', true);

        $gameServerAccount->update(['auto_renew_with_balance' => $enabled]);

        $message = $enabled
            ? 'Auto Renew mit Guthaben wurde aktiviert. Am letzten Tag vor Ablauf wird automatisch verlängert, wenn genug Guthaben vorhanden ist.'
            : 'Auto Renew mit Guthaben wurde deaktiviert.';

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', $message);
    }

    /**
     * Create a Mollie subscription for automatic monthly renewal of this game server.
     */
    public function createMollieSubscription(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(403, 'Nur der Besitzer kann ein Mollie-Abo einrichten.');
        }

        if (! $this->accountCanRenew($gameServerAccount)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Dieser Game-Server kann nicht für ein Mollie-Abo eingerichtet werden.');
        }

        $user = $request->user();
        try {
            $customerId = app(MollieCustomerService::class)->ensureCustomer($user);
            $user->refresh();
        } catch (MollieApiException $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Mollie-Kunde konnte nicht angelegt werden: '.$e->getMessage());
        }

        $plan = $gameServerAccount->hostingPlan;
        $amount = (float) $plan->price;
        if ($amount <= 0) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Kein gültiger Preis für dieses Paket.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $subscriptionParams = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'interval' => '1 month',
            'description' => 'Game-Server Abo: '.$gameServerAccount->name,
        ];

        try {
            $subscription = app(MollieApiClient::class)->subscriptions->createForId(
                $customerId,
                $subscriptionParams
            );
        } catch (MollieApiException $e) {
            return $this->redirectToMollieFirstPaymentForSubscription(
                $request,
                $user,
                $amount,
                $currency,
                'Game-Server Abo: '.$gameServerAccount->name,
                'gaming',
                $gameServerAccount->id,
                'gaming-accounts.show',
                [$gameServerAccount],
                'Dieser Game-Server kann nicht für ein Mollie-Abo eingerichtet werden.'
            );
        }

        $gameServerAccount->update([
            'mollie_subscription_id' => $subscription->id,
            'renewal_type' => 'auto',
            'cancel_at_period_end' => false,
        ]);

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die Abbuchung erfolgt monatlich automatisch.');
    }

    protected function accountCanRenew(GameServerAccount $account): bool
    {
        $renewalType = $account->renewal_type ?? 'manual';
        if ($renewalType !== 'manual' || $account->mollie_subscription_id !== null) {
            return false;
        }

        $plan = $account->hostingPlan;
        if (! $plan || ! $plan->is_active) {
            return false;
        }

        return $plan->price !== null && (float) $plan->price > 0;
    }

    protected function getBalancePeriodMonths(Request $request, \App\Models\User $user): int
    {
        $brand = $request->attributes->get('current_brand') ?? $user->brand ?? Brand::getDefault();
        $features = $brand?->getFeaturesArray() ?? [];

        return max(1, min(24, (int) ($features['balance_period_months'] ?? config('billing.balance_period_months', 1))));
    }
}
