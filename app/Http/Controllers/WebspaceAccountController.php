<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Requests\RenewWebspaceAccountRequest;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\WebspaceAccount;
use App\Services\BalancePaymentService;
use App\Services\ControlPanels\PleskClient;
use App\Services\MollieCustomerService;
use App\Support\MollieWebhookUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Inertia\Response;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

class WebspaceAccountController extends Controller
{
    use \App\Http\Controllers\Concerns\RedirectsToMollieSubscriptionFirstPayment;

    /**
     * List current user's webspace accounts.
     */
    public function index(Request $request): Response
    {
        $accounts = $request->user()
            ->webspaceAccounts()
            ->with('hostingPlan')
            ->latest()
            ->get();

        return Inertia::render('webspace-accounts/Index', [
            'webspaceAccounts' => $accounts,
        ]);
    }

    /**
     * Show one webspace account (credentials, Plesk/Webmail links). Only owner.
     */
    public function show(Request $request, WebspaceAccount $webspaceAccount): Response|RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        $webspaceAccount->load('hostingPlan', 'hostingServer');

        $pleskPassword = null;
        if ($webspaceAccount->plesk_password_encrypted) {
            try {
                $pleskPassword = Crypt::decryptString($webspaceAccount->plesk_password_encrypted);
            } catch (\Throwable) {
                // ignore
            }
        }

        $resourceUsage = null;
        $server = $webspaceAccount->hostingServer;
        if ($server) {
            $plesk = app(PleskClient::class);
            $plesk->setServer($server);
            $usage = $plesk->getWebspaceResourceUsage($webspaceAccount->domain);
            $plan = $webspaceAccount->hostingPlan;
            if ($usage !== null && $plan) {
                $diskLimitBytes = $plan->disk_gb ? (int) ($plan->disk_gb * 1024 * 1024 * 1024) : 0;
                $resourceUsage = [
                    'disk_used_bytes' => $usage['disk_bytes'],
                    'disk_limit_bytes' => $diskLimitBytes,
                    'domains_used' => $usage['domains_used'],
                    'domains_limit' => (int) ($plan->domains ?? 1),
                    'subdomains_used' => $usage['subdomains_used'],
                    'subdomains_limit' => (int) ($plan->subdomains ?? 0),
                    'mailboxes_used' => $usage['mailboxes_used'],
                    'mailboxes_limit' => (int) ($plan->mailboxes ?? 0),
                    'databases_used' => $usage['databases_used'],
                    'databases_limit' => (int) ($plan->databases ?? 0),
                ];
            }
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $canRenew = $this->accountCanRenew($webspaceAccount);
        $renewalAmount = $canRenew && $webspaceAccount->hostingPlan
            ? (float) $webspaceAccount->hostingPlan->price
            : 0.0;
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance) {
            $balance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        $isSuspendedOrExpired = $webspaceAccount->isSuspendedOrExpired();

        return Inertia::render('webspace-accounts/Show', [
            'webspaceAccount' => $webspaceAccount,
            'pleskPassword' => $pleskPassword,
            'webmailUrl' => 'https://webmail.'.$webspaceAccount->domain,
            'resourceUsage' => $resourceUsage,
            'canRenew' => $canRenew,
            'renewalAmount' => $renewalAmount,
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'renewUrl' => route('webspace-accounts.renew', $webspaceAccount),
            'isSuspendedOrExpired' => $isSuspendedOrExpired,
            'auto_renew_with_balance' => (bool) $webspaceAccount->auto_renew_with_balance,
            'has_mollie_subscription' => ! empty($webspaceAccount->mollie_subscription_id),
        ]);
    }

    /**
     * Renew (extend) a prepaid webspace account: pay with balance or Mollie one-time.
     */
    public function renew(RenewWebspaceAccountRequest $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        if (! $this->accountCanRenew($webspaceAccount)) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Dieser Webspace kann nicht über diese Seite verlängert werden.');
        }

        $plan = $webspaceAccount->hostingPlan;
        $periodMonths = (int) $request->validated('period_months', 1);
        $amount = (float) $plan->price * $periodMonths;
        $user = $request->user();
        $paymentMethod = $request->validated('payment_method');

        if ($paymentMethod === 'balance') {
            $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
            $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
            if (! ($brandFeatures['prepaid_balance'] ?? false)) {
                return redirect()
                    ->route('webspace-accounts.show', $webspaceAccount)
                    ->with('error', 'Zahlung mit Guthaben ist für diese Marke nicht aktiviert.');
            }

            try {
                app(BalancePaymentService::class)->pay(
                    $user,
                    $amount,
                    'webspace_renewal',
                    'Webspace Verlängerung: '.$webspaceAccount->domain,
                    ['description' => 'Verlängerung Webspace '.$webspaceAccount->domain.' (ID '.$webspaceAccount->id.')']
                );
            } catch (InsufficientBalanceException $e) {
                return redirect()
                    ->route('webspace-accounts.show', $webspaceAccount)
                    ->with('error', $e->getMessage());
            }

            $from = $webspaceAccount->current_period_ends_at && $webspaceAccount->current_period_ends_at->isFuture()
                ? $webspaceAccount->current_period_ends_at
                : now();
            $wasSuspended = $webspaceAccount->status === 'suspended';
            $webspaceAccount->update([
                'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
                'status' => 'active',
            ]);
            if ($wasSuspended && $webspaceAccount->hostingServer) {
                try {
                    $plesk = app(PleskClient::class);
                    $plesk->setServer($webspaceAccount->hostingServer);
                    $plesk->unsuspendAccount($webspaceAccount->plesk_username);
                } catch (\Throwable) {
                    // status already active; Plesk unsuspend can be retried manually if needed
                }
            }

            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('success', 'Der Webspace wurde erfolgreich verlängert.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'Webspace Verlängerung: '.$webspaceAccount->domain.' ('.$periodMonths.' Monat(e))',
                'redirectUrl' => route('checkout.success'),
                'metadata' => [
                    'type' => 'webspace_renewal',
                    'webspace_account_id' => (string) $webspaceAccount->id,
                    'user_id' => (string) $user->id,
                    'period_months' => (string) $periodMonths,
                ],
            ];
            $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
            $webhookUrl = MollieWebhookUrl::get();
            if ($webhookUrl !== null) {
                $params['webhookUrl'] = $webhookUrl;
            }
            $payment = $mollie->payments->create($params);
            $request->session()->put('pending_mollie_payment_id', $payment->id);

            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()
                    ->route('webspace-accounts.show', $webspaceAccount)
                    ->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }

