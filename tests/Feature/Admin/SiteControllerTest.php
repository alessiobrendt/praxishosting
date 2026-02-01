<?php

use App\Models\Site;
use App\Models\SiteSubscription;
use App\Models\User;
use Carbon\Carbon;

test('guests cannot access admin site show', function () {
    $site = Site::factory()->create();
    $response = $this->get(route('admin.sites.show', $site));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin site show', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $site = Site::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.sites.show', $site));
    $response->assertForbidden();
});

test('admin users can view admin site detail', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $site = Site::factory()->create();
    $this->actingAs($admin);

    $response = $this->get(route('admin.sites.show', $site));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/sites/Show')
        ->has('site')
        ->where('site.id', $site->id)
        ->where('site.name', $site->name)
    );
});

test('admin users can update site status to suspended', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $site = Site::factory()->create(['status' => 'active']);
    $this->actingAs($admin);

    $response = $this->put(route('admin.sites.status.update', $site), ['status' => 'suspended']);
    $response->assertRedirect(route('admin.sites.show', $site));
    $site->refresh();
    expect($site->status)->toBe('suspended');
});

test('admin users can update site status to active', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $site = Site::factory()->create(['status' => 'suspended']);
    $this->actingAs($admin);

    $response = $this->put(route('admin.sites.status.update', $site), ['status' => 'active']);
    $response->assertRedirect(route('admin.sites.show', $site));
    $site->refresh();
    expect($site->status)->toBe('active');
});

test('admin users can update site subscription period end locally', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $site = Site::factory()->create();
    $sub = SiteSubscription::create([
        'site_id' => $site->id,
        'stripe_subscription_id' => 'sub_test',
        'stripe_price_id' => 'price_test',
        'stripe_status' => 'active',
        'current_period_ends_at' => Carbon::now()->addMonth(),
        'cancel_at_period_end' => false,
    ]);
    $newEnd = Carbon::now()->addWeeks(2)->format('Y-m-d');
    $this->actingAs($admin);

    $response = $this->put(route('admin.sites.subscription.update', $site), [
        'current_period_ends_at' => $newEnd,
    ]);
    $response->assertRedirect(route('admin.sites.show', $site));
    $sub->refresh();
    expect($sub->current_period_ends_at->format('Y-m-d'))->toBe($newEnd);
});
