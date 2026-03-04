<?php

namespace App\Console\Commands;

use App\Jobs\ProcessExpiredSubscriptions;
use Illuminate\Console\Command;

class ProcessExpiredSubscriptionsCommand extends Command
{
    protected $signature = 'subscriptions:process-expired';

    protected $description = 'Abgelaufene Abos sperren und nach Kulanzfrist löschen (Sites, Webspace, Game-Server). Wird sonst alle 6 Stunden per Cron ausgeführt.';

    public function handle(): int
    {
        $this->info('Starte Verarbeitung abgelaufener Abos …');

        $job = new ProcessExpiredSubscriptions;
        $job->handle();

        $this->info('Fertig.');

        return self::SUCCESS;
    }
}
