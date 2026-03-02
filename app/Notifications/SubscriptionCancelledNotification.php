<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SubscriptionCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $siteName,
        public string $endsAt
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

        $template = EmailTemplate::find('subscription_cancelled');
        $content = $template?->replace([
            'user_name' => $notifiable->name,
            'site_name' => $this->siteName,
            'ends_at' => $this->endsAt,
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
            'subject' => 'Ihr Abo für „'.$this->siteName.'" läuft aus',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihr Abonnement für die Webseite **'.$this->siteName.'** wurde gekündigt bzw. läuft am **'.$this->endsAt."** aus.\nDanach wird die Webseite nicht mehr erreichbar sein. Bei Fragen stehen wir Ihnen gerne zur Verfügung.",
            'action_text' => 'Zum Abo-Bereich',
        ];
    }
}
