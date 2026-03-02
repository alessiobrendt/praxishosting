<?php

namespace App\Notifications\Channels;

use App\Mail\TransactionalTemplateMail;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TransactionalMailChannel
{
    /**
     * Send the given notification. Expects the notification to implement
     * toTransactionalMail(($notifiable): array{content: array{subject: string, greeting: string, body: string, action_text: string|null}, actionUrl: string|null}
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $data = $notification->toTransactionalMail($notifiable);
        $content = $data['content'];
        $actionUrl = $data['actionUrl'] ?? null;

        $to = $notifiable->routeNotificationFor('mail', $notification);
        if (! $to) {
            Log::debug('Transactional mail not sent: no email address for notifiable', [
                'notifiable_type' => $notifiable::class,
                'notifiable_id' => $notifiable->id ?? null,
            ]);

            return;
        }

        $brand = method_exists($notifiable, 'brand') ? $notifiable->brand : null;

        Mail::to($to)->send(new TransactionalTemplateMail($content, $actionUrl, isTest: false, brand: $brand));
    }
}
