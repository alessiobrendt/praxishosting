<?php

use App\Jobs\CreateDomainRenewalInvoicesJob;
use App\Jobs\CreateSiteRenewalInvoicesJob;
use App\Jobs\NotifySubscriptionEndingSoon;
use App\Jobs\ProcessExpiredSubscriptions;
use App\Jobs\SendInvoiceOverdueNotificationsJob;
use App\Jobs\SyncResellerDomainsJob;
use App\Jobs\VoidUnpaidInvoicesAfterGraceJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ProcessExpiredSubscriptions)->daily();
Schedule::job(new NotifySubscriptionEndingSoon(14))->daily();
Schedule::job(new NotifySubscriptionEndingSoon(7))->daily();
Schedule::job(new NotifySubscriptionEndingSoon(3))->daily();
Schedule::job(new NotifySubscriptionEndingSoon(1))->daily();
Schedule::job(new SyncResellerDomainsJob)->daily();
Schedule::job(new CreateDomainRenewalInvoicesJob)->daily();
Schedule::job(new CreateSiteRenewalInvoicesJob)->daily();
Schedule::job(new SendInvoiceOverdueNotificationsJob)->daily();
Schedule::job(new VoidUnpaidInvoicesAfterGraceJob)->daily();
