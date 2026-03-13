<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TicketReplyNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public Ticket $ticket
    ) {}

    public static function notificationType(): string
    {
        return 'ticket_reply';
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
        $ticketUrl = route('support.show', $this->ticket);

        $template = EmailTemplate::find('ticket_reply');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'ticket_subject' => $this->ticket->subject,
            'ticket_url' => $ticketUrl,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $ticketUrl : null,
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
            'subject' => 'Neue Antwort auf Ihr Ticket: '.$this->ticket->subject,
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Es gibt eine neue Antwort auf Ihr Support-Ticket **'.$this->ticket->subject.'**. Bitte melden Sie sich an, um die Nachricht zu lesen und ggf. zu antworten.',
            'action_text' => 'Ticket ansehen',
        ];
    }
}
