<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { storePreviewDraft } from '@/actions/App/Http/Controllers/SiteRenderController';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { show as sitesShow, update as sitesUpdate } from '@/routes/sites';
import type { SitePageData, SitePageDataColors } from '@/types/site-page-data';
import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren } from '@/templates/praxisemerald/component-registry';
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { getTemplateEntry } from '@/templates/template-registry';
import { Plus, Copy, Trash2, ArrowLeft, Save } from 'lucide-vue-next';
import LayoutComponentContextPanel from '@/templates/praxisemerald/LayoutComponentContextPanel.vue';
import SidebarTreeLevel from '@/pages/sites/SidebarTreeLevel.vue';

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

type Template = {
    id: number;
    name: string;
    slug: string;
    page_data: SitePageData | null;
};

type Site = {
    id: number;
    name: string;
    slug: string;
    custom_page_data: Partial<SitePageData> | null;
    custom_colors: Partial<SitePageDataColors> | null;
    template: Template;
};

type Props = {
    site: Site;
    baseDomain: string;
};

const props = defineProps<Props>();

const templateEntry = computed(() => getTemplateEntry(props.site.template?.slug));
const registry = computed(() => templateEntry.value?.getComponentRegistry?.());

function defaultLayoutComponents(): LayoutComponentEntry[] {
    const reg = registry.value;
    if (!reg) return [];
    return [
        { id: 'header_default', type: 'header', data: reg.getDefaultDataForType('header') },
        { id: 'footer_default', type: 'footer', data: reg.getDefaultDataForType('footer') },
    ];
}

function mergePageData(): SitePageData | Record<string, unknown> {
    const entry = templateEntry.value;
    const templateData = (props.site.template?.page_data ?? {}) as Record<string, unknown>;
    const custom = (props.site.custom_page_data ?? {}) as Record<string, unknown>;
    const defaultBase = (entry?.getDefaultPageData?.() ?? templateData ?? {}) as Record<string, unknown>;
    const base = deepMergePreferNonEmpty(defaultBase, templateData) as Record<string, unknown>;
    const merged = deepMergePreferNonEmpty(base, custom) as Record<string, unknown>;
    const customColors = props.site.custom_colors ?? (custom.colors as Record<string, string> | undefined);
    const templateLayout = Array.isArray(templateData.layout_components) ? templateData.layout_components : [];
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

const pageData = ref<SitePageData | Record<string, unknown>>(mergePageData());

const layoutComponents = computed({
    get: () => (pageData.value as SitePageData).layout_components ?? [],
    set: (val) => {
        (pageData.value as SitePageData).layout_components = val;
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

function postDraft() {
    const data = pageData.value as Record<string, unknown>;
    const payload = {
        custom_page_data: data,
        custom_colors: (data.colors as Record<string, string>) ?? {},
    };
    return fetch(storePreviewDraft({ site: props.site.id }).url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
    });
}

function pushPreviewDraft() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        postDraft();
    }, 400);
}

function onLayoutReorder(tree: LayoutComponentEntry[]) {
    layoutComponents.value = tree;
    pushPreviewDraft();
}

function addComponent(type: LayoutComponentType | string) {
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
    const selected = selectedEntry.value;
    if (selected && acceptsChildren(selected.type as LayoutComponentType)) {
        const children = selected.children ?? [];
        selected.children = [...children, newEntry];
        selectedModuleId.value = newEntry.id;
    } else {
        const list = [...layoutComponents.value];
        list.push(newEntry);
        layoutComponents.value = list;
        selectedModuleId.value = newEntry.id;
    }
    pushPreviewDraft();
}

function removeAt(list: LayoutComponentEntry[], index: number): void {
    const entry = list[index];
    if (entry && selectedEntry.value?.id === entry.id) selectedModuleId.value = null;
    list.splice(index, 1);
    pushPreviewDraft();
}

function duplicateAt(list: LayoutComponentEntry[], index: number): void {
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
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= list.length) return;
    [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
    pushPreviewDraft();
}

function getComponentLabel(type: string): string {
    return registry.value?.LAYOUT_COMPONENT_REGISTRY?.find((r: { type: string }) => r.type === type)?.label ?? type;
}

