<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TeamSpeakDeletedAfterGraceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $serverName
    ) {}

    public static function notificationType(): string
    {
        return 'team_speak_deleted';
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
        $indexUrl = route('teamspeak-accounts.index');

        return [
            'content' => [
                'subject' => 'Ihr TeamSpeak-Server „'.$this->serverName.'" wurde gelöscht',
                'greeting' => 'Hallo '.$notifiable->name.',',
                'body' => 'Der TeamSpeak-Server **'.$this->serverName."** wurde nach Ablauf der Kulanzfrist endgültig gelöscht.\nSie können jederzeit einen neuen TeamSpeak-Server bestellen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'TeamSpeak-Server ansehen',
            ],
            'actionUrl' => $indexUrl,
        ];
    }
}
