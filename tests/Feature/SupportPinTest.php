<?php

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    Config::set('app.timezone', 'Europe/Berlin');
});

test('support pin is deterministic for same user and date', function () {
    $user = User::factory()->create();
    $date = Carbon::parse('2025-06-15', 'Europe/Berlin');

    $pin1 = $user->getSupportPin($date);
    $pin2 = $user->getSupportPin($date);

    expect($pin1)->toBe($pin2);
});

test('support pin differs for different dates', function () {
    $user = User::factory()->create();
    $date1 = Carbon::parse('2025-06-15', 'Europe/Berlin');
    $date2 = Carbon::parse('2025-06-16', 'Europe/Berlin');

    $pin1 = $user->getSupportPin($date1);
    $pin2 = $user->getSupportPin($date2);

    expect($pin1)->not->toBe($pin2);
});

test('support pin differs for different users on same date', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $date = Carbon::parse('2025-06-15', 'Europe/Berlin');

    $pin1 = $user1->getSupportPin($date);
    $pin2 = $user2->getSupportPin($date);

    expect($pin1)->not->toBe($pin2);
});

test('support pin is exactly six digits', function () {
    $user = User::factory()->create();
    $pin = $user->getSupportPin();

    expect(strlen($pin))->toBe(6)
        ->and($pin)->toMatch('/^\d{6}$/');
});

test('support pin valid until is start of next day in app timezone', function () {
    $user = User::factory()->create();
    $validUntil = $user->getSupportPinValidUntil();

    $startOfNextDay = Carbon::today(config('app.timezone'))->addDay()->startOfDay();
    expect($validUntil->eq($startOfNextDay))->toBeTrue();
});

test('dashboard includes support pin and valid until', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->has('supportPin')
        ->has('supportPinValidUntil')
        ->where('supportPin', $user->getSupportPin())
    );
});

test('admin customer show includes support pin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.customers.show', $customer));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/customers/Show')
        ->has('customer.support_pin')
        ->has('customer.support_pin_valid_until')
        ->where('customer.support_pin', $customer->getSupportPin())
    );
});

test('admin search returns customer when searching by 6-digit support pin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $customer = User::factory()->create(['name' => 'Pin Customer', 'email' => 'pin@example.com']);
    $pin = $customer->getSupportPin();
    $this->actingAs($admin);

    $response = $this->getJson(route('admin.search', ['q' => $pin]));

    $response->assertOk();
    $data = $response->json();
    expect($data['customers'])->toBeArray();
    $labels = array_column($data['customers'], 'label');
    expect($labels)->toContain('Pin Customer (pin@example.com) – Support-PIN');
});
