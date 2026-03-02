<?php

use App\Models\User;

test('admin dashboard returns layout and widget registry', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/Dashboard')
        ->has('layout')
        ->has('widgetRegistry')
    );
    $props = $response->original->getData()['page']['props'] ?? [];
    expect($props['layout'])->toBeArray();
    expect($props['layout'])->not->toBeEmpty();
    expect($props['widgetRegistry'])->toBeArray();
    expect($props['widgetRegistry'])->not->toBeEmpty();
});

test('admin can save dashboard layout', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $layout = [
        ['i' => 'revenue-today', 'x' => 0, 'y' => 0, 'w' => 2, 'h' => 1],
        ['i' => 'customers-total', 'x' => 2, 'y' => 0, 'w' => 2, 'h' => 1],
    ];

    $response = $this->putJson(route('admin.dashboard.layout.update'), ['layout' => $layout]);

    $response->assertOk();
    $response->assertJson(['success' => true]);

    $admin->refresh();
    expect($admin->admin_dashboard_layout)->toBeArray();
    expect($admin->admin_dashboard_layout['layout'])->toEqual($layout);
});

test('admin can fetch widget data for valid key', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->getJson(route('admin.dashboard.widgets.show', ['widgetKey' => 'revenue-today']));

    $response->assertOk();
    $response->assertJsonStructure(['value']);
});

test('widget data returns 404 for invalid key', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->getJson(route('admin.dashboard.widgets.show', ['widgetKey' => 'invalid-widget-key']));

    $response->assertNotFound();
});
