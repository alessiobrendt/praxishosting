<?php

use App\Models\Site;
use App\Models\Template;
use App\Models\TemplatePage;
use App\Services\SiteRenderService;

test('resolveRenderData includes active_modules when newsletter block in layout_components', function () {
    $template = Template::factory()->create();
    TemplatePage::factory()->create([
        'template_id' => $template->id,
        'slug' => 'index',
        'order' => 0,
        'data' => [
            'layout_components' => [
                ['id' => 'lc_1', 'type' => 'header', 'data' => []],
                ['id' => 'lc_2', 'type' => 'newsletter', 'data' => []],
            ],
        ],
    ]);
    $site = Site::factory()->create([
        'template_id' => $template->id,
        'status' => 'active',
        'custom_page_data' => null,
    ]);
    $site->load('template.pages');

    $service = new SiteRenderService;
    $result = $service->resolveRenderData($site);

    expect($result['generalInformation']['active_modules'])->toContain('newsletter');
});
