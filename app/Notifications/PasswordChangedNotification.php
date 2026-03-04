<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $changedAt
    ) {}

    /**
     * @return array<int, string>
     */
    public static function notificationType(): string
    {
        return 'password_changed';
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
        $template = EmailTemplate::find('password_changed');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'changed_at' => $this->changedAt,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Ihr Passwort wurde geändert',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihr Passwort wurde am **'.$this->changedAt."** geändert.\nFalls Sie das nicht waren, wenden Sie sich bitte umgehend an uns.",
            'action_text' => null,
        ];
    }
}
