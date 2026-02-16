<?php

use App\Models\ResellerDomain;
use App\Models\User;
use App\Services\SkrimeApiService;
use Illuminate\Support\Facades\Cache;

test('admin can access domains index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.domains.index'));

    $response->assertStatus(200);
});

test('non-admin cannot access admin domains index', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.domains.index'));

    $response->assertStatus(403);
});

test('authenticated user can access my domains', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('domains.index'));

    $response->assertStatus(200);
});

test('guest cannot access domains index', function () {
    $response = $this->get(route('domains.index'));

    $response->assertRedirect(route('login'));
});

test('reseller domain profit margin is calculated correctly', function () {
    $domain = ResellerDomain::factory()->create([
        'purchase_price' => 10,
        'sale_price' => 13,
    ]);

    expect($domain->profitMargin())->toBe(3.0);
});

test('customer can view own domain manage page', function () {
    $user = User::factory()->create();
    $domain = ResellerDomain::factory()->create([
        'user_id' => $user->id,
        'domain' => 'example.de',
        'tld' => 'de',
    ]);

    $this->mock(SkrimeApiService::class, function ($mock) {
        $mock->shouldReceive('getNameserver')->once()->with('example.de')->andReturn(['nameserver' => ['ns1.example.com', 'ns2.example.com']]);
    });
    Cache::put('skrime_pricelist', [['tld' => 'de', 'renew' => '10', 'create' => '10', 'transfer' => '10', 'restore' => '10', 'offer' => false, 'offerTypes' => []]], 3600);

    $this->actingAs($user);
    $response = $this->get(route('domains.manage.show', $domain));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('domains/Show')->has('domain')->where('domain.domain', 'example.de'));
});

test('customer cannot view another users domain manage page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $domain = ResellerDomain::factory()->create([
        'user_id' => $owner->id,
        'domain' => 'example.de',
    ]);

    $this->actingAs($other);
    $response = $this->get(route('domains.manage.show', $domain));

    $response->assertStatus(403);
});
