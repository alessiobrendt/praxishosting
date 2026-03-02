<?php

namespace App\Services;

use App\Listeners\LogStripeWebhookReceived;
use App\Models\AdminActivityLog;
use App\Models\CronDailyStats;
use App\Models\DiscountCode;
use App\Models\GameServerAccount;
use App\Models\HostingServer;
use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\ResellerDomain;
use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\Template;
use App\Models\TemplatePage;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Voucher;
use App\Models\WebspaceAccount;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

class DashboardWidgetDataService
{
    public function getData(string $widgetKey): array
    {
        return match ($widgetKey) {
            'revenue-today' => [
                'value' => (float) Invoice::whereDate('invoice_date', today())->where('status', 'paid')->sum('amount'),
            ],
            'revenue-month' => [
                'value' => (float) Invoice::whereMonth('invoice_date', now()->month)
                    ->whereYear('invoice_date', now()->year)
                    ->where('status', 'paid')->sum('amount'),
            ],
            'revenue-year' => [
                'value' => (float) Invoice::whereYear('invoice_date', now()->year)->where('status', 'paid')->sum('amount'),
            ],
            'revenue-chart-daily' => $this->revenueChartDaily(),
            'revenue-chart-monthly' => $this->revenueChartMonthly(),
            'unpaid-overdue' => [
                'unpaidSum' => (float) Invoice::where('status', '!=', 'paid')->sum('amount'),
                'overdueCount' => Invoice::where('status', '!=', 'paid')
                    ->whereNotNull('due_date')->where('due_date', '<', today())->count(),
            ],
            'overdue-failed-invoices' => [
                'items' => Invoice::query()
                    ->with('user:id,name')
                    ->where(fn ($q) => $q->where('status', 'failed')
                        ->orWhere(fn ($q2) => $q2->where('status', '!=', 'paid')
                            ->whereNotNull('due_date')->where('due_date', '<', today())))
                    ->latest()->limit(20)->get()
                    ->map(fn ($inv) => [
                        'id' => $inv->id,
                        'number' => $inv->number,
                        'user_id' => $inv->user_id,
                        'user_name' => $inv->user?->name,
                        'status' => $inv->status,
                        'due_date' => $inv->due_date?->format('d.m.Y'),
                    ])->values()->all(),
            ],
            'open-dunning-invoices' => $this->openDunningInvoices(),
            'invoice-status-pie' => $this->invoiceStatusPie(),
            'last-stripe-webhook' => [
                'minutesAgo' => $this->lastWebhookMinutesAgo(),
            ],
            'active-subscriptions' => [
                'count' => SiteSubscription::whereNotNull('stripe_subscription_id')->count(),
            ],
            'subscriptions-ending-week' => [
                'count' => SiteSubscription::query()
                    ->whereNotNull('stripe_subscription_id')->where('stripe_status', 'active')
                    ->whereBetween('current_period_ends_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                    ->count(),
            ],
            'cancellations-period-end' => [
                'count' => SiteSubscription::where('cancel_at_period_end', true)->count(),
            ],
            'expiring-subscriptions' => [
                'items' => SiteSubscription::query()
                    ->with('site:uuid,name')
                    ->whereNotNull('stripe_subscription_id')->where('stripe_status', 'active')
                    ->whereBetween('current_period_ends_at', [now(), now()->addDays(7)])
                    ->orderBy('current_period_ends_at')->limit(20)->get()
                    ->map(fn ($sub) => [
                        'site_uuid' => $sub->site?->uuid,
                        'site_name' => $sub->site?->name,
                        'current_period_ends_at' => $sub->current_period_ends_at?->format('d.m.Y'),
                    ])->values()->all(),
            ],
            'sites-stats' => [
                'total' => Site::count(),
                'legacy' => Site::where('is_legacy', true)->count(),
                'suspended' => Site::where('status', 'suspended')->count(),
            ],
            'sites-suspended' => [
                'count' => Site::where('status', 'suspended')->count(),
            ],
            'subscriptions-chart-daily' => $this->subscriptionsChartDaily(),
            'customers-total' => ['count' => User::count()],
            'newest-customer' => $this->newestCustomer(),
            'last-purchase' => $this->lastPurchase(),
            'recent-invoices' => [
                'items' => Invoice::with('user:id,name')->latest()->limit(10)->get()
                    ->map(fn ($inv) => [
                        'id' => $inv->id,
                        'number' => $inv->number,
                        'amount' => (float) $inv->amount,
                        'status' => $inv->status,
                        'user_name' => $inv->user?->name,
                    ])->values()->all(),
            ],
            'new-customers-chart' => $this->newCustomersChart(),
            'pterodactyl-nodes-load' => $this->pterodactylNodesLoad(),
            'pterodactyl-nodes-summary' => $this->pterodactylNodesSummary(),
            'hosting-servers-status' => [
                'servers' => HostingServer::query()->get()->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'panel_type' => $s->panel_type,
                    'api_check_status' => $s->api_check_status,
                    'api_checked_at' => $s->api_checked_at?->format('d.m.Y H:i'),
                ])->values()->all(),
            ],
            'hosting-servers-overview' => [
                'total' => HostingServer::count(),
                'online' => HostingServer::where('api_check_status', 'ok')->count(),
                'offline' => HostingServer::count() - HostingServer::where('api_check_status', 'ok')->count(),
            ],
            'open-tickets' => [
                'count' => Ticket::whereIn('status', ['open', 'pending'])->count(),
            ],
            'tickets-by-priority' => $this->ticketsByPriority(),
            'tickets-by-category' => $this->ticketsByCategory(),
            'recent-tickets' => [
                'items' => Ticket::with(['user:id,name', 'ticketPriority:id,name'])->latest()->limit(10)->get()
                    ->map(fn ($t) => [
                        'id' => $t->id,
                        'subject' => $t->subject,
                        'priority' => $t->ticketPriority?->name ?? '-',
                        'user_name' => $t->user?->name,
                        'created_at' => $t->created_at->format('d.m.Y'),
                    ])->values()->all(),
            ],
            'tickets-created-chart' => $this->ticketsCreatedChart(),
            'failed-jobs' => [
                'count' => DB::table('failed_jobs')->count(),
            ],
            'waiting-jobs' => [
                'count' => (int) (Queue::size() ?? 0),
            ],
            'cron-last-run' => [
                'lastRunAt' => Cache::get(\App\Http\Controllers\Admin\CronStatisticsController::CACHE_KEY_SCHEDULER_LAST_RUN),
            ],
            'cron-daily-stats-chart' => $this->cronDailyStatsChart(),
            'recent-activity' => [
                'items' => AdminActivityLog::with('user:id,name')->latest()->limit(15)->get()
                    ->map(fn ($log) => [
                        'action' => $log->action,
                        'model_type' => class_basename($log->model_type),
                        'created_at' => $log->created_at->format('d.m.Y H:i'),
                        'user_name' => $log->user?->name,
                    ])->values()->all(),
            ],
            'game-server-accounts' => ['count' => GameServerAccount::count()],
            'game-servers-pending' => [
                'count' => GameServerAccount::where('status', 'pending')->count(),
            ],
            'webspace-accounts' => ['count' => WebspaceAccount::count()],
            'webspace-pending-plesk' => [
                'count' => WebspaceAccount::where('status', 'pending')->count(),
            ],
            'action-items' => $this->actionItems(),
            'global-search' => [],
            'recent-items' => [],
            'discount-codes-active' => [
                'count' => DiscountCode::where('is_active', true)->count(),
            ],
            'vouchers-remaining' => [
                'count' => Voucher::where('is_active', true)->whereNull('redeemed_at')->count(),
                'totalValue' => (float) Voucher::where('is_active', true)->whereNull('redeemed_at')->sum('balance'),
            ],
            'domains-expiring' => [
                'items' => ResellerDomain::query()
                    ->whereBetween('expires_at', [now(), now()->addDays(30)])
                    ->orderBy('expires_at')->limit(20)->get()
                    ->map(fn ($d) => [
                        'id' => $d->id,
                        'domain' => $d->domain,
                        'expires_at' => $d->expires_at?->format('d.m.Y'),
                    ])->values()->all(),
            ],
            'templates-count' => [
                'templates' => Template::count(),
                'pages' => TemplatePage::count(),
            ],
            default => [],
        };
    }

    private function lastWebhookMinutesAgo(): ?int
    {
        $at = Cache::get(LogStripeWebhookReceived::CACHE_KEY);

        return $at ? (int) Carbon::parse($at)->diffInMinutes(now()) : null;
    }

    private function revenueChartDaily(): array
    {
        $days = 14;
        $labels = [];
        $values = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $labels[] = $d->format('d.m.');
            $values[] = (float) Invoice::whereDate('invoice_date', $d)->where('status', 'paid')->sum('amount');
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function revenueChartMonthly(): array
    {
        $labels = [];
        $values = [];
        for ($i = 11; $i >= 0; $i--) {
            $d = Carbon::now()->subMonths($i);
            $labels[] = $d->format('M Y');
            $values[] = (float) Invoice::whereMonth('invoice_date', $d->month)
                ->whereYear('invoice_date', $d->year)->where('status', 'paid')->sum('amount');
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function openDunningInvoices(): array
    {
        $ids = InvoiceDunningLetter::where('level', '>=', 2)->pluck('invoice_id')->unique();
        $items = Invoice::with('user:id,name')->whereIn('id', $ids)->where('status', '!=', 'paid')
            ->latest()->limit(20)->get()
            ->map(fn ($inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'user_id' => $inv->user_id,
                'user_name' => $inv->user?->name,
                'max_level' => (int) $inv->dunningLetters()->max('level'),
            ])->values()->all();

        return ['items' => $items];
    }

    private function invoiceStatusPie(): array
    {
        $counts = Invoice::selectRaw('status, count(*) as c')->groupBy('status')->pluck('c', 'status')->all();

        return [
            'paid' => (int) ($counts['paid'] ?? 0),
            'pending' => (int) ($counts['pending'] ?? 0),
            'draft' => (int) ($counts['draft'] ?? 0),
            'sent' => (int) ($counts['sent'] ?? 0),
            'failed' => (int) ($counts['failed'] ?? 0),
        ];
    }

    private function subscriptionsChartDaily(): array
    {
        $days = 14;
        $labels = [];
        $values = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $labels[] = $d->format('d.m.');
            $values[] = SiteSubscription::whereDate('created_at', $d)->count();
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function newestCustomer(): array
    {
        $user = User::latest('created_at')->first();
        if (! $user) {
            return ['name' => null, 'email' => null, 'created_at' => null, 'id' => null];
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at->format('d.m.Y'),
        ];
    }

    private function lastPurchase(): array
    {
        $inv = Invoice::where('status', 'paid')->with('user:id,name')->latest('updated_at')->first();
        if (! $inv) {
            return ['number' => null, 'amount' => null, 'user_name' => null, 'paid_at' => null, 'id' => null];
        }

        return [
            'id' => $inv->id,
            'number' => $inv->number,
            'amount' => (float) $inv->amount,
            'user_name' => $inv->user?->name,
            'paid_at' => $inv->updated_at->format('d.m.Y'),
        ];
    }

    private function newCustomersChart(): array
    {
        $days = 14;
        $labels = [];
        $values = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $labels[] = $d->format('d.m.');
            $values[] = User::whereDate('created_at', $d)->count();
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function pterodactylNodesLoad(): array
    {
        $servers = HostingServer::where('panel_type', 'pterodactyl')->where('is_active', true)->get();
        $nodes = [];
        foreach ($servers as $server) {
            try {
                $client = app(\App\Services\ControlPanels\PterodactylClient::class);
                $client->setServer($server);
                $overview = $client->getNodesOverview();
                if (is_array($overview)) {
                    foreach ($overview as $node) {
                        $nodes[] = [
                            'name' => $node['name'] ?? 'Node',
                            'memory_allocated_mb' => $node['memory_allocated_mb'] ?? 0,
                            'memory_total_mb' => $node['memory_total_mb'] ?? 0,
                            'disk_allocated_mb' => $node['disk_allocated_mb'] ?? 0,
                            'disk_total_mb' => $node['disk_total_mb'] ?? 0,
                            'maintenance_mode' => $node['maintenance_mode'] ?? false,
                        ];
                    }
                }
            } catch (\Throwable) {
                // skip failed server
            }
        }

        return ['nodes' => $nodes];
    }

    private function pterodactylNodesSummary(): array
    {
        $load = $this->pterodactylNodesLoad();
        $nodes = $load['nodes'] ?? [];
        $total = count($nodes);
        $maintenance = (int) array_sum(array_column($nodes, 'maintenance_mode'));
        $memTotal = array_sum(array_column($nodes, 'memory_total_mb'));
        $memAlloc = array_sum(array_column($nodes, 'memory_allocated_mb'));
        $diskTotal = array_sum(array_column($nodes, 'disk_total_mb'));
        $diskAlloc = array_sum(array_column($nodes, 'disk_allocated_mb'));

        return [
            'total' => $total,
            'maintenance' => $maintenance,
            'memory_percent' => $memTotal > 0 ? (int) round($memAlloc / $memTotal * 100) : 0,
            'disk_percent' => $diskTotal > 0 ? (int) round($diskAlloc / $diskTotal * 100) : 0,
        ];
    }

    private function ticketsByPriority(): array
    {
        $counts = Ticket::whereIn('status', ['open', 'pending'])
            ->join('ticket_priorities', 'tickets.ticket_priority_id', '=', 'ticket_priorities.id')
            ->selectRaw('ticket_priorities.name as priority, count(*) as c')
            ->groupBy('ticket_priorities.name')
            ->pluck('c', 'priority')->all();

        return $counts;
    }

    private function ticketsByCategory(): array
    {
        $counts = Ticket::whereIn('status', ['open', 'pending'])
            ->join('ticket_categories', 'tickets.ticket_category_id', '=', 'ticket_categories.id')
            ->selectRaw('ticket_categories.name as category, count(*) as c')
            ->groupBy('ticket_categories.name')
            ->pluck('c', 'category')->all();

        return $counts;
    }

    private function ticketsCreatedChart(): array
    {
        $days = 14;
        $labels = [];
        $values = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $labels[] = $d->format('d.m.');
            $values[] = Ticket::whereDate('created_at', $d)->count();
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function cronDailyStatsChart(): array
    {
        $days = 7;
        $start = Carbon::today()->subDays($days - 1);
        $rows = CronDailyStats::whereBetween('date', [$start, Carbon::today()])->orderBy('date')->get();
        $labels = [];
        $invoices = [];
        $services = [];
        $tickets = [];
        for ($i = 0; $i < $days; $i++) {
            $d = Carbon::today()->subDays($days - 1 - $i);
            $labels[] = $d->format('d.m.');
            $row = $rows->firstWhere(fn ($r) => $r->date->toDateString() === $d->toDateString());
            $invoices[] = $row?->invoices_created ?? 0;
            $services[] = (int) SiteSubscription::whereDate('created_at', $d)->count();
            $tickets[] = (int) Ticket::whereDate('created_at', $d)->count();
        }

        return ['labels' => $labels, 'invoices' => $invoices, 'services' => $services, 'tickets' => $tickets];
    }

    private function actionItems(): array
    {
        $endOfNextSeven = now()->addDays(7);
        $expiringSubscriptions = SiteSubscription::query()
            ->with('site:uuid,name')
            ->whereNotNull('stripe_subscription_id')->where('stripe_status', 'active')
            ->whereBetween('current_period_ends_at', [now(), $endOfNextSeven])
            ->orderBy('current_period_ends_at')->limit(20)->get()
            ->map(fn ($sub) => [
                'site_uuid' => $sub->site?->uuid,
                'site_name' => $sub->site?->name,
                'current_period_ends_at' => $sub->current_period_ends_at?->format('d.m.Y'),
            ])->values()->all();

        $overdueOrFailedInvoices = Invoice::query()
            ->with('user:id,name')
            ->where(fn ($q) => $q->where('status', 'failed')
                ->orWhere(fn ($q2) => $q2->where('status', '!=', 'paid')->whereNotNull('due_date')->where('due_date', '<', today())))
            ->latest()->limit(20)->get()
            ->map(fn ($inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'user_id' => $inv->user_id,
                'user_name' => $inv->user?->name,
                'status' => $inv->status,
                'due_date' => $inv->due_date?->format('d.m.Y'),
            ])->values()->all();

        $dunningIds = InvoiceDunningLetter::where('level', '>=', 2)->pluck('invoice_id')->unique();
        $openDunningInvoices = Invoice::with('user:id,name')->whereIn('id', $dunningIds)->where('status', '!=', 'paid')
            ->latest()->limit(20)->get()
            ->map(fn ($inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'user_id' => $inv->user_id,
                'user_name' => $inv->user?->name,
                'max_level' => (int) $inv->dunningLetters()->max('level'),
            ])->values()->all();

        return [
            'expiringSubscriptions' => $expiringSubscriptions,
            'overdueOrFailedInvoices' => $overdueOrFailedInvoices,
            'openDunningInvoices' => $openDunningInvoices,
        ];
    }
}
