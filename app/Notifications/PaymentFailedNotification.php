<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public string $invoiceNumber = '',
        public string $amount = ''
    ) {}

    public static function notificationType(): string
    {
        return 'payment_failed';
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
        $billingUrl = route('billing.portal');
        $amountDisplay = $this->amount !== '' ? $this->amount.' €' : '';

        $template = EmailTemplate::find('payment_failed');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'invoice_number' => $this->invoiceNumber,
            'amount' => $amountDisplay,
            'billing_portal_url' => $billingUrl,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $billingUrl : null,
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
        $invoiceLine = $this->invoiceNumber ? 'Rechnung: '.$this->invoiceNumber : '';
        $amountLine = $this->amount !== '' ? 'Betrag: '.$this->amount.' €' : '';

        return [
            'subject' => 'Zahlung fehlgeschlagen – bitte Zahlungsart prüfen',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => "Eine Zahlung konnte nicht durchgeführt werden.\n".$invoiceLine."\n".$amountLine."\nBitte aktualisieren Sie Ihre Zahlungsmethode, um Unterbrechungen zu vermeiden.",
            'action_text' => 'Zahlungsart verwalten',
        ];
    }
}
