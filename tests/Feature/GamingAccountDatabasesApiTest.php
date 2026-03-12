<?php

use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\HostingPlan;
use App\Models\HostingServer;
use App\Models\User;
use App\Services\ControlPanels\PterodactylClient;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    Brand::query()->update(['is_default' => false]);
    $this->brand = Brand::create([
        'key' => 'gaming-db-test',
        'name' => 'Gaming DB Test',
        'domains' => ['gaming-db.praxishosting.test'],
        'is_default' => true,
        'features' => ['gaming' => true],
    ]);

    $this->user = User::factory()->create([
        'brand_id' => $this->brand->id,
        'email' => 'gamer-db@example.com',
    ]);

    $this->hostingServer = HostingServer::create([
        'brand_id' => $this->brand->id,
        'panel_type' => 'pterodactyl',
        'name' => 'Test Panel',
        'hostname' => 'panel.test',
        'config' => ['base_uri' => 'https://panel.test', 'client_api_key' => 'test-key'],
        'is_active' => true,
    ]);

    $this->plan = HostingPlan::create([
        'brand_id' => $this->brand->id,
        'hosting_server_id' => $this->hostingServer->id,
        'panel_type' => 'pterodactyl',
        'config' => [],
        'name' => 'Test Plan',
        'plesk_package_name' => null,
        'disk_gb' => 0,
        'traffic_gb' => 0,
        'domains' => 0,
        'subdomains' => 0,
        'mailboxes' => 0,
        'databases' => 1,
        'price' => 0,
        'is_active' => true,
        'sort_order' => 0,
    ]);

    $this->account = GameServerAccount::create([
        'user_id' => $this->user->id,
        'hosting_plan_id' => $this->plan->id,
        'hosting_server_id' => $this->hostingServer->id,
        'product_id' => null,
        'name' => 'My Game Server',
        'identifier' => 'abc123',
        'status' => 'active',
    ]);
});

test('owner can list databases and receives success with databases array', function () {
    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('listDatabases')->once()->andReturn([
            ['id' => 's1_1', 'host' => ['address' => '127.0.0.1', 'port' => 3306], 'name' => 's1_test', 'username' => 'u1_abc'],
        ]);
    });

    actingAs($this->user);

    $response = $this->getJson(route('gaming-accounts.api.databases.list', $this->account));

    $response->assertOk();
    $response->assertJsonPath('success', true);
    $response->assertJsonPath('databases.0.id', 's1_1');
    $response->assertJsonPath('databases.0.name', 's1_test');
    $response->assertJsonPath('databases.0.username', 'u1_abc');
});

test('non-owner cannot list databases and gets 404', function () {
    $otherUser = User::factory()->create(['brand_id' => $this->brand->id]);
    actingAs($otherUser);

    $response = $this->getJson(route('gaming-accounts.api.databases.list', $this->account));

    $response->assertNotFound();
    $response->assertJsonPath('success', false);
});

test('guest cannot list databases and gets 401', function () {
    $response = $this->getJson(route('gaming-accounts.api.databases.list', $this->account));

    $response->assertStatus(401);
});

test('owner gets redirect with error when phpMyAdmin not configured', function () {
    config(['services.phpmyadmin.url' => '']);

    actingAs($this->user);

    $response = $this->get(route('gaming-accounts.api.databases.phpmyadmin', [$this->account, 's1_1']));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('owner gets redirect when database credentials cannot be loaded for phpMyAdmin', function () {
    config(['services.phpmyadmin.url' => 'https://pma.example.com']);

    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('getDatabaseCredentials')->once()->andReturn(null);
    });

    actingAs($this->user);

    $response = $this->get(route('gaming-accounts.api.databases.phpmyadmin', [$this->account, 's1_1']));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('owner receives phpMyAdmin signon view when configured and credentials available', function () {
    config(['services.phpmyadmin.url' => 'https://pma.example.com']);

    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('getDatabaseCredentials')->once()->andReturn([
            'id' => 's1_1',
            'host' => ['address' => '127.0.0.1', 'port' => 3306],
            'name' => 's1_test',
            'username' => 'u1_abc',
            'password' => 'secret',
        ]);
    });

    actingAs($this->user);

    $response = $this->get(route('gaming-accounts.api.databases.phpmyadmin', [$this->account, 's1_1']));

    $response->assertOk();
    $response->assertViewIs('gaming-accounts.phpmyadmin-signon');
    $response->assertSee('Weiterleitung', false);
    $response->assertSee('u1_abc', false);
});

test('owner gets redirect to signon URL with credentials_url using credentials_base_url when set', function () {
    config([
        'services.phpmyadmin.url' => 'https://pma.example.com',
        'services.phpmyadmin.signon_url' => 'https://pma.example.com/signon.php',
        'services.phpmyadmin.credentials_base_url' => 'https://app.example.com',
    ]);

    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('getDatabaseCredentials')->once()->andReturn([
            'id' => 's1_1',
            'host' => ['address' => '127.0.0.1', 'port' => 3306],
            'name' => 's1_test',
            'username' => 'u1_abc',
            'password' => 'secret',
        ]);
    });

    actingAs($this->user);

    $response = $this->get(route('gaming-accounts.api.databases.phpmyadmin', [$this->account, 's1_1']));

    $response->assertRedirect();
    $target = $response->headers->get('Location');
    expect($target)->toContain('https://pma.example.com/signon.php');
    expect($target)->toContain('token=');
    expect($target)->toContain('credentials_url=');
    $credentialsUrl = urldecode((string) preg_replace('/.*credentials_url=([^&]+).*/', '$1', $target));
    expect($credentialsUrl)->toStartWith('https://app.example.com/');
    expect($credentialsUrl)->toContain('phpmyadmin-signon-credentials');
});

test('non-owner cannot open phpMyAdmin and gets 404', function () {
    $otherUser = User::factory()->create(['brand_id' => $this->brand->id]);
    actingAs($otherUser);

    $response = $this->get(route('gaming-accounts.api.databases.phpmyadmin', [$this->account, 's1_1']));

    $response->assertNotFound();
});

test('owner gets 502 when database credentials cannot be loaded for export', function () {
    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('getDatabaseCredentials')->once()->andReturn(null);
    });

    actingAs($this->user);

    $response = $this->getJson(route('gaming-accounts.api.databases.export', [$this->account, 's1_1']));

    $response->assertStatus(502);
    $response->assertJsonPath('success', false);
});

test('non-owner cannot export database and gets 404', function () {
    $otherUser = User::factory()->create(['brand_id' => $this->brand->id]);
    actingAs($otherUser);

    $response = $this->get(route('gaming-accounts.api.databases.export', [$this->account, 's1_1']));

    $response->assertNotFound();
});
