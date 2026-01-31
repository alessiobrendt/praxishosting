<?php

use App\Models\User;

test('pin verify succeeds with correct pin', function () {
    $user = User::factory()->withPin('1234')->create();

    $response = $this->actingAs($user)
        ->post(route('pin.verify'), [
            'pin' => '1234',
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect();
    $response->assertSessionHas('pin_verified_at');
});

test('pin verify fails with wrong pin', function () {
    $user = User::factory()->withPin('1234')->create();

    $this->actingAs($user)
        ->post(route('pin.verify'), [
            'pin' => '0000',
        ])
        ->assertSessionHasErrors('pin');
});

test('pin verify returns forbidden when user has no pin', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('pin.verify'), [
            'pin' => '1234',
        ])
        ->assertForbidden();
});

test('pin verify requires authentication', function () {
    $this->post(route('pin.verify'), ['pin' => '1234'])
        ->assertRedirect(route('login'));
});

test('pin verify returns lockout error when user is locked out', function () {
    $user = User::factory()->withPin('1234')->withPinLockout()->create();

    $this->actingAs($user)
        ->post(route('pin.verify'), ['pin' => '1234'])
        ->assertSessionHasErrors('pin');
});
