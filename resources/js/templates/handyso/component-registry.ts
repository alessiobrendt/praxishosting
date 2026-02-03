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

const defaultHeroHandymanData: Record<string, unknown> = {
    subheading: 'Handyman & Repair Services',
    heading: 'Choose Us for A Tidy Home And Peace Of Mind!',
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
    buttonText: 'Learn More',
    buttonHref: '#',
    reviewsText: '4900+ Satisfied Reviews',
    heroImageSrc: '/images/handyso/hero.jpg',
    heroImageAlt: 'Handyman at work',
    services: [
        { icon: 'DoorOpen', title: 'Door, Window & Floor Repairs', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
        { icon: 'Home', title: 'Exterior & Yard Care', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
        { icon: 'Hammer', title: 'Minor Carpentry & Home Fixes', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
        { icon: 'Zap', title: 'Electricity Service', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
        { icon: 'Droplets', title: 'Plumbing', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
        { icon: 'Paintbrush', title: 'Painting & Finishing', desc: 'Facilisis nulla lacus at ultrices praesent.', readMoreHref: '#' },
    ],
};

const defaultFeatureOfferingsData: Record<string, unknown> = {
    bannerText: 'Take Advantage Of These Offerings',
    features: [
        { icon: 'Wrench', title: 'Tools Included', desc: 'Facilisis nulla lacus at ultrices praesent scelerisque.' },
        { icon: 'Calendar', title: 'Easy Booking', desc: 'Facilisis nulla lacus at ultrices praesent scelerisque.' },
        { icon: 'ShieldCheck', title: 'Service Quality', desc: 'Facilisis nulla lacus at ultrices praesent scelerisque.' },
    ],
};

const defaultWhyChooseUsData: Record<string, unknown> = {
    subheading: 'Why Choose Us',
    heading: 'Work With Us, Enjoy Total Peace Of Mind',
    benefits: [
        { icon: 'Wrench', title: 'Minor Carpentry & Home Fixes' },
        { icon: 'Handshake', title: 'Friendly & Professional Experts' },
        { icon: 'CheckCircle', title: 'Reliable & Timely Service' },
        { icon: 'Clock', title: '24/7 Emergency Services' },
    ],
};

const defaultAboutHandymanData: Record<string, unknown> = {
    subheading: 'About Us',
    heading: 'Get To Know Us, Trust That We Are Always Ready For Repair',
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium amet dapibus nullam at bibendum. Facilisis porttitor quam fames ac hendrerit pellentesque vestibulum porttitor.',
    image1Src: '/images/handyso/about-1.jpg',
    image1Alt: 'Handyman at work',
    image2Src: '/images/handyso/about-2.jpg',
    image2Alt: 'Exterior repair',
    badgeNumber: '30+',
    badgeLabel: 'Years of Experience',
    bullets: [
        'Friendly & Transparent Service',
        'Time & Energy Saved',
        'Lasting Professional Results',
        'Complete Peace of Mind',
    ],
    buttonText: 'More About Us',
    buttonHref: '#',
};

const defaultHowWeWorkData: Record<string, unknown> = {
    subheading: 'How We Work',
    heading: "We Fixed It, And Now It's Perfect!",
    text: 'Tristique pharetra nunc sed amet viverra non non libero. Eget turpis ac pretium dapibus nullam at bibendum.',
    steps: [
        { number: '01', imageSrc: '/images/handyso/how-we-work-01.jpg', imageAlt: 'Gutter cleaning', title: 'Gutter Cleaning & Repair', desc: 'Facilisis nulla lacus at ultrices praesent.' },
        { number: '02', imageSrc: '/images/handyso/how-we-work-02.jpg', imageAlt: 'Wall repair', title: 'Living Room Wall Repair', desc: 'Facilisis nulla lacus at ultrices praesent.' },
        { number: '03', imageSrc: '/images/handyso/how-we-work-03.jpg', imageAlt: 'Fence fix', title: 'Wobbly Fence Fix', desc: 'Facilisis nulla lacus at ultrices praesent.' },
        { number: '04', imageSrc: '/images/handyso/how-we-work-04.jpg', imageAlt: 'Final check', title: 'Final Quality Check', desc: 'Facilisis nulla lacus at ultrices praesent.' },
    ],
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
    { type: 'heroHandyman', label: 'Hero (Handwerker)', placement: 'above_main', defaultData: defaultHeroHandymanData, category: 'Bereiche' },
    { type: 'featureOfferings', label: 'Feature-Angebote', placement: 'above_main', defaultData: defaultFeatureOfferingsData, category: 'Bereiche' },
    { type: 'whyChooseUs', label: 'Warum wir', placement: 'above_main', defaultData: defaultWhyChooseUsData, category: 'Bereiche' },
    { type: 'aboutHandyman', label: 'Über uns', placement: 'above_main', defaultData: defaultAboutHandymanData, category: 'Bereiche' },
    { type: 'howWeWork', label: 'So arbeiten wir', placement: 'above_main', defaultData: defaultHowWeWorkData, category: 'Bereiche' },
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

export function getDefaultLayoutComponents(): Array<{ id: string; type: string; data: Record<string, unknown> }> {
    return [
        { id: 'utilityHeader_1', type: 'utilityHeader', data: { ...defaultUtilityHeaderData } },
        { id: 'header_1', type: 'header', data: { ...defaultHeaderData } },
        { id: 'mobileNav_1', type: 'mobileNav', data: { ...defaultMobileNavData } },
        { id: 'heroHandyman_1', type: 'heroHandyman', data: { ...defaultHeroHandymanData } },
        { id: 'featureOfferings_1', type: 'featureOfferings', data: { ...defaultFeatureOfferingsData } },
        { id: 'whyChooseUs_1', type: 'whyChooseUs', data: { ...defaultWhyChooseUsData } },
        { id: 'aboutHandyman_1', type: 'aboutHandyman', data: { ...defaultAboutHandymanData } },
        { id: 'howWeWork_1', type: 'howWeWork', data: { ...defaultHowWeWorkData } },
        { id: 'footer_1', type: 'footer', data: { ...defaultFooterData } },
    ];
}
