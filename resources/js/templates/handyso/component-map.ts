import type { Component } from 'vue';
import { getLayoutComponentFromPageComponents } from '@/templates/praxisemerald/page_components/loader';
import { getComponentRegistryEntry } from '@/templates/handyso/combined-registry';
import UtilityHeader from '@/templates/handyso/components/UtilityHeader.vue';
import Header from '@/templates/handyso/components/Header.vue';
import MobileNav from '@/templates/handyso/components/MobileNav.vue';
import HeroHandyman from '@/templates/handyso/components/HeroHandyman.vue';
import FeatureOfferingsBlock from '@/templates/handyso/components/FeatureOfferingsBlock.vue';
import WhyChooseUsBlock from '@/templates/handyso/components/WhyChooseUsBlock.vue';
import AboutHandymanBlock from '@/templates/handyso/components/AboutHandymanBlock.vue';
import HowWeWorkBlock from '@/templates/handyso/components/HowWeWorkBlock.vue';
import Footer from '@/templates/handyso/components/Footer.vue';
import SectionBlock from '@/templates/praxisemerald/components/SectionBlock.vue';
import GridBlock from '@/templates/praxisemerald/components/GridBlock.vue';
import FlexContainerBlock from '@/templates/praxisemerald/components/FlexContainerBlock.vue';
import JsonBlock from '@/templates/praxisemerald/components/JsonBlock.vue';

export const LAYOUT_COMPONENT_MAP: Record<string, Component> = {
    utilityHeader: UtilityHeader,
    header: Header,
    mobileNav: MobileNav,
    heroHandyman: HeroHandyman,
    featureOfferings: FeatureOfferingsBlock,
    whyChooseUs: WhyChooseUsBlock,
    aboutHandyman: AboutHandymanBlock,
    howWeWork: HowWeWorkBlock,
    footer: Footer,
    section: SectionBlock,
    grid: GridBlock,
    flex: FlexContainerBlock,
    json: JsonBlock,
};

export function getLayoutComponent(type: string): Component | undefined {
    const fromPage = getLayoutComponentFromPageComponents(type);
    if (fromPage) return fromPage;
    return LAYOUT_COMPONENT_MAP[type];
}

export function getPlacementForType(type: string): 'above_main' | 'below_main' {
    const entry = getComponentRegistryEntry(type);
    return entry?.placement ?? 'above_main';
}
