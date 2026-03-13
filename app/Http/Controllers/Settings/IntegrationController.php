<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationController extends Controller
{
    /**
     * Show the integration settings page (Discord connect/disconnect).
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/Integration', [
            'discordConnected' => ! empty($user->discord_id),
            'discordConnectUrl' => route('auth.discord.connect'),
        ]);
    }

    /**
     * Disconnect Discord from the current user's account.
     */
    public function disconnectDiscord(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->update(['discord_id' => null]);

        return redirect()->route('integration.show')->with('success', 'Discord wurde getrennt.');
    }
}
