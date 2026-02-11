<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { storePreviewDraft } from '@/actions/App/Http/Controllers/SiteRenderController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { show as sitesShow, update as sitesUpdate } from '@/routes/sites';
import templates from '@/routes/admin/templates';
import designRoutes from '@/routes/admin/templates/design';
import type { SitePageData, SitePageDataColors, GlobalFonts, GlobalButtonStyle } from '@/types/site-page-data';
import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineAsyncComponent, provide } from 'vue';
import { getTemplateEntry } from '@/templates/template-registry';
import { Plus, Copy, Trash2, ArrowLeft, Save, Undo2, Redo2, Monitor, Tablet, Smartphone, Maximize2, Minimize2, ShieldAlert, ImageIcon, ListTree, FileStack, Palette, Type, Square, X, Pencil, Settings, ChevronLeft, ChevronRight, Menu, MoreVertical } from 'lucide-vue-next';
import { usePageDesignerHistory } from '@/composables/usePageDesignerHistory';
import { notify } from '@/composables/useNotify';
import PraxisemeraldLayoutComponentContextPanel from '@/templates/praxisemerald/LayoutComponentContextPanel.vue';
import ComponentGalleryModal from '@/templates/praxisemerald/ComponentGalleryModal.vue';
import MediaLibraryModal from '@/templates/praxisemerald/MediaLibraryModal.vue';
import AddPageModal from '@/pages/PageDesigner/AddPageModal.vue';
import SectionList from '@/pages/PageDesigner/SectionList.vue';
import SidebarTreeFlat from '@/pages/PageDesigner/SidebarTreeFlat.vue';
import { COLOR_KEYS, COLOR_PALETTE_PRESETS } from '@/pages/PageDesigner/colorPalettePresets';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    treeToFlat,
    flatToTree,
    normalizeDepthsAfterDrop,
    getSubtreeEndIndex,
    getPreviousSiblingStart,
    moveFlatSubtree,
} from '@/lib/layout-tree';

/** Fallback only when template has no default (should not happen). */
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

/** Template-spezifische Standardfarben (z. B. Handyso orange, Praxisemerald grün). */
const templateDefaultColors = computed((): Record<string, string> => {
    const data = templateEntry.value?.getDefaultPageData?.();
    const c = (data as Record<string, unknown>)?.colors as Record<string, string> | undefined;
    return (c && Object.keys(c).length > 0 ? c : defaultColors) as Record<string, string>;
});

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
const getAcceptsChildren = computed(() => registry.value?.acceptsChildren);
const LayoutComponentContextPanelComponent = computed(
    () => templateEntry.value?.LayoutComponentContextPanel ?? PraxisemeraldLayoutComponentContextPanel,
);

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
    // Im Designer gesetzte Farben (custom.colors) haben Vorrang vor initialem props.site.custom_colors, damit die gewählte Palette in Vorschau und beim Speichern verwendet wird.
    let customColors = (custom.colors as Record<string, string> | undefined) ?? props.site!.custom_colors ?? undefined;
    if (customColors && customColors === props.site!.custom_colors) {
        // Nur bei initialen DB-Daten: veraltete Default-Farben ignorieren
        if (customColors.primary === defaultColors.primary) {
            customColors = undefined;
        }
    }
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
            colors: { ...templateDefaultColors.value, ...(customColors ?? {}) },
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
        colors: { ...templateDefaultColors.value, ...(customColors ?? {}) },
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
    colors: {},
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
        // Veraltete DB-Farben (z. B. #059669 von Praxisemerald) durch Template-Standard ersetzen.
        const templateColors = templateDefaultColors.value;
        const stored = (data.colors ?? {}) as Record<string, string>;
        const isStaleColors = stored.primary === defaultColors.primary;
        data.colors = isStaleColors ? { ...templateColors } : { ...templateColors, ...stored };
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
            const templateColors = templateDefaultColors.value;
            const stored = (data.colors ?? {}) as Record<string, string>;
            const isStale = stored.primary === defaultColors.primary;
            data.colors = isStale ? { ...templateColors } : { ...templateColors, ...stored };
            pageData.value = data as SitePageData;
        }
    } else {
        currentPageSlug.value = slug as PageSlug;
        pageData.value = mergePageDataForSlug(slug as PageSlug, fullCustomPageData.value);
    }
    selectedModuleId.value = null;
}

