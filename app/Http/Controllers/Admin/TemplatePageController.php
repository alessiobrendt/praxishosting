<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTemplatePageRequest;
use App\Http\Requests\Admin\UpdateTemplatePageRequest;
use App\Models\Template;
use App\Models\TemplatePage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplatePageController extends Controller
{
    public function index(Request $request, Template $template): Response
    {
        $this->authorize('view', $template);

        $pages = $template->pages()->orderBy('order')->get();

        return Inertia::render('admin/templates/pages/Index', [
            'template' => $template->only(['id', 'name', 'slug']),
            'pages' => $pages,
        ]);
    }

    public function create(Template $template): Response
    {
        $this->authorize('update', $template);

        return Inertia::render('admin/templates/pages/Create', [
            'template' => $template->only(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreTemplatePageRequest $request, Template $template): RedirectResponse
    {
        $template->pages()->create($request->validated());

        return to_route('admin.templates.pages.index', $template);
    }

    public function show(Template $template, TemplatePage $page): Response
    {
        $this->authorize('view', $template);

        return Inertia::render('admin/templates/pages/Show', [
            'template' => $template->only(['id', 'name', 'slug']),
            'page' => $page,
        ]);
    }

    public function edit(Template $template, TemplatePage $page): Response
    {
        $this->authorize('update', $template);

        return Inertia::render('admin/templates/pages/Edit', [
            'template' => $template->only(['id', 'name', 'slug']),
            'page' => $page,
        ]);
    }

    public function update(
        UpdateTemplatePageRequest $request,
        Template $template,
        TemplatePage $page
    ): RedirectResponse {
        $validated = $request->validated();
        
        \Log::info('Updating TemplatePage', [
            'page_id' => $page->id,
            'validated_data' => $validated,
        ]);
        
        $page->update($validated);

        return to_route('admin.templates.pages.show', [$template, $page]);
    }

    public function destroy(Template $template, TemplatePage $page): RedirectResponse
    {
        $this->authorize('update', $template);

        $page->delete();

        return to_route('admin.templates.pages.index', $template);
    }
}
