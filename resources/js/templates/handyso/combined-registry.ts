import {
    LAYOUT_COMPONENT_REGISTRY as STATIC_REGISTRY,
    getDefaultDataForType as getStaticDefaultDataForType,
    generateLayoutComponentId,
} from '@/templates/handyso/component-registry';
import {
    getPageComponentRegistry,
    getDefaultDataForTypeFromPageComponents,
} from '@/templates/praxisemerald/page_components/loader';

const pageRegistry = getPageComponentRegistry();

const pageRegistryNormalized = pageRegistry.map((e) => ({
    type: e.type,
    label: e.label,
    placement: (e.placement ?? 'above_main') as 'above_main' | 'below_main',
    defaultData: e.defaultData,
    acceptsChildren: e.acceptsChildren,
    category: e.category ?? 'Inhalt',
}));

export const LAYOUT_COMPONENT_REGISTRY = [...pageRegistryNormalized, ...STATIC_REGISTRY];

const registryByType = new Map(
    LAYOUT_COMPONENT_REGISTRY.map((e) => [e.type, e]),
);

export function getComponentRegistryEntry(type: string): (typeof LAYOUT_COMPONENT_REGISTRY)[number] | undefined {
    return registryByType.get(type);
}

export function acceptsChildren(type: string): boolean {
    return registryByType.get(type)?.acceptsChildren === true;
}

export function getDefaultDataForType(type: string): Record<string, unknown> {
    const fromPage = getDefaultDataForTypeFromPageComponents(type);
    if (Object.keys(fromPage).length > 0) return fromPage;
    return getStaticDefaultDataForType(type);
}

export { generateLayoutComponentId };
