<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\DiscountCode;
use App\Models\HostingPlan;
use App\Services\BalancePaymentService;
use App\Services\DiscountCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebspaceController extends Controller
{
    /**
     * List active webspace (Plesk) plans for customers. Excludes gaming (pterodactyl) plans.
     */
    public function index(): Response
    {
        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where(function ($q) {
                $q->where('panel_type', 'plesk')->orWhereNull('panel_type');
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('webspace/Index', [
            'hostingPlans' => $plans,
        ]);
    }

    /**
     * Checkout form: domain + plan (plan pre-selected via query). Only webspace (Plesk) plans.
     */
    public function checkout(Request $request): Response|RedirectResponse
    {
        $planId = $request->query('plan');
        $plan = $planId ? HostingPlan::query()
            ->where(function ($q) {
                $q->where('panel_type', 'plesk')->orWhereNull('panel_type');
            })
            ->find($planId) : null;
        if ($planId && ! $plan) {
            return redirect()->route('webspace.index')->with('error', 'Paket nicht gefunden.');
        }

        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where(function ($q) {
                $q->where('panel_type', 'plesk')->orWhereNull('panel_type');
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $payload = [
            'hostingPlans' => $plans,
            'selectedPlan' => $plan,
            'tosUrl' => config('billing.tos_url', '#'),
            'privacyUrl' => config('billing.privacy_url', '#'),
        ];
        if ($brandFeatures['prepaid_balance'] ?? false) {
            $customerBalance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $payload['canPayWithBalance'] = true;
            $payload['customerBalance'] = $customerBalance ? (float) $customerBalance->balance : 0.0;
            $payload['amountRequired'] = $plan ? (float) $plan->price : 0.0;
        }

        return Inertia::render('webspace/Checkout', $payload);
    }

    /**
     * Store checkout session and redirect to Stripe or process balance payment.
     */
    public function storeCheckout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hosting_plan_id' => ['required', 'exists:hosting_plans,id'],
            'domain' => ['required', 'string', 'max:253', 'regex:/^([a-z0-9]([a-z0-9\-]*[a-z0-9])?\.)+[a-z]{2,}$/i'],
            'payment_method' => ['nullable', 'string', 'in:mollie,balance'],
            'discount_code' => ['nullable', 'string', 'max:255'],
            'period_months' => ['required', 'integer', 'in:1,3,6'],
            'accept_tos' => ['required', 'accepted'],
            'accept_early_execution' => ['required', 'accepted'],
        ], [
            'domain.regex' => 'Bitte eine gültige Domain angeben (z. B. example.com).',
            'accept_tos.accepted' => 'Bitte bestätigen Sie die AGB und Datenschutzerklärung.',
            'accept_early_execution.accepted' => 'Bitte bestätigen Sie den Widerrufsverzicht.',
        ]);

        $plan = HostingPlan::find($validated['hosting_plan_id']);
        if (! $plan || ! $plan->is_active) {
            return redirect()->route('webspace.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $periodMonths = (int) $validated['period_months'];
        $basePrice = (float) $plan->price;
        $totalAmount = round($basePrice * $periodMonths, 2);

        $discountCodeService = app(DiscountCodeService::class);
        $discountCodeId = null;
        if (! empty($validated['discount_code'])) {
            $discountCode = $discountCodeService->resolve(trim($validated['discount_code']));
            if ($discountCode !== null) {
                $result = $discountCodeService->computeDiscount($discountCode, $totalAmount, $periodMonths);
                $totalAmount = $result['final_amount'];
                $discountCodeId = $discountCode->id;
            }
        }

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $paymentMethod = $validated['payment_method'] ?? 'mollie';

        if ($paymentMethod === 'balance' && ($brandFeatures['prepaid_balance'] ?? false)) {
            $user = $request->user();
            try {
                app(BalancePaymentService::class)->pay($user, $totalAmount, 'webspace', 'Webspace: '.$plan->name, [
                    'description' => 'Webspace '.$plan->name.' – '.$validated['domain'].' ('.$periodMonths.' Monat(e))',
                ]);
            } catch (InsufficientBalanceException $e) {
                return redirect()->route('webspace.checkout', ['plan' => $plan->id])
                    ->with('error', $e->getMessage());
            }

            $payload = [
                'hosting_plan_id' => $plan->id,
                'domain' => $validated['domain'],
                'user_id' => $user->id,
                'period_months' => $periodMonths,
            ];
            $request->session()->forget('checkout_webspace');
            if ($discountCodeId !== null) {
                $dc = DiscountCode::find($discountCodeId);
                if ($dc) {
                    $discountCodeService->incrementRedemption($dc);
                }
            }

            return app(CheckoutController::class)->processWebspaceBalanceCheckout($request, $user, $payload);
        }

        $payload = [
            'hosting_plan_id' => $plan->id,
            'domain' => $validated['domain'],
            'user_id' => $request->user()->id,
            'period_months' => $periodMonths,
            'total_amount' => $totalAmount,
            'discount_code_id' => $discountCodeId,
        ];
        $request->session()->put('checkout_webspace', $payload);

        return app(CheckoutController::class)->buildWebspaceCheckoutRedirect($request, $payload);
    }
}
