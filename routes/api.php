<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\DomainController;
use App\Http\Controllers\Api\V1\GameserverCloudPlanController;
use App\Http\Controllers\Api\V1\HostingPlanController;
use App\Http\Controllers\Api\V1\HostingServerController;
use App\Http\Controllers\Api\V1\PartnerController;
use App\Http\Controllers\Api\V1\PterodactylController;
use App\Http\Controllers\Api\V1\StatsController;
use App\Http\Controllers\ModuleSubmissionController;
use App\Models\Brand;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('v1')->group(function () {
    Route::get('stats', StatsController::class)->name('api.v1.stats');
    Route::get('domains/tlds', [DomainController::class, 'tlds'])->name('api.v1.domains.tlds');
    Route::post('domains/check-availability', [DomainController::class, 'checkAvailability'])->name('api.v1.domains.check-availability');
    Route::get('hosting-plans', [HostingPlanController::class, 'index'])->name('api.v1.hosting-plans.index');
    Route::get('gameserver-cloud-plans', [GameserverCloudPlanController::class, 'index'])->name('api.v1.gameserver-cloud-plans.index');
    Route::get('hosting-servers', [HostingServerController::class, 'index'])->name('api.v1.hosting-servers.index');
    Route::get('hosting-servers/{hostingServer}', [HostingServerController::class, 'show'])->name('api.v1.hosting-servers.show');
    Route::get('pterodactyl/nests', [PterodactylController::class, 'nests'])->name('api.v1.pterodactyl.nests');
    Route::get('pterodactyl/eggs', [PterodactylController::class, 'eggs'])->name('api.v1.pterodactyl.eggs');
    Route::get('brand', [BrandController::class, 'show'])->name('api.v1.brand.show');
    Route::get('brand/features', [BrandController::class, 'features'])->name('api.v1.brand.features');
    Route::get('brand/contact', [BrandController::class, 'contact'])->name('api.v1.brand.contact');
    Route::get('partners', [PartnerController::class, 'index'])->name('api.v1.partners.index');
});

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

    $domain = strtolower(trim($domain));

    $verifiedSiteDomain = Domain::query()
        ->where('domain', $domain)
        ->where('is_verified', true)
        ->exists();

    $allowedByBrand = Brand::query()
        ->whereNotNull('domains')
        ->whereJsonContains('domains', $domain)
        ->exists();

    $allowedByAdminDomain = Brand::resolveByAdminHost($domain) !== null;

    $allowed = $verifiedSiteDomain || $allowedByBrand || $allowedByAdminDomain;

    return $allowed
        ? response('OK', 200)
        : response('Forbidden', 403);
})->name('api.verify-domain');
