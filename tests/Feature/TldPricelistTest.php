<?php

use App\Models\TldPricelist;
use App\Models\User;
use App\Services\SkrimeApiService;

test('admin can access tld pricelist index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.domains.tld-pricelist.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/domains/TldPricelist')->has('items'));
});

test('non-admin cannot access tld pricelist index', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.domains.tld-pricelist.index'));

    $response->assertStatus(403);
});

test('admin can bulk update margin for tlds', function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    $admin = User::factory()->create(['is_admin' => true]);
    TldPricelist::create([
        'tld' => 'de',
        'create_price' => 10,
        'renew_price' => 10,
        'margin_type' => 'fixed',
        'margin_value' => 2,
    ]);
    TldPricelist::create([
        'tld' => 'com',
        'create_price' => 12,
        'renew_price' => 12,
        'margin_type' => 'fixed',
        'margin_value' => 2,
    ]);

    $this->actingAs($admin);
    $response = $this->put(route('admin.domains.tld-pricelist.bulk'), [
        'tlds' => ['de', 'com'],
        'margin_type' => 'percent',
        'margin_value' => 15,
    ]);

    $response->assertRedirect(route('admin.domains.tld-pricelist.index'));
    expect(TldPricelist::where('tld', 'de')->first()->margin_type)->toBe('percent');
    expect((float) TldPricelist::where('tld', 'de')->first()->margin_value)->toBe(15.0);
});

test('admin sync populates tld pricelist from skrime', function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    $admin = User::factory()->create(['is_admin' => true]);
    $this->mock(SkrimeApiService::class, function ($mock) {
        $mock->shouldReceive('getPricelist')->once()->andReturn([
            ['tld' => 'de', 'create' => '8.50', 'renew' => '8.50', 'transfer' => '8.50', 'restore' => '30', 'offer' => false, 'offerTypes' => []],
        ]);
    });

    $this->actingAs($admin);
    $response = $this->post(route('admin.domains.tld-pricelist.sync'));

    $response->assertRedirect(route('admin.domains.tld-pricelist.index'));
    $row = TldPricelist::where('tld', 'de')->first();
    expect($row)->not->toBeNull();
    expect((float) $row->create_price)->toBe(8.5);
});
