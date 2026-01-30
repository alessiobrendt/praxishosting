<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import SiteController from '@/actions/App/Http/Controllers/SiteController';
import { storePreviewDraft } from '@/actions/App/Http/Controllers/SiteRenderController';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { index as sitesIndex, show as sitesShow, preview as sitesPreview, design as sitesDesign } from '@/routes/sites';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { SitePageData, SitePageDataColors } from '@/types/site-page-data';
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue';
import { getTemplateEntry } from '@/templates/template-registry';

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

/**
 * Deep merge: only overwrite with source values that are "meaningful"
 * so empty strings/arrays from template or site don't clear defaults.
 */
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
    has_page_designer?: boolean;
    custom_page_data: Partial<SitePageData> | null;
    custom_colors: Partial<SitePageDataColors> | null;
    template: Template;
};

type Props = {
    site: Site;
};

const props = defineProps<Props>();

type EditForm = ReturnType<typeof useForm> & {
    name: string;
    custom_colors: Record<string, string>;
    custom_page_data: Record<string, unknown>;
    errors: { name?: string };
};
const form = useForm({
    name: props.site.name,
    custom_colors: {},
    custom_page_data: {},
}) as unknown as EditForm;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Sites', href: sitesIndex().url },
    {
        title: props.site.name,
        href: sitesShow({ site: props.site.id }).url,
    },
    { title: 'Bearbeiten', href: '#' },
];

const templateEntry = computed(() => getTemplateEntry(props.site.template?.slug));

const canShowPageDesigner = computed(
    () => props.site.has_page_designer && templateEntry.value?.getComponentRegistry != null,
);

function defaultLayoutComponents(): SitePageData['layout_components'] {
    const registry = templateEntry.value?.getComponentRegistry?.();
    if (!registry) return [];
    return [
        { id: 'header_default', type: 'header', data: registry.getDefaultDataForType('header') },
        { id: 'footer_default', type: 'footer', data: registry.getDefaultDataForType('footer') },
    ];
}

/** Build initial pageData: registry/template default → template page_data → site custom (non-empty merge). */
function mergePageData(): SitePageData | Record<string, unknown> {
    const entry = getTemplateEntry(props.site.template?.slug);
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
        layout_components: (layout_components?.length ?? 0) > 0 ? layout_components : (merged.layout_components ?? undefined),
    } as SitePageData;
}

const pageData = ref<SitePageData | Record<string, unknown>>(mergePageData());

const siteEditorComponent = computed(() => {
    const e = templateEntry.value;
    const siteEditor = e?.SiteEditor;
    if (!siteEditor) return null;
    if (typeof siteEditor === 'function') {
        return defineAsyncComponent(siteEditor as () => Promise<{ default: import('vue').Component }>);
    }
    return siteEditor;
});

const genericJsonString = ref('');
function applyGenericJson() {
    try {
        const parsed = JSON.parse(genericJsonString.value) as Record<string, unknown>;
        pageData.value = { ...parsed };
    } catch {
        // keep previous on invalid JSON
    }
}

watch(
    pageData,
    (v) => {
        const data = v as Record<string, unknown>;
        form.custom_colors = (data.colors as Record<string, string>) ?? {};
        form.custom_page_data = data;
    },
    { deep: true },
);

onMounted(() => {
    const data = pageData.value as Record<string, unknown>;
    form.custom_colors = (data.colors as Record<string, string>) ?? {};
    form.custom_page_data = data;
    if (!templateEntry.value?.SiteEditor) {
        genericJsonString.value = JSON.stringify(pageData.value, null, 2);
    }
});

const previewIframeRef = ref<HTMLIFrameElement | null>(null);
const previewUrl = computed(() => sitesPreview({ site: props.site.id }).url);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function updatePreview() {
    const data = pageData.value as Record<string, unknown>;
    form.custom_colors = (data.colors as Record<string, string>) ?? {};
    form.custom_page_data = data;
    const payload = {
        custom_page_data: form.custom_page_data,
        custom_colors: form.custom_colors,
    };
    fetch(storePreviewDraft({ site: props.site.id }).url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
    }).then(() => {
        if (previewIframeRef.value?.contentWindow) {
            previewIframeRef.value.contentWindow.location.reload();
        }
    });
}

function submitForm() {
    if (!templateEntry.value?.SiteEditor) {
        applyGenericJson();
    }
    const data = pageData.value as Record<string, unknown>;
    form.custom_colors = (data.colors as Record<string, string>) ?? {};
    form.custom_page_data = data;
    form.put(SiteController.update.url({ site: props.site.id }), {
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Bearbeiten: ${site.name}`" />

        <div class="flex flex-col gap-6 lg:flex-row">
            <div class="min-w-0 flex-1 space-y-6">
                <div>
                    <Heading level="h1">Inhalt bearbeiten</Heading>
                    <Text class="mt-2" muted>{{ site.name }}</Text>
                </div>

                <form class="space-y-6" @submit.prevent="submitForm">
                    <Card>
                        <CardHeader>
                            <CardTitle>Name</CardTitle>
                            <CardDescription>Name der Praxis / Site</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                name="name"
                                :aria-invalid="!!form.errors.name"
                            />
                            <InputError :message="form.errors.name" />
                        </CardContent>
                    </Card>

                    <template v-if="siteEditorComponent">
                        <component :is="siteEditorComponent" :site="site" :page-data="pageData" />
                    </template>
                    <template v-else>
                        <Card>
                            <CardHeader>
                                <CardTitle>Seitendaten (JSON)</CardTitle>
                                <CardDescription>Bearbeiten Sie die Seitendaten als JSON. Ungültiges JSON wird beim Speichern ignoriert.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Label for="generic-json">page_data</Label>
                                <textarea
                                    id="generic-json"
                                    v-model="genericJsonString"
                                    class="mt-2 flex min-h-[320px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                                    rows="16"
                                    @blur="applyGenericJson"
                                />
                            </CardContent>
                        </Card>
                    </template>

                    <Card>
                        <CardFooter class="flex gap-2">
                            <Button type="submit">Speichern</Button>
                            <Button type="button" variant="outline" @click="updatePreview">
                                Vorschau aktualisieren
                            </Button>
                            <a :href="previewUrl" target="_blank" rel="noopener noreferrer">
                                <Button type="button" variant="outline">
                                    Vorschau in neuem Tab öffnen
                                </Button>
                            </a>
                            <Link v-if="canShowPageDesigner" :href="sitesDesign({ site: site.id }).url">
                                <Button type="button" variant="outline">
                                    Page Designer
                                </Button>
                            </Link>
                            <Link :href="sitesShow({ site: site.id }).url">
                                <Button type="button" variant="outline">Abbrechen</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </form>
            </div>

            <aside class="w-full lg:w-[420px] shrink-0">
                <Card>
                    <CardHeader>
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Live-Vorschau</CardTitle>
                                <CardDescription>Vorschau mit aktuellen Daten (nach Klick auf „Vorschau aktualisieren“)</CardDescription>
                            </div>
                            <a :href="previewUrl" target="_blank" rel="noopener noreferrer">
                                <Button type="button" variant="outline" size="sm">
                                    In neuem Tab öffnen
                                </Button>
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="aspect-[9/16] w-full overflow-hidden rounded-md border bg-muted">
                            <iframe
                                ref="previewIframeRef"
                                :src="previewUrl"
                                title="Vorschau"
                                class="h-full w-full scale-[0.35] origin-top-left"
                                style="min-height: 160%; min-width: 285%"
                            />
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </div>
    </AppLayout>
</template>
