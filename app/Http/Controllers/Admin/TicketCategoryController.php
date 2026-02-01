<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketCategoryRequest;
use App\Http\Requests\Admin\UpdateTicketCategoryRequest;
use App\Models\TicketCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TicketCategoryController extends Controller
{
    public function index(): Response
    {
        $ticketCategories = TicketCategory::query()
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/ticket-categories/Index', [
            'ticketCategories' => $ticketCategories,
        ]);
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

        TicketCategory::create($validated);

        return redirect()->route('admin.ticket-categories.index')->with('success', 'Kategorie angelegt.');
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

        $ticketCategory->update($validated);

        return redirect()->route('admin.ticket-categories.index')->with('success', 'Kategorie aktualisiert.');
    }

    public function destroy(TicketCategory $ticketCategory): RedirectResponse
    {
        $ticketCategory->delete();

        return redirect()->route('admin.ticket-categories.index')->with('success', 'Kategorie gelöscht.');
    }
}
