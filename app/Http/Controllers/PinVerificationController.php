<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifyPinRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PinVerificationController extends Controller
{
    /**
     * Verify the user's PIN and unlock the session.
     */
    public function store(VerifyPinRequest $request): RedirectResponse|JsonResponse
    {
        $user = $request->user()->fresh();

        if ($user->pin_lockout_until && $user->pin_lockout_until->isFuture()) {
            throw ValidationException::withMessages([
                'pin' => [
                    __('Zu viele Fehlversuche. Bitte versuchen Sie es in :minutes Minuten erneut.', [
                        'minutes' => (int) ceil($user->pin_lockout_until->diffInSeconds(now()) / 60),
                    ]),
                ],
            ]);
        }

        if (! Hash::check($request->pin, $user->pin_hash)) {
            $maxAttempts = config('security.pin.max_attempts', 5);
            $lockoutMinutes = config('security.pin.lockout_minutes', 15);

            $user->increment('pin_failed_attempts');

            if ($user->fresh()->pin_failed_attempts >= $maxAttempts) {
                $user->update([
                    'pin_failed_attempts' => 0,
                    'pin_lockout_until' => now()->addMinutes($lockoutMinutes),
                ]);

                throw ValidationException::withMessages([
                    'pin' => [
                        __('Zu viele Fehlversuche. Bitte versuchen Sie es in :minutes Minuten erneut.', [
                            'minutes' => $lockoutMinutes,
                        ]),
                    ],
                ]);
            }

            throw ValidationException::withMessages([
                'pin' => [__('Die eingegebene PIN ist falsch.')],
            ]);
        }

        $user->update([
            'pin_failed_attempts' => 0,
            'pin_lockout_until' => null,
        ]);

        $request->session()->put('pin_verified_at', now()->timestamp);

        if ($request->wantsJson()) {
            return response()->json(['verified' => true]);
        }

        return back();
    }
}
