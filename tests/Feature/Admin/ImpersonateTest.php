<?php

use App\Models\User;

test('admin can impersonate customer', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create(['is_admin' => false, 'name' => 'Customer User']);
    $this->actingAs($admin);

    $response = $this->get(route('admin.impersonate', $customer->id));

    $response->assertRedirect();
    $this->assertAuthenticatedAs($customer);
});

test('admin can leave impersonation', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create(['is_admin' => false]);
    $this->actingAs($admin);
    app('impersonate')->take($admin, $customer);

    $response = $this->get(route('impersonate.leave'));

    $response->assertRedirect();
    $this->assertAuthenticatedAs($admin);
});

test('non-admin cannot impersonate', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $customer = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.impersonate', $customer->id));

    $response->assertForbidden();
});

test('admin cannot impersonate another admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $otherAdmin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.impersonate', $otherAdmin->id));

    $response->assertRedirect();
    $this->assertAuthenticatedAs($admin);
});
