<?php

use App\Models\Domain;
use App\Models\Site;
use App\Models\User;

test('returns 400 when domain parameter is missing', function () {
    $response = $this->get('/api/verify-domain');

    $response->assertStatus(400);
});

test('returns 403 when domain does not exist', function () {
    $response = $this->get('/api/verify-domain?domain=nonexistent.com');

    $response->assertStatus(403);
});

test('returns 403 when domain exists but is not verified', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id]);
    $domain = Domain::factory()->create([
        'site_id' => $site->id,
        'domain' => 'unverified.com',
        'is_verified' => false,
    ]);

    $response = $this->get('/api/verify-domain?domain=unverified.com');

    $response->assertStatus(403);
});

test('returns 200 when domain exists and is verified', function () {
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id]);
    $domain = Domain::factory()->create([
        'site_id' => $site->id,
        'domain' => 'verified.com',
        'is_verified' => true,
    ]);

    $response = $this->get('/api/verify-domain?domain=verified.com');

    $response->assertStatus(200);
});

test('endpoint is accessible without authentication', function () {
    // This test ensures Caddy can call the endpoint without auth
    $user = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $user->id]);
    $domain = Domain::factory()->create([
        'site_id' => $site->id,
        'domain' => 'public-check.com',
        'is_verified' => true,
    ]);

    // Don't authenticate - simulate Caddy calling the endpoint
    $response = $this->get('/api/verify-domain?domain=public-check.com');

    $response->assertStatus(200);
});
