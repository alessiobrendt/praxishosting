<?php

use App\Http\Middleware\EnsureAdminDomainForAdminRoutes;
use App\Models\TicketMessageTemplate;
use App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(EnsureAdminDomainForAdminRoutes::class);
});

test('guests cannot access ticket message template create', function () {
    $response = $this->get(route('admin.ticket-message-templates.create'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot create ticket message template', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $this->actingAs($user);

    $response = $this->post(route('admin.ticket-message-templates.store'), [
        'name' => 'Test',
        'body' => 'Hallo {{name}}',
        'sort_order' => 0,
    ]);
    $response->assertForbidden();
});

test('admin users can create ticket message template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $this->actingAs($user);

    $response = $this->post(route('admin.ticket-message-templates.store'), [
        'name' => 'Begrüßung',
        'body' => 'Hallo {{name}}, vielen Dank für Ihre Anfrage.',
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.settings.index', ['tab' => 'vorlagen']));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('ticket_message_templates', [
        'name' => 'Begrüßung',
        'body' => 'Hallo {{name}}, vielen Dank für Ihre Anfrage.',
        'sort_order' => 1,
    ]);
});

test('admin users can update ticket message template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = TicketMessageTemplate::create([
        'name' => 'Alt',
        'body' => 'Alter Inhalt',
        'sort_order' => 0,
    ]);
    $this->actingAs($user);

    $response = $this->put(route('admin.ticket-message-templates.update', $template), [
        'name' => 'Aktualisiert',
        'body' => 'Neuer Inhalt mit {{email}}',
        'sort_order' => 2,
    ]);

    $response->assertRedirect(route('admin.settings.index', ['tab' => 'vorlagen']));
    $response->assertSessionHas('success');
    $template->refresh();
    expect($template->name)->toBe('Aktualisiert');
    expect($template->body)->toBe('Neuer Inhalt mit {{email}}');
    expect($template->sort_order)->toBe(2);
});

test('admin users can delete ticket message template', function () {
    $user = User::factory()->create(['is_admin' => true]);
    $template = TicketMessageTemplate::create([
        'name' => 'Zum Löschen',
        'body' => null,
        'sort_order' => 0,
    ]);
    $this->actingAs($user);

    $response = $this->delete(route('admin.ticket-message-templates.destroy', $template));

    $response->assertRedirect(route('admin.settings.index', ['tab' => 'vorlagen']));
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('ticket_message_templates', ['id' => $template->id]);
});

test('admin settings index includes ticket message templates', function () {
    $user = User::factory()->create(['is_admin' => true]);
    TicketMessageTemplate::create(['name' => 'T1', 'body' => 'Body 1', 'sort_order' => 0]);
    $this->actingAs($user);

    $response = $this->get(route('admin.settings.index', ['tab' => 'vorlagen']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/settings/Index')
        ->has('ticketMessageTemplates')
        ->where('ticketMessageTemplates.0.name', 'T1')
    );
});
