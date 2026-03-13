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
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.settings.index', ['tab' => 'marken']);
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
            'admin_domains' => ['nullable', 'array'],
            'admin_domains.*' => ['string', 'max:255'],
            'is_default' => ['boolean'],
            'logo_url' => ['nullable', 'string', 'max:500'],
            'logo_collapsed_url' => ['nullable', 'string', 'max:500'],
            'theme_colors' => ['nullable', 'array'],
            'theme_colors.*' => ['nullable', 'string', 'max:50'],
            'features' => ['nullable', 'array'],
            'features.sites_editor' => ['boolean'],
            'features.webspace' => ['boolean'],
            'features.domains_shop' => ['boolean'],
            'features.ai_tokens' => ['boolean'],
            'features.gaming' => ['boolean'],
            'features.gameserver_cloud' => ['boolean'],
            'features.teamspeak' => ['boolean'],
            'features.discord_notifications' => ['boolean'],
            'features.prepaid_balance' => ['boolean'],
            'features.balance_topup' => ['boolean'],
            'features.balance_period_months' => ['nullable', 'integer', 'min:1', 'max:24'],
            'salutation' => ['nullable', 'string', 'in:formal,informal'],
            'mail_header' => ['nullable', 'string', 'max:2000'],
            'mail_footer' => ['nullable', 'string', 'max:2000'],
            'seo' => ['nullable', 'array'],
            'seo.favicon_url' => ['nullable', 'string', 'max:500'],
            'seo.meta_description' => ['nullable', 'string', 'max:1000'],
            'seo.meta_robots' => ['nullable', 'string', 'max:100'],
            'seo.theme_color' => ['nullable', 'string', 'max:50'],
            'seo.og_type' => ['nullable', 'string', 'max:50'],
            'seo.og_site_name' => ['nullable', 'string', 'max:255'],
            'seo.og_title' => ['nullable', 'string', 'max:255'],
            'seo.og_description' => ['nullable', 'string', 'max:1000'],
            'seo.og_image' => ['nullable', 'string', 'max:500'],
            'seo.og_locale' => ['nullable', 'string', 'max:20'],
        ]);

        if (isset($validated['domains'])) {
            $validated['domains'] = array_values(array_filter(array_map('trim', $validated['domains'])));
        }
        if (isset($validated['admin_domains'])) {
            $validated['admin_domains'] = array_values(array_filter(array_map(
                fn (string $d) => Brand::normalizeDomainToHost($d),
                array_map('trim', $validated['admin_domains']),
            )));
        }
        $validated['is_default'] = filter_var($validated['is_default'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($validated['is_default']) {
            Brand::query()->where('id', '!=', $brand->id)->update(['is_default' => false]);
        }
        if (isset($validated['features']['balance_period_months'])) {
            $validated['features']['balance_period_months'] = max(1, min(24, (int) $validated['features']['balance_period_months']));
        }

        $brand->update($validated);

        return redirect()->route('admin.settings.index', ['tab' => 'marken'])->with('success', 'Marke gespeichert.');
    }
}
