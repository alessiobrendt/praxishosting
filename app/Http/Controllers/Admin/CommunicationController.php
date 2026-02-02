<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreReminderRequest;
use App\Models\AdminActivityLog;
use App\Models\Invoice;
use App\Models\InvoiceDunningLetter;
use App\Models\Reminder;
use App\Models\Site;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from'))->startOfDay() : null;
        $to = $request->query('to') ? Carbon::parse($request->query('to'))->endOfDay() : null;
        $type = $request->query('type'); // dunning | payment_reminder | subscription_ending | ...

        $dunningQuery = InvoiceDunningLetter::query()
            ->with(['invoice:id,number,user_id', 'invoice.user:id,name,email'])
            ->latest('sent_at');
        if ($from) {
            $dunningQuery->where('sent_at', '>=', $from);
        }
        if ($to) {
            $dunningQuery->where('sent_at', '<=', $to);
        }
        $dunningItems = $type && $type !== 'dunning' ? collect() : $dunningQuery->get();

        $reminderQuery = Reminder::query()
            ->with(['subject', 'creator:id,name'])
            ->latest('sent_at');
        if ($from) {
            $reminderQuery->where('sent_at', '>=', $from);
        }
        if ($to) {
            $reminderQuery->where('sent_at', '<=', $to);
        }
        if ($type && $type !== 'dunning') {
            $reminderQuery->where('type', $type);
        }
        $reminderItems = $reminderQuery->get();

        $rows = collect();
        foreach ($dunningItems as $d) {
            $rows->push([
                'source' => 'dunning',
                'id' => 'd-'.$d->id,
                'sent_at' => $d->sent_at?->format('Y-m-d H:i'),
                'sent_at_formatted' => $d->sent_at?->format('d.m.Y H:i'),
                'type' => 'dunning',
                'type_label' => $d->level.'. Mahnung',
                'subject_type' => 'Invoice',
                'subject_id' => $d->invoice_id,
                'subject_display' => $d->invoice?->number ?? '#'.$d->invoice_id,
                'subject_link' => $d->invoice_id ? route('admin.invoices.show', $d->invoice_id) : null,
                'customer_name' => $d->invoice?->user?->name ?? '–',
                'note' => null,
                'created_by_name' => null,
            ]);
        }
        foreach ($reminderItems as $r) {
            $subjectDisplay = class_basename($r->subject_type).' #'.($r->subject_id ?? '');
            $subjectLink = null;
            if ($r->subject_type === Invoice::class && $r->subject_id) {
                $subjectLink = route('admin.invoices.show', $r->subject_id);
                $inv = Invoice::find($r->subject_id);
                $subjectDisplay = $inv?->number ?? $subjectDisplay;
            }
            if ($r->subject_type === Site::class && $r->subject_id) {
                $site = Site::find($r->subject_id);
                $subjectLink = $site ? route('admin.sites.show', $site->uuid) : '#';
                $subjectDisplay = $site?->name ?? $subjectDisplay;
            }
            if ($r->subject_type === User::class && $r->subject_id) {
                $subjectLink = route('admin.customers.show', $r->subject_id);
                $user = User::find($r->subject_id);
                $subjectDisplay = $user?->name ?? $subjectDisplay;
            }
            $customerName = '–';
            if ($r->subject_type === Invoice::class && $r->subject_id) {
                $inv = Invoice::with('user')->find($r->subject_id);
                $customerName = $inv?->user?->name ?? '–';
            }
            if ($r->subject_type === User::class && $r->subject_id) {
                $customerName = User::find($r->subject_id)?->name ?? '–';
            }

            $rows->push([
                'source' => 'reminder',
                'id' => 'r-'.$r->id,
                'sent_at' => $r->sent_at?->format('Y-m-d H:i'),
                'sent_at_formatted' => $r->sent_at?->format('d.m.Y H:i'),
                'type' => $r->type,
                'type_label' => Reminder::typeLabels()[$r->type] ?? $r->type,
                'subject_type' => $r->subject_type,
                'subject_id' => $r->subject_id,
                'subject_display' => $subjectDisplay,
                'subject_link' => $subjectLink,
                'customer_name' => $customerName,
                'note' => $r->note,
                'created_by_name' => $r->creator?->name ?? '–',
            ]);
        }

        $rows = $rows->sortByDesc(fn ($row) => $row['sent_at'])->values();
        $page = (int) $request->query('page', 1);
        $perPage = 20;
        $total = $rows->count();
        $communications = new LengthAwarePaginator(
            $rows->forPage($page, $perPage)->values(),
            $total,
            $perPage,
            $page,
            ['path' => route('admin.communications.index')]
        );
        $communications->appends($request->query());

        return Inertia::render('admin/communications/Index', [
            'communications' => $communications,
            'typeLabels' => array_merge(['dunning' => 'Mahnung'], Reminder::typeLabels()),
            'filters' => [
                'from' => $request->query('from'),
                'to' => $request->query('to'),
                'type' => $request->query('type'),
            ],
        ]);
    }

    public function create(): Response
    {
        $invoices = Invoice::query()
            ->with('user:id,name')
            ->latest('invoice_date')
            ->limit(200)
            ->get(['id', 'number', 'user_id'])
            ->map(fn (Invoice $i) => [
                'id' => $i->id,
                'label' => $i->number.' ('.($i->user?->name ?? '–').')',
            ]);
        $sites = Site::query()
            ->orderBy('name')
            ->limit(200)
            ->get(['id', 'name'])
            ->map(fn (Site $s) => ['id' => $s->id, 'label' => $s->name]);
        $users = User::query()
            ->orderBy('name')
            ->limit(200)
            ->get(['id', 'name'])
            ->map(fn (User $u) => ['id' => $u->id, 'label' => $u->name]);

        return Inertia::render('admin/communications/Create', [
            'typeLabels' => Reminder::typeLabels(),
            'invoices' => $invoices,
            'sites' => $sites,
            'users' => $users,
        ]);
    }

    public function store(StoreReminderRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $reminder = Reminder::create([
            'type' => $data['type'],
            'subject_type' => 'App\\Models\\'.$data['subject_type'],
            'subject_id' => $data['subject_id'],
            'sent_at' => Carbon::parse($data['sent_at']),
            'created_by' => $request->user()->id,
            'note' => $data['note'] ?? null,
        ]);

        AdminActivityLog::log($request->user()->id, 'communication_created', Reminder::class, $reminder->id, null, ['type' => $reminder->type]);

        return redirect()->route('admin.communications.index')->with('success', 'Erinnerung erfasst.');
    }
}
