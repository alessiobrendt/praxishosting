<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SubscriptionRenewalInvoiceCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice
    ) {}

    /**
     * @return array<int, string>
     */
    public static function notificationType(): string
    {
        return 'subscription_renewal_invoice_created';
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
        $siteName = $this->invoice->siteSubscription?->site?->name ?? 'Ihre Webseite';
        $amount = number_format((float) $this->invoice->amount, 2, ',', '.').' €';
        $invoiceDate = $this->invoice->invoice_date?->format('d.m.Y') ?? '';
        $dueDate = $this->invoice->due_date?->format('d.m.Y') ?? '';

        $template = EmailTemplate::find('subscription_renewal_invoice_created');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $siteName,
            'invoice_number' => $this->invoice->number,
            'amount' => $amount,
            'invoice_date' => $invoiceDate,
            'due_date' => $dueDate,
        ]) ?? $this->defaultContent($notifiable, $siteName, $amount, $invoiceDate, $dueDate);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $invoiceViewUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable, string $siteName, string $amount, string $invoiceDate, string $dueDate): array
    {
        return [
            'subject' => 'Ihre Rechnung für die Verlängerung von „'.$siteName.'"',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihre Rechnung **'.$this->invoice->number."** für die Abo-Verlängerung wurde erstellt.\nBetrag: **".$amount."**\nFällig am: ".$dueDate."\nRechnungsdatum: ".$invoiceDate."\nBitte zahlen Sie rechtzeitig, um die Unterbrechung Ihres Abos zu vermeiden.",
            'action_text' => 'Rechnung anzeigen',
        ];
    }
}