            return redirect()->away($checkoutUrl);
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es später erneut.');
        }
    }

    /**
     * Enable or disable auto-renew with balance for this prepaid webspace account.
     */
    public function setAutoRenewWithBalance(Request $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($brandFeatures['prepaid_balance'] ?? false)) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Auto Renew mit Guthaben ist für diese Marke nicht verfügbar.');
        }

        if (! $this->accountCanRenew($webspaceAccount)) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Dieser Webspace kann nicht für Auto Renew mit Guthaben eingerichtet werden.');
        }

        $enabled = $request->boolean('enabled', true);

        $webspaceAccount->update(['auto_renew_with_balance' => $enabled]);

        $message = $enabled
            ? 'Auto Renew mit Guthaben wurde aktiviert. Am letzten Tag vor Ablauf wird automatisch verlängert, wenn genug Guthaben vorhanden ist.'
            : 'Auto Renew mit Guthaben wurde deaktiviert.';

        return redirect()
            ->route('webspace-accounts.show', $webspaceAccount)
            ->with('success', $message);
    }

    /**
     * Create a Mollie subscription for automatic monthly renewal of this webspace account.
     */
    public function createMollieSubscription(Request $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        if (! $this->accountCanRenew($webspaceAccount)) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Dieser Webspace kann nicht für ein Mollie-Abo eingerichtet werden.');
        }

        $user = $request->user();
        try {
            $customerId = app(MollieCustomerService::class)->ensureCustomer($user);
            $user->refresh();
        } catch (MollieApiException $e) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Mollie-Kunde konnte nicht angelegt werden: '.$e->getMessage());
        }

        $plan = $webspaceAccount->hostingPlan;
        $amount = (float) $plan->price;
        if ($amount <= 0) {
            return redirect()
                ->route('webspace-accounts.show', $webspaceAccount)
                ->with('error', 'Kein gültiger Preis für dieses Paket.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $subscriptionParams = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'interval' => '1 month',
            'description' => 'Webspace Abo: '.$webspaceAccount->domain,
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
                'Webspace Abo: '.$webspaceAccount->domain,
                'webspace',
                $webspaceAccount->id,
                'webspace-accounts.show',
                [$webspaceAccount],
                'Dieser Webspace kann nicht für ein Mollie-Abo eingerichtet werden.'
            );
        }

        $webspaceAccount->update([
            'mollie_subscription_id' => $subscription->id,
            'renewal_type' => 'auto',
            'cancel_at_period_end' => false,
        ]);

        return redirect()
            ->route('webspace-accounts.show', $webspaceAccount)
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die Abbuchung erfolgt monatlich automatisch.');
    }

    protected function accountCanRenew(WebspaceAccount $account): bool
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

    /**
     * Cancel subscription at period end (Mollie). Only owner.
     */
    public function cancelSubscription(Request $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        if (! $webspaceAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem Webspace verknüpft.');
        }

        $user = $request->user();
        if (! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $webspaceAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
        }

        $webspaceAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'Ihr Webspace-Abo wurde zum Periodenende gekündigt.');
    }

    /**
     * Redirect to Plesk panel with session (create_session API).
     */
    public function pleskLogin(Request $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        if ($webspaceAccount->isSuspendedOrExpired()) {
            return redirect()->back()->with('error', 'Der Webspace ist gesperrt oder abgelaufen. Bitte verlängern Sie zuerst.');
        }

        $server = $webspaceAccount->hostingServer;
        if (! $server) {
            return redirect()->back()->with('error', 'Kein Hosting-Server zugeordnet.');
        }

        $plesk = app(PleskClient::class);
        $plesk->setServer($server);
        $clientIp = $request->ip() ?? '127.0.0.1';
        $token = $plesk->createCustomerSession($webspaceAccount->plesk_username, $clientIp);

        if (! $token) {
            return redirect()->back()->with('error', 'Plesk-Login konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.');
        }

        $protocol = ($server->use_ssl ?? true) ? 'https' : 'http';
        $port = $server->port !== null && (int) $server->port > 0 ? (int) $server->port : 8443;
        $url = $protocol.'://'.$server->hostname.':'.$port.'/enterprise/rsession_init.php?PHPSESSID='.urlencode($token);

        return redirect()->away($url);
    }
}
