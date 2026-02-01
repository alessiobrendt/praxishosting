<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSubscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $subscriptions = SiteSubscription::query()
            ->with(['site.template', 'site.user'])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (SiteSubscription $sub) => array_merge($sub->toArray(), [
                'current_period_ends_at' => $sub->current_period_ends_at ? Carbon::parse($sub->current_period_ends_at)->format('d.m.Y') : null,
            ]));

        return Inertia::render('admin/subscriptions/Index', [
            'subscriptions' => $subscriptions,
        ]);
    }
}
