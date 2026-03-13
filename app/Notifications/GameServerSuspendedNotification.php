<?php

namespace App\Notifications;

use App\Models\GameServerAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class GameServerSuspendedNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public GameServerAccount $gameServerAccount
    ) {}

    public static function notificationType(): string
    {
        return 'game_server_suspended';
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
        $showUrl = route('gaming-accounts.show', $this->gameServerAccount);

        return [
            'content' => [
                'subject' => 'Ihr Game-Server „'.$this->gameServerAccount->name.'" wurde gesperrt',
                'greeting' => 'Hallo '.$notifiable->name.',',
                'body' => 'Die Laufzeit für Ihren Game-Server **'.$this->gameServerAccount->name."** ist abgelaufen.\nDer Server wurde gesperrt und kann nicht mehr gesteuert werden. Innerhalb der Kulanzfrist können Sie den Server durch Verlängerung wieder freischalten.\nBitte handeln Sie zeitnah.",
                'action_text' => 'Server verlängern',
            ],
            'actionUrl' => $showUrl,
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
