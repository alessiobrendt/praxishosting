<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddCustomerBalanceRequest;
use App\Http\Requests\Admin\StoreCustomerNoteRequest;
use App\Http\Requests\Admin\UpdateCustomerRequest;
use App\Models\AdminActivityLog;
use App\Models\BalanceTransaction;
use App\Models\CustomerBalance;
use App\Models\CustomerNote;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function edit(User $customer): Response
    {
        return Inertia::render('admin/customers/Edit', [
            'customer' => $customer->only(['id', 'name', 'email', 'company', 'street', 'postal_code', 'city', 'country']),
            'countries' => config('countries', []),
        ]);
    }

    public function update(UpdateCustomerRequest $request, User $customer): RedirectResponse
    {
        $old = $customer->only(['name', 'email', 'company', 'street', 'postal_code', 'city', 'country']);
        $customer->update($request->validated());

        AdminActivityLog::log(
            $request->user()->id,
            'customer_updated',
            User::class,
            $customer->id,
            $old,
            $request->validated(),
        );

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Stammdaten gespeichert.');
    }

    public function storeNote(StoreCustomerNoteRequest $request, User $customer): RedirectResponse
    {
        CustomerNote::create([
            'user_id' => $customer->id,
            'admin_id' => $request->user()->id,
            'body' => $request->validated('body'),
        ]);

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Notiz gespeichert.');
    }

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
        $customer->load([
            'sites.template',
            'customerBalance',
            'balanceTransactions' => fn ($q) => $q->latest()->limit(20),
            'customerNotes' => fn ($q) => $q->with('admin:id,name')->latest()->limit(50),
        ]);

        $customerArray = $customer->toArray();
        if (! empty($customerArray['balance_transactions'] ?? [])) {
            foreach ($customerArray['balance_transactions'] as &$tx) {
                if (! empty($tx['created_at'] ?? null)) {
                    $tx['created_at'] = Carbon::parse($tx['created_at'])->format('d.m.Y H:i');
                }
            }
        }
        if (! empty($customerArray['customer_notes'] ?? [])) {
            foreach ($customerArray['customer_notes'] as &$note) {
                if (! empty($note['created_at'] ?? null)) {
                    $note['created_at'] = Carbon::parse($note['created_at'])->format('d.m.Y H:i');
                }
            }
        }

        $activityLog = AdminActivityLog::query()
            ->where('model_type', User::class)
            ->where('model_id', $customer->id)
            ->with('user:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($log) => array_merge($log->toArray(), [
                'created_at' => $log->created_at->format('d.m.Y H:i'),
            ]));

        return Inertia::render('admin/customers/Show', [
            'customer' => $customerArray,
            'activityLog' => $activityLog,
        ]);
    }

    public function storeBalance(AddCustomerBalanceRequest $request, User $customer): RedirectResponse
    {
        $amount = (float) $request->validated('amount');
        $description = $request->validated('description') ?? 'Guthaben aufladen (Admin)';

        BalanceTransaction::create([
            'user_id' => $customer->id,
            'amount' => $amount,
            'type' => 'admin_credit',
            'description' => $description,
            'reference_type' => User::class,
            'reference_id' => $request->user()->id,
        ]);

        $balance = CustomerBalance::firstOrCreate(
            ['user_id' => $customer->id],
            ['balance' => 0]
        );
        $balance->increment('balance', $amount);

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Guthaben aufgeladen.');
    }
}
