<?php

use App\Models\User;

test('integration settings page is displayed for authenticated user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('integration.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/Integration')
        ->has('discordConnected')
        ->has('discordConnectUrl')
    );
});

test('user with discord connected sees discordConnected true', function () {
    $user = User::factory()->create(['discord_id' => '987654321']);

    $response = $this
        ->actingAs($user)
        ->get(route('integration.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('discordConnected', true)
    );
});

test('user can disconnect discord', function () {
    $user = User::factory()->create(['discord_id' => '987654321']);

    $response = $this
        ->actingAs($user)
        ->delete(route('integration.discord.disconnect'));

    $response->assertRedirect(route('integration.show'));
    $response->assertSessionHas('success');
    $user->refresh();
    expect($user->discord_id)->toBeNull();
});

test('guest cannot access integration page', function () {
    $response = $this->get(route('integration.show'));

    $response->assertRedirect(route('login'));
});
