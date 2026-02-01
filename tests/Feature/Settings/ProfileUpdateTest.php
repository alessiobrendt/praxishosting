<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('profile information including billing address can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'street' => 'Musterstraße 1',
            'postal_code' => '12345',
            'city' => 'Berlin',
            'country' => 'DE',
            'company' => 'Test GmbH',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->street)->toBe('Musterstraße 1');
    expect($user->postal_code)->toBe('12345');
    expect($user->city)->toBe('Berlin');
    expect($user->country)->toBe('DE');
    expect($user->company)->toBe('Test GmbH');
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('hasCompleteBillingProfile returns false when required fields are missing', function () {
    $user = User::factory()->create([
        'street' => null,
        'postal_code' => null,
        'city' => null,
        'country' => null,
    ]);

    expect($user->hasCompleteBillingProfile())->toBeFalse();
});

test('hasCompleteBillingProfile returns false when name is empty', function () {
    $user = User::factory()->withBillingProfile()->create([
        'name' => '',
    ]);

    expect($user->hasCompleteBillingProfile())->toBeFalse();
});

test('hasCompleteBillingProfile returns false when street is empty', function () {
    $user = User::factory()->withBillingProfile()->create([
        'street' => '',
    ]);

    expect($user->hasCompleteBillingProfile())->toBeFalse();
});

test('hasCompleteBillingProfile returns true when all required fields are set', function () {
    $user = User::factory()->withBillingProfile()->create();

    expect($user->hasCompleteBillingProfile())->toBeTrue();
});

test('hasCompleteBillingProfile returns true when company is null', function () {
    $user = User::factory()->withBillingProfile()->create([
        'company' => null,
    ]);

    expect($user->hasCompleteBillingProfile())->toBeTrue();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
