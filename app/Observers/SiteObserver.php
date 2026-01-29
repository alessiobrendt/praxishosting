<?php

namespace App\Observers;

use App\Models\Site;
use App\Models\SiteVersion;
use Illuminate\Support\Facades\Auth;

class SiteObserver
{
    /**
     * Handle the Site "updated" event.
     */
    public function updated(Site $site): void
    {
        // Only create version if custom_page_data or custom_colors changed
        $changed = $site->getChanges();
        $shouldVersion = isset($changed['custom_page_data']) || isset($changed['custom_colors']);

        if ($shouldVersion && Auth::check()) {
            $this->createVersion($site, Auth::id());
        }
    }

    /**
     * Create a new version snapshot.
     */
    protected function createVersion(Site $site, int $userId): void
    {
        $latestVersion = $site->versions()->latest('version_number')->first();
        $versionNumber = $latestVersion ? $latestVersion->version_number + 1 : 1;

        $version = SiteVersion::create([
            'site_id' => $site->id,
            'version_number' => $versionNumber,
            'name' => "Version {$versionNumber}",
            'description' => 'Automatisch erstellt',
            'custom_page_data' => $site->custom_page_data,
            'custom_colors' => $site->custom_colors,
            'is_published' => false,
            'created_by' => $userId,
        ]);

        // Update draft version
        $site->update(['draft_version_id' => $version->id]);
    }
}
