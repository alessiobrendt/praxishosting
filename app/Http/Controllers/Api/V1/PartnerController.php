<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Partner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartnerController extends ApiV1Controller
{
    /**
     * List active partners for the brand (name, description, image_url).
     */
    public function index(Request $request): JsonResponse
    {
        $brand = $this->resolveBrand($request);
        $brandId = $brand?->id;

        $partners = Partner::query()
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->when($brandId !== null, fn ($q) => $q->where('brand_id', $brandId))
            ->orderBy('name')
            ->get(['id', 'brand_id', 'name', 'description', 'image_path']);

        $data = $partners->map(fn (Partner $p) => [
            'name' => $p->name,
            'description' => $p->description,
            'image_url' => $p->image_path ? Storage::disk('public')->url($p->image_path) : null,
        ])->values()->all();

        return response()->json(['data' => $data]);
    }
}
