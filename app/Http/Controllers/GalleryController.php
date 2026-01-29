<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $templates = Template::query()
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('gallery/Index', [
            'templates' => $templates,
        ]);
    }

    public function preview(Template $template): Response
    {
        if (! $template->is_active) {
            abort(404);
        }

        $template->load('pages');

        return Inertia::render('gallery/Preview', [
            'template' => $template,
        ]);
    }
}
