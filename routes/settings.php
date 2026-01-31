<?php

use App\Http\Controllers\PinVerificationController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecuritySettingsController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::post('pin/verify', [PinVerificationController::class, 'store'])
        ->middleware('throttle:pin')
        ->name('pin.verify');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/Appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    Route::get('settings/security', [SecuritySettingsController::class, 'show'])->name('security.show');
    Route::patch('settings/security', [SecuritySettingsController::class, 'update'])->name('security.update');
    Route::post('settings/security/pin', [SecuritySettingsController::class, 'storePin'])->name('security.pin.store');
    Route::put('settings/security/pin', [SecuritySettingsController::class, 'updatePin'])->name('security.pin.update');
    Route::delete('settings/security/pin', [SecuritySettingsController::class, 'destroyPin'])->name('security.pin.destroy');
});
