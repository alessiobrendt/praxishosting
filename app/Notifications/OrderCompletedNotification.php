<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OrderCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Site $site
    ) {}

    public static function notificationType(): string
    {
        return 'order_completed';
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
        $url = route('sites.show', $this->site);
        $template = EmailTemplate::find('order_completed');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->site->name,
            'site_url' => $url,
        ]) ?? $this->defaultContent($notifiable, $url);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $url : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable, string $siteUrl): array
    {
        return [
            'subject' => 'Ihre Bestellung wurde abgeschlossen',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => "Ihre Bestellung wurde erfolgreich abgeschlossen.\nIhre Webseite **".$this->site->name."** wurde eingerichtet.\nVielen Dank für Ihr Vertrauen.",
            'action_text' => 'Zur Webseite',
        ];
    }
}
