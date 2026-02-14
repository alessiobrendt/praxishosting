<?php

namespace App\Observers;

use App\Models\Site;
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
        $site->createVersionSnapshot($userId);
    }
}