function saveToSite() {
    const data = pageData.value as Record<string, unknown>;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('custom_colors', JSON.stringify(data.colors ?? {}));
    formData.append('custom_page_data', JSON.stringify(data));
    fetch(sitesUpdate({ site: props.site.id }).url, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
        body: formData,
        credentials: 'same-origin',
    }).then(() => {
        pushPreviewDraft();
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

onMounted(() => {
    window.addEventListener('message', onMessage);
    postDraft();
});

onUnmounted(() => {
    window.removeEventListener('message', onMessage);
    if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<template>
    <div class="fixed inset-0 z-50 flex flex-col bg-background">
        <Head :title="`Page Designer: ${site.name}`" />

        <header class="flex h-12 shrink-0 items-center justify-between border-b px-4">
            <div class="flex items-center gap-3">
                <Link :href="sitesShow({ site: site.id }).url">
                    <Button type="button" variant="ghost" size="sm">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        Zurück zur Site
                    </Button>
                </Link>
                <span class="text-sm font-medium text-muted-foreground">{{ site.name }}</span>
            </div>
            <Button type="button" size="sm" @click="saveToSite">
                <Save class="mr-1 h-4 w-4" />
                Speichern
            </Button>
        </header>

        <div class="flex min-h-0 flex-1">
            <aside class="flex w-[260px] shrink-0 flex-col gap-3 overflow-y-auto border-r p-3">
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm">Komponenten</CardTitle>
                        <CardDescription class="text-xs">
                            {{ selectedEntry && acceptsChildren(selectedEntry.type as LayoutComponentType) ? `Wird in „${getComponentLabel(selectedEntry.type)}“ eingefügt` : 'Wird unten an der Seite eingefügt' }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex flex-wrap gap-2 pt-0">
                        <Button
                            v-for="reg in (registry?.LAYOUT_COMPONENT_REGISTRY ?? [])"
                            :key="reg.type"
                            type="button"
                            variant="outline"
                            size="sm"
                            @click="addComponent(reg.type)"
                        >
                            <Plus class="mr-1 h-3 w-3" />
                            {{ reg.label }}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle class="text-sm">Seitenstruktur</CardTitle>
                        <CardDescription class="text-xs">Pfeile: Reihenfolge. Klick: Bearbeiten.</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-1 pt-0">
                        <SidebarTreeLevel
                            :list="layoutComponents"
                            :get-component-label="getComponentLabel"
                            :selected-module-id="selectedModuleId"
                            :remove-at="removeAt"
                            :duplicate-at="duplicateAt"
                            :move-at="moveAt"
                            @update:list="(v) => (layoutComponents = v)"
                            @select="(id) => (selectedModuleId = id)"
                        />
                        <p v-if="!layoutComponents.length" class="text-muted-foreground text-xs">
                            Keine Komponenten.
                        </p>
                    </CardContent>
                </Card>
            </aside>

            <main class="min-h-0 flex-1 overflow-auto p-4">
                <div class="mx-auto flex min-h-full items-start justify-center">
                    <div
                        class="relative w-full max-w-4xl overflow-auto rounded-lg border bg-muted shadow-lg"
                        :style="previewColors"
                    >
                        <component
                            v-if="layoutComponent && registry"
                            :is="layoutComponent"
                            :page-data="pageData"
                            :colors="(pageData as SitePageData).colors ?? defaultColors"
                            :general-information="{ name: site.name }"
                            :site="site"
                            :design-mode="true"
                            :selected-module-id="selectedModuleId"
                            class="min-h-[calc(100vh-8rem)]"
                            @select="selectedModuleId = $event"
                            @reorder="onLayoutReorder"
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
                class="flex w-[320px] shrink-0 flex-col overflow-y-auto border-l bg-muted/30"
            >
                <div class="sticky top-0 z-10 border-b bg-background px-3 py-2">
                    <h2 class="text-sm font-semibold">{{ getComponentLabel(selectedEntry.type) }}</h2>
                    <p class="text-xs text-muted-foreground">Daten dieser Komponente</p>
                </div>
                <div class="flex-1 p-3">
                    <LayoutComponentContextPanel :entry="selectedEntry" :site="site" />
                </div>
            </aside>
        </div>
    </div>
</template>
