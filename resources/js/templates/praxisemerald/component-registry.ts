import type {
    LayoutComponentType,
    HeaderComponentData,
    FooterComponentData,
    HeroComponentData,
    MobileNavComponentData,
    AboutComponentData,
    HoursComponentData,
    CtaComponentData,
} from '@/types/layout-components';

export interface ComponentRegistryEntry {
    type: LayoutComponentType;
    label: string;
    placement: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    /** Kategorie für die Galerie (z. B. "Navigation", "Inhalt"). */
    category?: string;
}

const defaultHeaderData: HeaderComponentData = {
    links: [
        { href: '/', label: 'Startseite' },
        { href: '/team', label: 'Team' },
        { href: '/leistungen', label: 'Leistungen' },
        { href: '/patienteninformationen', label: 'Patienteninformationen' },
        { href: '/faq', label: 'FAQ' },
        { href: '/aktuelles', label: 'Aktuelles' },
        { href: '/notfallinformationen', label: 'Notfall' },
        { href: '/kontakt', label: 'Kontakt' },
    ],
    logoUrl: '/images/logo.png',
    logoAlt: 'Logo',
    siteName: 'Praxis Mustermann',
    ctaButtonText: 'Termin vereinbaren',
    ctaButtonHref: '',
};

const defaultFooterData: FooterComponentData = {
    siteName: 'Praxis Mustermann',
    description: 'Ihre Hausarztpraxis für Allgemeinmedizin, Vorsorge und Impfungen.',
    address: 'Musterstraße 1, 12345 Musterstadt',
    phone: '+49 123 4567890',
    email: 'info@praxis-mustermann.de',
    openingLine: 'Mo–Fr 08:00–12:00, Di/Do 15:00–18:00',
    linksSeiten: [
        { href: '/leistungen', label: 'Leistungen' },
        { href: '/team', label: 'Team' },
        { href: '/faq', label: 'FAQ' },
        { href: '/aktuelles', label: 'Aktuelles' },
        { href: '/kontakt', label: 'Kontakt' },
    ],
    linksRechtliches: [
        { href: '', label: 'Impressum' },
        { href: '', label: 'Datenschutz' },
    ],
    copyrightText: 'Praxis Mustermann',
    creditLine: 'Erstellt mit Praxishosting',
};

const defaultHeroData: HeroComponentData = {
    heading: 'Willkommen in der Praxis Mustermann',
    text: 'Ihre hausärztliche Versorgung mit Herz und Verstand – persönlich, modern und nah.',
    buttons: [
        { text: 'Termin anfragen', href: '', variant: 'default' },
        { text: 'Unsere Leistungen', href: '/leistungen', variant: 'outline' },
    ],
    image: { src: '/images/image1.webp', alt: 'Behandlungszimmer der Praxis Mustermann' },
};

const defaultMobileNavData: MobileNavComponentData = {
    links: defaultHeaderData.links,
};

const defaultAboutData: AboutComponentData = {
    heading: 'Kurzvorstellung',
    text: 'In unserer Praxis steht der Mensch im Mittelpunkt. Wir verbinden moderne Diagnostik mit individueller Betreuung und nehmen uns Zeit für Ihre Anliegen.',
    features: [
        { icon: 'Stethoscope', title: 'Allgemeinmedizin', desc: 'Hausärztliche Versorgung, akute und chronische Erkrankungen.' },
        { icon: 'Syringe', title: 'Impfungen', desc: 'Beratung und Durchführung aller empfohlenen Impfungen.' },
        { icon: 'ShieldCheck', title: 'Vorsorge', desc: 'Gesundheits-Check-ups, Krebsfrüherkennung, Hautkrebsscreening.' },
        { icon: 'HeartPulse', title: 'Diagnostik', desc: 'EKG, Langzeit-Blutdruck, Spirometrie, Laboruntersuchungen.' },
    ],
};

const defaultHoursData: HoursComponentData = {
    heading: 'Öffnungszeiten',
    icon: 'Clock',
    infoText: 'Bitte vereinbaren Sie nach Möglichkeit einen Termin. Akutsprechstunde täglich vormittags.',
    hours: [
        { day: 'Montag', hours: '08:00–12:00, 15:00–18:00' },
        { day: 'Dienstag', hours: '08:00–12:00' },
        { day: 'Mittwoch', hours: '08:00–12:00' },
        { day: 'Donnerstag', hours: '08:00–12:00, 15:00–18:00' },
        { day: 'Freitag', hours: '08:00–12:00' },
        { day: 'Samstag', hours: 'geschlossen' },
        { day: 'Sonntag', hours: 'geschlossen' },
    ],
};

const defaultCtaData: CtaComponentData = {
    heading: 'Neu bei uns?',
    text: 'Hier finden Sie Informationen für Ihren ersten Besuch, Anfahrt und was Sie mitbringen sollten.',
    links: [
        { text: 'Patienteninformationen', href: '/patienteninformationen', variant: 'primary' },
        { text: 'Leistungen ansehen', href: '/leistungen', variant: 'secondary' },
    ],
    image: { src: '/images/image2.webp', alt: 'Empfangsbereich der Praxis Mustermann' },
};

const defaultSectionData: Record<string, unknown> = {
    padding: true,
    direction: 'column',
    wrap: true,
    gap: '1rem',
    justify: 'start',
    align: 'stretch',
    contentWidth: 'full',
};

