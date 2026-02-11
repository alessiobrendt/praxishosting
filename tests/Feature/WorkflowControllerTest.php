<?php

use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
});

test('guests cannot access workflow builder', function () {
    $response = $this->get(route('workflow-builder.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view workflow builder', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('workflow-builder.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('WorkflowBuilder/Index'));
});

test('authenticated users can save workflow', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $payload = [
        'meta' => ['id' => 'wf_test1', 'name' => 'Test Workflow'],
        'nodes' => [
            ['id' => 'n1', 'type' => 'trigger.form_submit', 'label' => 'Form', 'x' => 0, 'y' => 0, 'config' => []],
        ],
        'edges' => [],
    ];

    $response = $this->postJson(route('workflow-builder.store'), $payload);
    $response->assertOk();
    $response->assertJson(['ok' => true, 'id' => 'wf_test1']);

    $this->assertTrue(Storage::disk('local')->exists('workflows/wf_test1.json'));
});

test('authenticated users can load workflow', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $payload = [
        'meta' => ['id' => 'wf_load1', 'name' => 'Load Test'],
        'nodes' => [],
        'edges' => [],
    ];
    Storage::disk('local')->put(
        'workflows/wf_load1.json',
        json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
    );

    $response = $this->getJson(route('workflow-builder.show', 'wf_load1'));
    $response->assertOk();
    $response->assertJson(['ok' => true, 'data' => $payload]);
});

test('authenticated users can list workflows', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Storage::disk('local')->put('workflows/wf_a.json', '{}');
    Storage::disk('local')->put('workflows/wf_b.json', '{}');

    $response = $this->getJson(route('workflow-builder.list'));
    $response->assertOk();
    $response->assertJson(['ok' => true, 'ids' => ['wf_a', 'wf_b']]);
});
