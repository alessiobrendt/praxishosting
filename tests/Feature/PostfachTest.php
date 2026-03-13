<?php

use App\Models\Brand;
use App\Models\User;
use App\Models\UserEmailLog;

test('authenticated user can view postfach index', function () {
    Brand::query()->update(['is_default' => false]);
    $brand = Brand::create([
        'key' => 'test-postfach',
        'name' => 'Test',
        'domains' => null,
        'is_default' => true,
        'features' => [],
    ]);
    $user = User::factory()->create(['brand_id' => $brand->id]);
    $this->actingAs($user);

    $response = $this->get(route('postfach.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('account/Postfach')
        ->has('emails')
        ->where('selectedEmail', null)
    );
});

test('authenticated user can view single email in postfach', function () {
    Brand::query()->update(['is_default' => false]);
    $brand = Brand::create([
        'key' => 'test-postfach2',
        'name' => 'Test',
        'domains' => null,
        'is_default' => true,
        'features' => [],
    ]);
    $user = User::factory()->create(['brand_id' => $brand->id]);
    $log = UserEmailLog::create([
        'user_id' => $user->id,
        'subject' => 'Test E-Mail',
        'body_html' => '<p>Hello</p>',
        'snippet' => 'Hello',
        'sent_at' => now(),
    ]);
    $this->actingAs($user);

    $response = $this->get(route('postfach.show', $log));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('account/Postfach')
        ->has('emails')
        ->has('selectedEmail')
        ->where('selectedEmail.subject', 'Test E-Mail')
        ->where('selectedEmail.body_html', '<p>Hello</p>')
    );
});

test('user cannot view another users postfach email', function () {
    Brand::query()->update(['is_default' => false]);
    $brand = Brand::create([
        'key' => 'test-postfach3',
        'name' => 'Test',
        'domains' => null,
        'is_default' => true,
        'features' => [],
    ]);
    $owner = User::factory()->create(['brand_id' => $brand->id]);
    $other = User::factory()->create(['brand_id' => $brand->id]);
    $log = UserEmailLog::create([
        'user_id' => $owner->id,
        'subject' => 'Private',
        'body_html' => '<p>Secret</p>',
        'snippet' => 'Secret',
        'sent_at' => now(),
    ]);
    $this->actingAs($other);

    $response = $this->get(route('postfach.show', $log));

    $response->assertForbidden();
});

test('guest cannot access postfach', function () {
    $response = $this->get(route('postfach.index'));
    $response->assertRedirect(route('login'));
});
