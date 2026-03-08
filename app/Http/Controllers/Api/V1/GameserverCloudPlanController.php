<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\GameserverCloudPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameserverCloudPlanController extends ApiV1Controller
{
    /**
     * List active Gameserver Cloud plans for landing page / configurator.
     */
    public function index(Request $request): JsonResponse
    {
        $brand = $this->resolveBrand($request);
        $brandId = $brand?->id;

        $plans = GameserverCloudPlan::query()
            ->where('is_active', true)
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $data = $plans->map(fn (GameserverCloudPlan $plan) => $this->planToArray($plan))->values()->all();

        return response()->json(['data' => $data]);
    }

    /**
     * @return array<string, mixed>
     */
    private function planToArray(GameserverCloudPlan $plan): array
    {
        $config = $plan->config ?? [];
        if (! is_array($config)) {
            $config = [];
        }
        if (! isset($config['plan_options']) || ! is_array($config['plan_options'])) {
            $config['plan_options'] = [];
        }

        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => (string) $plan->price,
            'config' => $config,
        ];
    }
}
