<?php

use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\HostingPlan;
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
        'affected_services' => [],
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

test('customer cannot set affected_services to another users service', function () {
    Setting::set('support_enabled', '1');
    $brand = Brand::create([
        'key' => 'support-test-ownership',
        'name' => 'Support Ownership',
        'domains' => null,
        'is_default' => false,
        'features' => ['sites_editor' => true],
    ]);
    $user = User::factory()->create(['is_admin' => false, 'brand_id' => $brand->id]);
    $otherUser = User::factory()->create(['is_admin' => false]);
    $otherSite = \App\Models\Site::factory()->create(['user_id' => $otherUser->id]);
    $category = TicketCategory::factory()->create(['is_active' => true]);
    $this->actingAs($user);

    $response = $this->post(route('support.store'), [
        'subject' => 'Test',
        'body' => 'Body',
        'ticket_category_id' => $category->id,
        'affected_services' => [['type' => 'site', 'id' => $otherSite->id]],
    ]);
    $response->assertSessionHasErrors();
});

test('customer can create ticket with own site when brand has sites_editor', function () {
    Setting::set('support_enabled', '1');
    $brand = Brand::create([
        'key' => 'support-test-sites',
        'name' => 'Support Test',
        'domains' => null,
        'is_default' => false,
        'features' => ['sites_editor' => true],
    ]);
    $user = User::factory()->create(['is_admin' => false, 'brand_id' => $brand->id]);
    $site = \App\Models\Site::factory()->create(['user_id' => $user->id]);
    $category = TicketCategory::factory()->create(['is_active' => true]);
    $this->actingAs($user);

    $response = $this->post(route('support.store'), [
        'subject' => 'Ticket with site',
        'body' => 'Body',
        'ticket_category_id' => $category->id,
        'affected_services' => [['type' => 'site', 'id' => $site->id]],
    ]);
    $response->assertRedirect();
    $ticket = Ticket::query()->where('user_id', $user->id)->where('subject', 'Ticket with site')->first();
    expect($ticket)->not->toBeNull();
    $this->assertDatabaseHas('ticket_services', [
        'ticket_id' => $ticket->id,
        'service_type' => 'site',
        'service_id' => $site->id,
    ]);
});

test('customer cannot use service type when brand feature is disabled', function () {
    Setting::set('support_enabled', '1');
    $brand = Brand::create([
        'key' => 'support-test-no-gaming',
        'name' => 'Support No Gaming',
        'domains' => null,
        'is_default' => false,
        'features' => ['gaming' => false],
    ]);
    $user = User::factory()->create(['is_admin' => false, 'brand_id' => $brand->id]);
    $plan = HostingPlan::create([
        'brand_id' => $brand->id,
        'hosting_server_id' => null,
        'panel_type' => 'pterodactyl',
        'config' => [],
        'name' => 'Test Plan',
        'plesk_package_name' => null,
        'disk_gb' => 0,
        'traffic_gb' => 0,
        'databases' => 0,
        'domains' => 0,
        'subdomains' => 0,
        'mailboxes' => 0,
        'price' => 0,
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $gameServer = GameServerAccount::create([
        'user_id' => $user->id,
        'hosting_plan_id' => $plan->id,
        'hosting_server_id' => null,
        'product_id' => null,
        'name' => 'My Server',
        'identifier' => null,
        'status' => 'active',
    ]);
    $category = TicketCategory::factory()->create(['is_active' => true]);
    $this->actingAs($user);

    $response = $this->post(route('support.store'), [
        'subject' => 'Test',
        'body' => 'Body',
        'ticket_category_id' => $category->id,
        'affected_services' => [['type' => 'game_server_account', 'id' => $gameServer->id]],
    ]);
    $response->assertSessionHasErrors();
});
