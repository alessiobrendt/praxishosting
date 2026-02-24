<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('social redirect redirects to provider authorize url', function () {
    Socialite::fake('google');

    $response = $this->get(route('auth.social.redirect', ['provider' => 'google']));

    $response->assertRedirect('https://socialite.fake/google/authorize');
});

test('social redirect works for discord', function () {
    Socialite::fake('discord');

    $response = $this->get(route('auth.social.redirect', ['provider' => 'discord']));

    $response->assertRedirect('https://socialite.fake/discord/authorize');
});

test('invalid provider returns 404', function () {
    $response = $this->get(route('auth.social.redirect', ['provider' => 'invalid']));

    $response->assertNotFound();
});

test('callback creates user and logs in when user does not exist', function () {
    $socialUser = (new SocialiteUser)->map([
        'id' => 'google-123',
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);
    Socialite::fake('google', $socialUser);

    $response = $this->get(route('auth.social.callback', ['provider' => 'google']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'name' => 'John Doe',
        'google_id' => 'google-123',
    ]);
    $user = User::where('google_id', 'google-123')->first();
    expect($user->password)->toBeNull();
});

test('callback does not overwrite existing user name when linking by email', function () {
    $existingUser = User::factory()->create([
        'name' => 'Existing Name',
        'email' => 'existing@example.com',
    ]);
    $socialUser = (new SocialiteUser)->map([
        'id' => 'google-456',
        'name' => 'Social Name',
        'email' => 'existing@example.com',
    ]);
    Socialite::fake('google', $socialUser);

    $response = $this->get(route('auth.social.callback', ['provider' => 'google']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $existingUser->refresh();
    expect($existingUser->name)->toBe('Existing Name');
    expect($existingUser->google_id)->toBe('google-456');
});

test('callback sets name when existing user has empty name', function () {
    $existingUser = User::factory()->create([
        'name' => '',
        'email' => 'emptyname@example.com',
    ]);
    $socialUser = (new SocialiteUser)->map([
        'id' => 'google-789',
        'name' => 'From Google',
        'email' => 'emptyname@example.com',
    ]);
    Socialite::fake('google', $socialUser);

    $this->get(route('auth.social.callback', ['provider' => 'google']));

    $existingUser->refresh();
    expect($existingUser->name)->toBe('From Google');
    expect($existingUser->google_id)->toBe('google-789');
});

test('callback finds existing user by provider id and does not overwrite name', function () {
    $existingUser = User::factory()->create([
        'name' => 'Already Linked',
        'email' => 'linked@example.com',
        'google_id' => 'google-existing',
    ]);
    $socialUser = (new SocialiteUser)->map([
        'id' => 'google-existing',
        'name' => 'New Name From Google',
        'email' => 'linked@example.com',
    ]);
    Socialite::fake('google', $socialUser);

    $response = $this->get(route('auth.social.callback', ['provider' => 'google']));

    $this->assertAuthenticatedAs($existingUser);
    $existingUser->refresh();
    expect($existingUser->name)->toBe('Already Linked');
});
