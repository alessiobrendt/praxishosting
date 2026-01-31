import type { Component } from 'vue';
import type { LayoutComponentType } from '@/types/layout-components';
import Header from '@/templates/praxisemerald/components/Header.vue';
import Footer from '@/templates/praxisemerald/components/Footer.vue';
import Hero from '@/templates/praxisemerald/components/Hero.vue';
import MobileNav from '@/templates/praxisemerald/components/MobileNav.vue';
import JsonBlock from '@/templates/praxisemerald/components/JsonBlock.vue';
import AboutBlock from '@/templates/praxisemerald/components/AboutBlock.vue';
import HoursBlock from '@/templates/praxisemerald/components/HoursBlock.vue';
import CtaBlock from '@/templates/praxisemerald/components/CtaBlock.vue';
import SectionBlock from '@/templates/praxisemerald/components/SectionBlock.vue';
import GridBlock from '@/templates/praxisemerald/components/GridBlock.vue';
import FlexContainerBlock from '@/templates/praxisemerald/components/FlexContainerBlock.vue';
import { getLayoutComponentFromPageComponents } from '@/templates/praxisemerald/page_components/loader';
import { getComponentRegistryEntry } from '@/templates/praxisemerald/combined-registry';

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
