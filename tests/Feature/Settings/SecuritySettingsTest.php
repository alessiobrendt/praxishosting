<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('security settings page can be rendered', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('security.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/Security')
        );
});

test('inactivity lock minutes can be updated', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->patch(route('security.update'), [
            'inactivity_lock_minutes' => 15,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.show'));

    expect($user->refresh()->inactivity_lock_minutes)->toBe(15);
});

test('inactivity lock minutes must be valid', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->patch(route('security.update'), [
            'inactivity_lock_minutes' => 99,
        ])
        ->assertSessionHasErrors('inactivity_lock_minutes');
});

test('pin can be enabled with current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->post(route('security.pin.store'), [
            'current_password' => 'password',
            'pin' => '1234',
            'pin_confirmation' => '1234',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.show'));

    $user->refresh();
    expect($user->hasPin())->toBeTrue();
    expect($user->pin_length)->toBe(4);
    expect(Hash::check('1234', $user->pin_hash))->toBeTrue();
});

test('pin enable requires correct current password', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->post(route('security.pin.store'), [
            'current_password' => 'wrong-password',
            'pin' => '1234',
            'pin_confirmation' => '1234',
        ])
        ->assertSessionHasErrors('current_password');
});

test('pin enable requires pin confirmation', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->post(route('security.pin.store'), [
            'current_password' => 'password',
            'pin' => '1234',
            'pin_confirmation' => '5678',
        ])
        ->assertSessionHasErrors('pin');
});

test('pin can be changed with current password', function () {
    $user = User::factory()->withPin('1234')->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->put(route('security.pin.update'), [
            'current_password' => 'password',
            'pin' => '5678',
            'pin_confirmation' => '5678',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.show'));

    $user->refresh();
    expect(Hash::check('5678', $user->pin_hash))->toBeTrue();
    expect(Hash::check('1234', $user->pin_hash))->toBeFalse();
});

test('pin can be disabled with current password', function () {
    $user = User::factory()->withPin('1234')->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->delete(route('security.pin.destroy'), [
            'current_password' => 'password',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.show'));

    $user->refresh();
    expect($user->hasPin())->toBeFalse();
    expect($user->pin_hash)->toBeNull();
    expect($user->pin_length)->toBeNull();
});

test('pin disable requires correct current password', function () {
    $user = User::factory()->withPin('1234')->create();

    $this->actingAs($user)
        ->from(route('security.show'))
        ->delete(route('security.pin.destroy'), [
            'current_password' => 'wrong-password',
        ])
        ->assertSessionHasErrors('current_password');
});
