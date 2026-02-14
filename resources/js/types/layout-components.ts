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

/**
 * Known layout component types (static blocks). Extended by string so that
 * types from page_components/*.vue (e.g. 'text') work without editing this file.
 */
export type LayoutComponentType =
    | 'header'
    | 'footer'
    | 'hero'
    | 'mobileNav'
    | 'json'
    | 'about'
    | 'hours'
    | 'cta'
    | 'section'
    | 'grid'
    | 'flex'
    | (string & Record<never, never>);

const CONTAINER_TYPES: LayoutComponentType[] = ['section', 'grid', 'flex'];

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

/**
 * Breakpoint-specific overrides for block data.
 * Base data = desktop, responsive.tablet = md (768px), responsive.mobile = sm/base (< 768px).
 */
export interface ResponsiveBlockData {
    responsive?: {
        tablet?: Record<string, unknown>;
        mobile?: Record<string, unknown>;
    };
}

export interface SectionComponentData extends ResponsiveBlockData {
    direction?: SectionFlexDirection;
    wrap?: boolean;
    gap?: string;
    justify?: SectionJustify;
    align?: SectionAlign;
    contentWidth?: SectionContentWidth;
    padding?: boolean;
    /** Innenabstand links (z. B. 1rem, 1.5rem). */
    paddingLeft?: string;
    /** Innenabstand rechts (z. B. 1rem, 1.5rem). */
    paddingRight?: string;
    /**
     * Hintergrundfarbe: leer/undefined = keine, 'var(--primary)' etc. = Seitenthema,
     * oder Hex/RGB für benutzerdefinierte Farbe.
     */
    backgroundColor?: string;
}

export interface GridComponentData extends ResponsiveBlockData {
    /** CSS grid-template-columns (z. B. "1fr 1fr", "repeat(3, 1fr)"). */
    columns?: string;
    /** Responsive columns: mobile-first approach */
    columnsSm?: string; // >= 640px
    columnsMd?: string; // >= 768px
    columnsLg?: string; // >= 1024px
    columnsXl?: string; // >= 1280px
    gap?: string;
    gapSm?: string;
    gapMd?: string;
    gapLg?: string;
    gapXl?: string;
    rowGap?: string;
    columnGap?: string;
    padding?: boolean;
    /** Innenabstand links (z. B. 1rem, 1.5rem). */
    paddingLeft?: string;
    /** Innenabstand rechts (z. B. 1rem, 1.5rem). */
    paddingRight?: string;
}

export interface FlexContainerComponentData extends ResponsiveBlockData {
    direction?: SectionFlexDirection;
    /** Responsive direction: mobile-first approach */
    directionSm?: SectionFlexDirection; // >= 640px
    directionMd?: SectionFlexDirection; // >= 768px
    directionLg?: SectionFlexDirection; // >= 1024px
    directionXl?: SectionFlexDirection; // >= 1280px
    wrap?: boolean;
    gap?: string;
    gapSm?: string;
    gapMd?: string;
    gapLg?: string;
    gapXl?: string;
    justify?: SectionJustify;
    justifySm?: SectionJustify;
    justifyMd?: SectionJustify;
    justifyLg?: SectionJustify;
    justifyXl?: SectionJustify;
    align?: SectionAlign;
    alignSm?: SectionAlign;
    alignMd?: SectionAlign;
    alignLg?: SectionAlign;
    alignXl?: SectionAlign;
    padding?: boolean;
    /** Innenabstand links (z. B. 1rem, 1.5rem). */
    paddingLeft?: string;
    /** Innenabstand rechts (z. B. 1rem, 1.5rem). */
    paddingRight?: string;
}
