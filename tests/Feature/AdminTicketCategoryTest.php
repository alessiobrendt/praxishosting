<?php

use App\Models\TicketCategory;
use App\Models\User;

test('guests cannot access admin ticket categories', function () {
    $response = $this->get(route('admin.ticket-categories.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin ticket categories', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.ticket-categories.index'));
    $response->assertForbidden();
});

test('admin users can view ticket categories index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.ticket-categories.index'));
    $response->assertOk();
});

test('admin users can create ticket category', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->post(route('admin.ticket-categories.store'), [
        'name' => 'Technisch',
        'slug' => 'technisch',
        'description' => 'Technische Anfragen',
        'sort_order' => 0,
        'is_active' => true,
    ]);
    $response->assertRedirect(route('admin.ticket-categories.index'));
    $this->assertDatabaseHas('ticket_categories', ['slug' => 'technisch']);
});

test('admin users can update ticket category', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $category = TicketCategory::factory()->create();
    $this->actingAs($user);

    $response = $this->put(route('admin.ticket-categories.update', $category), [
        'name' => 'Updated Category',
        'slug' => $category->slug,
        'sort_order' => 1,
        'is_active' => true,
    ]);
    $response->assertRedirect(route('admin.ticket-categories.index'));
    $category->refresh();
    expect($category->name)->toBe('Updated Category');
});

test('admin users can delete ticket category', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $category = TicketCategory::factory()->create();
    $this->actingAs($user);

    $response = $this->delete(route('admin.ticket-categories.destroy', $category));
    $response->assertRedirect(route('admin.ticket-categories.index'));
    $this->assertDatabaseMissing('ticket_categories', ['id' => $category->id]);
});
