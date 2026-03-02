<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketCategoryRequest;
use App\Http\Requests\Admin\UpdateTicketCategoryRequest;
use App\Models\AdminActivityLog;
use App\Models\TicketCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TicketCategoryController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.settings.index', ['tab' => 'support']);
    }

    public function create(): Response
    {
        return Inertia::render('admin/ticket-categories/Create');
    }

    public function store(StoreTicketCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $ticketCategory = TicketCategory::create($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_category_created', TicketCategory::class, $ticketCategory->id, null, $validated);

        return redirect()->route('admin.settings.index', ['tab' => 'support'])->with('success', 'Kategorie angelegt.');
    }

    public function edit(TicketCategory $ticketCategory): Response
    {
        return Inertia::render('admin/ticket-categories/Edit', [
            'ticketCategory' => $ticketCategory,
        ]);
    }

    public function update(UpdateTicketCategoryRequest $request, TicketCategory $ticketCategory): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $old = $ticketCategory->only(array_keys($validated));
        $ticketCategory->update($validated);

        AdminActivityLog::log($request->user()->id, 'ticket_category_updated', TicketCategory::class, $ticketCategory->id, $old, $validated);

        return redirect()->route('admin.settings.index', ['tab' => 'support'])->with('success', 'Kategorie aktualisiert.');
    }

    public function destroy(TicketCategory $ticketCategory): RedirectResponse
    {
        $old = $ticketCategory->only(['name', 'slug', 'is_active', 'sort_order']);
        $ticketCategory->delete();

        AdminActivityLog::log(request()->user()->id, 'ticket_category_deleted', TicketCategory::class, $ticketCategory->id, $old, null);

        return redirect()->route('admin.settings.index', ['tab' => 'support'])->with('success', 'Kategorie gelöscht.');
    }
}
