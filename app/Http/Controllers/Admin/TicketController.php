<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MergeTicketRequest;
use App\Http\Requests\Admin\StoreTicketMessageRequest;
use App\Http\Requests\Admin\StoreTicketTimeLogRequest;
use App\Http\Requests\Admin\StoreTicketTodoRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
use App\Http\Requests\Admin\UpdateTicketTodoRequest;
use App\Models\AdminActivityLog;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\TicketTimeLog;
use App\Models\TicketTodo;
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
            'site:uuid,name,slug',
            'assignedTo:id,name',
            'tags:id,name,slug,color',
            'timeLogs' => fn ($q) => $q->with('user:id,name')->orderBy('logged_at', 'desc'),
            'todos' => fn ($q) => $q->orderBy('sort_order')->orderBy('id'),
            'messages' => fn ($q) => $q->with('user:id,name,is_admin')->orderBy('created_at'),
        ]);
        $lastMessage = $ticket->messages->last();
        $lastMessageFromCustomer = $lastMessage !== null && ! $lastMessage->user?->is_admin;
        $categories = \App\Models\TicketCategory::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $priorities = \App\Models\TicketPriority::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'color']);
        $admins = User::query()->where('is_admin', true)->orderBy('name')->get(['id', 'name']);
        $customerSites = $ticket->user->sites()->orderBy('name')->get(['uuid', 'name', 'slug']);
        $recentTickets = Ticket::query()
            ->where('user_id', $ticket->user_id)
            ->where('id', '!=', $ticket->id)
            ->latest()
            ->limit(5)
            ->get(['id', 'subject', 'status', 'created_at']);
        $allTags = \App\Models\Tag::query()->orderBy('name')->get(['id', 'name', 'slug', 'color']);

        return Inertia::render('admin/tickets/Show', [
            'ticket' => $ticket,
            'categories' => $categories,
            'priorities' => $priorities,
            'admins' => $admins,
            'customerSites' => $customerSites,
            'recentTickets' => $recentTickets,
            'lastMessageFromCustomer' => $lastMessageFromCustomer,
            'allTags' => $allTags,
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();
        $allowed = ['status', 'ticket_category_id', 'ticket_priority_id', 'assigned_to', 'site_id', 'due_at'];
        $update = array_intersect_key($validated, array_flip($allowed));
        if (isset($validated['site_uuid'])) {
            $update['site_id'] = $validated['site_uuid']
                ? \App\Models\Site::where('uuid', $validated['site_uuid'])->value('id')
                : null;
        }
        if (array_key_exists('due_at', $update) && $update['due_at'] === '') {
            $update['due_at'] = null;
        }
        $old = array_intersect_key($ticket->getOriginal(), array_flip($allowed));
        $ticket->update($update);
        if (array_key_exists('tag_ids', $validated)) {
            $ticket->tags()->sync($validated['tag_ids']);
        }
        $new = array_merge($update, array_key_exists('tag_ids', $validated) ? ['tag_ids' => $validated['tag_ids']] : []);

        AdminActivityLog::log($request->user()->id, 'ticket_updated', Ticket::class, $ticket->id, $old, $new);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'Ticket aktualisiert.');
    }

    public function storeMessage(StoreTicketMessageRequest $request, Ticket $ticket): RedirectResponse
    {
        $isInternal = $request->boolean('is_internal', false);
        $body = $request->validated('body');
        if (! $isInternal) {
            $signature = $request->user()->ticket_signature;
            if ($signature !== null && trim($signature) !== '') {
                $body = $body."\n\n--\n".trim($signature);
            }
        }
        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $body,
            'is_internal' => $isInternal,
        ]);
        if (! $isInternal) {
            $ticket->update(['status' => 'waiting_customer']);
        }

        AdminActivityLog::log($request->user()->id, 'ticket_message_stored', Ticket::class, $ticket->id, null, ['is_internal' => $isInternal]);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'Antwort gespeichert.');
    }

    public function storeTimeLog(StoreTicketTimeLogRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();
        TicketTimeLog::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'minutes' => (int) $validated['minutes'],
            'description' => $validated['description'] ?? null,
            'logged_at' => isset($validated['logged_at']) ? $validated['logged_at'] : now(),
        ]);

        AdminActivityLog::log($request->user()->id, 'ticket_time_log_added', Ticket::class, $ticket->id, null, ['minutes' => $validated['minutes']]);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'Zeiteintrag hinzugefügt.');
    }

    public function storeTodo(StoreTicketTodoRequest $request, Ticket $ticket): RedirectResponse
    {
        $maxSort = $ticket->todos()->max('sort_order') ?? 0;
        $todo = TicketTodo::create([
            'ticket_id' => $ticket->id,
            'created_by' => $request->user()->id,
            'title' => $request->validated('title'),
            'sort_order' => $maxSort + 1,
        ]);

        AdminActivityLog::log($request->user()->id, 'ticket_todo_added', TicketTodo::class, $todo->id, null, ['title' => $todo->title]);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'To-do hinzugefügt.');
    }

    public function updateTodo(UpdateTicketTodoRequest $request, Ticket $ticket, TicketTodo $todo): RedirectResponse
    {
        if ($todo->ticket_id !== $ticket->id) {
            abort(404);
        }
        $validated = $request->validated();
        $old = $todo->only(['title', 'is_done']);
        $todo->update(array_intersect_key($validated, array_flip(['title', 'is_done'])));

        AdminActivityLog::log($request->user()->id, 'ticket_todo_updated', TicketTodo::class, $todo->id, $old, $validated);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'To-do aktualisiert.');
    }

    public function destroyTodo(Ticket $ticket, TicketTodo $todo): RedirectResponse
    {
        if ($todo->ticket_id !== $ticket->id) {
            abort(404);
        }
        $old = $todo->only(['title', 'is_done']);
        $todo->delete();

        AdminActivityLog::log($request->user()->id, 'ticket_todo_deleted', TicketTodo::class, $todo->id, $old, null);

        return redirect()->route('admin.tickets.show', $ticket)->with('success', 'To-do gelöscht.');
    }

    public function merge(MergeTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $targetId = (int) $request->validated('target_ticket_id');
        $target = Ticket::findOrFail($targetId);

        if ($target->user_id !== $ticket->user_id) {
            return redirect()->route('admin.tickets.show', $ticket)->with('error', 'Ziel-Ticket muss dem gleichen Kunden gehören.');
        }

        $ticket->messages()->update(['ticket_id' => $targetId]);
        $ticket->update([
            'status' => 'closed',
            'subject' => $ticket->subject.' [Zusammengeführt in #'.$targetId.']',
        ]);

        AdminActivityLog::log($request->user()->id, 'ticket_merged', Ticket::class, $target->id, ['source_ticket_id' => $ticket->id], null);

        return redirect()->route('admin.tickets.show', $target)->with('success', 'Ticket wurde zusammengeführt.');
    }
}
