<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

trait SendsDiscordFromMail
{
    /**
     * Build Discord DM payload (content string) from this notification's transactional mail content.
     * Use from toDiscord() when the notification already implements toTransactionalMail().
     *
     * @return array{content: string}
     */
    protected function discordPayloadFromMail(object $notifiable): array
    {
        $mail = $this->toTransactionalMail($notifiable);
        $content = $mail['content'] ?? [];
        $subject = $content['subject'] ?? '';
        $body = $content['body'] ?? '';
        $body = (string) preg_replace('/\*\*(.*?)\*\*/s', '$1', $body);
        $body = strip_tags($body);
        $text = $subject !== '' ? $subject."\n\n".$body : $body;
        $text = strlen($text) > 2000 ? substr($text, 0, 1997).'...' : $text;

        return ['content' => $text];
    }
}
