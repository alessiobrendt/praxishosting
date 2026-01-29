import type {
    LayoutComponentType,
    HeaderComponentData,
    FooterComponentData,
    HeroComponentData,
    MobileNavComponentData,
} from '@/types/layout-components';

export interface ComponentRegistryEntry {
    type: LayoutComponentType;
    label: string;
    placement: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
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

export const LAYOUT_COMPONENT_REGISTRY: ComponentRegistryEntry[] = [
    { type: 'header', label: 'Header', placement: 'above_main', defaultData: defaultHeaderData as Record<string, unknown> },
    { type: 'footer', label: 'Footer', placement: 'below_main', defaultData: defaultFooterData as Record<string, unknown> },
    { type: 'hero', label: 'Hero', placement: 'above_main', defaultData: defaultHeroData as Record<string, unknown> },
    { type: 'mobileNav', label: 'Mobile-Nav', placement: 'above_main', defaultData: defaultMobileNavData as Record<string, unknown> },
    { type: 'json', label: 'JSON / Benutzerdefiniert', placement: 'above_main', defaultData: {} },
];

const registryByType = new Map<LayoutComponentType, ComponentRegistryEntry>(
    LAYOUT_COMPONENT_REGISTRY.map((e) => [e.type, e]),
);

export function getComponentRegistryEntry(type: LayoutComponentType): ComponentRegistryEntry | undefined {
    return registryByType.get(type);
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
 * Build layout_components array from legacy page_data (header, footer, hero).
 * Used for backward compatibility when layout_components is missing.
 * Order: above_main (header, hero) then below_main (footer). Main slot is rendered between them in the layout.
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
    if (pageData.footer && typeof pageData.footer === 'object') {
        components.push({ id: 'footer_legacy', type: 'footer', data: pageData.footer as Record<string, unknown> });
    } else {
        components.push({ id: 'footer_default', type: 'footer', data: defaultFooterData as Record<string, unknown> });
    }
    return components;
}
