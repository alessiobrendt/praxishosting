<?php

namespace App\Jobs;

use App\Models\SiteSubscription;
use App\Notifications\SubscriptionEndingSoonNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;

class NotifySubscriptionEndingSoon implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $daysAhead = 7
    ) {}

    public function handle(): void
    {
        $targetDay = Carbon::now()->addDays($this->daysAhead);
        $from = $targetDay->copy()->startOfDay();
        $to = $targetDay->copy()->endOfDay();

        SiteSubscription::query()
            ->with('site.user')
            ->whereHas('site', fn ($q) => $q->where('is_legacy', false)->where('status', 'active'))
            ->whereNotNull('current_period_ends_at')
            ->whereBetween('current_period_ends_at', [$from, $to])
            ->each(function (SiteSubscription $sub): void {
                $site = $sub->site;
                $endsAt = $sub->current_period_ends_at->format('d.m.Y');
                $site->user?->notify(new SubscriptionEndingSoonNotification($site, $endsAt, $this->daysAhead));
            });
    }
}
