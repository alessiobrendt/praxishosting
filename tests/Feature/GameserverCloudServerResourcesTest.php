<?php

use App\Models\Brand;
use App\Models\GameServerAccount;
use App\Models\GameserverCloudPlan;
use App\Models\GameserverCloudSubscription;
use App\Models\HostingServer;
use App\Models\User;

beforeEach(function () {
    Brand::query()->update(['is_default' => false]);
    $this->brand = Brand::create([
        'key' => 'cloud-resources',
        'name' => 'Cloud Resources Test',
        'domains' => null,
        'is_default' => true,
        'features' => ['gameserver_cloud' => true],
    ]);

    $this->server = HostingServer::create([
        'brand_id' => $this->brand->id,
        'panel_type' => 'pterodactyl',
        'name' => 'Ptero',
        'hostname' => 'panel.test',
        'config' => [],
        'is_active' => true,
    ]);

    $this->plan = GameserverCloudPlan::create([
        'brand_id' => $this->brand->id,
        'hosting_server_id' => $this->server->id,
        'name' => 'Test Plan',
        'price' => 10,
        'config' => ['max_cpu' => 100, 'max_memory_mb' => 2048, 'max_disk_gb' => 10],
        'is_active' => true,
        'sort_order' => 0,
    ]);

    $this->user = User::factory()->create(['brand_id' => $this->brand->id]);

    $this->subscription = GameserverCloudSubscription::create([
        'user_id' => $this->user->id,
        'gameserver_cloud_plan_id' => $this->plan->id,
        'status' => 'active',
        'current_period_ends_at' => now()->addMonth(),
    ]);

    $this->account = GameServerAccount::create([
        'user_id' => $this->user->id,
        'gameserver_cloud_subscription_id' => $this->subscription->id,
        'hosting_plan_id' => null,
        'hosting_server_id' => $this->server->id,
        'name' => 'Cloud Server',
        'status' => 'active',
        'identifier' => 'abc123',
        'allocation' => ['cpu' => 50, 'memory_mb' => 1024, 'disk_mb' => 2048, 'nest_id' => 1, 'egg_id' => 1],
    ]);
});

test('guest cannot update cloud server resources', function () {
    $response = $this->put(
        route('gaming.cloud.subscriptions.servers.resources.update', [$this->subscription->id, $this->account->id]),
        ['cpu' => 50, 'memory_mb' => 1024, 'disk_mb' => 2048]
    );

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
});

test('owner gets validation error when requesting more than quota', function () {
    $this->actingAs($this->user);

    $response = $this->put(
        route('gaming.cloud.subscriptions.servers.resources.update', [$this->subscription->id, $this->account->id]),
        ['cpu' => 999, 'memory_mb' => 1024, 'disk_mb' => 2048]
    );

    $response->assertRedirect();
    $response->assertSessionHasErrors('cpu');
});
