<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

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
        ]);
    }
}
