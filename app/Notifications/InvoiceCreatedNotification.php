<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice
    ) {}

    public static function notificationType(): string
    {
        return 'invoice_created';
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
        $invoiceViewUrl = route('invoices.show', $this->invoice);
        $pdfUrl = $this->invoice->pdf_path ? route('invoices.pdf', $this->invoice) : null;
        $amount = number_format((float) $this->invoice->amount, 2, ',', '.').' €';
        $invoiceDate = $this->invoice->invoice_date->format('d.m.Y');

        $template = EmailTemplate::find('invoice_created');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'invoice_number' => $this->invoice->number,
            'amount' => $amount,
            'invoice_date' => $invoiceDate,
            'pdf_url' => $pdfUrl ?? $invoiceViewUrl,
        ]) ?? $this->defaultContent($notifiable, $amount, $invoiceDate);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $invoiceViewUrl : null,
        ];
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
            'action_text' => 'Rechnung anzeigen',
        ];
    }
}
