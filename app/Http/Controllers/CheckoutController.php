<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\Template;
use App\Notifications\InvoiceCreatedNotification;
use App\Notifications\OrderCompletedNotification;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use App\Services\SyncTemplateStripePriceService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Cashier\Checkout;
use Stripe\Checkout\Session as StripeSession;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    /**
     * Redirect to Stripe Checkout using session data (from SiteController::store).
     */
    public function redirect(Request $request): RedirectResponse|Response
    {
        $payload = $request->session()->get('checkout_meine_seiten');
        if (! $payload || ! isset($payload['template_id'], $payload['name'])) {
            return redirect()->route('sites.create')->with('error', 'Bitte starten Sie die Bestellung erneut.');
        }

        $user = $request->user();
        $template = Template::find($payload['template_id']);
        if (! $template) {
            $request->session()->forget('checkout_meine_seiten');

            return redirect()->route('sites.create')->with('error', 'Template nicht gefunden.');
        }

        $priceId = $this->getPriceIdForTemplate($template);
        if (! $priceId) {
            $request->session()->forget('checkout_meine_seiten');

            return redirect()
                ->route('sites.create')
                ->with('error', 'Dieses Template ist derzeit nicht buchbar. Bitte legen Sie im Admin einen Preis an und speichern Sie das Template.');
        }

        $siteName = $payload['name'];

        $checkout = Checkout::customer($user)
            ->allowPromotionCodes()
            ->create($priceId, [
                'mode' => StripeSession::MODE_SUBSCRIPTION,
                'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('sites.create').'?template='.$template->id,
                'subscription_data' => [
                    'metadata' => [
                        'template_id' => (string) $template->id,
                        'site_name' => $siteName,
                        'user_id' => (string) $user->id,
                    ],
                ],
            ]);

        $request->session()->forget('checkout_meine_seiten');

        $redirectResponse = $checkout->redirect();

        return Inertia::location($redirectResponse->getTargetUrl());
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
     * Handle successful checkout: create Site, Domain, SiteSubscription from session.
     * This runs when the customer is redirected back from Stripe (success_url).
     * No webhook is required for the initial purchase; webhooks are only used for
     * subscription updates (renewal, cancel) in production.
     */
    public function success(Request $request): RedirectResponse
    {
        $sessionId = $request->query('session_id');
        Log::debug('Checkout success: start', ['session_id' => $sessionId]);

        if (! $sessionId) {
            Log::debug('Checkout success: early return', ['reason' => 'no_session_id']);

            return redirect()->route('sites.index')->with('error', 'Checkout-Session nicht gefunden.');
        }

        $user = $request->user();
        if (! $user) {
            Log::debug('Checkout success: early return', ['reason' => 'user_not_authenticated']);

            return redirect()->route('login')->with('error', 'Bitte melden Sie sich an.');
        }

        try {
            $stripe = new StripeClient(config('cashier.secret'));
            $session = $stripe->checkout->sessions->retrieve($sessionId, ['expand' => ['subscription']]);
            $sessionCustomerEmail = $session->customer_email ?? (isset($session->customer_details->email) ? $session->customer_details->email : null);
            Log::debug('Checkout success: session retrieved', [
                'customer_email' => $sessionCustomerEmail,
                'subscription' => $session->subscription ? (is_object($session->subscription) ? ($session->subscription->id ?? null) : $session->subscription) : null,
            ]);
        } catch (\Throwable $e) {
            Log::error('Checkout success: Stripe session retrieve failed', [
                'session_id' => $sessionId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('sites.index')->with('error', 'Stripe-Session konnte nicht geladen werden. '.($e->getMessage() ?: 'Bitte prüfen Sie storage/logs/laravel.log.'));
        }

        $customerEmail = is_string($sessionCustomerEmail) ? strtolower(trim($sessionCustomerEmail)) : '';
        $userEmail = strtolower(trim($user->email));
        if ($customerEmail !== '' && $customerEmail !== $userEmail) {
            Log::debug('Checkout success: early return', ['reason' => 'email_mismatch', 'customer_email' => $customerEmail, 'user_email' => $userEmail]);

            return redirect()->route('sites.index')->with('error', 'Ungültige Checkout-Session (E-Mail stimmt nicht überein).');
        }

        $subscriptionId = $session->subscription;
        if (is_object($subscriptionId) && isset($subscriptionId->id)) {
            $subscriptionId = $subscriptionId->id;
        }

        $maxAttempts = 4;
        $attempt = 0;
        while (! $subscriptionId && $attempt < $maxAttempts) {
            $attempt++;
            sleep(2);
            $session = $stripe->checkout->sessions->retrieve($sessionId, ['expand' => ['subscription']]);
            $subscriptionId = $session->subscription;
            if (is_object($subscriptionId) && isset($subscriptionId->id)) {
                $subscriptionId = $subscriptionId->id;
            }
            Log::debug('Checkout success: retry subscription', ['attempt' => $attempt, 'has_subscription' => (bool) $subscriptionId]);
        }

        $subscriptionIdString = is_object($subscriptionId) && isset($subscriptionId->id)
            ? $subscriptionId->id
            : (is_string($subscriptionId) ? $subscriptionId : null);

        if (! $subscriptionIdString) {
            Log::debug('Checkout success: early return', ['reason' => 'subscription_null_after_retries']);

            return redirect()->route('sites.index')->with('info', 'Ihre Webseite wird eingerichtet. Bitte prüfen Sie in wenigen Minuten „Meine Sites“. Falls nichts erscheint, kontaktieren Sie uns.');
        }

        try {
            $subscription = $stripe->subscriptions->retrieve($subscriptionIdString, ['expand' => ['items.data.price']]);
        } catch (\Throwable $e) {
            Log::error('Checkout success: Stripe subscription retrieve failed', [
                'subscription_id' => $subscriptionIdString,
                'message' => $e->getMessage(),
            ]);

            return redirect()->route('sites.index')->with('error', 'Abo konnte nicht geladen werden. '.$e->getMessage());
        }

        $metadata = $subscription->metadata->toArray();
        $templateId = (int) ($metadata['template_id'] ?? 0);
        $siteName = $metadata['site_name'] ?? 'Meine Webseite';
        $userId = (int) ($metadata['user_id'] ?? 0);
        Log::debug('Checkout success: metadata', ['template_id' => $templateId, 'site_name' => $siteName, 'user_id' => $userId, 'app_user_id' => $user->id]);

        if ($userId !== $user->id || $templateId < 1) {
            Log::debug('Checkout success: early return', ['reason' => 'invalid_metadata', 'user_id_match' => $userId === $user->id, 'template_id' => $templateId]);

            return redirect()->route('sites.index')->with('error', 'Ungültige Abo-Daten.');
        }

        $existing = SiteSubscription::where('stripe_subscription_id', $subscription->id)->first();
        if ($existing) {
            Log::debug('Checkout success: existing subscription', ['site_id' => $existing->site_id]);

            return redirect()->route('sites.show', ['site' => $existing->site->id]);
        }

        $template = Template::find($templateId);
        if (! $template) {
            Log::debug('Checkout success: early return', ['reason' => 'template_not_found', 'template_id' => $templateId]);

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

            $currentPeriodEnd = isset($subscription->current_period_end)
                ? Carbon::createFromTimestamp($subscription->current_period_end)
                : null;

            $siteSubscription = $site->siteSubscription()->create([
                'stripe_subscription_id' => $subscription->id,
                'stripe_price_id' => $subscription->items->data[0]->price->id ?? null,
                'stripe_status' => $subscription->status ?? 'active',
                'current_period_ends_at' => $currentPeriodEnd,
                'cancel_at_period_end' => (bool) $subscription->cancel_at_period_end,
                'ends_at' => $subscription->ended_at ? Carbon::createFromTimestamp($subscription->ended_at) : null,
                'renewal_type' => 'auto',
            ]);

            Log::debug('Checkout success: site and subscription created', ['site_id' => $site->id, 'site_subscription_id' => $siteSubscription->id]);

            $this->createInvoiceFromSubscription($user, $siteSubscription, $subscription);

            $user->notify(new OrderCompletedNotification($site));

            return redirect()
                ->route('sites.show', ['site' => $site->id])
                ->with('success', 'Ihre Webseite wurde erfolgreich eingerichtet.');
        } catch (\Throwable $e) {
            Log::error('Checkout success: exception during site creation', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('sites.index')->with('error', 'Fehler beim Anlegen der Webseite: '.$e->getMessage().'. Bitte prüfen Sie storage/logs/laravel.log.');
        }
    }

    /**
     * Create local Invoice from Stripe subscription (for dev without webhooks; in prod invoice.paid webhook does this).
     */
    protected function createInvoiceFromSubscription(\App\Models\User $user, SiteSubscription $siteSubscription, \Stripe\Subscription $subscription): void
    {
        $latestInvoiceId = $subscription->latest_invoice ?? null;
        if (is_object($latestInvoiceId) && isset($latestInvoiceId->id)) {
            $latestInvoiceId = $latestInvoiceId->id;
        }
        if (! is_string($latestInvoiceId)) {
            Log::debug('Checkout success: no latest_invoice on subscription', ['subscription_id' => $subscription->id]);

            return;
        }

        if (Invoice::where('stripe_invoice_id', $latestInvoiceId)->exists()) {
            return;
        }

        try {
            $stripe = new StripeClient(config('cashier.secret'));
            $stripeInvoice = $stripe->invoices->retrieve($latestInvoiceId);
        } catch (\Throwable $e) {
            Log::warning('Checkout success: could not retrieve Stripe invoice', ['invoice_id' => $latestInvoiceId, 'message' => $e->getMessage()]);

            return;
        }

        $amountPaid = (float) (($stripeInvoice->amount_paid ?? 0) / 100);
        $periodStart = isset($stripeInvoice->period_start) ? Carbon::createFromTimestamp($stripeInvoice->period_start) : null;
        $periodEnd = isset($stripeInvoice->period_end) ? Carbon::createFromTimestamp($stripeInvoice->period_end) : null;

        $year = date('Y');
        $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
        $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'site_subscription_id' => $siteSubscription->id,
            'stripe_invoice_id' => $latestInvoiceId,
            'number' => $number,
            'type' => 'subscription',
            'amount' => $amountPaid,
            'tax' => 0,
            'status' => 'paid',
            'billing_period_start' => $periodStart,
            'billing_period_end' => $periodEnd,
            'invoice_date' => now(),
            'metadata' => ['stripe_invoice' => $latestInvoiceId],
        ]);

        try {
            $pdfPath = app(InvoicePdfService::class)->generate($invoice);
            if ($pdfPath) {
                $invoice->update(['pdf_path' => $pdfPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }

        try {
            $xmlPath = app(InvoiceEInvoiceService::class)->generate($invoice);
            if ($xmlPath) {
                $invoice->update(['invoice_xml_path' => $xmlPath]);
            }
        } catch (\Throwable $e) {
            report($e);
        }

        $invoice->user->notify(new InvoiceCreatedNotification($invoice));
        Log::debug('Checkout success: invoice created', ['invoice_id' => $invoice->id]);
    }

    protected function getPriceIdForTemplate(Template $template): ?string
    {
        if ($template->stripe_price_id) {
            return $template->stripe_price_id;
        }

        $syncService = app(SyncTemplateStripePriceService::class);
        $priceId = $syncService->ensurePriceId($template);
        if ($priceId) {
            return $priceId;
        }

        return config('billing.default_meine_seiten_price_id');
    }
}
