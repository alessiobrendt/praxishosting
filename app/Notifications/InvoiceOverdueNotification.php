<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceOverdueNotification extends Notification implements ShouldQueue
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
        $invoiceViewUrl = route('invoices.show', $this->invoice);
        $amount = number_format((float) $this->invoice->amount, 2, ',', '.').' €';
        $dueDate = $this->invoice->due_date?->format('d.m.Y') ?? '';

        $template = EmailTemplate::find('invoice_overdue');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'invoice_number' => $this->invoice->number,
            'amount' => $amount,
            'due_date' => $dueDate,
        ]) ?? $this->defaultContent($notifiable, $amount, $dueDate);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $invoiceViewUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable, string $amount, string $dueDate): array
    {
        return [
            'subject' => 'Zahlungserinnerung: Rechnung '.$this->invoice->number,
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihre Rechnung **'.$this->invoice->number.'** (Betrag: **'.$amount.'**) war am **'.$dueDate."** fällig und ist noch offen.\nBitte begleichen Sie den Betrag zeitnah, um Mahngebühren und eine Sperrung zu vermeiden.",
            'action_text' => 'Rechnung bezahlen',
        ];
    }
}
