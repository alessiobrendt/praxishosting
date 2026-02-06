import * as shared from '@/templates/shared/page_components/loader';
import * as local from './local-loader';

export type { PageComponentField, PageComponentMeta } from '@/templates/shared/page_components/loader';

export function getPageComponentRegistry(): ReturnType<typeof shared.getPageComponentRegistry> {
    return [...shared.getPageComponentRegistry(), ...local.getPageComponentRegistry()];
}

export function getLayoutComponentFromPageComponents(type: string): ReturnType<typeof shared.getLayoutComponentFromPageComponents> {
    return shared.getLayoutComponentFromPageComponents(type) ?? local.getLayoutComponentFromPageComponents(type);
}

export function getDefaultDataForTypeFromPageComponents(type: string): Record<string, unknown> {
    const fromShared = shared.getDefaultDataForTypeFromPageComponents(type);
    if (Object.keys(fromShared).length > 0) return fromShared;
    return local.getDefaultDataForTypeFromPageComponents(type);
}

export function getEditorForType(type: string): ReturnType<typeof shared.getEditorForType> {
    return shared.getEditorForType(type) ?? local.getEditorForType(type);
}

export function getMetaForType(type: string): ReturnType<typeof shared.getMetaForType> {
    return shared.getMetaForType(type) ?? local.getMetaForType(type);
}
