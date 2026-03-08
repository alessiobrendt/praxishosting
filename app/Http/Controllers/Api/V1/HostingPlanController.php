<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\HostingPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostingPlanController extends ApiV1Controller
{
    /**
     * List active hosting plans for configurator (webspace, gaming, teamspeak).
     * Query: type = all|webspace|gaming|teamspeak
     */
    public function index(Request $request): JsonResponse
    {
        $brand = $this->resolveBrand($request);
        $brandId = $brand?->id;
        $type = $request->query('type', 'all');

        $query = HostingPlan::query()
            ->where('is_active', true)
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId));

        $query->when($type === 'webspace', fn ($q) => $q->where(function ($q) {
            $q->where('panel_type', 'plesk')->orWhereNull('panel_type');
        }));
        $query->when($type === 'gaming', fn ($q) => $q->where('panel_type', 'pterodactyl'));
        $query->when($type === 'teamspeak', fn ($q) => $q->where('panel_type', 'teamspeak'));

        $plans = $query->orderBy('sort_order')->orderBy('name')->get();

        $data = $plans->map(fn (HostingPlan $plan) => $this->planToArray($plan))->values()->all();

        return response()->json(['data' => $data]);
    }

    /**
     * @return array<string, mixed>
     */
    private function planToArray(HostingPlan $plan): array
    {
        $config = $plan->config ?? [];
        if (! is_array($config)) {
            $config = [];
        }
        if (! isset($config['plan_options']) || ! is_array($config['plan_options'])) {
            $config['plan_options'] = [];
        }

        $base = [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => (string) $plan->price,
            'panel_type' => $plan->panel_type,
            'config' => $config,
        ];

        if (in_array($plan->panel_type, ['pterodactyl', 'teamspeak'], true)) {
            return $base;
        }

        return array_merge($base, [
            'disk_gb' => $plan->disk_gb,
            'traffic_gb' => $plan->traffic_gb,
            'domains' => $plan->domains,
            'subdomains' => $plan->subdomains,
            'mailboxes' => $plan->mailboxes,
            'databases' => $plan->databases,
        ]);
    }
}
