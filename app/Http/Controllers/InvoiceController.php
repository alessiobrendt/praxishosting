<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Requests\PayInvoiceRequest;
use App\Models\Brand;
use App\Models\CustomerBalance;
use App\Models\Invoice;
use App\Models\Setting;
use App\Services\MollieCustomerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Mollie\Api\MollieApiClient;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    /**
     * Show invoice as HTML (view first, then PDF/XML download). Authorized via InvoicePolicy (owner or admin).
     */
    public function showView(Request $request, Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['user.brand', 'siteSubscription.site', 'lineItems']);
        $brand = $invoice->user?->brand;
        $company = Setting::getInvoiceCompany($brand);
        $primaryColor = $this->brandPrimaryColor($brand);
        $primaryHoverColor = $this->brandPrimaryHoverColor($brand);
        $primaryRgb = $this->colorToRgbString($primaryColor);

        $this->applyBrandLogoToCompany($brand, $company);

        $brandFeatures = $brand?->getFeaturesArray() ?? [];
        $canPayWithBalance = (bool) ($brandFeatures['prepaid_balance'] ?? false);
        $customerBalance = 0.0;
        if ($canPayWithBalance && $invoice->user_id) {
            $balance = CustomerBalance::where('user_id', $invoice->user_id)->first();
            $customerBalance = $balance ? (float) $balance->balance : 0.0;
        }

        return response()->view('invoices.show', [
            'invoice' => $invoice,
            'company' => $company,
            'primaryColor' => $primaryColor,
            'primaryHoverColor' => $primaryHoverColor,
            'primaryRgb' => $primaryRgb,
            'canPayWithBalance' => $canPayWithBalance,
            'customerBalance' => $customerBalance,
            'payInvoiceUrl' => route('invoices.pay', $invoice),
        ]);
    }

    /**
     * Pay invoice: with balance (deduct and mark paid) or redirect to Stripe Checkout.
     */
    public function pay(PayInvoiceRequest $request, Invoice $invoice): RedirectResponse|\Inertia\Response
    {
        $this->authorize('view', $invoice);

        if ($invoice->status === 'paid') {
            return redirect()->route('invoices.show', $invoice)->with('info', 'Diese Rechnung ist bereits bezahlt.');
        }

        if (! in_array($invoice->status, ['sent', 'pending'], true)) {
            return redirect()->route('invoices.show', $invoice)->with('error', 'Diese Rechnung kann erst nach Versand (Status „Gesendet“ oder „Ausstehend“) bezahlt werden.');
        }

        $amount = (float) $invoice->amount;
        if ($amount <= 0) {
            return redirect()->route('invoices.show', $invoice)->with('error', 'Diese Rechnung kann nicht bezahlt werden.');
        }

        $user = $request->user();
        $paymentMethod = $request->validated('payment_method');

        if ($paymentMethod === 'balance') {
            $currentBrand = $request->attributes->get('current_brand') ?? Brand::getDefault();
            $brandFeatures = $currentBrand?->getFeaturesArray() ?? [];
            if (! ($brandFeatures['prepaid_balance'] ?? false)) {
                return redirect()->route('invoices.show', $invoice)->with('error', 'Zahlung mit Guthaben ist für diese Marke nicht aktiviert.');
            }

            try {
                app(\App\Services\BalancePaymentService::class)->payExistingInvoice($user, $invoice);
            } catch (InsufficientBalanceException $e) {
                return redirect()->route('invoices.show', $invoice)->with('error', $e->getMessage());
            }

            return redirect()->route('invoices.show', $invoice)->with('success', 'Die Rechnung wurde mit Guthaben bezahlt.');
        }

        $mollie = app(MollieApiClient::class);
        $currency = strtoupper(config('cashier.currency', 'eur'));
        $params = [
            'amount' => [
                'currency' => $currency,
                'value' => number_format($amount, 2, '.', ''),
            ],
            'description' => 'Rechnung '.$invoice->number,
            'redirectUrl' => route('invoices.show', $invoice).'?payment=success',
            'metadata' => [
                'type' => 'invoice_payment',
                'invoice_id' => (string) $invoice->id,
                'user_id' => (string) $user->id,
            ],
        ];
        $params['customerId'] = app(MollieCustomerService::class)->ensureCustomer($user);
        $webhookUrl = \App\Support\MollieWebhookUrl::get();
        if ($webhookUrl !== null) {
            $params['webhookUrl'] = $webhookUrl;
        }
        $payment = $mollie->payments->create($params);
        $url = $payment->getCheckoutUrl();
        if (! $url || ! str_starts_with($url, 'https://')) {
            return redirect()->route('invoices.show', $invoice)->with('error', 'Mollie Checkout konnte nicht erstellt werden.');
        }

        return Inertia::location($url);
    }

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

    private function brandPrimaryColor(?\App\Models\Brand $brand): string
    {
        $colors = $brand?->theme_colors;
        if (is_array($colors) && ! empty($colors['primary'])) {
            return $this->sanitizeCssColor($colors['primary']);
        }

        return '#059669';
    }

    private function brandPrimaryHoverColor(?\App\Models\Brand $brand): string
    {
        $colors = $brand?->theme_colors;
        if (is_array($colors) && ! empty($colors['primary_hover'])) {
            return $this->sanitizeCssColor($colors['primary_hover']);
        }

        return '#047857';
    }

    private function sanitizeCssColor(string $value): string
    {
        $value = trim($value);
        if (preg_match('/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/', $value)) {
            return $value;
        }
        if (preg_match('/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/', $value)) {
            return $value;
        }
        if (preg_match('/^hsl\(\s*[\d.]+\s*(deg|turn|rad)?\s+[\d.]+%\s+[\d.]+%\s*\)$/i', $value)
            || preg_match('/^hsla\(\s*[\d.]+\s*(deg|turn|rad)?\s+[\d.]+%\s+[\d.]+%\s*[\d.]+\s*\)$/i', $value)) {
            return $value;
        }

        return '#059669';
    }

    /**
     * Return CSS "r, g, b" string for rgba() from hex, rgb() or hsl() color.
     */
    private function colorToRgbString(string $color): string
    {
        $color = trim($color);
        if (preg_match('/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/', $color, $m)) {
            $r = hexdec($m[1].$m[1]);
            $g = hexdec($m[2].$m[2]);
            $b = hexdec($m[3].$m[3]);

            return "{$r}, {$g}, {$b}";
        }
        if (preg_match('/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/', $color, $m)) {
            return hexdec($m[1]).', '.hexdec($m[2]).', '.hexdec($m[3]);
        }
        if (preg_match('/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/', $color, $m)) {
            return "{$m[1]}, {$m[2]}, {$m[3]}";
        }
        if (preg_match('/^hsl\(\s*([\d.]+)\s*(?:deg|turn|rad)?\s+([\d.]+)%\s+([\d.]+)%\s*\)$/i', $color, $m)) {
            return $this->hslToRgbString((float) $m[1], (float) $m[2] / 100, (float) $m[3] / 100);
        }
        if (preg_match('/^hsla\(\s*([\d.]+)\s*(?:deg|turn|rad)?\s+([\d.]+)%\s+([\d.]+)%\s*[\d.]+\s*\)$/i', $color, $m)) {
            return $this->hslToRgbString((float) $m[1], (float) $m[2] / 100, (float) $m[3] / 100);
        }

        return '5, 150, 105';
    }

    private function hslToRgbString(float $h, float $s, float $l): string
    {
        $h = fmod($h, 360) / 360;
        $r = $l;
        $g = $l;
        $b = $l;
        if ($s > 0) {
            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;
            $r = $this->hueToRgb($p, $q, $h + 1 / 3);
            $g = $this->hueToRgb($p, $q, $h);
            $b = $this->hueToRgb($p, $q, $h - 1 / 3);
        }

        return round($r * 255).', '.round($g * 255).', '.round($b * 255);
    }

    private function hueToRgb(float $p, float $q, float $t): float
    {
        if ($t < 0) {
            $t += 1;
        }
        if ($t > 1) {
            $t -= 1;
        }
        if ($t < 1 / 6) {
            return $p + ($q - $p) * 6 * $t;
        }
        if ($t < 1 / 2) {
            return $q;
        }
        if ($t < 2 / 3) {
            return $p + ($q - $p) * (2 / 3 - $t) * 6;
        }

        return $p;
    }

    private function applyBrandLogoToCompany(?\App\Models\Brand $brand, array &$company): void
    {
        if ($brand === null || empty($brand->logo_url)) {
            return;
        }
        $logoUrl = $brand->logo_url;
        if (! Str::startsWith($logoUrl, ['http://', 'https://'])) {
            $path = ltrim($logoUrl, '/');
            if (Storage::disk('public')->exists($path)) {
                $contents = Storage::disk('public')->get($path);
                $mime = pathinfo($path, PATHINFO_EXTENSION);
                $mime = match (strtolower($mime)) {
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                    'svg' => 'image/svg+xml',
                    default => 'image/jpeg',
                };
                $company['company_logo_data_url'] = 'data:'.$mime.';base64,'.base64_encode($contents);
            }
            $company['company_logo_url'] = rtrim(config('app.url'), '/').'/storage/'.$path;
        } else {
            $company['company_logo_url'] = $logoUrl;
        }
    }
}
