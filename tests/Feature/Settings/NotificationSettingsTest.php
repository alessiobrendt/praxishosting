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
