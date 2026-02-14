<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { getEditorForType, getMetaForType } from '@/templates/shared/page_components/loader';
import { inject, ref, computed } from 'vue';
import { ImagePlus, Plus, Trash2, Upload } from 'lucide-vue-next';
import AnimationPicker from '@/templates/shared/components/AnimationPicker.vue';
import IconPicker from '@/templates/shared/components/IconPicker.vue';
import { isSlotContainer } from '@/templates/handyso/component-registry';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    hasResponsiveValues as hasResponsiveValuesFromLib,
    getEffectiveDataAtBreakpoint,
    type ResponsiveBreakpoint,
} from '@/lib/responsive-styles';

const openMediaLibrary = inject<((callback: (url: string) => void) => void) | null>('openMediaLibrary', null);

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
    if (breakpoint === 'desktop') return data;
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

const props = defineProps<{
    entry: LayoutComponentEntry;
    site?: { id: number; name: string; slug: string; uuid: string };
    /** Seitenthema-Farben für Bereich-Hintergrund. */
    colors?: Record<string, string>;
}>();

const sectionBgOptions = computed(() => {
    const c = props.colors ?? {};
    const opts: { value: string; label: string }[] = [{ value: '', label: 'Keine' }];
    for (const { key, var: v, label } of SECTION_BG_COLOR_KEYS) {
        if (c[key]) opts.push({ value: `var(${v})`, label: `${label} (Seite)` });
    }
    opts.push({ value: '__custom__', label: 'Benutzerdefiniert' });
    return opts;
});

function getSectionBackgroundSelectValue(d: Record<string, unknown>): string {
    const bg = d.backgroundColor as string | undefined;
    if (!bg) return '';
    const found = sectionBgOptions.value.find((o) => o.value && o.value !== '__custom__' && o.value === bg);
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

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const imageInputRef = ref<HTMLInputElement | null>(null);
const pendingUpload = ref<string | null>(null);

function triggerUpload(field: string) {
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
    } else if (field === 'src' || field.startsWith('image')) {
        if (typeof d[field] !== 'string') d[field] = '';
        (d as Record<string, string>)[field] = data.url;
    }
    if (imageInputRef.value) imageInputRef.value.value = '';
}

function ensureLinks(d: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(d.links)) d.links = [];
    return d.links as { href: string; label: string }[];
}

function ensureLinksSeiten(d: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(d.linksSeiten)) d.linksSeiten = [];
    return d.linksSeiten as { href: string; label: string }[];
}

function ensureLinksRechtliches(d: Record<string, unknown>): { href: string; label: string }[] {
    if (!Array.isArray(d.linksRechtliches)) d.linksRechtliches = [];
    return d.linksRechtliches as { href: string; label: string }[];
}

function ensureSocialLinks(d: Record<string, unknown>): { name: string; href: string; icon: string }[] {
    if (!Array.isArray(d.socialLinks)) d.socialLinks = [];
    return d.socialLinks as { name: string; href: string; icon: string }[];
}

function updateJson(value: string) {
    try {
        Object.assign(props.entry.data, JSON.parse(value) as Record<string, unknown>);
    } catch {
        // ignore
    }
}

