<?php

use App\Models\Brand;
use App\Models\GameserverCloudPlan;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Models\TldPricelist;
use App\Models\User;
use App\Services\SkrimeApiService;

test('api v1 requires authentication', function () {
    $this->getJson('/api/v1/stats')->assertUnauthorized();
    $this->getJson('/api/v1/domains/tlds')->assertUnauthorized();
    $this->getJson('/api/v1/hosting-plans')->assertUnauthorized();
    $this->getJson('/api/v1/gameserver-cloud-plans')->assertUnauthorized();
    $this->getJson('/api/v1/brand')->assertUnauthorized();
});

test('api v1 stats returns data with valid token', function () {
    $brand = Brand::create([
        'key' => 'test',
        'name' => 'Test',
        'is_default' => true,
    ]);
    $user = User::factory()->create(['brand_id' => $brand->id]);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/stats');

    $response->assertOk();
    $response->assertJsonStructure([
        'data' => [
            'customers_count',
            'webspace_accounts_count',
            'game_server_accounts_count',
            'domains_count',
        ],
    ]);
});

test('api v1 domains tlds returns paginated list with valid token', function () {
    TldPricelist::create([
        'tld' => 'de',
        'create_price' => 5.00,
        'renew_price' => 5.00,
        'transfer_price' => 5.00,
        'restore_price' => 10.00,
        'margin_type' => 'fixed',
        'margin_value' => 1.00,
    ]);
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/domains/tlds');

    $response->assertOk();
    $response->assertJsonPath('data.0.tld', 'de');
    $response->assertJsonPath('data.0.create_price', 5);
    $response->assertJsonPath('meta.per_page', 15);
    $response->assertJsonPath('meta.total', 1);
    $response->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total', 'from', 'to'], 'links' => ['first', 'last', 'prev', 'next']]);
});

test('api v1 domains tlds returns priority TLDs first in order de net com eu at ch', function () {
    foreach (['at', 'ch', 'com', 'de', 'eu', 'net', 'io', 'org'] as $tld) {
        TldPricelist::create([
            'tld' => $tld,
            'create_price' => 5.00,
            'renew_price' => 5.00,
            'transfer_price' => 5.00,
            'restore_price' => 10.00,
            'margin_type' => 'fixed',
            'margin_value' => 1.00,
        ]);
    }
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/domains/tlds');

    $response->assertOk();
    $tlds = collect($response->json('data'))->pluck('tld')->all();
    expect($tlds)->toBe(['de', 'net', 'com', 'eu', 'at', 'ch', 'io', 'org']);
});

test('api v1 domains tlds paginates at 15 per page', function () {
    for ($i = 0; $i < 20; $i++) {
        TldPricelist::create([
            'tld' => 'tld'.str_pad((string) $i, 2, '0', STR_PAD_LEFT),
            'create_price' => 5.00,
            'renew_price' => 5.00,
            'transfer_price' => 5.00,
            'restore_price' => 10.00,
            'margin_type' => 'fixed',
            'margin_value' => 1.00,
        ]);
    }
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $page1 = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/domains/tlds?page=1');
    $page2 = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/domains/tlds?page=2');

    $page1->assertOk();
    $page2->assertOk();
    expect($page1->json('data'))->toHaveCount(15);
    expect($page2->json('data'))->toHaveCount(5);
    expect($page1->json('meta.total'))->toBe(20);
    expect($page1->json('meta.last_page'))->toBe(2);
});

test('api v1 domains check-availability returns searched_domain first when domain has tld', function () {
    foreach (['de', 'net', 'com', 'eu', 'at', 'ch', 'io'] as $tld) {
        TldPricelist::create([
            'tld' => $tld,
            'create_price' => 5.00,
            'renew_price' => 5.00,
            'transfer_price' => 5.00,
            'restore_price' => 10.00,
            'margin_type' => 'fixed',
            'margin_value' => 1.00,
        ]);
    }
    $this->mock(SkrimeApiService::class, function ($mock) {
        $mock->shouldReceive('checkAvailability')
            ->andReturnUsing(fn (string $domain) => [
                'available' => $domain === 'beispiel.de',
                'premium' => false,
                'domain' => $domain,
            ]);
    });
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/domains/check-availability', ['domain' => 'beispiel.de']);

    $response->assertOk();
    $response->assertJsonPath('data.searched_domain.domain', 'beispiel.de');
    $response->assertJsonPath('data.searched_domain.available', true);
    $response->assertJsonPath('data.priority.0.domain', 'beispiel.de');
    $tlds = collect($response->json('data.priority'))->pluck('domain')->map(fn ($d) => substr($d, strrpos($d, '.') + 1))->all();
    expect($tlds)->toBe(['de', 'net', 'com', 'eu', 'at', 'ch']);
});

