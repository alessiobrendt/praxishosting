<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCompletedNotification extends Notification implements ShouldQueue
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
        $template = EmailTemplate::find('order_completed');
        $url = route('sites.show', $this->site);
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->site->name,
            'site_url' => $url,
        ]) ?? $this->defaultContent($notifiable, $url);

        $mail = (new MailMessage)
            ->subject($content['subject'])
            ->greeting($content['greeting']);

        foreach (explode("\n", $content['body']) as $line) {
            $mail->line(trim($line) !== '' ? $line : ' ');
        }

        if ($content['action_text']) {
            $mail->action($content['action_text'], $url);
        }

        return $mail;
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
