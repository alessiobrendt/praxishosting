<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Listeners\LogStripeWebhookReceived;
use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $todayRevenue = (float) Invoice::whereDate('invoice_date', today())->where('status', 'paid')->sum('amount');
        $monthRevenue = (float) Invoice::whereMonth('invoice_date', now()->month)
            ->whereYear('invoice_date', now()->year)
            ->where('status', 'paid')
            ->sum('amount');
        $yearRevenue = (float) Invoice::whereYear('invoice_date', now()->year)->where('status', 'paid')->sum('amount');

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $endOfNextSevenDays = Carbon::now()->addDays(7);

        $expiringSubscriptions = SiteSubscription::query()
            ->with('site:id,name')
            ->whereNotNull('stripe_subscription_id')
            ->where('stripe_status', 'active')
            ->whereBetween('current_period_ends_at', [now(), $endOfNextSevenDays])
            ->orderBy('current_period_ends_at')
            ->limit(20)
            ->get()
            ->map(fn ($sub) => [
                'site_id' => $sub->site?->id,
                'site_name' => $sub->site?->name,
                'current_period_ends_at' => $sub->current_period_ends_at?->format('d.m.Y'),
            ]);

        $overdueOrFailedInvoices = Invoice::query()
            ->with('user:id,name')
            ->where(function ($q) {
                $q->where('status', 'failed')
                    ->orWhere(function ($q) {
                        $q->where('status', '!=', 'paid')
                            ->whereNotNull('due_date')
                            ->where('due_date', '<', today());
                    });
            })
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'user_id' => $inv->user_id,
                'user_name' => $inv->user?->name,
                'status' => $inv->status,
                'due_date' => $inv->due_date?->format('d.m.Y'),
            ]);

        $openDunningInvoiceIds = InvoiceDunningLetter::query()
            ->where('level', '>=', 2)
            ->pluck('invoice_id')
            ->unique();
        $openDunningInvoices = Invoice::query()
            ->with('user:id,name')
            ->whereIn('id', $openDunningInvoiceIds)
            ->where('status', '!=', 'paid')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'user_id' => $inv->user_id,
                'user_name' => $inv->user?->name,
                'max_level' => (int) $inv->dunningLetters()->max('level'),
            ]);

        $unpaidSum = (float) Invoice::where('status', '!=', 'paid')->sum('amount');
        $overdueCount = Invoice::where('status', '!=', 'paid')->whereNotNull('due_date')->where('due_date', '<', today())->count();
        $subscriptionsEndingThisWeek = SiteSubscription::query()
            ->whereNotNull('stripe_subscription_id')
            ->where('stripe_status', 'active')
            ->whereBetween('current_period_ends_at', [$startOfWeek, $endOfWeek])
            ->count();
        $cancellationsAtPeriodEnd = SiteSubscription::where('cancel_at_period_end', true)->count();

        $lastWebhookAt = Cache::get(LogStripeWebhookReceived::CACHE_KEY);
        $lastWebhookMinutesAgo = $lastWebhookAt
            ? (int) Carbon::parse($lastWebhookAt)->diffInMinutes(now())
            : null;

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'activeSubscriptions' => SiteSubscription::whereNotNull('stripe_subscription_id')->count(),
                'sitesTotal' => Site::count(),
                'sitesLegacy' => Site::where('is_legacy', true)->count(),
                'sitesSuspended' => Site::where('status', 'suspended')->count(),
                'customersTotal' => User::count(),
                'revenueToday' => $todayRevenue,
                'revenueMonth' => $monthRevenue,
                'revenueYear' => $yearRevenue,
                'unpaidSum' => $unpaidSum,
                'overdueCount' => $overdueCount,
                'subscriptionsEndingThisWeek' => $subscriptionsEndingThisWeek,
                'cancellationsAtPeriodEnd' => $cancellationsAtPeriodEnd,
            ],
            'actionItems' => [
                'expiringSubscriptions' => $expiringSubscriptions,
                'overdueOrFailedInvoices' => $overdueOrFailedInvoices,
                'openDunningInvoices' => $openDunningInvoices,
            ],
            'lastWebhookMinutesAgo' => $lastWebhookMinutesAgo,
        ]);
    }
}
