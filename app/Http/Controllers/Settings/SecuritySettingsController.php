<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DestroyPinRequest;
use App\Http\Requests\Settings\StorePinRequest;
use App\Http\Requests\Settings\UpdatePinRequest;
use App\Http\Requests\Settings\UpdateSecuritySettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SecuritySettingsController extends Controller
{
    /**
     * Show the security settings page.
     */
    public function show(): Response
    {
        return Inertia::render('settings/Security');
    }

    /**
     * Update inactivity lock setting.
     */
    public function update(UpdateSecuritySettingsRequest $request): RedirectResponse
    {
        $request->user()->update([
            'inactivity_lock_minutes' => (int) $request->inactivity_lock_minutes,
        ]);

        return back();
    }

    /**
     * Store (enable) the user's PIN.
     */
    public function storePin(StorePinRequest $request): RedirectResponse
    {
        $user = $request->user();
        $pin = $request->pin;

        $user->update([
            'pin_hash' => Hash::make($pin),
            'pin_length' => strlen($pin),
        ]);

        return back();
    }

    /**
     * Update (change) the user's PIN.
     */
    public function updatePin(UpdatePinRequest $request): RedirectResponse
    {
        $user = $request->user();
        $pin = $request->pin;

        $user->update([
            'pin_hash' => Hash::make($pin),
            'pin_length' => strlen($pin),
        ]);

        return back();
    }

    /**
     * Remove the user's PIN.
     */
    public function destroyPin(DestroyPinRequest $request): RedirectResponse
    {
        $request->user()->update([
            'pin_hash' => null,
            'pin_length' => null,
            'pin_failed_attempts' => 0,
            'pin_lockout_until' => null,
        ]);

        return back();
    }
}
