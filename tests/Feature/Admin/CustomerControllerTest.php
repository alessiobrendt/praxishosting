<?php

use App\Models\AiTokenBalance;
use App\Models\User;

test('guests cannot access admin customers', function () {
    $response = $this->get(route('admin.customers.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin customers', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.customers.index'));
    $response->assertForbidden();
});

test('admin users can view customer index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.customers.index'));
    $response->assertOk();
});

test('admin users can view customer detail', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.customers.show', $customer));
    $response->assertOk();
});

test('admin users can view customer edit form', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create(['name' => 'Test Customer', 'email' => 'test@example.com']);
    $this->actingAs($admin);

    $response = $this->get(route('admin.customers.edit', $customer));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/customers/Edit')
        ->has('customer')
        ->where('customer.name', 'Test Customer')
        ->where('customer.email', 'test@example.com')
        ->has('countries')
    );
});

test('admin users can update customer stammdaten', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create(['name' => 'Old Name', 'company' => null]);
    $this->actingAs($admin);

    $response = $this->put(route('admin.customers.update', $customer), [
        'name' => 'New Name',
        'email' => $customer->email,
        'company' => 'Test GmbH',
        'street' => 'Musterstr. 1',
        'postal_code' => '12345',
        'city' => 'Berlin',
        'country' => 'DE',
    ]);
    $response->assertRedirect(route('admin.customers.show', $customer));
    $customer->refresh();
    expect($customer->name)->toBe('New Name')
        ->and($customer->company)->toBe('Test GmbH')
        ->and($customer->country)->toBe('DE');
});

test('admin users can store customer note', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.customers.notes.store', $customer), [
        'body' => 'Test notiz für Kunden.',
    ]);
    $response->assertRedirect(route('admin.customers.show', $customer));
    $this->assertDatabaseHas('customer_notes', [
        'user_id' => $customer->id,
        'admin_id' => $admin->id,
        'body' => 'Test notiz für Kunden.',
    ]);
});

test('admin users can add AI tokens to customer', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.customers.ai-tokens.store', $customer), [
        'amount' => 500,
        'description' => 'Goodwill-Tokens',
    ]);
    $response->assertRedirect(route('admin.customers.show', $customer));
    $balance = AiTokenBalance::where('user_id', $customer->id)->first();
    expect($balance)->not->toBeNull()->and($balance->balance)->toBe(500);
    $this->assertDatabaseHas('ai_token_transactions', [
        'user_id' => $customer->id,
        'amount' => 500,
        'type' => 'admin_adjustment',
        'description' => 'Goodwill-Tokens',
    ]);
});

test('admin users can subtract AI tokens from customer', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    AiTokenBalance::create(['user_id' => $customer->id, 'balance' => 1000]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.customers.ai-tokens.store', $customer), [
        'amount' => -200,
        'description' => 'Korrektur',
    ]);
    $response->assertRedirect(route('admin.customers.show', $customer));
    $balance = AiTokenBalance::where('user_id', $customer->id)->first();
    expect($balance->balance)->toBe(800);
});
