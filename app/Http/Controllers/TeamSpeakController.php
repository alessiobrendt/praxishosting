<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\HostingPlan;
use App\Services\BalancePaymentService;
use App\Services\HostingPlanOptionSurchargeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamSpeakController extends Controller
{
    /**
     * Format a hosting plan for the frontend (Index/Checkout).
     *
     * @return array{id: int, name: string, price: string, config: array}
     */
    protected static function planForFrontend(HostingPlan $plan): array
    {
        $config = $plan->config ?? [];
        if (! is_array($config)) {
            $config = [];
        }
        if (! isset($config['plan_options']) || ! is_array($config['plan_options'])) {
            $config['plan_options'] = [];
        }

        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => (string) $plan->price,
            'config' => $config,
        ];
    }

    protected function ensureTeamSpeakFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];

        if (! ($features['teamspeak'] ?? false) && ! ($features['gaming'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'TeamSpeak-Server werden für diese Marke nicht angeboten.');
        }

        return null;
    }

    /**
     * List active TeamSpeak plans for the current brand.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;

        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where('panel_type', 'teamspeak')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('teamspeak/Index', [
            'hostingPlans' => $plans->map(fn (HostingPlan $p) => self::planForFrontend($p)),
        ]);
    }

    /**
     * Checkout form: plan selection and optional server name.
     */
    public function checkout(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;

        $planId = $request->query('plan');
        $plan = $planId ? HostingPlan::query()
            ->where('panel_type', 'teamspeak')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->find($planId) : null;
        if ($planId && ! $plan) {
            return redirect()->route('teamspeak.index')->with('error', 'Paket nicht gefunden.');
        }

        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where('panel_type', 'teamspeak')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $payload = [
            'hostingPlans' => $plans->map(fn (HostingPlan $p) => self::planForFrontend($p)),
            'selectedPlan' => $plan ? self::planForFrontend($plan) : null,
        ];
        if ($brandFeatures['prepaid_balance'] ?? false) {
            $customerBalance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $optionSurcharge = 0.0;
            $optionChoices = [];
            if ($plan) {
                $optionSurchargeService = app(HostingPlanOptionSurchargeService::class);
                $optionChoices = $optionSurchargeService->validateOptionChoices($plan, $request->old('option_choices', []));
                $optionSurcharge = $optionSurchargeService->computeSurcharge($plan, $optionChoices);
            }
            $basePrice = $plan ? (float) $plan->price : 0.0;
            $payload['canPayWithBalance'] = true;
            $payload['customerBalance'] = $customerBalance ? (float) $customerBalance->balance : 0.0;
            $payload['amountRequired'] = round($basePrice + $optionSurcharge, 2);
        }

        return Inertia::render('teamspeak/Checkout', $payload);
    }

    /**
     * Store checkout session and redirect to Mollie or process balance payment.
     */
    public function storeCheckout(Request $request): RedirectResponse
    {
        $redirect = $this->ensureTeamSpeakFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $validated = $request->validate([
            'hosting_plan_id' => ['required', 'exists:hosting_plans,id'],
            'server_name' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['nullable', 'string', 'in:stripe,balance'],
            'option_choices' => ['nullable', 'array'],
            'option_choices.*' => ['nullable'],
        ]);

        $plan = HostingPlan::find($validated['hosting_plan_id']);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'teamspeak') {
            return redirect()->route('teamspeak.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $brand = $request->attributes->get('current_brand');
        if ($brand !== null && $plan->brand_id !== $brand->id) {
            return redirect()->route('teamspeak.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $optionSurchargeService = app(HostingPlanOptionSurchargeService::class);
        $optionChoices = $optionSurchargeService->validateOptionChoices($plan, $validated['option_choices'] ?? []);
        $surcharge = $optionSurchargeService->computeSurcharge($plan, $optionChoices);
        $basePrice = (float) $plan->price;
        $totalAmount = round($basePrice + $surcharge, 2);

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $paymentMethod = $validated['payment_method'] ?? 'stripe';

        if ($paymentMethod === 'balance' && ($brandFeatures['prepaid_balance'] ?? false)) {
            $user = $request->user();
            if ($totalAmount > 0) {
                try {
                    app(BalancePaymentService::class)->pay($user, $totalAmount, 'teamspeak', 'TeamSpeak-Server: '.$plan->name, [
                        'description' => 'TeamSpeak-Server '.$plan->name.' – '.($validated['server_name'] ?? $plan->name),
                    ]);
                } catch (InsufficientBalanceException $e) {
                    return redirect()->route('teamspeak.checkout', ['plan' => $plan->id])
                        ->with('error', $e->getMessage());
                }
            }

            $payload = [
                'hosting_plan_id' => $plan->id,
                'user_id' => $user->id,
                'server_name' => $validated['server_name'] ?? null,
                'option_choices' => $optionChoices,
            ];
            $request->session()->forget('checkout_teamspeak');

            return app(CheckoutController::class)->processTeamSpeakBalanceCheckout($request, $user, $payload);
        }

        $payload = [
            'hosting_plan_id' => $plan->id,
            'user_id' => $request->user()->id,
            'server_name' => $validated['server_name'] ?? null,
            'option_choices' => $optionChoices,
            'option_surcharge' => $surcharge,
            'total_amount' => $totalAmount,
        ];
        $request->session()->put('checkout_teamspeak', $payload);

        return app(CheckoutController::class)->buildTeamSpeakCheckoutRedirect($request, $payload);
    }
}
