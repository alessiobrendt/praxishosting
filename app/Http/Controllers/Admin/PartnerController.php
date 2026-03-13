<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePartnerRequest;
use App\Http\Requests\Admin\UpdatePartnerRequest;
use App\Models\AdminActivityLog;
use App\Models\Brand;
use App\Models\Partner;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(Request $request): Response
    {
        $partners = Partner::query()
            ->with(['brand:id,key,name', 'user:id,name,email'])
            ->when($request->filled('brand_id'), fn ($q) => $q->where('brand_id', $request->brand_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $brands = Brand::query()->orderBy('name')->get(['id', 'key', 'name']);

        return Inertia::render('admin/partners/Index', [
            'partners' => $partners,
            'brands' => $brands,
        ]);
    }

    public function create(): Response
    {
        $brands = Brand::query()->orderBy('name')->get(['id', 'key', 'name']);
        $users = User::query()->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('admin/partners/Create', [
            'brands' => $brands,
            'users' => $users,
        ]);
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['expires_at'] = $request->filled('expires_at') ? $request->expires_at : null;
        $validated['user_id'] = $request->filled('user_id') ? (int) $request->user_id : null;
        unset($validated['image']);

        $partner = Partner::create($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('partners', 'public');
            $partner->update(['image_path' => $path]);
        }

        AdminActivityLog::log($request->user()->id, 'partner_created', Partner::class, $partner->id, null, ['name' => $partner->name]);

        return redirect()->route('admin.partners.index')->with('success', 'Partner angelegt.');
    }

    public function edit(Partner $partner): Response
    {
        $partner->load(['brand:id,key,name', 'user:id,name,email']);
        $brands = Brand::query()->orderBy('name')->get(['id', 'key', 'name']);
        $users = User::query()->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('admin/partners/Edit', [
            'partner' => $partner,
            'brands' => $brands,
            'users' => $users,
        ]);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['expires_at'] = $request->filled('expires_at') ? $request->expires_at : null;
        $validated['user_id'] = $request->filled('user_id') ? (int) $request->user_id : null;
        unset($validated['image']);

        if ($request->hasFile('image')) {
            if ($partner->image_path && Storage::disk('public')->exists($partner->image_path)) {
                Storage::disk('public')->delete($partner->image_path);
            }
            $path = $request->file('image')->store('partners', 'public');
            $validated['image_path'] = $path;
        }

        $old = $partner->only(array_keys($validated));
        $partner->update($validated);

        AdminActivityLog::log($request->user()->id, 'partner_updated', Partner::class, $partner->id, $old, $validated);

        return redirect()->route('admin.partners.index')->with('success', 'Partner aktualisiert.');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $old = $partner->only(['name', 'brand_id', 'is_active']);
        if ($partner->image_path && Storage::disk('public')->exists($partner->image_path)) {
            Storage::disk('public')->delete($partner->image_path);
        }
        $partner->delete();

        AdminActivityLog::log(request()->user()->id, 'partner_deleted', Partner::class, $partner->id, $old, null);

        return redirect()->route('admin.partners.index')->with('success', 'Partner gelöscht.');
    }
}
