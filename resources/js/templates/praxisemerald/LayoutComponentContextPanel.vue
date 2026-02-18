<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/RichTextEditor.vue';
import { Select } from '@/components/ui/select';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { getEditorForType, getMetaForType } from '@/templates/praxisemerald/page_components/loader';
import type { PageComponentField } from '@/templates/praxisemerald/page_components/loader';
import { inject, ref, computed } from 'vue';
import { ImagePlus, Plus, Trash2, Upload } from 'lucide-vue-next';
import AnimationPicker from '@/templates/shared/components/AnimationPicker.vue';
import IconPicker from '@/templates/shared/components/IconPicker.vue';
import LinkPicker from '@/components/LinkPicker.vue';
import { usePageAnchors } from '@/composables/usePageAnchors';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    hasResponsiveValues as hasResponsiveValuesFromLib,
    getEffectiveDataAtBreakpoint,
    type ResponsiveBreakpoint,
} from '@/lib/responsive-styles';

const openMediaLibrary = inject<((callback: (url: string) => void) => void) | null>('openMediaLibrary', null);
const designer = inject<{
    getPageLabel: (slug: string) => string;
    currentPageSlug: string;
    sitePagesList: { slug: string; name: string }[];
    templatePagesList: { slug: string; name: string }[];
    isTemplateMode: boolean;
    layoutComponents: LayoutComponentEntry[];
    getLayoutForPage: (slug: string) => LayoutComponentEntry[];
    updateBlockField?: (entryId: string, fieldKey: string, value: string) => void;
    updateBlockFieldNested?: (entryId: string, dotPath: string, value: string) => void;
} | null>('designer', null);

const linkPickerPages = computed(
    () =>
        designer?.isTemplateMode
            ? (designer.templatePagesList ?? []).map((p) => ({ slug: p.slug, name: p.name }))
            : (designer?.sitePagesList ?? []).map((p) => ({ slug: p.slug, name: p.name })),
);

const linkPickerAnchors = computed(() =>
    usePageAnchors(designer?.layoutComponents ?? []),
);

function getAnchorsForPage(slug: string) {
    const layout = designer?.getLayoutForPage?.(slug) ?? [];
    return usePageAnchors(layout);
}

function hasResponsiveValues(data: Record<string, unknown>): boolean {
    return hasResponsiveValuesFromLib(data);
}

function usesNewResponsiveFormat(data: Record<string, unknown>): boolean {
    return !!(data.responsive && typeof data.responsive === 'object');
}

function ensureResponsiveTarget(
    data: Record<string, unknown>,
    breakpoint: ResponsiveBreakpoint
): Record<string, unknown> {
    if (breakpoint === 'desktop') {
        return data;
    }
    if (!data.responsive || typeof data.responsive !== 'object') {
        data.responsive = { tablet: {}, mobile: {} };
    }
    const r = data.responsive as Record<string, Record<string, unknown>>;
    if (breakpoint === 'tablet') {
        if (!r.tablet) r.tablet = {};
        return r.tablet;
    }
    if (breakpoint === 'mobile') {
        if (!r.mobile) r.mobile = {};
        return r.mobile;
    }
    return data as Record<string, unknown>;
}

const props = defineProps<{
    entry: LayoutComponentEntry;
    site?: { id: number; name: string; slug: string };
    /** Seitenthema-Farben (pageData.colors) für Bereich-Hintergrund – pro Template unterschiedlich. */
    colors?: Record<string, string>;
}>();

const pageComponentEditor = computed(() => getEditorForType(props.entry.type));
const pageComponentMeta = computed(() => getMetaForType(props.entry.type));

/** Farben aus pageData.colors → CSS-Variablen (kebab-case wie im PageDesigner/previewColors). */
const SECTION_BG_COLOR_KEYS = [
    { key: 'primary', var: '--primary', label: 'Primary' },
    { key: 'primaryLight', var: '--primary-light', label: 'Primary Light' },
    { key: 'primaryDark', var: '--primary-dark', label: 'Primary Dark' },
    { key: 'primaryHover', var: '--primary-hover', label: 'Primary Hover' },
    { key: 'secondary', var: '--secondary', label: 'Secondary' },
    { key: 'tertiary', var: '--tertiary', label: 'Tertiary' },
    { key: 'quaternary', var: '--quaternary', label: 'Quaternary' },
    { key: 'quinary', var: '--quinary', label: 'Quinary' },
] as const;

const sectionBgOptions = computed(() => {
    const c = props.colors ?? {};
    const opts: { value: string; label: string; swatch?: string }[] = [{ value: '', label: 'Keine' }];
    for (const { key, var: v, label } of SECTION_BG_COLOR_KEYS) {
        const hex = c[key];
        if (hex) opts.push({ value: `var(${v})`, label: `${label} (Seite)`, swatch: hex });
    }
    opts.push({ value: '__custom__', label: 'Benutzerdefiniert' });
    return opts;
});

function getSectionBackgroundSelectValue(d: Record<string, unknown>): string {
    const bg = d.backgroundColor as string | undefined;
    if (!bg) return '';
    const opts = sectionBgOptions.value;
    const found = opts.find((o) => o.value && o.value !== '__custom__' && o.value === bg);
    return found ? found.value : '__custom__';
}

function setSectionBackground(d: Record<string, unknown>, v: string): void {
    d.backgroundColor = v === '__custom__' ? d.backgroundColor || '#ffffff' : v || undefined;
}

function showSectionCustomColor(d: Record<string, unknown>): boolean {
    const bg = d.backgroundColor as string | undefined;
    if (!bg) return false;
    return !sectionBgOptions.value.some((o) => o.value && o.value !== '__custom__' && o.value === bg);
}

function getSectionCustomColorValue(d: Record<string, unknown>): string {
    const bg = d.backgroundColor as string | undefined;
    return bg && bg.startsWith('#') ? bg : '#ffffff';
}

