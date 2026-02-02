<?php

namespace App\Console\Commands;

use App\Models\Domain;
use App\Services\SiteRenderService;
use Illuminate\Console\Command;

class DebugSiteDomain extends Command
{
    protected $signature = 'site:debug-domain {host} {path?}';

    protected $description = 'Debug site domain routing: prüft ob Domain und Pfad erkannt werden';

    public function handle(SiteRenderService $siteRenderService): int
    {
        $host = strtolower($this->argument('host'));
        $path = trim((string) ($this->argument('path') ?? ''), '/');
        $pageSlug = $path === '' ? null : $path;

        $this->line("Host: {$host}");
        $this->line("Path: {$path}");
        $this->line('Page-Slug: '.(string) $pageSlug);
        $this->newLine();

        $domain = Domain::query()
            ->where('domain', $host)
            ->with(['site.template.pages'])
            ->first();

        if (! $domain) {
            $this->error('Domain nicht gefunden.');

            return 1;
        }

        $site = $domain->site;
        $this->info("Domain gefunden → Site: {$site->name} (UUID: {$site->uuid})");
        $this->line("Status: {$site->status}");
        $this->newLine();

        $allowedSlugs = $siteRenderService->getAllowedPageSlugs($site);
        $this->line('Erlaubte Page-Slugs: '.implode(', ', $allowedSlugs));
        $this->newLine();

        if ($pageSlug !== null) {
            $normalizedSlug = $siteRenderService->normalizePageSlug($pageSlug, $site);
            $isActive = $siteRenderService->isPageActive($site->custom_page_data, $normalizedSlug);

            $this->line("Requested slug: {$pageSlug}");
            $this->line("Normalized slug: {$normalizedSlug}");
            $this->line('In allowed list: '.(in_array($pageSlug, $allowedSlugs, true) ? 'ja' : 'nein'));
            $this->line('Seite aktiv: '.($isActive ? 'ja' : 'nein'));
            $this->newLine();

            if ($pageSlug !== null && $normalizedSlug === 'index') {
                $this->warn('→ 404: Slug nicht in erlaubter Liste.');
            } elseif (! $isActive) {
                $this->warn('→ 404: Seite nicht aktiv.');
            } else {
                $this->info('→ Seite sollte erreichbar sein.');
            }
        }

        $customPages = $site->custom_page_data['custom_pages'] ?? [];
        if ($customPages !== []) {
            $this->newLine();
            $this->line('Custom Pages:');
            foreach ($customPages as $cp) {
                $slug = $cp['slug'] ?? '-';
                $name = $cp['name'] ?? '-';
                $this->line("  - {$slug} ({$name})");
            }
        }

        return 0;
    }
}
