<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketMessageTemplateRequest;
use App\Http\Requests\Admin\UpdateTicketMessageTemplateRequest;
use App\Models\AdminActivityLog;
use App\Models\TicketMessageTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TicketMessageTemplateController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/ticket-message-templates/Create');
    }

    public function store(StoreTicketMessageTemplateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $template = TicketMessageTemplate::create($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_message_template_created', TicketMessageTemplate::class, $template->id, null, $validated);

        return redirect()->route('admin.settings.index', ['tab' => 'vorlagen'])->with('success', 'Vorlage angelegt.');
    }

    public function edit(TicketMessageTemplate $ticket_message_template): Response
    {
        return Inertia::render('admin/ticket-message-templates/Edit', [
            'template' => $ticket_message_template,
        ]);
    }

    public function update(UpdateTicketMessageTemplateRequest $request, TicketMessageTemplate $ticket_message_template): RedirectResponse
    {
        $validated = $request->validated();
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $old = $ticket_message_template->only(array_keys($validated));
        $ticket_message_template->update($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_message_template_updated', TicketMessageTemplate::class, $ticket_message_template->id, $old, $validated);

        return redirect()->route('admin.settings.index', ['tab' => 'vorlagen'])->with('success', 'Vorlage aktualisiert.');
    }

    public function destroy(TicketMessageTemplate $ticket_message_template): RedirectResponse
    {
        $old = $ticket_message_template->only(['name', 'body', 'sort_order']);
        $ticket_message_template->delete();

        AdminActivityLog::log(request()->user()->id, 'ticket_message_template_deleted', TicketMessageTemplate::class, $ticket_message_template->id, $old, null);

        return redirect()->route('admin.settings.index', ['tab' => 'vorlagen'])->with('success', 'Vorlage gelöscht.');
    }
}
