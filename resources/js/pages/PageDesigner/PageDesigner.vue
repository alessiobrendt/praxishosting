<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { storePreviewDraft } from '@/actions/App/Http/Controllers/SiteRenderController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { show as sitesShow, update as sitesUpdate } from '@/routes/sites';
import templates from '@/routes/admin/templates';
import designRoutes from '@/routes/admin/templates/design';
import type { SitePageData, SitePageDataColors } from '@/types/site-page-data';
import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineAsyncComponent, provide } from 'vue';
import { getTemplateEntry } from '@/templates/template-registry';
import { Plus, Copy, Trash2, ArrowLeft, Save, Undo2, Redo2, Monitor, Tablet, Smartphone, Maximize2, Minimize2, ShieldAlert } from 'lucide-vue-next';
import { usePageDesignerHistory } from '@/composables/usePageDesignerHistory';
import { notify } from '@/composables/useNotify';
import LayoutComponentContextPanel from '@/templates/praxisemerald/LayoutComponentContextPanel.vue';
import ComponentGalleryModal from '@/templates/praxisemerald/ComponentGalleryModal.vue';
import MediaLibraryModal from '@/templates/praxisemerald/MediaLibraryModal.vue';
import AddPageModal from '@/pages/PageDesigner/AddPageModal.vue';
import SidebarTreeFlat from '@/pages/PageDesigner/SidebarTreeFlat.vue';
import { treeToFlat, flatToTree } from '@/lib/layout-tree';

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

type TemplatePageFromSite = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data?: Record<string, unknown> | null;
};

type Template = {
    id: number;
    name: string;
    slug: string;
    page_data: SitePageData | null;
    pages?: TemplatePageFromSite[];
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
    custom_page_data: Partial<SitePageData> | null;
    custom_colors: Partial<SitePageDataColors> | null;
    template: Template;
};

type TemplatePageFromApi = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

type TemplateWithPages = {
    id: number;
    name: string;
    slug: string;
    pages: TemplatePageFromApi[];
};

type Props = {
    mode: 'site' | 'template';
    site?: Site;
    template?: TemplateWithPages;
    baseDomain: string;
};

const props = defineProps<Props>();

const PAGE_SLUGS = ['index', 'notfallinformationen', 'patienteninformationen'] as const;
const PAGE_SLUG_LABELS: Record<(typeof PAGE_SLUGS)[number], string> = {
    index: 'Startseite',
    notfallinformationen: 'Notfallinformationen',
    patienteninformationen: 'Patienteninformationen',
};

const isTemplateMode = computed(() => props.mode === 'template');

const templateEntry = computed(() =>
    getTemplateEntry(isTemplateMode.value ? props.template?.slug : props.site?.template?.slug),
);
const registry = computed(() => templateEntry.value?.getComponentRegistry?.());

function defaultLayoutComponents(): LayoutComponentEntry[] {
    const reg = registry.value;
    if (!reg) return [];
    return [
        { id: 'header_default', type: 'header', data: reg.getDefaultDataForType('header') },
        { id: 'footer_default', type: 'footer', data: reg.getDefaultDataForType('footer') },
    ];
}

type PageSlug = (typeof PAGE_SLUGS)[number];

/** Site mode: template pages + custom_pages for tab list. */
const sitePagesList = computed(() => {
    const templatePages = (props.site?.template?.pages ?? []) as TemplatePageFromSite[];
    const customPages = (fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[] | undefined) ?? [];
    const withSource = [
        ...templatePages.map((p) => ({ slug: p.slug, name: p.name, order: p.order, isCustom: false })),
        ...customPages.map((p) => ({ slug: p.slug, name: p.name, order: p.order, isCustom: true })),
    ];
    return withSource.sort((a, b) => a.order - b.order);
});

function isCustomPage(slug: string): boolean {
    const custom = (fullCustomPageData.value.custom_pages as { slug: string }[] | undefined) ?? [];
    return custom.some((p) => p.slug === slug);
}

function getPageLabel(slug: string): string {
    if (PAGE_SLUG_LABELS[slug as PageSlug]) return PAGE_SLUG_LABELS[slug as PageSlug];
    const custom = (fullCustomPageData.value.custom_pages as { slug: string; name: string }[] | undefined) ?? [];
    return custom.find((p) => p.slug === slug)?.name ?? slug;
}

