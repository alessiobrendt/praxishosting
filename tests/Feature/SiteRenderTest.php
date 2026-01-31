<?php

use App\Models\Site;
use App\Models\Template;
use App\Models\TemplatePage;
use App\Models\User;
use Illuminate\Support\Facades\Config;

test('public can view site by domain when GET root on site host', function () {
    Config::set('domains.main_app_hosts', ['localhost']);

    $template = Template::factory()->create([
        'page_data' => ['hero' => ['heading' => 'Domain Hero', 'text' => 'Text']],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'my-practice',
        'status' => 'active',
    ]);
    $site->domains()->create([
        'domain' => 'meine-praxis.example.com',
        'type' => 'subdomain',
        'is_primary' => true,
        'is_verified' => true,
    ]);

    $response = $this->get('http://meine-praxis.example.com/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->where('site.id', $site->id)
        ->where('pageData.hero.heading', 'Domain Hero')
    );
});

test('GET non-root path on site domain returns 404', function () {
    Config::set('domains.main_app_hosts', ['localhost']);

    $site = Site::factory()->create(['status' => 'active']);
    $site->domains()->create([
        'domain' => 'other-site.example.com',
        'type' => 'subdomain',
        'is_primary' => true,
        'is_verified' => true,
    ]);

    $response = $this->get('http://other-site.example.com/other-path');

    $response->assertNotFound();
});

test('GET root on unknown host returns 404', function () {
    Config::set('domains.main_app_hosts', ['localhost']);

    $response = $this->get('http://unknown-host.example.com/');

    $response->assertNotFound();
});

test('GET root on site host with .test suffix resolves domain without .test', function () {
    Config::set('domains.main_app_hosts', ['localhost']);

    $template = Template::factory()->create([
        'page_data' => ['hero' => ['heading' => 'Herd Hero', 'text' => 'Text']],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'handmeier-ypkk2u',
        'status' => 'active',
    ]);
    $site->domains()->create([
        'domain' => 'handmeier-ypkk2u.praxishosting.abrendt.de',
        'type' => 'subdomain',
        'is_primary' => true,
        'is_verified' => true,
    ]);

    $response = $this->get('http://handmeier-ypkk2u.praxishosting.abrendt.de.test/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->where('site.id', $site->id)
        ->where('pageData.hero.heading', 'Herd Hero')
    );
});

test('public can view site by slug', function () {
    $template = Template::factory()->create([
        'page_data' => [
            'hero' => ['heading' => 'Test', 'text' => 'Text'],
        ],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'my-practice',
        'status' => 'active',
    ]);

    $response = $this->get(route('site-render.show', $site->slug));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->has('site')
        ->has('pageData')
        ->has('templateSlug')
        ->where('pageData.hero.heading', 'Test')
    );
});

test('site render with handwerk template returns ok and handwerk page data', function () {
    $template = Template::factory()->create([
        'slug' => 'handwerk',
        'page_data' => [
            'colors' => ['primary' => '#0d9488'],
            'hero' => ['heading' => 'Handwerk Hero', 'text' => 'Handwerk text', 'buttons' => [], 'image' => ['src' => '', 'alt' => '']],
            'services' => [['title' => 'Service A', 'shortDesc' => 'Desc A']],
            'about' => ['heading' => 'Über uns', 'text' => 'About text'],
            'contact' => ['heading' => 'Kontakt', 'text' => 'Contact text', 'phone' => '', 'email' => '', 'address' => '', 'buttonText' => '', 'buttonHref' => ''],
        ],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'my-handwerk',
        'status' => 'active',
    ]);

    $response = $this->get(route('site-render.show', $site->slug));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->where('templateSlug', 'handwerk')
        ->where('pageData.hero.heading', 'Handwerk Hero')
        ->has('pageData.services')
        ->has('pageData.contact')
    );
});

test('site render uses index page data when template has pages', function () {
    $template = Template::factory()->create(['slug' => 'praxisemerald']);
    TemplatePage::factory()->create([
        'template_id' => $template->id,
        'slug' => 'index',
        'order' => 0,
        'data' => [
            'hero' => ['heading' => 'Index Hero', 'text' => 'Index text'],
        ],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'my-practice',
        'status' => 'active',
    ]);

    $response = $this->get(route('site-render.show', $site->slug));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->where('pageData.hero.heading', 'Index Hero')
    );
});

