export interface ComponentRegistryEntry {
    type: string;
    label: string;
    placement: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    category?: string;
}

const defaultUtilityHeaderData: Record<string, unknown> = {
    email: 'Handyso10@gmail.com',
    phone: '(+86)8981128103',
    seeAllServiceHref: '#service',
    seeAllServiceText: 'See All Service',
    socialLinks: [
        { name: 'Facebook', href: '#', icon: 'Facebook' },
        { name: 'Twitter', href: '#', icon: 'Twitter' },
        { name: 'LinkedIn', href: '#', icon: 'Linkedin' },
        { name: 'Instagram', href: '#', icon: 'Instagram' },
    ],
};

const defaultHeaderData: Record<string, unknown> = {
    links: [
        { href: '/', label: 'HOME' },
        { href: '/about', label: 'ABOUT US' },
        { href: '/service', label: 'SERVICE' },
        { href: '/pages', label: 'PAGES' },
        { href: '/blog', label: 'BLOG' },
        { href: '/contact', label: 'CONTACT US' },
    ],
    logoUrl: '/images/handyso/logo.png',
    logoAlt: 'HANDYSO',
    siteName: 'HANDYSO',
    ctaButtonText: 'Get Started',
    ctaButtonHref: '#',
};

const defaultMobileNavData: Record<string, unknown> = {
    links: (defaultHeaderData.links as { href: string; label: string }[]) ?? [],
};

/** Section types that render children at fixed slots; reorder only in sidebar. */
export const SLOT_CONTAINER_TYPES = [
    'heroHandymanSection',
    'featureOfferingsSection',
    'whyChooseUsSection',
    'aboutHandymanSection',
    'howWeWorkSection',
] as const;

export function isSlotContainer(type: string): boolean {
    return (SLOT_CONTAINER_TYPES as readonly string[]).includes(type);
}

const defaultHeroSubheadingData: Record<string, unknown> = { text: 'Handyman & Repair Services' };
const defaultHeroHeadlineData: Record<string, unknown> = {
    text: 'Choose Us for A Tidy Home And Peace Of Mind!',
};
const defaultHeroTextData: Record<string, unknown> = {
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
};
const defaultHeroButtonData: Record<string, unknown> = { text: 'Learn More', href: '#' };
const defaultHeroReviewsData: Record<string, unknown> = { text: '4900+ Satisfied Reviews' };
const defaultHeroImageData: Record<string, unknown> = {
    src: '/images/handyso/hero.jpg',
    alt: 'Handyman at work',
};
const defaultHeroServiceCardData: Record<string, unknown> = {
    icon: 'Hammer',
    title: 'Minor Carpentry & Home Fixes',
    desc: 'Facilisis nulla lacus at ultrices praesent.',
    readMoreHref: '#',
};

const defaultFeatureBannerTextData: Record<string, unknown> = {
    text: 'Take Advantage Of These Offerings',
};
const defaultFeatureCardData: Record<string, unknown> = {
    icon: 'Wrench',
    title: 'Tools Included',
    desc: 'Facilisis nulla lacus at ultrices praesent scelerisque.',
};

const defaultWhyChooseUsSubheadingData: Record<string, unknown> = { text: 'Why Choose Us' };
const defaultWhyChooseUsHeadlineData: Record<string, unknown> = {
    text: 'Work With Us, Enjoy Total Peace Of Mind',
};
const defaultWhyChooseUsBenefitData: Record<string, unknown> = {
    icon: 'Wrench',
    title: 'Minor Carpentry & Home Fixes',
};

const defaultAboutSubheadingData: Record<string, unknown> = { text: 'About Us' };
const defaultAboutHeadlineData: Record<string, unknown> = {
    text: 'Get To Know Us, Trust That We Are Always Ready For Repair',
};
const defaultAboutTextData: Record<string, unknown> = {
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium amet dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
};
const defaultAboutImage1Data: Record<string, unknown> = {
    src: '/images/handyso/about-1.jpg',
    alt: 'Handyman at work',
};
const defaultAboutImage2Data: Record<string, unknown> = {
    src: '/images/handyso/about-2.jpg',
    alt: 'Exterior repair',
};
const defaultAboutBadgeData: Record<string, unknown> = {
    number: '30+',
    label: 'Years of Experience',
};
const defaultAboutBulletData: Record<string, unknown> = {
    text: 'Friendly & Transparent Service',
};
const defaultAboutButtonData: Record<string, unknown> = {
    text: 'More About Us',
    href: '#',
};

