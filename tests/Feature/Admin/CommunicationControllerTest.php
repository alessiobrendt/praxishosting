<?php

use App\Models\Invoice;
use App\Models\Reminder;
use App\Models\User;

test('guests cannot access admin communications', function () {
    $response = $this->get(route('admin.communications.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin communications', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.communications.index'));
    $response->assertForbidden();
});

test('admin users can view communications index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.communications.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/communications/Index')
        ->has('communications')
        ->has('typeLabels')
        ->has('filters')
    );
});

test('admin users can view communications create', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.communications.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/communications/Create')
        ->has('typeLabels')
        ->has('invoices')
        ->has('sites')
        ->has('users')
    );
});

test('admin users can store a reminder', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.communications.store'), [
        'type' => 'payment_reminder',
        'subject_type' => 'User',
        'subject_id' => $customer->id,
        'sent_at' => now()->format('Y-m-d H:i'),
        'note' => 'Telefonat: Rückruf vereinbart',
    ]);

    $response->assertRedirect(route('admin.communications.index'));
    $response->assertSessionHas('success');

    $reminder = Reminder::where('subject_type', User::class)->where('subject_id', $customer->id)->first();
    expect($reminder)->not->toBeNull();
    expect($reminder->type)->toBe('payment_reminder');
    expect($reminder->note)->toBe('Telefonat: Rückruf vereinbart');
    expect($reminder->created_by)->toBe($admin->id);
});

test('admin users can store reminder for invoice', function () {
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
    $this->actingAs($admin);

    $response = $this->post(route('admin.communications.store'), [
        'type' => 'email_manual',
        'subject_type' => 'Invoice',
        'subject_id' => $invoice->id,
        'sent_at' => now()->format('Y-m-d H:i'),
        'note' => null,
    ]);

    $response->assertRedirect(route('admin.communications.index'));
    $reminder = Reminder::where('subject_type', Invoice::class)->where('subject_id', $invoice->id)->first();
    expect($reminder)->not->toBeNull();
});

test('store reminder validates subject_id exists', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.communications.store'), [
        'type' => 'payment_reminder',
        'subject_type' => 'User',
        'subject_id' => 99999,
        'sent_at' => now()->format('Y-m-d H:i'),
        'note' => '',
    ]);

    $response->assertSessionHasErrors('subject_id');
    expect(Reminder::count())->toBe(0);
});
