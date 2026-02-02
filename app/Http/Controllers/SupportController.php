<?php

namespace App\Http\Controllers;

use App\Http\Requests\Support\StoreSupportMessageRequest;
use App\Http\Requests\Support\StoreSupportTicketRequest;
use App\Models\Setting;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketMessage;
use App\Models\TicketPriority;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if (! $this->isSupportEnabled()) {
            return redirect()->route('dashboard')->with('error', 'Support-Tickets sind derzeit deaktiviert.');
        }
        $tickets = $request->user()
            ->tickets()
            ->with(['ticketCategory', 'ticketPriority', 'site:uuid,name,slug'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('support/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        if (! $this->isSupportEnabled()) {
            return redirect()->route('support.index')->with('error', 'Support-Tickets sind derzeit deaktiviert.');
        }
        $user = $this->user();
        $sites = $user->sites()->orderBy('name')->get(['uuid', 'name', 'slug']);
        $categories = TicketCategory::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $priorities = TicketPriority::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'color']);

        return Inertia::render('support/Create', [
            'sites' => $sites,
            'categories' => $categories,
            'priorities' => $priorities,
        ]);
    }

    public function store(StoreSupportTicketRequest $request): RedirectResponse
    {
        if (! $this->isSupportEnabled()) {
            return redirect()->route('support.index')->with('error', 'Support-Tickets sind derzeit deaktiviert.');
        }
        $maxOpen = (int) (Setting::get('support_max_open_tickets_per_user') ?: 0);
        if ($maxOpen > 0) {
            $openCount = $request->user()->tickets()->whereIn('status', ['open', 'in_progress', 'waiting_customer'])->count();
            if ($openCount >= $maxOpen) {
                return redirect()->route('support.create')->with('error', 'Sie haben die maximale Anzahl offener Tickets erreicht.');
            }
        }
        $validated = $request->validated();
        $siteId = null;
        if (! empty($validated['site_uuid'] ?? null)) {
            $siteId = \App\Models\Site::where('uuid', $validated['site_uuid'])->value('id');
        }
        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'site_id' => $siteId,
            'ticket_category_id' => $validated['ticket_category_id'],
            'ticket_priority_id' => $validated['ticket_priority_id'] ?? null,
            'subject' => $validated['subject'],
            'status' => 'open',
        ]);
        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'is_internal' => false,
        ]);

        return redirect()->route('support.show', $ticket)->with('success', 'Ticket wurde erstellt.');
    }

    public function show(Request $request, Ticket $ticket): Response|RedirectResponse
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'ticketCategory',
            'ticketPriority',
            'site:id,name,slug',
            'messages' => fn ($q) => $q->with('user:id,name')->orderBy('created_at'),
        ]);
        $messages = $ticket->messages->map(function ($msg) use ($request) {
            $arr = $msg->toArray();
            if ($msg->is_internal && ! $request->user()?->isAdmin()) {
                $arr['body'] = null;
                $arr['is_hidden'] = true;
            }

            return $arr;
        });

        return Inertia::render('support/Show', [
            'ticket' => $ticket->only(['id', 'subject', 'status', 'created_at', 'ticket_category_id', 'ticket_priority_id', 'site_id']),
            'ticketCategory' => $ticket->ticketCategory?->only(['id', 'name', 'slug']),
            'ticketPriority' => $ticket->ticketPriority?->only(['id', 'name', 'slug', 'color']),
            'site' => $ticket->site?->only(['uuid', 'name', 'slug']),
            'messages' => $messages,
        ]);
    }

    public function storeMessage(StoreSupportMessageRequest $request, Ticket $ticket): RedirectResponse
    {
        $this->authorize('view', $ticket);
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
            'is_internal' => false,
        ]);
        $ticket->update(['status' => 'in_progress']);

        return redirect()->route('support.show', $ticket)->with('success', 'Nachricht gesendet.');
    }

    private function user()
    {
        return request()->user();
    }

    private function isSupportEnabled(): bool
    {
        return (bool) filter_var(Setting::get('support_enabled', '1'), FILTER_VALIDATE_BOOLEAN);
    }
}
