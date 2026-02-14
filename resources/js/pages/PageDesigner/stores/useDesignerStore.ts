/**
 * Central designer state and actions. Composes useDesignerDraft, useDesignerSave, usePageDesignerHistory.
 * Used by PageDesigner.vue (shell) and Designer* components.
 */

import {
    ref,
    computed,
    watch,
    nextTick,
    defineAsyncComponent,
    type Ref,
    type ComputedRef,
} from 'vue';
import type { SitePageData, SitePageDataColors, GlobalFonts, GlobalButtonStyle } from '@/types/site-page-data';
import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { getTemplateEntry } from '@/templates/template-registry';
import { usePageDesignerHistory } from '@/composables/usePageDesignerHistory';
import { useDesignerDraft } from '@/pages/PageDesigner/composables/useDesignerDraft';
import { useDesignerSave } from '@/pages/PageDesigner/composables/useDesignerSave';
import { useDesignerPages } from '@/pages/PageDesigner/composables/useDesignerPages';
import { useDesignerColors } from '@/pages/PageDesigner/composables/useDesignerColors';
import { useDesignerFonts } from '@/pages/PageDesigner/composables/useDesignerFonts';
import {
    treeToFlat,
    flatToTree,
    normalizeDepthsAfterDrop,
    getSubtreeEndIndex,
    getPreviousSiblingStart,
    moveFlatSubtree,
} from '@/lib/layout-tree';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';
import PraxisemeraldLayoutComponentContextPanel from '@/templates/praxisemerald/LayoutComponentContextPanel.vue';
import { useSelectedBlockRect } from '@/pages/PageDesigner/composables/useSelectedBlockRect';
import { useDesignerMode } from '@/pages/PageDesigner/composables/useDesignerMode';
import { useDesignerOnboarding } from '@/pages/PageDesigner/composables/useDesignerOnboarding';

export type TemplatePageFromSite = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data?: Record<string, unknown> | null;
};

export type Template = {
    id: number;
    name: string;
    slug: string;
    page_data: SitePageData | null;
    pages?: TemplatePageFromSite[];
};

export type Site = {
    uuid: string;
    name: string;
    slug: string;
    custom_page_data: Partial<SitePageData> | null;
    custom_colors: Partial<SitePageDataColors> | null;
    favicon_url?: string | null;
    template: Template;
    updated_at?: string;
};

export type TemplatePageFromApi = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

export type TemplateWithPages = {
    id: number;
    name: string;
    slug: string;
    pages: TemplatePageFromApi[];
};

export type DesignerProps = {
    mode: 'site' | 'template';
    site?: Site;
    template?: TemplateWithPages;
    baseDomain: string;
};

const defaultColors: SitePageDataColors = {
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ecfdf5',
    primaryDark: '#065f46',
    secondary: '#0f172a',
    tertiary: '#334155',
    quaternary: '#f8fafc',
    quinary: '#f1f5f9',
};

