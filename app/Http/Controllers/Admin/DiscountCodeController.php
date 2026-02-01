<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDiscountCodeRequest;
use App\Http\Requests\Admin\UpdateDiscountCodeRequest;
use App\Models\DiscountCode;
use App\Services\SyncDiscountCodeToStripeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscountCodeController extends Controller
{
    public function index(Request $request): Response
    {
        $discountCodes = DiscountCode::query()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/discount-codes/Index', [
            'discountCodes' => $discountCodes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/discount-codes/Create');
    }

    public function store(StoreDiscountCodeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['max_redemptions'] = $request->filled('max_redemptions') ? (int) $request->max_redemptions : null;
        $validated['valid_from'] = $request->filled('valid_from') ? $request->valid_from : null;
        $validated['valid_until'] = $request->filled('valid_until') ? $request->valid_until : null;

        $discountCode = DiscountCode::create($validated);

        app(SyncDiscountCodeToStripeService::class)->sync($discountCode);

        return redirect()->route('admin.discount-codes.index')->with('success', 'Rabattcode angelegt.');
    }

    public function edit(DiscountCode $discountCode): Response
    {
        return Inertia::render('admin/discount-codes/Edit', [
            'discountCode' => $discountCode,
        ]);
    }

    public function update(UpdateDiscountCodeRequest $request, DiscountCode $discountCode): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['max_redemptions'] = $request->filled('max_redemptions') ? (int) $request->max_redemptions : null;
        $validated['valid_from'] = $request->filled('valid_from') ? $request->valid_from : null;
        $validated['valid_until'] = $request->filled('valid_until') ? $request->valid_until : null;

        $discountCode->update($validated);

        app(SyncDiscountCodeToStripeService::class)->sync($discountCode);

        return redirect()->route('admin.discount-codes.index')->with('success', 'Rabattcode aktualisiert.');
    }

    public function destroy(DiscountCode $discountCode): RedirectResponse
    {
        app(SyncDiscountCodeToStripeService::class)->onDiscountCodeDeleted($discountCode);

        $discountCode->delete();

        return redirect()->route('admin.discount-codes.index')->with('success', 'Rabattcode gelöscht.');
    }
}
