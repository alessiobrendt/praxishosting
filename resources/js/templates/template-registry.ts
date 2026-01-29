import type { Component } from 'vue';
import {
    LAYOUT_COMPONENT_REGISTRY as PRAXISEMERALD_REGISTRY,
    getDefaultDataForType as praxisemeraldGetDefaultDataForType,
    generateLayoutComponentId as praxisemeraldGenerateLayoutComponentId,
} from '@/templates/praxisemerald/component-registry';

export interface ComponentRegistryAdapter {
    LAYOUT_COMPONENT_REGISTRY: Array<{ type: string; label: string; placement: string; defaultData: Record<string, unknown> }>;
    getDefaultDataForType: (type: string) => Record<string, unknown>;
    generateLayoutComponentId: () => string;
}

export interface TemplateRegistryEntry {
    slug: string;
    /** Layout component or loader returning Promise<{ default: Component }>. */
    Layout: Component | (() => Promise<{ default: Component }>);
    PageComponent: () => Promise<{ default: Component }>;
    getComponentRegistry?: () => ComponentRegistryAdapter;
    getDefaultPageData?: () => Record<string, unknown>;
    /** Optional template-specific site editor component or async loader. */
    SiteEditor?: Component | (() => Promise<{ default: Component }>);
}

const registry = new Map<string, TemplateRegistryEntry>();

function register(entry: TemplateRegistryEntry): void {
    registry.set(entry.slug, entry);
}

export function getTemplateEntry(slug: string | null | undefined): TemplateRegistryEntry | undefined {
    if (slug == null || slug === '') return undefined;
    return registry.get(slug);
}

const defaultColors = {
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ecfdf5',
    primaryDark: '#065f46',
    secondary: '#0f172a',
    tertiary: '#334155',
    quaternary: '#f8fafc',
    quinary: '#f1f5f9',
};

const praxisemeraldDefaultPageData: Record<string, unknown> = {
    colors: { ...defaultColors },
    hero: {
        heading: 'Willkommen in der Praxis Mustermann',
        text: 'Ihre hausÃ¤rztliche Versorgung mit Herz und Verstand â€“ persÃ¶nlich, modern und nah.',
        buttons: [
            { text: 'Termin anfragen', href: '', variant: 'default' },
            { text: 'Unsere Leistungen', href: '/leistungen', variant: 'outline' },
        ],
        image: { src: '/images/image1.webp', alt: 'Behandlungszimmer der Praxis Mustermann' },
    },
    about: {
        heading: 'Kurzvorstellung',
        text: 'In unserer Praxis steht der Mensch im Mittelpunkt. Wir verbinden moderne Diagnostik mit individueller Betreuung und nehmen uns Zeit fÃ¼r Ihre Anliegen.',
        features: [
            { icon: 'Stethoscope', title: 'Allgemeinmedizin', desc: 'HausÃ¤rztliche Versorgung, akute und chronische Erkrankungen.' },
            { icon: 'Syringe', title: 'Impfungen', desc: 'Beratung und DurchfÃ¼hrung aller empfohlenen Impfungen.' },
            { icon: 'ShieldCheck', title: 'Vorsorge', desc: 'Gesundheits-Check-ups, KrebsfrÃ¼herkennung, Hautkrebsscreening.' },
            { icon: 'HeartPulse', title: 'Diagnostik', desc: 'EKG, Langzeit-Blutdruck, Spirometrie, Laboruntersuchungen.' },
        ],
    },
    hours: {
        heading: 'Ã–ffnungszeiten',
        icon: 'Clock',
        infoText: 'Bitte vereinbaren Sie nach MÃ¶glichkeit einen Termin. Akutsprechstunde tÃ¤glich vormittags.',
        hours: [
            { day: 'Montag', hours: '08:00â€“12:00, 15:00â€“18:00' },
            { day: 'Dienstag', hours: '08:00â€“12:00' },
            { day: 'Mittwoch', hours: '08:00â€“12:00' },
            { day: 'Donnerstag', hours: '08:00â€“12:00, 15:00â€“18:00' },
            { day: 'Freitag', hours: '08:00â€“12:00' },
            { day: 'Samstag', hours: 'geschlossen' },
            { day: 'Sonntag', hours: 'geschlossen' },
        ],
    },
    cta: {
        heading: 'Neu bei uns?',
        text: 'Hier finden Sie Informationen fÃ¼r Ihren ersten Besuch, Anfahrt und was Sie mitbringen sollten.',
        links: [
            { text: 'Patienteninformationen', href: '/patienteninformationen', variant: 'primary' },
            { text: 'Leistungen ansehen', href: '/leistungen', variant: 'secondary' },
        ],
        image: { src: '/images/image2.webp', alt: 'Empfangsbereich der Praxis Mustermann' },
    },
};

