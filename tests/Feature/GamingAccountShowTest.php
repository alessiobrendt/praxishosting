<?php

use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\HostingPlan;
use App\Models\User;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->brand = Brand::create([
        'key' => 'gaming-test',
        'name' => 'Gaming Test',
        'domains' => ['gaming.praxishosting.test'],
        'is_default' => false,
        'features' => ['gaming' => true],
    ]);

    $this->user = User::factory()->create([
        'brand_id' => $this->brand->id,
        'email' => 'gamer@example.com',
    ]);

    $this->plan = HostingPlan::create([
        'brand_id' => $this->brand->id,
        'hosting_server_id' => null,
        'panel_type' => 'pterodactyl',
        'config' => [],
        'name' => 'Test Plan',
        'plesk_package_name' => null,
        'disk_gb' => 0,
        'traffic_gb' => 0,
        'domains' => 0,
        'subdomains' => 0,
        'mailboxes' => 0,
        'databases' => 0,
        'price' => 0,
        'is_active' => true,
        'sort_order' => 0,
    ]);

    $this->account = GameServerAccount::create([
        'user_id' => $this->user->id,
        'hosting_plan_id' => $this->plan->id,
        'hosting_server_id' => null,
        'product_id' => null,
        'name' => 'My Game Server',
        'identifier' => null,
        'status' => 'active',
    ]);
});

test('owner can view game server account show page with tabs and user email', function () {
    actingAs($this->user);

    $response = $this->withServerVariables(['HTTP_HOST' => 'gaming.praxishosting.test'])
        ->get(route('gaming-accounts.show', $this->account));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('gaming-accounts/Show')
        ->has('gameServerAccount')
        ->has('loginUrl')
        ->where('userEmail', 'gamer@example.com')
    );
});

test('guest is redirected to login', function () {
    $response = $this->withServerVariables(['HTTP_HOST' => 'gaming.praxishosting.test'])
        ->get(route('gaming-accounts.show', $this->account));

    $response->assertRedirect(route('login'));
});

test('non-owner gets 404', function () {
    $otherUser = User::factory()->create(['brand_id' => $this->brand->id]);
    actingAs($otherUser);

    $response = $this->withServerVariables(['HTTP_HOST' => 'gaming.praxishosting.test'])
        ->get(route('gaming-accounts.show', $this->account));

    $response->assertNotFound();
});
