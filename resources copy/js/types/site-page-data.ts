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

/** Per-page SEO metadata. */
export interface PageSeo {
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical_url?: string;
    favicon_url?: string;
    robots?: string;
    twitter_card?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
}

/** Per-page metadata (e.g. active). index must never be inactive. */
export interface PageMeta {
    active?: boolean;
    seo?: PageSeo;
}

/** Custom page definition (customer-added page). */
export interface CustomPageDefinition {
    slug: string;
    name: string;
    order: number;
}

/** Global font settings (Design tab). Stored as CSS font-family or Tailwind font key. */
export interface GlobalFonts {
    heading?: string;
    body?: string;
}

/** Global button/form style defaults (Design tab). */
export interface GlobalButtonStyle {
    variant?: string;
    radius?: string;
    size?: string;
}

export interface SitePageData {
    colors: SitePageDataColors;
    /** Global font choices (heading, body). Optional. */
    global_fonts?: GlobalFonts;
    /** Global button/form defaults. Optional. */
    global_button_style?: GlobalButtonStyle;
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
