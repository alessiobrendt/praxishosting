<?php

namespace App\Http\Controllers;

use App\Models\WebspaceAccount;
use App\Services\ControlPanels\PleskClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Inertia\Response;

class WebspaceAccountController extends Controller
{
    /**
     * List current user's webspace accounts.
     */
    public function index(Request $request): Response
    {
        $accounts = $request->user()
            ->webspaceAccounts()
            ->with('hostingPlan')
            ->latest()
            ->get();

        return Inertia::render('webspace-accounts/Index', [
            'webspaceAccounts' => $accounts,
        ]);
    }

    /**
     * Show one webspace account (credentials, Plesk/Webmail links). Only owner.
     */
    public function show(Request $request, WebspaceAccount $webspaceAccount): Response|RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        $webspaceAccount->load('hostingPlan', 'hostingServer');

        $pleskPassword = null;
        if ($webspaceAccount->plesk_password_encrypted) {
            try {
                $pleskPassword = Crypt::decryptString($webspaceAccount->plesk_password_encrypted);
            } catch (\Throwable) {
                // ignore
            }
        }

        $resourceUsage = null;
        $server = $webspaceAccount->hostingServer;
        if ($server) {
            $plesk = app(PleskClient::class);
            $plesk->setServer($server);
            $usage = $plesk->getWebspaceResourceUsage($webspaceAccount->domain);
            $plan = $webspaceAccount->hostingPlan;
            if ($usage !== null && $plan) {
                $diskLimitBytes = $plan->disk_gb ? (int) ($plan->disk_gb * 1024 * 1024 * 1024) : 0;
                $resourceUsage = [
                    'disk_used_bytes' => $usage['disk_bytes'],
                    'disk_limit_bytes' => $diskLimitBytes,
                    'domains_used' => $usage['domains_used'],
                    'domains_limit' => (int) ($plan->domains ?? 1),
                    'subdomains_used' => $usage['subdomains_used'],
                    'subdomains_limit' => (int) ($plan->subdomains ?? 0),
                    'mailboxes_used' => $usage['mailboxes_used'],
                    'mailboxes_limit' => (int) ($plan->mailboxes ?? 0),
                    'databases_used' => $usage['databases_used'],
                    'databases_limit' => (int) ($plan->databases ?? 0),
                ];
            }
        }

        return Inertia::render('webspace-accounts/Show', [
            'webspaceAccount' => $webspaceAccount,
            'pleskPassword' => $pleskPassword,
            'webmailUrl' => 'https://webmail.'.$webspaceAccount->domain,
            'resourceUsage' => $resourceUsage,
        ]);
    }

    /**
     * Redirect to Plesk panel with session (create_session API).
     */
    public function pleskLogin(Request $request, WebspaceAccount $webspaceAccount): RedirectResponse
    {
        $this->authorize('view', $webspaceAccount);

        $server = $webspaceAccount->hostingServer;
        if (! $server) {
            return redirect()->back()->with('error', 'Kein Hosting-Server zugeordnet.');
        }

        $plesk = app(PleskClient::class);
        $plesk->setServer($server);
        $clientIp = $request->ip() ?? '127.0.0.1';
        $token = $plesk->createCustomerSession($webspaceAccount->plesk_username, $clientIp);

        if (! $token) {
            return redirect()->back()->with('error', 'Plesk-Login konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.');
        }

        $protocol = ($server->use_ssl ?? true) ? 'https' : 'http';
        $port = $server->port !== null && (int) $server->port > 0 ? (int) $server->port : 8443;
        $url = $protocol.'://'.$server->hostname.':'.$port.'/enterprise/rsession_init.php?PHPSESSID='.urlencode($token);

        return redirect()->away($url);
    }
}