/**
 * Merge page data for a given slug from custom blob and template. Used for display and draft (site mode only).
 */
function mergePageDataForSlug(
    slug: string,
    custom: Record<string, unknown>,
): SitePageData | Record<string, unknown> {
    const entry = templateEntry.value;
    const templateData = (props.site!.template?.page_data ?? {}) as Record<string, unknown>;
    const defaultBase = (entry?.getDefaultPageData?.() ?? templateData ?? {}) as Record<string, unknown>;
    const base = deepMergePreferNonEmpty(defaultBase, templateData) as Record<string, unknown>;
    const customColors = props.site!.custom_colors ?? (custom.colors as Record<string, string> | undefined);
    const templatePages = (props.site!.template?.pages ?? []) as TemplatePageFromSite[];
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
            colors: { ...defaultColors, ...(base.colors as Record<string, string> ?? {}), ...(customColors ?? {}) },
            layout_components:
                (layout_components?.length ?? 0) > 0 ? layout_components : (merged.layout_components ?? defaultLayoutComponents()),
        } as SitePageData;
    }

    const customPagesMap = (custom.pages ?? {}) as Record<string, { layout_components?: LayoutComponentEntry[] }>;
    const customPage = customPagesMap[slug];
    let templateLayout: LayoutComponentEntry[] = [];
    if (hasTemplatePage) {
        const templatePage = templatePages.find((p) => p.slug === slug);
        const pageData = templatePage?.data as Record<string, { layout_components?: LayoutComponentEntry[] }> | undefined;
        templateLayout = Array.isArray(pageData?.layout_components) ? pageData.layout_components : [];
    }
    const customLayout = Array.isArray(customPage?.layout_components) ? customPage.layout_components : [];
    const layout_components =
        customLayout.length > 0
            ? customLayout
            : templateLayout.length > 0
              ? templateLayout
              : defaultLayoutComponents();
    return {
        colors: { ...defaultColors, ...(base.colors as Record<string, string> ?? {}), ...(customColors ?? {}) },
        layout_components: (layout_components?.length ?? 0) > 0 ? layout_components : defaultLayoutComponents(),
    } as SitePageData;
}

/** Template mode: local copy of template pages; current page data is a ref into one of these. */
const templatePagesLocal = ref<TemplatePageFromApi[]>([]);

/** Site mode: full custom_page_data (root + pages) used for save and draft. */
const fullCustomPageData = ref<Record<string, unknown>>({});

const currentPageSlug = ref<string>('index');

/** Reactive page data: in site mode merged; in template mode ref to current TemplatePage.data. */
const pageData = ref<SitePageData | Record<string, unknown>>({
    colors: { ...defaultColors },
    layout_components: [],
});

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
        if (!data.colors) {
            data.colors = { ...defaultColors };
        }
        pageData.value = data as SitePageData;
    }
} else if (!isTemplateMode.value && props.site) {
    const initial = (props.site.custom_page_data ?? {}) as Record<string, unknown>;
    fullCustomPageData.value = {
        ...initial,
        custom_pages: (initial.custom_pages as { slug: string; name: string; order: number }[] | undefined) ?? [],
    };
    pageData.value = mergePageDataForSlug('index', fullCustomPageData.value);
}

const templatePagesList = computed(() =>
    [...templatePagesLocal.value].sort((a, b) => a.order - b.order),
);

/** Site mode only: whether this slug uses template default (Vorlage) or custom overrides (Eigene Anpassung). */
function getPageSourceBadge(slug: string): 'Vorlage' | 'Eigene Anpassung' {
    const custom = fullCustomPageData.value;
    if (slug === 'index') {
        const layout = custom.layout_components;
        return Array.isArray(layout) && layout.length > 0 ? 'Eigene Anpassung' : 'Vorlage';
    }
    const pages = custom.pages as Record<string, { layout_components?: unknown[] }> | undefined;
    const page = pages?.[slug];
    const layout = page?.layout_components;
    return Array.isArray(layout) && layout.length > 0 ? 'Eigene Anpassung' : 'Vorlage';
}

/** Site mode only: whether page is active (shown in nav). Index is always active. */
function isPageActive(slug: string): boolean {
    if (slug === 'index') return true;
    const meta = (fullCustomPageData.value.pages_meta as Record<string, { active?: boolean }> | undefined)?.[slug];
    return (meta?.active ?? true) === true;
}