function setSectionCustomColor(d: Record<string, unknown>, v: string): void {
    if (v && /^#[0-9a-fA-F]{3,8}$/.test(v)) d.backgroundColor = v;
}

const STANDARD_PADDING_VALUES = ['', '0', '0.5rem', '1rem', '1.5rem', '2rem', '3rem'];

// Track which padding fields have "Benutzerdefiniert" selected
const customPaddingLeft = ref<Record<string, boolean>>({});
const customPaddingRight = ref<Record<string, boolean>>({});

function getPaddingSelectValue(entryId: string, paddingValue: string | undefined, side: 'left' | 'right'): string {
    if (!paddingValue || paddingValue === '__custom__') {
        const isCustom = side === 'left' ? (customPaddingLeft.value?.[entryId] ?? false) : (customPaddingRight.value?.[entryId] ?? false);
        return isCustom ? '__custom__' : '';
    }
    const isCustom = side === 'left' ? (customPaddingLeft.value?.[entryId] ?? false) : (customPaddingRight.value?.[entryId] ?? false);
    if (isCustom) return '__custom__';
    const isNonStandard = !STANDARD_PADDING_VALUES.includes(paddingValue);
    if (isNonStandard) {
        // Auto-detect custom value and set flag
        if (side === 'left') {
            if (!customPaddingLeft.value) customPaddingLeft.value = {};
            customPaddingLeft.value[entryId] = true;
        } else {
            if (!customPaddingRight.value) customPaddingRight.value = {};
            customPaddingRight.value[entryId] = true;
        }
        return '__custom__';
    }
    return paddingValue;
}

function showPaddingCustomInput(entryId: string, paddingValue: string | undefined, side: 'left' | 'right'): boolean {
    const isCustom = side === 'left' ? (customPaddingLeft.value?.[entryId] ?? false) : (customPaddingRight.value?.[entryId] ?? false);
    // If custom flag is set, always show input (even if value is empty)
    if (isCustom) return true;
    // If value is __custom__ placeholder, show input
    if (paddingValue === '__custom__') {
        if (side === 'left') {
            if (!customPaddingLeft.value) customPaddingLeft.value = {};
            customPaddingLeft.value[entryId] = true;
        } else {
            if (!customPaddingRight.value) customPaddingRight.value = {};
            customPaddingRight.value[entryId] = true;
        }
        return true;
    }
    if (!paddingValue) return false;
    const isNonStandard = !STANDARD_PADDING_VALUES.includes(paddingValue);
    if (isNonStandard) {
        // Auto-detect custom value and set flag
        if (side === 'left') {
            if (!customPaddingLeft.value) customPaddingLeft.value = {};
            customPaddingLeft.value[entryId] = true;
        } else {
            if (!customPaddingRight.value) customPaddingRight.value = {};
            customPaddingRight.value[entryId] = true;
        }
        return true;
    }
    return false;
}

function getPaddingCustomValue(paddingValue: string | undefined): string {
    if (!paddingValue || paddingValue === '__custom__') return '';
    return !STANDARD_PADDING_VALUES.includes(paddingValue) ? paddingValue : '';
}

// Responsive helper functions
function enableResponsiveForGrid(data: Record<string, unknown>): void {
    if (!hasResponsiveValues(data)) {
        // Set intelligent defaults
        const baseColumns = (data.columns as string) || 'repeat(2, 1fr)';
        data.columns = '1fr'; // Mobile: 1 column
        data.columnsSm = 'repeat(2, 1fr)'; // Tablet: 2 columns
        data.columnsLg = baseColumns; // Desktop: use original or default to 3
        if (!data.columnsLg || data.columnsLg === '1fr') {
            data.columnsLg = 'repeat(3, 1fr)';
        }
    }
}

function enableResponsiveForFlex(data: Record<string, unknown>): void {
    if (!hasResponsiveValues(data)) {
        // Set intelligent defaults
        const baseDirection = (data.direction as string) || 'row';
        data.direction = 'column'; // Mobile: column
        data.directionLg = baseDirection === 'row' ? 'row' : 'column'; // Desktop: use original
    }
}

function disableResponsive(data: Record<string, unknown>, type: 'grid' | 'flex'): void {
    if (type === 'grid') {
        delete data.columnsSm;
        delete data.columnsMd;
        delete data.columnsLg;
        delete data.columnsXl;
        delete data.gapSm;
        delete data.gapMd;
        delete data.gapLg;
        delete data.gapXl;
    } else {
        delete data.directionSm;
        delete data.directionMd;
        delete data.directionLg;
        delete data.directionXl;
        delete data.justifySm;
        delete data.justifyMd;
        delete data.justifyLg;
        delete data.justifyXl;
        delete data.alignSm;
        delete data.alignMd;
        delete data.alignLg;
        delete data.alignXl;
        delete data.gapSm;
        delete data.gapMd;
        delete data.gapLg;
        delete data.gapXl;
    }
    delete data.responsive;
}

function enableResponsiveNewFormat(data: Record<string, unknown>, type: 'grid' | 'flex'): void {
    if (!data.responsive || typeof data.responsive !== 'object') {
        data.responsive = { tablet: {}, mobile: {} };
    }
    if (type === 'grid') {
        const baseColumns = (data.columns as string) || 'repeat(2, 1fr)';
        (data.responsive as Record<string, Record<string, unknown>>).tablet = { columns: 'repeat(2, 1fr)' };
        (data.responsive as Record<string, Record<string, unknown>>).mobile = { columns: '1fr' };
        data.columns = baseColumns;
    } else {
        const baseDirection = (data.direction as string) || 'row';
        (data.responsive as Record<string, Record<string, unknown>>).tablet = { direction: baseDirection };
        (data.responsive as Record<string, Record<string, unknown>>).mobile = { direction: 'column' };
        data.direction = baseDirection;
    }
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const imageInputRef = ref<HTMLInputElement | null>(null);
const pendingUpload = ref<'logoUrl' | 'imageSrc' | null>(null);

function triggerUpload(field: 'logoUrl' | 'imageSrc') {
    pendingUpload.value = field;
    imageInputRef.value?.click();
}

async function onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !pendingUpload.value || !props.site) return;
    const field = pendingUpload.value;
    pendingUpload.value = null;
    const fd = new FormData();
    fd.append('image', file);
    const r = await fetch(images.store.url({ site: props.site.uuid }), {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
    });
    const data = await r.json();
    if (!data.url) return;
    const d = props.entry.data as Record<string, unknown>;
    if (field === 'logoUrl') {
        d.logoUrl = data.url;
    } else {
        if (!d.image || typeof d.image !== 'object') d.image = { src: '', alt: '' };
        (d.image as Record<string, string>).src = data.url;
    }
    if (imageInputRef.value) imageInputRef.value.value = '';
}

function ensureLinks(entry: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(entry.links)) entry.links = [];
    return entry.links as { href: string; label: string }[];
}

function addNavLink() {
    const links = ensureLinks(props.entry.data as Record<string, unknown>);
    links.push({ href: '', label: '' });
}

function removeNavLink(i: number) {
    const links = ensureLinks(props.entry.data as Record<string, unknown>);
    links.splice(i, 1);
}

function ensureLinksSeiten(entry: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(entry.linksSeiten)) entry.linksSeiten = [];
    return entry.linksSeiten as { href: string; label: string }[];
}

function addLinkSeite() {
    ensureLinksSeiten(props.entry.data as Record<string, unknown>).push({ href: '', label: '' });
}

