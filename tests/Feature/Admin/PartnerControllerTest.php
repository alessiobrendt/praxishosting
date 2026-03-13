<?php

use App\Models\Brand;
use App\Models\Partner;
use App\Models\User;

test('guests cannot access admin partners', function () {
    $response = $this->get(route('admin.partners.index'));
    $response->assertRedirect(route('login'));
});

test('admin users can view partners index', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $response = $this->get(route('admin.partners.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/partners/Index')
        ->has('partners')
        ->has('brands')
    );
});

test('admin users can create partner', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $brand = Brand::create(['key' => 'test', 'name' => 'Test', 'is_default' => false]);
    $this->actingAs($admin);

    $response = $this->post(route('admin.partners.store'), [
        'brand_id' => $brand->id,
        'name' => 'Test Partner',
        'description' => 'Beschreibung',
        'discount_percent' => 10,
        'is_active' => true,
    ]);
    $response->assertRedirect(route('admin.partners.index'));
    $this->assertDatabaseHas('partners', [
        'name' => 'Test Partner',
        'brand_id' => $brand->id,
        'discount_percent' => 10,
        'is_active' => true,
    ]);
});

test('api returns partners for brand', function () {
    $user = User::factory()->create();
    $brand = Brand::create(['key' => 'test', 'name' => 'Test', 'is_default' => false]);
    Partner::create(['brand_id' => $brand->id, 'name' => 'P1', 'discount_percent' => 5, 'is_active' => true]);

    $response = $this->actingAs($user)->getJson(route('api.v1.partners.index').'?brand_id='.$brand->id);
    $response->assertOk();
    $response->assertJsonStructure(['data' => [['name', 'description', 'image_url']]]);
    $response->assertJsonPath('data.0.name', 'P1');
});
