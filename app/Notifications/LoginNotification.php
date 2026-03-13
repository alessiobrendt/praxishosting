<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LoginNotification extends Notification
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public string $loginAt
    ) {}

    public static function notificationType(): string
    {
        return 'login';
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
        $template = EmailTemplate::find('login');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'login_at' => $this->loginAt,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? route('dashboard') : null,
        ];
    }

    /**
     * @return array{content: string}
     */
    public function toDiscord(object $notifiable): array
    {
        return $this->discordPayloadFromMail($notifiable);
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Sie haben sich eingeloggt',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Sie haben sich am '.$this->loginAt." in Ihr Konto eingeloggt.\nFalls Sie das nicht waren, ändern Sie bitte umgehend Ihr Passwort.",
            'action_text' => 'Zum Dashboard',
        ];
    }
}
