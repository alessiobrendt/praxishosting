<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTemplateRequest;
use App\Http\Requests\Admin\UpdateTemplateRequest;
use App\Models\Template;
use App\Services\SyncTemplateStripePriceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Template::class);

        $templates = Template::query()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Template::class);

        return Inertia::render('admin/templates/Create');
    }

    public function store(StoreTemplateRequest $request, SyncTemplateStripePriceService $syncStripePrice): RedirectResponse
    {
        $template = Template::query()->create(array_merge($request->validated(), ['is_active' => false]));
        $syncStripePrice->sync($template);

        return to_route('admin.templates.index');
    }

    public function show(Template $template): Response
    {
        $this->authorize('view', $template);

        $template->load('pages');

        return Inertia::render('admin/templates/Show', [
            'template' => $template,
        ]);
    }

    public function edit(Template $template): Response
    {
        $this->authorize('update', $template);

        // Ensure page_data is always an array (even if null)
        $pageData = $template->page_data ?? [];

        return Inertia::render('admin/templates/Edit', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'price' => $template->price,
                'is_active' => $template->is_active,
                'preview_image' => $template->preview_image,
                'page_data' => $pageData,
            ],
        ]);
    }

    public function update(UpdateTemplateRequest $request, Template $template, SyncTemplateStripePriceService $syncStripePrice): RedirectResponse
    {
        $template->update($request->validated());
        $syncStripePrice->sync($template);

        return to_route('admin.templates.show', $template);
    }

    public function destroy(Template $template): RedirectResponse
    {
        $this->authorize('delete', $template);

        $template->delete();

        return to_route('admin.templates.index');
    }
}
