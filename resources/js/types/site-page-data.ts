export interface SitePageDataColors {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    quinary: string;
}

export interface HeroButton {
    text: string;
    href: string;
    variant: string;
}

export interface HeroImage {
    src: string;
    alt: string;
}

export interface HeroData {
    heading: string;
    text: string;
    buttons: HeroButton[];
    image: HeroImage;
}

export interface AboutFeature {
    icon: string;
    title: string;
    desc: string;
}

export interface AboutData {
    heading: string;
    text: string;
    features: AboutFeature[];
}

export interface DayHours {
    day: string;
    hours: string;
}

export interface HoursData {
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

export interface CtaData {
    heading: string;
    text: string;
    links: CtaLink[];
    image: HeroImage;
}

import type { LayoutComponentEntry } from '@/types/layout-components';

export type { LayoutComponentEntry };

/** Per-page content when using multi-page support (custom_page_data.pages[slug]). */
export interface PageContent {
    layout_components?: LayoutComponentEntry[];
}

/** Per-page metadata (e.g. active). index must never be inactive. */
export interface PageMeta {
    active?: boolean;
}

/** Custom page definition (customer-added page). */
export interface CustomPageDefinition {
    slug: string;
    name: string;
    order: number;
}

export interface SitePageData {
    colors: SitePageDataColors;
    hero: HeroData;
    about: AboutData;
    hours: HoursData;
    cta: CtaData;
    layout_components?: LayoutComponentEntry[];
    /** Optional multi-page content. When set, index page may be in pages.index or root. */
    pages?: Record<string, PageContent>;
    /** Optional per-page metadata (e.g. active). Index must never be deactivated. */
    pages_meta?: Record<string, PageMeta>;
    /** Customer-added pages (dynamic slugs). */
    custom_pages?: CustomPageDefinition[];
}
