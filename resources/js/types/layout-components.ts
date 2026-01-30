/**
 * Layout component entry: id, type, and type-specific data.
 * Stored in page_data.layout_components.
 * Optional children for container types (section, container).
 */
export interface LayoutComponentEntry {
    id: string;
    type: LayoutComponentType;
    data: Record<string, unknown>;
    children?: LayoutComponentEntry[];
}

export type LayoutComponentType =
    | 'header'
    | 'footer'
    | 'hero'
    | 'mobileNav'
    | 'json'
    | 'about'
    | 'hours'
    | 'cta'
    | 'section';

const CONTAINER_TYPES: LayoutComponentType[] = ['section'];

export function isContainerType(type: LayoutComponentType): boolean {
    return CONTAINER_TYPES.includes(type);
}

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

export interface AboutFeature {
    icon: string;
    title: string;
    desc: string;
}

export interface AboutComponentData {
    heading: string;
    text: string;
    features: AboutFeature[];
}

export interface DayHours {
    day: string;
    hours: string;
}

export interface HoursComponentData {
    heading: string;
    icon: string;
    infoText: string;
    hours: DayHours[];
}

export interface CtaLink {
    text: string;
    href: string;
    variant: string;
}

export interface CtaComponentData {
    heading: string;
    text: string;
    links: CtaLink[];
    image: { src: string; alt: string };
}

export type SectionFlexDirection = 'row' | 'column';
export type SectionJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type SectionAlign = 'start' | 'center' | 'end' | 'stretch';
export type SectionContentWidth = 'full' | 'boxed';

export interface SectionComponentData {
    direction?: SectionFlexDirection;
    wrap?: boolean;
    gap?: string;
    justify?: SectionJustify;
    align?: SectionAlign;
    contentWidth?: SectionContentWidth;
    padding?: boolean;
}
