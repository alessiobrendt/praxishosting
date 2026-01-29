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

export interface SitePageData {
    colors: SitePageDataColors;
    hero: HeroData;
    about: AboutData;
    hours: HoursData;
    cta: CtaData;
    layout_components?: LayoutComponentEntry[];
}
