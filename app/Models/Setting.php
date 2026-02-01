<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    /**
     * @var list<string>
     */
    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = Cache::remember("setting.{$key}", 3600, fn () => static::find($key));

        return $setting?->value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => is_string($value) ? $value : json_encode($value)]);
        Cache::forget("setting.{$key}");
    }

    /**
     * Invoice company (Rechnungssteller) for PDF/XML. Settings override config.
     * Logo: bei lokalem Pfad wird es als Data-URL eingebettet (PDF zeigt es ohne Netzwerkabruf).
     *
     * @return array{company_name: string, company_street: string, company_postal_code: string, company_city: string, company_country: string, company_vat_id: string|null, company_logo_url: string|null, company_logo_data_url: string|null, ustg_19_text: string}
     */
    public static function getInvoiceCompany(): array
    {
        $config = config('billing.invoice', []);
        $logo = static::get('invoice_company_logo', $config['company_logo'] ?? null);
        $logoUrl = null;
        $logoDataUrl = null;

        if ($logo && is_string($logo) && $logo !== '') {
            if (str_starts_with($logo, 'http')) {
                $logoUrl = $logo;
                $logoDataUrl = static::fetchLogoAsDataUrl($logo);
            } else {
                $path = ltrim($logo, '/');
                if (Storage::disk('public')->exists($path)) {
                    $contents = Storage::disk('public')->get($path);
                    $mime = static::mimeForPath($path);
                    $logoDataUrl = 'data:'.$mime.';base64,'.base64_encode($contents);
                }
                $logoUrl = rtrim(config('app.url'), '/').'/storage/'.$path;
            }
        }

        return [
            'company_name' => (string) static::get('invoice_company_name', $config['company_name'] ?? config('app.name')),
            'company_street' => (string) static::get('invoice_company_street', $config['company_street'] ?? ''),
            'company_postal_code' => (string) static::get('invoice_company_postal_code', $config['company_postal_code'] ?? ''),
            'company_city' => (string) static::get('invoice_company_city', $config['company_city'] ?? ''),
            'company_country' => (string) static::get('invoice_company_country', $config['company_country'] ?? 'DE'),
            'company_vat_id' => static::get('invoice_company_vat_id', $config['company_vat_id'] ?? null) ?: null,
            'company_logo_url' => $logoUrl,
            'company_logo_data_url' => $logoDataUrl,
            'ustg_19_text' => (string) static::get('invoice_ustg_19_text', $config['ustg_19_text'] ?? 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung).'),
        ];
    }

    private static function mimeForPath(string $path): string
    {
        return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            default => 'image/jpeg',
        };
    }

    /**
     * Base domain for custom domains (CNAME target). Settings override config.
     */
    public static function getBaseDomain(): string
    {
        $v = static::get('domains_base_domain');

        return $v !== null && $v !== '' ? (string) $v : (string) config('domains.base_domain', 'praxishosting.abrendt.de');
    }

    /**
     * Main app hosts (dashboard runs here; other hosts = site render). Settings override config.
     *
     * @return list<string>
     */
    public static function getMainAppHosts(): array
    {
        $v = static::get('main_app_hosts');
        if ($v !== null && $v !== '') {
            $arr = array_values(array_filter(array_map('trim', explode(',', (string) $v))));

            return $arr;
        }

        return config('domains.main_app_hosts', []);
    }

    /**
     * Get dunning fee (Mahngebühr) for the given level (1, 2, or 3).
     * Settings override config.
     */
    public static function getDunningFee(int $level): float
    {
        $key = "dunning_fee_level_{$level}";
        $configKey = "billing.dunning_fee_level_{$level}";
        $default = config($configKey, 0);

        $value = static::get($key, $default);

        return (float) (is_numeric($value) ? $value : $default);
    }

    private static function fetchLogoAsDataUrl(string $url): ?string
    {
        $context = stream_context_create([
            'http' => ['timeout' => 5],
            'ssl' => ['verify_peer' => true],
        ]);
        $contents = @file_get_contents($url, false, $context);
        if ($contents === false || strlen($contents) > 2 * 1024 * 1024) {
            return null;
        }
        $mime = static::mimeForPath(parse_url($url, PHP_URL_PATH) ?: '');

        return 'data:'.$mime.';base64,'.base64_encode($contents);
    }
}
