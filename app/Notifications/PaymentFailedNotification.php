<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $invoiceNumber = '',
        public string $amount = ''
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
        $amountDisplay = $this->amount !== '' ? $this->amount.' €' : '';

        $template = EmailTemplate::find('payment_failed');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'invoice_number' => $this->invoiceNumber,
            'amount' => $amountDisplay,
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