const defaultHowWeWorkSubheadingData: Record<string, unknown> = { text: 'How We Work' };
const defaultHowWeWorkHeadlineData: Record<string, unknown> = {
    text: "We Fixed It, And Now It's Perfect!",
};
const defaultHowWeWorkTextData: Record<string, unknown> = {
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum.',
};
const defaultHowWeWorkStepData: Record<string, unknown> = {
    number: '01',
    imageSrc: '/images/handyso/how-we-work-01.jpg',
    imageAlt: 'Gutter cleaning',
    title: 'Gutter Cleaning & Repair',
    desc: 'Facilisis nulla lacus at ultrices praesent.',
};

const defaultFooterData: Record<string, unknown> = {
    siteName: 'HANDYSO',
    description: 'Handyman & Repair Services – Your peace of mind for a tidy home.',
    address: 'Musterstraße 1, 12345 Musterstadt',
    phone: '(+86)8981128103',
    email: 'Handyso10@gmail.com',
    linksSeiten: [
        { href: '/service', label: 'Service' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
    ],
    linksRechtliches: [
        { href: '#', label: 'Impressum' },
        { href: '#', label: 'Datenschutz' },
    ],
    copyrightText: 'HANDYSO',
    creditLine: 'Erstellt mit Praxishosting',
};

const defaultSectionData: Record<string, unknown> = {
    padding: true,
    direction: 'column',
    wrap: true,
    gap: '1rem',
    justify: 'start',
    align: 'stretch',
    contentWidth: 'full',
};

const defaultGridData: Record<string, unknown> = {
    columns: 'repeat(2, 1fr)',
    gap: '1rem',
};

const defaultFlexData: Record<string, unknown> = {
    direction: 'row',
    wrap: true,
    gap: '1rem',
    justify: 'start',
    align: 'stretch',
};

export const LAYOUT_COMPONENT_REGISTRY: ComponentRegistryEntry[] = [
    { type: 'utilityHeader', label: 'Utility-Header', placement: 'above_main', defaultData: defaultUtilityHeaderData, category: 'Navigation & Layout' },
    { type: 'header', label: 'Header', placement: 'above_main', defaultData: defaultHeaderData, category: 'Navigation & Layout' },
    { type: 'mobileNav', label: 'Mobile-Nav', placement: 'above_main', defaultData: defaultMobileNavData, category: 'Navigation & Layout' },
    { type: 'heroHandymanSection', label: 'Hero (Handwerker)', placement: 'above_main', defaultData: {}, acceptsChildren: true, category: 'Bereiche' },
    { type: 'heroSubheading', label: 'Hero Subheading', placement: 'above_main', defaultData: defaultHeroSubheadingData, category: 'Hero' },
    { type: 'heroHeadline', label: 'Hero Headline', placement: 'above_main', defaultData: defaultHeroHeadlineData, category: 'Hero' },
    { type: 'heroText', label: 'Hero Text', placement: 'above_main', defaultData: defaultHeroTextData, category: 'Hero' },
    { type: 'heroButton', label: 'Hero Button', placement: 'above_main', defaultData: defaultHeroButtonData, category: 'Hero' },
    { type: 'heroReviews', label: 'Hero Reviews', placement: 'above_main', defaultData: defaultHeroReviewsData, category: 'Hero' },
    { type: 'heroImage', label: 'Hero Image', placement: 'above_main', defaultData: defaultHeroImageData, category: 'Hero' },
    { type: 'heroServiceCard', label: 'Hero Service Card', placement: 'above_main', defaultData: defaultHeroServiceCardData, category: 'Hero' },
    { type: 'featureOfferingsSection', label: 'Feature-Angebote', placement: 'above_main', defaultData: {}, acceptsChildren: true, category: 'Bereiche' },
    { type: 'featureBannerText', label: 'Feature Banner Text', placement: 'above_main', defaultData: defaultFeatureBannerTextData, category: 'Feature' },
    { type: 'featureCard', label: 'Feature Card', placement: 'above_main', defaultData: defaultFeatureCardData, category: 'Feature' },
    { type: 'whyChooseUsSection', label: 'Warum wir', placement: 'above_main', defaultData: {}, acceptsChildren: true, category: 'Bereiche' },
    { type: 'whyChooseUsSubheading', label: 'Why Choose Us Subheading', placement: 'above_main', defaultData: defaultWhyChooseUsSubheadingData, category: 'Why Choose Us' },
    { type: 'whyChooseUsHeadline', label: 'Why Choose Us Headline', placement: 'above_main', defaultData: defaultWhyChooseUsHeadlineData, category: 'Why Choose Us' },
    { type: 'whyChooseUsBenefit', label: 'Why Choose Us Benefit', placement: 'above_main', defaultData: defaultWhyChooseUsBenefitData, category: 'Why Choose Us' },
    { type: 'aboutHandymanSection', label: 'Über uns', placement: 'above_main', defaultData: {}, acceptsChildren: true, category: 'Bereiche' },
    { type: 'aboutSubheading', label: 'About Subheading', placement: 'above_main', defaultData: defaultAboutSubheadingData, category: 'About' },
    { type: 'aboutHeadline', label: 'About Headline', placement: 'above_main', defaultData: defaultAboutHeadlineData, category: 'About' },
    { type: 'aboutText', label: 'About Text', placement: 'above_main', defaultData: defaultAboutTextData, category: 'About' },
    { type: 'aboutImage1', label: 'About Image 1', placement: 'above_main', defaultData: defaultAboutImage1Data, category: 'About' },
    { type: 'aboutImage2', label: 'About Image 2', placement: 'above_main', defaultData: defaultAboutImage2Data, category: 'About' },
    { type: 'aboutBadge', label: 'About Badge', placement: 'above_main', defaultData: defaultAboutBadgeData, category: 'About' },
    { type: 'aboutBullet', label: 'About Bullet', placement: 'above_main', defaultData: defaultAboutBulletData, category: 'About' },
    { type: 'aboutButton', label: 'About Button', placement: 'above_main', defaultData: defaultAboutButtonData, category: 'About' },
    { type: 'howWeWorkSection', label: 'So arbeiten wir', placement: 'above_main', defaultData: {}, acceptsChildren: true, category: 'Bereiche' },
    { type: 'howWeWorkSubheading', label: 'How We Work Subheading', placement: 'above_main', defaultData: defaultHowWeWorkSubheadingData, category: 'How We Work' },
    { type: 'howWeWorkHeadline', label: 'How We Work Headline', placement: 'above_main', defaultData: defaultHowWeWorkHeadlineData, category: 'How We Work' },
    { type: 'howWeWorkText', label: 'How We Work Text', placement: 'above_main', defaultData: defaultHowWeWorkTextData, category: 'How We Work' },
    { type: 'howWeWorkStep', label: 'How We Work Step', placement: 'above_main', defaultData: defaultHowWeWorkStepData, category: 'How We Work' },
    { type: 'section', label: 'Bereich', placement: 'above_main', defaultData: defaultSectionData, acceptsChildren: true, category: 'Container' },
    { type: 'grid', label: 'Grid', placement: 'above_main', defaultData: defaultGridData, acceptsChildren: true, category: 'Container' },
    { type: 'flex', label: 'Flex-Container', placement: 'above_main', defaultData: defaultFlexData, acceptsChildren: true, category: 'Container' },
    { type: 'footer', label: 'Footer', placement: 'below_main', defaultData: defaultFooterData, category: 'Navigation & Layout' },
    { type: 'json', label: 'JSON / Benutzerdefiniert', placement: 'above_main', defaultData: {}, category: 'Sonstiges' },
];

const registryByType = new Map<string, ComponentRegistryEntry>(
    LAYOUT_COMPONENT_REGISTRY.map((e) => [e.type, e]),
);

export function getComponentRegistryEntry(type: string): ComponentRegistryEntry | undefined {
    return registryByType.get(type);
}

export function acceptsChildren(type: string): boolean {
    return registryByType.get(type)?.acceptsChildren === true;
}

export function getDefaultDataForType(type: string): Record<string, unknown> {
    const entry = registryByType.get(type);
    return entry ? { ...entry.defaultData } : {};
}

export function generateLayoutComponentId(): string {
    return `lc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface DefaultLayoutEntry {
    id: string;
    type: string;
    data: Record<string, unknown>;
    children?: DefaultLayoutEntry[];
}

export function getDefaultLayoutComponents(): DefaultLayoutEntry[] {
    const heroChildren: DefaultLayoutEntry[] = [
        { id: 'heroSubheading_1', type: 'heroSubheading', data: { ...defaultHeroSubheadingData } },
        { id: 'heroHeadline_1', type: 'heroHeadline', data: { ...defaultHeroHeadlineData } },
        { id: 'heroText_1', type: 'heroText', data: { ...defaultHeroTextData } },
        { id: 'heroButton_1', type: 'heroButton', data: { ...defaultHeroButtonData } },
        { id: 'heroReviews_1', type: 'heroReviews', data: { ...defaultHeroReviewsData } },
        { id: 'heroImage_1', type: 'heroImage', data: { ...defaultHeroImageData } },
        { id: 'heroServiceCard_1', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'DoorOpen', title: 'Door, Window & Floor Repairs' } },
        { id: 'heroServiceCard_2', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'Home', title: 'Exterior & Yard Care' } },
        { id: 'heroServiceCard_3', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'Hammer', title: 'Minor Carpentry & Home Fixes' } },
        { id: 'heroServiceCard_4', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'Zap', title: 'Electricity Service' } },
        { id: 'heroServiceCard_5', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'Droplets', title: 'Plumbing' } },
        { id: 'heroServiceCard_6', type: 'heroServiceCard', data: { ...defaultHeroServiceCardData, icon: 'Paintbrush', title: 'Painting & Finishing' } },
    ];
    const featureChildren: DefaultLayoutEntry[] = [
        { id: 'featureBannerText_1', type: 'featureBannerText', data: { ...defaultFeatureBannerTextData } },
        { id: 'featureCard_1', type: 'featureCard', data: { ...defaultFeatureCardData, icon: 'Wrench', title: 'Tools Included' } },
        { id: 'featureCard_2', type: 'featureCard', data: { ...defaultFeatureCardData, icon: 'Calendar', title: 'Easy Booking' } },
        { id: 'featureCard_3', type: 'featureCard', data: { ...defaultFeatureCardData, icon: 'ShieldCheck', title: 'Service Quality' } },
    ];
    const whyChildren: DefaultLayoutEntry[] = [
        { id: 'whyChooseUsSubheading_1', type: 'whyChooseUsSubheading', data: { ...defaultWhyChooseUsSubheadingData } },
        { id: 'whyChooseUsHeadline_1', type: 'whyChooseUsHeadline', data: { ...defaultWhyChooseUsHeadlineData } },
        { id: 'whyChooseUsBenefit_1', type: 'whyChooseUsBenefit', data: { ...defaultWhyChooseUsBenefitData, icon: 'Wrench', title: 'Minor Carpentry & Home Fixes' } },
        { id: 'whyChooseUsBenefit_2', type: 'whyChooseUsBenefit', data: { ...defaultWhyChooseUsBenefitData, icon: 'Handshake', title: 'Friendly & Professional Experts' } },
        { id: 'whyChooseUsBenefit_3', type: 'whyChooseUsBenefit', data: { ...defaultWhyChooseUsBenefitData, icon: 'CheckCircle', title: 'Reliable & Timely Service' } },
        { id: 'whyChooseUsBenefit_4', type: 'whyChooseUsBenefit', data: { ...defaultWhyChooseUsBenefitData, icon: 'Clock', title: '24/7 Emergency Services' } },
    ];
    const aboutChildren: DefaultLayoutEntry[] = [
        { id: 'aboutSubheading_1', type: 'aboutSubheading', data: { ...defaultAboutSubheadingData } },
        { id: 'aboutHeadline_1', type: 'aboutHeadline', data: { ...defaultAboutHeadlineData } },
        { id: 'aboutText_1', type: 'aboutText', data: { ...defaultAboutTextData } },
        { id: 'aboutImage1_1', type: 'aboutImage1', data: { ...defaultAboutImage1Data } },
        { id: 'aboutImage2_1', type: 'aboutImage2', data: { ...defaultAboutImage2Data } },
        { id: 'aboutBadge_1', type: 'aboutBadge', data: { ...defaultAboutBadgeData } },
        { id: 'aboutBullet_1', type: 'aboutBullet', data: { ...defaultAboutBulletData, text: 'Friendly & Transparent Service' } },
        { id: 'aboutBullet_2', type: 'aboutBullet', data: { ...defaultAboutBulletData, text: 'Time & Energy Saved' } },
        { id: 'aboutBullet_3', type: 'aboutBullet', data: { ...defaultAboutBulletData, text: 'Lasting Professional Results' } },
        { id: 'aboutBullet_4', type: 'aboutBullet', data: { ...defaultAboutBulletData, text: 'Complete Peace of Mind' } },
        { id: 'aboutButton_1', type: 'aboutButton', data: { ...defaultAboutButtonData } },
    ];
    const howChildren: DefaultLayoutEntry[] = [
        { id: 'howWeWorkSubheading_1', type: 'howWeWorkSubheading', data: { ...defaultHowWeWorkSubheadingData } },
        { id: 'howWeWorkHeadline_1', type: 'howWeWorkHeadline', data: { ...defaultHowWeWorkHeadlineData } },
        { id: 'howWeWorkText_1', type: 'howWeWorkText', data: { ...defaultHowWeWorkTextData } },
        { id: 'howWeWorkStep_1', type: 'howWeWorkStep', data: { ...defaultHowWeWorkStepData, number: '01', imageSrc: '/images/handyso/how-we-work-01.jpg', imageAlt: 'Gutter cleaning', title: 'Gutter Cleaning & Repair' } },
        { id: 'howWeWorkStep_2', type: 'howWeWorkStep', data: { ...defaultHowWeWorkStepData, number: '02', imageSrc: '/images/handyso/how-we-work-02.jpg', imageAlt: 'Wall repair', title: 'Living Room Wall Repair' } },
        { id: 'howWeWorkStep_3', type: 'howWeWorkStep', data: { ...defaultHowWeWorkStepData, number: '03', imageSrc: '/images/handyso/how-we-work-03.jpg', imageAlt: 'Fence fix', title: 'Wobbly Fence Fix' } },
        { id: 'howWeWorkStep_4', type: 'howWeWorkStep', data: { ...defaultHowWeWorkStepData, number: '04', imageSrc: '/images/handyso/how-we-work-04.jpg', imageAlt: 'Final check', title: 'Final Quality Check' } },
    ];
    const sectionContactChildren: DefaultLayoutEntry[] = [
        { id: 'sectionheader_contact_1', type: 'sectionheader', data: { title: 'Contact Us', subtitle: 'Get in touch for a free quote or to schedule a repair.' } },
        { id: 'text_contact_1', type: 'text', data: { content: 'We are here to help with all your handyman and repair needs. Reach out via phone, email or visit us at our address.', align: 'left' } },
        {
            id: 'contactinfo_1',
            type: 'contactinfo',
            data: {
                address: 'Musterstraße 1, 12345 Musterstadt',
                phone: '(+86) 898 112 8103',
                email: 'Handyso10@gmail.com',
                openingLine: 'Mon–Fri 8:00–18:00',
            },
        },
    ];
    return [
        { id: 'utilityHeader_1', type: 'utilityHeader', data: { ...defaultUtilityHeaderData } },
        { id: 'header_1', type: 'header', data: { ...defaultHeaderData } },
        { id: 'mobileNav_1', type: 'mobileNav', data: { ...defaultMobileNavData } },
        { id: 'heroHandymanSection_1', type: 'heroHandymanSection', data: {}, children: heroChildren },
        { id: 'featureOfferingsSection_1', type: 'featureOfferingsSection', data: {}, children: featureChildren },
        { id: 'whyChooseUsSection_1', type: 'whyChooseUsSection', data: {}, children: whyChildren },
        { id: 'aboutHandymanSection_1', type: 'aboutHandymanSection', data: {}, children: aboutChildren },
        { id: 'howWeWorkSection_1', type: 'howWeWorkSection', data: {}, children: howChildren },
        { id: 'section_contact_1', type: 'section', data: { ...defaultSectionData }, children: sectionContactChildren },
        { id: 'footer_1', type: 'footer', data: { ...defaultFooterData } },
    ];
}
