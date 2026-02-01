<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SiteSuspendedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Site $site
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $billingUrl = route('billing.portal');

        $template = EmailTemplate::find('site_suspended');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->site->name,
            'billing_portal_url' => $billingUrl,
        ]) ?? $this->defaultContent($notifiable);

        $mail = (new MailMessage)
            ->subject($content['subject'])
            ->greeting($content['greeting']);

        foreach (explode("\n", $content['body']) as $line) {
            $mail->line(trim($line) !== '' ? $line : ' ');
        }

        if ($content['action_text']) {
            $mail->action($content['action_text'], $billingUrl);
        }

        return $mail;
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Ihre Webseite „'.$this->site->name.'" wurde gesperrt',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihr Abonnement für die Webseite **'.$this->site->name."** ist abgelaufen.\nDie Webseite wurde vorübergehend gesperrt. Innerhalb der Kulanzfrist können Sie durch Aktualisierung Ihrer Zahlungsmethode und erfolgreiche Verlängerung die Sperrung aufheben.\nBitte handeln Sie zeitnah, um den Zugriff wiederherzustellen.",
            'action_text' => 'Zahlungsart verwalten',
        ];
    }
}
