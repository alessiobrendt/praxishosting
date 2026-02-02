<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global admin search: sites (name/slug), customers (name/email), invoices (number), subscriptions (Stripe ID).
     *
     * @return JsonResponse{ sites: array, customers: array, invoices: array, subscriptions: array }
     */
    public function index(Request $request): JsonResponse
    {
        $q = $request->query('q', '');
        $q = trim($q);
        $limit = 5;

        if (strlen($q) < 2) {
            return response()->json([
                'sites' => [],
                'customers' => [],
                'invoices' => [],
                'subscriptions' => [],
            ]);
        }

        $term = '%'.$q.'%';

        $sites = Site::query()
            ->where(function ($query) use ($term) {
                $query->where('name', 'like', $term)->orWhere('slug', 'like', $term);
            })
            ->limit($limit)
            ->get(['uuid', 'name', 'slug'])
            ->map(fn (Site $s) => [
                'uuid' => $s->uuid,
                'label' => $s->name.' ('.$s->slug.')',
                'url' => route('admin.sites.show', $s),
            ]);

        $customers = User::query()
            ->where(function ($query) use ($term) {
                $query->where('name', 'like', $term)->orWhere('email', 'like', $term);
            })
            ->limit($limit)
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'label' => $u->name.' ('.$u->email.')',
                'url' => route('admin.customers.show', $u),
            ]);

        $invoices = Invoice::query()
            ->where('number', 'like', $term)
            ->limit($limit)
            ->get(['id', 'number'])
            ->map(fn (Invoice $i) => [
                'id' => $i->id,
                'label' => $i->number,
                'url' => route('admin.invoices.show', $i),
            ]);

        $subscriptions = SiteSubscription::query()
            ->where('stripe_subscription_id', 'like', $term)
            ->with('site:uuid,name')
            ->limit($limit)
            ->get()
            ->map(fn (SiteSubscription $sub) => [
                'id' => $sub->id,
                'site_uuid' => $sub->site?->uuid,
                'label' => ($sub->site?->name ?? 'Site #'.$sub->site_id).' – '.$sub->stripe_subscription_id,
                'url' => $sub->site_id ? route('admin.sites.show', $sub->site) : route('admin.subscriptions.index'),
            ]);

        return response()->json([
            'sites' => $sites,
            'customers' => $customers,
            'invoices' => $invoices,
            'subscriptions' => $subscriptions,
        ]);
    }
}
