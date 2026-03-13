<?php

namespace App\Notifications\Channels;

use App\Services\DiscordApiService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class DiscordChannel
{
    public function __construct(
        private DiscordApiService $discord
    ) {}

    /**
     * Send the given notification via Discord DM.
     * Expects the notification to implement toDiscord(object $notifiable): array{content?: string, embeds?: array}
     * or toDiscord(object $notifiable): string (used as content).
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $discordId = $notifiable->routeNotificationFor('discord', $notification);
        if (! $discordId || $discordId === '') {
            Log::warning('Discord notification not sent: User has no discord_id. User must connect Discord under Einstellungen → Integration.', [
                'notifiable_type' => $notifiable::class,
                'notifiable_id' => $notifiable->id ?? null,
            ]);

            return;
        }

        $payload = $notification->toDiscord($notifiable);
        if (is_string($payload)) {
            $payload = ['content' => $payload];
        }
        if (empty($payload['content']) && empty($payload['embeds'] ?? [])) {
            Log::warning('Discord notification not sent: empty payload from toDiscord()', [
                'notification' => $notification::class,
            ]);

            return;
        }

        $sent = $this->discord->sendDm($discordId, $payload);
        if (! $sent) {
            Log::warning('Discord notification sendDm returned false. Check storage/logs/laravel.log and Discord API (e.g. bot token, user must have shared a server with the bot to receive DMs).', [
                'notification' => $notification::class,
                'discord_user_id' => $discordId,
            ]);
        }
    }
}
