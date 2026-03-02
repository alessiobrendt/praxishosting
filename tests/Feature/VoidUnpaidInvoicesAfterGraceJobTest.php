<?php

use App\Jobs\VoidUnpaidInvoicesAfterGraceJob;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;

beforeEach(function (): void {
    Setting::set('billing_grace_period_days', '7');
});

test('void unpaid invoices after grace job sets overdue invoices to cancelled', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $user->id,
        'number' => 'INV-2026-99998',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now()->subDays(20),
        'due_date' => now()->subDays(10),
    ]);

    (new VoidUnpaidInvoicesAfterGraceJob)->handle(
        app(\App\Services\InvoicePdfService::class),
        app(\App\Services\InvoiceEInvoiceService::class)
    );

    $invoice->refresh();
    expect($invoice->status)->toBe('cancelled');
});

test('void unpaid invoices after grace job does not touch recently due invoices', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $user->id,
        'number' => 'INV-2026-99999',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'sent',
        'invoice_date' => now(),
        'due_date' => now()->subDays(2),
    ]);

    (new VoidUnpaidInvoicesAfterGraceJob)->handle(
        app(\App\Services\InvoicePdfService::class),
        app(\App\Services\InvoiceEInvoiceService::class)
    );

    $invoice->refresh();
    expect($invoice->status)->toBe('sent');
});

test('void unpaid invoices after grace job does not touch paid invoices', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::create([
        'user_id' => $user->id,
        'number' => 'INV-2026-99997',
        'type' => 'manual',
        'amount' => 50,
        'tax' => 0,
        'status' => 'paid',
        'invoice_date' => now()->subDays(20),
        'due_date' => now()->subDays(10),
    ]);

    (new VoidUnpaidInvoicesAfterGraceJob)->handle(
        app(\App\Services\InvoicePdfService::class),
        app(\App\Services\InvoiceEInvoiceService::class)
    );

    $invoice->refresh();
    expect($invoice->status)->toBe('paid');
});
