<?php

use App\Models\Brand;
use App\Models\HostingServer;
use App\Models\PterodactylEggConfig;
use App\Models\User;
use App\Services\ControlPanels\PterodactylClient;

beforeEach(function () {
    Brand::query()->update(['is_default' => false]);
    $this->brand = Brand::create([
        'key' => 'egg-test',
        'name' => 'Egg Test',
        'domains' => null,
        'is_default' => true,
        'features' => ['gameserver_cloud' => true],
    ]);

    $this->pterodactylServer = HostingServer::create([
        'brand_id' => $this->brand->id,
        'panel_type' => 'pterodactyl',
        'name' => 'Ptero Panel',
        'hostname' => 'panel.test',
        'config' => ['base_uri' => 'https://panel.test', 'api_key' => 'test-key'],
        'api_token' => 'test-token',
        'is_active' => true,
    ]);

    $this->pleskServer = HostingServer::create([
        'brand_id' => $this->brand->id,
        'panel_type' => 'plesk',
        'name' => 'Plesk',
        'hostname' => 'plesk.test',
        'config' => [],
        'api_token' => 'token',
        'is_active' => true,
    ]);

    $this->admin = User::factory()->create(['is_admin' => true, 'brand_id' => $this->brand->id]);
});

test('admin can access pterodactyl nests index for pterodactyl server when API returns nests', function () {
    $this->mock(PterodactylClient::class, function ($mock) {
        $mock->shouldReceive('setServer')->once();
        $mock->shouldReceive('getNests')->once()->andReturn([
            ['attributes' => ['id' => 1, 'name' => 'Minecraft', 'description' => 'MC nest']],
        ]);
    });

    $this->actingAs($this->admin);

    $response = $this->get(route('admin.hosting-servers.pterodactyl-nests.index', $this->pterodactylServer));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/pterodactyl-eggs/NestsIndex')
        ->has('nests')
        ->where('hostingServer.id', $this->pterodactylServer->id)
    );
});

test('admin gets 404 when accessing pterodactyl nests for non-pterodactyl server', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.hosting-servers.pterodactyl-nests.index', $this->pleskServer));

    $response->assertNotFound();
});

test('admin can update egg config', function () {
    $this->actingAs($this->admin);

    $response = $this->put(route('admin.hosting-servers.pterodactyl-nests.eggs.config.update', [
        'hostingServer' => $this->pterodactylServer,
        'nest' => 1,
        'egg' => 1,
    ]), [
        'config' => [
            'variable_defaults' => ['SERVER_HOSTNAME' => 'My Server'],
            'required_env_variables' => ['FIVEM_LICENSE'],
            'subdomain_srv_protocol' => '_minecraft',
            'subdomain_protocol_type' => 'tcp',
            'gameq_type' => 'minecraft',
        ],
    ]);

    $response->assertRedirect();
    $config = PterodactylEggConfig::query()
        ->where('hosting_server_id', $this->pterodactylServer->id)
        ->where('nest_id', 1)
        ->where('egg_id', 1)
        ->first();
    expect($config)->not->toBeNull();
    expect($config->config['subdomain_srv_protocol'])->toBe('_minecraft');
    expect($config->config['required_env_variables'])->toContain('FIVEM_LICENSE');
    expect($config->config['gameq_type'])->toBe('minecraft');
});

test('gameq_type can be set and cleared in egg config', function () {
    $this->actingAs($this->admin);

    $this->put(route('admin.hosting-servers.pterodactyl-nests.eggs.config.update', [
        'hostingServer' => $this->pterodactylServer,
        'nest' => 1,
        'egg' => 1,
    ]), [
        'config' => [
            'gameq_type' => 'csgo',
        ],
    ]);

    $config = PterodactylEggConfig::query()
        ->where('hosting_server_id', $this->pterodactylServer->id)
        ->where('nest_id', 1)
        ->where('egg_id', 1)
        ->first();
    expect($config->config['gameq_type'] ?? '')->toBe('csgo');

    $this->put(route('admin.hosting-servers.pterodactyl-nests.eggs.config.update', [
        'hostingServer' => $this->pterodactylServer,
        'nest' => 1,
        'egg' => 1,
    ]), [
        'config' => [
            'gameq_type' => '',
        ],
    ]);

    $config->refresh();
    expect($config->config['gameq_type'] ?? '')->toBe('');
});
