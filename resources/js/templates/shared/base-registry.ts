import {
    getDefaultDataForTypeFromPageComponents,
} from '@/templates/shared/page_components/loader';

export const BASE_COMPONENT_TYPES = ['section', 'grid', 'text', 'image'] as const;

export type BaseComponentType = (typeof BASE_COMPONENT_TYPES)[number];

export interface BaseComponentRegistryEntry {
    type: string;
    label: string;
    placement: 'above_main' | 'below_main';
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    category?: string;
}

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

const baseRegistryEntries: BaseComponentRegistryEntry[] = [
    {
        type: 'section',
        label: 'Bereich',
        placement: 'above_main',
        defaultData: defaultSectionData,
        acceptsChildren: true,
        category: 'Container',
    },
    {
        type: 'grid',
        label: 'Grid',
        placement: 'above_main',
        defaultData: defaultGridData,
        acceptsChildren: true,
        category: 'Container',
    },
    {
        type: 'text',
        label: 'Text',
        placement: 'above_main',
        defaultData: getDefaultDataForTypeFromPageComponents('text'),
        category: 'Inhalt',
    },
    {
        type: 'image',
        label: 'Bild',
        placement: 'above_main',
        defaultData: getDefaultDataForTypeFromPageComponents('image'),
        category: 'Inhalt',
    },
];

export function getBaseComponentRegistry(): BaseComponentRegistryEntry[] {
    return [...baseRegistryEntries];
}

export function getDefaultDataForBaseType(type: string): Record<string, unknown> {
    const entry = baseRegistryEntries.find((e) => e.type === type);
    return entry ? { ...entry.defaultData } : {};
}
