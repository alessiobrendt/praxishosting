<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\TemplatePageController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\SiteCollaboratorController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SiteRenderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('components', function () {
    return Inertia::render('components/Demo');
})->middleware(['auth', 'verified'])->name('components.demo');

Route::get('gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('gallery/preview/{template}', [GalleryController::class, 'preview'])->name('gallery.preview');

Route::get('site/{site:slug}/{pageSlug?}', [SiteRenderController::class, 'show'])
    ->where('pageSlug', '[a-z0-9\-]+')
    ->name('site-render.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('sites/{site}/design', [SiteController::class, 'design'])->name('sites.design');
    Route::get('sites/{site}/preview/{pageSlug?}', [SiteRenderController::class, 'preview'])
        ->name('sites.preview')
        ->where('pageSlug', '[a-z0-9\-]+');
    Route::resource('sites', SiteController::class);
    Route::post('sites/{site}/preview', [SiteRenderController::class, 'storePreviewDraft'])->name('sites.preview.store');
    Route::get('sites/{site}/images', [SiteController::class, 'indexImages'])->name('sites.images.index');
    Route::post('sites/{site}/images', [SiteController::class, 'uploadImage'])->name('sites.images.store');
    Route::get('sites/{site}/collaborators', [SiteCollaboratorController::class, 'index'])->name('sites.collaborators.index');
    Route::post('sites/{site}/collaborators', [SiteCollaboratorController::class, 'store'])->name('sites.collaborators.store');
    Route::delete('sites/{site}/collaborators/{user}', [SiteCollaboratorController::class, 'destroy'])->name('sites.collaborators.destroy');
    Route::delete('sites/{site}/invitations/{invitation}', [SiteCollaboratorController::class, 'destroyInvitation'])->name('sites.invitations.destroy');
    Route::get('sites/{site}/versions', [\App\Http\Controllers\SiteVersionController::class, 'index'])->name('sites.versions.index');
    Route::post('sites/{site}/versions/{version}/publish', [\App\Http\Controllers\SiteVersionController::class, 'publish'])->name('sites.versions.publish');
    Route::post('sites/{site}/versions/{version}/rollback', [\App\Http\Controllers\SiteVersionController::class, 'rollback'])->name('sites.versions.rollback');
    Route::get('sites/{site}/domains', [\App\Http\Controllers\SiteDomainController::class, 'index'])->name('sites.domains.index');
    Route::post('sites/{site}/domains', [\App\Http\Controllers\SiteDomainController::class, 'store'])->name('sites.domains.store');
    Route::post('sites/{site}/domains/{domain}/verify', [\App\Http\Controllers\SiteDomainController::class, 'verify'])->name('sites.domains.verify');
    Route::post('sites/{site}/domains/{domain}/set-primary', [\App\Http\Controllers\SiteDomainController::class, 'setPrimary'])->name('sites.domains.set-primary');
    Route::delete('sites/{site}/domains/{domain}', [\App\Http\Controllers\SiteDomainController::class, 'destroy'])->name('sites.domains.destroy');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('templates', TemplateController::class);
    Route::get('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'design'])->name('templates.design');
    Route::put('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'update'])->name('templates.design.update');
    Route::resource('templates.pages', TemplatePageController::class)->except(['index']);
    Route::get('templates/{template}/pages', [TemplatePageController::class, 'index'])->name('templates.pages.index');
    Route::get('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'edit'])->name('templates.pages.data.edit');
    Route::put('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'update'])->name('templates.pages.data.update');
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
});

require __DIR__.'/settings.php';

require __DIR__.'/api.php';
