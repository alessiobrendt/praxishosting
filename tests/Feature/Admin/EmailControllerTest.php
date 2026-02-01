<?php

use App\Models\EmailTemplate;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('guests cannot access admin emails', function () {
    $response = $this->get(route('admin.emails.index'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot access admin emails', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->get(route('admin.emails.index'));
    $response->assertForbidden();
});

test('admin users can view email templates index', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->get(route('admin.emails.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/emails/Index')
        ->has('templates', 6)
    );
});

test('admin users can view email template edit', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = EmailTemplate::find('order_completed');
    $this->actingAs($user);

    $response = $this->get(route('admin.emails.edit', $template));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/emails/Edit')
        ->where('emailTemplate.key', 'order_completed')
        ->has('placeholders')
    );
});

test('admin users can update email template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = EmailTemplate::find('order_completed');
    $this->actingAs($user);

    $response = $this->put(route('admin.emails.update', $template), [
        'subject' => 'Geänderter Betreff',
        'greeting' => 'Hallo :user_name,',
        'body' => "Ihre Bestellung wurde erfolgreich abgeschlossen.\nIhre Webseite **:site_name** wurde eingerichtet.\nVielen Dank für Ihr Vertrauen.",
        'action_text' => 'Zur Webseite',
    ]);
    $response->assertRedirect(route('admin.emails.index'));
    $template->refresh();
    expect($template->subject)->toBe('Geänderter Betreff');
});

test('non-admin users cannot update email template', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $template = EmailTemplate::find('order_completed');
    $this->actingAs($user);

    $response = $this->put(route('admin.emails.update', $template), [
        'subject' => 'Geänderter Betreff',
        'greeting' => 'Hallo :user_name,',
        'body' => 'Body',
        'action_text' => 'Button',
    ]);
    $response->assertForbidden();
});

test('admin users can preview email template with sample data', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = EmailTemplate::find('order_completed');
    $this->actingAs($user);

    $response = $this->postJson(route('admin.emails.preview', $template), [
        'subject' => $template->subject,
        'greeting' => $template->greeting,
        'body' => $template->body,
        'action_text' => $template->action_text,
    ]);
    $response->assertOk();
    $response->assertJsonStructure(['subject', 'greeting', 'body', 'action_text']);
    expect($response->json('subject'))->toBe('Ihre Bestellung wurde abgeschlossen');
    expect($response->json('greeting'))->toContain('Max Mustermann');
    expect($response->json('body'))->toContain('Meine Beispiel-Webseite');
});

test('admin users can send test email', function () {
    Mail::fake();
    $user = User::factory()->create(['is_admin' => true, 'email' => 'admin@example.com']);
    $template = EmailTemplate::find('order_completed');
    $this->actingAs($user);

    $response = $this->post(route('admin.emails.send-test', $template));
    $response->assertRedirect();
    Mail::assertSent(\App\Mail\EmailTemplateTestMail::class, function ($mail) {
        return $mail->hasTo('admin@example.com');
    });
});
