<?php

namespace App\Mail;

use App\Models\Brand;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class TransactionalTemplateMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{subject: string, greeting: string, body: string, action_text: string|null}  $content
     */
    public function __construct(
        public array $content,
        public ?string $actionUrl = null,
        public bool $isTest = false,
        public ?Brand $brand = null
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->content['subject'];
        if ($this->isTest) {
            $subject = '[Test] '.$subject;
        }

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        $html = $this->getCompiledHtml();
        $html = $this->replacePlaceholders($html);

        return new Content(
            htmlString: $html,
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Render the email HTML (e.g. for preview in admin). Same output as sent mail.
     *
     * @param  array{subject: string, greeting: string, body: string, action_text: string|null}  $content
     */
    public static function renderHtml(array $content, ?string $actionUrl, ?Brand $brand = null): string
    {
        $mailable = new self($content, $actionUrl, false, $brand);

        return $mailable->replacePlaceholders($mailable->getCompiledHtml());
    }

    private function getCompiledHtml(): string
    {
        $path = config('maizzle.compiled_path');

        if (! $path || ! is_file($path)) {
            return $this->fallbackHtml();
        }

        $html = file_get_contents($path);
        if ($html === false) {
            return $this->fallbackHtml();
        }

        return $html;
    }

    private function replacePlaceholders(string $html): string
    {
        $greeting = '<p style="margin: 0 0 16px 0;">'.e($this->content['greeting']).'</p>';
        $bodyHtml = $this->bodyToHtml($this->content['body']);
        $actionButton = $this->buildActionButton();
        $header = $this->getGlobalHeader();
        $footer = $this->getGlobalFooter();

        return str_replace(
            ['__HEADER__', '__GREETING__', '__BODY__', '__ACTION_BUTTON__', '__FOOTER__'],
            [$header, $greeting, $bodyHtml, $actionButton, $footer],
            $html
        );
    }

    private function getGlobalHeader(): string
    {
        if ($this->brand !== null) {
            $custom = $this->brand->mail_header;
            if ($custom !== null && trim($custom) !== '') {
                return trim($custom);
            }

            $logoImg = $this->buildBrandLogoImg($this->brand);
            if ($logoImg !== '') {
                return $logoImg;
            }

            $color = $this->brandPrimaryColor();

            return '<span style="font-size: 18px; font-weight: 600; color: '.$color.';">'.e($this->brand->name).'</span>';
        }

        $custom = config('maizzle.header');
        if ($custom !== null && trim((string) $custom) !== '') {
            return trim((string) $custom);
        }

        $appName = e(config('app.name'));
        $color = $this->brandPrimaryColor();

        return '<span style="font-size: 18px; font-weight: 600; color: '.$color.';">'.$appName.'</span>';
    }

    /**
     * Build an img tag for the brand logo for use in the email header.
     * Returns empty string if brand has no logo_url.
     * SVG URLs are converted to .png for the email, because many clients (e.g. Gmail) do not display SVG images.
     */
    private function buildBrandLogoImg(Brand $brand): string
    {
        $logoUrl = $brand->logo_url;
        if ($logoUrl === null || trim($logoUrl) === '') {
            return '';
        }

        $logoUrl = trim($logoUrl);
        if (! Str::startsWith($logoUrl, ['http://', 'https://'])) {
            $path = ltrim($logoUrl, '/');
            if (Storage::disk('public')->exists($path)) {
                $logoUrl = rtrim(config('app.url'), '/').'/storage/'.$path;
            } else {
                return '';
            }
        }

        if (Str::endsWith(strtolower($logoUrl), '.svg')) {
            $logoUrl = Str::beforeLast($logoUrl, '.svg').'.png';
        }

        $alt = e($brand->name);

        return '<img src="'.e($logoUrl).'" alt="'.$alt.'" style="max-height: 48px; height: auto; width: auto; display: block;" />';
    }

    private function getGlobalFooter(): string
    {
        if ($this->brand !== null) {
            $custom = $this->brand->mail_footer;
            if ($custom !== null && trim($custom) !== '') {
                return trim($custom);
            }

            return 'Diese E-Mail wurde von '.e($this->brand->name).' gesendet.';
        }

        $custom = config('maizzle.footer');
        if ($custom !== null && trim((string) $custom) !== '') {
            return trim((string) $custom);
        }

        return 'Diese E-Mail wurde von '.e(config('app.name')).' gesendet.';
    }

    private function bodyToHtml(string $body): string
    {
        $body = trim($body);
        if ($body === '') {
            return '<p style="margin: 0;">&nbsp;</p>';
        }
        $bodyWithParagraphs = preg_replace('/\n/', "\n\n", $body);
        $html = Str::markdown($bodyWithParagraphs);

        return $html;
    }

    private function buildActionButton(): string
    {
        if (empty($this->content['action_text']) || $this->actionUrl === null) {
            return '';
        }

        $url = e($this->actionUrl);
        $text = e($this->content['action_text']);
        $primary = $this->brandPrimaryColor();
        $primaryHover = $this->brandPrimaryHoverColor();

        return sprintf(
            '<a href="%s" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, %s 0%%, %s 100%%); color: #ffffff; font-weight: 600; text-decoration: none; border-radius: 8px;">%s</a>',
            $url,
            $primary,
            $primaryHover,
            $text
        );
    }

    private function brandPrimaryColor(): string
    {
        $colors = $this->brand?->theme_colors;
        if (is_array($colors) && ! empty($colors['primary'])) {
            return $this->sanitizeCssColor($colors['primary']);
        }

        return '#059669';
    }

    private function brandPrimaryHoverColor(): string
    {
        $colors = $this->brand?->theme_colors;
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

    private function fallbackHtml(): string
    {
        $header = $this->getGlobalHeader();
        $greeting = '<p>'.e($this->content['greeting']).'</p>';
        $bodyHtml = $this->bodyToHtml($this->content['body']);
        $actionButton = $this->buildActionButton();
        $footer = $this->getGlobalFooter();

        return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div style="padding:16px;border-bottom:1px solid #eee">'.$header.'</div>'.$greeting.$bodyHtml.$actionButton.'<div style="padding:16px;font-size:12px;color:#6b7280">'.$footer.'</div></body></html>';
    }
}