/** Set page colors (Design tab). Template mode: mutate current page data. Site mode: update fullCustomPageData and refresh pageData. */
function setPageColors(colors: Partial<SitePageDataColors>): void {
    if (isTemplateMode.value) {
        const data = pageData.value as Record<string, unknown>;
        if (!data.colors || typeof data.colors !== 'object') data.colors = { ...templateDefaultColors.value };
        data.colors = { ...(data.colors as Record<string, string>), ...colors };
        return;
    }
    pushHistory();
    const prev = (fullCustomPageData.value.colors ?? {}) as Record<string, string>;
    fullCustomPageData.value = {
        ...fullCustomPageData.value,
        colors: { ...templateDefaultColors.value, ...prev, ...colors },
    };
    pageData.value = mergePageDataForSlug(currentPageSlug.value as PageSlug, fullCustomPageData.value);
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

/** Ref for right panel (context panel) – scroll into view and focus first field on selection. */
const rightPanelRef = ref<HTMLElement | null>(null);

/** Runs after two nextTicks so Vue and vuedraggable can finish any in-flight patches before we replace the tree. */
function scheduleLayoutUpdate(apply: () => void): void {
    nextTick(() => {
        nextTick(apply);
    });
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

const previewColors = computed(() => {
    const c = (pageData.value as SitePageData).colors ?? {};
    const fallback = templateDefaultColors.value;
    return {
        '--primary': c.primary ?? fallback.primary,
        '--primary-hover': c.primaryHover ?? fallback.primaryHover,
        '--primary-light': c.primaryLight ?? fallback.primaryLight,
        '--primary-dark': c.primaryDark ?? fallback.primaryDark,
        '--secondary': c.secondary ?? fallback.secondary,
        '--tertiary': c.tertiary ?? fallback.tertiary,
        '--quaternary': c.quaternary ?? fallback.quaternary,
        '--quinary': c.quinary ?? fallback.quinary,
    };
});

/** Preview root style: colors + global_fonts + global_button_style so template and preview use them. */
const previewStyles = computed(() => {
    const data = pageData.value as SitePageData & { global_fonts?: GlobalFonts; global_button_style?: GlobalButtonStyle };
    const fonts = data?.global_fonts ?? {};
    const btn = data?.global_button_style ?? {};
    return {
        ...previewColors.value,
        '--font-heading': fonts.heading ?? 'inherit',
        '--font-body': fonts.body ?? 'inherit',
        '--button-variant': btn.variant ?? 'default',
        '--button-radius': btn.radius ?? 'md',
        '--button-size': btn.size ?? 'default',
    };
});

/** Pro Template-Slug gecacht, damit nicht bei jedem Computed-Lauf ein neues defineAsyncComponent entsteht (vermeidet "Cannot read properties of null (reading 'component')"). */
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

/** When true, show full tree below Abschnitte in sidebar (onepage optional "Baum anzeigen"). */
const showTreeInSidebar = ref(false);

/** Active tab in left sidebar: struktur | seiten | medien | design */
const leftSidebarTab = ref<'struktur' | 'seiten' | 'medien' | 'design'>('struktur');

/** When true, the content panel (Struktur/Seiten/Medien/Design) is visible next to the icon strip. */
const leftSidebarContentOpen = ref(true);

function getLeftSidebarTabTitle(tab: typeof leftSidebarTab.value): string {
    const t: Record<typeof leftSidebarTab.value, string> = {
        struktur: 'Struktur',
        seiten: 'Seiten',
        medien: 'Medien',
        design: 'Design',
    };
    return t[tab] ?? tab;
}

/** Design sub-section label for header when one is selected. */
function getDesignSectionTitle(section: 'farben' | 'schriftarten' | 'button'): string {
    const t = { farben: 'Farben', schriftarten: 'Schriftarten', button: 'Button' };
    return t[section];
}

/** Left sidebar content panel width: wider when Design sub-section is open. */
const leftSidebarPanelWidthClass = computed(() => {
    if (leftSidebarTab.value === 'design' && designSection.value !== null) return 'w-[400px]';
    return 'w-[280px]';
});

watch(
    () => props.site,
    (hasSite) => {
        if (!hasSite && leftSidebarTab.value === 'medien') leftSidebarTab.value = 'struktur';
    },
    { immediate: true },
);

/** Which design sub-section is shown: null = selection menu, else single section. */
const designSection = ref<'farben' | 'schriftarten' | 'button' | null>(null);

watch(
    leftSidebarTab,
    (tab) => {
        if (tab !== 'design') designSection.value = null;
    },
    { immediate: false },
);

/** Which color key is currently being edited (opens native color picker). */
const colorPickerKey = ref<keyof SitePageDataColors | null>(null);
const colorInputRef = ref<HTMLInputElement | null>(null);

/** Active colors for Design tab (pageData.colors with template fallback). */
const activeColors = computed((): Record<string, string> => {
    const c = (pageData.value as SitePageData).colors;
    const fallback = templateDefaultColors.value;
    if (!c || typeof c !== 'object') return { ...fallback };
    return { ...fallback, ...c };
});

function openColorPicker(key: keyof SitePageDataColors): void {
    colorPickerKey.value = key;
    nextTick(() => {
        const el = colorInputRef.value;
        if (el) {
            el.value = activeColors.value[key] ?? '#000000';
            el.click();
        }
    });
}

function onColorInput(e: Event): void {
    const key = colorPickerKey.value;
    const value = (e.target as HTMLInputElement).value;
    if (key) setPageColors({ [key]: value });
    colorPickerKey.value = null;
}

/** Button variant options for global style. */
const BUTTON_VARIANT_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard (Primary)' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'link', label: 'Link' },
    { value: 'destructive', label: 'Destructive' },
];

/** Button radius options. */
const BUTTON_RADIUS_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard' },
    { value: 'none', label: 'Keine' },
    { value: 'sm', label: 'Klein' },
    { value: 'md', label: 'Mittel' },
    { value: 'lg', label: 'Groß' },
    { value: 'full', label: 'Voll (Pill)' },
];

/** Button size options. */
const BUTTON_SIZE_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard' },
    { value: 'sm', label: 'Klein' },
    { value: 'lg', label: 'Groß' },
];

/** Font options for global heading/body (Tailwind/theme + common). */
const FONT_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard (Sans)' },
    { value: 'var(--font-sans)', label: 'Instrument Sans (Theme)' },
    { value: 'ui-sans-serif, system-ui, sans-serif', label: 'System UI' },
    { value: 'ui-serif, Georgia, serif', label: 'Serif (Georgia)' },
    { value: 'ui-monospace, ui-sans-serif, monospace', label: 'Monospace' },
    { value: 'Georgia, "Times New Roman", Times, serif', label: 'Georgia' },
    { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Inter, ui-sans-serif, system-ui, sans-serif', label: 'Inter' },
    { value: '"Open Sans", ui-sans-serif, sans-serif', label: 'Open Sans' },
];

