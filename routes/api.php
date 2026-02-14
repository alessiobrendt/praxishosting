<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\ModuleSubmissionController;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'throttle:10,1'])->prefix('ai')->group(function () {
    Route::post('seo-suggestions', [AiController::class, 'seoSuggestions'])->name('api.ai.seo-suggestions');
    Route::post('generate-text', [AiController::class, 'generateText'])->name('api.ai.generate-text');
    Route::get('balance', [AiController::class, 'balance'])->name('api.ai.balance');
});

Route::middleware(['web', 'throttle:module-submit'])->group(function () {
    Route::post('sites/{site}/modules/submit', [ModuleSubmissionController::class, 'submit'])
        ->name('api.sites.modules.submit');

    Route::get('sites/{site}/modules/newsletter/status', [ModuleSubmissionController::class, 'newsletterStatus'])
        ->name('api.sites.modules.newsletter.status');
});

// Caddy On-Demand TLS verification endpoint
Route::get('verify-domain', function (Request $request) {
    $domain = $request->query('domain');

    if (! $domain) {
        return response('Bad Request', 400);
    }

    $exists = Domain::query()
        ->where('domain', $domain)
        ->where('is_verified', true)
        ->exists();

    return $exists
        ? response('', 200)
        : response('', 403);
})->name('api.verify-domain');
