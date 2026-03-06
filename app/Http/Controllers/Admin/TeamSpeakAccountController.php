<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTeamSpeakAccountRequest;
use App\Models\Brand;
use App\Models\TeamSpeakServerAccount;
use App\Services\ControlPanels\TeamSpeakClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

class TeamSpeakAccountController extends Controller
{
    protected function currentBrand(Request $request): ?Brand
    {
        $brand = $request->attributes->get('current_brand');

        return $brand ?? Brand::getDefault();
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', TeamSpeakServerAccount::class);

        $currentBrand = $this->currentBrand($request);
        $features = $currentBrand?->getFeaturesArray() ?? [];
        if (! ($features['teamspeak'] ?? false)) {
            return Inertia::render('admin/teamspeak-accounts/Index', [
                'teamSpeakServerAccounts' => [
                    'data' => [],
                    'links' => [],
                ],
                'brandHasTeamSpeak' => false,
            ]);
        }

        $query = TeamSpeakServerAccount::query()
            ->with(['user', 'hostingPlan', 'hostingServer', 'product'])
            ->whereHas('hostingPlan', fn ($q) => $q->where('brand_id', $currentBrand->id))
            ->latest();

        $accounts = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/teamspeak-accounts/Index', [
            'teamSpeakServerAccounts' => $accounts,
            'brandHasTeamSpeak' => true,
        ]);
    }

    public function show(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): Response
    {
        $this->authorize('view', $teamSpeakServerAccount);

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $teamSpeakServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $teamSpeakServerAccount->load(['user', 'hostingPlan', 'hostingServer', 'product']);

        $payload = $teamSpeakServerAccount->toArray();
        $payload['monthly_amount'] = $teamSpeakServerAccount->getMonthlyRenewalAmount();

        return Inertia::render('admin/teamspeak-accounts/Show', [
            'teamSpeakServerAccount' => $payload,
        ]);
    }

    /**
     * Cancel Mollie subscription at period end (admin). Same logic as customer cancel.
     */
    public function cancelSubscription(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $this->authorize('update', $teamSpeakServerAccount);

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $teamSpeakServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        if (! $teamSpeakServerAccount->mollie_subscription_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Abo mit diesem TeamSpeak-Server verknüpft.');
        }

        $user = $teamSpeakServerAccount->user;
        if (! $user || ! $user->mollie_customer_id) {
            return redirect()
                ->back()
                ->with('error', 'Kein Mollie-Kunde verknüpft.');
        }

        try {
            app(MollieApiClient::class)->subscriptions->cancelForId($user->mollie_customer_id, $teamSpeakServerAccount->mollie_subscription_id);
        } catch (MollieApiException $e) {
            return redirect()
                ->back()
                ->with('error', 'Die Kündigung konnte nicht durchgeführt werden: '.$e->getMessage());
        }

        $teamSpeakServerAccount->update(['cancel_at_period_end' => true]);

        return redirect()
            ->back()
            ->with('success', 'TeamSpeak-Server-Abo wurde zum Periodenende gekündigt.');
    }

    public function edit(Request $request, TeamSpeakServerAccount $teamSpeakServerAccount): Response
    {
        $this->authorize('update', $teamSpeakServerAccount);

        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $teamSpeakServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $teamSpeakServerAccount->load(['user', 'hostingPlan', 'hostingServer', 'product']);

        return Inertia::render('admin/teamspeak-accounts/Edit', [
            'teamSpeakServerAccount' => $teamSpeakServerAccount,
        ]);
    }

    public function update(UpdateTeamSpeakAccountRequest $request, TeamSpeakServerAccount $teamSpeakServerAccount): RedirectResponse
    {
        $currentBrand = $this->currentBrand($request);
        if ($currentBrand !== null && $teamSpeakServerAccount->hostingPlan->brand_id !== $currentBrand->id) {
            abort(404);
        }

        $data = $request->validated();
        $slots = (int) $data['slots'];
        $optionValues = $teamSpeakServerAccount->option_values ?? [];
        $optionValues['slots'] = $slots;

        $update = [
            'name' => $data['name'],
            'port' => ! empty($data['port']) ? (int) $data['port'] : null,
            'option_values' => $optionValues,
            'current_period_ends_at' => ! empty($data['current_period_ends_at']) ? $data['current_period_ends_at'] : null,
            'status' => $data['status'],
            'custom_monthly_price' => isset($data['custom_monthly_price']) && $data['custom_monthly_price'] !== '' && $data['custom_monthly_price'] !== null ? (float) $data['custom_monthly_price'] : null,
        ];

        if ($teamSpeakServerAccount->virtual_server_id && $teamSpeakServerAccount->hostingServer) {
            try {
                $client = app(TeamSpeakClient::class);
                $client->setServer($teamSpeakServerAccount->hostingServer);
                if ($data['name'] !== $teamSpeakServerAccount->name) {
                    $client->setServerName($teamSpeakServerAccount->virtual_server_id, $data['name']);
                }
                $currentSlots = (int) (($teamSpeakServerAccount->option_values['slots'] ?? null) ?: 32);
                if ($slots !== $currentSlots) {
                    $client->setServerMaxClients($teamSpeakServerAccount->virtual_server_id, $slots);
                }
            } catch (\Throwable $e) {
                Log::warning('TeamSpeak admin update: sync to host failed', [
                    'account_id' => $teamSpeakServerAccount->id,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        $teamSpeakServerAccount->update($update);

        return redirect()
            ->route('admin.teamspeak-accounts.show', $teamSpeakServerAccount)
            ->with('success', 'TeamSpeak-Account aktualisiert.');
    }
}
