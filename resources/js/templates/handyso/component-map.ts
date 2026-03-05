import type { Component } from 'vue';
import { getComponentRegistryEntry } from '@/templates/handyso/combined-registry';
import AboutBadge from '@/templates/handyso/components/about/AboutBadge.vue';
import AboutBullet from '@/templates/handyso/components/about/AboutBullet.vue';
import AboutButton from '@/templates/handyso/components/about/AboutButton.vue';
import AboutHeadline from '@/templates/handyso/components/about/AboutHeadline.vue';
import AboutImage1 from '@/templates/handyso/components/about/AboutImage1.vue';
import AboutImage2 from '@/templates/handyso/components/about/AboutImage2.vue';
import AboutSubheading from '@/templates/handyso/components/about/AboutSubheading.vue';
import AboutText from '@/templates/handyso/components/about/AboutText.vue';
import AboutHandymanBlock from '@/templates/handyso/components/AboutHandymanBlock.vue';
import AboutHandymanSection from '@/templates/handyso/components/AboutHandymanSection.vue';
import FeatureBannerText from '@/templates/handyso/components/feature/FeatureBannerText.vue';
import FeatureCard from '@/templates/handyso/components/feature/FeatureCard.vue';
import FeatureOfferingsBlock from '@/templates/handyso/components/FeatureOfferingsBlock.vue';
import FeatureOfferingsSection from '@/templates/handyso/components/FeatureOfferingsSection.vue';
import Footer from '@/templates/handyso/components/Footer.vue';
import Header from '@/templates/handyso/components/Header.vue';
import HeroButton from '@/templates/handyso/components/hero/HeroButton.vue';
import HeroHeadline from '@/templates/handyso/components/hero/HeroHeadline.vue';
import HeroImage from '@/templates/handyso/components/hero/HeroImage.vue';
import HeroReviews from '@/templates/handyso/components/hero/HeroReviews.vue';
import HeroServiceCard from '@/templates/handyso/components/hero/HeroServiceCard.vue';
import HeroSubheading from '@/templates/handyso/components/hero/HeroSubheading.vue';
import HeroText from '@/templates/handyso/components/hero/HeroText.vue';
import HeroHandyman from '@/templates/handyso/components/HeroHandyman.vue';
import HeroHandymanSection from '@/templates/handyso/components/HeroHandymanSection.vue';
import HowWeWorkHeadline from '@/templates/handyso/components/how-we-work/HowWeWorkHeadline.vue';
import HowWeWorkStep from '@/templates/handyso/components/how-we-work/HowWeWorkStep.vue';
import HowWeWorkSubheading from '@/templates/handyso/components/how-we-work/HowWeWorkSubheading.vue';
import HowWeWorkText from '@/templates/handyso/components/how-we-work/HowWeWorkText.vue';
import HowWeWorkBlock from '@/templates/handyso/components/HowWeWorkBlock.vue';
import HowWeWorkSection from '@/templates/handyso/components/HowWeWorkSection.vue';
import MobileNav from '@/templates/handyso/components/MobileNav.vue';
import UtilityHeader from '@/templates/handyso/components/UtilityHeader.vue';
import WhyChooseUsBenefit from '@/templates/handyso/components/why-choose-us/WhyChooseUsBenefit.vue';
import WhyChooseUsHeadline from '@/templates/handyso/components/why-choose-us/WhyChooseUsHeadline.vue';
import WhyChooseUsSubheading from '@/templates/handyso/components/why-choose-us/WhyChooseUsSubheading.vue';
import WhyChooseUsBlock from '@/templates/handyso/components/WhyChooseUsBlock.vue';
import WhyChooseUsSection from '@/templates/handyso/components/WhyChooseUsSection.vue';
import FlexContainerBlock from '@/templates/shared/components/FlexContainerBlock.vue';
import GridBlock from '@/templates/shared/components/GridBlock.vue';
import JsonBlock from '@/templates/shared/components/JsonBlock.vue';
import SectionBlock from '@/templates/shared/components/SectionBlock.vue';
import { getLayoutComponentFromPageComponents } from '@/templates/shared/page_components/loader';

export const LAYOUT_COMPONENT_MAP: Record<string, Component> = {
    utilityHeader: UtilityHeader,
    header: Header,
    mobileNav: MobileNav,
    heroHandyman: HeroHandyman,
    heroHandymanSection: HeroHandymanSection,
    heroSubheading: HeroSubheading,
    heroHeadline: HeroHeadline,
    heroText: HeroText,
    heroButton: HeroButton,
    heroReviews: HeroReviews,
    heroImage: HeroImage,
    heroServiceCard: HeroServiceCard,
    featureOfferings: FeatureOfferingsBlock,
    featureOfferingsSection: FeatureOfferingsSection,
    featureBannerText: FeatureBannerText,
    featureCard: FeatureCard,
    whyChooseUs: WhyChooseUsBlock,
    whyChooseUsSection: WhyChooseUsSection,
    whyChooseUsSubheading: WhyChooseUsSubheading,
    whyChooseUsHeadline: WhyChooseUsHeadline,
    whyChooseUsBenefit: WhyChooseUsBenefit,
    aboutHandyman: AboutHandymanBlock,
    aboutHandymanSection: AboutHandymanSection,
    aboutSubheading: AboutSubheading,
    aboutHeadline: AboutHeadline,
    aboutText: AboutText,
    aboutImage1: AboutImage1,
    aboutImage2: AboutImage2,
    aboutBadge: AboutBadge,
    aboutBullet: AboutBullet,
    aboutButton: AboutButton,
    howWeWork: HowWeWorkBlock,
    howWeWorkSection: HowWeWorkSection,
    howWeWorkSubheading: HowWeWorkSubheading,
    howWeWorkHeadline: HowWeWorkHeadline,
    howWeWorkText: HowWeWorkText,
    howWeWorkStep: HowWeWorkStep,
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
