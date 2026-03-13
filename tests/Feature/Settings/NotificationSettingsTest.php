<?php

use App\Models\EmailTemplate;
use App\Models\User;

test('notifications settings page is displayed with templates and preferences', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('notifications.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/Notifications')
        ->has('templates')
        ->has('preferences')
        ->has('discordAvailable')
        ->has('discordConnected')
        ->has('discordConsentGiven')
    );
});

test('notification preferences can be updated', function () {
    $user = User::factory()->create();
    $templates = EmailTemplate::query()->orderBy('key')->get(['key', 'name']);
    $preferences = [];
    foreach ($templates as $t) {
        $preferences[$t->key] = $t->key === 'login' ? 'none' : 'email';
    }

    $response = $this
        ->actingAs($user)
        ->patch(route('notifications.update'), [
            'preferences' => $preferences,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('notifications.show'));

    $user->refresh();

    expect($user->notification_preferences)->toBeArray();
    expect($user->notification_preferences['login'] ?? null)->toBe('none');
});

test('notification preferences can be updated with email_discord when discord connected and consent given', function () {
    $user = User::factory()->create([
        'discord_id' => '123456789',
        'discord_notification_consent_at' => now(),
    ]);
    $templates = EmailTemplate::query()->orderBy('key')->get(['key', 'name']);
    $preferences = [];
    foreach ($templates as $t) {
        $preferences[$t->key] = $t->key === 'login' ? 'email_discord' : 'email';
    }

    $response = $this
        ->actingAs($user)
        ->patch(route('notifications.update'), [
            'preferences' => $preferences,
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('notifications.show'));
    $user->refresh();
    expect($user->notification_preferences['login'] ?? null)->toBe('email_discord');
});

test('discord or email_discord preference requires consent when user has not consented', function () {
    $user = User::factory()->create(['discord_id' => '123456789']);
    expect($user->discord_notification_consent_at)->toBeNull();

    $templates = EmailTemplate::query()->orderBy('key')->get(['key', 'name']);
    $preferences = [];
    foreach ($templates as $t) {
        $preferences[$t->key] = $t->key === 'login' ? 'discord' : 'email';
    }

    $response = $this
        ->actingAs($user)
        ->patch(route('notifications.update'), [
            'preferences' => $preferences,
        ]);

    $response->assertSessionHasErrors('discord_consent');
    $user->refresh();
    expect($user->notification_preferences['login'] ?? null)->not->toBe('discord');
});

test('discord or email_discord preference is accepted when discord_consent_accepted is sent', function () {
    $user = User::factory()->create(['discord_id' => '123456789']);
    $templates = EmailTemplate::query()->orderBy('key')->get(['key', 'name']);
    $preferences = [];
    foreach ($templates as $t) {
        $preferences[$t->key] = $t->key === 'login' ? 'discord' : 'email';
    }

    $response = $this
        ->actingAs($user)
        ->patch(route('notifications.update'), [
            'preferences' => $preferences,
            'discord_consent_accepted' => true,
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('notifications.show'));
    $user->refresh();
    expect($user->notification_preferences['login'] ?? null)->toBe('discord');
    expect($user->discord_notification_consent_at)->not->toBeNull();
});
