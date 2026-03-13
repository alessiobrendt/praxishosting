<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class GameServerDeletedAfterGraceNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public string $serverName
    ) {}

    public static function notificationType(): string
    {
        return 'game_server_deleted';
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        if (method_exists($notifiable, 'getPreferredNotificationChannels')) {
            return $notifiable->getPreferredNotificationChannels(self::notificationType());
        }

        return ['transactional_mail'];
    }

    /**
     * @return array{content: array{subject: string, greeting: string, body: string, action_text: string|null}, actionUrl: string|null}
     */
    public function toTransactionalMail(object $notifiable): array
    {
        $indexUrl = route('gaming-accounts.index');

        return [
            'content' => [
                'subject' => 'Ihr Game-Server „'.$this->serverName.'" wurde gelöscht',
                'greeting' => 'Hallo '.$notifiable->name.',',
                'body' => 'Der Game-Server **'.$this->serverName."** wurde nach Ablauf der Kulanzfrist endgültig gelöscht.\nSie können jederzeit einen neuen Game-Server bestellen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'Game-Server ansehen',
            ],
            'actionUrl' => $indexUrl,
        ];
    }

    /**
     * @return array{content: string}
     */
    public function toDiscord(object $notifiable): array
    {
        return $this->discordPayloadFromMail($notifiable);
    }
}
