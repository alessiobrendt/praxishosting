<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()->orderBy('key')->get();

        return Inertia::render('admin/brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('admin/brands/Edit', [
            'brand' => $brand,
        ]);
    }

    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'domains' => ['nullable', 'array'],
            'domains.*' => ['string', 'max:255'],
            'is_default' => ['boolean'],
            'logo_url' => ['nullable', 'string', 'max:500'],
            'theme_colors' => ['nullable', 'array'],
            'theme_colors.*' => ['nullable', 'string', 'max:50'],
            'features' => ['nullable', 'array'],
            'features.sites_editor' => ['boolean'],
            'features.webspace' => ['boolean'],
            'features.domains_shop' => ['boolean'],
            'features.ai_tokens' => ['boolean'],
            'features.gaming' => ['boolean'],
            'salutation' => ['nullable', 'string', 'in:formal,informal'],
            'mail_header' => ['nullable', 'string', 'max:2000'],
            'mail_footer' => ['nullable', 'string', 'max:2000'],
        ]);

        if (isset($validated['domains'])) {
            $validated['domains'] = array_values(array_filter(array_map('trim', $validated['domains'])));
        }
        $validated['is_default'] = filter_var($validated['is_default'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($validated['is_default']) {
            Brand::query()->where('id', '!=', $brand->id)->update(['is_default' => false]);
        }

        $brand->update($validated);

        return redirect()->route('admin.brands.index')->with('success', 'Marke gespeichert.');
    }
}
