<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketPriorityRequest;
use App\Http\Requests\Admin\UpdateTicketPriorityRequest;
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

        TicketPriority::create($validated);

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

        $ticketPriority->update($validated);

        return redirect()->route('admin.ticket-priorities.index')->with('success', 'Priorität aktualisiert.');
    }

    public function destroy(TicketPriority $ticketPriority): RedirectResponse
    {
        $ticketPriority->delete();

        return redirect()->route('admin.ticket-priorities.index')->with('success', 'Priorität gelöscht.');
    }
}