/** Active global_fonts. Site mode: from root fullCustomPageData. Template mode: from current pageData. */
const activeGlobalFonts = computed((): GlobalFonts => {
    if (isTemplateMode.value) {
        const data = pageData.value as Record<string, unknown>;
        const f = data?.global_fonts;
        return (f && typeof f === 'object' ? { ...(f as GlobalFonts) } : {}) as GlobalFonts;
    }
    const f = fullCustomPageData.value.global_fonts;
    return (f && typeof f === 'object' ? { ...(f as GlobalFonts) } : {}) as GlobalFonts;
});

/** Set global fonts (Design tab). Same pattern as setPageColors. */
function setPageGlobalFonts(fonts: Partial<GlobalFonts>): void {
    if (isTemplateMode.value) {
        const data = pageData.value as Record<string, unknown>;
        if (!data.global_fonts || typeof data.global_fonts !== 'object') data.global_fonts = {};
        (data.global_fonts as Record<string, string>) = { ...(data.global_fonts as GlobalFonts), ...fonts };
        return;
    }
    pushHistory();
    const prev = (fullCustomPageData.value.global_fonts ?? {}) as GlobalFonts;
    fullCustomPageData.value = {
        ...fullCustomPageData.value,
        global_fonts: { ...prev, ...fonts },
    };
    pageData.value = mergePageDataForSlug(currentPageSlug.value as PageSlug, fullCustomPageData.value);
}

/** Active global_button_style. Site mode: from root fullCustomPageData. Template mode: from current pageData. */
const activeGlobalButtonStyle = computed((): GlobalButtonStyle => {
    if (isTemplateMode.value) {
        const data = pageData.value as Record<string, unknown>;
        const b = data?.global_button_style;
        return (b && typeof b === 'object' ? { ...(b as GlobalButtonStyle) } : {}) as GlobalButtonStyle;
    }
    const b = fullCustomPageData.value.global_button_style;
    return (b && typeof b === 'object' ? { ...(b as GlobalButtonStyle) } : {}) as GlobalButtonStyle;
});

/** Set global button style (Design tab). */
function setPageGlobalButtonStyle(style: Partial<GlobalButtonStyle>): void {
    if (isTemplateMode.value) {
        const data = pageData.value as Record<string, unknown>;
        if (!data.global_button_style || typeof data.global_button_style !== 'object') data.global_button_style = {};
        (data.global_button_style as Record<string, string>) = { ...(data.global_button_style as GlobalButtonStyle), ...style };
        return;
    }
    pushHistory();
    const prev = (fullCustomPageData.value.global_button_style ?? {}) as GlobalButtonStyle;
    fullCustomPageData.value = {
        ...fullCustomPageData.value,
        global_button_style: { ...prev, ...style },
    };
    pageData.value = mergePageDataForSlug(currentPageSlug.value as PageSlug, fullCustomPageData.value);
}

/** When true, gallery selection adds new section at end (from "+ Abschnitt hinzufügen"). */
const componentGalleryInsertAtEnd = ref(false);

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
/** Wenn true, nutzen Grid/Flex Container Queries statt Media Queries – Breakpoints folgen der Vorschau-Container-Breite. */
provide('usePreviewContainerQueries', true);

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

const previewViewport = ref<PreviewViewport>('desktop');
const previewFullscreen = ref(false);

/**
 * Desktop: min-width 1280px; Tablet/Mobile: max-width, damit Container Queries im Vorschau-Wrapper die Breite liefern.
 */
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
    const snapshot = layoutDragStartSnapshot.value;
    if (newCount < currentCount && snapshot !== null) {
        layoutDragStartSnapshot.value = null;
        const restored = JSON.parse(JSON.stringify(snapshot));
        scheduleLayoutUpdate(() => {
            layoutComponents.value = restored;
            syncLayoutComponentsToFullCustom(layoutComponents.value);
            if (import.meta.env.DEV) {
                console.debug('[PageDesigner] Reorder abgebrochen: weniger Einträge, Snapshot wiederhergestellt.');
            }
        });
        return;
    }
    layoutDragStartSnapshot.value = null;
    if (!isTemplateMode.value) pushHistory();
    scheduleLayoutUpdate(() => {
        layoutComponents.value = cleaned;
        pushPreviewDraft();
    });
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
    const cleaned = cleanLayoutTree(tree);
    scheduleLayoutUpdate(() => {
        layoutComponents.value = cleaned;
        pushPreviewDraft();
    });
}

function onSidebarRemove(flatIndex: number): void {
    if (!isTemplateMode.value) pushHistory();
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
    const removed = flat[flatIndex];
    if (removed && selectedModuleId.value === removed.entry.id) {
        selectedModuleId.value = null;
    }
    flat.splice(flatIndex, 1);
    const newTree = flatToTree(flat, getAcceptsChildren.value);
    scheduleLayoutUpdate(() => {
        layoutComponents.value = newTree;
        pushPreviewDraft();
    });
}

function onSidebarDuplicate(flatIndex: number): void {
    if (!isTemplateMode.value) pushHistory();
    const reg = registry.value;
    if (!reg) return;
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
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
    const newTree = flatToTree(flat, getAcceptsChildren.value);
    scheduleLayoutUpdate(() => {
        layoutComponents.value = newTree;
        pushPreviewDraft();
    });
}

