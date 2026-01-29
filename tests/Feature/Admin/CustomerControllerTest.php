<?php

use App\Models\User;

test('guests cannot access admin customers', function () {
    $response = $this->get(route('admin.customers.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin customers', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.customers.index'));
    $response->assertForbidden();
});

test('admin users can view customer index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.customers.index'));
    $response->assertOk();
});

test('admin users can view customer detail', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.customers.show', $customer));
    $response->assertOk();
});
