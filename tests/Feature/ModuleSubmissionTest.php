<?php

use App\Models\NewsletterSubscription;
use App\Models\Site;
use App\Models\Template;

beforeEach(function () {
    $template = Template::factory()->create();
    $this->site = Site::factory()->create([
        'template_id' => $template->id,
        'status' => 'active',
    ]);
});

test('contact form submission creates contact submission record', function () {
    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'contact',
        'module_instance_id' => 'lc_test_123',
        'module_config' => ['fields' => []],
        'data' => [
            'name' => 'Max Mustermann',
            'email' => 'max@example.com',
            'message' => 'Testnachricht',
        ],
        'honeypot' => '',
    ]);

    $response->assertOk();
    $response->assertJson(['success' => true, 'message' => __('Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.')]);

    $this->assertDatabaseHas('contact_submissions', [
        'site_id' => $this->site->id,
        'name' => 'Max Mustermann',
        'email' => 'max@example.com',
        'message' => 'Testnachricht',
    ]);
});

test('contact form submission with honeypot filled fails validation', function () {
    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'contact',
        'data' => ['name' => 'Test', 'email' => 'test@example.com', 'message' => 'Hi'],
        'honeypot' => 'spam',
    ]);

    $response->assertUnprocessable();
});

test('contact form submission with invalid email fails validation', function () {
    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'contact',
        'data' => [
            'name' => 'Max',
            'email' => 'invalid-email',
            'message' => 'Test',
        ],
        'honeypot' => '',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['email']);
});

test('newsletter subscription creates subscription record', function () {
    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'newsletter',
        'data' => ['email' => 'subscriber@example.com'],
        'honeypot' => '',
    ]);

    $response->assertOk();
    $response->assertJson(['success' => true]);

    $this->assertDatabaseHas('newsletter_subscriptions', [
        'site_id' => $this->site->id,
        'email' => 'subscriber@example.com',
    ]);
});

test('newsletter subscription with duplicate email returns error', function () {
    NewsletterSubscription::create([
        'site_id' => $this->site->id,
        'email' => 'existing@example.com',
        'token' => 'test-token',
        'subscribed_at' => now(),
    ]);

    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'newsletter',
        'data' => ['email' => 'existing@example.com'],
        'honeypot' => '',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonFragment(['success' => false]);
});

test('module submission for inactive site returns 422 when unauthenticated', function () {
    $this->site->update(['status' => 'suspended']);

    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'contact',
        'data' => ['name' => 'Test', 'email' => 'test@example.com', 'message' => 'Hi'],
        'honeypot' => '',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonFragment(['success' => false]);
});

test('module submission for inactive site succeeds when user can update site (preview context)', function () {
    $user = \App\Models\User::factory()->create();
    $this->site->update(['status' => 'suspended', 'user_id' => $user->id]);

    $response = $this->actingAs($user)->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'contact',
        'data' => ['name' => 'Preview Test', 'email' => 'preview@example.com', 'message' => 'Test from preview'],
        'honeypot' => '',
    ]);

    $response->assertOk();
    $response->assertJson(['success' => true]);
    $this->assertDatabaseHas('contact_submissions', [
        'site_id' => $this->site->id,
        'email' => 'preview@example.com',
    ]);
});

test('unknown module type returns 422', function () {
    $response = $this->postJson("/api/sites/{$this->site->uuid}/modules/submit", [
        'module_type' => 'unknown_module',
        'data' => [],
        'honeypot' => '',
    ]);

    $response->assertUnprocessable();
});

test('newsletter status endpoint returns subscribed false when no cookie', function () {
    $response = $this->getJson("/api/sites/{$this->site->uuid}/modules/newsletter/status");

    $response->assertOk();
    $response->assertJson(['subscribed' => false]);
});
