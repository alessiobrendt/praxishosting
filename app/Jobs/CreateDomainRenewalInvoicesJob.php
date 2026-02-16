<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\ResellerDomain;
use App\Services\DomainPricingService;
use App\Services\InvoicePdfService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CreateDomainRenewalInvoicesJob implements ShouldQueue
{
    use Queueable;

    public function handle(DomainPricingService $pricing, InvoicePdfService $pdfService): void
    {
        $targetFrom = Carbon::now()->addDays(29)->startOfDay();
        $targetTo = Carbon::now()->addDays(31)->endOfDay();

        ResellerDomain::query()
            ->where('auto_renew', true)
            ->whereNotNull('user_id')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [$targetFrom, $targetTo])
            ->with('user')
            ->get()
            ->each(function (ResellerDomain $domain) use ($pricing, $pdfService): void {
                $expiresAt = $domain->expires_at->format('Y-m-d');
                $existing = Invoice::query()
                    ->where('type', 'domain_renewal')
                    ->where('user_id', $domain->user_id)
                    ->whereJsonContains('metadata->reseller_domain_id', $domain->id)
                    ->whereJsonContains('metadata->expires_at', $expiresAt)
                    ->exists();
                if ($existing) {
                    return;
                }

                $tld = $domain->tld ?? substr(strrchr($domain->domain, '.'), 1);
                $salePrice = $pricing->getSalePrice($tld, 'renew');

                $year = date('Y');
                $nextSeq = (int) Invoice::whereYear('invoice_date', $year)->max('id') + 1;
                $number = 'INV-'.$year.'-'.str_pad((string) $nextSeq, 5, '0', STR_PAD_LEFT);

                $invoice = Invoice::create([
                    'user_id' => $domain->user_id,
                    'number' => $number,
                    'type' => 'domain_renewal',
                    'amount' => $salePrice,
                    'tax' => 0,
                    'status' => 'draft',
                    'invoice_date' => now(),
                    'due_date' => now()->addDays(14),
                    'metadata' => [
                        'reseller_domain_id' => $domain->id,
                        'expires_at' => $expiresAt,
                    ],
                ]);

                InvoiceLineItem::create([
                    'invoice_id' => $invoice->id,
                    'position' => 1,
                    'description' => 'Domain-Verlängerung '.$domain->domain,
                    'quantity' => 1,
                    'unit' => 'Stück',
                    'unit_price' => $salePrice,
                    'amount' => $salePrice,
                ]);

                $pdfPath = $pdfService->generate($invoice->fresh(['user', 'lineItems']));
                if ($pdfPath) {
                    $invoice->update(['pdf_path' => $pdfPath]);
                }
            });
    }
}
