<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Services\InvoiceEInvoiceService;
use Illuminate\Console\Command;

class InvoiceGenerateXmlCommand extends Command
{
    protected $signature = 'invoice:generate-xml {invoice : Invoice ID}';

    protected $description = 'Erzeugt das E-Rechnung-XML (XRechnung/UBL) für eine bestehende Rechnung';

    public function handle(InvoiceEInvoiceService $xmlService): int
    {
        $invoice = Invoice::find($this->argument('invoice'));
        if (! $invoice) {
            $this->error('Rechnung nicht gefunden.');

            return self::FAILURE;
        }

        $path = $xmlService->generate($invoice);
        if (! $path) {
            $this->error('XML konnte nicht erzeugt werden.');

            return self::FAILURE;
        }

        $invoice->update(['invoice_xml_path' => $path]);
        $this->info("E-Rechnung (XML) gespeichert: storage/app/{$path}");
        $this->line('Download: '.route('invoices.xml', $invoice).' (nach Login als Kunde/Admin)');

        return self::SUCCESS;
    }
}
