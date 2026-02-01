<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketPriorityRequest;
use App\Http\Requests\Admin\UpdateTicketPriorityRequest;
use App\Models\AdminActivityLog;
use App\Models\TicketPriority;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TicketPriorityController extends Controller
{
    public function index(): Response
    {
        $ticketPriorities = TicketPriority::query()
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/ticket-priorities/Index', [
            'ticketPriorities' => $ticketPriorities,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/ticket-priorities/Create');
    }

    public function store(StoreTicketPriorityRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $ticketPriority = TicketPriority::create($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_priority_created', TicketPriority::class, $ticketPriority->id, null, $validated);

        return redirect()->route('admin.ticket-priorities.index')->with('success', 'Priorität angelegt.');
    }

    public function edit(TicketPriority $ticketPriority): Response
    {
        return Inertia::render('admin/ticket-priorities/Edit', [
            'ticketPriority' => $ticketPriority,
        ]);
    }

    public function update(UpdateTicketPriorityRequest $request, TicketPriority $ticketPriority): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $old = $ticketPriority->only(array_keys($validated));
        $ticketPriority->update($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_priority_updated', TicketPriority::class, $ticketPriority->id, $old, $validated);

        return redirect()->route('admin.ticket-priorities.index')->with('success', 'Priorität aktualisiert.');
    }

    public function destroy(TicketPriority $ticketPriority): RedirectResponse
    {
        $old = $ticketPriority->only(['name', 'slug', 'color', 'is_active', 'sort_order']);
        $ticketPriority->delete();

        AdminActivityLog::log(request()->user()->id, 'ticket_priority_deleted', TicketPriority::class, $ticketPriority->id, $old, null);

        return redirect()->route('admin.ticket-priorities.index')->with('success', 'Priorität gelöscht.');
    }
}
