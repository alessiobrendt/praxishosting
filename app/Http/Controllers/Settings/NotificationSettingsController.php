<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationSettingsController extends Controller
{
    /**
     * Show the notification preferences page (same types as Admin → E-Mails).
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $templates = EmailTemplate::query()->orderBy('key')->get(['key', 'name']);
        $brand = $user->brand;
        $discordAvailable = ($brand && is_array($brand->features) && ! empty($brand->features['discord_notifications']));

        return Inertia::render('settings/Notifications', [
            'templates' => $templates,
            'preferences' => $user->notification_preferences ?? [],
            'discordAvailable' => $discordAvailable,
        ]);
    }

    /**
     * Update the user's notification preferences.
     */
    public function update(Request $request): RedirectResponse
    {
        $validKeys = EmailTemplate::query()->pluck('key')->all();
        $rules = [
            'preferences' => ['required', 'array'],
        ];
        foreach ($validKeys as $key) {
            $rules["preferences.{$key}"] = ['nullable', 'in:none,email,discord'];
        }

        $validated = $request->validate($rules);

        $user = $request->user();
        $preferences = $user->notification_preferences ?? [];
        $newPreferences = $validated['preferences'] ?? [];

        foreach ($validKeys as $key) {
            if (array_key_exists($key, $newPreferences) && in_array($newPreferences[$key], ['none', 'email', 'discord'], true)) {
                $preferences[$key] = $newPreferences[$key];
            }
        }

        $user->notification_preferences = $preferences;
        $user->save();

        return redirect()->route('notifications.show')->with('success', 'Benachrichtigungseinstellungen gespeichert.');
    }
}
