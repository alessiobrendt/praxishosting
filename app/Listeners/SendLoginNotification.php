<?php

namespace App\Listeners;

use App\Notifications\LoginNotification;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendLoginNotification implements ShouldQueue
{
    public function handle(Login $event): void
    {
        $user = $event->user;
        if (! $user || ! $user->email) {
            return;
        }

        $user->notify(new LoginNotification(now()->format('d.m.Y H:i')));
    }
}