function deepMergePreferNonEmpty<T extends Record<string, unknown>>(
    target: T,
    source: Record<string, unknown> | null | undefined,
): T {
    if (!source || typeof source !== 'object') return target;
    const out = { ...target } as T;
    for (const key of Object.keys(source)) {
        const src = source[key];
        if (src === undefined) continue;
        if (Array.isArray(src)) {
            if (src.length > 0) (out as Record<string, unknown>)[key] = [...src];
        } else if (src !== null && typeof src === 'object' && !Array.isArray(src) && key in out) {
            const existing = (out as Record<string, unknown>)[key];
            if (existing !== null && typeof existing === 'object' && !Array.isArray(existing)) {
                (out as Record<string, unknown>)[key] = deepMergePreferNonEmpty(
                    existing as Record<string, unknown>,
                    src as Record<string, unknown>,
                );
            }
        } else if (typeof src === 'string') {
            if (src.trim() !== '') (out as Record<string, unknown>)[key] = src;
        } else {
            (out as Record<string, unknown>)[key] = src;
        }
    }
    return out;
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function isValidLayoutEntry(e: unknown): e is LayoutComponentEntry {
    return (
        e !== null &&
        typeof e === 'object' &&
        typeof (e as LayoutComponentEntry).id === 'string' &&
        typeof (e as LayoutComponentEntry).type === 'string'
    );
}

function cleanLayoutTree(entries: LayoutComponentEntry[]): LayoutComponentEntry[] {
    return entries.filter(isValidLayoutEntry).map((e) => {
        const cloned: LayoutComponentEntry = {
            id: e.id,
            type: e.type,
            data: { ...(e.data ?? {}) },
        };
        if (acceptsChildren(e.type as LayoutComponentType)) {
            const raw = e.children;
            cloned.children = Array.isArray(raw) ? cleanLayoutTree(raw.filter(isValidLayoutEntry)) : [];
        }
        return cloned;
    });
}

import type { PageSlug } from '@/pages/PageDesigner/composables/useDesignerPages';
export type { PageSlug };

export function useDesignerStore(props: DesignerProps) {
    const isTemplateMode = computed(() => props.mode === 'template');
    const templateEntry = computed(() =>
        getTemplateEntry(isTemplateMode.value ? props.template?.slug : props.site?.template?.slug),
    );
    const registry = computed(() => templateEntry.value?.getComponentRegistry?.());
    const getAcceptsChildren = computed(() => registry.value?.acceptsChildren);
    const templateDefaultColors = computed((): Record<string, string> => {
        const data = templateEntry.value?.getDefaultPageData?.();
        const c = (data as Record<string, unknown>)?.colors as Record<string, string> | undefined;
        return (c && Object.keys(c).length > 0 ? c : defaultColors) as Record<string, string>;
    });

    function defaultLayoutComponents(): LayoutComponentEntry[] {
        const reg = registry.value;
        if (!reg) return [];
        return [
            { id: 'header_default', type: 'header', data: reg.getDefaultDataForType('header') },
            { id: 'footer_default', type: 'footer', data: reg.getDefaultDataForType('footer') },
        ];
    }

    const templatePagesLocal = ref<TemplatePageFromApi[]>([]);
    const fullCustomPageData = ref<Record<string, unknown>>({});
    const currentPageSlug = ref<string>('index');
    const pageData = ref<SitePageData | Record<string, unknown>>({
        colors: {},
        layout_components: [],
    });

    function mergePageDataForSlug(
        slug: string,
        custom: Record<string, unknown>,
    ): SitePageData | Record<string, unknown> {
        const site = props.site!;
        const templateData = (site.template?.page_data ?? {}) as Record<string, unknown>;
        const defaultBase = (templateEntry.value?.getDefaultPageData?.() ?? templateData ?? {}) as Record<string, unknown>;
        const base = deepMergePreferNonEmpty(defaultBase, templateData) as Record<string, unknown>;
        let customColors = (custom.colors as Record<string, string> | undefined) ?? site.custom_colors ?? undefined;
        if (customColors && customColors === site.custom_colors && customColors.primary === defaultColors.primary) {
            customColors = undefined;
        }
        const templatePages = (site.template?.pages ?? []) as TemplatePageFromSite[];
        const hasTemplatePage = slug === 'index' || templatePages.some((p) => p.slug === slug);

        if (slug === 'index') {
            const merged = deepMergePreferNonEmpty(base, custom) as Record<string, unknown>;
            const indexTemplatePage = templatePages.find((p) => p.slug === 'index');
            const fromTemplatePage = indexTemplatePage?.data as Record<string, unknown> | undefined;
            const templateLayoutFromPage = Array.isArray(fromTemplatePage?.layout_components)
                ? (fromTemplatePage.layout_components as LayoutComponentEntry[])
                : [];
            const templateLayout =
                templateLayoutFromPage.length > 0
                    ? templateLayoutFromPage
                    : Array.isArray(templateData.layout_components)
                      ? (templateData.layout_components as LayoutComponentEntry[])
                      : [];
            const customLayout = Array.isArray(custom.layout_components) ? custom.layout_components : [];
            const layout_components =
                customLayout.length > 0
                    ? customLayout
                    : templateLayout.length > 0
                      ? templateLayout
                      : defaultLayoutComponents();
            return {
                ...merged,
                colors: { ...templateDefaultColors.value, ...(customColors ?? {}) },
                layout_components:
                    (layout_components?.length ?? 0) > 0
                        ? layout_components
                        : (merged.layout_components ?? defaultLayoutComponents()),
            } as SitePageData;
        }

        const customPagesMap = (custom.pages ?? {}) as Record<string, { layout_components?: LayoutComponentEntry[] }>;
        const customPage = customPagesMap[slug];
        let templateLayout: LayoutComponentEntry[] = [];
        if (hasTemplatePage) {
            const templatePage = templatePages.find((p) => p.slug === slug);
            const pageDataFromTpl = templatePage?.data as Record<string, { layout_components?: LayoutComponentEntry[] }> | undefined;
            templateLayout = Array.isArray(pageDataFromTpl?.layout_components) ? pageDataFromTpl.layout_components : [];
        }
        const customLayout = Array.isArray(customPage?.layout_components) ? customPage.layout_components : [];
        const layout_components =
            customLayout.length > 0
                ? customLayout
                : templateLayout.length > 0
                  ? templateLayout
                  : defaultLayoutComponents();
        return {
            colors: { ...templateDefaultColors.value, ...(customColors ?? {}) },
            layout_components:
                (layout_components?.length ?? 0) > 0 ? layout_components : defaultLayoutComponents(),
        } as SitePageData;
    }

    if (isTemplateMode.value && props.template?.pages?.length) {
        templatePagesLocal.value = JSON.parse(JSON.stringify(props.template.pages));
        const sorted = [...templatePagesLocal.value].sort((a, b) => a.order - b.order);
        const first = sorted[0];
        if (first) {
            currentPageSlug.value = first.slug;
            if (!first.data) first.data = {};
            const data = first.data as Record<string, unknown>;
            if (!Array.isArray(data.layout_components) || data.layout_components.length === 0) {
                data.layout_components = defaultLayoutComponents();
            }
            const stored = (data.colors ?? {}) as Record<string, string>;
            const isStaleColors = stored.primary === defaultColors.primary;
            data.colors = isStaleColors ? { ...templateDefaultColors.value } : { ...templateDefaultColors.value, ...stored };
            pageData.value = data as SitePageData;
        }
    } else if (!isTemplateMode.value && props.site) {
        const initial = (props.site.custom_page_data ?? {}) as Record<string, unknown>;
        const siteColors = (props.site.custom_colors ?? {}) as Record<string, string>;
        fullCustomPageData.value = {
            ...initial,
            custom_pages: (initial.custom_pages as { slug: string; name: string; order: number }[] | undefined) ?? [],
            colors: { ...templateDefaultColors.value, ...siteColors },
        };
        pageData.value = mergePageDataForSlug('index', fullCustomPageData.value);
    }

    const { canUndo, canRedo, isApplying, pushHistory, undo: performUndo, redo: performRedo } =
        usePageDesignerHistory(() => fullCustomPageData.value);

    const draft = useDesignerDraft({
        getFullCustomPageData: () => fullCustomPageData.value,
        getSite: () => props.site,
        isTemplateMode: () => isTemplateMode.value,
        getCsrfToken,
    });

    const siteUpdatedAt = ref<string | null>(props.site?.updated_at ?? null);
    const siteFaviconUrl = ref<string | null>(props.site?.favicon_url ?? null);
    const save = useDesignerSave({
        getFullCustomPageData: () => fullCustomPageData.value,
        getSite: () => props.site,
        getSiteFaviconUrl: () => siteFaviconUrl.value,
        getTemplate: () => props.template,
        isTemplateMode: () => isTemplateMode.value,
        getCurrentPageSlug: () => currentPageSlug.value,
        getPageData: () => pageData.value as Record<string, unknown>,
        getCsrfToken,
        pushPreviewDraft: draft.pushPreviewDraft,
        getUpdatedAt: () => siteUpdatedAt.value,
        setUpdatedAt: (v) => {
            siteUpdatedAt.value = v;
        },
    });

    const selectedModuleId = ref<string | null>(null);
    const addPageModalOpen = ref(false);
    const newPageName = ref('');
    const newPageSlug = ref('');
    const justAppliedUndoRedo = ref(false);

    const pages = useDesignerPages({
        props,
        fullCustomPageData,
        currentPageSlug,
        pageData,
        templatePagesLocal,
        isTemplateMode,
        templateDefaultColors,
        pushHistory,
        pushPreviewDraft: draft.pushPreviewDraft,
        mergePageDataForSlug,
        defaultLayoutComponents,
        selectedModuleId,
        addPageModalOpen,
        newPageName,
        newPageSlug,
    });

    const colors = useDesignerColors({
        pageData,
        fullCustomPageData,
        currentPageSlug,
        templateDefaultColors,
        isTemplateMode,
        pushHistory,
        pushPreviewDraft: draft.pushPreviewDraft,
        mergePageDataForSlug,
    });

    const fonts = useDesignerFonts({
        pageData,
        fullCustomPageData,
        currentPageSlug,
        isTemplateMode,
        pushHistory,
        mergePageDataForSlug,
        getPreviewColors: () => colors.previewColors.value,
    });

    const sitePagesList = pages.sitePagesList;
    const templatePagesList = pages.templatePagesList;

    function getLayoutForPage(slug: string): LayoutComponentEntry[] {
        if (isTemplateMode.value) {
            const page = templatePagesLocal.value.find((p) => p.slug === slug);
            const layout = (page?.data as { layout_components?: LayoutComponentEntry[] } | undefined)
                ?.layout_components;
            return Array.isArray(layout) ? layout : [];
        }
        const merged = mergePageDataForSlug(slug, fullCustomPageData.value);
        const layout = (merged as { layout_components?: LayoutComponentEntry[] }).layout_components;
        return Array.isArray(layout) ? layout : [];
    }

    function syncLayoutComponentsToFullCustom(layout: LayoutComponentEntry[]): void {
        if (isTemplateMode.value) {
            (pageData.value as Record<string, unknown>).layout_components = layout;
            return;
        }
        const slug = currentPageSlug.value;
        if (slug === 'index') {
            fullCustomPageData.value = { ...fullCustomPageData.value, layout_components: layout };
        } else {
            const pages = { ...((fullCustomPageData.value.pages as Record<string, unknown>) ?? {}) };
            pages[slug] = { ...(pages[slug] as Record<string, unknown> ?? {}), layout_components: layout };
            fullCustomPageData.value = { ...fullCustomPageData.value, pages };
        }
    }

    function applySnapshot(snapshot: Record<string, unknown>): void {
        justAppliedUndoRedo.value = true;
        fullCustomPageData.value = { ...snapshot };
        pageData.value = mergePageDataForSlug(currentPageSlug.value as PageSlug, fullCustomPageData.value);
        draft.pushPreviewDraft();
        setTimeout(() => {
            justAppliedUndoRedo.value = false;
        }, 800);
    }

    function undo(): void {
        if (isTemplateMode.value) return;
        const result = performUndo();
        if (result) {
            applySnapshot(result.snapshot);
            nextTick(result.done);
        }
    }

    function redo(): void {
        if (isTemplateMode.value) return;
        const result = performRedo();
        if (result) {
            applySnapshot(result.snapshot);
            nextTick(result.done);
        }
    }

    const layoutComponents = computed({
        get: () => (pageData.value as SitePageData).layout_components ?? [],
        set: (val) => {
            (pageData.value as SitePageData).layout_components = val;
            syncLayoutComponentsToFullCustom(val);
        },
    });

    function scheduleLayoutUpdate(apply: () => void): void {
        nextTick(() => nextTick(apply));
    }

    function findEntryById(tree: LayoutComponentEntry[], id: string): LayoutComponentEntry | null {
        for (const entry of tree) {
            if (entry.id === id) return entry;
            const c = entry.children;
            if (Array.isArray(c)) {
                const found = findEntryById(c, id);
                if (found) return found;
            }
        }
        return null;
    }

    const selectedEntry = computed(() => {
        const id = selectedModuleId.value;
        if (!id) return null;
        return findEntryById(layoutComponents.value, id) ?? null;
    });

    const layoutComponentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();
    const layoutComponent = computed(() => {
        const e = templateEntry.value;
        if (!e?.Layout) return null;
        const slug = isTemplateMode.value ? props.template?.slug : props.site?.template?.slug;
        const key = slug ?? '__default__';
        let comp = layoutComponentCache.get(key);
        if (!comp) {
            comp = defineAsyncComponent(e.Layout as () => Promise<{ default: import('vue').Component }>);
            layoutComponentCache.set(key, comp);
        }
        return comp;
    });

    const previewColors = colors.previewColors;
    const previewStyles = fonts.previewStyles;

    const mediaLibraryOpen = ref(false);
    const componentGalleryOpen = ref(false);
    const mediaLibraryCallback = ref<((url: string) => void) | null>(null);
    const showTreeInSidebar = ref(false);
    const leftSidebarTab = ref<'struktur' | 'seiten' | 'seo' | 'medien' | 'design' | 'einstellungen'>('struktur');
    const leftSidebarContentOpen = ref(true);
    const designSection = ref<'farben' | 'schriftarten' | 'button' | null>(null);
    const colorPickerKey = colors.colorPickerKey;
    const colorInputRef = colors.colorInputRef;
    const componentGalleryInsertAtEnd = ref(false);
    const previewViewport = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
    const previewFullscreen = ref(false);
    const layoutDragStartSnapshot = ref<LayoutComponentEntry[] | null>(null);
    const copiedBlockRef = ref<LayoutComponentEntry | null>(null);
    const autosaveEnabled = ref(true);

    const currentPageSeo = pages.currentPageSeo;

    const leftSidebarPanelWidthClass = computed(() => {
        if (leftSidebarTab.value === 'design' && designSection.value !== null) return 'w-[400px]';
        if (leftSidebarTab.value === 'seo' || leftSidebarTab.value === 'einstellungen') return 'w-[320px]';
        return 'w-[280px]';
    });

    const previewWrapperClass = computed(() => {
        switch (previewViewport.value) {
            case 'tablet':
                return 'max-w-[768px]';
            case 'mobile':
                return 'max-w-[375px]';
            default:
                return 'min-w-[1280px] w-full px-4';
        }
    });

    const draftSavedLabel = computed(() => {
        if (isTemplateMode.value) return null;
        const at = draft.draftSavedAt.value;
        if (!at) return null;
        const d = new Date(at);
        return `Entwurf gespeichert um ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    const activeColors = colors.activeColors;
    const activeGlobalFonts = fonts.activeGlobalFonts;
    const activeGlobalButtonStyle = fonts.activeGlobalButtonStyle;

    const pageTitle = computed(() =>
        isTemplateMode.value
            ? `Template-Standard: ${props.template?.name ?? 'Design'}`
            : `Page Designer: ${props.site?.name ?? ''}`,
    );

    const displayName = computed(() => (isTemplateMode.value ? props.template?.name : props.site?.name) ?? '');

    const getPageLabel = pages.getPageLabel;
    const isCustomPage = pages.isCustomPage;
    const getPageSourceBadge = pages.getPageSourceBadge;
    const isPageActive = pages.isPageActive;
    const setPageSeo = pages.setPageSeo;
    const setPageActive = pages.setPageActive;

    function setSiteFavicon(url: string | null): void {
        if (isTemplateMode.value) return;
        pushHistory();
        siteFaviconUrl.value = url || null;
        draft.pushPreviewDraft();
    }

    const addCustomPage = pages.addCustomPage;
    const deletePage = pages.deletePage;
    const switchPage = pages.switchPage;
    const setPageColors = colors.setPageColors;
    const setPageGlobalFonts = fonts.setPageGlobalFonts;
    const setPageGlobalButtonStyle = fonts.setPageGlobalButtonStyle;

    function updateBlockField(entryId: string, fieldKey: string, value: string): void {
        const entry = findEntryById(layoutComponents.value, entryId);
        if (!entry || !entry.data) return;
        if (!isTemplateMode.value) pushHistory();
        (entry.data as Record<string, unknown>)[fieldKey] = value;
        draft.pushPreviewDraft();
    }

    function findEntryInTree(tree: LayoutComponentEntry[], id: string): LayoutComponentEntry | null {
        for (const entry of tree) {
            if (entry.id === id) return entry;
            const c = entry.children;
            if (Array.isArray(c)) {
                const found = findEntryInTree(c, id);
                if (found) return found;
            }
        }
        return null;
    }

    function saveLayoutSnapshot(): void {
        layoutDragStartSnapshot.value = JSON.parse(JSON.stringify(cleanLayoutTree(layoutComponents.value)));
    }

    function countEntryIds(entries: LayoutComponentEntry[]): number {
        let n = 0;
        for (const e of entries) {
            if (!isValidLayoutEntry(e)) continue;
            n += 1;
            const c = e.children;
            if (Array.isArray(c)) n += countEntryIds(c);
        }
        return n;
    }

    function onLayoutReorder(tree: LayoutComponentEntry[]): void {
        const cleaned = cleanLayoutTree(tree);
        const currentCount = countEntryIds(layoutComponents.value);
        const newCount = countEntryIds(cleaned);
        const snapshot = layoutDragStartSnapshot.value;
        if (newCount < currentCount && snapshot !== null) {
            layoutDragStartSnapshot.value = null;
            const restored = JSON.parse(JSON.stringify(snapshot));
            scheduleLayoutUpdate(() => {
                layoutComponents.value = restored;
                syncLayoutComponentsToFullCustom(layoutComponents.value);
            });
            return;
        }
        layoutDragStartSnapshot.value = null;
        if (!isTemplateMode.value) pushHistory();
        scheduleLayoutUpdate(() => {
            layoutComponents.value = cleaned;
            draft.pushPreviewDraft();
        });
    }

    function onSidebarListUpdate(tree: LayoutComponentEntry[]): void {
        if (!isTemplateMode.value) pushHistory();
        const cleaned = cleanLayoutTree(tree);
        scheduleLayoutUpdate(() => {
            layoutComponents.value = cleaned;
            draft.pushPreviewDraft();
        });
    }

    function onSidebarRemove(flatIndex: number): void {
        if (!isTemplateMode.value) pushHistory();
        const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value ?? acceptsChildren);
        const removed = flat[flatIndex];
        if (removed && selectedModuleId.value === removed.entry.id) selectedModuleId.value = null;
        flat.splice(flatIndex, 1);
        const newTree = flatToTree(flat, getAcceptsChildren.value ?? acceptsChildren);
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newTree;
            draft.pushPreviewDraft();
        });
    }

    function onSidebarDuplicate(flatIndex: number): void {
        if (!isTemplateMode.value) pushHistory();
        const reg = registry.value;
        if (!reg) return;
        const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value ?? acceptsChildren);
        const item = flat[flatIndex];
        if (!item) return;
        const entry = item.entry;
        const newEntry: LayoutComponentEntry = {
            id: reg.generateLayoutComponentId(),
            type: entry.type,
            data: JSON.parse(JSON.stringify(entry.data ?? {})),
            children: Array.isArray(entry.children) ? JSON.parse(JSON.stringify(entry.children)) : undefined,
        };
        flat.splice(flatIndex + 1, 0, { entry: newEntry, depth: item.depth });
        selectedModuleId.value = newEntry.id;
        const newTree = flatToTree(flat, getAcceptsChildren.value ?? acceptsChildren);
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newTree;
            draft.pushPreviewDraft();
        });
    }

    function onSidebarMove(flatIndex: number, direction: 'up' | 'down'): void {
        if (!isTemplateMode.value) pushHistory();
        const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value ?? acceptsChildren);
        const fromEnd = getSubtreeEndIndex(flat, flatIndex);
        const acc = getAcceptsChildren.value ?? acceptsChildren;
        let insertAt: number;
        if (direction === 'up') {
            if (flatIndex <= 0) return;
            insertAt = getPreviousSiblingStart(flat, flatIndex);
        } else {
            if (fromEnd >= flat.length - 1) return;
            const nextSiblingStart = fromEnd + 1;
            const nextSiblingEnd = getSubtreeEndIndex(flat, nextSiblingStart);
            insertAt = flatIndex + (nextSiblingEnd - nextSiblingStart + 1);
        }
        const newFlat = moveFlatSubtree(flat, flatIndex, fromEnd, insertAt);
        const normalized = normalizeDepthsAfterDrop(newFlat, acc);
        const newTree = flatToTree(normalized, acc);
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newTree;
            draft.pushPreviewDraft();
        });
    }

    function getFlatIndexForRootIndex(rootIndex: number): number {
        const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value ?? acceptsChildren);
        let count = 0;
        for (let i = 0; i < flat.length; i++) {
            if (flat[i].depth === 0) {
                if (count === rootIndex) return i;
                count += 1;
            }
        }
        return -1;
    }

    function getFlatIndexForId(id: string): number {
        const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value ?? acceptsChildren);
        return flat.findIndex((f) => f.entry.id === id);
    }

    function insertEntryAfterFlatIndex(flatIndex: number, newEntry: LayoutComponentEntry): void {
        const acc = getAcceptsChildren.value ?? acceptsChildren;
        const flat = treeToFlat(layoutComponents.value, 0, acc);
        const endIndex = getSubtreeEndIndex(flat, flatIndex);
        const depth = flat[flatIndex].depth;
        const newFlat = [
            ...flat.slice(0, endIndex + 1),
            { entry: newEntry, depth },
            ...flat.slice(endIndex + 1),
        ];
        const normalized = normalizeDepthsAfterDrop(newFlat, acc);
        const newTree = flatToTree(normalized, acc);
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newTree;
            draft.pushPreviewDraft();
        });
        selectedModuleId.value = newEntry.id;
    }

    function cloneTreeAndInsertAtParent(
        tree: LayoutComponentEntry[],
        parentId: string,
        insertIndex: number,
        newEntry: LayoutComponentEntry,
    ): LayoutComponentEntry[] {
        return tree.map((entry) => {
            const cloned: LayoutComponentEntry = {
                id: entry.id,
                type: entry.type,
                data: { ...(entry.data ?? {}) },
            };
            if (entry.id === parentId && acceptsChildren(entry.type as LayoutComponentType)) {
                const children = [...(entry.children ?? []).filter(isValidLayoutEntry)];
                children.splice(insertIndex, 0, newEntry);
                cloned.children = children;
            } else if (Array.isArray(entry.children)) {
                cloned.children = cloneTreeAndInsertAtParent(entry.children, parentId, insertIndex, newEntry);
            }
            return cloned;
        });
    }

    function addComponent(type: LayoutComponentType | string, insertIndex?: number, parentId?: string): void {
        if (!isTemplateMode.value) pushHistory();
        const reg = registry.value;
        if (!reg) return;
        const newEntry: LayoutComponentEntry = {
            id: reg.generateLayoutComponentId(),
            type: type as LayoutComponentType,
            data: reg.getDefaultDataForType(type),
        };
        if (acceptsChildren(type as LayoutComponentType)) newEntry.children = [];
        let newTree: LayoutComponentEntry[];
        if (parentId !== undefined) {
            const parent = findEntryInTree(layoutComponents.value, parentId);
            if (parent && acceptsChildren(parent.type as LayoutComponentType)) {
                const idx = insertIndex ?? (parent.children ?? []).filter(isValidLayoutEntry).length;
                newTree = cloneTreeAndInsertAtParent(layoutComponents.value, parentId, idx, newEntry);
            } else {
                newTree = [...layoutComponents.value, newEntry];
            }
            selectedModuleId.value = newEntry.id;
        } else if (insertIndex !== undefined) {
            const list = [...layoutComponents.value];
            list.splice(insertIndex, 0, newEntry);
            selectedModuleId.value = newEntry.id;
            newTree = list;
        } else {
            const selected = selectedEntry.value;
            if (selected && acceptsChildren(selected.type as LayoutComponentType)) {
                const idx = insertIndex ?? (selected.children ?? []).filter(isValidLayoutEntry).length;
                newTree = cloneTreeAndInsertAtParent(layoutComponents.value, selected.id, idx, newEntry);
                selectedModuleId.value = newEntry.id;
            } else {
                const list = [...layoutComponents.value];
                list.push(newEntry);
                selectedModuleId.value = newEntry.id;
                newTree = list;
            }
        }
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newTree;
            draft.pushPreviewDraft();
        });
    }

    function onSectionListUpdate(newRootOrder: LayoutComponentEntry[]): void {
        if (!isTemplateMode.value) pushHistory();
        scheduleLayoutUpdate(() => {
            layoutComponents.value = newRootOrder;
            draft.pushPreviewDraft();
        });
    }

    function onSectionRemove(rootIndex: number): void {
        const flatIndex = getFlatIndexForRootIndex(rootIndex);
        if (flatIndex >= 0) onSidebarRemove(flatIndex);
    }

    function onSectionDuplicate(rootIndex: number): void {
        const flatIndex = getFlatIndexForRootIndex(rootIndex);
        if (flatIndex >= 0) onSidebarDuplicate(flatIndex);
    }

    function onSectionMove(rootIndex: number, direction: 'up' | 'down'): void {
        const flatIndex = getFlatIndexForRootIndex(rootIndex);
        if (flatIndex >= 0) onSidebarMove(flatIndex, direction);
    }

    function onBlockDuplicate(id: string): void {
        const flatIndex = getFlatIndexForId(id);
        if (flatIndex >= 0) onSidebarDuplicate(flatIndex);
    }

    function onBlockRemove(id: string): void {
        const flatIndex = getFlatIndexForId(id);
        if (flatIndex >= 0) onSidebarRemove(flatIndex);
    }

    function onBlockCopy(id: string): void {
        const entry = findEntryById(layoutComponents.value, id);
        if (!entry) return;
        const reg = registry.value;
        if (!reg) return;
        copiedBlockRef.value = {
            id: reg.generateLayoutComponentId(),
            type: entry.type,
            data: JSON.parse(JSON.stringify(entry.data ?? {})),
            children: Array.isArray(entry.children) ? JSON.parse(JSON.stringify(entry.children)) : undefined,
        };
    }

    function onBlockPaste(afterId: string): void {
        const entry = copiedBlockRef.value;
        if (!entry) return;
        const reg = registry.value;
        if (!reg) return;
        const flatIndex = getFlatIndexForId(afterId);
        if (flatIndex < 0) return;
        const cloned: LayoutComponentEntry = {
            id: reg.generateLayoutComponentId(),
            type: entry.type,
            data: JSON.parse(JSON.stringify(entry.data ?? {})),
            children: Array.isArray(entry.children) ? JSON.parse(JSON.stringify(entry.children)) : undefined,
        };
        if (!isTemplateMode.value) pushHistory();
        insertEntryAfterFlatIndex(flatIndex, cloned);
    }

    function getComponentLabel(type: string, entry?: { data?: Record<string, unknown> }): string {
        const label = entry?.data?.moduleLabel;
        if (typeof label === 'string' && label.trim() !== '') return label.trim();
        return registry.value?.LAYOUT_COMPONENT_REGISTRY?.find((r: { type: string }) => r.type === type)?.label ?? type;
    }

    const openColorPicker = colors.openColorPicker;
    const onColorInput = colors.onColorInput;

    const blockContextActions = computed(() => ({
        duplicate: onBlockDuplicate,
        remove: onBlockRemove,
        copy: onBlockCopy,
        paste: onBlockPaste,
        getCanPaste: () => !!copiedBlockRef.value,
    }));

    function getLeftSidebarTabTitle(tab: typeof leftSidebarTab.value): string {
        const t: Record<typeof leftSidebarTab.value, string> = {
            struktur: 'Struktur',
            seiten: 'Seiten',
            seo: 'SEO',
            medien: 'Medien',
            design: 'Design',
            einstellungen: 'Einstellungen',
        };
        return t[tab] ?? tab;
    }

    function getDesignSectionTitle(section: 'farben' | 'schriftarten' | 'button'): string {
        const t = { farben: 'Farben', schriftarten: 'Schriftarten', button: 'Button' };
        return t[section];
    }

    function openMediaLibrary(callback: (url: string) => void): void {
        if (isTemplateMode.value) return;
        mediaLibraryCallback.value = callback;
        mediaLibraryOpen.value = true;
    }

    function onMediaLibrarySelect(url: string): void {
        mediaLibraryCallback.value?.(url);
        mediaLibraryCallback.value = null;
        mediaLibraryOpen.value = false;
    }

    function onMediaLibraryClose(): void {
        mediaLibraryCallback.value = null;
        mediaLibraryOpen.value = false;
    }

    function openComponentGalleryForNewSection(): void {
        componentGalleryInsertAtEnd.value = true;
        componentGalleryOpen.value = true;
    }

    function onComponentGallerySelect(type: string): void {
        if (componentGalleryInsertAtEnd.value) {
            const rootCount = layoutComponents.value.length;
            addComponent(type as LayoutComponentType, rootCount);
            componentGalleryInsertAtEnd.value = false;
        } else {
            addComponent(type as LayoutComponentType);
        }
        componentGalleryOpen.value = false;
    }

    const LayoutComponentContextPanelComponent = computed(
        () => templateEntry.value?.LayoutComponentContextPanel ?? PraxisemeraldLayoutComponentContextPanel,
    );

    const BUTTON_VARIANT_OPTIONS = fonts.BUTTON_VARIANT_OPTIONS;
    const BUTTON_RADIUS_OPTIONS = fonts.BUTTON_RADIUS_OPTIONS;
    const BUTTON_SIZE_OPTIONS = fonts.BUTTON_SIZE_OPTIONS;
    const FONT_OPTIONS = fonts.FONT_OPTIONS;

    watch(
        pageData,
        () => draft.pushPreviewDraft(),
        { deep: true },
    );

    watch(
        () => props.site,
        (hasSite) => {
            if (!hasSite && leftSidebarTab.value === 'medien') leftSidebarTab.value = 'struktur';
        },
        { immediate: true },
    );

    const { selectedBlockRect, updateRect: updateSelectedBlockRect, TOOLBAR_OFFSET } =
        useSelectedBlockRect(selectedModuleId);
    const { designerMode } = useDesignerMode();
    const {
        onboardingCompleted,
        onboardingOpen,
        onboardingStep,
        totalSteps: onboardingTotalSteps,
        markCompleted: markOnboardingCompleted,
        startTour: startOnboardingTour,
        closeTour: closeOnboardingTour,
        nextStep: onboardingNextStep,
        prevStep: onboardingPrevStep,
        setStep: onboardingSetStep,
    } = useDesignerOnboarding();

    let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    watch(
        fullCustomPageData,
        () => {
            if (isTemplateMode.value || isApplying.value || justAppliedUndoRedo.value) return;
            if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
            historyDebounceTimer = setTimeout(() => {
                historyDebounceTimer = null;
                pushHistory();
            }, 600);
        },
        { deep: true },
    );

    const storeReturn = {
        props,
        defaultColors: templateDefaultColors,
        isTemplateMode,
        templateEntry,
        registry,
        getAcceptsChildren,
        defaultLayoutComponents,
        sitePagesList,
        templatePagesList,
        fullCustomPageData,
        currentPageSlug,
        pageData,
        layoutComponents,
        selectedModuleId,
        selectedEntry,
        previewColors,
        previewStyles,
        layoutComponent,
        layoutComponentCache,
        selectedBlockRect,
        updateSelectedBlockRect,
        TOOLBAR_OFFSET,
        designerMode,
        onboardingCompleted,
        onboardingOpen,
        onboardingStep,
        onboardingTotalSteps,
        markOnboardingCompleted,
        startOnboardingTour,
        closeOnboardingTour,
        onboardingNextStep,
        onboardingPrevStep,
        onboardingSetStep,
        addPageModalOpen,
        newPageName,
        newPageSlug,
        mediaLibraryOpen,
        componentGalleryOpen,
        mediaLibraryCallback,
        showTreeInSidebar,
        leftSidebarTab,
        leftSidebarContentOpen,
        autosaveEnabled,
        currentPageSeo,
        leftSidebarPanelWidthClass,
        designSection,
        colorPickerKey,
        colorInputRef,
        componentGalleryInsertAtEnd,
        previewViewport,
        previewFullscreen,
        previewWrapperClass,
        layoutDragStartSnapshot,
        copiedBlockRef,
        canUndo,
        canRedo,
        isApplying,
        justAppliedUndoRedo,
        draftSavedLabel,
        activeColors,
        activeGlobalFonts,
        activeGlobalButtonStyle,
        pageTitle,
        displayName,
        mergePageDataForSlug,
        syncLayoutComponentsToFullCustom,
        pushHistory,
        applySnapshot,
        undo,
        redo,
        scheduleLayoutUpdate,
        findEntryById,
        saveLayoutSnapshot,
        onLayoutReorder,
        onSidebarListUpdate,
        onSidebarRemove,
        onSidebarDuplicate,
        onSidebarMove,
        getFlatIndexForRootIndex,
        getFlatIndexForId,
        insertEntryAfterFlatIndex,
        onSectionListUpdate,
        onSectionRemove,
        onSectionDuplicate,
        onSectionMove,
        onBlockDuplicate,
        onBlockRemove,
        onBlockCopy,
        onBlockPaste,
        addComponent,
        getLayoutForPage,
        getPageLabel,
        isCustomPage,
        getPageSourceBadge,
        isPageActive,
        setPageActive,
        setPageSeo,
        setSiteFavicon,
        siteFaviconUrl,
        addCustomPage,
        deletePage,
        switchPage,
        setPageColors,
        setPageGlobalFonts,
        setPageGlobalButtonStyle,
        updateBlockField,
        getComponentLabel,
        openColorPicker,
        onColorInput,
        blockContextActions,
        getLeftSidebarTabTitle,
        getDesignSectionTitle,
        LayoutComponentContextPanelComponent,
        BUTTON_VARIANT_OPTIONS,
        BUTTON_RADIUS_OPTIONS,
        BUTTON_SIZE_OPTIONS,
        FONT_OPTIONS,
        openMediaLibrary,
        onMediaLibrarySelect,
        onMediaLibraryClose,
        openComponentGalleryForNewSection,
        onComponentGallerySelect,
        openAddPageModal: () => {
            newPageName.value = '';
            newPageSlug.value = '';
            addPageModalOpen.value = true;
        },
        closeAddPageModal: () => {
            addPageModalOpen.value = false;
        },
        closeComponentGallery: () => {
            componentGalleryOpen.value = false;
            componentGalleryInsertAtEnd.value = false;
        },
        onAddPage: (payload: { name: string; slug: string }) => {
            newPageName.value = payload.name;
            newPageSlug.value = payload.slug;
            addCustomPage();
        },
        postDraft: draft.postDraft,
        pushPreviewDraft: draft.pushPreviewDraft,
        draftSavedAt: draft.draftSavedAt,
        clearDraftDebounce: draft.clearDebounce,
        saveInProgress: save.saveInProgress,
        publishConflict: save.publishConflict,
        saveToSite: save.saveToSite,
        saveToTemplate: save.saveToTemplate,
        getCsrfToken,
        cleanup: () => {
            if (historyDebounceTimer) {
                clearTimeout(historyDebounceTimer);
                historyDebounceTimer = null;
            }
            layoutComponentCache.clear();
            draft.clearDebounce();
        },
    };
    const raw = storeReturn as Record<string, unknown>;

    // Wrap in Proxy so that designer.refName = value sets refName.value (keeps refs intact)
    return new Proxy(raw, {
        get(target, key: string) {
            const v = target[key as keyof typeof raw];
            if (v != null && typeof v === 'object' && 'value' in v && typeof (v as Ref<unknown>).value !== 'undefined') {
                return (v as Ref<unknown>).value;
            }
            return v;
        },
        set(target, key: string, value: unknown) {
            const v = target[key as keyof typeof raw];
            if (v != null && typeof v === 'object' && 'value' in v) {
                (v as Ref<unknown>).value = value;
                return true;
            }
            (target as Record<string, unknown>)[key] = value;
            return true;
        },
    }) as DesignerStore;
}

export type DesignerStore = ReturnType<typeof useDesignerStore>;
