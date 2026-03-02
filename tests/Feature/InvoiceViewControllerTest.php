<?php

use App\Models\Invoice;
use App\Models\User;

test('guests cannot view invoice', function () {
    $user = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $user->id,
        'number' => 'INV-TEST-001',
        'type' => 'manual',
        'amount' => 10,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now(),
    ]);

    $response = $this->get(route('invoices.show', $invoice));

    $response->assertRedirect(route('login'));
});

test('customer can view own invoice', function () {
    $user = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $user->id,
        'number' => 'INV-TEST-002',
        'type' => 'manual',
        'amount' => 10,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now(),
    ]);
    $invoice->load(['user', 'lineItems']);
    $this->actingAs($user);

    $response = $this->get(route('invoices.show', $invoice));

    $response->assertOk();
    $response->assertViewIs('invoices.show');
    $response->assertSee($invoice->number);
});

test('customer cannot view another customers invoice', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $owner->id,
        'number' => 'INV-TEST-003',
        'type' => 'manual',
        'amount' => 10,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now(),
    ]);
    $this->actingAs($other);

    $response = $this->get(route('invoices.show', $invoice));

    $response->assertForbidden();
});

test('admin can view any invoice', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-TEST-004',
        'type' => 'manual',
        'amount' => 10,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now(),
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('invoices.show', $invoice));

    $response->assertOk();
    $response->assertViewIs('invoices.show');
    $response->assertSee($invoice->number);
});
