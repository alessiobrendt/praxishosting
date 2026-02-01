<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegacyMigrationController extends Controller
{
    public function index(Request $request): Response
    {
        $legacySitesWithoutSubscription = Site::query()
            ->where('is_legacy', true)
            ->whereDoesntHave('siteSubscription')
            ->with(['template', 'user'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/legacy-migration/Index', [
            'legacySites' => $legacySitesWithoutSubscription,
        ]);
    }
}
