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
import { getComponentRegistryEntry } from '@/templates/praxisemerald/component-registry';

/** Erweiterbar: neue Komponenten hier eintragen (Typ in Registry + diese Map). */
export const LAYOUT_COMPONENT_MAP: Record<string, Component> = {
    header: Header,
    footer: Footer,
    hero: Hero,
    mobileNav: MobileNav,
    json: JsonBlock,
    section: SectionBlock,
    about: AboutBlock,
    hours: HoursBlock,
    cta: CtaBlock,
};

export function getLayoutComponent(type: string): Component | undefined {
    return LAYOUT_COMPONENT_MAP[type as LayoutComponentType];
}

export function getPlacementForType(type: string): 'above_main' | 'below_main' {
    const entry = getComponentRegistryEntry(type as LayoutComponentType);
    return entry?.placement ?? 'above_main';
}
