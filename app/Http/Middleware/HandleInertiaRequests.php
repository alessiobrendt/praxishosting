<?php

namespace App\Http\Middleware;

use App\Models\CustomerBalance;
use App\Models\Setting;
use App\Models\Ticket;
use App\Services\SiteRenderService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user && $user->hasPin() && ! $request->header('X-Inertia')) {
            $request->session()->forget('pin_verified_at');
        }

        $openTicketsCount = 0;
        $adminOpenTicketsCount = 0;
        if ($user) {
            if (! $user->isAdmin()) {
                $supportEnabled = filter_var(Setting::get('support_enabled', '1'), FILTER_VALIDATE_BOOLEAN);
                if ($supportEnabled) {
                    $openTicketsCount = Ticket::where('user_id', $user->id)
                        ->whereIn('status', ['open', 'in_progress', 'waiting_customer'])
                        ->count();
                }
            } else {
                $adminOpenTicketsCount = Ticket::whereIn('status', ['open', 'in_progress', 'waiting_customer'])
                    ->count();
            }
        }

        $activeUserModules = [];
        if ($user) {
            $activeUserModules = app(SiteRenderService::class)->getActiveModulesForUser($user);
        }

        $flash = array_filter([
            'error' => $request->session()->get('error'),
            'success' => $request->session()->get('success'),
            'info' => $request->session()->get('info'),
        ]);

        $currentBrand = $request->attributes->get('current_brand');
        if ($currentBrand === null && \App\Models\Brand::getDefault() !== null) {
            $currentBrand = \App\Models\Brand::getDefault();
        }
        $brandPayload = null;
        $brandFeatures = [];
        if ($currentBrand) {
            $brandPayload = [
                'key' => $currentBrand->key,
                'name' => $currentBrand->name,
                'logoUrl' => $currentBrand->logo_url,
                'themeColors' => $currentBrand->theme_colors,
            ];
            $brandFeatures = $currentBrand->getFeaturesArray();
        }

        $customerBalance = null;
        if ($user && ($brandFeatures['prepaid_balance'] ?? false)) {
            $row = CustomerBalance::where('user_id', $user->id)->first();
            $customerBalance = $row ? (float) $row->balance : 0.0;
        }

        $impersonating = $user && app()->bound('impersonate') && app('impersonate')->isImpersonating();

        $authPayload = [
            'user' => $user,
            'pinVerifiedAt' => $user && $user->hasPin() ? $request->session()->get('pin_verified_at') : null,
            'openTicketsCount' => $openTicketsCount,
            'adminOpenTicketsCount' => $adminOpenTicketsCount,
            'activeUserModules' => $activeUserModules,
            'impersonating' => $impersonating,
        ];
        if ($customerBalance !== null) {
            $authPayload['customerBalance'] = $customerBalance;
        }

        return [
            ...parent::share($request),
            'flash' => $flash,
            'name' => $currentBrand?->name ?? Setting::get('app_name') ?: config('app.name'),
            'brand' => $brandPayload,
            'brandFeatures' => $brandFeatures,
            'auth' => $authPayload,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