/** Site mode only: set page active state. Index must never be set to false. */
function setPageActive(slug: string, active: boolean): void {
    if (slug === 'index') return;
    pushHistory();
    const meta = { ...((fullCustomPageData.value.pages_meta as Record<string, { active?: boolean }>) ?? {}) };
    meta[slug] = { ...meta[slug], active };
    fullCustomPageData.value = { ...fullCustomPageData.value, pages_meta: meta };
    pushPreviewDraft();
}

const addPageModalOpen = ref(false);
const newPageName = ref('');
const newPageSlug = ref('');

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

function openAddPageModal(): void {
    newPageName.value = '';
    newPageSlug.value = '';
    addPageModalOpen.value = true;
}

function addCustomPage(): void {
    const name = newPageName.value.trim();
    const slug = (newPageSlug.value.trim() || slugify(name)).toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (!name || !slug) return;
    const customPages = (fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[]) ?? [];
    if (customPages.some((p) => p.slug === slug)) return;
    const templatePages = (props.site?.template?.pages ?? []) as TemplatePageFromSite[];
    const maxOrder = Math.max(0, ...templatePages.map((p) => p.order), ...customPages.map((p) => p.order));
    pushHistory();
    const newCustomPages = [...customPages, { slug, name, order: maxOrder + 1 }];
    const pages = { ...((fullCustomPageData.value.pages as Record<string, unknown>) ?? {}) };
    pages[slug] = { layout_components: defaultLayoutComponents() };
    fullCustomPageData.value = {
        ...fullCustomPageData.value,
        custom_pages: newCustomPages,
        pages,
    };
    addPageModalOpen.value = false;
    switchPage(slug);
    pushPreviewDraft();
}

function onAddPage(payload: { name: string; slug: string }): void {
    newPageName.value = payload.name;
    newPageSlug.value = payload.slug;
    addCustomPage();
}

function deleteCurrentPage(): void {
    const slug = currentPageSlug.value;
    if (slug === 'index') return;
    deletePage(slug);
}

/** Remove or deactivate a page by slug. Custom pages are removed; template pages are deactivated. */
function deletePage(slug: string): void {
    if (slug === 'index') return;
    pushHistory();
    if (isCustomPage(slug)) {
        const customPages = (fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[]) ?? [];
        fullCustomPageData.value.custom_pages = customPages.filter((p) => p.slug !== slug);
        const pages = { ...((fullCustomPageData.value.pages as Record<string, unknown>) ?? {}) };
        delete pages[slug];
        fullCustomPageData.value = { ...fullCustomPageData.value, pages };
        if (currentPageSlug.value === slug) switchPage('index');
    } else {
        setPageActive(slug, false);
        if (currentPageSlug.value === slug) switchPage('index');
    }
    pushPreviewDraft();
}

function switchPage(slug: string): void {
    if (isTemplateMode.value) {
        const page = templatePagesLocal.value.find((p) => p.slug === slug);
        if (page) {
            currentPageSlug.value = slug;
            if (!page.data) page.data = {};
            const data = page.data as Record<string, unknown>;
            if (!Array.isArray(data.layout_components)) {
                data.layout_components = defaultLayoutComponents();
            }
            if (!data.colors) {
                data.colors = { ...defaultColors };
            }
            pageData.value = data as SitePageData;
        }
    } else {
        currentPageSlug.value = slug as PageSlug;
        pageData.value = mergePageDataForSlug(slug as PageSlug, fullCustomPageData.value);
    }
    selectedModuleId.value = null;
}

const { canUndo, canRedo, isApplying, pushHistory, undo: performUndo, redo: performRedo } =
    usePageDesignerHistory(() => fullCustomPageData.value);

const justAppliedUndoRedo = ref(false);

