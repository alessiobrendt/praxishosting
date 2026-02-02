<?php

namespace App\Http\Middleware;

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

        return [
            ...parent::share($request),
            'name' => Setting::get('app_name') ?: config('app.name'),
            'auth' => [
                'user' => $user,
                'pinVerifiedAt' => $user && $user->hasPin() ? $request->session()->get('pin_verified_at') : null,
                'openTicketsCount' => $openTicketsCount,
                'adminOpenTicketsCount' => $adminOpenTicketsCount,
                'activeUserModules' => $activeUserModules,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
