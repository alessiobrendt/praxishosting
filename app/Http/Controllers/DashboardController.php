<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\GameServerAccount;
use App\Models\Invoice;
use App\Models\ResellerDomain;
use App\Models\Site;
use App\Models\TeamSpeakServerAccount;
use App\Models\Ticket;
use App\Models\UserEmailLog;
use App\Models\WebspaceAccount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
        $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];

        $stats = $this->buildStats($user, $brandFeatures);
        $status = $this->buildStatus($user, $brandFeatures);
        $favorites = $this->defaultFavorites($request);
        $activeServices = $this->activeServicesList($user, $request);
        $recentEmails = $this->recentEmails($user);
        $recentInvoices = $this->recentInvoices($user);

        $supportPinValidUntil = $user->getSupportPinValidUntil();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'status' => $status,
            'favorites' => $favorites,
            'activeServices' => $activeServices,
            'recentEmails' => $recentEmails,
            'recentInvoices' => $recentInvoices,
            'brandFeatures' => $brandFeatures,
            'supportPin' => $user->getSupportPin(),
            'supportPinValidUntil' => $supportPinValidUntil->toIso8601String(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $brandFeatures
     * @return array{activeServicesCount: int, customerBalance: float|null, dueIn30Days: float, registeredAt: string, balanceTopUpUrl: string|null}
     */
    private function buildStats($user, array $brandFeatures): array
    {
        $activeServicesCount = $this->countActiveServices($user, $brandFeatures);

        $customerBalance = null;
        if ($brandFeatures['prepaid_balance'] ?? false) {
            $cb = CustomerBalance::where('user_id', $user->id)->first();
            $customerBalance = $cb ? (float) $cb->balance : 0.0;
        }

        $dueIn30Days = (float) Invoice::query()
            ->where('user_id', $user->id)
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [today(), today()->addDays(30)])
            ->sum('amount');

        $registeredAt = $user->created_at?->format('d.m.Y') ?? '';

        $balanceTopUpUrl = ($brandFeatures['balance_topup'] ?? false) ? route('billing.index') : null;

        return [
            'activeServicesCount' => $activeServicesCount,
            'customerBalance' => $customerBalance,
            'dueIn30Days' => $dueIn30Days,
            'registeredAt' => $registeredAt,
            'balanceTopUpUrl' => $balanceTopUpUrl,
        ];
    }

    /**
     * @param  array<string, mixed>  $brandFeatures
     * @return array{level: string, label: string, balanceOk: bool, balanceMessage: string|null, ticketsOk: bool, ticketItems: array<int, array{id: int, subject: string, url: string}>}
     */
    private function buildStatus($user, array $brandFeatures): array
    {
        $level = 'ok';
        $balanceOk = true;
        $balanceMessage = null;
        $ticketsOk = true;
        $ticketItems = [];

        if ($brandFeatures['prepaid_balance'] ?? false) {
            $balanceSum = (float) (CustomerBalance::where('user_id', $user->id)->first()?->balance ?? 0);
            $dueIn7Days = (float) Invoice::query()
                ->where('user_id', $user->id)
                ->whereNotIn('status', ['paid', 'cancelled'])
                ->whereNotNull('due_date')
                ->whereBetween('due_date', [today(), today()->addDays(7)])
                ->sum('amount');
            if ($dueIn7Days > 0 && $balanceSum < $dueIn7Days) {
                $balanceOk = false;
                $balanceMessage = 'Dein Guthaben deckt nicht alle anstehenden Zahlungen in den nächsten 7 Tagen.';
                $level = $level === 'ok' ? 'danger' : $level;
            }
        }

        $openTickets = Ticket::query()
            ->where('user_id', $user->id)
            ->where('status', 'open')
            ->with(['messages' => fn ($q) => $q->orderByDesc('id')->with('user:id,is_admin')])
            ->get(['id', 'uuid', 'subject', 'user_id']);

        $openTicketsWithAdminReply = $openTickets->filter(function (Ticket $ticket) {
            $lastMessage = $ticket->messages->first();
            if ($lastMessage === null) {
                return false;
            }
            // Nur anzeigen, wenn die letzte Nachricht von einem Mitarbeiter stammt – nicht vom Ticket-Ersteller (z. B. Admin mit eigenem Ticket)
            $lastIsFromStaff = $lastMessage->user?->is_admin === true && (int) $lastMessage->user_id !== (int) $ticket->user_id;

            return $lastIsFromStaff;
        });

        if ($openTicketsWithAdminReply->isNotEmpty()) {
            $ticketsOk = false;
            if ($level === 'ok') {
                $level = 'warning';
            }
            foreach ($openTicketsWithAdminReply as $t) {
                $ticketItems[] = [
                    'id' => $t->id,
                    'subject' => $t->subject ?? 'Ticket #'.$t->id,
                    'url' => route('support.show', $t),
                ];
            }
        }

        $label = match ($level) {
            'danger' => 'Handlung nötig',
            'warning' => 'Aufmerksam sein',
            default => 'Alles in Ordnung',
        };

        return [
            'level' => $level,
            'label' => $label,
            'balanceOk' => $balanceOk,
            'balanceMessage' => $balanceMessage,
            'ticketsOk' => $ticketsOk,
            'ticketItems' => $ticketItems,
        ];
    }

    /**
     * Default favorites (no persistence in phase 1). URLs built server-side for correct host.
     *
     * @return array<int, array{name: string, href: string}>
     */
    private function defaultFavorites(Request $request): array
    {
        $base = [
            ['name' => 'Guthaben / Rechnungen', 'href' => route('billing.index')],
            ['name' => 'Postfach', 'href' => route('postfach.index')],
            ['name' => 'Support-Tickets', 'href' => route('support.index')],
        ];
        if (($request->attributes->get('current_brand') ?? Brand::getDefault())?->getFeaturesArray()['sites_editor'] ?? true) {
            $base[] = ['name' => 'Meine Sites', 'href' => route('sites.index')];
        }

        return $base;
    }

    /**
     * Count active services: sites (with subscription), domains, webspaces, game servers.
     * Respects brand features (sites_editor, domains_shop, webspace, gaming).
     *
     * @param  array<string, mixed>  $brandFeatures
     */
    private function countActiveServices($user, array $brandFeatures): int
    {
        $count = 0;
        if ($brandFeatures['sites_editor'] ?? true) {
            $count += Site::query()
                ->where('user_id', $user->id)
                ->whereHas('siteSubscription', fn ($q) => $q->whereNotNull('mollie_subscription_id'))
                ->count();
        }
        if ($brandFeatures['domains_shop'] ?? true) {
            $count += ResellerDomain::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->count();
        }
        if ($brandFeatures['webspace'] ?? false) {
            $count += WebspaceAccount::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->count();
        }
        if ($brandFeatures['gaming'] ?? false) {
            $count += GameServerAccount::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->count();
        }
        if ($brandFeatures['teamspeak'] ?? false) {
            $count += TeamSpeakServerAccount::query()
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->count();
        }

        return $count;
    }

    /**
     * Active services list: sites (with subscription), domains, webspaces, game servers.
     * Respects brand features. Each item has name, url, and type for optional grouping in the UI.
     *
     * @return array<int, array{name: string, url: string, type: string}>
     */
    private function activeServicesList($user, Request $request): array
    {
        $list = [];
        $brandFeatures = ($request->attributes->get('current_brand') ?? Brand::getDefault())?->getFeaturesArray() ?? [];

        if ($brandFeatures['sites_editor'] ?? true) {
            $sites = Site::query()
                ->where('user_id', $user->id)
                ->whereHas('siteSubscription', fn ($q) => $q->whereNotNull('mollie_subscription_id'))
                ->get(['id', 'uuid', 'name']);
            foreach ($sites as $site) {
                $list[] = [
                    'name' => $site->name ?: 'Site',
                    'url' => route('sites.show', $site),
                    'type' => 'site',
                ];
            }
        }

        if ($brandFeatures['domains_shop'] ?? true) {
            $domains = ResellerDomain::query()
                ->viewableBy($user)
                ->where('status', 'active')
                ->get(['id', 'uuid', 'domain', 'user_id']);
            foreach ($domains as $domain) {
                $list[] = [
                    'name' => $domain->domain,
                    'url' => route('domains.manage.show', $domain),
                    'type' => 'domain',
                    'is_shared_with_me' => ! $domain->isOwnedBy($user),
                ];
            }
        }

        if ($brandFeatures['webspace'] ?? false) {
            $webspaces = WebspaceAccount::query()
                ->viewableBy($user)
                ->where('status', 'active')
                ->with('hostingPlan:id,name')
                ->get(['id', 'uuid', 'domain', 'hosting_plan_id', 'user_id']);
            foreach ($webspaces as $acc) {
                $name = $acc->hostingPlan?->name ?: $acc->domain ?: 'Webspace';
                $list[] = [
                    'name' => $name,
                    'url' => route('webspace-accounts.show', $acc),
                    'type' => 'webspace',
                    'is_shared_with_me' => ! $acc->isOwnedBy($user),
                ];
            }
        }

        if ($brandFeatures['gaming'] ?? false) {
            $gameServers = GameServerAccount::query()
                ->viewableBy($user)
                ->where('status', 'active')
                ->with('hostingPlan:id,name')
                ->get(['id', 'uuid', 'name', 'identifier', 'hosting_plan_id', 'user_id']);
            foreach ($gameServers as $acc) {
                $name = $acc->name ?: $acc->identifier ?: $acc->hostingPlan?->name ?: 'Game Server';
                $list[] = [
                    'name' => $name,
                    'url' => route('gaming-accounts.show', $acc),
                    'type' => 'gaming',
                    'is_shared_with_me' => ! $acc->isOwnedBy($user),
                ];
            }
        }

        if ($brandFeatures['teamspeak'] ?? false) {
            $teamSpeakServers = TeamSpeakServerAccount::query()
                ->viewableBy($user)
                ->where('status', 'active')
                ->with('hostingPlan:id,name')
                ->get(['id', 'uuid', 'name', 'hosting_plan_id', 'user_id']);
            foreach ($teamSpeakServers as $acc) {
                $name = $acc->name ?: $acc->hostingPlan?->name ?: 'TeamSpeak-Server';
                $list[] = [
                    'name' => $name,
                    'url' => route('teamspeak-accounts.show', $acc),
                    'type' => 'teamspeak',
                    'is_shared_with_me' => ! $acc->isOwnedBy($user),
                ];
            }
        }

        return $list;
    }

    /**
     * @return array<int, array{id: int, subject: string, snippet: string|null, sent_at: string|null}>
     */
    private function recentEmails($user): array
    {
        return UserEmailLog::query()
            ->where('user_id', $user->id)
            ->orderByDesc('sent_at')
            ->limit(5)
            ->get(['id', 'subject', 'snippet', 'body_html', 'sent_at'])
            ->map(fn (UserEmailLog $log) => [
                'id' => $log->id,
                'subject' => $log->subject,
                'snippet' => UserEmailLog::snippetFromHtml($log->body_html) ?: $log->snippet ?: '…',
                'sent_at' => $log->sent_at?->format('d.m.Y'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{id: int, number: string, amount: string, status: string, invoice_date: string|null, pdf_path: string|null, show_url: string}>
     */
    private function recentInvoices($user): array
    {
        return $user->invoices()
            ->latest('invoice_date')
            ->limit(5)
            ->get(['id', 'uuid', 'number', 'amount', 'status', 'invoice_date', 'pdf_path'])
            ->map(fn (Invoice $inv) => [
                'id' => $inv->id,
                'number' => $inv->number,
                'amount' => number_format((float) $inv->amount, 2, ',', '.').' €',
                'status' => $inv->status,
                'invoice_date' => $inv->invoice_date ? Carbon::parse($inv->invoice_date)->format('d.m.Y') : null,
                'pdf_path' => $inv->pdf_path,
                'show_url' => route('invoices.show', $inv),
            ])
            ->values()
            ->all();
    }
}