/** Register Praxis Emerald template. */
function registerPraxisemerald(): void {
    register({
        slug: 'praxisemerald',
        Layout: () => import('@/templates/praxisemerald/PraxisemeraldLayout.vue'),
        PageComponent: () => import('@/templates/praxisemerald/pages/Index.vue'),
        SiteEditor: () => import('@/templates/praxisemerald/SiteEditor.vue'),
        getComponentRegistry: () => ({
            LAYOUT_COMPONENT_REGISTRY: PRAXISEMERALD_REGISTRY,
            getDefaultDataForType: praxisemeraldGetDefaultDataForType,
            generateLayoutComponentId: praxisemeraldGenerateLayoutComponentId,
        }),
        getDefaultPageData: () => ({ ...praxisemeraldDefaultPageData }),
    });
}

const handwerkDefaultColors = {
    primary: '#0d9488',
    primaryHover: '#0f766e',
    primaryLight: '#ccfbf1',
    primaryDark: '#134e4a',
    secondary: '#0f172a',
    tertiary: '#334155',
    quaternary: '#f8fafc',
    quinary: '#f1f5f9',
};

const handwerkDefaultPageData: Record<string, unknown> = {
    colors: { ...handwerkDefaultColors },
    hero: {
        heading: 'Ihr Handwerksbetrieb – Qualität und Service',
        text: 'Ihre Ansprechpartner vor Ort für alle Arbeiten. Zuverlässig, termingerecht und mit fairen Preisen.',
        buttons: [
            { text: 'Kontakt aufnehmen', href: '#kontakt', variant: 'default' },
            { text: 'Leistungen ansehen', href: '#leistungen', variant: 'outline' },
        ],
        image: { src: '/images/handwerk-hero.webp', alt: 'Handwerker bei der Arbeit' },
    },
    services: [
        { title: 'Reparatur & Wartung', shortDesc: 'Schnelle Hilfe bei Defekten und regelmäßige Wartung.' },
        { title: 'Neuinstallation', shortDesc: 'Fachgerechte Installation und Anschluss.' },
        { title: 'Beratung', shortDesc: 'Persönliche Beratung vor Ort zu Ihrem Projekt.' },
        { title: 'Notdienst', shortDesc: 'Erreichbar bei dringenden Notfällen.' },
    ],
    about: {
        heading: 'Über uns',
        text: 'Wir sind ein eingespieltes Team mit langjähriger Erfahrung. Qualität und Kundenzufriedenheit stehen bei uns an erster Stelle. Gerne beraten wir Sie unverbindlich.',
    },
    contact: {
        heading: 'Kontakt',
        text: 'Rufen Sie uns an oder schreiben Sie uns – wir melden uns zeitnah.',
        phone: '+49 123 456789',
        email: 'info@beispiel-handwerk.de',
        address: 'Musterstraße 1, 12345 Musterstadt',
        buttonText: 'Jetzt anfragen',
        buttonHref: '#kontakt',
    },
};

/** Register Handwerk template (landing page for crafts businesses). */
function registerHandwerk(): void {
    register({
        slug: 'handwerk',
        Layout: () => import('@/templates/handwerk/HandwerkLayout.vue'),
        PageComponent: () => import('@/templates/handwerk/pages/Index.vue'),
        SiteEditor: () => import('@/templates/handwerk/SiteEditor.vue'),
        getDefaultPageData: () => ({ ...handwerkDefaultPageData }),
    });
}

registerPraxisemerald();
registerHandwerk();
