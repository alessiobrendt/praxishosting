<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Services\DiscordApiService;
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
            'discordConnected' => ! empty($user->discord_id),
            'discordConsentGiven' => $user->discord_notification_consent_at !== null,
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
            'discord_consent_accepted' => ['sometimes', 'boolean'],
        ];
        foreach ($validKeys as $key) {
            $rules["preferences.{$key}"] = ['nullable', 'in:none,email,discord,email_discord'];
        }

        $validated = $request->validate($rules);

        $user = $request->user();
        $preferences = $user->notification_preferences ?? [];
        $newPreferences = $validated['preferences'] ?? [];
        $allowedValues = ['none', 'email', 'discord', 'email_discord'];

        $wantsDiscord = static function (string $value): bool {
            return $value === 'discord' || $value === 'email_discord';
        };
        $needsConsent = $user->discord_notification_consent_at === null;
        $hasDiscordPreference = false;
        foreach ($validKeys as $key) {
            if (array_key_exists($key, $newPreferences) && in_array($newPreferences[$key], $allowedValues, true)) {
                if ($wantsDiscord($newPreferences[$key])) {
                    $hasDiscordPreference = true;
                }
                $preferences[$key] = $newPreferences[$key];
            }
        }

        if ($hasDiscordPreference && $needsConsent) {
            if (! ($validated['discord_consent_accepted'] ?? false)) {
                return redirect()->back()->withErrors([
                    'discord_consent' => 'Um Discord-Benachrichtigungen zu nutzen, ist Ihre Zustimmung erforderlich.',
                ]);
            }
            $user->discord_notification_consent_at = now();
        }

        $user->notification_preferences = $preferences;
        $user->save();

        if ($hasDiscordPreference && ! empty($user->discord_id)) {
            $roleId = config('services.discord.customer_role_id');
            if (! empty($roleId)) {
                app(DiscordApiService::class)->addRoleToMember($user->discord_id, $roleId);
            }
        }

        return redirect()->route('notifications.show')->with('success', 'Benachrichtigungseinstellungen gespeichert.');
    }
}
