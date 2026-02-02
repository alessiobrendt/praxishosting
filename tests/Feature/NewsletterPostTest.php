<?php

use App\Jobs\SendNewsletterPostJob;
use App\Models\NewsletterPost;
use App\Models\Site;
use App\Models\Template;
use App\Models\TemplatePage;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $template = Template::factory()->create();
    TemplatePage::factory()->create([
        'template_id' => $template->id,
        'slug' => 'index',
        'order' => 0,
        'data' => [
            'layout_components' => [
                ['id' => 'lc_1', 'type' => 'newsletter', 'data' => []],
            ],
        ],
    ]);
    $this->user = User::factory()->create();
    $this->site = Site::factory()->create([
        'template_id' => $template->id,
        'user_id' => $this->user->id,
        'status' => 'active',
    ]);
});

test('newsletter post draft can be saved', function () {
    $response = $this->actingAs($this->user)->post("/modules/newsletter/sites/{$this->site->uuid}/posts", [
        'subject' => 'Test News',
        'body' => 'Test body content',
        'action' => 'save_draft',
        '_token' => csrf_token(),
    ]);

    $response->assertRedirect(route('modules.newsletter.site', ['site' => $this->site->uuid]));
    $this->assertDatabaseHas('newsletter_posts', [
        'site_id' => $this->site->id,
        'subject' => 'Test News',
        'body' => 'Test body content',
        'status' => 'draft',
    ]);
});

test('newsletter post send creates post and dispatches job', function () {
    Queue::fake();

    $response = $this->actingAs($this->user)->post("/modules/newsletter/sites/{$this->site->uuid}/posts", [
        'subject' => 'Newsletter Send',
        'body' => 'News content',
        'action' => 'send',
        '_token' => csrf_token(),
    ]);

    $response->assertRedirect(route('modules.newsletter.site', ['site' => $this->site->uuid]));

    $post = NewsletterPost::where('site_id', $this->site->id)->first();
    expect($post)->not->toBeNull();
    expect($post->subject)->toBe('Newsletter Send');
    expect($post->status)->toBe('draft');

    Queue::assertPushed(SendNewsletterPostJob::class, fn ($job) => $job->post->id === $post->id);
});
