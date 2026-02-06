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
                    'id' => 'heroHandymanSection_1',
                    'type' => 'heroHandymanSection',
                    'data' => [],
                    'children' => [
                        ['id' => 'heroSubheading_1', 'type' => 'heroSubheading', 'data' => ['text' => 'Handyman & Repair Services']],
                        ['id' => 'heroHeadline_1', 'type' => 'heroHeadline', 'data' => ['text' => 'Choose Us for A Tidy Home And Peace Of Mind!']],
                        ['id' => 'heroText_1', 'type' => 'heroText', 'data' => ['text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.']],
                        ['id' => 'heroButton_1', 'type' => 'heroButton', 'data' => ['text' => 'Learn More', 'href' => '#']],
                        ['id' => 'heroReviews_1', 'type' => 'heroReviews', 'data' => ['text' => '4900+ Satisfied Reviews']],
                        ['id' => 'heroImage_1', 'type' => 'heroImage', 'data' => ['src' => '/images/handyso/hero.jpg', 'alt' => 'Handyman at work']],
                        ['id' => 'heroServiceCard_1', 'type' => 'heroServiceCard', 'data' => ['icon' => 'DoorOpen', 'title' => 'Door, Window & Floor Repairs', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                        ['id' => 'heroServiceCard_2', 'type' => 'heroServiceCard', 'data' => ['icon' => 'Home', 'title' => 'Exterior & Yard Care', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                        ['id' => 'heroServiceCard_3', 'type' => 'heroServiceCard', 'data' => ['icon' => 'Hammer', 'title' => 'Minor Carpentry & Home Fixes', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                        ['id' => 'heroServiceCard_4', 'type' => 'heroServiceCard', 'data' => ['icon' => 'Zap', 'title' => 'Electricity Service', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                        ['id' => 'heroServiceCard_5', 'type' => 'heroServiceCard', 'data' => ['icon' => 'Droplets', 'title' => 'Plumbing', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                        ['id' => 'heroServiceCard_6', 'type' => 'heroServiceCard', 'data' => ['icon' => 'Paintbrush', 'title' => 'Painting & Finishing', 'desc' => 'Facilisis nulla lacus at ultrices praesent.', 'readMoreHref' => '#']],
                    ],
                ],
                [
                    'id' => 'featureOfferingsSection_1',
                    'type' => 'featureOfferingsSection',
                    'data' => [],
                    'children' => [
                        ['id' => 'featureBannerText_1', 'type' => 'featureBannerText', 'data' => ['text' => 'Take Advantage Of These Offerings']],
                        ['id' => 'featureCard_1', 'type' => 'featureCard', 'data' => ['icon' => 'Wrench', 'title' => 'Tools Included', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.']],
                        ['id' => 'featureCard_2', 'type' => 'featureCard', 'data' => ['icon' => 'Calendar', 'title' => 'Easy Booking', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.']],
                        ['id' => 'featureCard_3', 'type' => 'featureCard', 'data' => ['icon' => 'ShieldCheck', 'title' => 'Service Quality', 'desc' => 'Facilisis nulla lacus at ultrices praesent scelerisque.']],
                    ],
                ],
                [
                    'id' => 'whyChooseUsSection_1',
                    'type' => 'whyChooseUsSection',
                    'data' => [],
                    'children' => [
                        ['id' => 'whyChooseUsSubheading_1', 'type' => 'whyChooseUsSubheading', 'data' => ['text' => 'Why Choose Us']],
                        ['id' => 'whyChooseUsHeadline_1', 'type' => 'whyChooseUsHeadline', 'data' => ['text' => 'Work With Us, Enjoy Total Peace Of Mind']],
                        ['id' => 'whyChooseUsBenefit_1', 'type' => 'whyChooseUsBenefit', 'data' => ['icon' => 'Wrench', 'title' => 'Minor Carpentry & Home Fixes']],
                        ['id' => 'whyChooseUsBenefit_2', 'type' => 'whyChooseUsBenefit', 'data' => ['icon' => 'Handshake', 'title' => 'Friendly & Professional Experts']],
                        ['id' => 'whyChooseUsBenefit_3', 'type' => 'whyChooseUsBenefit', 'data' => ['icon' => 'CheckCircle', 'title' => 'Reliable & Timely Service']],
                        ['id' => 'whyChooseUsBenefit_4', 'type' => 'whyChooseUsBenefit', 'data' => ['icon' => 'Clock', 'title' => '24/7 Emergency Services']],
                    ],
                ],
                [
                    'id' => 'aboutHandymanSection_1',
                    'type' => 'aboutHandymanSection',
                    'data' => [],
                    'children' => [
                        ['id' => 'aboutSubheading_1', 'type' => 'aboutSubheading', 'data' => ['text' => 'About Us']],
                        ['id' => 'aboutHeadline_1', 'type' => 'aboutHeadline', 'data' => ['text' => 'Get To Know Us, Trust That We Are Always Ready For Repair']],
                        ['id' => 'aboutText_1', 'type' => 'aboutText', 'data' => ['text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium amet dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.']],
                        ['id' => 'aboutImage1_1', 'type' => 'aboutImage1', 'data' => ['src' => '/images/handyso/about-1.jpg', 'alt' => 'Handyman at work']],
                        ['id' => 'aboutImage2_1', 'type' => 'aboutImage2', 'data' => ['src' => '/images/handyso/about-2.jpg', 'alt' => 'Exterior repair']],
                        ['id' => 'aboutBadge_1', 'type' => 'aboutBadge', 'data' => ['number' => '30+', 'label' => 'Years of Experience']],
                        ['id' => 'aboutBullet_1', 'type' => 'aboutBullet', 'data' => ['text' => 'Friendly & Transparent Service']],
                        ['id' => 'aboutBullet_2', 'type' => 'aboutBullet', 'data' => ['text' => 'Time & Energy Saved']],
                        ['id' => 'aboutBullet_3', 'type' => 'aboutBullet', 'data' => ['text' => 'Lasting Professional Results']],
                        ['id' => 'aboutBullet_4', 'type' => 'aboutBullet', 'data' => ['text' => 'Complete Peace of Mind']],
                        ['id' => 'aboutButton_1', 'type' => 'aboutButton', 'data' => ['text' => 'More About Us', 'href' => '#']],
                    ],
                ],
                [
                    'id' => 'howWeWorkSection_1',
                    'type' => 'howWeWorkSection',
                    'data' => [],
                    'children' => [
                        ['id' => 'howWeWorkSubheading_1', 'type' => 'howWeWorkSubheading', 'data' => ['text' => 'How We Work']],
                        ['id' => 'howWeWorkHeadline_1', 'type' => 'howWeWorkHeadline', 'data' => ['text' => "We Fixed It, And Now It's Perfect!"]],
                        ['id' => 'howWeWorkText_1', 'type' => 'howWeWorkText', 'data' => ['text' => 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum.']],
                        ['id' => 'howWeWorkStep_1', 'type' => 'howWeWorkStep', 'data' => ['number' => '01', 'imageSrc' => '/images/handyso/how-we-work-01.jpg', 'imageAlt' => 'Gutter cleaning', 'title' => 'Gutter Cleaning & Repair', 'desc' => 'Facilisis nulla lacus at ultrices praesent.']],
                        ['id' => 'howWeWorkStep_2', 'type' => 'howWeWorkStep', 'data' => ['number' => '02', 'imageSrc' => '/images/handyso/how-we-work-02.jpg', 'imageAlt' => 'Wall repair', 'title' => 'Living Room Wall Repair', 'desc' => 'Facilisis nulla lacus at ultrices praesent.']],
                        ['id' => 'howWeWorkStep_3', 'type' => 'howWeWorkStep', 'data' => ['number' => '03', 'imageSrc' => '/images/handyso/how-we-work-03.jpg', 'imageAlt' => 'Fence fix', 'title' => 'Wobbly Fence Fix', 'desc' => 'Facilisis nulla lacus at ultrices praesent.']],
                        ['id' => 'howWeWorkStep_4', 'type' => 'howWeWorkStep', 'data' => ['number' => '04', 'imageSrc' => '/images/handyso/how-we-work-04.jpg', 'imageAlt' => 'Final check', 'title' => 'Final Quality Check', 'desc' => 'Facilisis nulla lacus at ultrices praesent.']],
                    ],
                ],
                [
                    'id' => 'section_contact_1',
                    'type' => 'section',
                    'data' => [
                        'padding' => true,
                        'direction' => 'column',
                        'wrap' => true,
                        'gap' => '1rem',
                        'justify' => 'start',
                        'align' => 'stretch',
                        'contentWidth' => 'full',
                    ],
                    'children' => [
                        ['id' => 'sectionheader_contact_1', 'type' => 'sectionheader', 'data' => ['title' => 'Contact Us', 'subtitle' => 'Get in touch for a free quote or to schedule a repair.']],
                        ['id' => 'text_contact_1', 'type' => 'text', 'data' => ['content' => 'We are here to help with all your handyman and repair needs. Reach out via phone, email or visit us at our address.', 'align' => 'left']],
                        [
                            'id' => 'contactinfo_1',
                            'type' => 'contactinfo',
                            'data' => [
                                'address' => 'Musterstraße 1, 12345 Musterstadt',
                                'phone' => '(+86) 898 112 8103',
                                'email' => 'Handyso10@gmail.com',
                                'openingLine' => 'Mon–Fri 8:00–18:00',
                            ],
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
