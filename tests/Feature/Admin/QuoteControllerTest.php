<?php

use App\Models\Quote;
use App\Models\QuoteLineItem;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests cannot access admin quotes', function () {
    $response = $this->get(route('admin.quotes.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin quotes', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.quotes.index'));
    $response->assertForbidden();
});

test('admin users can view quote index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.quotes.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/quotes/Index')
        ->has('quotes')
    );
});

test('admin users can view create quote page', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.quotes.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/quotes/Create')
        ->has('customers')
    );
});

test('admin users can store quote', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.quotes.store'), [
        'user_id' => $customer->id,
        'invoice_date' => now()->format('Y-m-d'),
        'status' => 'draft',
        'line_items' => [
            ['position' => 1, 'description' => 'Angebotsposition', 'quantity' => 2, 'unit' => 'Stück', 'unit_price' => 25, 'amount' => 50],
        ],
    ]);

    $response->assertRedirect(route('admin.quotes.index'));
    $response->assertSessionHas('success');

    $quote = Quote::where('user_id', $customer->id)->first();
    expect($quote)->not->toBeNull();
    expect($quote->amount)->toBe('50.00');
    expect($quote->number)->toContain('ANG-');
    expect(QuoteLineItem::where('quote_id', $quote->id)->count())->toBe(1);
});

test('admin users can view quote show', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $quote = Quote::create([
        'user_id' => $customer->id,
        'number' => 'ANG-2026-00001',
        'status' => 'draft',
        'invoice_date' => now(),
        'amount' => 100,
        'tax' => 0,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.quotes.show', $quote));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/quotes/Show')
        ->where('quote.id', $quote->id)
    );
});

test('quote pdf returns 404 when pdf not generated', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $quote = Quote::create([
        'user_id' => $customer->id,
        'number' => 'ANG-2026-00002',
        'status' => 'draft',
        'invoice_date' => now(),
        'amount' => 100,
        'tax' => 0,
        'pdf_path' => null,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.quotes.pdf', $quote));

    $response->assertNotFound();
});

test('quote pdf returns file when pdf exists', function () {
    Storage::fake('local');
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $path = 'quotes/2026/ANG-2026-00003.pdf';
    Storage::disk('local')->put($path, '%PDF-1.4 dummy');
    $quote = Quote::create([
        'user_id' => $customer->id,
        'number' => 'ANG-2026-00003',
        'status' => 'draft',
        'invoice_date' => now(),
        'amount' => 100,
        'tax' => 0,
        'pdf_path' => $path,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.quotes.pdf', $quote));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
