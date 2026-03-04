<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SiteDeletedAfterGraceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $siteName
    ) {}

    /**
     * @return array<int, string>
     */
    public static function notificationType(): string
    {
        return 'site_deleted';
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
        $createUrl = route('sites.create');

        $template = EmailTemplate::find('site_deleted');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->siteName,
            'create_site_url' => $createUrl,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $createUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Ihre Webseite „'.$this->siteName.'" wurde gelöscht',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Die Webseite **'.$this->siteName."** wurde nach Ablauf der Kulanzfrist endgültig gelöscht.\nSie können jederzeit eine neue Webseite anlegen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
            'action_text' => 'Neue Webseite erstellen',
        ];
    }
}
