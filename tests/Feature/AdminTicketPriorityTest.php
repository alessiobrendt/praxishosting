<?php

use App\Models\TicketPriority;
use App\Models\User;

test('guests cannot access admin ticket priorities', function () {
    $response = $this->get(route('admin.ticket-priorities.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin ticket priorities', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.ticket-priorities.index'));
    $response->assertForbidden();
});

test('admin users can view ticket priorities index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.ticket-priorities.index'));
    $response->assertOk();
});

test('admin users can create ticket priority', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->post(route('admin.ticket-priorities.store'), [
        'name' => 'Hoch',
        'slug' => 'hoch',
        'color' => '#ef4444',
        'sort_order' => 1,
        'is_active' => true,
    ]);
    $response->assertRedirect(route('admin.ticket-priorities.index'));
    $this->assertDatabaseHas('ticket_priorities', ['slug' => 'hoch']);
});

test('admin users can update ticket priority', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $priority = TicketPriority::factory()->create();
    $this->actingAs($user);

    $response = $this->put(route('admin.ticket-priorities.update', $priority), [
        'name' => 'Dringend',
        'slug' => $priority->slug,
        'color' => '#dc2626',
        'sort_order' => 0,
        'is_active' => true,
    ]);
    $response->assertRedirect(route('admin.ticket-priorities.index'));
    $priority->refresh();
    expect($priority->name)->toBe('Dringend');
});

test('admin users can delete ticket priority', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $priority = TicketPriority::factory()->create();
    $this->actingAs($user);

    $response = $this->delete(route('admin.ticket-priorities.destroy', $priority));
    $response->assertRedirect(route('admin.ticket-priorities.index'));
    $this->assertDatabaseMissing('ticket_priorities', ['id' => $priority->id]);
});
