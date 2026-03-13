<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DiscordApiService
{
    private const API_BASE = 'https://discord.com/api/v10';

    /**
     * Send a direct message to a Discord user by ID.
     *
     * @param  array{content?: string, embeds?: array<int, array<string, mixed>>}  $payload  Message content and/or embeds (Discord API format).
     */
    public function sendDm(string $discordUserId, array $payload): bool
    {
        $token = config('services.discord.bot_token');
        if (! $token) {
            Log::warning('Discord DM not sent: DISCORD_BOT_TOKEN not configured');

            return false;
        }

        $channel = $this->createDmChannel($discordUserId);
        if ($channel === null) {
            return false;
        }

        $response = Http::withHeaders(['Authorization' => 'Bot '.$token])
            ->asJson()
            ->post(self::API_BASE.'/channels/'.$channel.'/messages', $payload);

        if (! $response->successful()) {
            Log::warning('Discord DM message failed', [
                'discord_user_id' => $discordUserId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    /**
     * Create a DM channel with the given user. Returns the channel ID or null on failure.
     */
    private function createDmChannel(string $discordUserId): ?string
    {
        $token = config('services.discord.bot_token');
        if (! $token) {
            return null;
        }

        $response = Http::withHeaders(['Authorization' => 'Bot '.$token])
            ->asJson()
            ->post(self::API_BASE.'/users/@me/channels', [
                'recipient_id' => $discordUserId,
            ]);

        if (! $response->successful()) {
            Log::warning('Discord create DM channel failed. User may need to share a server with the bot or allow DMs.', [
                'discord_user_id' => $discordUserId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        $data = $response->json();
        $id = $data['id'] ?? null;

        return $id ? (string) $id : null;
    }

    /**
     * Add a role to a guild member. Fails silently (logs only) if user is not on the server or on API error.
     */
    public function addRoleToMember(string $discordUserId, string $roleId): bool
    {
        $token = config('services.discord.bot_token');
        $guildId = config('services.discord.guild_id');
        if (! $token || ! $guildId) {
            Log::warning('Discord add role skipped: bot_token or guild_id not configured');

            return false;
        }

        $response = Http::withHeaders(['Authorization' => 'Bot '.$token])
            ->put(self::API_BASE.'/guilds/'.$guildId.'/members/'.$discordUserId.'/roles/'.$roleId);

        if (! $response->successful()) {
            Log::warning('Discord add role to member failed', [
                'discord_user_id' => $discordUserId,
                'role_id' => $roleId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        }

        return true;
    }
}
