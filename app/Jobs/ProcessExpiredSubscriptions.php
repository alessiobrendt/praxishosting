<?php

namespace App\Jobs;

use App\Models\Setting;
use App\Models\SiteSubscription;
use App\Notifications\SiteDeletedAfterGraceNotification;
use App\Notifications\SiteSuspendedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;

class ProcessExpiredSubscriptions implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $gracePeriodDays = (int) (Setting::get('billing_grace_period_days') ?? config('billing.grace_period_days', 7));
        $now = Carbon::now();

        SiteSubscription::query()
            ->with('site.user')
            ->whereHas('site', fn ($q) => $q->where('is_legacy', false)->where('status', 'active'))
            ->whereNotNull('current_period_ends_at')
            ->where('current_period_ends_at', '<', $now)
            ->each(function (SiteSubscription $sub): void {
                $site = $sub->site;
                $site->update(['status' => 'suspended']);
                $site->user?->notify(new SiteSuspendedNotification($site));
            });

        SiteSubscription::query()
            ->with('site.user')
            ->whereHas('site', fn ($q) => $q->where('is_legacy', false)->where('status', 'suspended'))
            ->whereNotNull('current_period_ends_at')
            ->where('current_period_ends_at', '<', $now->copy()->subDays($gracePeriodDays))
            ->each(function (SiteSubscription $sub): void {
                $site = $sub->site;
                $siteName = $site->name;
                $user = $site->user;
                $sub->delete();
                $site->update(['published_version_id' => null, 'draft_version_id' => null]);
                $site->domains()->delete();
                $site->versions()->delete();
                $site->invitations()->delete();
                $site->collaborators()->detach();
                $site->delete();
                $user?->notify(new SiteDeletedAfterGraceNotification($siteName));
            });
    }
}
