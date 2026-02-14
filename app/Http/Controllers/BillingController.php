<?php

namespace App\Http\Controllers;

use App\Services\AiTokenService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request, AiTokenService $aiTokenService): Response
    {
        $user = $request->user();

        $packages = config('billing.ai_token_packages', []);
        $aiTokenPackages = [];
        $labels = [500 => '500 Tokens (5 €)', 2000 => '2.000 Tokens (15 €)', 10000 => '10.000 Tokens (50 €)'];
        foreach ($packages as $amount => $priceId) {
            if ($priceId) {
                $aiTokenPackages[] = ['amount' => $amount, 'label' => $labels[$amount] ?? "{$amount} Tokens"];
            }
        }

        $invoices = $user->invoices()
            ->latest('invoice_date')
            ->limit(50)
            ->get(['id', 'number', 'amount', 'status', 'invoice_date', 'pdf_path', 'invoice_xml_path'])
            ->map(fn ($inv) => array_merge($inv->toArray(), [
                'invoice_date' => $inv->invoice_date ? Carbon::parse($inv->invoice_date)->format('d.m.Y') : null,
            ]));

        $paymentMethodSummary = null;
        if ($user->hasDefaultPaymentMethod()) {
            $paymentMethodSummary = [
                'brand' => $user->pm_type,
                'last4' => $user->pm_last_four,
            ];
        }

        return Inertia::render('billing/Index', [
            'invoices' => $invoices,
            'billingPortalUrl' => route('billing.portal'),
            'paymentMethodSummary' => $paymentMethodSummary,
            'aiTokenBalance' => $aiTokenService->getBalance($user),
            'aiTokenPackages' => $aiTokenPackages,
        ]);
    }
}
