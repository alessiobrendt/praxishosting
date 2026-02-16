<?php

namespace App\Jobs;

use App\Services\SkrimeApiService;
use App\Services\TldPricelistSyncService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncTldPricelistJob implements ShouldQueue
{
    use Queueable;

    public int $timeout = 300;

    public function handle(SkrimeApiService $skrime, TldPricelistSyncService $sync): void
    {
        try {
            $list = $skrime->getPricelist();
        } catch (\Throwable $e) {
            Log::error('SyncTldPricelistJob: getPricelist failed', ['error' => $e->getMessage()]);

            throw $e;
        }

        $count = $sync->applyPricelist($list);
        Log::info('SyncTldPricelistJob: completed', ['count' => $count]);
    }
}