const d = computed(() => (props.entry.data ?? {}) as Record<string, unknown>);

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
        <!-- Breite in Zeile (for non-section) -->
        <template v-if="entry.type !== 'section'">
            <div class="space-y-2">
                <Label>Breite in Zeile</Label>
                <Select
                    :model-value="d.flexBasis ?? ''"
                    @update:model-value="(v) => (d.flexBasis = v)"
                >
                    <option value="">Auto (gleichmäßig)</option>
                    <option value="25%">25 %</option>
                    <option value="33.33%">⅓ (33 %)</option>
                    <option value="50%">50 %</option>
                    <option value="66.67%">⅔ (67 %)</option>
                    <option value="75%">75 %</option>
                    <option value="100%">100 %</option>
                </Select>
            </div>
        </template>

        <!-- Animation -->
        <div class="space-y-2">
            <Label>Animation beim Einblenden</Label>
            <AnimationPicker
                :model-value="String(d.motion ?? '')"
                @update:model-value="(v) => (d.motion = v || undefined)"
            />
        </div>

        <!-- Slot containers: hint only -->
        <template v-if="isSlotContainer(entry.type)">
            <p class="text-muted-foreground text-sm">
                Inhalt über die Kinder in der Seitenstruktur anpassen (Baumansicht links).
            </p>
        </template>

        <!-- Page components (from praxisemerald loader) -->
        <template v-else-if="pageComponentEditor">
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
                        v-model="(d as Record<string, unknown>)[field.key]"
                        :type="field.type"
                        class="w-full"
                    />
                    <textarea
                        v-else-if="field.type === 'textarea'"
                        :id="`field-${entry.id}-${field.key}`"
                        :value="(d as Record<string, unknown>)[field.key]"
                        class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        @input="(e) => ((d as Record<string, unknown>)[field.key] = (e.target as HTMLTextAreaElement).value)"
                    />
                    <Select
                        v-else-if="field.type === 'select' && field.options?.length"
                        :id="`field-${entry.id}-${field.key}`"
                        :model-value="String((d as Record<string, unknown>)[field.key] ?? '')"
                        @update:model-value="(v) => ((d as Record<string, unknown>)[field.key] = v)"
                    >
                        <option
                            v-for="opt in field.options"
                            :key="typeof opt === 'string' ? opt : (opt as { value: string }).value"
                            :value="typeof opt === 'string' ? opt : (opt as { value: string }).value"
                        >
                            {{ typeof opt === 'string' ? opt : (opt as { label: string }).label }}
                        </option>
                    </Select>
                    <div v-else-if="field.type === 'image'" class="flex flex-wrap gap-2">
                        <Input
                            :id="`field-${entry.id}-${field.key}`"
                            :model-value="String((d as Record<string, unknown>)[field.key] ?? '')"
                            placeholder="URL"
                            class="min-w-0 flex-1"
                            @update:model-value="(v) => ((d as Record<string, unknown>)[field.key] = v)"
                        />
                        <Button
                            v-if="openMediaLibrary"
                            type="button"
                            variant="outline"
                            size="sm"
                            @click="openMediaLibrary((url) => ((d as Record<string, unknown>)[field.key] = url))"
                        >
                            <ImagePlus class="h-4 w-4" />
                        </Button>
                    </div>
                    <IconPicker
                        v-else-if="field.type === 'icon'"
                        :id="`field-${entry.id}-${field.key}`"
                        :model-value="String((d as Record<string, unknown>)[field.key] ?? '')"
                        @update:model-value="(v) => ((d as Record<string, unknown>)[field.key] = v)"
                    />
                </div>
            </div>
        </template>

        <!-- utilityHeader -->
        <template v-else-if="entry.type === 'utilityHeader'">
            <div class="space-y-2">
                <Label>E-Mail</Label>
                <Input v-model="d.email" />
            </div>
            <div class="space-y-2">
                <Label>Telefon</Label>
                <Input v-model="d.phone" />
            </div>
            <div class="space-y-2">
                <Label>See All Service Text</Label>
                <Input v-model="d.seeAllServiceText" />
            </div>
            <div class="space-y-2">
                <Label>See All Service Link</Label>
                <Input v-model="d.seeAllServiceHref" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Social Links</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="ensureSocialLinks(d).push({ name: '', href: '#', icon: 'Facebook' })">
                        <Plus class="mr-1 h-3 w-3" /> Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(link, i) in ensureSocialLinks(d)"
                        :key="i"
                        class="flex gap-2"
                    >
                        <Input v-model="link.name" placeholder="Name" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="ensureSocialLinks(d).splice(i, 1)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- header -->
        <template v-else-if="entry.type === 'header'">
            <div class="space-y-2">
                <Label>Site Name</Label>
                <Input v-model="d.siteName" />
            </div>
            <div class="space-y-2">
                <Label>Logo URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input v-model="d.logoUrl" placeholder="URL" class="min-w-0 flex-1" />
                    <Button type="button" variant="outline" size="sm" @click="triggerUpload('logoUrl')">
                        <Upload class="h-4 w-4" />
                    </Button>
                    <Button v-if="openMediaLibrary" type="button" variant="outline" size="sm" @click="openMediaLibrary((url) => (d.logoUrl = url))">
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>CTA Button Text</Label>
                <Input v-model="d.ctaButtonText" />
            </div>
            <div class="space-y-2">
                <Label>CTA Button Link</Label>
                <Input v-model="d.ctaButtonHref" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Navigation</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="ensureLinks(d).push({ href: '', label: '' })">
                        <Plus class="mr-1 h-3 w-3" /> Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div v-for="(link, i) in ensureLinks(d)" :key="i" class="flex gap-2">
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="ensureLinks(d).splice(i, 1)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- mobileNav -->
        <template v-else-if="entry.type === 'mobileNav'">
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="ensureLinks(d).push({ href: '', label: '' })">
                        <Plus class="mr-1 h-3 w-3" /> Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div v-for="(link, i) in ensureLinks(d)" :key="i" class="flex gap-2">
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="ensureLinks(d).splice(i, 1)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- footer -->
        <template v-else-if="entry.type === 'footer'">
            <div class="space-y-2">
                <Label>Site Name</Label>
                <Input v-model="d.siteName" />
            </div>
            <div class="space-y-2">
                <Label>Description</Label>
                <Input v-model="d.description" />
            </div>
            <div class="space-y-2">
                <Label>Address</Label>
                <Input v-model="d.address" />
            </div>
            <div class="space-y-2">
                <Label>Phone</Label>
                <Input v-model="d.phone" />
            </div>
            <div class="space-y-2">
                <Label>Email</Label>
                <Input v-model="d.email" />
            </div>
            <div class="space-y-2">
                <Label>Copyright</Label>
                <Input v-model="d.copyrightText" />
            </div>
            <div class="space-y-2">
                <Label>Credit Line</Label>
                <Input v-model="d.creditLine" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links Seiten</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="ensureLinksSeiten(d).push({ href: '', label: '' })">
                        <Plus class="mr-1 h-3 w-3" /> Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div v-for="(link, i) in ensureLinksSeiten(d)" :key="'s-' + i" class="flex gap-2">
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="ensureLinksSeiten(d).splice(i, 1)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <Label>Links Rechtliches</Label>
                    <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="ensureLinksRechtliches(d).push({ href: '#', label: '' })">
                        <Plus class="mr-1 h-3 w-3" /> Link
                    </Button>
                </div>
                <div class="space-y-2">
                    <div v-for="(link, i) in ensureLinksRechtliches(d)" :key="'r-' + i" class="flex gap-2">
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="ensureLinksRechtliches(d).splice(i, 1)">
                            <Trash2 class="h-3.5 w-3.5 text-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Leaf: text-only types -->
        <template v-else-if="['heroSubheading','heroHeadline','heroText','heroReviews','featureBannerText','whyChooseUsSubheading','whyChooseUsHeadline','aboutSubheading','aboutHeadline','aboutText','aboutBullet','howWeWorkSubheading','howWeWorkHeadline','howWeWorkText'].includes(entry.type)">
            <div class="space-y-2">
                <Label>Text</Label>
                <textarea
                    v-if="['heroText','aboutText','howWeWorkText'].includes(entry.type)"
                    :value="d.text"
                    class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    @input="d.text = ($event.target as HTMLTextAreaElement).value"
                />
                <Input v-else v-model="d.text" />
            </div>
        </template>

        <!-- heroButton, aboutButton -->
        <template v-else-if="['heroButton','aboutButton'].includes(entry.type)">
            <div class="space-y-2">
                <Label>Text</Label>
                <Input v-model="d.text" />
            </div>
            <div class="space-y-2">
                <Label>Link (href)</Label>
                <Input v-model="d.href" />
            </div>
        </template>

        <!-- heroImage, aboutImage1, aboutImage2 -->
        <template v-else-if="['heroImage','aboutImage1','aboutImage2'].includes(entry.type)">
            <div class="space-y-2">
                <Label>Bild-URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input v-model="d.src" placeholder="URL" class="min-w-0 flex-1" />
                    <Button v-if="site" type="button" variant="outline" size="sm" @click="triggerUpload('src')">
                        <Upload class="h-4 w-4" />
                    </Button>
                    <Button v-if="openMediaLibrary" type="button" variant="outline" size="sm" @click="openMediaLibrary((url) => (d.src = url))">
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>Alt-Text</Label>
                <Input v-model="d.alt" />
            </div>
        </template>

        <!-- heroServiceCard -->
        <template v-else-if="entry.type === 'heroServiceCard'">
            <div class="space-y-2">
                <Label>Icon</Label>
                <IconPicker :model-value="String(d.icon ?? 'Hammer')" @update:model-value="(v) => (d.icon = v)" />
            </div>
            <div class="space-y-2">
                <Label>Title</Label>
                <Input v-model="d.title" />
            </div>
            <div class="space-y-2">
                <Label>Description</Label>
                <Input v-model="d.desc" />
            </div>
            <div class="space-y-2">
                <Label>Read More Link</Label>
                <Input v-model="d.readMoreHref" />
            </div>
        </template>

        <!-- featureCard -->
        <template v-else-if="entry.type === 'featureCard'">
            <div class="space-y-2">
                <Label>Icon</Label>
                <IconPicker :model-value="String(d.icon ?? 'Wrench')" @update:model-value="(v) => (d.icon = v)" />
            </div>
            <div class="space-y-2">
                <Label>Title</Label>
                <Input v-model="d.title" />
            </div>
            <div class="space-y-2">
                <Label>Description</Label>
                <Input v-model="d.desc" />
            </div>
        </template>

        <!-- whyChooseUsBenefit -->
        <template v-else-if="entry.type === 'whyChooseUsBenefit'">
            <div class="space-y-2">
                <Label>Icon</Label>
                <IconPicker :model-value="String(d.icon ?? 'CheckCircle')" @update:model-value="(v) => (d.icon = v)" />
            </div>
            <div class="space-y-2">
                <Label>Title</Label>
                <Input v-model="d.title" />
            </div>
        </template>

        <!-- aboutBadge -->
        <template v-else-if="entry.type === 'aboutBadge'">
            <div class="space-y-2">
                <Label>Number</Label>
                <Input v-model="d.number" />
            </div>
            <div class="space-y-2">
                <Label>Label</Label>
                <Input v-model="d.label" />
            </div>
        </template>

        <!-- aboutImage1, aboutImage2 already above - aboutImage1/2 use src/alt -->

        <!-- howWeWorkStep -->
        <template v-else-if="entry.type === 'howWeWorkStep'">
            <div class="space-y-2">
                <Label>Number</Label>
                <Input v-model="d.number" />
            </div>
            <div class="space-y-2">
                <Label>Image URL</Label>
                <div class="flex flex-wrap gap-2">
                    <Input v-model="d.imageSrc" placeholder="URL" class="min-w-0 flex-1" />
                    <Button v-if="openMediaLibrary" type="button" variant="outline" size="sm" @click="openMediaLibrary((url) => (d.imageSrc = url))">
                        <ImagePlus class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="space-y-2">
                <Label>Image Alt</Label>
                <Input v-model="d.imageAlt" />
            </div>
            <div class="space-y-2">
                <Label>Title</Label>
                <Input v-model="d.title" />
            </div>
            <div class="space-y-2">
                <Label>Description</Label>
                <Input v-model="d.desc" />
            </div>
        </template>

        <!-- section -->
        <template v-else-if="entry.type === 'section'">
            <p class="text-muted-foreground text-sm">Inhalt über Blöcke hinzufügen.</p>
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).direction ?? 'column'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).direction = v)"
                            >
                                <option value="column">Spalte</option>
                                <option value="row">Zeile</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Gap</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).gap = v)"
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).justify ?? 'start'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).justify = v)"
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).align ?? 'stretch'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).align = v)"
                            >
                                <option value="start">Start</option>
                                <option value="center">Mitte</option>
                                <option value="end">Ende</option>
                                <option value="stretch">Stretch</option>
                            </Select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                :id="`section-wrap-${entry.id}-${bp}`"
                                :checked="!!(getEffectiveDataAtBreakpoint(d, bp).wrap ?? true)"
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                @change="(e) => (ensureResponsiveTarget(d, bp).wrap = (e.target as HTMLInputElement).checked)"
                            />
                            <Label :for="`section-wrap-${entry.id}-${bp}`">Wrap</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                :id="`section-padding-${entry.id}-${bp}`"
                                :checked="!!(getEffectiveDataAtBreakpoint(d, bp).padding ?? true)"
                                type="checkbox"
                                class="h-4 w-4 rounded border-input"
                                @change="(e) => (ensureResponsiveTarget(d, bp).padding = (e.target as HTMLInputElement).checked)"
                            />
                            <Label :for="`section-padding-${entry.id}-${bp}`">Padding</Label>
                        </div>
                        <div class="space-y-2">
                            <Label>Content Width</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).contentWidth ?? 'full'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).contentWidth = v)"
                            >
                                <option value="full">Full</option>
                                <option value="boxed">Boxed</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Hintergrundfarbe</Label>
                            <Select
                                :model-value="getSectionBackgroundSelectValue(getEffectiveDataAtBreakpoint(d, bp) as Record<string, unknown>)"
                                @update:model-value="(v) => setSectionBackground(ensureResponsiveTarget(d, bp) as Record<string, unknown>, v)"
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
                                v-if="showSectionCustomColor(getEffectiveDataAtBreakpoint(d, bp) as Record<string, unknown>)"
                                class="flex items-center gap-2"
                            >
                                <input
                                    type="color"
                                    :value="getSectionCustomColorValue(getEffectiveDataAtBreakpoint(d, bp) as Record<string, unknown>)"
                                    class="h-9 w-14 cursor-pointer rounded border border-input"
                                    @input="(e) => (ensureResponsiveTarget(d, bp).backgroundColor = (e.target as HTMLInputElement).value)"
                                />
                                <Input
                                    :model-value="getSectionCustomColorValue(getEffectiveDataAtBreakpoint(d, bp) as Record<string, unknown>)"
                                    placeholder="#ffffff"
                                    class="min-w-0 flex-1 font-mono text-sm"
                                    @update:model-value="(v) => setSectionCustomColor(ensureResponsiveTarget(d, bp) as Record<string, unknown>, v)"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </template>

        <!-- grid -->
        <template v-else-if="entry.type === 'grid'">
            <p class="text-muted-foreground text-sm">Inhalt über Blöcke hinzufügen.</p>
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <input
                            :id="`grid-responsive-${entry.id}`"
                            :checked="hasResponsiveValues(d)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveForGrid(d);
                                } else {
                                    disableResponsive(d, 'grid');
                                }
                            }"
                        />
                        <Label :for="`grid-responsive-${entry.id}`">Responsive aktivieren</Label>
                    </div>
                    <div v-if="hasResponsiveValues(d)" class="flex items-center gap-2">
                        <input
                            :id="`grid-breakpoint-tabs-${entry.id}`"
                            :checked="usesNewResponsiveFormat(d)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
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
                    v-if="hasResponsiveValues(d) && usesNewResponsiveFormat(d)"
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
                            <Label>Spalten</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).columns ?? (bp === 'mobile' ? '1fr' : 'repeat(2, 1fr)')"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).columns = v)"
                            >
                                <option value="1fr">1</option>
                                <option value="repeat(2, 1fr)">2</option>
                                <option value="repeat(3, 1fr)">3</option>
                                <option value="repeat(4, 1fr)">4</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Gap</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).gap = v)"
                            >
                                <option value="0">0</option>
                                <option value="0.5rem">0.5rem</option>
                                <option value="1rem">1rem</option>
                                <option value="1.5rem">1.5rem</option>
                                <option value="2rem">2rem</option>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
                <template v-else>
                <div v-if="!hasResponsiveValues(d)" class="space-y-2">
                    <Label>Spalten</Label>
                    <Select :model-value="d.columns ?? 'repeat(2, 1fr)'" @update:model-value="(v) => (d.columns = v)">
                        <option value="1fr">1</option>
                        <option value="repeat(2, 1fr)">2</option>
                        <option value="repeat(3, 1fr)">3</option>
                        <option value="repeat(4, 1fr)">4</option>
                    </Select>
                </div>
                <template v-else>
                    <div class="space-y-3 rounded border border-border p-3">
                        <h4 class="text-sm font-medium">Responsive Einstellungen</h4>
                        <div class="space-y-3">
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Mobile (&lt; 640px)</Label>
                                <Select :model-value="d.columns ?? '1fr'" @update:model-value="(v) => (d.columns = v)">
                                    <option value="1fr">1</option>
                                    <option value="repeat(2, 1fr)">2</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Tablet (≥ 640px)</Label>
                                <Select :model-value="d.columnsSm ?? 'repeat(2, 1fr)'" @update:model-value="(v) => (d.columnsSm = v)">
                                    <option value="1fr">1</option>
                                    <option value="repeat(2, 1fr)">2</option>
                                    <option value="repeat(3, 1fr)">3</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Desktop (≥ 1024px)</Label>
                                <Select :model-value="d.columnsLg ?? 'repeat(3, 1fr)'" @update:model-value="(v) => (d.columnsLg = v)">
                                    <option value="1fr">1</option>
                                    <option value="repeat(2, 1fr)">2</option>
                                    <option value="repeat(3, 1fr)">3</option>
                                    <option value="repeat(4, 1fr)">4</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="space-y-2">
                    <Label>Gap</Label>
                    <Select :model-value="d.gap ?? '1rem'" @update:model-value="(v) => (d.gap = v)">
                        <option value="0">0</option>
                        <option value="0.5rem">0.5rem</option>
                        <option value="1rem">1rem</option>
                        <option value="1.5rem">1.5rem</option>
                        <option value="2rem">2rem</option>
                    </Select>
                </div>
                <div class="flex items-center gap-2">
                    <input :id="`grid-padding-${entry.id}`" v-model="d.padding" type="checkbox" class="h-4 w-4 rounded border-input" />
                    <Label :for="`grid-padding-${entry.id}`">Padding</Label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <Label :for="`grid-padding-left-${entry.id}`">Padding links</Label>
                        <Select
                            :id="`grid-padding-left-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, d.paddingLeft as string | undefined, 'left')"
                            @update:model-value="(v) => {
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
                            v-if="(customPaddingLeft.value?.[entry.id] ?? false) || d.paddingLeft === '__custom__' || (!STANDARD_PADDING_VALUES.includes(d.paddingLeft as string) && d.paddingLeft)"
                            :model-value="getPaddingCustomValue(d.paddingLeft as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
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
                            :model-value="getPaddingSelectValue(entry.id, d.paddingRight as string | undefined, 'right')"
                            @update:model-value="(v) => {
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
                            v-if="(customPaddingRight.value?.[entry.id] ?? false) || d.paddingRight === '__custom__' || (!STANDARD_PADDING_VALUES.includes(d.paddingRight as string) && d.paddingRight)"
                            :model-value="getPaddingCustomValue(d.paddingRight as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
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

        <!-- flex -->
        <template v-else-if="entry.type === 'flex'">
            <p class="text-muted-foreground text-sm">Inhalt über Blöcke hinzufügen.</p>
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <input
                            :id="`flex-responsive-${entry.id}`"
                            :checked="hasResponsiveValues(d)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
                                if ((e.target as HTMLInputElement).checked) {
                                    enableResponsiveForFlex(d);
                                } else {
                                    disableResponsive(d, 'flex');
                                }
                            }"
                        />
                        <Label :for="`flex-responsive-${entry.id}`">Responsive aktivieren</Label>
                    </div>
                    <div v-if="hasResponsiveValues(d)" class="flex items-center gap-2">
                        <input
                            :id="`flex-breakpoint-tabs-${entry.id}`"
                            :checked="usesNewResponsiveFormat(d)"
                            type="checkbox"
                            class="h-4 w-4 rounded border-input"
                            @change="(e) => {
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
                    v-if="hasResponsiveValues(d) && usesNewResponsiveFormat(d)"
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).direction ?? (bp === 'mobile' ? 'column' : 'row')"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).direction = v)"
                            >
                                <option value="column">Spalte</option>
                                <option value="row">Zeile</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Gap</Label>
                            <Select
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).gap ?? '1rem'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).gap = v)"
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).justify ?? 'start'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).justify = v)"
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
                                :model-value="getEffectiveDataAtBreakpoint(d, bp).align ?? 'stretch'"
                                @update:model-value="(v) => (ensureResponsiveTarget(d, bp).align = v)"
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
                <div v-if="!hasResponsiveValues(d)" class="space-y-2">
                    <Label>Richtung</Label>
                    <Select :model-value="d.direction ?? 'row'" @update:model-value="(v) => (d.direction = v)">
                        <option value="column">Spalte</option>
                        <option value="row">Zeile</option>
                    </Select>
                </div>
                <template v-else>
                    <div class="space-y-3 rounded border border-border p-3">
                        <h4 class="text-sm font-medium">Responsive Einstellungen</h4>
                        <div class="space-y-3">
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Mobile (&lt; 640px)</Label>
                                <Select :model-value="d.direction ?? 'column'" @update:model-value="(v) => (d.direction = v)">
                                    <option value="column">Spalte</option>
                                    <option value="row">Zeile</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-xs text-muted-foreground">Desktop (≥ 1024px)</Label>
                                <Select :model-value="d.directionLg ?? 'row'" @update:model-value="(v) => (d.directionLg = v)">
                                    <option value="column">Spalte</option>
                                    <option value="row">Zeile</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="space-y-2">
                    <Label>Gap</Label>
                    <Select :model-value="d.gap ?? '1rem'" @update:model-value="(v) => (d.gap = v)">
                        <option value="0">0</option>
                        <option value="0.5rem">0.5rem</option>
                        <option value="1rem">1rem</option>
                        <option value="1.5rem">1.5rem</option>
                        <option value="2rem">2rem</option>
                    </Select>
                </div>
                <div class="space-y-2">
                    <Label>Justify</Label>
                    <Select :model-value="d.justify ?? 'start'" @update:model-value="(v) => (d.justify = v)">
                        <option value="start">Start</option>
                        <option value="center">Mitte</option>
                        <option value="end">Ende</option>
                        <option value="space-between">Space-Between</option>
                        <option value="space-around">Space-Around</option>
                    </Select>
                </div>
                <div class="space-y-2">
                    <Label>Align</Label>
                    <Select :model-value="d.align ?? 'stretch'" @update:model-value="(v) => (d.align = v)">
                        <option value="start">Start</option>
                        <option value="center">Mitte</option>
                        <option value="end">Ende</option>
                        <option value="stretch">Stretch</option>
                    </Select>
                </div>
                <div class="flex items-center gap-2">
                    <input :id="`flex-wrap-${entry.id}`" v-model="d.wrap" type="checkbox" class="h-4 w-4 rounded border-input" />
                    <Label :for="`flex-wrap-${entry.id}`">Wrap</Label>
                </div>
                <div class="flex items-center gap-2">
                    <input :id="`flex-padding-${entry.id}`" v-model="d.padding" type="checkbox" class="h-4 w-4 rounded border-input" />
                    <Label :for="`flex-padding-${entry.id}`">Padding</Label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <Label :for="`flex-padding-left-${entry.id}`">Padding links</Label>
                        <Select
                            :id="`flex-padding-left-${entry.id}`"
                            :model-value="getPaddingSelectValue(entry.id, d.paddingLeft as string | undefined, 'left')"
                            @update:model-value="(v) => {
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
                            v-if="(customPaddingLeft.value?.[entry.id] ?? false) || d.paddingLeft === '__custom__' || (!STANDARD_PADDING_VALUES.includes(d.paddingLeft as string) && d.paddingLeft)"
                            :model-value="getPaddingCustomValue(d.paddingLeft as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
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
                            :model-value="getPaddingSelectValue(entry.id, d.paddingRight as string | undefined, 'right')"
                            @update:model-value="(v) => {
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
                            v-if="(customPaddingRight.value?.[entry.id] ?? false) || d.paddingRight === '__custom__' || (!STANDARD_PADDING_VALUES.includes(d.paddingRight as string) && d.paddingRight)"
                            :model-value="getPaddingCustomValue(d.paddingRight as string | undefined)"
                            placeholder="z. B. 2.5rem, 10px"
                            class="font-mono text-sm"
                            @update:model-value="(v) => {
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

        <!-- json -->
        <template v-else-if="entry.type === 'json'">
            <div class="space-y-2">
                <Label>JSON</Label>
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
