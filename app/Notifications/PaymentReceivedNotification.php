<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['transactional_mail'];
    }

    /**
     * @return array{content: array{subject: string, greeting: string, body: string, action_text: string|null}, actionUrl: string|null}
     */
    public function toTransactionalMail(object $notifiable): array
    {
        $amount = number_format((float) $this->invoice->amount, 2, ',', '.').' €';
        $paymentDate = $this->invoice->invoice_date->format('d.m.Y');
        $pdfUrl = $this->invoice->pdf_path ? route('invoices.pdf', $this->invoice) : null;

        $template = EmailTemplate::find('payment_received');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'amount' => $amount,
            'invoice_number' => $this->invoice->number,
            'payment_date' => $paymentDate,
        ]) ?? $this->defaultContent($notifiable, $amount, $paymentDate);

        return [
            'content' => $content,
            'actionUrl' => ($content['action_text'] && $pdfUrl) ? $pdfUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable, string $amount, string $paymentDate): array
    {
        return [
            'subject' => 'Ihre Zahlung wurde verbucht',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihre Zahlung in Höhe von **'.$amount.'** wurde am '.$paymentDate.' verbucht. Rechnung: '.$this->invoice->number,
            'action_text' => 'Rechnung ansehen',
        ];
    }
}
