<?php

use App\Http\Controllers\ModuleSubmissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'throttle:module-submit'])->group(function () {
    Route::post('sites/{site}/modules/submit', [ModuleSubmissionController::class, 'submit'])
        ->name('api.sites.modules.submit');

    Route::get('sites/{site}/modules/newsletter/status', [ModuleSubmissionController::class, 'newsletterStatus'])
        ->name('api.sites.modules.newsletter.status');
});
