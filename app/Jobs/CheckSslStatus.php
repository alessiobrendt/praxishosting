<?php

namespace App\Jobs;

use App\Models\Domain;
use App\Services\SslCheckService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckSslStatus implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ?Domain $domain = null
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(SslCheckService $sslCheckService): void
    {
        if ($this->domain) {
            $sslCheckService->updateDomainStatus($this->domain);
        } else {
            // Check all domains that haven't been checked in the last 24 hours
            Domain::query()
                ->where(function ($query) {
                    $query->whereNull('ssl_checked_at')
                        ->orWhere('ssl_checked_at', '<', now()->subDay());
                })
                ->whereNotNull('domain')
                ->chunk(50, function ($domains) use ($sslCheckService) {
                    foreach ($domains as $domain) {
                        $sslCheckService->updateDomainStatus($domain);
                    }
                });
        }
    }
}
