<?php

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;

test('guests cannot access admin tickets', function () {
    $response = $this->get(route('admin.tickets.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin tickets', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.tickets.index'));
    $response->assertForbidden();
});

test('admin users can view tickets index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.tickets.index'));
    $response->assertOk();
});

test('admin users can view ticket', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create(['ticket_category_id' => $category->id]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.tickets.show', $ticket));
    $response->assertOk();
});

test('admin users can update ticket', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create(['ticket_category_id' => $category->id, 'status' => 'open']);
    $this->actingAs($admin);

    $response = $this->put(route('admin.tickets.update', $ticket), [
        'status' => 'in_progress',
        'ticket_category_id' => $ticket->ticket_category_id,
    ]);
    $response->assertRedirect(route('admin.tickets.show', $ticket));
    $ticket->refresh();
    expect($ticket->status)->toBe('in_progress');
});

test('admin users can post message on ticket', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create(['ticket_category_id' => $category->id]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.tickets.messages.store', $ticket), [
        'body' => 'Admin reply',
        'is_internal' => false,
    ]);
    $response->assertRedirect(route('admin.tickets.show', $ticket));
    $this->assertDatabaseHas('ticket_messages', ['ticket_id' => $ticket->id, 'body' => 'Admin reply']);
});
