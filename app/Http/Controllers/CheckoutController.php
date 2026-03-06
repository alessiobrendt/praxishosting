<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Models\Invoice;
use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\TeamSpeakServerAccount;
use App\Models\Template;
use App\Models\WebspaceAccount;
use App\Notifications\OrderCompletedNotification;
use App\Notifications\WebspaceOrderCompletedNotification;
use App\Services\ControlPanels\PleskClient;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\ControlPanels\TeamSpeakClient;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use App\Services\MollieCustomerService;
use App\Support\MollieWebhookUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Mollie\Api\MollieApiClient;

class CheckoutController extends Controller
{
    /**
     * Redirect to Stripe Checkout using session data (meine_seiten or webspace).
     */
    public function redirect(Request $request): RedirectResponse|Response
    {
        $webspacePayload = $request->session()->get('checkout_webspace');
        if ($webspacePayload && isset($webspacePayload['hosting_plan_id'], $webspacePayload['domain'])) {
            return $this->buildWebspaceCheckoutRedirect($request, $webspacePayload);
        }

        $gamingPayload = $request->session()->get('checkout_gaming');
        if ($gamingPayload && isset($gamingPayload['hosting_plan_id'], $gamingPayload['user_id'])) {
            return $this->buildGamingCheckoutRedirect($request, $gamingPayload);
        }

        $teamspeakPayload = $request->session()->get('checkout_teamspeak');
        if ($teamspeakPayload && isset($teamspeakPayload['hosting_plan_id'], $teamspeakPayload['user_id'])) {
            return $this->buildTeamSpeakCheckoutRedirect($request, $teamspeakPayload);
        }

        $payload = $request->session()->get('checkout_meine_seiten');
        if (! $payload || ! isset($payload['template_id'], $payload['name'])) {
            return redirect()->route('sites.create')->with('error', 'Bitte starten Sie die Bestellung erneut.');
        }

        if (! $this->isMollieConfigured()) {
            return redirect()->route('sites.create')->with('error', 'Mollie ist nicht konfiguriert. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen).');
        }

        $user = $request->user();
        $template = Template::find($payload['template_id']);
        if (! $template) {
            $request->session()->forget('checkout_meine_seiten');

            return redirect()->route('sites.create')->with('error', 'Template nicht gefunden.');
        }

        $amount = $template->price !== null ? (float) $template->price : null;
        if ($amount === null || $amount <= 0) {
            $request->session()->forget('checkout_meine_seiten');

            return redirect()
                ->route('sites.create', ['template' => $template->id])
                ->with('error', 'Dieses Template hat keinen monatlichen Preis. Im Admin unter Templates den Preis eintragen.');
        }

        $siteName = $payload['name'];
        $currency = strtoupper(config('cashier.currency', 'eur'));

        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'Meine Seiten: '.$siteName,
                'redirectUrl' => route('checkout.success'),
                'metadata' => [
                    'type' => 'meine_seiten',
                    'template_id' => (string) $template->id,
                    'site_name' => $siteName,
                    'user_id' => (string) $user->id,
                ],
            ];
            $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
            $webhookUrl = MollieWebhookUrl::get();
            if ($webhookUrl !== null) {
                $params['webhookUrl'] = $webhookUrl;
            }
            $payment = $mollie->payments->create($params);
            $request->session()->put('pending_mollie_payment_id', $payment->id);
            $request->session()->forget('checkout_meine_seiten');

            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()->route('sites.create')->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }

            return Inertia::location($checkoutUrl);
        } catch (\Throwable $e) {
            $request->session()->forget('checkout_meine_seiten');
            Log::error('Checkout Meine Seiten: Mollie-Fehler', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            report($e);

            return redirect()
                ->route('sites.create', ['template' => $template->id])
                ->with('error', $this->getCheckoutErrorMessage($e));
        }
    }

    /**
     * Create a Stripe Checkout session for "Meine Seiten" subscription (direct POST from form).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:templates,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $request->session()->put('checkout_meine_seiten', [
            'template_id' => $validated['template_id'],
            'name' => $validated['name'],
        ]);

        return redirect()->route('checkout.redirect');
    }

    /**
     * Show a page that immediately redirects the browser to the Stripe Checkout URL.
     * URL is read from session (set by buildWebspaceCheckoutRedirect) and then forgotten.
     * Fallback so external redirect works even when Inertia 409 is not handled.
     */
    public function redirectToStripe(Request $request): RedirectResponse|Response|InertiaResponse
    {
        $url = $request->session()->pull('stripe_checkout_redirect_url') ?? $request->session()->pull('mollie_checkout_redirect_url');
        if (! $url || ! str_starts_with($url, 'https://')) {
            return redirect()->route('webspace.index')->with('error', 'Weiterleitung zur Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }

        return Inertia::render('checkout/RedirectToStripe', [
            'redirectUrl' => $url,
        ]);
    }

    /**
     * Handle successful checkout: create Site, Domain, SiteSubscription from session.
     * This runs when the customer is redirected back from Stripe (success_url).
     * No webhook is required for the initial purchase; webhooks are only used for
     * subscription updates (renewal, cancel) in production.
     */
    public function success(Request $request): RedirectResponse
    {
        $paymentId = $request->query('payment_id') ?? $request->session()->pull('pending_mollie_payment_id');
        $sessionId = $request->query('session_id');
        Log::debug('Checkout success: start', ['payment_id' => $paymentId, 'session_id' => $sessionId]);

        $user = $request->user();
        if (! $user) {
            return redirect()->route('login')->with('error', 'Bitte melden Sie sich an.');
        }

        if ($paymentId) {
            try {
                $payment = app(MollieApiClient::class)->payments->get($paymentId);
            } catch (\Throwable $e) {
                Log::error('Checkout success: Mollie payment retrieve failed', ['payment_id' => $paymentId, 'message' => $e->getMessage()]);

                return redirect()->route('sites.index')->with('error', 'Zahlung konnte nicht geladen werden.');
            }
            if ($payment->status !== 'paid') {
                return redirect()->route('sites.index')->with('info', 'Die Zahlung ist noch nicht bestätigt. Bei Fragen kontaktieren Sie uns.');
            }
            $metadata = $payment->metadata ? (array) $payment->metadata : [];
            $metadata['mollie_payment_id'] = $payment->id;
            $type = $metadata['type'] ?? '';
            if ($type === 'invoice_payment') {
                return $this->handleInvoicePaymentSuccess($request, $user, $metadata);
            }
            if ($type === 'game_server_renewal') {
                return $this->handleGamingRenewalSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'meine_seiten') {
                return $this->handleMeineSeitenSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'webspace') {
                return $this->handleWebspaceCheckoutSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'game_server') {
                return $this->handleGamingCheckoutSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'teamspeak') {
                return $this->handleTeamSpeakCheckoutSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'teamspeak_renewal') {
                return $this->handleTeamSpeakRenewalSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'webspace_renewal') {
                return $this->handleWebspaceRenewalSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'mollie_subscription_first') {
                return $this->handleMollieSubscriptionFirstSuccessFromMollie($request, $user, $metadata);
            }
            if ($type === 'domain') {
                return $this->handleDomainCheckoutSuccessFromMollie($request, $user, $metadata);
            }

            return redirect()->route('sites.index')->with('success', 'Zahlung erhalten. Vielen Dank.');
        }

        if ($sessionId) {
            return redirect()->route('sites.index')->with('info', 'Diese Checkout-Rückkehr (Stripe) wird nicht mehr unterstützt. Bitte nutzen Sie den Mollie-Checkout.');
        }

        return redirect()->route('sites.index')->with('error', 'Keine Zahlungsinformationen gefunden.');
    }

    /**
     * Create local Invoice from subscription (legacy; Mollie flow uses one-off payments, invoices created separately if needed).
     */
    protected function createInvoiceFromSubscription(\App\Models\User $user, SiteSubscription $siteSubscription, mixed $subscription): void
    {
        // No-op: Mollie one-off payments do not use this; invoice creation handled elsewhere if required.
    }

    /**
     * Build Mollie Checkout for webspace and return redirect/location response.
     * Public so WebspaceController can call it directly after storing session (avoids Inertia losing the redirect).
     */
    public function buildWebspaceCheckoutRedirect(Request $request, array $payload): RedirectResponse|Response
    {
        if (! $this->isMollieConfigured()) {
            $request->session()->forget('checkout_webspace');

            return redirect()->route('webspace.index')->with('error', 'Mollie ist nicht konfiguriert. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen).');
        }

        $user = $request->user();
        $plan = HostingPlan::find($payload['hosting_plan_id'] ?? 0);
        if (! $plan || ! $plan->is_active) {
            $request->session()->forget('checkout_webspace');

            return redirect()->route('webspace.index')->with('error', 'Paket nicht gefunden oder inaktiv.');
        }

        $amount = isset($payload['total_amount']) ? (float) $payload['total_amount'] : ($plan->price !== null ? (float) $plan->price : null);
        if ($amount === null || $amount <= 0) {
            $request->session()->forget('checkout_webspace');

            return redirect()->route('webspace.checkout', ['plan' => $plan->id])
                ->with('error', 'Kein Preis für dieses Paket. Bitte im Admin unter Webspace-Pakete einen monatlichen Preis angeben.');
        }

        $domain = $payload['domain'] ?? '';
        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? 1)));
        $currency = strtoupper(config('cashier.currency', 'eur'));
        $currentBrand = $request->attributes->get('current_brand') ?? \App\Models\Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $isPrepaid = (bool) ($brandFeatures['prepaid_balance'] ?? false);

        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'Webspace: '.$domain.' ('.$periodMonths.' Monat(e))',
                'redirectUrl' => route('checkout.success'),
                'metadata' => [
                    'type' => 'webspace',
                    'hosting_plan_id' => (string) $plan->id,
                    'domain' => $domain,
                    'user_id' => (string) $user->id,
                    'prepaid' => $isPrepaid ? '1' : '0',
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
            $request->session()->forget('checkout_webspace');

            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()->route('webspace.checkout', ['plan' => $plan->id])
                    ->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }
            $request->session()->put('mollie_checkout_redirect_url', $checkoutUrl);

            return redirect()->route('checkout.redirect-to-mollie');
        } catch (\Throwable $e) {
            $request->session()->forget('checkout_webspace');
            Log::error('Checkout Webspace: Mollie-Fehler', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            report($e);

            return redirect()->route('webspace.checkout', ['plan' => $plan->id])
                ->with('error', $this->getCheckoutErrorMessage($e));
        }
    }

    /**
     * Build Mollie Checkout for game server and return redirect.
     */
    public function buildGamingCheckoutRedirect(Request $request, array $payload): RedirectResponse|Response
    {
        if (! $this->isMollieConfigured()) {
            $request->session()->forget('checkout_gaming');

            return redirect()->route('gaming.index')->with('error', 'Mollie ist nicht konfiguriert. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen).');
        }

        $user = $request->user();
        $plan = HostingPlan::find($payload['hosting_plan_id'] ?? 0);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'pterodactyl') {
            $request->session()->forget('checkout_gaming');

            return redirect()->route('gaming.index')->with('error', 'Paket nicht gefunden oder inaktiv.');
        }

        $amount = (float) ($payload['total_amount'] ?? 0);
        if ($amount <= 0) {
            $optionSurcharge = (float) ($payload['option_surcharge'] ?? 0);
            $basePrice = $plan->price !== null ? (float) $plan->price : 0;
            $amount = round(($basePrice + $optionSurcharge) * max(1, min(6, (int) ($payload['period_months'] ?? 1))), 2);
        }
        if ($amount <= 0) {
            $request->session()->forget('checkout_gaming');

            return redirect()->route('gaming.checkout', ['plan' => $plan->id])
                ->with('error', 'Kein Preis für dieses Paket. Bitte im Admin unter Hosting-Pläne einen Preis angeben.');
        }

        $serverName = $payload['server_name'] ?? $plan->name.' #'.($user->gameServerAccounts()->count() + 1);
        $optionChoices = $payload['option_choices'] ?? [];
        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? 1)));
        $metadata = [
            'type' => 'game_server',
            'hosting_plan_id' => (string) $plan->id,
            'user_id' => (string) $user->id,
            'server_name' => $serverName,
            'period_months' => (string) $periodMonths,
        ];
        if (! empty($optionChoices)) {
            $metadata['option_choices'] = json_encode($optionChoices);
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));

        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'Game-Server: '.$serverName,
                'redirectUrl' => route('checkout.success'),
                'metadata' => $metadata,
            ];
            $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
            $webhookUrl = MollieWebhookUrl::get();
            if ($webhookUrl !== null) {
                $params['webhookUrl'] = $webhookUrl;
            }
            $payment = $mollie->payments->create($params);
            $request->session()->put('pending_mollie_payment_id', $payment->id);
            $request->session()->forget('checkout_gaming');

            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()->route('gaming.checkout', ['plan' => $plan->id])
                    ->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }
            $request->session()->put('mollie_checkout_redirect_url', $checkoutUrl);

            return redirect()->route('checkout.redirect-to-mollie');
        } catch (\Throwable $e) {
            $request->session()->forget('checkout_gaming');
            Log::error('Checkout Gaming: Mollie-Fehler', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            report($e);

            return redirect()->route('gaming.checkout', ['plan' => $plan->id])
                ->with('error', $this->getCheckoutErrorMessage($e));
        }
    }

    /**
     * Build Mollie Checkout for TeamSpeak server and return redirect.
     */
    public function buildTeamSpeakCheckoutRedirect(Request $request, array $payload): RedirectResponse|InertiaResponse
    {
        if (! $this->isMollieConfigured()) {
            $request->session()->forget('checkout_teamspeak');

            return redirect()->route('teamspeak.index')->with('error', 'Mollie ist nicht konfiguriert. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen).');
        }

        $user = $request->user();
        $plan = HostingPlan::find($payload['hosting_plan_id'] ?? 0);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'teamspeak') {
            $request->session()->forget('checkout_teamspeak');

            return redirect()->route('teamspeak.index')->with('error', 'Paket nicht gefunden oder inaktiv.');
        }

        $amount = (float) ($payload['total_amount'] ?? 0);
        if ($amount <= 0) {
            $optionSurcharge = (float) ($payload['option_surcharge'] ?? 0);
            $basePrice = $plan->price !== null ? (float) $plan->price : 0;
            $amount = round(($basePrice + $optionSurcharge) * max(1, min(6, (int) ($payload['period_months'] ?? 1))), 2);
        }
        if ($amount <= 0) {
            $request->session()->forget('checkout_teamspeak');

            return redirect()->route('teamspeak.checkout', ['plan' => $plan->id])
                ->with('error', 'Kein Preis für dieses Paket. Bitte im Admin unter Hosting-Pläne einen Preis angeben.');
        }

        $serverName = $payload['server_name'] ?? $plan->name.' #'.($user->teamSpeakServerAccounts()->count() + 1);
        $optionChoices = $payload['option_choices'] ?? [];
        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? 1)));
        $metadata = [
            'type' => 'teamspeak',
            'period_months' => (string) $periodMonths,
            'hosting_plan_id' => (string) $plan->id,
            'user_id' => (string) $user->id,
            'server_name' => $serverName,
        ];
        if (! empty($optionChoices)) {
            $metadata['option_choices'] = json_encode($optionChoices);
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));

        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'TeamSpeak-Server: '.$serverName,
                'redirectUrl' => route('checkout.success'),
                'metadata' => $metadata,
            ];
            $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
            $webhookUrl = MollieWebhookUrl::get();
            if ($webhookUrl !== null) {
                $params['webhookUrl'] = $webhookUrl;
            }
            $payment = $mollie->payments->create($params);
            $request->session()->put('pending_mollie_payment_id', $payment->id);
            $request->session()->forget('checkout_teamspeak');

            $checkoutUrl = $payment->getCheckoutUrl();
            if (! $checkoutUrl || ! str_starts_with($checkoutUrl, 'https://')) {
                return redirect()->route('teamspeak.checkout', ['plan' => $plan->id])
                    ->with('error', 'Mollie Checkout lieferte keine gültige Weiterleitungs-URL.');
            }
            $request->session()->put('mollie_checkout_redirect_url', $checkoutUrl);

            return redirect()->route('checkout.redirect-to-mollie');
        } catch (\Throwable $e) {
            $request->session()->forget('checkout_teamspeak');
            Log::error('Checkout TeamSpeak: Mollie-Fehler', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            report($e);

            return redirect()->route('teamspeak.checkout', ['plan' => $plan->id])
                ->with('error', $this->getCheckoutErrorMessage($e));
        }
    }

    /**
     * Handle successful Mollie one-time payment for game server renewal.
     */
    protected function handleGamingRenewalSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $accountId = (int) ($metadata['game_server_account_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);

        if ($userId !== $user->id || $accountId < 1) {
            Log::debug('Checkout success gaming renewal: invalid metadata');

            return redirect()->route('gaming-accounts.index')->with('error', 'Ungültige Zahlungsdaten.');
        }

        $account = GameServerAccount::find($accountId);
        if (! $account || $account->user_id !== $user->id) {
            return redirect()->route('gaming-accounts.index')->with('error', 'Game-Server nicht gefunden.');
        }

        $periodMonths = max(1, min(12, (int) ($metadata['period_months'] ?? 1)));
        $from = $account->current_period_ends_at && $account->current_period_ends_at->isFuture()
            ? $account->current_period_ends_at
            : now();
        $wasSuspended = $account->status === 'suspended';
        $account->update([
            'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
            'status' => 'active',
        ]);
        if ($wasSuspended && $account->hostingServer && $account->pterodactyl_server_id) {
            try {
                $client = app(\App\Services\ControlPanels\PterodactylClient::class);
                $client->unsuspendServer($account->fresh());
            } catch (\Throwable) {
                // status already active
            }
        }

        return redirect()
            ->route('gaming-accounts.show', $account)
            ->with('success', 'Der Game-Server wurde erfolgreich verlängert.');
    }

    /**
     * Handle successful Mollie one-time payment for webspace renewal.
     */
    protected function handleWebspaceRenewalSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $accountId = (int) ($metadata['webspace_account_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);

        if ($userId !== $user->id || $accountId < 1) {
            Log::debug('Checkout success webspace renewal: invalid metadata');

            return redirect()->route('webspace-accounts.index')->with('error', 'Ungültige Zahlungsdaten.');
        }

        $account = WebspaceAccount::find($accountId);
        if (! $account || $account->user_id !== $user->id) {
            return redirect()->route('webspace-accounts.index')->with('error', 'Webspace nicht gefunden.');
        }

        $periodMonths = max(1, min(3, (int) ($metadata['period_months'] ?? 1)));
        $from = $account->current_period_ends_at && $account->current_period_ends_at->isFuture()
            ? $account->current_period_ends_at
            : now();
        $wasSuspended = $account->status === 'suspended';
        $account->update([
            'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
            'status' => 'active',
        ]);
        if ($wasSuspended && $account->hostingServer) {
            try {
                $plesk = app(\App\Services\ControlPanels\PleskClient::class);
                $plesk->setServer($account->hostingServer);
                $plesk->unsuspendAccount($account->plesk_username);
            } catch (\Throwable) {
                // status already active
            }
        }

        return redirect()
            ->route('webspace-accounts.show', $account)
            ->with('success', 'Der Webspace wurde erfolgreich verlängert.');
    }

    /**
     * Handle successful Stripe one-time payment for game server renewal (legacy).
     */
    protected function handleGamingRenewalSuccess(Request $request, \App\Models\User $user, $session, array $metadata): RedirectResponse
    {
        return $this->handleGamingRenewalSuccessFromMollie($request, $user, $metadata);
    }

    /**
     * Handle successful Mollie payment for "Meine Seiten": create Site, Domain, SiteSubscription.
     */
    protected function handleMeineSeitenSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $templateId = (int) ($metadata['template_id'] ?? 0);
        $siteName = $metadata['site_name'] ?? 'Meine Webseite';
        $userId = (int) ($metadata['user_id'] ?? 0);
        $molliePaymentId = $metadata['mollie_payment_id'] ?? null;

        if ($userId !== $user->id || $templateId < 1) {
            Log::debug('Checkout success meine_seiten: invalid metadata');

            return redirect()->route('sites.index')->with('error', 'Ungültige Abo-Daten.');
        }

        $existing = SiteSubscription::where('mollie_subscription_id', $molliePaymentId)->first();
        if ($existing) {
            return redirect()->route('sites.show', ['site' => $existing->site->uuid]);
        }

        $template = Template::find($templateId);
        if (! $template) {
            return redirect()->route('sites.index')->with('error', 'Template nicht gefunden.');
        }

        try {
            $slug = Str::slug($siteName).'-'.Str::random(6);
            $baseDomain = \App\Models\Setting::getBaseDomain();
            $subdomain = $slug.'.'.$baseDomain;

            $site = $user->sites()->create([
                'template_id' => $template->id,
                'name' => $siteName,
                'slug' => $slug,
                'domain_type' => 'subdomain',
                'status' => 'active',
                'is_legacy' => false,
            ]);

            $site->domains()->create([
                'domain' => $subdomain,
                'type' => 'subdomain',
                'is_primary' => true,
                'is_verified' => true,
            ]);

            $periodEnd = now()->addMonth();
            $site->siteSubscription()->create([
                'mollie_subscription_id' => $molliePaymentId,
                'mollie_status' => 'active',
                'current_period_ends_at' => $periodEnd,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'auto',
            ]);

            Log::debug('Checkout success: site and subscription created (Mollie)', ['site_id' => $site->id]);
            $user->notify(new OrderCompletedNotification($site));

            return redirect()
                ->route('sites.show', ['site' => $site->uuid])
                ->with('success', 'Ihre Webseite wurde erfolgreich eingerichtet.');
        } catch (\Throwable $e) {
            Log::error('Checkout success: exception during site creation (Mollie)', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('sites.index')->with('error', 'Fehler beim Anlegen der Webseite: '.$e->getMessage());
        }
    }

    /**
     * Handle successful Stripe one-time payment for an existing invoice.
     */
    protected function handleInvoicePaymentSuccess(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $invoiceId = (int) ($metadata['invoice_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);

        if ($userId !== $user->id || $invoiceId < 1) {
            Log::debug('Checkout success invoice payment: invalid metadata');

            return redirect()->route('billing.index')->with('error', 'Ungültige Zahlungsdaten.');
        }

        $invoice = Invoice::find($invoiceId);
        if (! $invoice || $invoice->user_id !== $user->id) {
            return redirect()->route('billing.index')->with('error', 'Rechnung nicht gefunden.');
        }

        $invoice->update([
            'status' => 'paid',
            'metadata' => array_merge($invoice->metadata ?? [], ['payment_method' => 'mollie']),
        ]);

        $invoice->refresh();
        try {
            $pdfPath = app(InvoicePdfService::class)->generate($invoice->fresh(['user.brand', 'siteSubscription.site', 'lineItems']));
            if ($pdfPath) {
                $invoice->update(['pdf_path' => $pdfPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }
        try {
            $xmlPath = app(InvoiceEInvoiceService::class)->generate($invoice->fresh(['user', 'lineItems']));
            if ($xmlPath) {
                $invoice->update(['invoice_xml_path' => $xmlPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Die Rechnung wurde erfolgreich bezahlt.');
    }

    /**
     * Create GameServerAccount and Pterodactyl server after successful Mollie payment.
     */
    protected function handleGamingCheckoutSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $planId = (int) ($metadata['hosting_plan_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);
        $serverName = $metadata['server_name'] ?? $user->name.' Game Server';
        $molliePaymentId = $metadata['mollie_payment_id'] ?? null;
        $periodMonths = max(1, min(6, (int) ($metadata['period_months'] ?? 1)));
        $periodEnd = now()->addMonths($periodMonths);

        if ($userId !== $user->id || $planId < 1) {
            Log::debug('Checkout success gaming: invalid metadata');

            return redirect()->route('gaming-accounts.index')->with('error', 'Ungültige Abo-Daten.');
        }

        $existing = GameServerAccount::where('mollie_payment_id', $molliePaymentId)
            ->orWhere('mollie_subscription_id', $molliePaymentId)
            ->first();
        if ($existing) {
            return redirect()->route('gaming-accounts.show', $existing->id)->with('success', 'Ihr Game-Server ist aktiv.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan || $plan->panel_type !== 'pterodactyl') {
            return redirect()->route('gaming.index')->with('error', 'Paket nicht gefunden.');
        }

        $server = null;
        if ($plan->hosting_server_id) {
            $server = HostingServer::query()
                ->where('id', $plan->hosting_server_id)
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }
        if (! $server) {
            $server = HostingServer::query()
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }

        if (! $server) {
            $account = $user->gameServerAccounts()->create([
                'hosting_plan_id' => $plan->id,
                'hosting_server_id' => null,
                'name' => $serverName,
                'status' => 'pending',
                'mollie_subscription_id' => null,
                'mollie_payment_id' => $molliePaymentId,
                'current_period_ends_at' => $periodEnd,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'manual',
            ]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('error', 'Für dieses Paket ist kein Pterodactyl-Panel-Server zugewiesen. Bitte im Admin unter Hosting-Pakete beim betreffenden Paket einen Panel-Server angeben.');
        }

        $password = Str::password(20);
        $config = $plan->config ?? [];
        $locationIds = $config['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $portRange = $config['port_range'] ?? [];
        if (! is_array($portRange)) {
            $portRange = $portRange ? [$portRange] : [];
        }
        $params = [
            'email' => $user->email,
            'username' => str_replace([' ', '.'], '_', Str::lower($user->name)).'_'.Str::random(4),
            'first_name' => $user->name,
            'last_name' => '',
            'password' => $password,
            'server_name' => $serverName,
            'nest_id' => (int) ($config['nest_id'] ?? 1),
            'egg_id' => (int) ($config['egg_id'] ?? 1),
            'memory' => (int) ($config['memory'] ?? 512),
            'disk' => (int) ($config['disk'] ?? 5120),
            'swap' => (int) ($config['swap'] ?? 0),
            'io' => (int) ($config['io'] ?? 500),
            'cpu' => (int) ($config['cpu'] ?? 0),
            'databases' => (int) ($config['databases'] ?? 0),
            'backups' => (int) ($config['backups'] ?? 0),
            'allocations' => 1 + (int) ($config['additional_allocations'] ?? 0),
            'location_ids' => $locationIds,
            'node' => isset($config['node']) ? (int) $config['node'] : null,
            'dedicated_ip' => (bool) ($config['dedicated_ip'] ?? false),
            'port_range' => $portRange,
            'start_on_completion' => ($config['start_on_completion'] ?? true),
            'skip_scripts' => (bool) ($config['skip_scripts'] ?? false),
            'oom_killer' => (bool) ($config['oom_killer'] ?? false),
        ];
        $optionChoices = [];
        if (! empty($metadata['option_choices'])) {
            $decoded = json_decode($metadata['option_choices'], true);
            if (is_array($decoded)) {
                $optionChoices = $decoded;
            }
        }
        $params = $this->mergeGamingOptionChoicesIntoParams($params, $optionChoices);

        $account = $user->gameServerAccounts()->create([
            'hosting_plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'product_id' => $plan->product?->id,
            'name' => $serverName,
            'status' => 'pending',
            'mollie_subscription_id' => null,
            'mollie_payment_id' => $molliePaymentId,
            'current_period_ends_at' => $periodEnd,
            'cancel_at_period_end' => false,
            'ends_at' => null,
            'renewal_type' => 'manual',
            'option_values' => ! empty($optionChoices) ? $optionChoices : null,
        ]);

        try {
            $ptero = app(PterodactylClient::class);
            $ptero->setServer($server);
            $ptero->createAccount($params);
            $created = $ptero->getLastCreatedServerData();
            $account->update([
                'pterodactyl_server_id' => $created['pterodactyl_server_id'] ?? null,
                'pterodactyl_user_id' => $created['pterodactyl_user_id'] ?? null,
                'identifier' => $created['identifier'] ?? null,
                'credentials_encrypted' => Crypt::encryptString(json_encode([
                    'email' => $user->email,
                    'password' => $password,
                ])),
                'status' => 'active',
            ]);
            Log::debug('Checkout success gaming: Pterodactyl server created (Mollie)', ['account_id' => $account->id]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('success', 'Ihr Game-Server wurde erfolgreich eingerichtet. Sie können sich im Panel anmelden.');
        } catch (\Throwable $e) {
            Log::error('Checkout success gaming: Pterodactyl createAccount exception', [
                'account_id' => $account->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('error', 'Der Game-Server konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }
    }

    /**
     * Create TeamSpeakServerAccount and virtual server after successful Mollie payment.
     */
    protected function handleTeamSpeakCheckoutSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $planId = (int) ($metadata['hosting_plan_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);
        $serverName = $metadata['server_name'] ?? $user->name.' TeamSpeak';
        $molliePaymentId = $metadata['mollie_payment_id'] ?? null;
        $periodMonths = max(1, min(6, (int) ($metadata['period_months'] ?? 1)));
        $periodEnd = now()->addMonths($periodMonths);

        if ($userId !== $user->id || $planId < 1) {
            Log::debug('Checkout success teamspeak: invalid metadata');

            return redirect()->route('teamspeak-accounts.index')->with('error', 'Ungültige Abo-Daten.');
        }

        $existing = TeamSpeakServerAccount::where('mollie_payment_id', $molliePaymentId)
            ->orWhere('mollie_subscription_id', $molliePaymentId)
            ->first();
        if ($existing) {
            return redirect()->route('teamspeak-accounts.show', $existing->id)->with('success', 'Ihr TeamSpeak-Server ist aktiv.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan || $plan->panel_type !== 'teamspeak') {
            return redirect()->route('teamspeak.index')->with('error', 'Paket nicht gefunden.');
        }

        $server = null;
        if ($plan->hosting_server_id) {
            $server = HostingServer::query()
                ->where('id', $plan->hosting_server_id)
                ->where('is_active', true)
                ->where('panel_type', 'teamspeak')
                ->first();
        }
        if (! $server) {
            $server = HostingServer::query()
                ->where('is_active', true)
                ->where('panel_type', 'teamspeak')
                ->first();
        }

        $optionChoices = [];
        if (! empty($metadata['option_choices'])) {
            $decoded = json_decode($metadata['option_choices'], true);
            if (is_array($decoded)) {
                $optionChoices = $decoded;
            }
        }
        $slots = (int) ($optionChoices['slots'] ?? 32);
        if ($slots < 1) {
            $slots = 32;
        }

        if (! $server) {
            $account = $user->teamSpeakServerAccounts()->create([
                'hosting_plan_id' => $plan->id,
                'hosting_server_id' => null,
                'product_id' => $plan->product?->id,
                'name' => $serverName,
                'status' => 'pending',
                'mollie_subscription_id' => null,
                'mollie_payment_id' => $molliePaymentId,
                'current_period_ends_at' => $periodEnd,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'manual',
                'option_values' => ! empty($optionChoices) ? $optionChoices : null,
            ]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('error', 'Für dieses Paket ist kein TeamSpeak-Server zugewiesen. Bitte im Admin unter Hosting-Pakete einen Panel-Server angeben.');
        }

        $account = $user->teamSpeakServerAccounts()->create([
            'hosting_plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'product_id' => $plan->product?->id,
            'name' => $serverName,
            'status' => 'pending',
            'mollie_subscription_id' => null,
            'mollie_payment_id' => $molliePaymentId,
            'current_period_ends_at' => $periodEnd,
            'cancel_at_period_end' => false,
            'ends_at' => null,
            'renewal_type' => 'manual',
            'option_values' => ! empty($optionChoices) ? $optionChoices : null,
        ]);

        $account->refresh();
        if ($account->virtual_server_id !== null) {
            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('success', 'Ihr TeamSpeak-Server ist bereits eingerichtet.');
        }

        try {
            $ts = app(TeamSpeakClient::class);
            $ts->setServer($server);
            $config = $server->config ?? [];
            $minPort = (int) ($config['port_range_min'] ?? 10072);
            $maxPort = (int) ($config['port_range_max'] ?? 10221);
            $port = $ts->getNextAvailablePort($minPort, $maxPort);
            $created = $ts->createVirtualServer($serverName, $port, $slots);
            $account->update([
                'virtual_server_id' => $created['virtual_server_id'],
                'port' => $created['port'],
                'status' => 'active',
            ]);
            Log::debug('Checkout success teamspeak: virtual server created (Mollie)', ['account_id' => $account->id]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('success', 'Ihr TeamSpeak-Server wurde erfolgreich eingerichtet.');
        } catch (\Throwable $e) {
            Log::error('Checkout success teamspeak: createVirtualServer exception', [
                'account_id' => $account->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('error', 'Der TeamSpeak-Server konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }
    }

    /**
     * Build Mollie payment for TeamSpeak server renewal. Called from TeamSpeakAccountController.
     */
    public function buildTeamSpeakRenewRedirect(Request $request, TeamSpeakServerAccount $account, int $periodMonths): RedirectResponse|InertiaResponse
    {
        if (! $this->isMollieConfigured()) {
            return redirect()->route('teamspeak-accounts.show', $account)
                ->with('error', 'Mollie ist nicht konfiguriert.');
        }

        $monthlyAmount = $account->getMonthlyRenewalAmount();
        if ($monthlyAmount <= 0) {
            return redirect()->route('teamspeak-accounts.show', $account)
                ->with('error', 'Kein gültiger Preis für Verlängerung (Basispreis oder Paket-Optionen fehlen).');
        }

        $amount = round($monthlyAmount * $periodMonths, 2);
        $user = $request->user();
        $metadata = [
            'type' => 'teamspeak_renewal',
            'team_speak_server_account_id' => (string) $account->id,
            'user_id' => (string) $user->id,
            'period_months' => (string) $periodMonths,
        ];
        $currency = strtoupper(config('cashier.currency', 'eur'));

        try {
            $mollie = app(MollieApiClient::class);
            $params = [
                'amount' => [
                    'currency' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
                'description' => 'TeamSpeak-Server Verlängerung: '.$account->name.' ('.$periodMonths.' Monat(e))',
                'redirectUrl' => route('checkout.success'),
                'metadata' => $metadata,
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
                return redirect()->route('teamspeak-accounts.show', $account)
                    ->with('error', 'Mollie Checkout lieferte keine gültige URL.');
            }
            $request->session()->put('mollie_checkout_redirect_url', $checkoutUrl);

            return redirect()->route('checkout.redirect-to-mollie');
        } catch (\Throwable $e) {
            Log::error('TeamSpeak renew Mollie error', ['message' => $e->getMessage()]);
            report($e);

            return redirect()->route('teamspeak-accounts.show', $account)
                ->with('error', $this->getCheckoutErrorMessage($e));
        }
    }

    /**
     * Handle successful Mollie payment for TeamSpeak server renewal.
     */
    protected function handleTeamSpeakRenewalSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $accountId = (int) ($metadata['team_speak_server_account_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);
        $periodMonths = max(1, min(12, (int) ($metadata['period_months'] ?? 1)));

        if ($userId !== $user->id || $accountId < 1) {
            Log::debug('Checkout success teamspeak renewal: invalid metadata');

            return redirect()->route('teamspeak-accounts.index')->with('error', 'Ungültige Zahlungsdaten.');
        }

        $account = TeamSpeakServerAccount::find($accountId);
        if (! $account || $account->user_id !== $user->id) {
            return redirect()->route('teamspeak-accounts.index')->with('error', 'TeamSpeak-Server nicht gefunden.');
        }

        $from = $account->current_period_ends_at && $account->current_period_ends_at->isFuture()
            ? $account->current_period_ends_at
            : now();
        $wasSuspended = $account->status === 'suspended';
        $account->update([
            'current_period_ends_at' => $from->copy()->addMonths($periodMonths),
            'status' => 'active',
        ]);
        if ($wasSuspended && $account->hostingServer && $account->virtual_server_id) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($account->hostingServer);
                $client->startVirtualServer($account->virtual_server_id);
            } catch (\Throwable) {
                // continue
            }
        }

        return redirect()->route('teamspeak-accounts.show', $account)
            ->with('success', 'Der TeamSpeak-Server wurde erfolgreich verlängert.');
    }

    /**
     * After first payment for Mollie subscription setup: create the subscription and link it to the account.
     */
    protected function handleMollieSubscriptionFirstSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $accountType = $metadata['account_type'] ?? '';
        $accountId = (int) ($metadata['account_id'] ?? 0);
        $userId = (int) ($metadata['user_id'] ?? 0);

        if ($userId !== $user->id || $accountId < 1 || ! in_array($accountType, ['gaming', 'webspace', 'teamspeak'], true)) {
            Log::debug('Checkout success mollie_subscription_first: invalid metadata');

            return redirect()->route('dashboard')->with('error', 'Ungültige Abo-Daten.');
        }

        $account = null;
        $showRoute = 'dashboard';
        if ($accountType === 'gaming') {
            $account = GameServerAccount::find($accountId);
            $showRoute = 'gaming-accounts.show';
        } elseif ($accountType === 'webspace') {
            $account = WebspaceAccount::find($accountId);
            $showRoute = 'webspace-accounts.show';
        } else {
            $account = TeamSpeakServerAccount::find($accountId);
            $showRoute = 'teamspeak-accounts.show';
        }

        if (! $account || $account->user_id !== $user->id) {
            return redirect()->route('dashboard')->with('error', 'Konto nicht gefunden.');
        }

        $plan = $account->hostingPlan;
        if (! $plan || ! $plan->is_active) {
            return redirect()->route($showRoute, [$account])->with('error', 'Paket nicht mehr verfügbar.');
        }

        $amount = in_array($accountType, ['teamspeak', 'gaming', 'webspace'], true)
            ? $account->getMonthlyRenewalAmount()
            : (float) $plan->price;
        if ($amount <= 0) {
            return redirect()->route($showRoute, [$account])->with('error', 'Kein gültiger Preis für dieses Paket.');
        }

        $currency = strtoupper(config('cashier.currency', 'eur'));
        $description = match ($accountType) {
            'gaming' => 'Game-Server Abo: '.$account->name,
            'webspace' => 'Webspace Abo: '.$account->domain,
            'teamspeak' => 'TeamSpeak-Server Abo: '.$account->name,
        };

        try {
            $subscription = app(MollieApiClient::class)->subscriptions->createForId(
                $user->mollie_customer_id,
                [
                    'amount' => [
                        'currency' => $currency,
                        'value' => number_format($amount, 2, '.', ''),
                    ],
                    'interval' => '1 month',
                    'description' => $description,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Checkout success mollie_subscription_first: subscription create failed', [
                'account_type' => $accountType,
                'account_id' => $accountId,
                'message' => $e->getMessage(),
            ]);
            report($e);

            return redirect()->route($showRoute, [$account])
                ->with('error', 'Abo konnte nach der Zahlung nicht eingerichtet werden. Bitte kontaktieren Sie uns.');
        }

        $from = $account->current_period_ends_at && $account->current_period_ends_at->isFuture()
            ? $account->current_period_ends_at
            : now();
        $newPeriodEnd = $from->copy()->addMonth();

        $updateData = [
            'mollie_subscription_id' => $subscription->id,
            'renewal_type' => 'auto',
            'cancel_at_period_end' => false,
            'current_period_ends_at' => $newPeriodEnd,
        ];
        if (in_array($accountType, ['gaming', 'webspace', 'teamspeak'], true) && in_array('status', $account->getFillable(), true)) {
            $updateData['status'] = 'active';
        }
        $account->update($updateData);

        if ($accountType === 'teamspeak' && $account->hostingServer && $account->virtual_server_id) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($account->hostingServer);
                $client->startVirtualServer($account->virtual_server_id);
            } catch (\Throwable) {
                // continue
            }
        }

        return redirect()->route($showRoute, [$account])
            ->with('success', 'Mollie-Abo wurde eingerichtet. Die erste Zahlung wurde verbucht, die Laufzeit wurde um 1 Monat verlängert. Die nächste Abbuchung erfolgt automatisch.');
    }

    /**
     * After successful Mollie payment for domain checkout: complete domain order (Skrime, ResellerDomain, invoice).
     */
    protected function handleDomainCheckoutSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $token = $metadata['domain_checkout_token'] ?? null;
        if (! $token || ! is_string($token)) {
            Log::debug('Checkout success domain: missing token in metadata');

            return redirect()->route('domains.index')->with('error', 'Ungültige Checkout-Daten.');
        }

        $payload = $request->session()->pull('domain_checkout_'.$token);
        if (! $payload || ! is_array($payload) || ((int) ($payload['user_id'] ?? 0)) !== $user->id) {
            return redirect()->route('domains.index')->with('error', 'Checkout-Daten abgelaufen oder ungültig.');
        }

        return app(DomainShopController::class)->completeOrderWithPayload(
            $request,
            $payload,
            app(InvoicePdfService::class)
        );
    }

    /**
     * Merge customer option_choices into Pterodactyl createAccount params. Keys like memory, disk, nest_id, egg_id override config defaults.
     *
     * @param  array<string, mixed>  $params
     * @param  array<string, mixed>  $optionChoices
     * @return array<string, mixed>
     */
    protected function mergeGamingOptionChoicesIntoParams(array $params, array $optionChoices): array
    {
        if (empty($optionChoices)) {
            return $params;
        }
        $intKeys = ['memory', 'disk', 'swap', 'io', 'cpu', 'nest_id', 'egg_id', 'node', 'databases', 'backups', 'additional_allocations'];
        foreach ($optionChoices as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            if ($key === 'location_ids') {
                $params['location_ids'] = is_array($value) ? array_map('intval', $value) : [(int) $value];

                continue;
            }
            if ($key === 'port_range') {
                $params['port_range'] = is_array($value) ? array_map('strval', $value) : [(string) $value];

                continue;
            }
            if (in_array($key, $intKeys, true)) {
                $params[$key] = (int) $value;
            } else {
                $params[$key] = $value;
            }
        }
        if (isset($params['additional_allocations'])) {
            $params['allocations'] = 1 + (int) $params['additional_allocations'];
        }

        return $params;
    }

    /**
     * Create GameServerAccount and Pterodactyl server after payment with balance (no Stripe).
     */
    public function processGamingBalanceCheckout(Request $request, \App\Models\User $user, array $payload): RedirectResponse
    {
        $planId = (int) ($payload['hosting_plan_id'] ?? 0);
        $userId = (int) ($payload['user_id'] ?? 0);
        $serverName = $payload['server_name'] ?? null;

        if ($userId !== $user->id || $planId < 1) {
            Log::debug('Gaming balance checkout: invalid payload');

            return redirect()->route('gaming-accounts.index')->with('error', 'Ungültige Bestelldaten.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'pterodactyl') {
            return redirect()->route('gaming.index')->with('error', 'Paket nicht gefunden.');
        }

        $server = null;
        if ($plan->hosting_server_id) {
            $server = HostingServer::query()
                ->where('id', $plan->hosting_server_id)
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }
        if (! $server) {
            $server = HostingServer::query()
                ->where('is_active', true)
                ->where('panel_type', 'pterodactyl')
                ->first();
        }

        $serverName = $serverName ?: $plan->name.' #'.($user->gameServerAccounts()->count() + 1);
        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? $this->getBalancePeriodMonths($request, $user))));
        $periodEndsAt = now()->addMonths($periodMonths);

        if (! $server) {
            $account = $user->gameServerAccounts()->create([
                'hosting_plan_id' => $plan->id,
                'hosting_server_id' => null,
                'product_id' => $plan->product?->id,
                'name' => $serverName,
                'status' => 'pending',
                'mollie_subscription_id' => null,
                'current_period_ends_at' => $periodEndsAt,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'manual',
            ]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('error', 'Für dieses Paket ist kein Pterodactyl-Panel-Server zugewiesen. Bitte im Admin unter Hosting-Pakete beim betreffenden Paket einen Panel-Server angeben.');
        }

        $password = Str::password(20);
        $config = $plan->config ?? [];
        $locationIds = $config['location_ids'] ?? [];
        if (! is_array($locationIds)) {
            $locationIds = $locationIds ? [$locationIds] : [];
        }
        $portRange = $config['port_range'] ?? [];
        if (! is_array($portRange)) {
            $portRange = $portRange ? [$portRange] : [];
        }
        $params = [
            'email' => $user->email,
            'username' => str_replace([' ', '.'], '_', Str::lower($user->name)).'_'.Str::random(4),
            'first_name' => $user->name,
            'last_name' => '',
            'password' => $password,
            'server_name' => $serverName,
            'nest_id' => (int) ($config['nest_id'] ?? 1),
            'egg_id' => (int) ($config['egg_id'] ?? 1),
            'memory' => (int) ($config['memory'] ?? 512),
            'disk' => (int) ($config['disk'] ?? 5120),
            'swap' => (int) ($config['swap'] ?? 0),
            'io' => (int) ($config['io'] ?? 500),
            'cpu' => (int) ($config['cpu'] ?? 0),
            'databases' => (int) ($config['databases'] ?? 0),
            'backups' => (int) ($config['backups'] ?? 0),
            'allocations' => 1 + (int) ($config['additional_allocations'] ?? 0),
            'location_ids' => $locationIds,
            'node' => isset($config['node']) ? (int) $config['node'] : null,
            'dedicated_ip' => (bool) ($config['dedicated_ip'] ?? false),
            'port_range' => $portRange,
            'start_on_completion' => ($config['start_on_completion'] ?? true),
            'skip_scripts' => (bool) ($config['skip_scripts'] ?? false),
            'oom_killer' => (bool) ($config['oom_killer'] ?? false),
        ];
        $params = $this->mergeGamingOptionChoicesIntoParams($params, $payload['option_choices'] ?? []);

        $account = $user->gameServerAccounts()->create([
            'hosting_plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'product_id' => $plan->product?->id,
            'name' => $serverName,
            'status' => 'pending',
            'mollie_subscription_id' => null,
            'current_period_ends_at' => $periodEndsAt,
            'cancel_at_period_end' => false,
            'ends_at' => null,
            'renewal_type' => 'manual',
            'option_values' => ! empty($payload['option_choices']) ? $payload['option_choices'] : null,
        ]);

        try {
            $ptero = app(PterodactylClient::class);
            $ptero->setServer($server);
            $ptero->createAccount($params);
            $created = $ptero->getLastCreatedServerData();
            $account->update([
                'pterodactyl_server_id' => $created['pterodactyl_server_id'] ?? null,
                'pterodactyl_user_id' => $created['pterodactyl_user_id'] ?? null,
                'identifier' => $created['identifier'] ?? null,
                'credentials_encrypted' => Crypt::encryptString(json_encode([
                    'email' => $user->email,
                    'password' => $password,
                ])),
                'status' => 'active',
            ]);
            Log::debug('Gaming balance checkout: Pterodactyl server created', ['account_id' => $account->id]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('success', 'Ihr Game-Server wurde erfolgreich eingerichtet. Sie können sich im Panel anmelden.');
        } catch (\Throwable $e) {
            Log::error('Gaming balance checkout: Pterodactyl createAccount exception', [
                'account_id' => $account->id,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('gaming-accounts.show', $account->id)
                ->with('error', 'Der Game-Server konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }
    }

    /**
     * Create TeamSpeakServerAccount and virtual server after payment with balance.
     */
    public function processTeamSpeakBalanceCheckout(Request $request, \App\Models\User $user, array $payload): RedirectResponse
    {
        $planId = (int) ($payload['hosting_plan_id'] ?? 0);
        $userId = (int) ($payload['user_id'] ?? 0);
        $serverName = $payload['server_name'] ?? null;

        if ($userId !== $user->id || $planId < 1) {
            Log::debug('TeamSpeak balance checkout: invalid payload');

            return redirect()->route('teamspeak-accounts.index')->with('error', 'Ungültige Bestelldaten.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'teamspeak') {
            return redirect()->route('teamspeak.index')->with('error', 'Paket nicht gefunden.');
        }

        $server = null;
        if ($plan->hosting_server_id) {
            $server = HostingServer::query()
                ->where('id', $plan->hosting_server_id)
                ->where('is_active', true)
                ->where('panel_type', 'teamspeak')
                ->first();
        }
        if (! $server) {
            $server = HostingServer::query()
                ->where('is_active', true)
                ->where('panel_type', 'teamspeak')
                ->first();
        }

        $serverName = $serverName ?: $plan->name.' #'.($user->teamSpeakServerAccounts()->count() + 1);
        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? $this->getBalancePeriodMonths($request, $user))));
        $periodEndsAt = now()->addMonths($periodMonths);

        $optionChoices = $payload['option_choices'] ?? [];
        $slots = (int) ($optionChoices['slots'] ?? 32);
        if ($slots < 1) {
            $slots = 32;
        }

        if (! $server) {
            $account = $user->teamSpeakServerAccounts()->create([
                'hosting_plan_id' => $plan->id,
                'hosting_server_id' => null,
                'product_id' => $plan->product?->id,
                'name' => $serverName,
                'status' => 'pending',
                'mollie_subscription_id' => null,
                'current_period_ends_at' => $periodEndsAt,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'manual',
                'option_values' => ! empty($optionChoices) ? $optionChoices : null,
            ]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('error', 'Für dieses Paket ist kein TeamSpeak-Server zugewiesen. Bitte im Admin unter Hosting-Pakete einen Panel-Server angeben.');
        }

        $recentCutoff = now()->subMinutes(10);
        $existingPending = $user->teamSpeakServerAccounts()
            ->where('hosting_plan_id', $plan->id)
            ->where('hosting_server_id', $server->id)
            ->whereNull('virtual_server_id')
            ->where('created_at', '>=', $recentCutoff)
            ->first();

        $account = $existingPending ?? $user->teamSpeakServerAccounts()->create([
            'hosting_plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'product_id' => $plan->product?->id,
            'name' => $serverName,
            'status' => 'pending',
            'mollie_subscription_id' => null,
            'current_period_ends_at' => $periodEndsAt,
            'cancel_at_period_end' => false,
            'ends_at' => null,
            'renewal_type' => 'manual',
            'option_values' => ! empty($optionChoices) ? $optionChoices : null,
        ]);

        $account->refresh();
        if ($account->virtual_server_id !== null) {
            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('success', 'Ihr TeamSpeak-Server ist bereits eingerichtet.');
        }

        try {
            $ts = app(TeamSpeakClient::class);
            $ts->setServer($server);
            $config = $server->config ?? [];
            $minPort = (int) ($config['port_range_min'] ?? 10072);
            $maxPort = (int) ($config['port_range_max'] ?? 10221);
            $port = $ts->getNextAvailablePort($minPort, $maxPort);
            $created = $ts->createVirtualServer($serverName, $port, $slots);
            $account->update([
                'virtual_server_id' => $created['virtual_server_id'],
                'port' => $created['port'],
                'status' => 'active',
            ]);
            Log::debug('TeamSpeak balance checkout: virtual server created', ['account_id' => $account->id]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('success', 'Ihr TeamSpeak-Server wurde erfolgreich eingerichtet.');
        } catch (\Throwable $e) {
            Log::error('TeamSpeak balance checkout: createVirtualServer exception', [
                'account_id' => $account->id,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('teamspeak-accounts.show', $account->id)
                ->with('error', 'Der TeamSpeak-Server konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }
    }

    /**
     * Create WebspaceAccount and Plesk account after payment with balance (no Stripe).
     */
    public function processWebspaceBalanceCheckout(Request $request, \App\Models\User $user, array $payload): RedirectResponse
    {
        $planId = (int) ($payload['hosting_plan_id'] ?? 0);
        $domain = $payload['domain'] ?? '';
        $userId = (int) ($payload['user_id'] ?? 0);

        if ($userId !== $user->id || $planId < 1 || $domain === '') {
            Log::debug('Webspace balance checkout: invalid payload');

            return redirect()->route('webspace-accounts.index')->with('error', 'Ungültige Bestelldaten.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan || ! $plan->is_active) {
            return redirect()->route('webspace.index')->with('error', 'Paket nicht gefunden.');
        }

        $periodMonths = max(1, min(6, (int) ($payload['period_months'] ?? $this->getBalancePeriodMonths($request, $user))));
        $periodEndsAt = now()->addMonths($periodMonths);
        $server = HostingServer::where('is_active', true)->first();

        if (! $server) {
            Log::error('Webspace balance checkout: no active HostingServer');
            $account = $user->webspaceAccounts()->create([
                'hosting_plan_id' => $plan->id,
                'domain' => $domain,
                'plesk_username' => 'webspace_'.Str::random(8),
                'status' => 'pending',
                'mollie_subscription_id' => null,
                'current_period_ends_at' => $periodEndsAt,
                'cancel_at_period_end' => false,
                'ends_at' => null,
                'renewal_type' => 'manual',
            ]);
            if ($plan->product?->id) {
                $account->update(['product_id' => $plan->product->id]);
            }

            return redirect()->route('webspace-accounts.show', $account->id)
                ->with('error', 'Webspace wird eingerichtet. Es ist kein aktiver Hosting-Server konfiguriert – bitte kontaktieren Sie uns.');
        }

        $pleskUsername = 'ws'.str_pad((string) ((WebspaceAccount::max('id') ?? 0) + 1), 4, '0', STR_PAD_LEFT).Str::lower(Str::random(6));
        $password = Str::password(20);

        $account = $user->webspaceAccounts()->create([
            'hosting_plan_id' => $plan->id,
            'hosting_server_id' => $server->id,
            'domain' => $domain,
            'plesk_username' => $pleskUsername,
            'plesk_password_encrypted' => Crypt::encryptString($password),
            'status' => 'pending',
            'mollie_subscription_id' => null,
            'current_period_ends_at' => $periodEndsAt,
            'cancel_at_period_end' => false,
            'ends_at' => null,
            'renewal_type' => 'manual',
        ]);
        if ($plan->product?->id) {
            $account->update(['product_id' => $plan->product->id]);
        }

        $ok = false;
        try {
            $plesk = app(PleskClient::class);
            $plesk->setServer($server);
            $ok = $plesk->createAccount($pleskUsername, $domain, $plan->plesk_package_name, $password);
        } catch (\Throwable $e) {
            Log::error('Webspace balance checkout: Plesk createAccount exception', [
                'account_id' => $account->id,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('webspace-accounts.show', $account->id)
                ->with('error', 'Der Webspace konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }

        if ($ok) {
            $account->update(['status' => 'active']);
            Log::debug('Webspace balance checkout: Plesk account created', ['account_id' => $account->id]);
            $user->notify(new WebspaceOrderCompletedNotification($account, $password));
        }

        return redirect()->route('webspace-accounts.show', $account->id)
            ->with('success', $ok ? 'Ihr Webspace wurde erfolgreich eingerichtet.' : 'Ihr Webspace wird eingerichtet. Bei Fragen kontaktieren Sie uns.');
    }

    /**
     * Create WebspaceAccount and Plesk account after successful Mollie payment.
     */
    protected function handleWebspaceCheckoutSuccessFromMollie(Request $request, \App\Models\User $user, array $metadata): RedirectResponse
    {
        $planId = (int) ($metadata['hosting_plan_id'] ?? 0);
        $domain = $metadata['domain'] ?? '';
        $userId = (int) ($metadata['user_id'] ?? 0);
        $molliePaymentId = $metadata['mollie_payment_id'] ?? null;

        if ($userId !== $user->id || $planId < 1 || $domain === '') {
            Log::debug('Checkout success webspace: invalid metadata');

            return redirect()->route('webspace-accounts.index')->with('error', 'Ungültige Abo-Daten.');
        }

        $existing = WebspaceAccount::where('mollie_payment_id', $molliePaymentId)
            ->orWhere('mollie_subscription_id', $molliePaymentId)
            ->first();
        if ($existing) {
            return redirect()->route('webspace-accounts.show', $existing->id)->with('success', 'Ihr Webspace ist aktiv.');
        }

        $plan = HostingPlan::find($planId);
        if (! $plan) {
            return redirect()->route('webspace.index')->with('error', 'Paket nicht gefunden.');
        }

        $isPrepaid = ($metadata['prepaid'] ?? '0') === '1';
        $periodMonths = max(1, min(6, (int) ($metadata['period_months'] ?? 1)));
        $periodEnd = now()->addMonths($periodMonths);
        $server = HostingServer::where('is_active', true)->first();

        $baseData = [
            'hosting_plan_id' => $plan->id,
            'domain' => $domain,
            'current_period_ends_at' => $periodEnd,
            'cancel_at_period_end' => false,
            'ends_at' => null,
        ];
        if ($isPrepaid) {
            $baseData['mollie_subscription_id'] = null;
            $baseData['mollie_payment_id'] = $molliePaymentId;
            $baseData['renewal_type'] = 'manual';
        } else {
            $baseData['mollie_subscription_id'] = $molliePaymentId;
            $baseData['mollie_payment_id'] = null;
            $baseData['renewal_type'] = 'auto';
        }

        if (! $server) {
            Log::error('Checkout success webspace: no active HostingServer');
            $account = $user->webspaceAccounts()->create(array_merge($baseData, [
                'hosting_server_id' => null,
                'plesk_username' => 'webspace_'.Str::random(8),
                'status' => 'pending',
            ]));
            $plan->product?->id && $account->update(['product_id' => $plan->product->id]);

            return redirect()->route('webspace-accounts.show', $account->id)
                ->with('error', 'Webspace wird eingerichtet. Es ist kein aktiver Hosting-Server konfiguriert – bitte kontaktieren Sie uns.');
        }

        $pleskUsername = 'ws'.str_pad((string) ((WebspaceAccount::max('id') ?? 0) + 1), 4, '0', STR_PAD_LEFT).Str::lower(Str::random(6));
        $password = Str::password(20);

        $account = $user->webspaceAccounts()->create(array_merge($baseData, [
            'hosting_server_id' => $server->id,
            'plesk_username' => $pleskUsername,
            'plesk_password_encrypted' => Crypt::encryptString($password),
            'status' => 'pending',
        ]));
        if ($plan->product?->id) {
            $account->update(['product_id' => $plan->product->id]);
        }

        $ok = false;
        try {
            $plesk = app(PleskClient::class);
            $plesk->setServer($server);
            $ok = $plesk->createAccount($pleskUsername, $domain, $plan->plesk_package_name, $password);
        } catch (\Throwable $e) {
            Log::error('Checkout success webspace: Plesk createAccount exception', [
                'account_id' => $account->id,
                'server' => $server->hostname,
                'plesk_package_name' => $plan->plesk_package_name,
                'domain' => $domain,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('webspace-accounts.show', $account->id)
                ->with('error', 'Der Webspace konnte nicht automatisch angelegt werden: '.$e->getMessage().'. Bitte kontaktieren Sie uns.');
        }

        if ($ok) {
            $account->update(['status' => 'active']);
            Log::debug('Checkout success webspace: Plesk account created', ['account_id' => $account->id]);
            $user->notify(new WebspaceOrderCompletedNotification($account, $password));
        } else {
            Log::warning('Checkout success webspace: Plesk createAccount failed', [
                'account_id' => $account->id,
                'server' => $server->hostname,
                'plesk_package_name' => $plan->plesk_package_name,
                'domain' => $domain,
            ]);
        }

        if ($ok) {
            return redirect()->route('webspace-accounts.show', $account->id)
                ->with('success', 'Ihr Webspace wurde erfolgreich eingerichtet.');
        }

        return redirect()->route('webspace-accounts.show', $account->id)
            ->with('error', 'Der Webspace konnte auf dem Server nicht automatisch angelegt werden. Bitte kontaktieren Sie uns und nennen Sie Ihre Domain: '.$domain);
    }

    /**
     * Vertragslaufzeit in Monaten bei Guthaben-Zahlung (Webspace/Game-Server).
     * Aus Marken-Features oder Config.
     */
    protected function getBalancePeriodMonths(Request $request, \App\Models\User $user): int
    {
        $brand = $request->attributes->get('current_brand') ?? $user->brand ?? Brand::getDefault();
        $features = $brand?->getFeaturesArray() ?? [];

        return max(1, min(24, (int) ($features['balance_period_months'] ?? config('billing.balance_period_months', 1))));
    }

    /**
     * Prüft, ob Mollie mit gültigem API-Key konfiguriert ist (mind. 30 Zeichen, test_ oder live_).
     */
    protected function isMollieConfigured(): bool
    {
        $key = config('mollie.key');
        if (! is_string($key) || $key === '') {
            return false;
        }

        return strlen($key) >= 30 && (str_starts_with($key, 'test_') || str_starts_with($key, 'live_'));
    }

    /**
     * Benutzerlesbare Fehlermeldung für Mollie-Checkout-Fehler (inkl. Hinweise auf API-Key, Log).
     */
    protected function getCheckoutErrorMessage(\Throwable $e): string
    {
        $msg = $e->getMessage();
        if (str_contains($msg, 'API key') || str_contains($msg, 'Invalid API key')) {
            return 'Mollie API-Key fehlt oder ist ungültig. Bitte MOLLIE_KEY in der .env setzen (test_… oder live_…, mind. 30 Zeichen). Danach „php artisan config:clear“ ausführen.';
        }
        if (str_contains($msg, 'webhook') && str_contains($msg, 'unreachable')) {
            return 'Mollie konnte die Webhook-URL nicht erreichen. Lokal: APP_URL nutzt .test/localhost – die Anwendung lässt den Webhook lokal nun weg. Bitte Seite neu laden und erneut versuchen.';
        }
        if (config('app.debug')) {
            return 'Checkout konnte nicht gestartet werden: '.$msg;
        }

        return 'Checkout konnte nicht gestartet werden. Details stehen in storage/logs/laravel.log.';
    }
}
