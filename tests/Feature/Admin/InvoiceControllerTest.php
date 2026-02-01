<?php

use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests cannot access admin invoices', function () {
    $response = $this->get(route('admin.invoices.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin invoices', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.invoices.index'));
    $response->assertForbidden();
});

test('admin users can view invoice index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.invoices.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/invoices/Index')
        ->has('invoices')
    );
});

test('admin users can view create invoice page', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.invoices.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/invoices/Create')
        ->has('customers')
    );
});

test('admin users can store manual invoice', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post(route('admin.invoices.store'), [
        'user_id' => $customer->id,
        'invoice_date' => now()->format('Y-m-d'),
        'due_date' => now()->addDays(14)->format('Y-m-d'),
        'status' => 'draft',
        'line_items' => [
            ['position' => 1, 'description' => 'Test', 'quantity' => 1, 'unit' => 'Stück', 'unit_price' => 10, 'amount' => 10],
        ],
    ]);

    $response->assertRedirect(route('admin.invoices.index'));
    $response->assertSessionHas('success');

    $invoice = Invoice::where('user_id', $customer->id)->where('type', 'manual')->first();
    expect($invoice)->not->toBeNull();
    expect($invoice->amount)->toBe('10.00');
});

test('admin users can view invoice show', function () {
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

    $response = $this->get(route('admin.invoices.show', $invoice));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/invoices/Show')
        ->where('invoice.id', $invoice->id)
        ->has('invoice.dunning_letters')
    );
});

test('admin users can create dunning letter for invoice', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-2026-00002',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'draft',
        'invoice_date' => now(),
    ]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.invoices.dunning-letters.store', $invoice));

    $response->assertRedirect(route('admin.invoices.show', $invoice));
    $response->assertSessionHas('success');

    $dunning = InvoiceDunningLetter::where('invoice_id', $invoice->id)->first();
    expect($dunning)->not->toBeNull();
    expect($dunning->level)->toBe(1);
});

test('admin users cannot create more than three dunning letters per invoice', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-2026-00003',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'draft',
        'invoice_date' => now(),
    ]);
    InvoiceDunningLetter::create(['invoice_id' => $invoice->id, 'level' => 1, 'fee_amount' => 0]);
    InvoiceDunningLetter::create(['invoice_id' => $invoice->id, 'level' => 2, 'fee_amount' => 5]);
    InvoiceDunningLetter::create(['invoice_id' => $invoice->id, 'level' => 3, 'fee_amount' => 10]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.invoices.dunning-letters.store', $invoice));

    $response->assertRedirect(route('admin.invoices.show', $invoice));
    $response->assertSessionHas('error');
    expect(InvoiceDunningLetter::where('invoice_id', $invoice->id)->count())->toBe(3);
});

test('dunning pdf returns 404 when pdf not generated', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-2026-00004',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'draft',
        'invoice_date' => now(),
    ]);
    $dunning = InvoiceDunningLetter::create([
        'invoice_id' => $invoice->id,
        'level' => 1,
        'fee_amount' => 0,
        'pdf_path' => null,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.invoices.dunning-letters.pdf', ['invoice' => $invoice, 'dunning_letter' => $dunning]));

    $response->assertNotFound();
});

test('dunning pdf returns file when pdf exists', function () {
    Storage::fake('local');
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $customer->id,
        'number' => 'INV-2026-00005',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'draft',
        'invoice_date' => now(),
    ]);
    $path = 'invoices/dunning/'.$invoice->id.'_1.pdf';
    Storage::disk('local')->put($path, '%PDF-1.4 dummy');
    $dunning = InvoiceDunningLetter::create([
        'invoice_id' => $invoice->id,
        'level' => 1,
        'fee_amount' => 0,
        'pdf_path' => $path,
    ]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.invoices.dunning-letters.pdf', ['invoice' => $invoice, 'dunning_letter' => $dunning]));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
