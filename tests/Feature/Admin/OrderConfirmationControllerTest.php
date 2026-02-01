<?php

use App\Models\OrderConfirmation;
use App\Models\OrderConfirmationLineItem;
use App\Models\Quote;
use App\Models\QuoteLineItem;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests cannot access admin order confirmations', function () {
    $response = $this->get(route('admin.order-confirmations.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin order confirmations', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.order-confirmations.index'));
    $response->assertForbidden();
});

test('admin users can view order confirmation index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/order-confirmations/Index')
        ->has('orderConfirmations')
    );
});

test('admin users can view create order confirmation page', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/order-confirmations/Create')
        ->has('customers')
        ->where('fromQuote', null)
    );
});

test('admin users can view create order confirmation from quote', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $quote = Quote::create([
        'user_id' => $customer->id,
        'number' => 'ANG-2026-00001',
        'status' => 'accepted',
        'invoice_date' => now(),
        'amount' => 100,
        'tax' => 0,
    ]);
    QuoteLineItem::create([
        'quote_id' => $quote->id,
        'position' => 1,
        'description' => 'Position aus Angebot',
        'quantity' => 1,
        'unit' => 'Stück',
        'unit_price' => 100,
        'amount' => 100,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.create', ['from_quote' => $quote->id]));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/order-confirmations/Create')
        ->has('customers')
        ->has('fromQuote')
        ->where('fromQuote.id', $quote->id)
        ->where('fromQuote.number', 'ANG-2026-00001')
    );
});

test('admin users can store order confirmation', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.order-confirmations.store'), [
        'user_id' => $customer->id,
        'order_date' => now()->format('Y-m-d'),
        'line_items' => [
            ['position' => 1, 'description' => 'Auftragsposition', 'quantity' => 1, 'unit' => 'Stück', 'unit_price' => 50, 'amount' => 50],
        ],
    ]);

    $response->assertRedirect(route('admin.order-confirmations.index'));
    $response->assertSessionHas('success');

    $oc = OrderConfirmation::where('user_id', $customer->id)->first();
    expect($oc)->not->toBeNull();
    expect($oc->amount)->toBe('50.00');
    expect($oc->number)->toContain('AB-');
    expect(OrderConfirmationLineItem::where('order_confirmation_id', $oc->id)->count())->toBe(1);
});

test('admin users can store order confirmation linked to quote', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $quote = Quote::create([
        'user_id' => $customer->id,
        'number' => 'ANG-2026-00001',
        'status' => 'accepted',
        'invoice_date' => now(),
        'amount' => 100,
        'tax' => 0,
    ]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.order-confirmations.store'), [
        'user_id' => $customer->id,
        'quote_id' => $quote->id,
        'order_date' => now()->format('Y-m-d'),
        'line_items' => [
            ['position' => 1, 'description' => 'Aus Angebot', 'quantity' => 1, 'unit' => 'Stück', 'unit_price' => 100, 'amount' => 100],
        ],
    ]);

    $response->assertRedirect(route('admin.order-confirmations.index'));
    $oc = OrderConfirmation::where('quote_id', $quote->id)->first();
    expect($oc)->not->toBeNull();
    expect($oc->quote_id)->toBe($quote->id);
});

test('admin users can view order confirmation show', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $oc = OrderConfirmation::create([
        'user_id' => $customer->id,
        'number' => 'AB-2026-00001',
        'order_date' => now(),
        'amount' => 75,
        'tax' => 0,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.show', $oc));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/order-confirmations/Show')
        ->where('orderConfirmation.id', $oc->id)
    );
});

test('order confirmation pdf returns 404 when pdf not generated', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $oc = OrderConfirmation::create([
        'user_id' => $customer->id,
        'number' => 'AB-2026-00002',
        'order_date' => now(),
        'amount' => 50,
        'tax' => 0,
        'pdf_path' => null,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.pdf', $oc));

    $response->assertNotFound();
});

test('order confirmation pdf returns file when pdf exists', function () {
    Storage::fake('local');
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $path = 'order_confirmations/2026/AB-2026-00003.pdf';
    Storage::disk('local')->put($path, '%PDF-1.4 dummy');
    $oc = OrderConfirmation::create([
        'user_id' => $customer->id,
        'number' => 'AB-2026-00003',
        'order_date' => now(),
        'amount' => 50,
        'tax' => 0,
        'pdf_path' => $path,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.order-confirmations.pdf', $oc));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
