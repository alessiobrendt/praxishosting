import {
    LAYOUT_COMPONENT_REGISTRY as STATIC_REGISTRY,
    getDefaultDataForType as getStaticDefaultDataForType,
    generateLayoutComponentId,
} from '@/templates/handyso/component-registry';
import {
    getPageComponentRegistry,
    getDefaultDataForTypeFromPageComponents,
} from '@/templates/shared/page_components/loader';
import {
    BASE_COMPONENT_TYPES,
    getBaseComponentRegistry,
    getDefaultDataForBaseType,
} from '@/templates/shared/base-registry';

const baseRegistry = getBaseComponentRegistry();
const pageRegistry = getPageComponentRegistry();

const pageRegistryNormalized = pageRegistry
    .filter((e) => !BASE_COMPONENT_TYPES.includes(e.type as (typeof BASE_COMPONENT_TYPES)[number]))
    .map((e) => ({
        type: e.type,
        label: e.label,
        placement: (e.placement ?? 'above_main') as 'above_main' | 'below_main',
        defaultData: e.defaultData,
        acceptsChildren: e.acceptsChildren,
        category: e.category ?? 'Inhalt',
    }));

const staticWithoutBase = STATIC_REGISTRY.filter(
    (e) => !BASE_COMPONENT_TYPES.includes(e.type as (typeof BASE_COMPONENT_TYPES)[number]),
);

export const LAYOUT_COMPONENT_REGISTRY = [...baseRegistry, ...pageRegistryNormalized, ...staticWithoutBase];

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
    if (BASE_COMPONENT_TYPES.includes(type as (typeof BASE_COMPONENT_TYPES)[number])) {
        return getDefaultDataForBaseType(type);
    }
    const fromPage = getDefaultDataForTypeFromPageComponents(type);
    if (Object.keys(fromPage).length > 0) return fromPage;
    return getStaticDefaultDataForType(type);
}

export { generateLayoutComponentId };
