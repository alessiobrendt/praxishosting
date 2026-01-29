/**
 * Layout component entry: id, type, and type-specific data.
 * Stored in page_data.layout_components.
 */
export interface LayoutComponentEntry {
    id: string;
    type: LayoutComponentType;
    data: Record<string, unknown>;
}

export type LayoutComponentType = 'header' | 'footer' | 'hero' | 'mobileNav' | 'json';

export interface NavLink {
    href: string;
    label: string;
}

export interface HeaderComponentData {
    links: NavLink[];
    logoUrl: string;
    logoAlt: string;
    siteName: string;
    ctaButtonText: string;
    ctaButtonHref: string;
}

export interface FooterLink {
    href: string;
    label: string;
}

export interface FooterComponentData {
    siteName: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    openingLine: string;
    linksSeiten: FooterLink[];
    linksRechtliches: FooterLink[];
    copyrightText: string;
    creditLine: string;
}

export interface HeroButton {
    text: string;
    href: string;
    variant: string;
}

export interface HeroComponentData {
    heading: string;
    text: string;
    buttons: HeroButton[];
    image: { src: string; alt: string };
}

/** MobileNav uses same links as header; optional override. */
export interface MobileNavComponentData {
    links: NavLink[];
}