test('inactive site returns 404', function () {
    $template = Template::factory()->create();
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'inactive-site',
        'status' => 'inactive',
    ]);

    $response = $this->get(route('site-render.show', $site->slug));
    $response->assertNotFound();
});

test('guest cannot access site preview', function () {
    $site = Site::factory()->create(['status' => 'active']);

    $response = $this->get(route('sites.preview', $site));
    $response->assertRedirect(route('login'));
});

test('authenticated user can view site preview with draft data', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['page_data' => ['hero' => ['heading' => 'Default', 'text' => 'Text']]]);
    $site = Site::factory()->create([
        'user_id' => $user->id,
        'template_id' => $template->id,
        'status' => 'active',
    ]);
    $this->actingAs($user);

    $response = $this->get(route('sites.preview', $site));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->has('pageData')
    );
});

test('public can view subpage by slug', function () {
    $template = Template::factory()->create([
        'slug' => 'praxisemerald',
        'page_data' => ['hero' => ['heading' => 'Index', 'text' => 'Text']],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'slug' => 'my-practice',
        'status' => 'active',
        'custom_page_data' => [
            'pages' => [
                'notfallinformationen' => [
                    'layout_components' => [
                        ['id' => 'h1', 'type' => 'heading', 'data' => ['level' => 1, 'text' => 'Notfall']],
                    ],
                ],
            ],
        ],
    ]);

    $response = $this->get(route('site-render.show', ['site' => $site->slug, 'pageSlug' => 'notfallinformationen']));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('site-render/Home')
        ->where('pageSlug', 'notfallinformationen')
        ->where('pageData.layout_components.0.data.text', 'Notfall')
    );
});

test('deactivated page redirects to site index', function () {
    $template = Template::factory()->create();
    $template->pages()->create([
        'name' => 'Notfallinformationen',
        'slug' => 'notfallinformationen',
        'order' => 1,
        'data' => [],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'status' => 'active',
        'custom_page_data' => [
            'pages_meta' => [
                'notfallinformationen' => ['active' => false],
            ],
        ],
    ]);

    $response = $this->get(route('site-render.show', ['site' => $site->slug, 'pageSlug' => 'notfallinformationen']));
    $response->assertRedirect(route('site-render.show', $site->slug));
});

test('preview with page query uses that page slug', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['page_data' => ['hero' => ['heading' => 'Default', 'text' => 'Text']]]);
    $site = Site::factory()->create([
        'user_id' => $user->id,
        'template_id' => $template->id,
        'status' => 'active',
        'custom_page_data' => [
            'pages' => [
                'patienteninformationen' => [
                    'layout_components' => [
                        ['id' => 'p1', 'type' => 'text', 'data' => ['text' => 'Patienteninfos']],
                    ],
                ],
            ],
        ],
    ]);
    $this->actingAs($user);

    $response = $this->get(route('sites.preview', $site).'?page=patienteninformationen');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('pageSlug', 'patienteninformationen')
        ->where('pageData.layout_components.0.data.text', 'Patienteninfos')
    );
});

test('authenticated user can store preview draft and preview uses it', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['page_data' => ['hero' => ['heading' => 'Default', 'text' => 'Text']]]);
    $site = Site::factory()->create([
        'user_id' => $user->id,
        'template_id' => $template->id,
        'status' => 'active',
    ]);
    $this->actingAs($user);

    $draft = [
        'custom_page_data' => ['hero' => ['heading' => 'Draft Hero', 'text' => 'Draft text']],
        'custom_colors' => ['primary' => '#000000'],
    ];

    $postResponse = $this->postJson(route('sites.preview.store', $site), $draft);
    $postResponse->assertOk();

    $getResponse = $this->get(route('sites.preview', $site));
    $getResponse->assertOk();
    $getResponse->assertInertia(fn ($page) => $page
        ->where('pageData.hero.heading', 'Draft Hero')
        ->where('colors.primary', '#000000')
    );
});