const defaultGridData: Record<string, unknown> = {
    columns: 'repeat(2, 1fr)',
    gap: '1rem',
};

const defaultFlexData: Record<string, unknown> = {
    direction: 'row',
    wrap: true,
    gap: '1rem',
    justify: 'start',
    align: 'stretch',
};

export const LAYOUT_COMPONENT_REGISTRY: ComponentRegistryEntry[] = [
    { type: 'header', label: 'Header', placement: 'above_main', defaultData: defaultHeaderData as Record<string, unknown>, category: 'Navigation & Layout' },
    { type: 'footer', label: 'Footer', placement: 'below_main', defaultData: defaultFooterData as Record<string, unknown>, category: 'Navigation & Layout' },
    { type: 'mobileNav', label: 'Mobile-Nav', placement: 'above_main', defaultData: defaultMobileNavData as Record<string, unknown>, category: 'Navigation & Layout' },
    { type: 'section', label: 'Bereich', placement: 'above_main', defaultData: defaultSectionData, acceptsChildren: true, category: 'Container' },
    { type: 'grid', label: 'Grid', placement: 'above_main', defaultData: defaultGridData, acceptsChildren: true, category: 'Container' },
    { type: 'flex', label: 'Flex-Container', placement: 'above_main', defaultData: defaultFlexData, acceptsChildren: true, category: 'Container' },
    { type: 'hero', label: 'Hero', placement: 'above_main', defaultData: defaultHeroData as Record<string, unknown>, category: 'Bereiche' },
    { type: 'about', label: 'Über uns', placement: 'above_main', defaultData: defaultAboutData as Record<string, unknown>, category: 'Bereiche' },
    { type: 'hours', label: 'Öffnungszeiten', placement: 'above_main', defaultData: defaultHoursData as Record<string, unknown>, category: 'Bereiche' },
    { type: 'cta', label: 'Call-to-Action', placement: 'above_main', defaultData: defaultCtaData as Record<string, unknown>, category: 'Bereiche' },
    { type: 'json', label: 'JSON / Benutzerdefiniert', placement: 'above_main', defaultData: {}, category: 'Sonstiges' },
];

const registryByType = new Map<LayoutComponentType, ComponentRegistryEntry>(
    LAYOUT_COMPONENT_REGISTRY.map((e) => [e.type, e]),
);

export function getComponentRegistryEntry(type: LayoutComponentType): ComponentRegistryEntry | undefined {
    return registryByType.get(type);
}

export function acceptsChildren(type: LayoutComponentType): boolean {
    return registryByType.get(type)?.acceptsChildren === true;
}

export function getDefaultDataForType(type: LayoutComponentType): Record<string, unknown> {
    const entry = registryByType.get(type);
    return entry ? { ...entry.defaultData } : {};
}

/** Generate a unique id for a new layout component entry. */
export function generateLayoutComponentId(): string {
    return `lc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Build layout_components array from legacy page_data (header, hero, about, hours, cta, footer).
 * Used for backward compatibility when layout_components is missing or incomplete.
 * Order: header, hero, about, hours, cta, footer (single flat list).
 */
export function buildLayoutComponentsFromLegacy(pageData: Record<string, unknown>): Array<{ id: string; type: LayoutComponentType; data: Record<string, unknown> }> {
    const components: Array<{ id: string; type: LayoutComponentType; data: Record<string, unknown> }> = [];
    if (pageData.header && typeof pageData.header === 'object') {
        components.push({ id: 'header_legacy', type: 'header', data: pageData.header as Record<string, unknown> });
    } else {
        components.push({ id: 'header_default', type: 'header', data: defaultHeaderData as Record<string, unknown> });
    }
    if (pageData.hero && typeof pageData.hero === 'object') {
        components.push({ id: 'hero_legacy', type: 'hero', data: pageData.hero as Record<string, unknown> });
    } else {
        components.push({ id: 'hero_default', type: 'hero', data: defaultHeroData as Record<string, unknown> });
    }
    if (pageData.about && typeof pageData.about === 'object') {
        components.push({ id: 'about_legacy', type: 'about', data: pageData.about as Record<string, unknown> });
    } else {
        components.push({ id: 'about_default', type: 'about', data: defaultAboutData as Record<string, unknown> });
    }
    if (pageData.hours && typeof pageData.hours === 'object') {
        components.push({ id: 'hours_legacy', type: 'hours', data: pageData.hours as Record<string, unknown> });
    } else {
        components.push({ id: 'hours_default', type: 'hours', data: defaultHoursData as Record<string, unknown> });
    }
    if (pageData.cta && typeof pageData.cta === 'object') {
        components.push({ id: 'cta_legacy', type: 'cta', data: pageData.cta as Record<string, unknown> });
    } else {
        components.push({ id: 'cta_default', type: 'cta', data: defaultCtaData as Record<string, unknown> });
    }
    if (pageData.footer && typeof pageData.footer === 'object') {
        components.push({ id: 'footer_legacy', type: 'footer', data: pageData.footer as Record<string, unknown> });
    } else {
        components.push({ id: 'footer_default', type: 'footer', data: defaultFooterData as Record<string, unknown> });
    }
    return components;
}
