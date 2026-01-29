<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\TemplatePage;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Default page_data structure for praxisemerald (matches template_pages/praxisemerald/pages/index.vue).
     *
     * @return array<string, mixed>
     */
    public static function praxisemeraldPageData(): array
    {
        return [
            'colors' => [
                'primary' => '#059669',
                'primaryHover' => '#047857',
                'primaryLight' => '#ecfdf5',
                'primaryDark' => '#065f46',
                'secondary' => '#0f172a',
                'tertiary' => '#334155',
                'quaternary' => '#f8fafc',
                'quinary' => '#f1f5f9',
            ],
            'hero' => [
                'heading' => 'Willkommen in der Praxis Mustermann',
                'text' => 'Ihre hausärztliche Versorgung mit Herz und Verstand – persönlich, modern und nah.',
                'buttons' => [
                    ['text' => 'Termin anfragen', 'href' => '', 'variant' => 'default'],
                    ['text' => 'Unsere Leistungen', 'href' => '/leistungen', 'variant' => 'outline'],
                ],
                'image' => [
                    'src' => '/images/image1.webp',
                    'alt' => 'Behandlungszimmer der Praxis Mustermann',
                ],
            ],
            'about' => [
                'heading' => 'Kurzvorstellung',
                'text' => 'In unserer Praxis steht der Mensch im Mittelpunkt. Wir verbinden moderne Diagnostik mit individueller Betreuung und nehmen uns Zeit für Ihre Anliegen.',
                'features' => [
                    ['icon' => 'Stethoscope', 'title' => 'Allgemeinmedizin', 'desc' => 'Hausärztliche Versorgung, akute und chronische Erkrankungen.'],
                    ['icon' => 'Syringe', 'title' => 'Impfungen', 'desc' => 'Beratung und Durchführung aller empfohlenen Impfungen.'],
                    ['icon' => 'ShieldCheck', 'title' => 'Vorsorge', 'desc' => 'Gesundheits-Check-ups, Krebsfrüherkennung, Hautkrebsscreening.'],
                    ['icon' => 'HeartPulse', 'title' => 'Diagnostik', 'desc' => 'EKG, Langzeit-Blutdruck, Spirometrie, Laboruntersuchungen.'],
                ],
            ],
            'hours' => [
                'heading' => 'Öffnungszeiten',
                'icon' => 'Clock',
                'infoText' => 'Bitte vereinbaren Sie nach Möglichkeit einen Termin. Akutsprechstunde täglich vormittags.',
                'hours' => [
                    ['day' => 'Montag', 'hours' => '08:00–12:00, 15:00–18:00'],
                    ['day' => 'Dienstag', 'hours' => '08:00–12:00'],
                    ['day' => 'Mittwoch', 'hours' => '08:00–12:00'],
                    ['day' => 'Donnerstag', 'hours' => '08:00–12:00, 15:00–18:00'],
                    ['day' => 'Freitag', 'hours' => '08:00–12:00'],
                    ['day' => 'Samstag', 'hours' => 'geschlossen'],
                    ['day' => 'Sonntag', 'hours' => 'geschlossen'],
                ],
            ],
            'cta' => [
                'heading' => 'Neu bei uns?',
                'text' => 'Hier finden Sie Informationen für Ihren ersten Besuch, Anfahrt und was Sie mitbringen sollten.',
                'links' => [
                    ['text' => 'Patienteninformationen', 'href' => '/patienteninformationen', 'variant' => 'primary'],
                    ['text' => 'Leistungen ansehen', 'href' => '/leistungen', 'variant' => 'secondary'],
                ],
                'image' => [
                    'src' => '/images/image2.webp',
                    'alt' => 'Empfangsbereich der Praxis Mustermann',
                ],
            ],
        ];
    }

    /**
     * Default page_data structure for handwerk (crafts landing page).
     *
     * @return array<string, mixed>
     */
    public static function handwerkPageData(): array
    {
        return [
            'colors' => [
                'primary' => '#0d9488',
                'primaryHover' => '#0f766e',
                'primaryLight' => '#ccfbf1',
                'primaryDark' => '#134e4a',
                'secondary' => '#0f172a',
                'tertiary' => '#334155',
                'quaternary' => '#f8fafc',
                'quinary' => '#f1f5f9',
            ],
            'hero' => [
                'heading' => 'Ihr Handwerksbetrieb – Qualität und Service',
                'text' => 'Ihre Ansprechpartner vor Ort für alle Arbeiten. Zuverlässig, termingerecht und mit fairen Preisen.',
                'buttons' => [
                    ['text' => 'Kontakt aufnehmen', 'href' => '#kontakt', 'variant' => 'default'],
                    ['text' => 'Leistungen ansehen', 'href' => '#leistungen', 'variant' => 'outline'],
                ],
                'image' => ['src' => '/images/handwerk-hero.webp', 'alt' => 'Handwerker bei der Arbeit'],
            ],
            'services' => [
                ['title' => 'Reparatur & Wartung', 'shortDesc' => 'Schnelle Hilfe bei Defekten und regelmäßige Wartung.'],
                ['title' => 'Neuinstallation', 'shortDesc' => 'Fachgerechte Installation und Anschluss.'],
                ['title' => 'Beratung', 'shortDesc' => 'Persönliche Beratung vor Ort zu Ihrem Projekt.'],
                ['title' => 'Notdienst', 'shortDesc' => 'Erreichbar bei dringenden Notfällen.'],
            ],
            'about' => [
                'heading' => 'Über uns',
                'text' => 'Wir sind ein eingespieltes Team mit langjähriger Erfahrung. Qualität und Kundenzufriedenheit stehen bei uns an erster Stelle. Gerne beraten wir Sie unverbindlich.',
            ],
            'contact' => [
                'heading' => 'Kontakt',
                'text' => 'Rufen Sie uns an oder schreiben Sie uns – wir melden uns zeitnah.',
                'phone' => '+49 123 456789',
                'email' => 'info@beispiel-handwerk.de',
                'address' => 'Musterstraße 1, 12345 Musterstadt',
                'buttonText' => 'Jetzt anfragen',
                'buttonHref' => '#kontakt',
            ],
        ];
    }

    public function run(): void
    {
        $defaultPageData = self::praxisemeraldPageData();
        $template = Template::firstOrCreate(
            ['slug' => 'praxisemerald'],
            [
                'name' => 'Praxis Emerald',
                'page_data' => $defaultPageData,
                'preview_image' => null,
                'is_active' => true,
                'price' => 0,
            ]
        );

        $needsUpdate = $template->wasRecentlyCreated || empty($template->page_data) || ! isset($template->page_data['colors']);
        if ($needsUpdate) {
            $template->update(['page_data' => $defaultPageData]);
        }

        $pageData = $template->fresh()->page_data ?? $defaultPageData;
        $indexPage = TemplatePage::firstOrCreate(
            [
                'template_id' => $template->id,
                'slug' => 'index',
            ],
            [
                'name' => 'Startseite',
                'order' => 0,
                'data' => $pageData,
            ]
        );
        if ($needsUpdate) {
            $indexPage->update(['data' => $pageData]);
        }

        $handwerkPageData = self::handwerkPageData();
        $handwerkTemplate = Template::firstOrCreate(
            ['slug' => 'handwerk'],
            [
                'name' => 'Handwerk',
                'page_data' => $handwerkPageData,
                'preview_image' => null,
                'is_active' => true,
                'price' => 0,
            ]
        );

        $handwerkNeedsUpdate = $handwerkTemplate->wasRecentlyCreated || empty($handwerkTemplate->page_data) || ! isset($handwerkTemplate->page_data['colors']);
        if ($handwerkNeedsUpdate) {
            $handwerkTemplate->update(['page_data' => $handwerkPageData]);
        }

        $handwerkData = $handwerkTemplate->fresh()->page_data ?? $handwerkPageData;
        $handwerkIndexPage = TemplatePage::firstOrCreate(
            [
                'template_id' => $handwerkTemplate->id,
                'slug' => 'index',
            ],
            [
                'name' => 'Startseite',
                'order' => 0,
                'data' => $handwerkData,
            ]
        );
        if ($handwerkNeedsUpdate) {
            $handwerkIndexPage->update(['data' => $handwerkData]);
        }
    }
}
