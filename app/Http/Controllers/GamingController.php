<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\HostingPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GamingController extends Controller
{
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
            'hostingPlans' => $plans,
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

        return Inertia::render('gaming/Checkout', [
            'hostingPlans' => $plans,
            'selectedPlan' => $plan,
        ]);
    }

    /**
     * Store checkout session and redirect to Stripe for game server.
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
        ]);

        $plan = HostingPlan::find($validated['hosting_plan_id']);
        if (! $plan || ! $plan->is_active || $plan->panel_type !== 'pterodactyl') {
            return redirect()->route('gaming.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $brand = $request->attributes->get('current_brand');
        if ($brand !== null && $plan->brand_id !== $brand->id) {
            return redirect()->route('gaming.checkout')->with('error', 'Paket nicht verfügbar.');
        }

        $payload = [
            'hosting_plan_id' => $plan->id,
            'user_id' => $request->user()->id,
            'server_name' => $validated['server_name'] ?? null,
        ];
        $request->session()->put('checkout_gaming', $payload);

        return app(CheckoutController::class)->buildGamingCheckoutRedirect($request, $payload);
    }
}
