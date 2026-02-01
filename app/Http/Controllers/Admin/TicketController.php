<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketMessageRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Ticket::query()
            ->with(['user:id,name,email', 'ticketCategory:id,name,slug', 'ticketPriority:id,name,slug,color', 'site:id,name,slug', 'assignedTo:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('ticket_category_id')) {
            $query->where('ticket_category_id', $request->query('ticket_category_id'));
        }
        if ($request->filled('ticket_priority_id')) {
            $query->where('ticket_priority_id', $request->query('ticket_priority_id'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }
        if ($request->filled('site_id')) {
            $query->where('site_id', $request->query('site_id'));
        }
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->query('assigned_to'));
        }

        $tickets = $query->latest()->paginate(15)->withQueryString();

        $categories = \App\Models\TicketCategory::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $priorities = \App\Models\TicketPriority::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'color']);
        $admins = User::query()->where('is_admin', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/tickets/Index', [
            'tickets' => $tickets,
            'categories' => $categories,
            'priorities' => $priorities,
            'admins' => $admins,
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load([
            'user:id,name,email',
            'ticketCategory',
            'ticketPriority',
            'site:id,name,slug',
            'assignedTo:id,name',
            'messages' => fn ($q) => $q->with('user:id,name')->orderBy('created_at'),
        ]);
        $categories = \App\Models\TicketCategory::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $priorities = \App\Models\TicketPriority::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'color']);
        $admins = User::query()->where('is_admin', true)->orderBy('name')->get(['id', 'name']);
        $customerSites = $ticket->user->sites()->orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('admin/tickets/Show', [
            'ticket' => $ticket,
            'categories' => $categories,
            'priorities' => $priorities,
            'admins' => $admins,
            'customerSites' => $customerSites,
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();
        $allowed = ['status', 'ticket_category_id', 'ticket_priority_id', 'assigned_to', 'site_id'];
        $update = array_intersect_key($validated, array_flip($allowed));
        $ticket->update($update);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'Ticket aktualisiert.');
    }

    public function storeMessage(StoreTicketMessageRequest $request, Ticket $ticket): RedirectResponse
    {
        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
            'is_internal' => $request->boolean('is_internal', false),
        ]);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'Antwort gespeichert.');
    }
}