function applySnapshot(snapshot: Record<string, unknown>): void {
    justAppliedUndoRedo.value = true;
    fullCustomPageData.value = { ...snapshot };
    pageData.value = mergePageDataForSlug(currentPageSlug.value as PageSlug, fullCustomPageData.value);
    pushPreviewDraft();
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

const layoutComponents = computed({
    get: () => (pageData.value as SitePageData).layout_components ?? [],
    set: (val) => {
        (pageData.value as SitePageData).layout_components = val;
        syncLayoutComponentsToFullCustom(val);
    },
});

const selectedModuleId = ref<string | null>(null);

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

const previewColors = computed(() => {
    const c = (pageData.value as SitePageData).colors ?? {};
    return {
        '--primary': c.primary ?? defaultColors.primary,
        '--primary-hover': c.primaryHover ?? defaultColors.primaryHover,
        '--primary-light': c.primaryLight ?? defaultColors.primaryLight,
        '--primary-dark': c.primaryDark ?? defaultColors.primaryDark,
        '--secondary': c.secondary ?? defaultColors.secondary,
        '--tertiary': c.tertiary ?? defaultColors.tertiary,
        '--quaternary': c.quaternary ?? defaultColors.quaternary,
        '--quinary': c.quinary ?? defaultColors.quinary,
    };
});

const layoutComponent = computed(() => {
    const e = templateEntry.value;
    if (!e?.Layout) return null;
    return defineAsyncComponent(e.Layout as () => Promise<{ default: import('vue').Component }>);
});

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const draftSavedAt = ref<number | null>(null);

function postDraft(): Promise<Response> | null {
    if (isTemplateMode.value || !props.site) return null;
    const data = fullCustomPageData.value;
    const payload = {
        custom_page_data: data,
        custom_colors: (data.colors as Record<string, string>) ?? {},
    };
    return fetch(storePreviewDraft({ site: props.site.uuid }).url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
    }).then((res) => {
        if (res.ok) draftSavedAt.value = Date.now();
        return res;
    });
}

function pushPreviewDraft(): void {
    if (isTemplateMode.value) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        postDraft();
    }, 400);
}

const mediaLibraryOpen = ref(false);
const componentGalleryOpen = ref(false);
const mediaLibraryCallback = ref<((url: string) => void) | null>(null);

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

provide('openMediaLibrary', openMediaLibrary);

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

const previewViewport = ref<PreviewViewport>('desktop');
const previewFullscreen = ref(false);

const previewWrapperClass = computed(() => {
    switch (previewViewport.value) {
        case 'tablet':
            return 'max-w-[768px]';
        case 'mobile':
            return 'max-w-[375px]';
        default:
            return 'w-full px-4';
    }
});

