<?php

namespace App\Http\Controllers;

use App\Models\GameServerAccount;
use App\Services\ControlPanels\PterodactylClient;
use Illuminate\Http\JsonResponse;
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

        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        return Inertia::render('gaming-accounts/Show', [
            'gameServerAccount' => $gameServerAccount,
            'loginUrl' => $loginUrl,
            'userEmail' => $request->user()->email,
            'serverOverview' => $serverOverview,
        ]);
    }

    /**
     * Send power action (start, stop, restart) to the game server. Only owner.
     */
    public function power(Request $request, GameServerAccount $gameServerAccount): RedirectResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return $redirect;
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            abort(404);
        }

        $action = $request->input('action', '');
        if (! in_array($action, ['start', 'stop', 'restart'], true)) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Ungültige Aktion.');
        }

        try {
            $client = app(PterodactylClient::class);
            $client->sendPowerAction($gameServerAccount, $action);
        } catch (\Throwable $e) {
            return redirect()
                ->route('gaming-accounts.show', $gameServerAccount)
                ->with('error', 'Aktion fehlgeschlagen: '.$e->getMessage());
        }

        return redirect()
            ->route('gaming-accounts.show', $gameServerAccount)
            ->with('success', 'Befehl gesendet.');
    }

    /**
     * Return current server overview (for live polling). Only owner.
     */
    public function overview(Request $request, GameServerAccount $gameServerAccount): JsonResponse
    {
        $redirect = $this->ensureGamingFeature($request);
        if ($redirect !== null) {
            return response()->json(['error' => 'unauthorized'], 403);
        }

        if ($gameServerAccount->user_id !== $request->user()->id) {
            return response()->json(['error' => 'not found'], 404);
        }

        $gameServerAccount->load('hostingServer');
        $serverOverview = null;
        if ($gameServerAccount->identifier && $gameServerAccount->hostingServer) {
            try {
                $client = app(PterodactylClient::class);
                $serverOverview = $client->getServerOverview($gameServerAccount);
            } catch (\Throwable) {
                // keep null
            }
        }

        return response()->json(['serverOverview' => $serverOverview]);
    }
}
