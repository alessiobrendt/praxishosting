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

    /**
     * Default page_data structure for handyso (handyman / repair services template).
     *
     * @return array<string, mixed>
     */
    public static function handysoPageData(): array
    {
        $defaultHeaderLinks = [
            ['href' => '/', 'label' => 'HOME'],
            ['href' => '/about', 'label' => 'ABOUT US'],
            ['href' => '/service', 'label' => 'SERVICE'],
            ['href' => '/pages', 'label' => 'PAGES'],
            ['href' => '/blog', 'label' => 'BLOG'],
            ['href' => '/contact', 'label' => 'CONTACT US'],
        ];

        return [
            'colors' => [
                'primary' => '#fd7f2b',
                'primaryHover' => '#e67220',
                'primaryLight' => '#fff4ed',
                'primaryDark' => '#010b1a',
                'secondary' => '#010b1a',
                'tertiary' => '#334155',
                'quaternary' => '#f8fafc',
                'quinary' => '#f1f5f9',
            ],
            'layout_components' => [
                [
                    'id' => 'utilityHeader_1',
                    'type' => 'utilityHeader',
                    'data' => [
                        'email' => 'Handyso10@gmail.com',
                        'phone' => '(+86)8981128103',
                        'seeAllServiceHref' => '#service',
                        'seeAllServiceText' => 'See All Service',
                        'socialLinks' => [
                            ['name' => 'Facebook', 'href' => '#', 'icon' => 'Facebook'],
                            ['name' => 'Twitter', 'href' => '#', 'icon' => 'Twitter'],
                            ['name' => 'LinkedIn', 'href' => '#', 'icon' => 'Linkedin'],
                            ['name' => 'Instagram', 'href' => '#', 'icon' => 'Instagram'],
                        ],
                    ],
                ],
                [
                    'id' => 'header_1',
                    'type' => 'header',
                    'data' => [
                        'links' => $defaultHeaderLinks,
                        'logoUrl' => '/images/handyso/logo.png',
                        'logoAlt' => 'HANDYSO',
                        'siteName' => 'HANDYSO',
                        'ctaButtonText' => 'Get Started',
                        'ctaButtonHref' => '#',
                    ],
                ],
                [
                    'id' => 'mobileNav_1',
                    'type' => 'mobileNav',
                    'data' => ['links' => $defaultHeaderLinks],
                ],
                [
                    'id' => 'heroHandyman_1',
                    'type' => 'heroHandyman',
                    'data' => [
                        'subheading' => 'Handyman & Repair Services',
                        'heading' => 'Choose Us for A Tidy Home And Peace Of Mind!',
                        'text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
                        'buttonText' => 'Learn More',
                        'buttonHref' => '#',
                        'reviewsText' => '4900+ Satisfied Reviews',
                        'heroImageSrc' => '/images/handyso/hero.jpg',
                        'heroImageAlt' => 'Handyman at work',
                        'services' => [
                            ['icon' => 'DoorOpen', 'title' => 'Door, Window & Floor Repairs', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                            ['icon' => 'Home', 'title' => 'Exterior & Yard Care', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                            ['icon' => 'Hammer', 'title' => 'Minor Carpentry & Home Fixes', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                            ['icon' => 'Zap', 'title' => 'Electricity Service', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                            ['icon' => 'Droplets', 'title' => 'Plumbing', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                            ['icon' => 'Paintbrush', 'title' => 'Painting & Finishing', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#'],
                        ],
                    ],
                ],
                [
                    'id' => 'featureOfferings_1',
                    'type' => 'featureOfferings',
                    'data' => [
                        'bannerText' => 'Take Advantage Of These Offerings',
                        'features' => [
                            ['icon' => 'Wrench', 'title' => 'Tools Included', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.'],
                            ['icon' => 'Calendar', 'title' => 'Easy Booking', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.'],
                            ['icon' => 'ShieldCheck', 'title' => 'Service Quality', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.'],
                        ],
                    ],
                ],
                [
                    'id' => 'whyChooseUs_1',
                    'type' => 'whyChooseUs',
                    'data' => [
                        'subheading' => 'Why Choose Us',
                        'heading' => 'Work With Us, Enjoy Total Peace Of Mind',
                        'benefits' => [
                            ['icon' => 'Wrench', 'title' => 'Minor Carpentry & Home Fixes'],
                            ['icon' => 'Handshake', 'title' => 'Friendly & Professional Experts'],
                            ['icon' => 'CheckCircle', 'title' => 'Reliable & Timely Service'],
                            ['icon' => 'Clock', 'title' => '24/7 Emergency Services'],
                        ],
                    ],
                ],
                [
                    'id' => 'aboutHandyman_1',
                    'type' => 'aboutHandyman',
                    'data' => [
                        'subheading' => 'About Us',
                        'heading' => 'Get To Know Us, Trust That We Are Always Ready For Repair',
                        'text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium amet dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
                        'image1Src' => '/images/handyso/about-1.jpg',
                        'image1Alt' => 'Handyman at work',
                        'image2Src' => '/images/handyso/about-2.jpg',
                        'image2Alt' => 'Exterior repair',
                        'badgeNumber' => '30+',
                        'badgeLabel' => 'Years of Experience',
                        'bullets' => [
                            'Friendly & Transparent Service',
                            'Time & Energy Saved',
                            'Lasting Professional Results',
                            'Complete Peace of Mind',
                        ],
                        'buttonText' => 'More About Us',
                        'buttonHref' => '#',
                    ],
                ],
                [
                    'id' => 'howWeWork_1',
                    'type' => 'howWeWork',
                    'data' => [
                        'subheading' => 'How We Work',
                        'heading' => "We Fixed It, And Now It's Perfect!",
                        'text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum.',
                        'steps' => [
                            ['number' => '01', 'imageSrc' => '/images/handyso/how-we-work-01.jpg', 'imageAlt' => 'Gutter cleaning', 'title' => 'Gutter Cleaning & Repair', 'desc' => 'Facilisis nulla lacus at ultrices praesent.'],
                            ['number' => '02', 'imageSrc' => '/images/handyso/how-we-work-02.jpg', 'imageAlt' => 'Wall repair', 'title' => 'Living Room Wall Repair', 'desc' => 'Facilisis nulla lacus at ultrices praesent.'],
                            ['number' => '03', 'imageSrc' => '/images/handyso/how-we-work-03.jpg', 'imageAlt' => 'Fence fix', 'title' => 'Wobbly Fence Fix', 'desc' => 'Facilisis nulla lacus at ultrices praesent.'],
                            ['number' => '04', 'imageSrc' => '/images/handyso/how-we-work-04.jpg', 'imageAlt' => 'Final check', 'title' => 'Final Quality Check', 'desc' => 'Facilisis nulla lacus at ultrices praesent.'],
                        ],
                    ],
                ],
                [
                    'id' => 'footer_1',
                    'type' => 'footer',
                    'data' => [
                        'siteName' => 'HANDYSO',
                        'description' => 'Handyman & Repair Services – Your peace of mind for a tidy home.',
                        'address' => 'Musterstraße 1, 12345 Musterstadt',
                        'phone' => '(+86)8981128103',
                        'email' => 'Handyso10@gmail.com',
                        'linksSeiten' => [
                            ['href' => '/service', 'label' => 'Service'],
                            ['href' => '/about', 'label' => 'About Us'],
                            ['href' => '/contact', 'label' => 'Contact'],
                        ],
                        'linksRechtliches' => [
                            ['href' => '#', 'label' => 'Impressum'],
                            ['href' => '#', 'label' => 'Datenschutz'],
                        ],
                        'copyrightText' => 'HANDYSO',
                        'creditLine' => 'Erstellt mit Praxishosting',
                    ],
                ],
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

        $handysoPageData = self::handysoPageData();
        $handysoTemplate = Template::firstOrCreate(
            ['slug' => 'handyso'],
            [
                'name' => 'Handyso',
                'page_data' => $handysoPageData,
                'preview_image' => null,
                'is_active' => true,
                'price' => 0,
            ]
        );

        $handysoNeedsUpdate = $handysoTemplate->wasRecentlyCreated || empty($handysoTemplate->page_data) || ! isset($handysoTemplate->page_data['colors']);
        if ($handysoNeedsUpdate) {
            $handysoTemplate->update(['page_data' => $handysoPageData]);
        }

        $handysoData = $handysoTemplate->fresh()->page_data ?? $handysoPageData;
        $handysoIndexPage = TemplatePage::firstOrCreate(
            [
                'template_id' => $handysoTemplate->id,
                'slug' => 'index',
            ],
            [
                'name' => 'Startseite',
                'order' => 0,
                'data' => $handysoData,
            ]
        );
        if ($handysoNeedsUpdate) {
            $handysoIndexPage->update(['data' => $handysoData]);
        }
    }
}