const draftSavedLabel = computed(() => {
    if (isTemplateMode.value) return null;
    const at = draftSavedAt.value;
    if (!at) return null;
    const d = new Date(at);
    return `Entwurf gespeichert um ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
});

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

const layoutDragStartSnapshot = ref<LayoutComponentEntry[] | null>(null);

function saveLayoutSnapshot(): void {
    layoutDragStartSnapshot.value = JSON.parse(JSON.stringify(cleanLayoutTree(layoutComponents.value)));
}

function onLayoutReorder(tree: LayoutComponentEntry[]) {
    const cleaned = cleanLayoutTree(tree);
    const currentCount = countEntryIds(layoutComponents.value);
    const newCount = countEntryIds(cleaned);
    if (newCount < currentCount && layoutDragStartSnapshot.value !== null) {
        layoutComponents.value = JSON.parse(JSON.stringify(layoutDragStartSnapshot.value));
        syncLayoutComponentsToFullCustom(layoutComponents.value);
        layoutDragStartSnapshot.value = null;
        if (import.meta.env.DEV) {
            console.debug('[PageDesigner] Reorder abgebrochen: weniger Einträge, Snapshot wiederhergestellt.');
        }
        return;
    }
    layoutDragStartSnapshot.value = null;
    if (!isTemplateMode.value) pushHistory();
    layoutComponents.value = cleaned;
    pushPreviewDraft();
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

function onSidebarListUpdate(tree: LayoutComponentEntry[]) {
    if (!isTemplateMode.value) pushHistory();
    layoutComponents.value = cleanLayoutTree(tree);
    pushPreviewDraft();
}

function onSidebarRemove(flatIndex: number): void {
    if (!isTemplateMode.value) pushHistory();
    const flat = treeToFlat(layoutComponents.value);
    const removed = flat[flatIndex];
    if (removed && selectedModuleId.value === removed.entry.id) {
        selectedModuleId.value = null;
    }
    flat.splice(flatIndex, 1);
    layoutComponents.value = flatToTree(flat);
    pushPreviewDraft();
}

function onSidebarDuplicate(flatIndex: number): void {
    if (!isTemplateMode.value) pushHistory();
    const reg = registry.value;
    if (!reg) return;
    const flat = treeToFlat(layoutComponents.value);
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
    layoutComponents.value = flatToTree(flat);
    selectedModuleId.value = newEntry.id;
    pushPreviewDraft();
}

function onSidebarMove(flatIndex: number, direction: 'up' | 'down'): void {
    if (!isTemplateMode.value) pushHistory();
    const flat = treeToFlat(layoutComponents.value);
    const toIndex = direction === 'up' ? flatIndex - 1 : flatIndex + 1;
    if (toIndex < 0 || toIndex >= flat.length) return;
    [flat[flatIndex], flat[toIndex]] = [flat[toIndex], flat[flatIndex]];
    layoutComponents.value = flatToTree(flat);
    pushPreviewDraft();
}

function addComponent(type: LayoutComponentType | string, insertIndex?: number, parentId?: string) {
    if (!isTemplateMode.value) pushHistory();
    const reg = registry.value;
    if (!reg) return;
    const newEntry: LayoutComponentEntry = {
        id: reg.generateLayoutComponentId(),
        type: type as LayoutComponentType,
        data: reg.getDefaultDataForType(type),
    };
    if (acceptsChildren(type as LayoutComponentType)) {
        newEntry.children = [];
    }
    if (parentId !== undefined) {
        const parent = findEntryInTree(layoutComponents.value, parentId);
        if (parent && acceptsChildren(parent.type as LayoutComponentType)) {
            const children = parent.children ?? [];
            const list = [...children].filter(isValidLayoutEntry);
            list.splice(insertIndex ?? list.length, 0, newEntry);
            parent.children = list;
            selectedModuleId.value = newEntry.id;
            layoutComponents.value = JSON.parse(JSON.stringify(layoutComponents.value));
        } else {
            const list = [...layoutComponents.value];
            list.push(newEntry);
            layoutComponents.value = list;
            selectedModuleId.value = newEntry.id;
        }
    } else if (insertIndex !== undefined) {
        const list = [...layoutComponents.value];
        list.splice(insertIndex, 0, newEntry);
        layoutComponents.value = list;
        selectedModuleId.value = newEntry.id;
    } else {
        const selected = selectedEntry.value;
        if (selected && acceptsChildren(selected.type as LayoutComponentType)) {
            const children = (selected.children ?? []).filter(isValidLayoutEntry);
            selected.children = [...children, newEntry];
            selectedModuleId.value = newEntry.id;
            layoutComponents.value = JSON.parse(JSON.stringify(layoutComponents.value));
        } else {
            const list = [...layoutComponents.value];
            list.push(newEntry);
            layoutComponents.value = list;
            selectedModuleId.value = newEntry.id;
        }
    }
    pushPreviewDraft();
}

function removeAt(list: LayoutComponentEntry[], index: number): void {
    if (!isTemplateMode.value) pushHistory();
    const entry = list[index];
    if (entry && selectedEntry.value?.id === entry.id) selectedModuleId.value = null;
    list.splice(index, 1);
    pushPreviewDraft();
}

function duplicateAt(list: LayoutComponentEntry[], index: number): void {
    if (!isTemplateMode.value) pushHistory();
    const reg = registry.value;
    if (!reg) return;
    const entry = list[index];
    if (!entry) return;
    const newEntry: LayoutComponentEntry = {
        id: reg.generateLayoutComponentId(),
        type: entry.type,
        data: JSON.parse(JSON.stringify(entry.data ?? {})),
        children: Array.isArray(entry.children) ? JSON.parse(JSON.stringify(entry.children)) : undefined,
    };
    list.splice(index + 1, 0, newEntry);
    selectedModuleId.value = newEntry.id;
    pushPreviewDraft();
}

function moveAt(list: LayoutComponentEntry[], fromIndex: number, direction: 'up' | 'down'): void {
    if (!isTemplateMode.value) pushHistory();
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= list.length) return;
    [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
    pushPreviewDraft();
}

function getComponentLabel(type: string, entry?: { data?: Record<string, unknown> }): string {
    const label = entry?.data?.moduleLabel;
    if (typeof label === 'string' && label.trim() !== '') {
        return label.trim();
    }
    return registry.value?.LAYOUT_COMPONENT_REGISTRY?.find((r: { type: string }) => r.type === type)?.label ?? type;
}

const saveInProgress = ref(false);

function saveToTemplate(): void {
    if (!props.template || isTemplateMode.value === false) return;
    saveInProgress.value = true;
    const data = {
        layout_components: (pageData.value as SitePageData).layout_components ?? [],
        colors: (pageData.value as SitePageData).colors ?? undefined,
    };
    fetch(designRoutes.update.url({ template: props.template.id }), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ page_slug: currentPageSlug.value, data }),
        credentials: 'same-origin',
    })
        .then((res) => {
            if (res.ok) {
                notify.success('Gespeichert.');
            } else {
                notify.error('Fehler beim Speichern.');
            }
        })
        .catch(() => {
            notify.error('Fehler beim Speichern.');
        })
        .finally(() => {
            saveInProgress.value = false;
        });
}

function saveToSite(): void {
    if (isTemplateMode.value || !props.site) return;
    const data = fullCustomPageData.value;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('custom_colors', JSON.stringify(data.colors ?? {}));
    formData.append('custom_page_data', JSON.stringify(data));
    fetch(sitesUpdate({ site: props.site.uuid }).url, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
        body: formData,
        credentials: 'same-origin',
    })
        .then((res) => {
            if (res.ok) {
                notify.success('Gespeichert.');
                pushPreviewDraft();
            } else {
                notify.error('Fehler beim Speichern.');
            }
        })
        .catch(() => {
            notify.error('Fehler beim Speichern.');
        });
}

function onMessage(event: MessageEvent) {
    const data = event.data;
    if (data?.type === 'page-designer-select' && typeof data.moduleId === 'string') {
        selectedModuleId.value = data.moduleId;
    }
}

watch(
    pageData,
    () => pushPreviewDraft(),
    { deep: true },
);

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

function onKeydown(e: KeyboardEvent): void {
    if (isTemplateMode.value) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            redo();
        } else {
            undo();
        }
    }
}

const pageTitle = computed(() =>
    isTemplateMode.value
        ? `Template-Standard: ${props.template?.name ?? 'Design'}`
        : `Page Designer: ${props.site?.name ?? ''}`,
);

const displayName = computed(() => (isTemplateMode.value ? props.template?.name : props.site?.name) ?? '');

onMounted(() => {
    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKeydown);
    if (!isTemplateMode.value && props.site) {
        postDraft();
    }
});

onUnmounted(() => {
    window.removeEventListener('message', onMessage);
    window.removeEventListener('keydown', onKeydown);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
});
</script>

<template>
    <div class="fixed inset-0 z-50 flex flex-col bg-background">
        <Head :title="pageTitle" />

        <!-- Admin mode banner -->
        <div
            v-if="isTemplateMode"
            class="flex shrink-0 items-center gap-2 border-b border-amber-500/50 bg-amber-500/10 px-4 py-2 text-amber-800 dark:text-amber-200"
        >
            <ShieldAlert class="h-5 w-5 shrink-0" />
            <span class="text-sm font-semibold">Admin: Layout-Vorlage bearbeiten</span>
            <span class="text-xs opacity-90">Änderungen gelten als Standard für alle Sites mit diesem Template.</span>
        </div>

        <header
            class="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4"
            :class="{ 'fixed top-0 left-0 right-0 z-20': previewFullscreen }"
            :style="isTemplateMode ? { top: '2.5rem' } : undefined"
        >
            <div class="flex items-center gap-3">
                <Link v-if="isTemplateMode" :href="templates.show({ template: template!.id }).url">
                    <Button type="button" variant="ghost" size="sm">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        Zurück zum Template
                    </Button>
                </Link>
                <Link v-else-if="site?.uuid" :href="sitesShow({ site: site.uuid }).url">
                    <Button type="button" variant="ghost" size="sm">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        Zurück zur Site
                    </Button>
                </Link>
                <span class="text-sm font-medium text-muted-foreground">{{ displayName }}</span>
                <div class="flex rounded-md border border-border bg-muted/50 p-0.5">
                    <template v-if="isTemplateMode">
                        <Button
                            v-for="p in templatePagesList"
                            :key="p.slug"
                            type="button"
                            :variant="currentPageSlug === p.slug ? 'default' : 'ghost'"
                            size="sm"
                            class="h-7 px-2 text-xs"
                            @click="switchPage(p.slug)"
                        >
                            {{ p.name }}
                        </Button>
                    </template>
                    <template v-else>
                        <div
                            v-for="p in sitePagesList"
                            :key="p.slug"
                            class="flex items-center gap-1"
                        >
                            <Button
                                type="button"
                                :variant="currentPageSlug === p.slug ? 'default' : 'ghost'"
                                size="sm"
                                class="h-7 px-2 text-xs"
                                @click="switchPage(p.slug)"
                            >
                                {{ getPageLabel(p.slug) }}
                            </Button>
                            <Badge
                                variant="secondary"
                                class="text-[10px] px-1 py-0 font-normal"
                            >
                                {{ getPageSourceBadge(p.slug) }}
                            </Badge>
                            <template v-if="p.slug !== 'index'">
                                <span class="text-[10px] text-muted-foreground">Aktiv</span>
                                <Switch
                                    :model-value="isPageActive(p.slug)"
                                    @update:model-value="(v: boolean) => setPageActive(p.slug, v)"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    class="h-6 w-6 text-destructive"
                                    :title="p.isCustom ? 'Seite löschen' : 'Seite deaktivieren (aus Nav entfernen)'"
                                    @click="deletePage(p.slug)"
                                >
                                    <Trash2 class="h-3 w-3" />
                                </Button>
                            </template>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="h-7 text-xs"
                            title="Neue Seite hinzufügen"
                            @click="openAddPageModal"
                        >
                            <Plus class="mr-1 h-3 w-3" />
                            Seite hinzufügen
                        </Button>
                    </template>
                </div>
                <div v-if="!isTemplateMode" class="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="!canUndo"
                        title="Rückgängig (Strg+Z)"
                        @click="undo"
                    >
                        <Undo2 class="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        :disabled="!canRedo"
                        title="Wiederherstellen (Strg+Umschalt+Z)"
                        @click="redo"
                    >
                        <Redo2 class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <Button
                    v-if="previewFullscreen"
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Vollbild beenden"
                    @click="previewFullscreen = false"
                >
                    <Minimize2 class="mr-1 h-4 w-4" />
                    Vollbild beenden
                </Button>
                <span
                    v-if="draftSavedLabel"
                    class="text-xs text-muted-foreground"
                    :title="draftSavedLabel"
                >
                    {{ draftSavedLabel }}
                </span>
                <Button
                    type="button"
                    size="sm"
                    :disabled="saveInProgress"
                    @click="isTemplateMode ? saveToTemplate() : saveToSite()"
                >
                    <Save class="mr-1 h-4 w-4" />
                    Speichern
                </Button>
            </div>
        </header>

        <div class="flex min-h-0 flex-1 bg-muted/20" :class="{ relative: previewFullscreen }">
            <aside
                class="flex w-[300px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-border bg-background p-3"
                :class="{
                    'fixed left-0 top-12 bottom-0 z-20 w-[300px] border-r overflow-y-auto p-3 bg-background/95 backdrop-blur-sm':
                        previewFullscreen,
                }"
                :style="isTemplateMode && previewFullscreen ? { top: '4.5rem' } : undefined"
            >
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm">Komponenten</CardTitle>
                        <CardDescription class="text-xs">
                            {{
                                selectedEntry && acceptsChildren(selectedEntry.type as LayoutComponentType)
                                    ? `Wird in „${getComponentLabel(selectedEntry.type, selectedEntry)}“ eingefügt`
                                    : 'Wird unten an der Seite eingefügt'
                            }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="pt-0">
                        <Button
                            type="button"
                            variant="outline"
                            class="w-full"
                            title="Komponenten-Galerie öffnen"
                            @click="componentGalleryOpen = true"
                        >
                            <Plus class="mr-2 h-4 w-4" />
                            Galerie öffnen
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm">Seitenstruktur</CardTitle>
                        <CardDescription class="text-xs">Pfeile: Reihenfolge. Klick: Bearbeiten.</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-1 pt-0">
                        <SidebarTreeFlat
                            :list="layoutComponents"
                            :get-component-label="getComponentLabel"
                            :selected-module-id="selectedModuleId"
                            @update:list="onSidebarListUpdate"
                            @remove="onSidebarRemove"
                            @duplicate="onSidebarDuplicate"
                            @move="onSidebarMove"
                            @select="(id) => (selectedModuleId = id)"
                        />
                        <p v-if="!layoutComponents.length" class="text-muted-foreground text-xs">
                            Keine Komponenten.
                        </p>
                    </CardContent>
                </Card>
            </aside>

            <main
                class="min-h-0 flex-1 overflow-auto p-4"
                :class="{ 'fixed inset-0 z-0 p-0 overflow-auto bg-muted/20': previewFullscreen }"
            >
                <div
                    class="mx-auto flex min-h-full flex-col items-center gap-3"
                    :class="{ 'h-full w-full max-w-none items-stretch': previewFullscreen }"
                >
                    <div
                        v-show="!previewFullscreen"
                        class="flex items-center gap-1 rounded-md border border-border bg-card/80 shadow-sm p-1"
                    >
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            :class="previewViewport === 'desktop' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                            title="Desktop"
                            @click="previewViewport = 'desktop'"
                        >
                            <Monitor class="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            :class="previewViewport === 'tablet' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                            title="Tablet"
                            @click="previewViewport = 'tablet'"
                        >
                            <Tablet class="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            :class="previewViewport === 'mobile' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                            title="Mobil"
                            @click="previewViewport = 'mobile'"
                        >
                            <Smartphone class="h-4 w-4" />
                        </Button>
                        <Button
                            v-if="previewViewport === 'desktop'"
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8"
                            :title="previewFullscreen ? 'Vollbild beenden' : 'Desktop-Vorschau im Vollbild'"
                            @click="previewFullscreen = !previewFullscreen"
                        >
                            <Minimize2 v-if="previewFullscreen" class="h-4 w-4" />
                            <Maximize2 v-else class="h-4 w-4" />
                        </Button>
                    </div>
                    <div
                        class="relative w-full overflow-auto rounded-lg border-2 border-border bg-muted shadow-xl transition-[max-width] light"
                        :class="[previewWrapperClass, previewFullscreen && 'rounded-none border-0 shadow-none min-h-full']"
                        :style="{ ...previewColors, transform: 'translateZ(0)' }"
                    >
                        <component
                            v-if="layoutComponent && registry"
                            :is="layoutComponent"
                            :page-data="pageData"
                            :colors="(pageData as SitePageData).colors ?? defaultColors"
                            :general-information="{ name: displayName }"
                            :site="site ?? undefined"
                            :design-mode="true"
                            :selected-module-id="selectedModuleId"
                            :insert-at-root="(index: number, type: string) => addComponent(type, index)"
                            :insert-at-parent="(parentId: string, index: number, type: string) => addComponent(type, index, parentId)"
                            class="min-h-[calc(100vh-8rem)]"
                            @select="selectedModuleId = $event"
                            @reorder="onLayoutReorder"
                            @drag-start="saveLayoutSnapshot"
                        />
                        <div
                            v-else
                            class="flex h-[calc(100vh-8rem)] min-h-[320px] items-center justify-center text-muted-foreground"
                        >
                            Vorschau wird geladen…
                        </div>
                    </div>
                </div>
            </main>

            <aside
                v-if="selectedEntry"
                class="flex w-[320px] shrink-0 flex-col overflow-y-auto border-l border-border bg-background"
                :class="{
                    'fixed right-0 top-12 bottom-0 z-20 w-[320px] border-l overflow-y-auto bg-background/95 backdrop-blur-sm':
                        previewFullscreen,
                }"
                :style="isTemplateMode && previewFullscreen ? { top: '4.5rem' } : undefined"
            >
                <div class="sticky top-0 z-10 border-b border-border bg-background px-3 py-2">
                    <h2 class="text-sm font-semibold">{{ getComponentLabel(selectedEntry.type, selectedEntry) }}</h2>
                    <p class="text-xs text-muted-foreground">Daten dieser Komponente</p>
                </div>
                <div class="flex-1 p-3">
                    <LayoutComponentContextPanel :entry="selectedEntry" :site="site ?? undefined" />
                </div>
            </aside>
        </div>

        <ComponentGalleryModal
            :open="componentGalleryOpen"
            :components="registry?.LAYOUT_COMPONENT_REGISTRY ?? []"
            :get-component-label="getComponentLabel"
            :get-layout-component="registry?.getLayoutComponent"
            @select="(type) => { addComponent(type); componentGalleryOpen = false; }"
            @close="componentGalleryOpen = false"
        />
        <MediaLibraryModal
            v-if="site"
            :open="mediaLibraryOpen"
            :site-uuid="site.uuid"
            @select="onMediaLibrarySelect"
            @close="onMediaLibraryClose"
        />
        <AddPageModal
            :open="addPageModalOpen"
            @close="addPageModalOpen = false"
            @add="onAddPage"
        />
    </div>
</template>
