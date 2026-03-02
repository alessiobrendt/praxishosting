<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Notifications\InvoiceOverdueNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendInvoiceOverdueNotificationsJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Invoice::query()
            ->whereIn('status', ['sent', 'pending'])
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now())
            ->whereNull('metadata->overdue_notification_sent_at')
            ->with('user')
            ->get()
            ->each(function (Invoice $invoice): void {
                $invoice->user?->notify(new InvoiceOverdueNotification($invoice));

                $metadata = $invoice->metadata ?? [];
                $metadata['overdue_notification_sent_at'] = now()->toIso8601String();
                $invoice->update(['metadata' => $metadata]);
            });
    }
}
