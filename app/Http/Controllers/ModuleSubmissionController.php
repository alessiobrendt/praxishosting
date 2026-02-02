<?php

namespace App\Http\Controllers;

use App\Http\Requests\ModuleSubmissionRequest;
use App\Models\Site;
use App\Modules\ModuleRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleSubmissionController extends Controller
{
    /**
     * Handle module submission (contact form, newsletter, etc.).
     */
    public function submit(Site $site, ModuleSubmissionRequest $request): JsonResponse
    {
        $handler = ModuleRegistry::resolve($request->validated('module_type'));

        if ($handler === null) {
            return response()->json([
                'success' => false,
                'errors' => ['module_type' => [__('Unbekanntes Modul.')]],
            ], 422);
        }

        $isPreviewContext = $request->user() && $request->user()->can('update', $site);

        if ($site->status !== 'active' && ! $isPreviewContext) {
            return response()->json([
                'success' => false,
                'errors' => ['site' => [__('Diese Seite ist nicht verfügbar.')]],
            ], 422);
        }

        return $handler->handle($site, $request);
    }

    /**
     * Get newsletter subscription status (cookie-based, for state-sensitive UI).
     */
    public function newsletterStatus(Site $site, Request $request): JsonResponse
    {
        $subscribed = $request->cookie("newsletter_subscribed_{$site->id}");

        return response()->json([
            'subscribed' => $subscribed === '1' || $subscribed === true,
        ]);
    }
}
