<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteVersion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteVersionController extends Controller
{
    public function index(Site $site): Response
    {
        $this->authorize('view', $site);

        $site->load(['versions.creator']);

        return Inertia::render('sites/versions/Index', [
            'site' => $site,
            'versions' => $site->versions()->with('creator')->latest('version_number')->get(),
        ]);
    }

    public function show(Site $site, SiteVersion $version): Response
    {
        $this->authorize('view', $site);

        if ($version->site_id !== $site->id) {
            abort(404);
        }

        return Inertia::render('sites/versions/Show', [
            'site' => $site,
            'version' => $version->load('creator'),
        ]);
    }

    public function publish(Request $request, Site $site, SiteVersion $version): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($version->site_id !== $site->id) {
            abort(404);
        }

        // Unpublish current published version
        if ($site->published_version_id) {
            SiteVersion::where('id', $site->published_version_id)->update(['is_published' => false]);
        }

        // Publish new version
        $version->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        // Update site with published version
        $site->update([
            'published_version_id' => $version->id,
            'custom_page_data' => $version->custom_page_data,
            'custom_colors' => $version->custom_colors,
        ]);

        return back()->with('success', __('Version erfolgreich veröffentlicht.'));
    }

    public function rollback(Request $request, Site $site, SiteVersion $version): RedirectResponse
    {
        $this->authorize('update', $site);

        if ($version->site_id !== $site->id) {
            abort(404);
        }

        // Restore site data from version
        $site->update([
            'custom_page_data' => $version->custom_page_data,
            'custom_colors' => $version->custom_colors,
        ]);

        return back()->with('success', __('Version erfolgreich wiederhergestellt.'));
    }
}
