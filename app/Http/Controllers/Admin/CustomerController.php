<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::query()
            ->withCount('sites')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function show(User $customer): Response
    {
        $customer->load(['sites.template']);

        return Inertia::render('admin/customers/Show', [
            'customer' => $customer,
        ]);
    }
}
