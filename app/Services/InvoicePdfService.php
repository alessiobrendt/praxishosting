<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\LaravelPdf\Facades\Pdf;

class InvoicePdfService
{
    /**
     * Generate PDF for an invoice and save to storage.
     * Stores under storage/app/invoices/{year}/{invoice_number}.pdf
     *
     * @return string|null Relative path (e.g. "invoices/2026/INV-2026-00001.pdf") or null on failure
     */
    public function generate(Invoice $invoice): ?string
    {
        $invoice->load(['user.brand', 'siteSubscription.site', 'lineItems']);

        $year = $invoice->invoice_date->format('Y');
        $filename = str_replace(['/', ' '], ['-', '_'], $invoice->number).'.pdf';
        $relativePath = "invoices/{$year}/{$filename}";

        $brand = $invoice->user?->brand;
        $company = Setting::getInvoiceCompany($brand);
        $this->applyBrandLogoToCompany($brand, $company);

        $primaryColor = $this->brandPrimaryColor($brand);
        $primaryHoverColor = $this->brandPrimaryHoverColor($brand);

        try {
            Pdf::view('invoices.pdf', [
                'invoice' => $invoice,
                'company' => $company,
                'primary_color' => $primaryColor,
                'primary_hover_color' => $primaryHoverColor,
            ])
                ->format('a4')
                ->disk('local')
                ->save($relativePath);

            return $relativePath;
        } catch (\Throwable) {
            return null;
        }
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

        return '#059669';
    }

    private function applyBrandLogoToCompany(?Brand $brand, array &$company): void
    {
        if ($brand === null || empty($brand->logo_url)) {
            return;
        }
        $logoUrl = $brand->logo_url;
        if (! Str::startsWith($logoUrl, ['http://', 'https://'])) {
            $path = ltrim($logoUrl, '/');
            if (Storage::disk('public')->exists($path)) {
                $contents = Storage::disk('public')->get($path);
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                $mime = match (strtolower($ext)) {
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
