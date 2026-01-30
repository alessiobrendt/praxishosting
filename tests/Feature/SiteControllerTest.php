<?php

use App\Models\Site;
use App\Models\Template;
use App\Models\User;

test('guests cannot access sites index', function () {
    $response = $this->get(route('sites.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view sites index', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('sites.index'));
    $response->assertOk();
});

test('authenticated users can create site', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('sites.store'), [
        'template_id' => $template->id,
        'name' => 'My Site',
    ]);
    $response->assertRedirect();
    $this->assertDatabaseHas('sites', [
        'user_id' => $user->id,
        'name' => 'My Site',
    ]);
});

test('user can view own site', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user);

    $response = $this->get(route('sites.show', $site));
    $response->assertOk();
});

test('user cannot view other users site without collaboration', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $otherUser->id]);
    $this->actingAs($user);

    $response = $this->get(route('sites.show', $site));
    $response->assertForbidden();
});

test('user can update site with custom_page_data and custom_colors', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id]);
    $this->actingAs($user);

    $customColors = ['primary' => '#059669', 'secondary' => '#0f172a'];
    $customPageData = [
        'hero' => ['heading' => 'Custom Hero', 'text' => 'Custom text'],
    ];

    $response = $this->put(route('sites.update', $site), [
        'name' => $site->name,
        'custom_colors' => $customColors,
        'custom_page_data' => $customPageData,
    ]);
    $response->assertRedirect(route('sites.show', $site));

    $site->refresh();
    expect($site->custom_colors)->toBe($customColors);
    expect($site->custom_page_data)->toBe($customPageData);
});

test('guests cannot access page designer', function () {
    $site = Site::factory()->create(['has_page_designer' => true]);
    $response = $this->get(route('sites.design', $site));
    $response->assertRedirect(route('login'));
});

test('user cannot access other users page designer', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $otherUser->id, 'has_page_designer' => true]);
    $this->actingAs($user);

    $response = $this->get(route('sites.design', $site));
    $response->assertForbidden();
});

test('user gets 403 when page designer is not enabled for site', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id, 'has_page_designer' => false]);
    $this->actingAs($user);

    $response = $this->get(route('sites.design', $site));
    $response->assertForbidden();
});

test('user can access page designer when enabled for site', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id, 'has_page_designer' => true]);
    $this->actingAs($user);

    $response = $this->get(route('sites.design', $site));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('sites/PageDesigner')
        ->where('site.id', $site->id)
        ->has('baseDomain')
    );
});
