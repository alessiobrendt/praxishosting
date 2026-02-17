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
        foreach ($packages as $amount => $priceEur) {
            if ($priceEur !== null && $priceEur !== '') {
                $eur = (float) $priceEur;
                $aiTokenPackages[] = [
                    'amount' => $amount,
                    'label' => number_format($amount, 0, ',', '.').' Tokens ('.number_format($eur, 2, ',', '.').' €)',
                ];
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
