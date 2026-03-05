import type { Component } from 'vue';
import { getComponentRegistryEntry } from '@/templates/praxisemerald/combined-registry';
import AboutBlock from '@/templates/praxisemerald/components/AboutBlock.vue';
import CtaBlock from '@/templates/praxisemerald/components/CtaBlock.vue';
import Footer from '@/templates/praxisemerald/components/Footer.vue';
import Header from '@/templates/praxisemerald/components/Header.vue';
import Hero from '@/templates/praxisemerald/components/Hero.vue';
import HoursBlock from '@/templates/praxisemerald/components/HoursBlock.vue';
import MobileNav from '@/templates/praxisemerald/components/MobileNav.vue';
import { getLayoutComponentFromPageComponents } from '@/templates/praxisemerald/page_components/loader';
import FlexContainerBlock from '@/templates/shared/components/FlexContainerBlock.vue';
import GridBlock from '@/templates/shared/components/GridBlock.vue';
import JsonBlock from '@/templates/shared/components/JsonBlock.vue';
import SectionBlock from '@/templates/shared/components/SectionBlock.vue';
import type { LayoutComponentType } from '@/types/layout-components';

/** Statische Map (bestehende Komponenten). Page-Components aus Ordner werden vom Loader bereitgestellt. */
export const LAYOUT_COMPONENT_MAP: Record<string, Component> = {
    header: Header,
    footer: Footer,
    hero: Hero,
    mobileNav: MobileNav,
    json: JsonBlock,
    section: SectionBlock,
    grid: GridBlock,
    flex: FlexContainerBlock,
    about: AboutBlock,
    hours: HoursBlock,
    cta: CtaBlock,
};

export function getLayoutComponent(type: string): Component | undefined {
    const fromPage = getLayoutComponentFromPageComponents(type);
    if (fromPage) return fromPage;
    return LAYOUT_COMPONENT_MAP[type as LayoutComponentType];
}

export function getPlacementForType(type: string): 'above_main' | 'below_main' {
    const entry = getComponentRegistryEntry(type as LayoutComponentType);
    return entry?.placement ?? 'above_main';
}
