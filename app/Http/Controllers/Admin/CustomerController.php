<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddCustomerAiTokensRequest;
use App\Http\Requests\Admin\AddCustomerBalanceRequest;
use App\Http\Requests\Admin\StoreCustomerNoteRequest;
use App\Http\Requests\Admin\UpdateCustomerRequest;
use App\Models\AdminActivityLog;
use App\Models\AiTokenBalance;
use App\Models\AiTokenTransaction;
use App\Models\BalanceTransaction;
use App\Models\Brand;
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
        $userRanks = config('app.user_ranks', []);

        return Inertia::render('admin/customers/Edit', [
            'customer' => array_merge($customer->only(['id', 'name', 'email', 'company', 'street', 'postal_code', 'city', 'country', 'is_admin', 'rank']), [
                'brand_id' => $customer->brand_id,
                'brand' => $customer->brand ? ['id' => $customer->brand->id, 'key' => $customer->brand->key, 'name' => $customer->brand->name] : null,
            ]),
            'brands' => Brand::query()->orderBy('key')->get(['id', 'key', 'name']),
            'countries' => config('countries', []),
            'ranks' => collect($userRanks)->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])->values()->all(),
        ]);
    }

    public function update(UpdateCustomerRequest $request, User $customer): RedirectResponse
    {
        if ($request->input('brand_id') === '' || $request->input('brand_id') === null) {
            $request->merge(['brand_id' => null]);
        }
        if ($request->input('rank') === '') {
            $request->merge(['rank' => null]);
        }
        $old = $customer->only(['name', 'email', 'company', 'street', 'postal_code', 'city', 'country', 'brand_id', 'is_admin', 'rank']);
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

        AdminActivityLog::log($request->user()->id, 'customer_note_added', User::class, $customer->id, null, []);

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Notiz gespeichert.');
    }

    public function index(Request $request): Response
    {
        $customers = User::query()
            ->with('brand:id,key,name')
            ->withCount('sites')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function show(Request $request, User $customer): Response
    {
        $customer->load([
            'brand:id,key,name',
            'sites.template',
            'sites.siteSubscription',
            'customerBalance',
            'balanceTransactions' => fn ($q) => $q->latest()->limit(20),
            'customerNotes' => fn ($q) => $q->with('admin:id,name')->latest()->limit(50),
            'aiTokenBalance',
            'aiTokenTransactions' => fn ($q) => $q->latest()->limit(5),
            'invoices' => fn ($q) => $q->latest('invoice_date')->limit(15),
            'tickets' => fn ($q) => $q->with(['ticketCategory:id,name,slug', 'ticketPriority:id,name,slug,color', 'assignedTo:id,name'])->latest()->limit(10),
            'resellerDomains' => fn ($q) => $q->latest()->limit(15),
            'webspaceAccounts' => fn ($q) => $q->with(['hostingPlan:id,name', 'hostingServer:id,hostname'])->latest()->limit(15),
            'gameServerAccounts' => fn ($q) => $q->with(['hostingPlan:id,name', 'hostingServer:id,hostname'])->latest()->limit(15),
        ]);
        $customer->loadCount(['invoices', 'tickets', 'resellerDomains']);

        $customerArray = $customer->toArray();
        foreach ($customerArray['sites'] ?? [] as &$site) {
            unset($site['id']);
        }
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
        if (! empty($customerArray['invoices'] ?? [])) {
            foreach ($customerArray['invoices'] as &$inv) {
                if (! empty($inv['invoice_date'])) {
                    $inv['invoice_date'] = Carbon::parse($inv['invoice_date'])->format('d.m.Y');
                }
                if (! empty($inv['due_date'])) {
                    $inv['due_date'] = Carbon::parse($inv['due_date'])->format('d.m.Y');
                }
            }
        }
        if (! empty($customerArray['reseller_domains'] ?? [])) {
            foreach ($customerArray['reseller_domains'] as &$d) {
                if (! empty($d['expires_at'])) {
                    $d['expires_at'] = Carbon::parse($d['expires_at'])->format('d.m.Y');
                }
                if (! empty($d['registered_at'])) {
                    $d['registered_at'] = Carbon::parse($d['registered_at'])->format('d.m.Y');
                }
            }
        }

        $aiTokenBalance = AiTokenBalance::where('user_id', $customer->id)->first();
        $aiTokenTransactions = AiTokenTransaction::where('user_id', $customer->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($tx) => array_merge($tx->toArray(), [
                'created_at' => $tx->created_at->format('d.m.Y H:i'),
            ]));

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

        $currentUser = $request->user();

        return Inertia::render('admin/customers/Show', [
            'customer' => $customerArray,
            'activityLog' => $activityLog,
            'aiTokenBalance' => $aiTokenBalance?->balance ?? 0,
            'aiTokenTransactions' => $aiTokenTransactions,
            'can_impersonate' => $currentUser && $currentUser->canImpersonate(),
            'can_be_impersonated' => $customer->canBeImpersonated(),
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

        AdminActivityLog::log($request->user()->id, 'customer_balance_added', User::class, $customer->id, null, ['amount' => $amount, 'description' => $description]);

        return redirect()->route('admin.customers.show', $customer)->with('success', 'Guthaben aufgeladen.');
    }

    public function storeAiTokens(AddCustomerAiTokensRequest $request, User $customer): RedirectResponse
    {
        $amount = (int) $request->validated('amount');
        $description = $request->validated('description');

        app(\App\Services\AiTokenService::class)->addFromAdmin($customer, $amount, $description, $request->user());

        $action = $amount >= 0 ? 'hinzugefügt' : 'abgezogen';
        $msg = sprintf('AI-Tokens %s (%d).', $action, abs($amount));

        return redirect()->route('admin.customers.show', $customer)->with('success', $msg);
    }
}
