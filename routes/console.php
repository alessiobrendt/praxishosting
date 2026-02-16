<?php

use App\Jobs\CreateDomainRenewalInvoicesJob;
use App\Jobs\NotifySubscriptionEndingSoon;
use App\Jobs\ProcessExpiredSubscriptions;
use App\Jobs\SyncResellerDomainsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ProcessExpiredSubscriptions)->daily();
Schedule::job(new NotifySubscriptionEndingSoon)->daily();
Schedule::job(new SyncResellerDomainsJob)->daily();
Schedule::job(new CreateDomainRenewalInvoicesJob)->daily();
