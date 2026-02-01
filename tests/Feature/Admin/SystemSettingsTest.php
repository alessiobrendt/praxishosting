<?php

use App\Models\Setting;
use App\Models\User;

test('guests cannot access admin settings', function () {
    $response = $this->get(route('admin.settings.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin settings', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.settings.index'));
    $response->assertForbidden();
});

test('admin users can view settings page with invoice company fields', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.settings.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/settings/Index')
        ->has('settings')
        ->where('settings.invoice_company_name', fn ($v) => is_string($v))
        ->where('settings.invoice_company_street', fn ($v) => is_string($v))
        ->where('settings.invoice_company_postal_code', fn ($v) => is_string($v))
        ->where('settings.invoice_company_city', fn ($v) => is_string($v))
        ->where('settings.invoice_company_country', fn ($v) => is_string($v))
        ->where('settings.invoice_company_vat_id', fn ($v) => is_string($v))
    );
});

test('admin users can update settings including invoice company and vat id', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->put(route('admin.settings.update'), [
        'app_name' => '',
        'billing_grace_period_days' => 14,
        'pin_max_attempts' => 5,
        'pin_lockout_minutes' => 15,
        'inactivity_lock_default_minutes' => 0,
        'invoice_ustg_19_text' => '§ 19 UStG Text',
        'invoice_company_name' => 'Meine Firma GmbH',
        'invoice_company_street' => 'Musterstraße 1',
        'invoice_company_postal_code' => '12345',
        'invoice_company_city' => 'Berlin',
        'invoice_company_country' => 'DE',
        'invoice_company_vat_id' => 'DE123456789',
        'invoice_company_logo' => '',
        'mail_from_name' => 'Support',
        'mail_from_address' => 'support@example.com',
        'mail_reply_to_address' => '',
        'dunning_fee_level_1' => '0',
        'dunning_fee_level_2' => '5',
        'dunning_fee_level_3' => '10',
        'domains_base_domain' => '',
        'main_app_hosts' => '',
    ]);

    $response->assertRedirect(route('admin.settings.index'));
    $response->assertSessionHas('success');

    expect(Setting::get('invoice_company_name'))->toBe('Meine Firma GmbH');
    expect(Setting::get('invoice_company_street'))->toBe('Musterstraße 1');
    expect(Setting::get('invoice_company_postal_code'))->toBe('12345');
    expect(Setting::get('invoice_company_city'))->toBe('Berlin');
    expect(Setting::get('invoice_company_country'))->toBe('DE');
    expect(Setting::get('invoice_company_vat_id'))->toBe('DE123456789');

    $company = Setting::getInvoiceCompany();
    expect($company['company_name'])->toBe('Meine Firma GmbH');
    expect($company['company_vat_id'])->toBe('DE123456789');
});
