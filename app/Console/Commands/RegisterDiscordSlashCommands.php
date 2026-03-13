<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class RegisterDiscordSlashCommands extends Command
{
    protected $signature = 'discord:register-commands';

    protected $description = 'Registriert die Discord-Guild-Slash-Commands (z. B. /link)';

    private const API_BASE = 'https://discord.com/api/v10';

    public function handle(): int
    {
        $applicationId = config('services.discord.client_id');
        $guildId = config('services.discord.guild_id');
        $botToken = config('services.discord.bot_token');

        if (! $applicationId || ! $guildId || ! $botToken) {
            $this->error('DISCORD_CLIENT_ID, DISCORD_GUILD_ID und DISCORD_BOT_TOKEN müssen in .env gesetzt sein.');

            return self::FAILURE;
        }

        $commands = [
            [
                'name' => 'link',
                'description' => 'Konto mit Discord verknüpfen (nach Verbindung unter Einstellungen → Integration)',
                'type' => 1,
            ],
        ];

        $response = Http::withHeaders(['Authorization' => 'Bot '.$botToken])
            ->asJson()
            ->put(
                self::API_BASE.'/applications/'.$applicationId.'/guilds/'.$guildId.'/commands',
                $commands
            );

        if (! $response->successful()) {
            $this->error('Registrierung fehlgeschlagen: '.$response->body());

            return self::FAILURE;
        }

        $this->info('Discord-Slash-Commands erfolgreich registriert.');

        return self::SUCCESS;
    }
}
