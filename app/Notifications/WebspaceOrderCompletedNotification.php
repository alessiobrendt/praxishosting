<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\WebspaceAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class WebspaceOrderCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public WebspaceAccount $webspaceAccount,
        public string $plainPassword
    ) {}

    /**
     * @return array<int, string>
     */
    public static function notificationType(): string
    {
        return 'order_completed_webspace';
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
        $loginUrl = route('webspace-accounts.plesk-login', $this->webspaceAccount);

        $template = EmailTemplate::find('order_completed_webspace');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'domain' => $this->webspaceAccount->domain,
            'plesk_username' => $this->webspaceAccount->plesk_username,
            'plesk_password' => $this->plainPassword,
            'login_url' => $loginUrl,
        ]) ?? $this->defaultContent($notifiable);

        return [
            'content' => $content,
            'actionUrl' => $content['action_text'] ? $loginUrl : null,
        ];
    }

    /**
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    private function defaultContent(object $notifiable): array
    {
        return [
            'subject' => 'Ihr Webspace für '.$this->webspaceAccount->domain.' wurde eingerichtet',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => "Ihr Webspace wurde erfolgreich eingerichtet.\n**Domain:** ".$this->webspaceAccount->domain."\n**Plesk-Benutzer:** ".$this->webspaceAccount->plesk_username."\nBitte bewahren Sie Ihre Zugangsdaten sicher auf.",
            'action_text' => 'Zum Plesk-Login',
        ];
    }
}
