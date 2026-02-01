<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
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
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $createUrl = route('sites.create');

        $template = EmailTemplate::find('site_deleted');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->siteName,
            'create_site_url' => $createUrl,
        ]) ?? $this->defaultContent($notifiable);

        $mail = (new MailMessage)
            ->subject($content['subject'])
            ->greeting($content['greeting']);

        foreach (explode("\n", $content['body']) as $line) {
            $mail->line(trim($line) !== '' ? $line : ' ');
        }

        if ($content['action_text']) {
            $mail->action($content['action_text'], $createUrl);
        }

        return $mail;
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
