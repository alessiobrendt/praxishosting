<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceCreatedNotification extends Notification implements ShouldQueue
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
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $pdfUrl = $this->invoice->pdf_path ? route('invoices.pdf', $this->invoice) : null;
        $amount = number_format((float) $this->invoice->amount, 2, ',', '.').' €';
        $invoiceDate = $this->invoice->invoice_date->format('d.m.Y');

        $template = EmailTemplate::find('invoice_created');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'invoice_number' => $this->invoice->number,
            'amount' => $amount,
            'invoice_date' => $invoiceDate,
            'pdf_url' => $pdfUrl ?? '',
        ]) ?? $this->defaultContent($notifiable, $amount, $invoiceDate);

        $mail = (new MailMessage)
            ->subject($content['subject'])
            ->greeting($content['greeting']);

        foreach (explode("\n", $content['body']) as $line) {
            $mail->line(trim($line) !== '' ? $line : ' ');
        }

        if ($content['action_text'] && $pdfUrl) {
            $mail->action($content['action_text'], $pdfUrl);
        }

        return $mail;
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable, string $amount, string $invoiceDate): array
    {
        return [
            'subject' => 'Ihre Rechnung '.$this->invoice->number,
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihre Rechnung **'.$this->invoice->number."** wurde erstellt.\nBetrag: **".$amount."**\nDatum: ".$invoiceDate."\nVielen Dank für Ihr Vertrauen.",
            'action_text' => 'Rechnung als PDF herunterladen',
        ];
    }
}
