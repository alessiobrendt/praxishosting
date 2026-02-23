<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\WebspaceAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class WebspaceDeactivatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public WebspaceAccount $webspaceAccount
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
        $billingUrl = route('billing.portal');

        $template = EmailTemplate::find('webspace_deactivated');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'domain' => $this->webspaceAccount->domain,
            'billing_portal_url' => $billingUrl,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $billingUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Ihr Webspace '.$this->webspaceAccount->domain.' wurde deaktiviert',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihr Webspace **'.$this->webspaceAccount->domain.'** wurde aufgrund eines abgelaufenen Abonnements deaktiviert. Um den Zugriff wiederherzustellen, aktualisieren Sie bitte Ihre Zahlungsmethode und verlängern Sie das Abo.',
            'action_text' => 'Zahlungsart verwalten',
        ];
    }
}
