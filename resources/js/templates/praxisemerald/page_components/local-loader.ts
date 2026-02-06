import type { Component } from 'vue';
import * as HeadingBlockMod from './HeadingBlock.vue';
import * as HtmlBlockMod from './HtmlBlock.vue';
import * as LinkListBlockMod from './LinkListBlock.vue';
import * as InfoBoxBlockMod from './InfoBoxBlock.vue';
import * as ListBlockMod from './ListBlock.vue';
import * as LogoRowBlockMod from './LogoRowBlock.vue';
import * as SingleStatBlockMod from './SingleStatBlock.vue';
import * as EmergencyCardBlockMod from './EmergencyCardBlock.vue';
import * as InfoSectionBlockMod from './InfoSectionBlock.vue';
import * as TeamCardBlockMod from './TeamCardBlock.vue';

type PageComponentMeta = {
    type: string;
    label: string;
    placement?: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    fields?: unknown[];
    category?: string;
};

type PageComponentModule = {
    default: Component;
    meta?: PageComponentMeta;
    Editor?: Component;
};

/** Template-specific page component modules (praxisemerald only). */
const modules: Record<string, PageComponentModule> = {
    './HeadingBlock.vue': HeadingBlockMod as PageComponentModule,
    './HtmlBlock.vue': HtmlBlockMod as PageComponentModule,
    './LinkListBlock.vue': LinkListBlockMod as PageComponentModule,
    './InfoBoxBlock.vue': InfoBoxBlockMod as PageComponentModule,
    './ListBlock.vue': ListBlockMod as PageComponentModule,
    './LogoRowBlock.vue': LogoRowBlockMod as PageComponentModule,
    './SingleStatBlock.vue': SingleStatBlockMod as PageComponentModule,
    './EmergencyCardBlock.vue': EmergencyCardBlockMod as PageComponentModule,
    './InfoSectionBlock.vue': InfoSectionBlockMod as PageComponentModule,
    './TeamCardBlock.vue': TeamCardBlockMod as PageComponentModule,
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

export function getPageComponentRegistry(): Array<PageComponentMeta & { Editor?: Component }> {
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
