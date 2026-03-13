<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\DiscountCode;
use App\Models\GameserverCloudPlan;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Services\BalancePaymentService;
use App\Services\ControlPanels\PterodactylClient;
use App\Services\DiscountCodeService;
use App\Services\HostingPlanOptionSurchargeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GamingController extends Controller
{
    /**
     * Format a hosting plan for the gaming frontend (Index/Checkout) so config and plan_options are always present.
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
     * List active Pterodactyl (gaming) plans for the current brand.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;

        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where('panel_type', 'pterodactyl')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('gaming/Index', [
            'hostingPlans' => $plans->map(fn (HostingPlan $p) => self::planForFrontend($p)),
        ]);
    }

    /**
     * Checkout form: plan selection and optional server name.
     */
    public function checkout(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;

        $planId = $request->query('plan');
        $plan = $planId ? HostingPlan::query()
            ->where('panel_type', 'pterodactyl')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->find($planId) : null;
        if ($planId && ! $plan) {
            return redirect()->route('gaming.index')->with('error', 'Paket nicht gefunden.');
        }

        $plans = HostingPlan::query()
            ->where('is_active', true)
            ->where('panel_type', 'pterodactyl')
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
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

        return Inertia::render('gaming/Checkout', $payload);
    }

    /**
     * Return nests for the plan's panel (for dynamic option in checkout). Used when plan has option with source pterodactyl_nests.
     */
    public function pterodactylNests(Request $request): JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $planId = $request->integer('hosting_plan_id');
        if ($planId < 1) {
            return response()->json(['nests' => []]);
        }

        $plan = HostingPlan::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->find($planId);
        if (! $plan || ! $plan->hosting_server_id) {
            return response()->json(['nests' => []]);
        }

        $server = HostingServer::query()
            ->where('id', $plan->hosting_server_id)
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->first();
        if (! $server) {
            return response()->json(['nests' => []]);
        }

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($server);
            $nestsRaw = $client->getNests();
            $nests = [];
            foreach ($nestsRaw as $n) {
                $attrs = is_array($n) ? ($n['attributes'] ?? $n) : (array) $n;
                $id = (int) ($attrs['id'] ?? 0);
                $name = (string) ($attrs['name'] ?? 'Nest '.$id);
                if ($id > 0) {
                    $nests[] = ['id' => $id, 'name' => $name];
                }
            }

            return response()->json(['nests' => $nests]);
        } catch (\Throwable) {
            return response()->json(['nests' => []]);
        }
    }

    /**
     * Return eggs for a nest (for dynamic option in checkout). Used when plan has option with source pterodactyl_eggs.
     */
    public function pterodactylEggs(Request $request): JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $planId = $request->integer('hosting_plan_id');
        $nestId = $request->integer('nest_id');
        if ($planId < 1 || $nestId < 1) {
            return response()->json(['eggs' => []]);
        }

        $plan = HostingPlan::query()
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->find($planId);
        if (! $plan || ! $plan->hosting_server_id) {
            return response()->json(['eggs' => []]);
        }

        $server = HostingServer::query()
            ->where('id', $plan->hosting_server_id)
            ->where('panel_type', 'pterodactyl')
            ->where('is_active', true)
            ->first();
        if (! $server) {
            return response()->json(['eggs' => []]);
        }

        try {
            $client = app(PterodactylClient::class);
            $client->setServer($server);
            $eggsRaw = $client->getEggs($nestId);
            $eggs = [];
            foreach ($eggsRaw as $e) {
                $attrs = is_array($e) ? ($e['attributes'] ?? $e) : (array) $e;
                $id = (int) ($attrs['id'] ?? 0);
                $name = (string) ($attrs['name'] ?? 'Egg '.$id);
                if ($id > 0) {
                    $eggs[] = ['id' => $id, 'name' => $name];
                }
            }

            return response()->json(['eggs' => $eggs]);
        } catch (\Throwable) {
            return response()->json(['eggs' => []]);
        }
    }

    /**
     * Store checkout session and redirect to Stripe or process balance payment.
     */
    public function storeCheckout(Request $request): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $validated = $request->validate([
            'hosting_plan_id' => ['required', 'exists:hosting_plans,id'],
            'server_name' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['nullable', 'string', 'in:mollie,balance'],
            'discount_code' => ['nullable', 'string', 'max:255'],
            'option_choices' => ['nullable', 'array'],
            'option_choices.*' => ['nullable'],
            'period_months' => ['required', 'integer', 'in:1,3,6'],
            'accept_tos' => ['required', 'accepted'],
            'accept_early_execution' => ['required', 'accepted'],
        ], [
            'accept_tos.accepted' => 'Bitte bestätigen Sie die AGB und Datenschutzerklärung.',
            'accept_early_execution.accepted' => 'Bitte bestätigen Sie den Widerrufsverzicht.',
        ]);

        $plan = HostingPlan::find($validated['hosting_plan_id']);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'pterodactyl') {
            return redirect()->route('gaming.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $brand = $request->attributes->get('current_brand');
        if ($brand !== null && $plan->brand_id !== $brand->id) {
            return redirect()->route('gaming.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $optionSurchargeService = app(HostingPlanOptionSurchargeService::class);
        $optionChoices = $optionSurchargeService->validateOptionChoices($plan, $validated['option_choices'] ?? []);
        $surcharge = $optionSurchargeService->computeSurcharge($plan, $optionChoices);
        $basePrice = (float) $plan->price;
        $periodMonths = (int) $validated['period_months'];
        $totalAmount = round(($basePrice + $surcharge) * $periodMonths, 2);

        $discountCodeId = null;
        $discountCodeService = app(DiscountCodeService::class);
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
                app(BalancePaymentService::class)->pay($user, $totalAmount, 'game_server', 'Game-Server: '.$plan->name, [
                    'description' => 'Game-Server '.$plan->name.' – '.($validated['server_name'] ?? $plan->name),
                ]);
            } catch (InsufficientBalanceException $e) {
                return redirect()->route('gaming.checkout', ['plan' => $plan->id])
                    ->with('error', $e->getMessage());
            }

            $payload = [
                'hosting_plan_id' => $plan->id,
                'user_id' => $user->id,
                'server_name' => $validated['server_name'] ?? null,
                'option_choices' => $optionChoices,
                'period_months' => $periodMonths,
            ];
            $request->session()->forget('checkout_gaming');
            if ($discountCodeId !== null) {
                $dc = DiscountCode::find($discountCodeId);
                if ($dc) {
                    $discountCodeService->incrementRedemption($dc);
                }
            }

            return app(CheckoutController::class)->processGamingBalanceCheckout($request, $user, $payload);
        }

        $payload = [
            'hosting_plan_id' => $plan->id,
            'user_id' => $request->user()->id,
            'server_name' => $validated['server_name'] ?? null,
            'option_choices' => $optionChoices,
            'option_surcharge' => $surcharge,
            'total_amount' => $totalAmount,
            'period_months' => $periodMonths,
            'discount_code_id' => $discountCodeId,
        ];
        $request->session()->put('checkout_gaming', $payload);

        return app(CheckoutController::class)->buildGamingCheckoutRedirect($request, $payload);
    }

    protected function ensureGameserverCloudFeature(Request $request): ?RedirectResponse
    {
        $brand = $request->attributes->get('current_brand');
        $features = $brand?->getFeaturesArray() ?? [];
        if (! ($features['gameserver_cloud'] ?? false)) {
            return redirect()->route('dashboard')->with('error', 'Gameserver Cloud wird für diese Marke nicht angeboten.');
        }

        return null;
    }

    /**
     * List active Gameserver Cloud plans for the current brand.
     */
    public function cloudIndex(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;

        $plans = GameserverCloudPlan::query()
            ->where('is_active', true)
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('gaming/cloud/Index', [
            'gameserverCloudPlans' => $plans->map(fn (GameserverCloudPlan $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (string) $p->price,
                'config' => $p->config ?? [],
            ]),
        ]);
    }

    /**
     * Checkout form for one Gameserver Cloud plan (period selection).
     */
    public function cloudCheckout(Request $request): Response|RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $brand = $request->attributes->get('current_brand');
        $brandId = $brand?->id;
        $planId = $request->route('plan') ? (int) $request->route('plan') : null;
        $plan = $planId ? GameserverCloudPlan::query()
            ->where('is_active', true)
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->find($planId) : null;
        if ($planId && ! $plan) {
            return redirect()->route('gaming.cloud.index')->with('error', 'Plan nicht gefunden.');
        }

        $plans = GameserverCloudPlan::query()
            ->where('is_active', true)
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $config = is_array($plan?->config) ? $plan->config : [];
        if (! isset($config['plan_options']) || ! is_array($config['plan_options'])) {
            $config['plan_options'] = [];
        }
        $selectedPlanForFrontend = $plan ? [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => (string) $plan->price,
            'config' => $config,
        ] : null;

        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
        $payload = [
            'gameserverCloudPlans' => $plans->map(fn (GameserverCloudPlan $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (string) $p->price,
                'config' => $p->config ?? [],
            ]),
            'selectedPlan' => $selectedPlanForFrontend,
            'tosUrl' => config('billing.tos_url', '#'),
            'privacyUrl' => config('billing.privacy_url', '#'),
        ];
        if ($brandFeatures['prepaid_balance'] ?? false) {
            $customerBalance = CustomerBalance::where('user_id', $request->user()->id)->first();
            $payload['canPayWithBalance'] = true;
            $payload['customerBalance'] = $customerBalance ? (float) $customerBalance->balance : 0.0;
            $payload['amountRequired'] = $plan ? (float) $plan->price : 0.0;
        }

        return Inertia::render('gaming/cloud/Checkout', $payload);
    }

    /**
     * Store cloud checkout session or process balance payment, then redirect.
     */
    public function storeCloudCheckout(Request $request): RedirectResponse
    {
        $redirect = $this->ensureGameserverCloudFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        $validated = $request->validate([
            'gameserver_cloud_plan_id' => ['required', 'exists:gameserver_cloud_plans,id'],
            'option_choices' => ['nullable', 'array'],
            'option_choices.*' => ['nullable'],
            'payment_method' => ['nullable', 'string', 'in:mollie,balance'],
            'discount_code' => ['nullable', 'string', 'max:255'],
            'period_months' => ['required', 'integer', 'in:1,3,6,12'],
            'accept_tos' => ['required', 'accepted'],
            'accept_early_execution' => ['required', 'accepted'],
        ], [
            'accept_tos.accepted' => 'Bitte bestätigen Sie die AGB und Datenschutzerklärung.',
            'accept_early_execution.accepted' => 'Bitte bestätigen Sie den Widerrufsverzicht.',
        ]);

        $plan = GameserverCloudPlan::find($validated['gameserver_cloud_plan_id']);
        if (! $plan || ! $plan->is_active) {
            return redirect()->route('gaming.cloud.index')->with('error', 'Plan nicht verfügbar.');
        }

        $brand = $request->attributes->get('current_brand');
        if ($brand !== null && $plan->brand_id !== $brand->id) {
            return redirect()->route('gaming.cloud.index')->with('error', 'Plan nicht verfügbar.');
        }

        $optionSurchargeService = app(HostingPlanOptionSurchargeService::class);
        $config = is_array($plan->config) ? $plan->config : [];
        $optionChoices = $optionSurchargeService->validateOptionChoicesFromConfig($config, $validated['option_choices'] ?? []);
        $optionSurcharge = $optionSurchargeService->computeSurchargeFromConfig($config, $optionChoices);

        $periodMonths = (int) $validated['period_months'];
        $basePrice = (float) $plan->price;
        $monthlyTotal = $basePrice + $optionSurcharge;
        $totalAmount = round($monthlyTotal * $periodMonths, 2);

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
            if ($totalAmount > 0) {
                try {
                    app(BalancePaymentService::class)->pay($user, $totalAmount, 'gameserver_cloud', 'Gameserver Cloud: '.$plan->name, [
                        'description' => 'Gameserver Cloud '.$plan->name.' – '.$periodMonths.' Monat(e)',
                    ]);
                } catch (InsufficientBalanceException $e) {
                    return redirect()->route('gaming.cloud.checkout', ['plan' => $plan->id])
                        ->with('error', $e->getMessage());
                }
            }

            $payload = [
                'gameserver_cloud_plan_id' => $plan->id,
                'user_id' => $user->id,
                'period_months' => $periodMonths,
                'option_choices' => $optionChoices,
                'option_surcharge' => $optionSurcharge,
            ];
            $request->session()->forget('checkout_cloud_gaming');
            if ($discountCodeId !== null) {
                $dc = DiscountCode::find($discountCodeId);
                if ($dc) {
                    $discountCodeService->incrementRedemption($dc);
                }
            }

            return app(CheckoutController::class)->processCloudGamingBalanceCheckout($request, $user, $payload);
        }

        $payload = [
            'gameserver_cloud_plan_id' => $plan->id,
            'user_id' => $request->user()->id,
            'period_months' => $periodMonths,
            'option_choices' => $optionChoices,
            'option_surcharge' => $optionSurcharge,
            'total_amount' => $totalAmount,
            'discount_code_id' => $discountCodeId,
        ];
        $request->session()->put('checkout_cloud_gaming', $payload);

        return app(CheckoutController::class)->buildCloudGamingCheckoutRedirect($request, $payload);
    }
}
