<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TicketAdminReplyNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public Ticket $ticket,
        public string $customerName
    ) {}

    /**
     * @return array<int, string>
     */
    public static function notificationType(): string
    {
        return 'ticket_admin_reply';
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
        $ticketUrl = route('admin.tickets.show', $this->ticket);

        $template = EmailTemplate::find('ticket_admin_reply');
        $content = $template?->replace([
            'user_name' => $this->customerName,
            'ticket_subject' => $this->ticket->subject,
            'ticket_url' => $ticketUrl,
        ]) ?? $this->defaultContent();

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
    private function defaultContent(): array
    {
        return [
            'subject' => 'Neue Nachricht im Ticket: '.$this->ticket->subject,
            'greeting' => 'Hallo,',
            'body' => 'Der Kunde '.$this->customerName.' hat eine neue Nachricht im Ticket **'.$this->ticket->subject.'** geschrieben. Bitte prüfen Sie das Ticket im Admin-Bereich.',
            'action_text' => 'Ticket im Admin öffnen',
        ];
    }
}
