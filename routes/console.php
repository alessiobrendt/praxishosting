<?php

use App\Jobs\NotifySubscriptionEndingSoon;
use App\Jobs\ProcessExpiredSubscriptions;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ProcessExpiredSubscriptions)->daily();
Schedule::job(new NotifySubscriptionEndingSoon)->daily();
