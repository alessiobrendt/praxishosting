import type { Component } from 'vue';
import * as TextBlockMod from './TextBlock.vue';
import * as HeadingBlockMod from './HeadingBlock.vue';
import * as ImageBlockMod from './ImageBlock.vue';
import * as ButtonBlockMod from './ButtonBlock.vue';
import * as DividerBlockMod from './DividerBlock.vue';
import * as SpacerBlockMod from './SpacerBlock.vue';
import * as QuoteBlockMod from './QuoteBlock.vue';
import * as ListBlockMod from './ListBlock.vue';
import * as IconBoxBlockMod from './IconBoxBlock.vue';
import * as StatsBlockMod from './StatsBlock.vue';
import * as ImageTextBlockMod from './ImageTextBlock.vue';
import * as LinkListBlockMod from './LinkListBlock.vue';
import * as InfoBoxBlockMod from './InfoBoxBlock.vue';
import * as TwoColumnsBlockMod from './TwoColumnsBlock.vue';
import * as LogoRowBlockMod from './LogoRowBlock.vue';
import * as StepsBlockMod from './StepsBlock.vue';
import * as TimelineBlockMod from './TimelineBlock.vue';
import * as SocialLinksBlockMod from './SocialLinksBlock.vue';
import * as BreadcrumbBlockMod from './BreadcrumbBlock.vue';
import * as HtmlBlockMod from './HtmlBlock.vue';
import * as AnchorBlockMod from './AnchorBlock.vue';
import * as SingleStatBlockMod from './SingleStatBlock.vue';
import * as ButtonGroupBlockMod from './ButtonGroupBlock.vue';
import * as SectionHeaderBlockMod from './SectionHeaderBlock.vue';
import * as NewsCardBlockMod from './NewsCardBlock.vue';
import * as AccordionBlockMod from './AccordionBlock.vue';
import * as EmergencyCardBlockMod from './EmergencyCardBlock.vue';
import * as NoticeBlockMod from './NoticeBlock.vue';
import * as ContactInfoBlockMod from './ContactInfoBlock.vue';
import * as ContactFormBlockMod from './ContactFormBlock.vue';
import * as MapEmbedBlockMod from './MapEmbedBlock.vue';
import * as ServiceGroupBlockMod from './ServiceGroupBlock.vue';
import * as InfoSectionBlockMod from './InfoSectionBlock.vue';
import * as TeamCardBlockMod from './TeamCardBlock.vue';
import * as NewsletterBlockMod from './NewsletterBlock.vue';

export interface PageComponentField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'image' | 'number' | 'icon';
    options?: string[] | { value: string; label: string }[];
}

export interface PageComponentMeta {
    type: string;
    label: string;
    placement?: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    fields?: PageComponentField[];
    /** Kategorie für die Galerie (z. B. "Inhalt", "Bereiche"). */
    category?: string;
}

type PageComponentModule = {
    default: Component;
    meta?: PageComponentMeta;
    Editor?: Component;
};

/** Explicit list of page component modules (avoids glob 500 in Vite dev). Add new components here. */
const modules: Record<string, PageComponentModule> = {
    './TextBlock.vue': TextBlockMod as PageComponentModule,
    './HeadingBlock.vue': HeadingBlockMod as PageComponentModule,
    './ImageBlock.vue': ImageBlockMod as PageComponentModule,
    './ButtonBlock.vue': ButtonBlockMod as PageComponentModule,
    './DividerBlock.vue': DividerBlockMod as PageComponentModule,
    './SpacerBlock.vue': SpacerBlockMod as PageComponentModule,
    './QuoteBlock.vue': QuoteBlockMod as PageComponentModule,
    './ListBlock.vue': ListBlockMod as PageComponentModule,
    './IconBoxBlock.vue': IconBoxBlockMod as PageComponentModule,
    './StatsBlock.vue': StatsBlockMod as PageComponentModule,
    './ImageTextBlock.vue': ImageTextBlockMod as PageComponentModule,
    './LinkListBlock.vue': LinkListBlockMod as PageComponentModule,
    './InfoBoxBlock.vue': InfoBoxBlockMod as PageComponentModule,
    './TwoColumnsBlock.vue': TwoColumnsBlockMod as PageComponentModule,
    './LogoRowBlock.vue': LogoRowBlockMod as PageComponentModule,
    './StepsBlock.vue': StepsBlockMod as PageComponentModule,
    './TimelineBlock.vue': TimelineBlockMod as PageComponentModule,
    './SocialLinksBlock.vue': SocialLinksBlockMod as PageComponentModule,
    './BreadcrumbBlock.vue': BreadcrumbBlockMod as PageComponentModule,
    './HtmlBlock.vue': HtmlBlockMod as PageComponentModule,
    './AnchorBlock.vue': AnchorBlockMod as PageComponentModule,
    './SingleStatBlock.vue': SingleStatBlockMod as PageComponentModule,
    './ButtonGroupBlock.vue': ButtonGroupBlockMod as PageComponentModule,
    './SectionHeaderBlock.vue': SectionHeaderBlockMod as PageComponentModule,
    './NewsCardBlock.vue': NewsCardBlockMod as PageComponentModule,
    './AccordionBlock.vue': AccordionBlockMod as PageComponentModule,
    './EmergencyCardBlock.vue': EmergencyCardBlockMod as PageComponentModule,
    './NoticeBlock.vue': NoticeBlockMod as PageComponentModule,
    './ContactInfoBlock.vue': ContactInfoBlockMod as PageComponentModule,
    './ContactFormBlock.vue': ContactFormBlockMod as PageComponentModule,
    './MapEmbedBlock.vue': MapEmbedBlockMod as PageComponentModule,
    './ServiceGroupBlock.vue': ServiceGroupBlockMod as PageComponentModule,
    './InfoSectionBlock.vue': InfoSectionBlockMod as PageComponentModule,
    './TeamCardBlock.vue': TeamCardBlockMod as PageComponentModule,
    './NewsletterBlock.vue': NewsletterBlockMod as PageComponentModule,
};

const registry: Array<PageComponentMeta & { Editor?: Component }> = [];
const componentMap: Record<string, Component> = {};
const editorMap: Record<string, Component> = {};

for (const path of Object.keys(modules)) {
    const mod = modules[path];
    if (!mod?.meta) continue;
    const { type, label, placement = 'above_main', defaultData, acceptsChildren, fields, category } = mod.meta;
    registry.push({
        type,
        label,
        placement,
        defaultData: { ...defaultData },
        acceptsChildren,
        fields,
        category,
        Editor: mod.Editor,
    });
    componentMap[type] = mod.default;
    if (mod.Editor) editorMap[type] = mod.Editor;
}

export function getPageComponentRegistry(): Array<
    PageComponentMeta & { Editor?: Component }
> {
    return registry;
}

export function getLayoutComponentFromPageComponents(type: string): Component | undefined {
    return componentMap[type];
}

export function getDefaultDataForTypeFromPageComponents(type: string): Record<string, unknown> {
    const entry = registry.find((e) => e.type === type);
    return entry ? { ...entry.defaultData } : {};
}

export function getEditorForType(type: string): Component | undefined {
    return editorMap[type];
}

export function getMetaForType(type: string): (PageComponentMeta & { Editor?: Component }) | undefined {
    return registry.find((e) => e.type === type);
}