test('api v1 domains check-availability accepts name without tld and returns priority then paginated other', function () {
    foreach (['de', 'net', 'com', 'eu', 'at', 'ch', 'io', 'org', 'info', 'biz', 'xyz'] as $tld) {
        TldPricelist::firstOrCreate(['tld' => $tld], [
            'create_price' => 5.00,
            'renew_price' => 5.00,
            'transfer_price' => 5.00,
            'restore_price' => 10.00,
            'margin_type' => 'fixed',
            'margin_value' => 1.00,
        ]);
    }
    $this->mock(SkrimeApiService::class, function ($mock) {
        $mock->shouldReceive('checkAvailability')
            ->andReturn(['available' => false, 'premium' => false, 'domain' => 'test.de']);
    });
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/domains/check-availability', ['domain' => 'test']);

    $response->assertOk();
    $response->assertJsonPath('data.searched_domain', null);
    expect($response->json('data.priority'))->toHaveCount(6);
    expect($response->json('data.other.meta.per_page'))->toBe(5);
    expect($response->json('data.other.data'))->toHaveCount(5);
});

test('api v1 domains check-availability other tlds paginate with page param', function () {
    foreach (['de', 'net', 'com', 'eu', 'at', 'ch', 'io', 'org', 'info', 'biz', 'xyz'] as $tld) {
        TldPricelist::firstOrCreate(['tld' => $tld], [
            'create_price' => 5.00,
            'renew_price' => 5.00,
            'transfer_price' => 5.00,
            'restore_price' => 10.00,
            'margin_type' => 'fixed',
            'margin_value' => 1.00,
        ]);
    }
    $this->mock(SkrimeApiService::class, function ($mock) {
        $mock->shouldReceive('checkAvailability')
            ->andReturn(['available' => false, 'premium' => false, 'domain' => 'x']);
    });
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $page1 = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/domains/check-availability', ['domain' => 'test', 'page' => 1]);
    $page2 = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/domains/check-availability', ['domain' => 'test', 'page' => 2]);

    $page1->assertOk();
    $page2->assertOk();
    expect($page1->json('data.other.data'))->toHaveCount(5);
    expect($page2->json('data.other.data'))->toHaveCount(0);
});

test('api v1 hosting-plans returns plans with valid token', function () {
    $brand = Brand::create([
        'key' => 'test',
        'name' => 'Test',
        'is_default' => true,
    ]);
    HostingPlan::create([
        'brand_id' => $brand->id,
        'hosting_server_id' => null,
        'panel_type' => 'plesk',
        'config' => [],
        'name' => 'Webspace Start',
        'plesk_package_name' => null,
        'disk_gb' => 10,
        'traffic_gb' => 100,
        'domains' => 1,
        'subdomains' => 5,
        'mailboxes' => 1,
        'databases' => 1,
        'price' => 4.99,
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/hosting-plans');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.name', 'Webspace Start');
    $response->assertJsonPath('data.0.panel_type', 'plesk');
});

test('api v1 hosting-plans type teamspeak returns only teamspeak plans', function () {
    $brand = Brand::create([
        'key' => 'test',
        'name' => 'Test',
        'is_default' => true,
    ]);
    HostingPlan::create([
        'brand_id' => $brand->id,
        'hosting_server_id' => null,
        'panel_type' => 'teamspeak',
        'config' => ['plan_options' => []],
        'name' => 'TeamSpeak Small',
        'plesk_package_name' => null,
        'disk_gb' => 0,
        'traffic_gb' => 0,
        'domains' => 0,
        'subdomains' => 0,
        'mailboxes' => 0,
        'databases' => 0,
        'price' => 9.99,
        'is_active' => true,
        'sort_order' => 0,
    ]);
    HostingPlan::create([
        'brand_id' => $brand->id,
        'hosting_server_id' => null,
        'panel_type' => 'plesk',
        'config' => [],
        'name' => 'Webspace',
        'plesk_package_name' => null,
        'disk_gb' => 10,
        'traffic_gb' => 100,
        'domains' => 1,
        'subdomains' => 5,
        'mailboxes' => 1,
        'databases' => 1,
        'price' => 4.99,
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/hosting-plans?type=teamspeak');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.name', 'TeamSpeak Small');
    $response->assertJsonPath('data.0.panel_type', 'teamspeak');
    $response->assertJsonPath('data.0.price', '9.99');
});

test('api v1 gameserver-cloud-plans returns plans with valid token', function () {
    $brand = Brand::create([
        'key' => 'test',
        'name' => 'Test',
        'is_default' => true,
    ]);
    $server = HostingServer::create([
        'brand_id' => $brand->id,
        'panel_type' => 'pterodactyl',
        'name' => 'Ptero',
        'hostname' => 'panel.test',
        'config' => [],
    ]);
    $plan = GameserverCloudPlan::create([
        'brand_id' => $brand->id,
        'hosting_server_id' => $server->id,
        'name' => 'Cloud Gaming S',
        'price' => 14.99,
        'config' => ['plan_options' => []],
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/gameserver-cloud-plans');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.id', $plan->id);
    $response->assertJsonPath('data.0.name', 'Cloud Gaming S');
    $response->assertJsonPath('data.0.price', '14.99');
});

test('api v1 brand returns brand with valid token', function () {
    $brand = Brand::create([
        'key' => 'test',
        'name' => 'Test Brand',
        'is_default' => true,
    ]);
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/brand');

    $response->assertOk();
    $response->assertJsonPath('data.name', 'Test Brand');
    $response->assertJsonStructure(['data' => ['id', 'name', 'features', 'seo']]);
});

test('api v1 returns 401 with invalid token', function () {
    $response = $this->withHeader('Authorization', 'Bearer invalid-token-here')
        ->getJson('/api/v1/stats');

    $response->assertUnauthorized();
});
