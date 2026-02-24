<?php

namespace App\Http\Controllers;

use App\Models\GameServerAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GamingAccountController extends Controller
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

        return Inertia::render('gaming-accounts/Index', [
            'gameServerAccounts' => $accounts,
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

        return Inertia::render('gaming-accounts/Show', [
            'gameServerAccount' => $gameServerAccount,
            'loginUrl' => $loginUrl,
        ]);
    }
}
