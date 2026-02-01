<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVoucherRequest;
use App\Http\Requests\Admin\UpdateVoucherRequest;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    public function index(Request $request): Response
    {
        $vouchers = Voucher::query()
            ->with('user:id,name,email')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/vouchers/Index', [
            'vouchers' => $vouchers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/vouchers/Create');
    }

    public function store(StoreVoucherRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);
        if (empty($validated['code'])) {
            $validated['code'] = Voucher::generateCode();
        }

        Voucher::create($validated);

        return redirect()->route('admin.vouchers.index')->with('success', 'Gutschein angelegt.');
    }

    public function edit(Voucher $voucher): Response
    {
        $voucher->load('user:id,name,email');

        return Inertia::render('admin/vouchers/Edit', [
            'voucher' => $voucher,
        ]);
    }

    public function update(UpdateVoucherRequest $request, Voucher $voucher): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);

        $voucher->update($validated);

        return redirect()->route('admin.vouchers.index')->with('success', 'Gutschein aktualisiert.');
    }
}
