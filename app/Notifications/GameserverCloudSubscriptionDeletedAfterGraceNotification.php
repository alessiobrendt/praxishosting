<?php

namespace App\Notifications;

use App\Models\GameserverCloudSubscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class GameserverCloudSubscriptionDeletedAfterGraceNotification extends Notification implements ShouldQueue
{
    use Queueable, SendsDiscordFromMail;

    public function __construct(
        public GameserverCloudSubscription $subscription
    ) {}

    public static function notificationType(): string
    {
        return 'gameserver_cloud_subscription_deleted';
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
        $planName = $this->subscription->gameserverCloudPlan?->name ?? 'Gameserver Cloud';
        $indexUrl = route('gaming.cloud.subscriptions.index');

        return [
            'content' => [
                'subject' => 'Ihr Gameserver-Cloud-Abo „'.$planName.'" wurde beendet',
                'greeting' => 'Hallo '.$notifiable->name.',',
                'body' => 'Ihr Gameserver-Cloud-Abo **'.$planName."** wurde nach Ablauf der Kulanzfrist endgültig beendet. Alle zugehörigen Game-Server wurden gelöscht.\nSie können jederzeit ein neues Cloud-Abo bestellen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'Gameserver Cloud ansehen',
            ],
            'actionUrl' => $indexUrl,
        ];
    }

    /**
     * @return array{content: string}
     */
    public function toDiscord(object $notifiable): array
    {
        return $this->discordPayloadFromMail($notifiable);
    }
}
