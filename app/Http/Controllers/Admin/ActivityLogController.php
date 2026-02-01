<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\Site;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Admin activity log with optional filters: action, model_type, from, to.
     */
    public function index(Request $request): Response
    {
        $query = AdminActivityLog::query()
            ->with('user:id,name')
            ->latest();

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', Carbon::parse($request->from)->startOfDay());
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', Carbon::parse($request->to)->endOfDay());
        }

        $activityLog = $query->paginate(20)->withQueryString()->through(fn (AdminActivityLog $log) => array_merge($log->toArray(), [
            'created_at' => $log->created_at->format('d.m.Y H:i'),
        ]));

        $actionOptions = [
            'site_status_updated' => 'Site-Status geändert',
            'site_subscription_period_updated' => 'Laufzeitende geändert',
            'site_subscription_cancelled' => 'Abo gekündigt',
            'site_subscription_reactivated' => 'Kündigung zurückgenommen',
            'customer_updated' => 'Kunden-Stammdaten geändert',
        ];

        $modelTypeOptions = [
            Site::class => 'Site',
            User::class => 'Kunde',
        ];

        return Inertia::render('admin/activity-log/Index', [
            'activityLog' => $activityLog,
            'filters' => $request->only(['action', 'model_type', 'from', 'to']),
            'actionOptions' => $actionOptions,
            'modelTypeOptions' => $modelTypeOptions,
        ]);
    }
}
