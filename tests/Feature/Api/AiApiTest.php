<?php

use App\Models\AiTokenBalance;
use App\Models\Site;
use App\Models\User;
use App\Services\AiTokenService;
use App\Services\OpenAiService;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    Config::set('openai.api_key', 'test-key-for-ai-tests');
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('balance returns zero for user with no tokens', function () {
    $response = $this->getJson('/api/ai/balance');

    $response->assertOk();
    $response->assertJson(['balance' => 0]);
});

test('balance returns correct amount for user with tokens', function () {
    AiTokenBalance::create([
        'user_id' => $this->user->id,
        'balance' => 1500,
    ]);

    $response = $this->getJson('/api/ai/balance');

    $response->assertOk();
    $response->assertJson(['balance' => 1500]);
});

test('ai endpoints require authentication', function () {
    auth()->logout();

    $this->getJson('/api/ai/balance')->assertUnauthorized();
    $this->postJson('/api/ai/seo-suggestions', [
        'site_uuid' => Site::factory()->create()->uuid,
        'page_slug' => 'home',
    ])->assertUnauthorized();
    $this->postJson('/api/ai/generate-text', [
        'context' => 'Test',
        'prompt_template' => 'expand',
    ])->assertUnauthorized();
});

test('seo-suggestions returns 402 when insufficient tokens', function () {
    $site = Site::factory()->create(['user_id' => $this->user->id]);
    AiTokenBalance::create(['user_id' => $this->user->id, 'balance' => 100]);

    $this->mock(OpenAiService::class);

    $response = $this->postJson('/api/ai/seo-suggestions', [
        'site_uuid' => $site->uuid,
        'page_slug' => 'home',
        'page_content' => 'Some page content',
    ]);

    $response->assertStatus(402);
    $response->assertJsonFragment(['message' => 'Nicht genügend AI-Tokens. Bitte laden Sie Ihr Guthaben auf.']);
});

test('seo-suggestions returns meta title and description when successful', function () {
    $site = Site::factory()->create(['user_id' => $this->user->id]);
    AiTokenBalance::create(['user_id' => $this->user->id, 'balance' => 1000]);

    $this->mock(OpenAiService::class, function ($mock) {
        $mock->shouldReceive('generateSeoSuggestions')
            ->once()
            ->andReturn([
                'meta_title' => 'Test Meta Title',
                'meta_description' => 'Test meta description for SEO.',
                'og_title' => 'Test OG Title',
                'og_description' => 'Test OG description.',
                'og_image' => 'https://example.com/image.jpg',
                'twitter_card' => 'summary_large_image',
                'twitter_title' => 'Test Twitter Title',
                'twitter_description' => 'Test Twitter description.',
                'twitter_image' => 'https://example.com/twitter.jpg',
            ]);
    });

    $response = $this->postJson('/api/ai/seo-suggestions', [
        'site_uuid' => $site->uuid,
        'page_slug' => 'home',
        'page_content' => 'Some page content for SEO',
    ]);

    $response->assertOk();
    $response->assertJson([
        'meta_title' => 'Test Meta Title',
        'meta_description' => 'Test meta description for SEO.',
        'og_title' => 'Test OG Title',
        'og_description' => 'Test OG description.',
        'og_image' => 'https://example.com/image.jpg',
        'twitter_card' => 'summary_large_image',
        'twitter_title' => 'Test Twitter Title',
        'twitter_description' => 'Test Twitter description.',
        'twitter_image' => 'https://example.com/twitter.jpg',
    ]);

    expect(app(AiTokenService::class)->getBalance($this->user))->toBe(500);
});

test('seo-suggestions returns 403 when user cannot update site', function () {
    $otherUser = User::factory()->create();
    $site = Site::factory()->create(['user_id' => $otherUser->id]);
    AiTokenBalance::create(['user_id' => $this->user->id, 'balance' => 1000]);

    $response = $this->postJson('/api/ai/seo-suggestions', [
        'site_uuid' => $site->uuid,
        'page_slug' => 'home',
        'page_content' => 'Content',
    ]);

    $response->assertForbidden();
});

test('seo-suggestions validates required fields', function () {
    $response = $this->postJson('/api/ai/seo-suggestions', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['site_uuid', 'page_slug']);
});

test('generate-text returns 402 when insufficient tokens', function () {
    AiTokenBalance::create(['user_id' => $this->user->id, 'balance' => 50]);

    $this->mock(OpenAiService::class);

    $response = $this->postJson('/api/ai/generate-text', [
        'context' => 'Short text',
        'prompt_template' => 'expand',
    ]);

    $response->assertStatus(402);
});

test('generate-text returns generated text when successful', function () {
    AiTokenBalance::create(['user_id' => $this->user->id, 'balance' => 1000]);

    $this->mock(OpenAiService::class, function ($mock) {
        $mock->shouldReceive('generateText')
            ->once()
            ->andReturn('Expanded professional text.');
        $mock->shouldReceive('estimateTokens')
            ->andReturn(100);
    });

    $response = $this->postJson('/api/ai/generate-text', [
        'context' => 'Short text',
        'prompt_template' => 'expand',
    ]);

    $response->assertOk();
    $response->assertJson(['text' => 'Expanded professional text.']);
});

test('generate-text validates required fields', function () {
    $response = $this->postJson('/api/ai/generate-text', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['context', 'prompt_template']);
});

test('generate-text validates prompt_template enum', function () {
    $response = $this->postJson('/api/ai/generate-text', [
        'context' => 'Text',
        'prompt_template' => 'invalid',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['prompt_template']);
});
