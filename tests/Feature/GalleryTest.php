<?php

use App\Models\Template;

test('gallery index shows only active templates', function () {
    Template::factory()->create(['is_active' => false, 'name' => 'Inactive Template']);
    Template::factory()->create(['is_active' => true, 'name' => 'Active Template']);

    $response = $this->get(route('gallery.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('gallery/Index')
        ->has('templates')
        ->where('templates.0.name', 'Active Template')
    );
});

test('gallery preview shows template', function () {
    $template = Template::factory()->create(['is_active' => true]);

    $response = $this->get(route('gallery.preview', $template));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('gallery/Preview')
        ->has('template')
    );
});

test('inactive template preview returns 404', function () {
    $template = Template::factory()->create(['is_active' => false]);

    $response = $this->get(route('gallery.preview', $template));
    $response->assertNotFound();
});
