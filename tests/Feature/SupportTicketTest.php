<?php

use App\Models\Setting;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;

test('guests cannot access support index', function () {
    $response = $this->get(route('support.index'));
    $response->assertRedirect(route('login'));
});

test('customers can view support index', function () {
    Setting::set('support_enabled', '1');
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('support.index'));
    $response->assertOk();
});

test('customers can create ticket', function () {
    Setting::set('support_enabled', '1');
    $user = User::factory()->create(['is_admin' => false]);
    $category = TicketCategory::factory()->create(['is_active' => true]);
    $this->actingAs($user);

    $response = $this->post(route('support.store'), [
        'subject' => 'Test Ticket',
        'body' => 'First message body',
        'ticket_category_id' => $category->id,
        'ticket_priority_id' => '',
        'site_uuid' => '',
    ]);
    $response->assertRedirect();
    $this->assertDatabaseHas('tickets', ['user_id' => $user->id, 'subject' => 'Test Ticket']);
    $this->assertDatabaseHas('ticket_messages', ['body' => 'First message body']);
});

test('customers can only view own tickets', function () {
    Setting::set('support_enabled', '1');
    $owner = User::factory()->create(['is_admin' => false]);
    $other = User::factory()->create(['is_admin' => false]);
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create(['user_id' => $owner->id, 'ticket_category_id' => $category->id]);
    $this->actingAs($other);

    $response = $this->get(route('support.show', $ticket));
    $response->assertForbidden();
});

test('customers can view and reply to own ticket', function () {
    Setting::set('support_enabled', '1');
    $user = User::factory()->create(['is_admin' => false]);
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create(['user_id' => $user->id, 'ticket_category_id' => $category->id]);
    $this->actingAs($user);

    $response = $this->get(route('support.show', $ticket));
    $response->assertOk();

    $response = $this->post(route('support.messages.store', $ticket), ['body' => 'Customer reply']);
    $response->assertRedirect(route('support.show', $ticket));
    $this->assertDatabaseHas('ticket_messages', ['ticket_id' => $ticket->id, 'body' => 'Customer reply']);
});

test('customer cannot set site_id to another users site', function () {
    Setting::set('support_enabled', '1');
    $user = User::factory()->create(['is_admin' => false]);
    $otherUser = User::factory()->create(['is_admin' => false]);
    $otherSite = \App\Models\Site::factory()->create(['user_id' => $otherUser->id]);
    $category = TicketCategory::factory()->create(['is_active' => true]);
    $this->actingAs($user);

    $response = $this->post(route('support.store'), [
        'subject' => 'Test',
        'body' => 'Body',
        'ticket_category_id' => $category->id,
        'site_uuid' => $otherSite->uuid,
    ]);
    $response->assertSessionHasErrors('site_uuid');
});
