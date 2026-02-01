<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class InvoiceController extends Controller
{
    /**
     * Download invoice PDF. Authorized via InvoicePolicy (owner or admin).
     */
    public function downloadPdf(Request $request, Invoice $invoice): BinaryFileResponse
    {
        $this->authorize('view', $invoice);

        if (! $invoice->pdf_path) {
            abort(404, 'Rechnungs-PDF ist noch nicht verfügbar.');
        }

        $path = Storage::path($invoice->pdf_path);
        if (! is_file($path)) {
            abort(404, 'Rechnungs-PDF wurde nicht gefunden.');
        }

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Rechnung-'.$invoice->number.'.pdf"',
        ]);
    }

    /**
     * Download invoice XML (E-Rechnung). Authorized via InvoicePolicy (owner or admin).
     */
    public function downloadXml(Request $request, Invoice $invoice): BinaryFileResponse
    {
        $this->authorize('view', $invoice);

        if (! $invoice->invoice_xml_path) {
            abort(404, 'E-Rechnung ist noch nicht verfügbar.');
        }

        $path = Storage::path($invoice->invoice_xml_path);
        if (! is_file($path)) {
            abort(404, 'E-Rechnung wurde nicht gefunden.');
        }

        return response()->file($path, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => 'inline; filename="Rechnung-'.$invoice->number.'.xml"',
        ]);
    }
}
