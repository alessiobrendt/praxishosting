<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { getEditorForType, getMetaForType } from '@/templates/praxisemerald/page_components/loader';
import type { PageComponentField } from '@/templates/praxisemerald/page_components/loader';
import { inject, ref, computed } from 'vue';
import { ImagePlus, Plus, Trash2, Upload } from 'lucide-vue-next';
import AnimationPicker from '@/templates/praxisemerald/components/AnimationPicker.vue';
import IconPicker from '@/templates/praxisemerald/components/IconPicker.vue';

const openMediaLibrary = inject<((callback: (url: string) => void) => void) | null>('openMediaLibrary', null);

const pageComponentEditor = computed(() => getEditorForType(props.entry.type));
const pageComponentMeta = computed(() => getMetaForType(props.entry.type));

const props = defineProps<{
    entry: LayoutComponentEntry;
    site?: { id: number; name: string; slug: string };
}>();

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
    const r = await fetch(images.store.url({ site: props.site.id }), {
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
                            @click="openMediaLibrary((url) => ((entry.data as Record<string, unknown>)[field.key] = url))"
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
                        @click="openMediaLibrary((url) => ((entry.data as Record<string, unknown>).logoUrl = url))"
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
                <Input v-model="(entry.data as Record<string, unknown>).ctaButtonHref" />
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
                        class="flex gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeNavLink(i)">
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
                        class="flex gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeLinkSeite(i)">
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
                        class="flex gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeLinkRechtlich(i)">
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
                <textarea
                    :model-value="(entry.data as Record<string, unknown>).text as string"
                    class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="3"
                    @input="(entry.data as Record<string, unknown>).text = ($event.target as HTMLTextAreaElement).value"
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
                        @click="
                            openMediaLibrary((url) => {
                                if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                                ((entry.data as Record<string, unknown>).image as Record<string, string>).src = url;
                            })
                        "
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
                        <Input v-model="btn.href" placeholder="Link URL" class="text-sm" />
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
                        class="flex gap-2"
                    >
                        <Input v-model="link.label" placeholder="Label" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeNavLink(i)">
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
                <textarea
                    :model-value="(entry.data as Record<string, unknown>).text as string"
                    class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="2"
                    @input="(entry.data as Record<string, unknown>).text = ($event.target as HTMLTextAreaElement).value"
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
                <textarea
                    :model-value="(entry.data as Record<string, unknown>).text as string"
                    class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="2"
                    @input="(entry.data as Record<string, unknown>).text = ($event.target as HTMLTextAreaElement).value"
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
                        @click="
                            openMediaLibrary((url) => {
                                if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
                                ((entry.data as Record<string, unknown>).image as Record<string, string>).src = url;
                            })
                        "
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
                        class="flex gap-2"
                    >
                        <Input v-model="link.text" placeholder="Text" class="min-w-0 flex-1" />
                        <Input v-model="link.href" placeholder="URL" class="min-w-0 flex-1" />
                        <Input v-model="link.variant" placeholder="primary / secondary" class="w-24" />
                        <Button type="button" variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="removeCtaLink(i)">
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
                <div class="space-y-2">
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
            </div>
        </template>

        <!-- Flex-Container -->
        <template v-else-if="entry.type === 'flex'">
            <p class="text-muted-foreground text-sm">
                Inhalt über Blöcke hinzufügen: Ziehen Sie Komponenten in diesen Flex-Container.
            </p>
            <div class="space-y-3">
                <div class="space-y-2">
                    <Label>Richtung</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).direction ?? 'row'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).direction = v)"
                    >
                        <option value="column">Spalte (untereinander)</option>
                        <option value="row">Zeile (nebeneinander)</option>
                    </Select>
                </div>
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
            </div>
        </template>

        <!-- Section (Bereich / Container) -->
        <template v-else-if="entry.type === 'section'">
            <p class="text-muted-foreground text-sm">
                Inhalt über Blöcke hinzufügen: Ziehen Sie Komponenten aus der Seitenstruktur oder aus der Vorschau in diesen Bereich.
            </p>
            <div class="space-y-3">
                <div class="space-y-2">
                    <Label>Richtung</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).direction ?? 'column'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).direction = v)"
                    >
                        <option value="column">Spalte (untereinander)</option>
                        <option value="row">Zeile (nebeneinander)</option>
                    </Select>
                </div>
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
                    <Label>Horizontale Ausrichtung (Justify)</Label>
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
                    <Label>Vertikale Ausrichtung (Align)</Label>
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
                <div class="space-y-2">
                    <Label>Breite</Label>
                    <Select
                        :model-value="(entry.data as Record<string, unknown>).contentWidth ?? 'full'"
                        @update:model-value="(v) => ((entry.data as Record<string, unknown>).contentWidth = v)"
                    >
                        <option value="full">Volle Breite</option>
                        <option value="boxed">Boxed (max-width zentriert)</option>
                    </Select>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        :id="`section-wrap-${entry.id}`"
                        v-model="(entry.data as Record<string, unknown>).wrap"
                        type="checkbox"
                        class="h-4 w-4 rounded border-input"
                    />
                    <Label :for="`section-wrap-${entry.id}`">Umbrechen (Wrap)</Label>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        :id="`section-padding-${entry.id}`"
                        v-model="(entry.data as Record<string, unknown>).padding"
                        type="checkbox"
                        class="h-4 w-4 rounded border-input"
                    />
                    <Label :for="`section-padding-${entry.id}`">Innenabstand (Padding)</Label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <Label :for="`section-padding-left-${entry.id}`">Padding links</Label>
                        <Select
                            :id="`section-padding-left-${entry.id}`"
                            :model-value="(entry.data as Record<string, unknown>).paddingLeft ?? ''"
                            @update:model-value="(v) => ((entry.data as Record<string, unknown>).paddingLeft = v || undefined)"
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
                        <Label :for="`section-padding-right-${entry.id}`">Padding rechts</Label>
                        <Select
                            :id="`section-padding-right-${entry.id}`"
                            :model-value="(entry.data as Record<string, unknown>).paddingRight ?? ''"
                            @update:model-value="(v) => ((entry.data as Record<string, unknown>).paddingRight = v || undefined)"
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