function onSidebarMove(flatIndex: number, direction: 'up' | 'down'): void {
    if (!isTemplateMode.value) pushHistory();
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
    const fromEnd = getSubtreeEndIndex(flat, flatIndex);
    const acc = getAcceptsChildren.value;
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
        pushPreviewDraft();
    });
}

/** Flat index of the rootIndex-th root-level entry (depth 0) in the current tree. */
function getFlatIndexForRootIndex(rootIndex: number): number {
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
    let count = 0;
    for (let i = 0; i < flat.length; i++) {
        if (flat[i].depth === 0) {
            if (count === rootIndex) return i;
            count += 1;
        }
    }
    return -1;
}

/** Flat index of the entry with the given id in the current tree. */
function getFlatIndexForId(id: string): number {
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
    return flat.findIndex((f) => f.entry.id === id);
}

/** Clipboard for copy/paste in block context menu. */
const copiedBlockRef = ref<LayoutComponentEntry | null>(null);

function insertEntryAfterFlatIndex(flatIndex: number, newEntry: LayoutComponentEntry): void {
    const flat = treeToFlat(layoutComponents.value, 0, getAcceptsChildren.value);
    const endIndex = getSubtreeEndIndex(flat, flatIndex);
    const depth = flat[flatIndex].depth;
    const newFlat = [
        ...flat.slice(0, endIndex + 1),
        { entry: newEntry, depth },
        ...flat.slice(endIndex + 1),
    ];
    const normalized = normalizeDepthsAfterDrop(newFlat, getAcceptsChildren.value);
    const newTree = flatToTree(normalized, getAcceptsChildren.value);
    scheduleLayoutUpdate(() => {
        layoutComponents.value = newTree;
        pushPreviewDraft();
    });
    selectedModuleId.value = newEntry.id;
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

const blockContextActions = computed(() => ({
    duplicate: onBlockDuplicate,
    remove: onBlockRemove,
    copy: onBlockCopy,
    paste: onBlockPaste,
    getCanPaste: () => !!copiedBlockRef.value,
}));

/** Block context menu actions (duplicate, remove, copy, paste) for canvas. */
provide('blockContextActions', blockContextActions);
/** Selected block id for inline editor (block components can inject to know if they are selected). */
provide('selectedModuleId', selectedModuleId);

function onSectionListUpdate(newRootOrder: LayoutComponentEntry[]): void {
    if (!isTemplateMode.value) pushHistory();
    scheduleLayoutUpdate(() => {
        layoutComponents.value = newRootOrder;
        pushPreviewDraft();
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

/**
 * Immutably inserts newEntry into the tree at parentId. Returns a new tree (no mutation).
 * Prevents Vue parentNode errors when adding nested elements by avoiding mutate-then-replace.
 */
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
            cloned.children = cloneTreeAndInsertAtParent(
                entry.children,
                parentId,
                insertIndex,
                newEntry,
            );
        }
        return cloned;
    });
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
            newTree = cloneTreeAndInsertAtParent(
                layoutComponents.value,
                selected.id,
                idx,
                newEntry,
            );
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
        pushPreviewDraft();
    });
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

