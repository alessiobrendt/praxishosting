<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateDesignController extends Controller
{
    public function design(Template $template): Response
    {
        $this->authorize('update', $template);

        $template->load('pages');

        return Inertia::render('PageDesigner/PageDesigner', [
            'mode' => 'template',
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'pages' => $template->pages->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'order' => $p->order,
                    'data' => $p->data ?? [],
                ])->values()->all(),
            ],
            'baseDomain' => \App\Models\Setting::getBaseDomain(),
        ]);
    }

    public function update(Request $request, Template $template): JsonResponse|RedirectResponse
    {
        $this->authorize('update', $template);

        $validated = $request->validate([
            'page_slug' => ['required', 'string', 'max:255'],
            'data' => ['required', 'array'],
            'data.layout_components' => ['nullable', 'array'],
            'data.colors' => ['nullable', 'array'],
        ]);

        $page = $template->pages()->where('slug', $validated['page_slug'])->first();

        if (! $page) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Page not found for this template.'], 422)
                : back()->withErrors(['page_slug' => 'Page not found for this template.']);
        }

        $data = $page->data ?? [];
        $data['layout_components'] = $validated['data']['layout_components'] ?? $data['layout_components'] ?? [];
        if (isset($validated['data']['colors'])) {
            $data['colors'] = $validated['data']['colors'];
        }
        $oldData = $page->data ?? [];
        $page->update(['data' => $data]);

        AdminActivityLog::log($request->user()->id, 'template_design_updated', Template::class, $template->id, ['page_slug' => $validated['page_slug'], 'data' => $oldData], ['page_slug' => $validated['page_slug'], 'data' => $data]);

        return $request->expectsJson()
            ? response()->json(['ok' => true])
            : back();
    }
}
