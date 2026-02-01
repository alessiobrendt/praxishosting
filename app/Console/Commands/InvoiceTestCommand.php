<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\User;
use App\Services\InvoiceEInvoiceService;
use App\Services\InvoicePdfService;
use Illuminate\Console\Command;

class InvoiceTestCommand extends Command
{
    protected $signature = 'invoice:test
                            {--user= : User ID or email to use as recipient (default: first user)}
                            {--output= : Save PDF to this path instead of storage}';

    protected $description = 'Erzeugt eine Testrechnung inkl. PDF und E-Rechnung (XML)';

    public function handle(InvoicePdfService $pdfService, InvoiceEInvoiceService $xmlService): int
    {
        $user = $this->resolveUser();
        if (! $user) {
            $this->error('Kein Benutzer gefunden. Bitte zuerst einen Benutzer anlegen oder --user=ID angeben.');

            return self::FAILURE;
        }

        $invoice = $this->createTestInvoice($user);
        $this->info("Testrechnung angelegt: {$invoice->number} (User: {$user->email})");

        $path = $pdfService->generate($invoice);
        if (! $path) {
            $this->error('PDF konnte nicht erzeugt werden (z. B. Browsershot/Chromium nicht installiert).');

            return self::FAILURE;
        }

        $invoice->update(['pdf_path' => $path]);

        $xmlPath = $xmlService->generate($invoice);
        if ($xmlPath) {
            $invoice->update(['invoice_xml_path' => $xmlPath]);
            $this->info('E-Rechnung (XML): '.storage_path('app/'.$xmlPath));
        }

        $fullPath = storage_path('app/'.$path);
        $outputPath = $this->option('output');
        if ($outputPath) {
            if (! is_dir(dirname($outputPath))) {
                mkdir(dirname($outputPath), 0755, true);
            }
            copy($fullPath, $outputPath);
            $this->info("PDF gespeichert: {$outputPath}");
        } else {
            $this->info("PDF gespeichert: {$fullPath}");
        }

        return self::SUCCESS;
    }

    private function resolveUser(): ?User
    {
        $userOption = $this->option('user');
        if ($userOption) {
            $user = is_numeric($userOption)
                ? User::find($userOption)
                : User::query()->where('email', $userOption)->first();

            return $user;
        }

        return User::query()->orderBy('id')->first();
    }

    private function createTestInvoice(User $user): Invoice
    {
        $year = now()->format('Y');
        $next = Invoice::query()->where('number', 'like', "TEST-{$year}-%")->count() + 1;
        $number = 'TEST-'.$year.'-'.str_pad((string) $next, 5, '0', STR_PAD_LEFT);

        $invoiceDate = now();
        $periodStart = $invoiceDate->copy()->subMonth()->startOfMonth();
        $periodEnd = $invoiceDate->copy()->subMonth()->endOfMonth();

        return Invoice::create([
            'user_id' => $user->id,
            'site_subscription_id' => null,
            'number' => $number,
            'type' => 'subscription',
            'amount' => 9.99,
            'tax' => 0,
            'status' => 'paid',
            'billing_period_start' => $periodStart,
            'billing_period_end' => $periodEnd,
            'invoice_date' => $invoiceDate,
        ]);
    }
}
