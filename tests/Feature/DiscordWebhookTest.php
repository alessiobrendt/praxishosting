<?php

use App\Models\User;

test('discord interactions endpoint returns 401 when signature headers are missing', function () {
    $response = $this->postJson(route('webhooks.discord.interactions'), [
        'type' => 1,
    ]);

    $response->assertStatus(401);
});

test('discord interactions endpoint returns 400 when body is not valid JSON', function () {
    $keypair = sodium_crypto_sign_keypair();
    $publicKey = sodium_crypto_sign_publickey($keypair);
    config(['services.discord.application_public_key' => sodium_bin2hex($publicKey)]);

    $body = 'not json';
    $timestamp = (string) time();
    $message = $timestamp.$body;
    $secretKey = sodium_crypto_sign_secretkey($keypair);
    $signature = sodium_crypto_sign_detached($message, $secretKey);

    $response = $this->call(
        'POST',
        route('webhooks.discord.interactions'),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_Signature_Ed25519' => sodium_bin2hex($signature),
            'HTTP_X_Signature_Timestamp' => $timestamp,
        ],
        $body
    );

    $response->assertStatus(400);
});

test('discord link command returns message when user not found', function () {
    $keypair = sodium_crypto_sign_keypair();
    $publicKey = sodium_crypto_sign_publickey($keypair);
    config(['services.discord.application_public_key' => sodium_bin2hex($publicKey)]);

    $payload = [
        'type' => 2,
        'data' => ['name' => 'link'],
        'member' => ['user' => ['id' => '999999999999999999']],
    ];
    $body = json_encode($payload);
    $timestamp = (string) time();
    $message = $timestamp.$body;
    $secretKey = sodium_crypto_sign_secretkey($keypair);
    $signature = sodium_crypto_sign_detached($message, $secretKey);

    $response = $this->call(
        'POST',
        route('webhooks.discord.interactions'),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_Signature_Ed25519' => sodium_bin2hex($signature),
            'HTTP_X_Signature_Timestamp' => $timestamp,
        ],
        $body
    );

    $response->assertOk();
    $data = $response->json();
    expect($data)->toHaveKey('type', 4);
    expect($data['data']['content'] ?? '')->toContain('Kein verknüpftes Konto');
});

test('discord link command returns success when user with discord_id exists', function () {
    $keypair = sodium_crypto_sign_keypair();
    $publicKey = sodium_crypto_sign_publickey($keypair);
    config(['services.discord.application_public_key' => sodium_bin2hex($publicKey)]);
    config(['services.discord.customer_role_id' => null]);

    $discordUserId = '123456789012345678';
    User::factory()->create(['discord_id' => $discordUserId]);

    $payload = [
        'type' => 2,
        'data' => ['name' => 'link'],
        'member' => ['user' => ['id' => $discordUserId]],
    ];
    $body = json_encode($payload);
    $timestamp = (string) time();
    $message = $timestamp.$body;
    $secretKey = sodium_crypto_sign_secretkey($keypair);
    $signature = sodium_crypto_sign_detached($message, $secretKey);

    $response = $this->call(
        'POST',
        route('webhooks.discord.interactions'),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_Signature_Ed25519' => sodium_bin2hex($signature),
            'HTTP_X_Signature_Timestamp' => $timestamp,
        ],
        $body
    );

    $response->assertOk();
    $data = $response->json();
    expect($data)->toHaveKey('type', 4);
    expect($data['data']['content'] ?? '')->toContain('verknüpft');
});
