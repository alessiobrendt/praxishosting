<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvoiceDunningLetter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DunningLetterController extends Controller
{
    public function index(Request $request): Response
    {
        $dunningLetters = InvoiceDunningLetter::query()
            ->with(['invoice:id,number,user_id', 'invoice.user:id,name,email'])
            ->latest('sent_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (InvoiceDunningLetter $d) => array_merge($d->toArray(), [
                'sent_at' => $d->sent_at?->format('d.m.Y'),
            ]));

        return Inertia::render('admin/dunning-letters/Index', [
            'dunningLetters' => $dunningLetters,
        ]);
    }
}
