<?php

use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\User;

test('guests cannot access admin dunning letters', function () {
    $response = $this->get(route('admin.dunning-letters.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin dunning letters', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.dunning-letters.index'));
    $response->assertForbidden();
});

test('admin users can view dunning letters index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.dunning-letters.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dunning-letters/Index')
        ->has('dunningLetters')
    );
});

test('admin users see dunning letters in index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-2026-00001',
        'type' => 'manual',
        'amount' => 100,
        'tax' => 0,
        'status' => 'draft',
        'invoice_date' => now(),
    ]);
    InvoiceDunningLetter::create([
        'invoice_id' => $invoice->id,
        'level' => 1,
        'sent_at' => now(),
        'fee_amount' => 5,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.dunning-letters.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dunning-letters/Index')
        ->has('dunningLetters.data', 1)
    );
});