/** When selection changes, scroll right panel into view and focus first editable field (inline-editor Option A). */
watch(selectedModuleId, (id) => {
    if (!id) return;
    nextTick(() => {
        rightPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        nextTick(() => {
            const firstFocusable = rightPanelRef.value?.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
                'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable="true"]',
            );
            firstFocusable?.focus({ preventScroll: true });
        });
    });
});

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
    layoutComponentCache.clear();
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
                <span class="text-xs text-muted-foreground">{{ getPageLabel(currentPageSlug) }}</span>
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
            <!-- Left sidebar: schmaler Icon-Streifen (dunkel) + optionales Inhalts-Panel (hell) -->
            <aside
                class="flex shrink-0 flex-row border-r border-border transition-[width] duration-200 ease-out"
                :class="[
                    leftSidebarContentOpen ? 'w-[calc(3.5rem+280px)]' : 'w-14',
                    previewFullscreen && 'fixed left-0 top-12 bottom-0 z-20 bg-background/95 backdrop-blur-sm',
                ]"
                :style="isTemplateMode && previewFullscreen ? { top: '4.5rem' } : undefined"
            >
                <!-- Icon-Streifen (dunkel), immer sichtbar – Sidebar kann nur klein (nur Icons) oder groß (mit Panel) sein -->
                <div class="flex w-14 shrink-0 flex-col border-r border-border bg-muted/80">
                    <div class="flex h-10 shrink-0 items-center justify-center border-b border-border">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8"
                            :title="leftSidebarContentOpen ? 'Inhalts-Panel schließen (klein)' : 'Inhalts-Panel öffnen'"
                            @click="leftSidebarContentOpen = !leftSidebarContentOpen"
                        >
                            <ChevronLeft v-if="leftSidebarContentOpen" class="h-4 w-4" />
                            <ChevronRight v-else class="h-4 w-4" />
                        </Button>
                    </div>
                        <nav class="flex flex-1 flex-col gap-0.5 py-2 px-1" aria-label="Sidebar">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-9 w-9"
                                :class="leftSidebarTab === 'struktur' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                                title="Struktur"
                                @click="leftSidebarTab = 'struktur'; leftSidebarContentOpen = true"
                            >
                                <Menu class="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-9 w-9"
                                :class="leftSidebarTab === 'seiten' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                                title="Seiten"
                                @click="leftSidebarTab = 'seiten'; leftSidebarContentOpen = true"
                            >
                                <FileStack class="h-4 w-4" />
                            </Button>
                            <Button
                                v-if="site"
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-9 w-9"
                                :class="leftSidebarTab === 'medien' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                                title="Medien"
                                @click="leftSidebarTab = 'medien'; leftSidebarContentOpen = true"
                            >
                                <ImageIcon class="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-9 w-9"
                                :class="leftSidebarTab === 'design' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                                title="Design"
                                @click="leftSidebarTab = 'design'; leftSidebarContentOpen = true"
                            >
                                <Palette class="h-4 w-4" />
                            </Button>
                        </nav>
                </div>
                <!-- Inhalts-Panel (hell): Header mit Titel + X, darunter Tab-Inhalt -->
                <Transition name="sidebar-panel">
                        <div
                            v-if="leftSidebarContentOpen"
                            class="flex min-h-0 flex-1 flex-col overflow-hidden bg-background transition-[width]"
                            :class="leftSidebarPanelWidthClass"
                        >
                            <div class="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
                                <div class="flex min-w-0 flex-1 items-center gap-1">
                                    <Button
                                        v-if="leftSidebarTab === 'design' && designSection !== null"
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        class="h-7 w-7 shrink-0"
                                        aria-label="Zurück zur Design-Auswahl"
                                        @click="designSection = null"
                                    >
                                        <ArrowLeft class="h-4 w-4" />
                                    </Button>
                                    <h2 class="truncate text-sm font-semibold">
                                        {{ leftSidebarTab === 'design' && designSection ? getDesignSectionTitle(designSection) : getLeftSidebarTabTitle(leftSidebarTab) }}
                                    </h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    class="h-7 w-7 shrink-0"
                                    aria-label="Panel schließen"
                                    @click="leftSidebarContentOpen = false"
                                >
                                    <X class="h-4 w-4" />
                                </Button>
                            </div>
                            <div class="min-h-0 flex-1 overflow-y-auto p-3">
                                <!-- Tab: Struktur -->
                                <div v-show="leftSidebarTab === 'struktur'" class="space-y-2 p-2" role="tabpanel">
                                <Card>
                                    <CardHeader class="flex flex-row items-start justify-between gap-2 py-2 px-3">
                                        <div class="min-w-0">
                                            <CardTitle class="text-sm">Abschnitte</CardTitle>
                                            <CardDescription class="text-xs">Reihenfolge per Drag. Klick: Auswählen.</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger as-child>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    class="h-7 w-7 shrink-0"
                                                    aria-label="Optionen"
                                                    @click.stop
                                                >
                                                    <MoreVertical class="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" class="min-w-[11rem]">
                                                <DropdownMenuItem @select="openComponentGalleryForNewSection">
                                                    Abschnitt hinzufügen
                                                </DropdownMenuItem>
                                                <DropdownMenuItem @select="() => (showTreeInSidebar = !showTreeInSidebar)">
                                                    {{ showTreeInSidebar ? 'Baum ausblenden' : 'Baum anzeigen' }}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent class="space-y-1.5 px-3 pt-0 pb-3">
                                        <SectionList
                                            :list="layoutComponents"
                                            :get-component-label="getComponentLabel"
                                            :selected-module-id="selectedModuleId"
                                            @update:list="onSectionListUpdate"
                                            @select="(id) => (selectedModuleId = id)"
                                            @remove="onSectionRemove"
                                            @duplicate="onSectionDuplicate"
                                            @move="onSectionMove"
                                        />
                                    </CardContent>
                                </Card>
                                <Card v-if="showTreeInSidebar">
                                    <CardHeader class="py-2 px-3">
                                        <CardTitle class="text-sm">Seitenstruktur (Baum)</CardTitle>
                                        <CardDescription class="text-xs">Vollständiger Baum.</CardDescription>
                                    </CardHeader>
                                    <CardContent class="space-y-1 px-3 pt-0 pb-3">
                                        <SidebarTreeFlat
                                            :list="layoutComponents"
                                            :get-component-label="getComponentLabel"
                                            :selected-module-id="selectedModuleId"
                                            :get-accepts-children="getAcceptsChildren"
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
                            </div>
                            <!-- Tab: Seiten -->
                            <div v-show="leftSidebarTab === 'seiten'" class="space-y-3" role="tabpanel">
                                <Card>
                                    <CardHeader class="pb-2">
                                        <CardTitle class="text-sm">Seitenliste</CardTitle>
                                        <CardDescription class="text-xs">Seiten dieser Website.</CardDescription>
                                    </CardHeader>
                                    <CardContent class="space-y-1.5 pt-0">
                                        <template v-if="isTemplateMode">
                                            <Button
                                                v-for="p in templatePagesList"
                                                :key="p.slug"
                                                type="button"
                                                :variant="currentPageSlug === p.slug ? 'secondary' : 'ghost'"
                                                size="sm"
                                                class="w-full justify-start text-xs"
                                                @click="switchPage(p.slug)"
                                            >
                                                {{ p.name }}
                                            </Button>
                                        </template>
                                        <template v-else>
                                            <div
                                                v-for="p in sitePagesList"
                                                :key="p.slug"
                                                class="flex flex-wrap items-center gap-1 rounded-md border border-border p-1.5"
                                            >
                                                <Button
                                                    type="button"
                                                    :variant="currentPageSlug === p.slug ? 'secondary' : 'ghost'"
                                                    size="sm"
                                                    class="min-w-0 flex-1 justify-start text-xs"
                                                    @click="switchPage(p.slug)"
                                                >
                                                    {{ getPageLabel(p.slug) }}
                                                </Button>
                                                <Badge variant="secondary" class="text-[10px] px-1 py-0 font-normal">
                                                    {{ getPageSourceBadge(p.slug) }}
                                                </Badge>
                                                <template v-if="p.slug !== 'index'">
                                                    <Switch
                                                        :model-value="isPageActive(p.slug)"
                                                        @update:model-value="(v: boolean) => setPageActive(p.slug, v)"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        class="h-6 w-6 text-destructive"
                                                        :title="p.isCustom ? 'Seite löschen' : 'Seite deaktivieren'"
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
                                                class="w-full text-xs"
                                                @click="openAddPageModal"
                                            >
                                                <Plus class="mr-2 h-3 w-3" />
                                                Seite hinzufügen
                                            </Button>
                                        </template>
                                    </CardContent>
                                </Card>
                            </div>
                            <!-- Tab: Medien -->
                            <div v-show="leftSidebarTab === 'medien'" class="space-y-3" role="tabpanel">
                                <Card v-if="site">
                                    <CardHeader class="pb-2">
                                        <CardTitle class="text-sm">Media Library</CardTitle>
                                        <CardDescription class="text-xs">Bilder und Dateien.</CardDescription>
                                    </CardHeader>
                                    <CardContent class="pt-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            class="w-full"
                                            @click="mediaLibraryOpen = true"
                                        >
                                            <ImageIcon class="mr-2 h-4 w-4" />
                                            Media Library öffnen
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <!-- Tab: Design -->
                            <div v-show="leftSidebarTab === 'design'" class="space-y-3" role="tabpanel">
                                <!-- Design: Auswahl (Stil / UI-Kit) -->
                                <template v-if="designSection === null">
                                    <p class="text-muted-foreground text-xs">Wählen Sie einen Bereich.</p>
                                    <div class="space-y-4">
                                        <div>
                                            <p class="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Stil</p>
                                            <div class="space-y-1">
                                                <button
                                                    type="button"
                                                    class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                                    @click="designSection = 'farben'"
                                                >
                                                    <Palette class="h-5 w-5 shrink-0 text-muted-foreground" />
                                                    <span class="font-medium">Farben</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                                    @click="designSection = 'schriftarten'"
                                                >
                                                    <Type class="h-5 w-5 shrink-0 text-muted-foreground" />
                                                    <span class="font-medium">Schriftarten</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">UI-Kit</p>
                                            <div class="space-y-1">
                                                <button
                                                    type="button"
                                                    class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                                    @click="designSection = 'button'"
                                                >
                                                    <Square class="h-5 w-5 shrink-0 text-muted-foreground" />
                                                    <span class="font-medium">Button</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </template>

                                <!-- Design: Farben -->
                                <template v-else-if="designSection === 'farben'">
                                    <input
                                        ref="colorInputRef"
                                        type="color"
                                        class="absolute h-0 w-0 opacity-0 pointer-events-none"
                                        aria-hidden="true"
                                        @input="onColorInput"
                                    />
                                    <Card>
                                        <CardHeader class="pb-2">
                                            <CardTitle class="text-sm">Aktive Farben</CardTitle>
                                            <CardDescription class="text-xs">Klick auf einen Kreis zum Ändern.</CardDescription>
                                        </CardHeader>
                                        <CardContent class="pt-0">
                                            <div class="flex flex-wrap items-center gap-1">
                                                <button
                                                    v-for="(key, idx) in COLOR_KEYS"
                                                    :key="key"
                                                    type="button"
                                                    class="h-10 w-10 shrink-0 rounded-full border-2 border-border shadow-md transition-transform hover:scale-110 -ml-2 first:ml-0"
                                                    :style="{ backgroundColor: activeColors[key] || '#ccc', zIndex: COLOR_KEYS.length - idx }"
                                                    :title="key"
                                                    @click="openColorPicker(key)"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader class="pb-2">
                                            <CardTitle class="text-sm">Farbpaletten</CardTitle>
                                            <CardDescription class="text-xs">Palette wählen, um sie zu übernehmen.</CardDescription>
                                        </CardHeader>
                                        <CardContent class="pt-0">
                                            <div class="space-y-2 max-h-64 overflow-y-auto">
                                                <button
                                                    v-for="(palette, pIdx) in COLOR_PALETTE_PRESETS"
                                                    :key="pIdx"
                                                    type="button"
                                                    class="flex w-full items-center gap-0 rounded-lg border-2 border-transparent py-2 px-2 transition-colors hover:border-primary hover:bg-muted/50"
                                                    @click="setPageColors(palette)"
                                                >
                                                    <span
                                                        v-for="(colorKey, cIdx) in COLOR_KEYS"
                                                        :key="cIdx"
                                                        class="h-6 w-6 shrink-0 rounded-full border border-border -ml-2 first:ml-0"
                                                        :style="{ backgroundColor: palette[colorKey], zIndex: COLOR_KEYS.length - cIdx }"
                                                    />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </template>

                                <!-- Design: Schriftarten (Karten mit Vorschau) -->
                                <template v-else-if="designSection === 'schriftarten'">
                                    <Card v-if="activeGlobalFonts.heading || activeGlobalFonts.body" class="mb-4">
                                        <CardHeader class="pb-2">
                                            <CardTitle class="text-sm">Vorschau</CardTitle>
                                            <CardDescription class="text-xs">Aktuelle Kombination.</CardDescription>
                                        </CardHeader>
                                        <CardContent class="pt-0">
                                            <p
                                                class="text-lg font-semibold"
                                                :style="{ fontFamily: (activeGlobalFonts.heading as string) || 'inherit' }"
                                            >
                                                Überschrift Beispiel
                                            </p>
                                            <p
                                                class="mt-1 text-base text-muted-foreground"
                                                :style="{ fontFamily: (activeGlobalFonts.body as string) || 'inherit' }"
                                            >
                                                The quick brown fox jumps over the lazy dog.
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <div class="space-y-4">
                                        <div>
                                            <p class="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Überschriften</p>
                                            <div class="grid gap-2">
                                                <button
                                                    v-for="opt in FONT_OPTIONS"
                                                    :key="'h-' + (opt.value || 'default')"
                                                    type="button"
                                                    class="rounded-lg border-2 p-3 text-left transition-colors"
                                                    :class="(activeGlobalFonts.heading ?? '') === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'"
                                                    @click="setPageGlobalFonts({ heading: opt.value === '' ? undefined : opt.value })"
                                                >
                                                    <p class="text-muted-foreground text-xs">{{ opt.label }}</p>
                                                    <p
                                                        class="mt-1 text-lg font-semibold"
                                                        :style="{ fontFamily: opt.value || 'inherit' }"
                                                    >
                                                        Überschrift
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Fließtext</p>
                                            <div class="grid gap-2">
                                                <button
                                                    v-for="opt in FONT_OPTIONS"
                                                    :key="'b-' + (opt.value || 'default')"
                                                    type="button"
                                                    class="rounded-lg border-2 p-3 text-left transition-colors"
                                                    :class="(activeGlobalFonts.body ?? '') === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'"
                                                    @click="setPageGlobalFonts({ body: opt.value === '' ? undefined : opt.value })"
                                                >
                                                    <p class="text-muted-foreground text-xs">{{ opt.label }}</p>
                                                    <p
                                                        class="mt-1 text-base"
                                                        :style="{ fontFamily: opt.value || 'inherit' }"
                                                    >
                                                        The quick brown fox.
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </template>

                                <!-- Design: Button (Vorschau + Einstellungen) -->
                                <template v-else-if="designSection === 'button'">
                                    <Card class="mb-4">
                                        <CardHeader class="pb-2">
                                            <CardTitle class="text-sm">So sieht Ihr Button aus</CardTitle>
                                            <CardDescription class="text-xs">Live-Vorschau mit aktuellen Einstellungen.</CardDescription>
                                        </CardHeader>
                                        <CardContent class="flex flex-wrap items-center gap-3 pt-0">
                                            <Button
                                                :variant="(activeGlobalButtonStyle.variant as 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive') || 'default'"
                                                :size="(activeGlobalButtonStyle.size as 'default' | 'sm' | 'lg' | 'icon') || 'default'"
                                                :class="[
                                                    activeGlobalButtonStyle.radius === 'none' && 'rounded-none',
                                                    activeGlobalButtonStyle.radius === 'sm' && 'rounded-sm',
                                                    activeGlobalButtonStyle.radius === 'md' && 'rounded-md',
                                                    activeGlobalButtonStyle.radius === 'lg' && 'rounded-lg',
                                                    activeGlobalButtonStyle.radius === 'full' && 'rounded-full',
                                                ]"
                                            >
                                                Beispiel-Button
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    <div class="mb-4 flex flex-wrap gap-2">
                                        <button
                                            v-for="preset in [{ v: '', l: 'Primary' }, { v: 'outline', l: 'Outline' }, { v: 'ghost', l: 'Ghost' }]"
                                            :key="preset.v"
                                            type="button"
                                            class="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                                            :class="(activeGlobalButtonStyle.variant ?? '') === preset.v ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50'"
                                            @click="setPageGlobalButtonStyle({ variant: preset.v === '' ? undefined : preset.v })"
                                        >
                                            {{ preset.l }}
                                        </button>
                                    </div>
                                    <Card>
                                        <CardHeader class="pb-2">
                                            <CardTitle class="text-sm">Einstellungen</CardTitle>
                                        </CardHeader>
                                        <CardContent class="space-y-3 pt-0">
                                            <div class="space-y-1">
                                                <Label class="text-xs">Variant</Label>
                                                <Select
                                                    :model-value="activeGlobalButtonStyle.variant ?? ''"
                                                    class="h-9 w-full text-sm"
                                                    @update:model-value="(v: string | number) => setPageGlobalButtonStyle({ variant: (v === '' ? undefined : String(v)) })"
                                                >
                                                    <option
                                                        v-for="opt in BUTTON_VARIANT_OPTIONS"
                                                        :key="opt.value || 'default'"
                                                        :value="opt.value"
                                                    >
                                                        {{ opt.label }}
                                                    </option>
                                                </Select>
                                            </div>
                                            <div class="space-y-1">
                                                <Label class="text-xs">Eckenradius</Label>
                                                <Select
                                                    :model-value="activeGlobalButtonStyle.radius ?? ''"
                                                    class="h-9 w-full text-sm"
                                                    @update:model-value="(v: string | number) => setPageGlobalButtonStyle({ radius: (v === '' ? undefined : String(v)) })"
                                                >
                                                    <option
                                                        v-for="opt in BUTTON_RADIUS_OPTIONS"
                                                        :key="opt.value || 'default'"
                                                        :value="opt.value"
                                                    >
                                                        {{ opt.label }}
                                                    </option>
                                                </Select>
                                            </div>
                                            <div class="space-y-1">
                                                <Label class="text-xs">Größe</Label>
                                                <Select
                                                    :model-value="activeGlobalButtonStyle.size ?? ''"
                                                    class="h-9 w-full text-sm"
                                                    @update:model-value="(v: string | number) => setPageGlobalButtonStyle({ size: (v === '' ? undefined : String(v)) })"
                                                >
                                                    <option
                                                        v-for="opt in BUTTON_SIZE_OPTIONS"
                                                        :key="opt.value || 'default'"
                                                        :value="opt.value"
                                                    >
                                                        {{ opt.label }}
                                                    </option>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </template>
                            </div>
                            </div>
                        </div>
                </Transition>
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
                        class="relative w-full overflow-auto rounded-lg border-2 border-border bg-muted shadow-xl transition-[max-width] light page-designer-preview-container site-render @container"
                        :class="[previewWrapperClass, previewFullscreen && 'rounded-none border-0 shadow-none min-h-full']"
                        :style="{
                            ...previewStyles,
                            transform: 'translateZ(0)',
                            containerType: 'inline-size',
                            containerName: 'page-designer-preview',
                        }"
                    >
                        <component
                            v-if="layoutComponent && registry"
                            :is="layoutComponent"
                            :page-data="pageData"
                            :colors="(pageData as SitePageData).colors ?? templateDefaultColors"
                            :general-information="{ name: displayName }"
                            :site="site ?? undefined"
                            :design-mode="true"
                            :selected-module-id="selectedModuleId"
                            :insert-at-root="(index: number, type: string) => addComponent(type, index)"
                            :insert-at-parent="(parentId: string, index: number, type: string) => addComponent(type, index, parentId)"
                            :global-button-style="(pageData as SitePageData).global_button_style ?? {}"
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
        </div>

        <!-- Schwebendes Kontext-Popover: erscheint beim Klick auf einen Bereich/Block, Settings wie in Referenz -->
        <Teleport to="body">
            <Transition name="context-panel">
                <div
                    v-if="selectedEntry"
                    class="fixed inset-0 z-[60]"
                    role="presentation"
                    aria-hidden="true"
                >
                    <!-- Klick außerhalb schließt das Popover -->
                    <button
                        type="button"
                        class="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
                        aria-label="Einstellungen schließen"
                        @click="selectedModuleId = null"
                    />
                    <div
                        class="absolute right-6 top-24 bottom-6 flex min-h-0 w-[380px] flex-col rounded-xl border border-border bg-card shadow-xl"
                        role="dialog"
                        aria-labelledby="context-panel-title"
                        aria-modal="true"
                        @click.stop
                    >
                        <div class="flex shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                            <h2 id="context-panel-title" class="text-sm font-semibold">
                                {{ getComponentLabel(selectedEntry.type, selectedEntry) }}
                            </h2>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 shrink-0"
                                aria-label="Eigenschaften schließen"
                                @click="selectedModuleId = null"
                            >
                                <X class="h-4 w-4" />
                            </Button>
                        </div>
                        <Tabs default-tab="inhalt" class="flex min-h-0 flex-1 flex-col">
                            <TabsList class="mx-3 mt-2 shrink-0 rounded-lg bg-muted/80 p-1">
                                <TabsTrigger value="inhalt" class="gap-1.5 text-xs">
                                    <Pencil class="h-3.5 w-3.5" />
                                    Inhalt
                                </TabsTrigger>
                                <TabsTrigger value="design" class="gap-1.5 text-xs">
                                    <Palette class="h-3.5 w-3.5" />
                                    Design
                                </TabsTrigger>
                                <TabsTrigger value="aktionen" class="gap-1.5 text-xs">
                                    <Settings class="h-3.5 w-3.5" />
                                    Aktionen
                                </TabsTrigger>
                            </TabsList>
                            <div ref="rightPanelRef" class="min-h-0 flex-1 overflow-y-auto p-3">
                                <TabsContent value="inhalt" class="mt-0">
                                    <component
                                        :is="LayoutComponentContextPanelComponent"
                                        :entry="selectedEntry"
                                        :site="site ?? undefined"
                                        :colors="(pageData as SitePageData).colors ?? templateDefaultColors"
                                    />
                                </TabsContent>
                                <TabsContent value="design" class="mt-0">
                                    <p class="text-muted-foreground text-xs">
                                        Farben, Abstände und Animationen finden Sie unter dem Tab „Inhalt“.
                                    </p>
                                </TabsContent>
                                <TabsContent value="aktionen" class="mt-0">
                                    <p class="text-muted-foreground text-xs">
                                        Button-Aktionen und Links finden Sie unter dem Tab „Inhalt“.
                                    </p>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <ComponentGalleryModal
            :open="componentGalleryOpen"
            :components="registry?.LAYOUT_COMPONENT_REGISTRY ?? []"
            :get-component-label="getComponentLabel"
            :get-layout-component="registry?.getLayoutComponent"
            @select="onComponentGallerySelect"
            @close="componentGalleryOpen = false; componentGalleryInsertAtEnd = false"
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

<style scoped>
.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

.context-panel-enter-active,
.context-panel-leave-active {
    transition: opacity 0.15s ease;
}
.context-panel-enter-active button,
.context-panel-leave-active button {
    transition: opacity 0.15s ease;
}
.context-panel-enter-active [role="dialog"],
.context-panel-leave-active [role="dialog"] {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.context-panel-enter-from,
.context-panel-leave-to {
    opacity: 0;
}
.context-panel-enter-from [role="dialog"],
.context-panel-leave-to [role="dialog"] {
    transform: translateX(1rem);
    opacity: 0;
}
.context-panel-enter-to [role="dialog"],
.context-panel-leave-from [role="dialog"] {
    transform: translateX(0);
    opacity: 1;
}
</style>
