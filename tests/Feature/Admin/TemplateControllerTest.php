<?php

use App\Models\Template;
use App\Models\User;

test('guests cannot access admin templates', function () {
    $response = $this->get(route('admin.templates.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin templates', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.templates.index'));
    $response->assertForbidden();
});

test('admin users can view template index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.templates.index'));
    $response->assertOk();
});

test('admin users can create template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->post(route('admin.templates.store'), [
        'name' => 'Test Template',
        'slug' => 'test-template',
        'price' => 0,
    ]);
    $response->assertRedirect();
    $this->assertDatabaseHas('templates', ['slug' => 'test-template']);
});

test('admin users can view template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = Template::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.templates.show', $template));
    $response->assertOk();
});

test('admin users can update template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = Template::factory()->create();
    $this->actingAs($user);

    $response = $this->put(route('admin.templates.update', $template), [
        'name' => 'Updated Name',
        'slug' => $template->slug,
        'price' => 10,
    ]);
    $response->assertRedirect();
    $template->refresh();
    expect($template->name)->toBe('Updated Name');
});

test('admin users can delete template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = Template::factory()->create();
    $this->actingAs($user);

    $response = $this->delete(route('admin.templates.destroy', $template));
    $response->assertRedirect(route('admin.templates.index'));
    $this->assertDatabaseMissing('templates', ['id' => $template->id]);
});