function removeLinkSeite(i: number) {
    ensureLinksSeiten(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function ensureLinksRechtliches(entry: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(entry.linksRechtliches)) entry.linksRechtliches = [];
    return entry.linksRechtliches as { href: string; label: string }[];
}

function addLinkRechtlich() {
    ensureLinksRechtliches(props.entry.data as Record<string, unknown>).push({ href: '', label: '' });
}

function removeLinkRechtlich(i: number) {
    ensureLinksRechtliches(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function ensureButtons(entry: Record<string, unknown>): { text: string; href: string; variant: string }[] {
    if (!Array.isArray(entry.buttons)) entry.buttons = [];
    return entry.buttons as { text: string; href: string; variant: string }[];
}

function addButton() {
    ensureButtons(props.entry.data as Record<string, unknown>).push({ text: '', href: '', variant: 'default' });
}

function removeButton(i: number) {
    ensureButtons(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function updateJson(value: string) {
    try {
        const parsed = JSON.parse(value) as Record<string, unknown>;
        Object.assign(props.entry.data, parsed);
    } catch {
        // ignore invalid JSON
    }
}

function ensureFeatures(entry: Record<string, unknown>): { icon: string; title: string; desc: string }[] {
    if (!Array.isArray(entry.features)) entry.features = [];
    return entry.features as { icon: string; title: string; desc: string }[];
}

function addAboutFeature() {
    ensureFeatures(props.entry.data as Record<string, unknown>).push({ icon: 'Stethoscope', title: '', desc: '' });
}

function removeAboutFeature(i: number) {
    ensureFeatures(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function ensureHours(entry: Record<string, unknown>): { day: string; hours: string }[] {
    if (!Array.isArray(entry.hours)) entry.hours = [];
    return entry.hours as { day: string; hours: string }[];
}

function addHoursRow() {
    ensureHours(props.entry.data as Record<string, unknown>).push({ day: '', hours: '' });
}

function removeHoursRow(i: number) {
    ensureHours(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function ensureCtaLinks(entry: Record<string, unknown>): { text: string; href: string; variant: string }[] {
    if (!Array.isArray(entry.links)) entry.links = [];
    return entry.links as { text: string; href: string; variant: string }[];
}

function addCtaLink() {
    ensureCtaLinks(props.entry.data as Record<string, unknown>).push({ text: '', href: '', variant: 'primary' });
}

function removeCtaLink(i: number) {
    ensureCtaLinks(props.entry.data as Record<string, unknown>).splice(i, 1);
}

/** Open media library to set image.src (Hero / Bild-URL). Debug-logged. */
function openMediaLibraryForImageSrc(): void {
    const entryId = props.entry?.id != null ? String(props.entry.id) : '';
    const hasNested = !!designer?.updateBlockFieldNested;
    openMediaLibrary?.((url) => {
        if (designer?.updateBlockFieldNested && entryId) {
            designer.updateBlockFieldNested(entryId, 'image.src', url);
        } else if (entryId) {
            if (!(props.entry.data as Record<string, unknown>).image) (props.entry.data as Record<string, unknown>).image = { src: '', alt: '' };
            ((props.entry.data as Record<string, unknown>).image as Record<string, string>).src = url;
        }
    });
}
</script>

<template>
    <input
        ref="imageInputRef"
        type="file"
        accept="image/*"
        class="sr-only"
        @change="onImageSelected"
    />

    <div class="space-y-4">
        <!-- Breite in Zeile (für alle Blöcke außer Section) -->
        <template v-if="entry.type !== 'section'">
            <div class="space-y-2">
                <Label>Breite in Zeile</Label>
                <Select
                    :model-value="(entry.data as Record<string, unknown>).flexBasis ?? ''"
                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).flexBasis = v)"
                >
                    <option value="">Auto (gleichmäßig)</option>
                    <option value="25%">25 %</option>
                    <option value="33.33%">⅓ (33 %)</option>
                    <option value="50%">50 %</option>
                    <option value="66.67%">⅔ (67 %)</option>
                    <option value="75%">75 %</option>
                    <option value="100%">100 %</option>
                </Select>
                <p class="text-muted-foreground text-xs">
                    Gilt, wenn dieser Block in einem Bereich mit Richtung „Zeile“ liegt.
                </p>
            </div>
        </template>
        <!-- Animation (für alle Einträge) -->
        <div class="space-y-2">
            <Label>Animation beim Einblenden</Label>
            <AnimationPicker
                :model-value="String((entry.data as Record<string, unknown>).motion ?? '')"
                @update:model-value="(v) => ((entry.data as Record<string, unknown>).motion = v || undefined)"
            />
        </div>
        <!-- Page components: Editor or generic form from meta.fields -->
        <template v-if="pageComponentEditor">
            <component :is="pageComponentEditor" :entry="entry" :site="site" />
        </template>
        <template v-else-if="pageComponentMeta?.fields?.length">
            <div class="space-y-3">
                <div
                    v-for="field in pageComponentMeta!.fields"
                    :key="field.key"
                    class="space-y-2"
                >
                    <Label :for="`field-${entry.id}-${field.key}`">{{ field.label }}</Label>
                    <Input
                        v-if="field.type === 'text' || field.type === 'number'"
                        :id="`field-${entry.id}-${field.key}`"
                        v-model="(entry.data as Record<string, unknown>)[field.key]"
                        :type="field.type"
                        class="w-full"
                    />
                    <RichTextEditor
                        v-else-if="field.type === 'richtext'"
                        :id="`field-${entry.id}-${field.key}`"
                        :model-value="String((entry.data as Record<string, unknown>)[field.key] ?? '')"
                        placeholder="Inhalt eingeben…"
                        class="w-full"
                        :show-ai-toolbar="!!openMediaLibrary"
                        :page-name="designer ? designer.getPageLabel(designer.currentPageSlug) : null"
                        :block-type="entry.type"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>)[field.key] = v)"
                    />
                    <textarea
                        v-else-if="field.type === 'textarea'"
                        :id="`field-${entry.id}-${field.key}`"
                        :value="(entry.data as Record<string, unknown>)[field.key]"
                        class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        @input="(e) => ((entry.data as Record<string, unknown>)[field.key] = (e.target as HTMLTextAreaElement).value)"
                    />
                    <Select
                        v-else-if="field.type === 'select' && field.options?.length"
                        :id="`field-${entry.id}-${field.key}`"
                        :model-value="String((entry.data as Record<string, unknown>)[field.key] ?? '')"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>)[field.key] = v)"
                    >
                        <option
                            v-for="opt in field.options"
                            :key="typeof opt === 'string' ? opt : opt.value"
                            :value="typeof opt === 'string' ? opt : opt.value"
                        >
                            {{ typeof opt === 'string' ? opt : opt.label }}
                        </option>
                    </Select>
                    <div v-else-if="field.type === 'image'" class="flex flex-wrap gap-2">
                        <Input
                            :id="`field-${entry.id}-${field.key}`"
                            :model-value="String((entry.data as Record<string, unknown>)[field.key] ?? '')"
                            placeholder="URL oder Bild hochladen"
                            class="min-w-0 flex-1"
                            @update:model-value="(v) => ((entry.data as Record<string, unknown>)[field.key] = v)"
                        />
                        <Button
                            v-if="openMediaLibrary"
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Aus Media Library wählen"
                            @click="openMediaLibrary((url) => { if (designer?.updateBlockField) designer.updateBlockField(entry.id, field.key, url); else (entry.data as Record<string, unknown>)[field.key] = url; })"
                        >
                            <ImagePlus class="h-4 w-4" />
                        </Button>
                    </div>
                    <IconPicker
                        v-else-if="field.type === 'icon'"
                        :id="`field-${entry.id}-${field.key}`"
                        :model-value="String((entry.data as Record<string, unknown>)[field.key] ?? '')"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>)[field.key] = v)"
                    />
                </div>
            </div>
        </template>
        <!-- Header -->
        <template v-else-if="entry.type === 'header'">
            <div class="space-y-2">
                <Label>Praxisname</Label>
                <Input v-model="(entry.data as Record<string, unknown>).siteName" />
            </div>
            <div class="space-y-2">
                <Label>Logo URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input
                        v-model="(entry.data as Record<string, unknown>).logoUrl"
                        placeholder="URL oder Bild hochladen"
                        class="min-w-0 flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" @click="triggerUpload('logoUrl')">
                        <Upload class="h-4 w-4" />
                    </Button>
                    <Button
                        v-if="openMediaLibrary"
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Aus Media Library wählen"
                        @click="openMediaLibrary((url) => { if (designer?.updateBlockField) designer.updateBlockField(entry.id, 'logoUrl', url); else (entry.data as Record<string, unknown>).logoUrl = url; })"
                    >
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>CTA Button Text</Label>
                <Input v-model="(entry.data as Record<string, unknown>).ctaButtonText" />
            </div>
            <div class="space-y-2">
                <Label>CTA Button Link</Label>
                <LinkPicker
                    v-if="designer"
                    :model-value="String((entry.data as Record<string, unknown>).ctaButtonHref ?? '')"
                    :pages="linkPickerPages"
                    :anchors="linkPickerAnchors"
                    :get-anchors-for-page="getAnchorsForPage"
                    :get-page-label="designer?.getPageLabel"
                    placeholder="URL eingeben…"
                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).ctaButtonHref = v)"
                />
                <Input
                    v-else
                    v-model="(entry.data as Record<string, unknown>).ctaButtonHref"
                    placeholder="URL"
                />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Navigation</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addNavLink">
                        <Plus class="mr-1 h-3 w-3" />
                        Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureLinks(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="flex items-start gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="h-9 min-w-0 flex-1 text-sm" />
                        <div class="min-w-[140px] flex-1">
                            <LinkPicker
                                v-if="designer"
                                :model-value="String(link.href ?? '')"
                                :pages="linkPickerPages"
                                :anchors="linkPickerAnchors"
                                :get-anchors-for-page="getAnchorsForPage"
                                :get-page-label="designer?.getPageLabel"
                                placeholder="URL"
                                @update:model-value="(v) => (link.href = v)"
                            />
                            <Input v-else v-model="link.href" placeholder="URL" class="h-9 w-full text-sm" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" class="h-9 w-9 shrink-0" @click="removeNavLink(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Footer -->
        <template v-else-if="entry.type === 'footer'">
            <div class="space-y-2">
                <Label>Praxisname</Label>
                <Input v-model="(entry.data as Record<string, unknown>).siteName" />
            </div>
            <div class="space-y-2">
                <Label>Beschreibung</Label>
                <Input v-model="(entry.data as Record<string, unknown>).description" />
            </div>
            <div class="space-y-2">
                <Label>Adresse</Label>
                <Input v-model="(entry.data as Record<string, unknown>).address" />
            </div>
            <div class="space-y-2">
                <Label>Telefon</Label>
                <Input v-model="(entry.data as Record<string, unknown>).phone" />
            </div>
            <div class="space-y-2">
                <Label>E-Mail</Label>
                <Input v-model="(entry.data as Record<string, unknown>).email" />
            </div>
            <div class="space-y-2">
                <Label>Öffnungszeiten</Label>
                <Input v-model="(entry.data as Record<string, unknown>).openingLine" />
            </div>
            <div class="space-y-2">
                <Label>Copyright</Label>
                <Input v-model="(entry.data as Record<string, unknown>).copyrightText" />
            </div>
            <div class="space-y-2">
                <Label>Credit-Zeile</Label>
                <Input v-model="(entry.data as Record<string, unknown>).creditLine" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links Seiten</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addLinkSeite">
                        <Plus class="mr-1 h-3 w-3" />
                        Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureLinksSeiten(entry.data as Record<string, unknown>)"
                        :key="'seiten-' + i"
                        class="flex items-start gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="h-9 min-w-0 flex-1 text-sm" />
                        <div class="min-w-[140px] flex-1">
                            <LinkPicker
                                v-if="designer"
                                :model-value="String(link.href ?? '')"
                                :pages="linkPickerPages"
                                :anchors="linkPickerAnchors"
                                :get-anchors-for-page="getAnchorsForPage"
                                :get-page-label="designer?.getPageLabel"
                                placeholder="URL"
                                @update:model-value="(v) => (link.href = v)"
                            />
                            <Input v-else v-model="link.href" placeholder="URL" class="h-9 w-full text-sm" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" class="h-9 w-9 shrink-0" @click="removeLinkSeite(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links Rechtliches</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addLinkRechtlich">
                        <Plus class="mr-1 h-3 w-3" />
                        Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureLinksRechtliches(entry.data as Record<string, unknown>)"
                        :key="'recht-' + i"
                        class="flex items-start gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="h-9 min-w-0 flex-1 text-sm" />
                        <div class="min-w-[140px] flex-1">
                            <LinkPicker
                                v-if="designer"
                                :model-value="String(link.href ?? '')"
                                :pages="linkPickerPages"
                                :anchors="linkPickerAnchors"
                                :get-anchors-for-page="getAnchorsForPage"
                                :get-page-label="designer?.getPageLabel"
                                placeholder="URL"
                                @update:model-value="(v) => (link.href = v)"
                            />
                            <Input v-else v-model="link.href" placeholder="URL" class="h-9 w-full text-sm" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" class="h-9 w-9 shrink-0" @click="removeLinkRechtlich(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Hero -->
        <template v-else-if="entry.type === 'hero'">
            <div class="space-y-2">
                <Label>Überschrift</Label>
                <Input v-model="(entry.data as Record<string, unknown>).heading" />
            </div>
            <div class="space-y-2">
                <Label>Text</Label>
                <RichTextEditor
                    :model-value="String((entry.data as Record<string, unknown>).text ?? '')"
                    placeholder="Text eingeben…"
                    min-height="80px"
                    :show-ai-toolbar="!!openMediaLibrary"
                    :page-name="designer ? designer.getPageLabel(designer.currentPageSlug) : null"
                    :block-type="entry.type"
                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).text = v)"
                />
            </div>
            <div class="space-y-2">
                <Label>Bild URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input
                        :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.src ?? ''"
                        placeholder="URL oder Bild hochladen"
                        class="min-w-0 flex-1"
                        @update:model-value="
                            (val) => {
                                if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                                ((entry.data as Record<string, unknown>).image as Record<string, string>).src = val;
                            }
                        "
                    />
                    <Button v-if="site" type="button" variant="outline" size="sm" @click="triggerUpload('imageSrc')">
                        <Upload class="h-4 w-4" />
                    </Button>
                    <Button
                        v-if="site && openMediaLibrary"
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Aus Media Library wählen"
                        @click="openMediaLibraryForImageSrc()"
                    >
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>Bild Alt-Text</Label>
                <Input
                    :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.alt ?? ''"
                    @update:model-value="
                        (val) => {
                            if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                            ((entry.data as Record<string, unknown>).image as Record<string, string>).alt = val;
                        }
                    "
                />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Buttons</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addButton">
                        <Plus class="mr-1 h-3 w-3" />
                        Button
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(btn, i) in ensureButtons(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="space-y-1 rounded border p-2"
                    >
                        <div class="flex gap-2">
                            <Input v-model="btn.text" placeholder="Text" class="min-w-0 flex-1" />
                            <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeButton(i)">
                                <Trash2 class="h-3.5 w-3.5 text-destructive" />
                            </Button>
                        </div>
                        <LinkPicker
                            v-if="designer"
                            :model-value="String(btn.href ?? '')"
                            :pages="linkPickerPages"
                            :anchors="linkPickerAnchors"
                            :get-anchors-for-page="getAnchorsForPage"
                            :get-page-label="designer?.getPageLabel"
                            placeholder="Link URL"
                            @update:model-value="(v) => (btn.href = v)"
                        />
                        <Input v-else v-model="btn.href" placeholder="Link URL" class="text-sm" />
                        <Input v-model="btn.variant" placeholder="Variant (default, outline)" class="text-sm" />
                    </div>
                </div>
            </div>
        </template>

        <!-- MobileNav -->
        <template v-else-if="entry.type === 'mobileNav'">
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addNavLink">
                        <Plus class="mr-1 h-3 w-3" />
                        Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureLinks(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="flex items-start gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="h-9 min-w-0 flex-1 text-sm" />
                        <div class="min-w-[140px] flex-1">
                            <LinkPicker
                                v-if="designer"
                                :model-value="String(link.href ?? '')"
                                :pages="linkPickerPages"
                                :anchors="linkPickerAnchors"
                                :get-anchors-for-page="getAnchorsForPage"
                                :get-page-label="designer?.getPageLabel"
                                placeholder="URL"
                                @update:model-value="(v) => (link.href = v)"
                            />
                            <Input v-else v-model="link.href" placeholder="URL" class="h-9 w-full text-sm" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" class="h-9 w-9 shrink-0" @click="removeNavLink(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- About -->
        <template v-else-if="entry.type === 'about'">
            <div class="space-y-2">
                <Label>Überschrift</Label>
                <Input v-model="(entry.data as Record<string, unknown>).heading" />
            </div>
            <div class="space-y-2">
                <Label>Text</Label>
                <RichTextEditor
                    :model-value="String((entry.data as Record<string, unknown>).text ?? '')"
                    placeholder="Text eingeben…"
                    min-height="60px"
                    :show-ai-toolbar="!!openMediaLibrary"
                    :page-name="designer ? designer.getPageLabel(designer.currentPageSlug) : null"
                    :block-type="entry.type"
                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).text = v)"
                />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Features</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addAboutFeature">
                        <Plus class="mr-1 h-3 w-3" />
                        Feature
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(feat, i) in ensureFeatures(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="space-y-1 rounded border p-2"
                    >
                        <div class="flex gap-2">
                            <Input v-model="feat.icon" placeholder="Icon (z. B. Stethoscope)" class="min-w-0 flex-1" />
                            <Input v-model="feat.title" placeholder="Titel" class="min-w-0 flex-1" />
                            <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeAboutFeature(i)">
                                <Trash2 class="h-3.5 w-3.5 text-destructive" />
                            </Button>
                        </div>
                        <Input v-model="feat.desc" placeholder="Beschreibung" class="text-sm" />
                    </div>
                </div>
            </div>
        </template>

        <!-- Hours -->
        <template v-else-if="entry.type === 'hours'">
            <div class="space-y-2">
                <Label>Überschrift</Label>
                <Input v-model="(entry.data as Record<string, unknown>).heading" />
            </div>
            <div class="space-y-2">
                <Label>Icon (z. B. Clock)</Label>
                <Input v-model="(entry.data as Record<string, unknown>).icon" />
            </div>
            <div class="space-y-2">
                <Label>Hinweistext</Label>
                <Input v-model="(entry.data as Record<string, unknown>).infoText" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Öffnungszeiten</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addHoursRow">
                        <Plus class="mr-1 h-3 w-3" />
                        Zeile
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(row, i) in ensureHours(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="flex gap-2"
                    >
                        <Input v-model="row.day" placeholder="Tag" class="min-w-0 flex-1" />
                        <Input v-model="row.hours" placeholder="Uhrzeit" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeHoursRow(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- CTA -->
        <template v-else-if="entry.type === 'cta'">
            <div class="space-y-2">
                <Label>Überschrift</Label>
                <Input v-model="(entry.data as Record<string, unknown>).heading" />
            </div>
            <div class="space-y-2">
                <Label>Text</Label>
                <RichTextEditor
                    :model-value="String((entry.data as Record<string, unknown>).text ?? '')"
                    placeholder="Text eingeben…"
                    min-height="60px"
                    :show-ai-toolbar="!!openMediaLibrary"
                    :page-name="designer ? designer.getPageLabel(designer.currentPageSlug) : null"
                    :block-type="entry.type"
                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).text = v)"
                />
            </div>
            <div class="space-y-2">
                <Label>Bild URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input
                        :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.src ?? ''"
                        placeholder="URL oder Bild hochladen"
                        class="min-w-0 flex-1"
                        @update:model-value="
                            (val) => {
                                if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                                ((entry.data as Record<string, unknown>).image as Record<string, string>).src = val;
                            }
                        "
                    />
                    <Button v-if="site" type="button" variant="outline" size="sm" @click="triggerUpload('imageSrc')">
                        <Upload class="h-4 w-4" />
                    </Button>
                    <Button
                        v-if="site && openMediaLibrary"
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Aus Media Library wählen"
                        @click="openMediaLibraryForImageSrc()"
                    >
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>Bild Alt-Text</Label>
                <Input
                    :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.alt ?? ''"
                    @update:model-value="
                        (val) => {
                            if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                            ((entry.data as Record<string, unknown>).image as Record<string, string>).alt = val;
                        }
                    "
                />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addCtaLink">
                        <Plus class="mr-1 h-3 w-3" />
                        Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureCtaLinks(entry.data as Record<string, unknown>)"
                        :key="i"
                        class="flex flex-wrap items-start gap-2 rounded border p-2"
                    >
                        <Input v-model="link.text" placeholder="Text" class="h-9 min-w-[100px] flex-1 text-sm" />
                        <Select
                            :model-value="link.variant ?? 'primary'"
                            class="h-9 w-24 shrink-0 text-sm"
                            @update:model-value="(v) => (link.variant = v)"
                        >
                            <option value="primary">Primär</option>
                            <option value="secondary">Sekundär</option>
                        </Select>
                        <div class="min-w-[140px] flex-1">
                            <LinkPicker
                                v-if="designer"
                                :model-value="String(link.href ?? '')"
                                :pages="linkPickerPages"
                                :anchors="linkPickerAnchors"
                                :get-anchors-for-page="getAnchorsForPage"
                                :get-page-label="designer?.getPageLabel"
                                placeholder="Link"
                                @update:model-value="(v) => (link.href = v)"
                            />
                            <Input v-else v-model="link.href" placeholder="URL" class="h-9 w-full text-sm" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" class="h-9 w-9 shrink-0" @click="removeCtaLink(i)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Grid -->
        <template v-else-if="entry.type === 'grid'">
            <p class="text-muted-foreground text-sm">
                Inhalt über Blöcke hinzufügen: Ziehen Sie Komponenten in dieses Grid.
            </p>
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <input
                            :id="`grid-responsive-${entry.id}`"
                            :checked="hasResponsiveValues(entry.data as Record<string, unknown>)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                const d = entry.data as Record<string, unknown>;
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveForGrid(d);
                                } else {
                                    disableResponsive(d, 'grid');
                                }
                            }"
                        />
                        <Label :for="`grid-responsive-${entry.id}`">Responsive aktivieren</Label>
                    </div>
                    <div v-if="hasResponsiveValues(entry.data as Record<string, unknown>)" class="flex items-center gap-2">
                        <input
                            :id="`grid-breakpoint-tabs-${entry.id}`"
                            :checked="usesNewResponsiveFormat(entry.data as Record<string, unknown>)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                const d = entry.data as Record<string, unknown>;
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveNewFormat(d, 'grid');
                                } else {
                                    disableResponsive(d, 'grid');
                                }
                            }"
                        />
                        <Label :for="`grid-breakpoint-tabs-${entry.id}`">Breakpoint-Tabs</Label>
                    </div>
                </div>
                <Tabs
                    v-if="hasResponsiveValues(entry.data as Record<string, unknown>) && usesNewResponsiveFormat(entry.data as Record<string, unknown>)"
                    default-tab="desktop"
                    class="mt-2"
                >
                    <TabsList class="mb-3 w-full grid grid-cols-3">
                        <TabsTrigger value="desktop" class="text-xs">Desktop</TabsTrigger>
                        <TabsTrigger value="tablet" class="text-xs">Tablet</TabsTrigger>
                        <TabsTrigger value="mobile" class="text-xs">Mobile</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        v-for="bp in (['desktop', 'tablet', 'mobile'] as const)"
                        :key="bp"
                        :value="bp"
                        class="mt-0 space-y-3"
                    >
                        <div class="space-y-2">
                            <Label>Spalten (grid-template-columns)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).columns ?? (bp === 'mobile' ? '1fr' : bp === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)')"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).columns = v)"
                            >
                                <option value="1fr">1 Spalte</option>
                                <option value="repeat(2, 1fr)">2 Spalten</option>
                                <option value="repeat(3, 1fr)">3 Spalten</option>
                                <option value="repeat(4, 1fr)">4 Spalten</option>
                                <option value="1fr 1fr 2fr">2+1 breiter</option>
                                <option value="2fr 1fr 1fr">1 breiter +2</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Abstand (Gap)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).gap = v)"
                            >
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Padding links</Label>
                            <Select
                                :model-value="(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).paddingLeft as string) ?? ''"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).paddingLeft = v || undefined)"
                            >
                                <option value="">Standard</option>
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                                <option value="3rem">3rem</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Padding rechts</Label>
                            <Select
                                :model-value="(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).paddingRight as string) ?? ''"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).paddingRight = v || undefined)"
                            >
                                <option value="">Standard</option>
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                                <option value="3rem">3rem</option>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
                <template v-else>
                <div v-if="!hasResponsiveValues(entry.data as Record<string, unknown>)" class="space-y-2">
                    <Label>Spalten (grid-template-columns)</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).columns ?? 'repeat(2, 1fr)'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).columns = v)"
                    >
                        <option value="1fr">1 Spalte</option>
                        <option value="repeat(2, 1fr)">2 Spalten</option>
                        <option value="repeat(3, 1fr)">3 Spalten</option>
                        <option value="repeat(4, 1fr)">4 Spalten</option>
                        <option value="1fr 1fr 2fr">2+1 breiter</option>
                        <option value="2fr 1fr 1fr">1 breiter +2</option>
                    </Select>
                </div>
                <template v-else>
                    <div class="space-y-3 rounded border border-border p-3">
                        <h4 class="text-sm font-medium">Responsive Einstellungen</h4>
                        <div class="space-y-3">
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Mobile (&lt; 640px)</Label>
                                <Select
                                    :model-value="(entry.data as Record<string, unknown>).columns ?? '1fr'"
                                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).columns = v)"
                                >
                                    <option value="1fr">1 Spalte</option>
                                    <option value="repeat(2, 1fr)">2 Spalten</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Tablet (≥ 640px)</Label>
                                <Select
                                    :model-value="(entry.data as Record<string, unknown>).columnsSm ?? 'repeat(2, 1fr)'"
                                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).columnsSm = v)"
                                >
                                    <option value="1fr">1 Spalte</option>
                                    <option value="repeat(2, 1fr)">2 Spalten</option>
                                    <option value="repeat(3, 1fr)">3 Spalten</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Desktop (≥ 1024px)</Label>
                                <Select
                                    :model-value="(entry.data as Record<string, unknown>).columnsLg ?? 'repeat(3, 1fr)'"
                                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).columnsLg = v)"
                                >
                                    <option value="1fr">1 Spalte</option>
                                    <option value="repeat(2, 1fr)">2 Spalten</option>
                                    <option value="repeat(3, 1fr)">3 Spalten</option>
                                    <option value="repeat(4, 1fr)">4 Spalten</option>
                                    <option value="1fr 1fr 2fr">2+1 breiter</option>
                                    <option value="2fr 1fr 1fr">1 breiter +2</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="space-y-2">
                    <Label>Abstand (Gap)</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).gap ?? '1rem'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).gap = v)"
                    >
                        <option value="0">0</option>
                        <option value="0.5rem">0.5rem</option>
                        <option value="1rem">1rem</option>
                        <option value="1.5rem">1.5rem</option>
                        <option value="2rem">2rem</option>
                    </Select>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        :id="`grid-padding-${entry.id}`"
                        v-model="(entry.data as Record<string, unknown>).padding"
                        type="checkbox"
                        class="h-4 w-4 rounded border-input"
                    />
                    <Label :for="`grid-padding-${entry.id}`">Innenabstand (Padding)</Label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <Label :for="`grid-padding-left-${entry.id}`">Padding links</Label>
                        <Select
                            :id="`grid-padding-left-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, (entry.data as Record<string, unknown>).paddingLeft as string | undefined, 'left')"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                if (v === '__custom__') {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = true;
                                    // Set a placeholder value that triggers custom input display
                                    if (!d.paddingLeft || STANDARD_PADDING_VALUES.includes(d.paddingLeft as string)) {
                                        d.paddingLeft = '__custom__';
                                    }
                                } else {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = false;
                                    d.paddingLeft = v || undefined;
                                }
                            }"
                        >
                            <option value="">Standard</option>
                            <option value="0">0</option>
                            <option value="0.5rem">0.5rem</option>
                            <option value="1rem">1rem</option>
                            <option value="1.5rem">1.5rem</option>
                            <option value="2rem">2rem</option>
                            <option value="3rem">3rem</option>
                            <option value="__custom__">Benutzerdefiniert</option>
                        </Select>
                        <Input
                            v-if="(customPaddingLeft.value?.[entry.id] ?? false) || ((entry.data as Record<string, unknown>).paddingLeft as string | undefined) === '__custom__' || (!STANDARD_PADDING_VALUES.includes((entry.data as Record<string, unknown>).paddingLeft as string) && (entry.data as Record<string, unknown>).paddingLeft)"
                            :model-value="getPaddingCustomValue((entry.data as Record<string, unknown>).paddingLeft as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                d.paddingLeft = v || undefined;
                                if (v) {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = true;
                                }
                            }"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label :for="`grid-padding-right-${entry.id}`">Padding rechts</Label>
                        <Select
                            :id="`grid-padding-right-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, (entry.data as Record<string, unknown>).paddingRight as string | undefined, 'right')"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                if (v === '__custom__') {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = true;
                                    // Set a placeholder value that triggers custom input display
                                    if (!d.paddingRight || STANDARD_PADDING_VALUES.includes(d.paddingRight as string)) {
                                        d.paddingRight = '__custom__';
                                    }
                                } else {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = false;
                                    d.paddingRight = v || undefined;
                                }
                            }"
                        >
                            <option value="">Standard</option>
                            <option value="0">0</option>
                            <option value="0.5rem">0.5rem</option>
                            <option value="1rem">1rem</option>
                            <option value="1.5rem">1.5rem</option>
                            <option value="2rem">2rem</option>
                            <option value="3rem">3rem</option>
                            <option value="__custom__">Benutzerdefiniert</option>
                        </Select>
                        <Input
                            v-if="(customPaddingRight.value?.[entry.id] ?? false) || ((entry.data as Record<string, unknown>).paddingRight as string | undefined) === '__custom__' || (!STANDARD_PADDING_VALUES.includes((entry.data as Record<string, unknown>).paddingRight as string) && (entry.data as Record<string, unknown>).paddingRight)"
                            :model-value="getPaddingCustomValue((entry.data as Record<string, unknown>).paddingRight as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                d.paddingRight = v || undefined;
                                if (v) {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = true;
                                }
                            }"
                        />
                    </div>
                </div>
                </template>
            </div>
        </template>

        <!-- Flex-Container -->
        <template v-else-if="entry.type === 'flex'">
            <p class="text-muted-foreground text-sm">
                Inhalt über Blöcke hinzufügen: Ziehen Sie Komponenten in diesen Flex-Container.
            </p>
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <input
                            :id="`flex-responsive-${entry.id}`"
                            :checked="hasResponsiveValues(entry.data as Record<string, unknown>)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                const d = entry.data as Record<string, unknown>;
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveForFlex(d);
                                } else {
                                    disableResponsive(d, 'flex');
                                }
                            }"
                        />
                        <Label :for="`flex-responsive-${entry.id}`">Responsive aktivieren</Label>
                    </div>
                    <div v-if="hasResponsiveValues(entry.data as Record<string, unknown>)" class="flex items-center gap-2">
                        <input
                            :id="`flex-breakpoint-tabs-${entry.id}`"
                            :checked="usesNewResponsiveFormat(entry.data as Record<string, unknown>)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                const d = entry.data as Record<string, unknown>;
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveNewFormat(d, 'flex');
                                } else {
                                    disableResponsive(d, 'flex');
                                }
                            }"
                        />
                        <Label :for="`flex-breakpoint-tabs-${entry.id}`">Breakpoint-Tabs</Label>
                    </div>
                </div>
                <Tabs
                    v-if="hasResponsiveValues(entry.data as Record<string, unknown>) && usesNewResponsiveFormat(entry.data as Record<string, unknown>)"
                    default-tab="desktop"
                    class="mt-2"
                >
                    <TabsList class="mb-3 w-full grid grid-cols-3">
                        <TabsTrigger value="desktop" class="text-xs">Desktop</TabsTrigger>
                        <TabsTrigger value="tablet" class="text-xs">Tablet</TabsTrigger>
                        <TabsTrigger value="mobile" class="text-xs">Mobile</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        v-for="bp in (['desktop', 'tablet', 'mobile'] as const)"
                        :key="bp"
                        :value="bp"
                        class="mt-0 space-y-3"
                    >
                        <div class="space-y-2">
                            <Label>Richtung</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).direction ?? (bp === 'mobile' ? 'column' : 'row')"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).direction = v)"
                            >
                                <option value="column">Spalte (untereinander)</option>
                                <option value="row">Zeile (nebeneinander)</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Abstand (Gap)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).gap = v)"
                            >
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Justify</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).justify ?? 'start'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).justify = v)"
                            >
                                <option value="start">Start</option>
                                <option value="center">Mitte</option>
                                <option value="end">Ende</option>
                                <option value="space-between">Space-Between</option>
                                <option value="space-around">Space-Around</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Align</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).align ?? 'stretch'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).align = v)"
                            >
                                <option value="start">Start</option>
                                <option value="center">Mitte</option>
                                <option value="end">Ende</option>
                                <option value="stretch">Stretch</option>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
                <template v-else>
                <div v-if="!hasResponsiveValues(entry.data as Record<string, unknown>)" class="space-y-2">
                    <Label>Richtung</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).direction ?? 'row'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).direction = v)"
                    >
                        <option value="column">Spalte (untereinander)</option>
                        <option value="row">Zeile (nebeneinander)</option>
                    </Select>
                </div>
                <template v-else>
                    <div class="space-y-3 rounded border border-border p-3">
                        <h4 class="text-sm font-medium">Responsive Einstellungen</h4>
                        <div class="space-y-3">
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Mobile (&lt; 640px)</Label>
                                <Select
                                    :model-value="(entry.data as Record<string, unknown>).direction ?? 'column'"
                                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).direction = v)"
                                >
                                    <option value="column">Spalte (untereinander)</option>
                                    <option value="row">Zeile (nebeneinander)</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Desktop (≥ 1024px)</Label>
                                <Select
                                    :model-value="(entry.data as Record<string, unknown>).directionLg ?? 'row'"
                                    @update:model-value="(v) => ((entry.data as Record<string, unknown>).directionLg = v)"
                                >
                                    <option value="column">Spalte (untereinander)</option>
                                    <option value="row">Zeile (nebeneinander)</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="space-y-2">
                    <Label>Abstand (Gap)</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).gap ?? '1rem'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).gap = v)"
                    >
                        <option value="0">0</option>
                        <option value="0.5rem">0.5rem</option>
                        <option value="1rem">1rem</option>
                        <option value="1.5rem">1.5rem</option>
                        <option value="2rem">2rem</option>
                    </Select>
                </div>
                <div class="space-y-2">
                    <Label>Justify</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).justify ?? 'start'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).justify = v)"
                    >
                        <option value="start">Start</option>
                        <option value="center">Mitte</option>
                        <option value="end">Ende</option>
                        <option value="space-between">Space-Between</option>
                        <option value="space-around">Space-Around</option>
                    </Select>
                </div>
                <div class="space-y-2">
                    <Label>Align</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).align ?? 'stretch'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).align = v)"
                    >
                        <option value="start">Start</option>
                        <option value="center">Mitte</option>
                        <option value="end">Ende</option>
                        <option value="stretch">Stretch</option>
                    </Select>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        :id="`flex-wrap-${entry.id}`"
                        v-model="(entry.data as Record<string, unknown>).wrap"
                        type="checkbox"
                        class="h-4 w-4 rounded border-input"
                    />
                    <Label :for="`flex-wrap-${entry.id}`">Umbrechen (Wrap)</Label>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        :id="`flex-padding-${entry.id}`"
                        v-model="(entry.data as Record<string, unknown>).padding"
                        type="checkbox"
                        class="h-4 w-4 rounded border-input"
                    />
                    <Label :for="`flex-padding-${entry.id}`">Innenabstand (Padding)</Label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <Label :for="`flex-padding-left-${entry.id}`">Padding links</Label>
                        <Select
                            :id="`flex-padding-left-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, (entry.data as Record<string, unknown>).paddingLeft as string | undefined, 'left')"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                if (v === '__custom__') {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = true;
                                    // Set a placeholder value that triggers custom input display
                                    if (!d.paddingLeft || STANDARD_PADDING_VALUES.includes(d.paddingLeft as string)) {
                                        d.paddingLeft = '__custom__';
                                    }
                                } else {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = false;
                                    d.paddingLeft = v || undefined;
                                }
                            }"
                        >
                            <option value="">Standard</option>
                            <option value="0">0</option>
                            <option value="0.5rem">0.5rem</option>
                            <option value="1rem">1rem</option>
                            <option value="1.5rem">1.5rem</option>
                            <option value="2rem">2rem</option>
                            <option value="3rem">3rem</option>
                            <option value="__custom__">Benutzerdefiniert</option>
                        </Select>
                        <Input
                            v-if="(customPaddingLeft.value?.[entry.id] ?? false) || ((entry.data as Record<string, unknown>).paddingLeft as string | undefined) === '__custom__' || (!STANDARD_PADDING_VALUES.includes((entry.data as Record<string, unknown>).paddingLeft as string) && (entry.data as Record<string, unknown>).paddingLeft)"
                            :model-value="getPaddingCustomValue((entry.data as Record<string, unknown>).paddingLeft as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                d.paddingLeft = v || undefined;
                                if (v) {
                                    if (!customPaddingLeft.value) customPaddingLeft.value = {};
                                    customPaddingLeft.value[entry.id] = true;
                                }
                            }"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label :for="`flex-padding-right-${entry.id}`">Padding rechts</Label>
                        <Select
                            :id="`flex-padding-right-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, (entry.data as Record<string, unknown>).paddingRight as string | undefined, 'right')"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                if (v === '__custom__') {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = true;
                                    // Set a placeholder value that triggers custom input display
                                    if (!d.paddingRight || STANDARD_PADDING_VALUES.includes(d.paddingRight as string)) {
                                        d.paddingRight = '__custom__';
                                    }
                                } else {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = false;
                                    d.paddingRight = v || undefined;
                                }
                            }"
                        >
                            <option value="">Standard</option>
                            <option value="0">0</option>
                            <option value="0.5rem">0.5rem</option>
                            <option value="1rem">1rem</option>
                            <option value="1.5rem">1.5rem</option>
                            <option value="2rem">2rem</option>
                            <option value="3rem">3rem</option>
                            <option value="__custom__">Benutzerdefiniert</option>
                        </Select>
                        <Input
                            v-if="(customPaddingRight.value?.[entry.id] ?? false) || ((entry.data as Record<string, unknown>).paddingRight as string | undefined) === '__custom__' || (!STANDARD_PADDING_VALUES.includes((entry.data as Record<string, unknown>).paddingRight as string) && (entry.data as Record<string, unknown>).paddingRight)"
                            :model-value="getPaddingCustomValue((entry.data as Record<string, unknown>).paddingRight as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
                                const d = entry.data as Record<string, unknown>;
                                d.paddingRight = v || undefined;
                                if (v) {
                                    if (!customPaddingRight.value) customPaddingRight.value = {};
                                    customPaddingRight.value[entry.id] = true;
                                }
                            }"
                        />
                    </div>
                </div>
                </template>
            </div>
        </template>

        <!-- Section (Bereich / Container) -->
        <template v-else-if="entry.type === 'section'">
            <div class="space-y-2">
                <Label>Anker (für Sprunglinks)</Label>
                <Input
                    :model-value="String((entry.data as Record<string, unknown>).anchor ?? '')"
                    placeholder="z. B. meine-section"
                    class="font-mono text-sm"
                    @update:model-value="
                        (v) => {
                            const val = (v as string).trim();
                            (entry.data as Record<string, unknown>).anchor = val || undefined;
                        }
                    "
                />
                <p class="text-muted-foreground text-xs">
                    Optional. Erlaubt Links wie #meine-section zu diesem Bereich.
                </p>
            </div>
            <p class="text-muted-foreground mt-4 text-sm">
                Inhalt über Blöcke hinzufügen: Ziehen Sie Komponenten aus der Seitenstruktur oder aus der Vorschau in diesen Bereich.
            </p>
            <Tabs default-tab="desktop" class="mt-2">
                <TabsList class="mb-3 w-full grid grid-cols-3">
                    <TabsTrigger value="desktop" class="text-xs">Desktop</TabsTrigger>
                    <TabsTrigger value="tablet" class="text-xs">Tablet</TabsTrigger>
                    <TabsTrigger value="mobile" class="text-xs">Mobile</TabsTrigger>
                </TabsList>
                <TabsContent
                    v-for="bp in (['desktop', 'tablet', 'mobile'] as const)"
                    :key="bp"
                    :value="bp"
                    class="mt-0 space-y-3"
                >
                    <div class="space-y-3">
                        <div class="space-y-2">
                            <Label>Richtung</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).direction ?? 'column'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).direction = v)"
                            >
                                <option value="column">Spalte (untereinander)</option>
                                <option value="row">Zeile (nebeneinander)</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Abstand (Gap)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).gap = v)"
                            >
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Horizontale Ausrichtung (Justify)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).justify ?? 'start'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).justify = v)"
                            >
                                <option value="start">Start</option>
                                <option value="center">Mitte</option>
                                <option value="end">Ende</option>
                                <option value="space-between">Space-Between</option>
                                <option value="space-around">Space-Around</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Vertikale Ausrichtung (Align)</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).align ?? 'stretch'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).align = v)"
                            >
                                <option value="start">Start</option>
                                <option value="center">Mitte</option>
                                <option value="end">Ende</option>
                                <option value="stretch">Stretch</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Breite</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).contentWidth ?? 'full'"
                                @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).contentWidth = v)"
                            >
                                <option value="full">Volle Breite</option>
                                <option value="boxed">Boxed (max-width zentriert)</option>
                            </Select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                :id="`section-wrap-${entry.id}-${bp}`"
                                :checked="!!(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).wrap ?? true)"
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                @change="(e) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).wrap = (e.target as HTMLInputElement).checked)"
                            />
                            <Label :for="`section-wrap-${entry.id}-${bp}`">Umbrechen (Wrap)</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                :id="`section-padding-${entry.id}-${bp}`"
                                :checked="!!(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).padding ?? true)"
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                @change="(e) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).padding = (e.target as HTMLInputElement).checked)"
                            />
                            <Label :for="`section-padding-${entry.id}-${bp}`">Innenabstand (Padding)</Label>
                        </div>
                        <div class="space-y-2">
                            <Label>Hintergrundfarbe</Label>
                            <Select
                                :model-value="getSectionBackgroundSelectValue(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp) as Record<string, unknown>)"
                                @update:model-value="(v) => setSectionBackground(ensureResponsiveTarget(entry.data as Record<string, unknown>, bp) as Record<string, unknown>, v)"
                            >
                                <option
                                    v-for="opt in sectionBgOptions"
                                    :key="opt.value || 'none'"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </Select>
                            <div
                                v-if="showSectionCustomColor(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp) as Record<string, unknown>)"
                                class="flex items-center gap-2"
                            >
                                <input
                                    type="color"
                                    :value="getSectionCustomColorValue(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp) as Record<string, unknown>)"
                                    class="h-9 w-14 cursor-pointer rounded border border-input"
                                    @input="
                                        (e) =>
                                            (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).backgroundColor = (
                                                e.target as HTMLInputElement
                                            ).value)
                                    "
                                />
                                <Input
                                    :model-value="getSectionCustomColorValue(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp) as Record<string, unknown>)"
                                    placeholder="#ffffff"
                                    class="min-w-0 flex-1 font-mono text-sm"
                                    @update:model-value="(v) => setSectionCustomColor(ensureResponsiveTarget(entry.data as Record<string, unknown>, bp) as Record<string, unknown>, v)"
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="space-y-2">
                                <Label :for="`section-padding-left-${entry.id}-${bp}`">Padding links</Label>
                                <Select
                                    :id="`section-padding-left-${entry.id}-${bp}`"
                                    :model-value="(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).paddingLeft as string) ?? ''"
                                    @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).paddingLeft = v || undefined)"
                                >
                                    <option value="">Standard</option>
                                    <option value="0">0</option>
                                    <option value="0.5rem">0.5rem</option>
                                    <option value="1rem">1rem</option>
                                    <option value="1.5rem">1.5rem</option>
                                    <option value="2rem">2rem</option>
                                    <option value="3rem">3rem</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label :for="`section-padding-right-${entry.id}-${bp}`">Padding rechts</Label>
                                <Select
                                    :id="`section-padding-right-${entry.id}-${bp}`"
                                    :model-value="(getEffectiveDataAtBreakpoint(entry.data as Record<string, unknown>, bp).paddingRight as string) ?? ''"
                                    @update:model-value="(v) => (ensureResponsiveTarget(entry.data as Record<string, unknown>, bp).paddingRight = v || undefined)"
                                >
                                    <option value="">Standard</option>
                                    <option value="0">0</option>
                                    <option value="0.5rem">0.5rem</option>
                                    <option value="1rem">1rem</option>
                                    <option value="1.5rem">1.5rem</option>
                                    <option value="2rem">2rem</option>
                                    <option value="3rem">3rem</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </template>

        <!-- JSON (benutzerdefiniert) -->
        <template v-else-if="entry.type === 'json'">
            <div class="space-y-2">
                <Label>JSON (benutzerdefiniert)</Label>
                <textarea
                    :value="JSON.stringify(entry.data ?? {}, null, 2)"
                    class="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                    rows="10"
                    @input="updateJson(($event.target as HTMLTextAreaElement).value)"
                />
            </div>
        </template>

        <template v-else>
            <p class="text-muted-foreground text-sm">Keine Bearbeitungsfelder für diesen Typ.</p>
        </template>
    </div>
</template>
