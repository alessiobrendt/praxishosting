<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SubscriptionEndingSoonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Site $site,
        public string $endsAt,
        public ?int $daysRemaining = null
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
        $replacements = [
            'user_name' => $notifiable->name,
            'site_name' => $this->site->name,
            'ends_at' => $this->endsAt,
            'billing_portal_url' => $billingUrl,
        ];
        if ($this->daysRemaining !== null) {
            $replacements['days_remaining'] = (string) $this->daysRemaining;
        }

        $template = EmailTemplate::find('subscription_ending_soon');
        $content = $template?->replace($replacements) ?? $this->defaultContent($notifiable);

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
            'subject' => 'Ihr Abo für „'.$this->site->name.'" läuft bald ab',
            'greeting' => 'Hallo '.$notifiable->name.',',
            'body' => 'Ihr Abonnement für die Webseite **'.$this->site->name.'** läuft am **'.$this->endsAt."** aus.\nBitte stellen Sie sicher, dass Ihre Zahlungsmethode gültig ist, um eine Verlängerung zu ermöglichen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
            'action_text' => 'Zahlungsart verwalten',
        ];
    }
}
