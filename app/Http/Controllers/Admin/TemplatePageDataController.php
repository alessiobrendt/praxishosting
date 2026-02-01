<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\Template;
use App\Models\TemplatePage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplatePageDataController extends Controller
{
    public function edit(Template $template, TemplatePage $page): Response
    {
        $this->authorize('update', $template);

        return Inertia::render('admin/templates/pages/EditData', [
            'template' => $template->only(['id', 'name', 'slug']),
            'page' => $page,
        ]);
    }

    public function update(Request $request, Template $template, TemplatePage $page): RedirectResponse
    {
        $this->authorize('update', $template);

        // Handle both JSON string and array
        $data = $request->input('data');
        if (is_string($data)) {
            $data = json_decode($data, true);
        }

        $validated = $request->validate([
            'data' => ['required'],
        ]);

        $old = $page->data ?? [];
        $page->update(['data' => $data]);

        AdminActivityLog::log($request->user()->id, 'template_page_data_updated', TemplatePage::class, $page->id, ['data' => $old], ['data' => $data]);

        return to_route('admin.templates.pages.show', [$template, $page]);
    }
}
