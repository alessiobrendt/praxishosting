<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
    SitePageData,
    SitePageDataColors,
    HeroButton,
    HeroData,
    AboutFeature,
    DayHours,
    CtaLink,
} from '@/types/site-page-data';
import { ref, computed } from 'vue';
import { ChevronDown, Plus, Trash2, Upload, GripVertical } from 'lucide-vue-next';
import {
    LAYOUT_COMPONENT_REGISTRY,
    getDefaultDataForType,
    generateLayoutComponentId,
} from '@/templates/praxisemerald/combined-registry';
import type { LayoutComponentType } from '@/types/layout-components';

const props = defineProps<{
    site: { id: number; name: string; slug: string };
    pageData: SitePageData | Record<string, unknown>;
}>();

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function hexForColorPicker(hex: string): string {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) return `#${hex}`;
    return '#059669';
}


/** Single source for Hero: use layout_components Hero data when present, else pageData.hero. */
const heroData = computed((): HeroData => {
    const data = props.pageData as SitePageData;
    const comp = data.layout_components?.find((c) => c.type === 'hero');
    if (comp?.data && typeof comp.data === 'object' && 'heading' in comp.data) {
        return comp.data as unknown as HeroData;
    }
    return data.hero;
});

function addHeroButton() {
    heroData.value.buttons.push({ text: '', href: '', variant: 'default' });
}
function removeHeroButton(i: number) {
    heroData.value.buttons.splice(i, 1);
}
function addAboutFeature() {
    (props.pageData as SitePageData).about.features.push({ icon: 'Stethoscope', title: '', desc: '' });
}
function removeAboutFeature(i: number) {
    (props.pageData as SitePageData).about.features.splice(i, 1);
}
function addCtaLink() {
    (props.pageData as SitePageData).cta.links.push({ text: '', href: '', variant: 'primary' });
}
function removeCtaLink(i: number) {
    (props.pageData as SitePageData).cta.links.splice(i, 1);
}

async function uploadHeroImage(file: File) {
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
    if (data.url) heroData.value.image.src = data.url;
}
async function uploadCtaImage(file: File) {
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
    if (data.url) (props.pageData as SitePageData).cta.image.src = data.url;
}

const heroImageInputRef = ref<HTMLInputElement | null>(null);
const ctaImageInputRef = ref<HTMLInputElement | null>(null);
const componentImageInputRef = ref<HTMLInputElement | null>(null);
const pendingComponentUpload = ref<{ index: number; field: 'logoUrl' | 'imageSrc' } | null>(null);

async function uploadLayoutComponentImage(file: File) {
    const pending = pendingComponentUpload.value;
    if (!pending) return;
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
    if (!data.url) {
        pendingComponentUpload.value = null;
        return;
    }
    const list = [...((props.pageData as SitePageData).layout_components ?? [])];
    const entry = list[pending.index];
    if (entry?.data) {
        if (pending.field === 'logoUrl') {
            (entry.data as Record<string, unknown>).logoUrl = data.url;
        } else if (pending.field === 'imageSrc') {
            if (!(entry.data as Record<string, unknown>).image) {
                (entry.data as Record<string, unknown>).image = { src: '', alt: '' };
            }
            ((entry.data as Record<string, unknown>).image as Record<string, string>).src = data.url;
        }
        (props.pageData as SitePageData).layout_components = list;
    }
    pendingComponentUpload.value = null;
    if (componentImageInputRef.value) componentImageInputRef.value.value = '';
}

function triggerComponentImageUpload(index: number, field: 'logoUrl' | 'imageSrc') {
    pendingComponentUpload.value = { index, field };
    componentImageInputRef.value?.click();
}

const layoutComponents = computed({
    get: () => (props.pageData as SitePageData).layout_components ?? [],
    set: (val) => {
        (props.pageData as SitePageData).layout_components = val;
    },
});

function addLayoutComponent(type: LayoutComponentType) {
    const list = [...((props.pageData as SitePageData).layout_components ?? [])];
    list.push({
        id: generateLayoutComponentId(),
        type,
        data: getDefaultDataForType(type),
    });
    (props.pageData as SitePageData).layout_components = list;
}

function removeLayoutComponent(index: number) {
    const list = [...((props.pageData as SitePageData).layout_components ?? [])];
    list.splice(index, 1);
    (props.pageData as SitePageData).layout_components = list;
}

function moveLayoutComponent(index: number, direction: 'up' | 'down') {
    const list = [...((props.pageData as SitePageData).layout_components ?? [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    (props.pageData as SitePageData).layout_components = list;
}

function getComponentLabel(type: string, entry?: { data?: Record<string, unknown> }): string {
    const label = entry?.data?.moduleLabel;
    if (typeof label === 'string' && label.trim() !== '') {
        return label.trim();
    }
    return LAYOUT_COMPONENT_REGISTRY.find((r) => r.type === type)?.label ?? type;
}

function updateJsonComponentData(index: number, jsonString: string) {
    try {
        const parsed = JSON.parse(jsonString) as Record<string, unknown>;
        const list = [...((props.pageData as SitePageData).layout_components ?? [])];
        if (list[index]) list[index] = { ...list[index], data: parsed };
        (props.pageData as SitePageData).layout_components = list;
    } catch {
        // ignore invalid JSON
    }
}

const showAddComponentMenu = ref(false);
</script>

<template>
    <div class="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Farben</CardTitle>
                <CardDescription>Primärfarben und Hintergründe</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4 sm:grid-cols-2 @sm:grid-cols-2">
                <div v-for="(_, key) in (props.pageData as SitePageData).colors" :key="String(key)" class="flex flex-col gap-2">
                    <Label :for="`color-${key}`">{{ key }}</Label>
                    <div class="flex gap-2 items-center">
                        <input
                            :id="`color-${key}`"
                            type="color"
                            :value="hexForColorPicker((props.pageData as SitePageData).colors[key as keyof SitePageDataColors])"
                            class="h-10 w-14 shrink-0 cursor-pointer rounded border border-input bg-background"
                            @input="(props.pageData as SitePageData).colors[key as keyof SitePageDataColors] = (($event.target as HTMLInputElement).value)"
                        />
                        <Input
                            v-model="(props.pageData as SitePageData).colors[key as keyof SitePageDataColors]"
                            type="text"
                            class="font-mono flex-1"
                            placeholder="#rrggbb"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Layout-Komponenten</CardTitle>
                <CardDescription>Header, Footer und weitere Komponenten. Reihenfolge und Inhalte anpassen.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <input
                    ref="componentImageInputRef"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadLayoutComponentImage(f); }"
                />
                <div class="relative">
                    <Button type="button" variant="outline" size="sm" @click="showAddComponentMenu = !showAddComponentMenu">
                        <Plus class="h-4 w-4 mr-1" />
                        Komponente hinzufügen
                    </Button>
                    <div v-if="showAddComponentMenu" class="absolute left-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-md border bg-card p-2 shadow">
                        <button
                            v-for="reg in LAYOUT_COMPONENT_REGISTRY"
                            :key="reg.type"
                            type="button"
                            class="rounded px-3 py-2 text-left text-sm hover:bg-muted"
                            @click="addLayoutComponent(reg.type as LayoutComponentType); showAddComponentMenu = false"
                        >
                            {{ reg.label }}
                        </button>
                    </div>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(entry, index) in layoutComponents"
                        :key="entry.id"
                        class="flex flex-col gap-2 rounded-lg border p-3"
                    >
                        <div class="flex items-center gap-2">
                            <GripVertical class="h-4 w-4 text-muted-foreground" />
                            <span class="font-medium">{{ getComponentLabel(entry.type, entry) }}</span>
                            <div class="ml-auto flex gap-1">
                                <Button type="button" variant="ghost" size="icon" :disabled="index === 0" @click="moveLayoutComponent(index, 'up')">
                                    <ChevronDown class="h-4 w-4 rotate-180" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" :disabled="index === layoutComponents.length - 1" @click="moveLayoutComponent(index, 'down')">
                                    <ChevronDown class="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" @click="removeLayoutComponent(index)">
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Collapsible>
                            <CollapsibleTrigger class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                                <ChevronDown class="h-4 w-4" />
                                Daten bearbeiten
                            </CollapsibleTrigger>
                            <CollapsibleContent class="mt-3 space-y-3 pl-6">
                                <template v-if="entry.type === 'header'">
                                    <div class="grid gap-2 sm:grid-cols-2 @sm:grid-cols-2">
                                        <div class="space-y-1"><Label>Praxisname</Label><Input v-model="(entry.data as Record<string, unknown>).siteName" /></div>
                                        <div class="space-y-1">
                                            <Label>Logo URL</Label>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <Input v-model="(entry.data as Record<string, unknown>).logoUrl" placeholder="URL oder Bild hochladen" class="flex-1 min-w-[200px]" />
                                                <Button type="button" variant="outline" size="sm" @click="triggerComponentImageUpload(layoutComponents.indexOf(entry), 'logoUrl')">
                                                    <Upload class="h-4 w-4 mr-1" />
                                                    Bild hochladen
                                                </Button>
                                            </div>
                                        </div>
                                        <div class="space-y-1"><Label>CTA Button Text</Label><Input v-model="(entry.data as Record<string, unknown>).ctaButtonText" /></div>
                                        <div class="space-y-1"><Label>CTA Button Link</Label><Input v-model="(entry.data as Record<string, unknown>).ctaButtonHref" /></div>
                                    </div>
                                    <div class="space-y-1">
                                        <Label>Navigation (JSON: [{ "href", "label" }])</Label>
                                        <textarea
                                            :value="JSON.stringify((entry.data as Record<string, unknown>).links ?? [], null, 2)"
                                            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                                            rows="5"
                                            @input="(e) => { try { (entry.data as Record<string, unknown>).links = JSON.parse((e.target as HTMLTextAreaElement).value); } catch { } }"
                                        />
                                    </div>
                                </template>
                                <template v-else-if="entry.type === 'footer'">
                                    <div class="grid gap-2 sm:grid-cols-2 @sm:grid-cols-2">
                                        <div class="space-y-1"><Label>Praxisname</Label><Input v-model="(entry.data as Record<string, unknown>).siteName" /></div>
                                        <div class="space-y-1"><Label>Beschreibung</Label><Input v-model="(entry.data as Record<string, unknown>).description" /></div>
                                        <div class="space-y-1"><Label>Adresse</Label><Input v-model="(entry.data as Record<string, unknown>).address" /></div>
                                        <div class="space-y-1"><Label>Telefon</Label><Input v-model="(entry.data as Record<string, unknown>).phone" /></div>
                                        <div class="space-y-1"><Label>E-Mail</Label><Input v-model="(entry.data as Record<string, unknown>).email" /></div>
                                        <div class="space-y-1"><Label>Öffnungszeiten</Label><Input v-model="(entry.data as Record<string, unknown>).openingLine" /></div>
                                        <div class="space-y-1"><Label>Copyright</Label><Input v-model="(entry.data as Record<string, unknown>).copyrightText" /></div>
                                        <div class="space-y-1"><Label>Credit-Zeile</Label><Input v-model="(entry.data as Record<string, unknown>).creditLine" /></div>
                                    </div>
                                    <div class="space-y-1">
                                        <Label>Links Seiten (JSON)</Label>
                                        <textarea :value="JSON.stringify((entry.data as Record<string, unknown>).linksSeiten ?? [], null, 2)" class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm" rows="3" @input="(e) => { try { (entry.data as Record<string, unknown>).linksSeiten = JSON.parse((e.target as HTMLTextAreaElement).value); } catch { } }" />
                                    </div>
                                    <div class="space-y-1">
                                        <Label>Links Rechtliches (JSON)</Label>
                                        <textarea :value="JSON.stringify((entry.data as Record<string, unknown>).linksRechtliches ?? [], null, 2)" class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm" rows="2" @input="(e) => { try { (entry.data as Record<string, unknown>).linksRechtliches = JSON.parse((e.target as HTMLTextAreaElement).value); } catch { } }" />
                                    </div>
                                </template>
                                <template v-else-if="entry.type === 'hero'">
                                    <div class="grid gap-2 sm:grid-cols-2 @sm:grid-cols-2">
                                        <div class="space-y-1"><Label>Überschrift</Label><Input v-model="(entry.data as Record<string, unknown>).heading" /></div>
                                        <div class="space-y-1"><Label>Text</Label><Input v-model="(entry.data as Record<string, unknown>).text" /></div>
                                        <div class="space-y-1">
                                            <Label>Bild</Label>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <Input
                                                    :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.src ?? ''"
                                                    placeholder="URL oder Bild hochladen"
                                                    class="flex-1 min-w-[200px]"
                                                    @update:model-value="(val) => { if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = {}; ((entry.data as Record<string, unknown>).image as Record<string, string>).src = val; }"
                                                />
                                                <Button type="button" variant="outline" size="sm" @click="triggerComponentImageUpload(layoutComponents.indexOf(entry), 'imageSrc')">
                                                    <Upload class="h-4 w-4 mr-1" />
                                                    Bild hochladen
                                                </Button>
                                            </div>
                                        </div>
                                        <div class="space-y-1">
                                            <Label>Bild Alt</Label>
                                            <Input
                                                :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.alt ?? ''"
                                                @update:model-value="(val) => { if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = {}; ((entry.data as Record<string, unknown>).image as Record<string, string>).alt = val; }"
                                            />
                                        </div>
                                    </div>
                                    <div class="space-y-1">
                                        <Label>Buttons (JSON)</Label>
                                        <textarea :value="JSON.stringify((entry.data as Record<string, unknown>).buttons ?? [], null, 2)" class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm" rows="3" @input="(e) => { try { (entry.data as Record<string, unknown>).buttons = JSON.parse((e.target as HTMLTextAreaElement).value); } catch { } }" />
                                    </div>
                                </template>
                                <template v-else-if="entry.type === 'mobileNav'">
                                    <div class="space-y-1">
                                        <Label>Links (JSON)</Label>
                                        <textarea :value="JSON.stringify((entry.data as Record<string, unknown>).links ?? [], null, 2)" class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm" rows="4" @input="(e) => { try { (entry.data as Record<string, unknown>).links = JSON.parse((e.target as HTMLTextAreaElement).value); } catch { } }" />
                                    </div>
                                </template>
                                <template v-else-if="entry.type === 'json'">
                                    <div class="space-y-1">
                                        <Label>JSON (beliebig; z. B. {"text": "…"} oder {"html": "…"} oder {"className": "…"})</Label>
                                        <textarea
                                            :value="JSON.stringify(entry.data ?? {}, null, 2)"
                                            class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                                            rows="10"
                                            @input="(e) => updateJsonComponentData(layoutComponents.indexOf(entry), (e.target as HTMLTextAreaElement).value)"
                                        />
                                    </div>
                                </template>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
                <p v-if="!layoutComponents.length" class="text-sm text-muted-foreground">Keine Layout-Komponenten. „Komponente hinzufügen“ wählen.</p>
            </CardContent>
        </Card>

        <Collapsible class="space-y-2">
            <Card>
                <CollapsibleTrigger as-child>
                    <CardHeader class="flex cursor-pointer flex-row items-center justify-between">
                        <div>
                            <CardTitle>Hero (Startbereich)</CardTitle>
                            <CardDescription>Überschrift, Text, Buttons, Bild</CardDescription>
                        </div>
                        <ChevronDown class="h-4 w-4 shrink-0" />
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label>Überschrift</Label>
                            <Input v-model="heroData.heading" />
                        </div>
                        <div class="space-y-2">
                            <Label>Text</Label>
                            <textarea
                                v-model="heroData.text"
                                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                rows="3"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Bild</Label>
                            <div class="flex flex-wrap items-center gap-2">
                                <Input
                                    v-model="heroData.image.src"
                                    placeholder="URL oder Bild hochladen"
                                    class="flex-1 min-w-[200px]"
                                />
                                <input
                                    ref="heroImageInputRef"
                                    type="file"
                                    accept="image/*"
                                    class="sr-only"
                                    @change="(e) => (e.target as HTMLInputElement).files?.[0] && uploadHeroImage((e.target as HTMLInputElement).files![0])"
                                />
                                <Button type="button" variant="outline" size="sm" @click="heroImageInputRef?.click()">
                                    <Upload class="h-4 w-4 mr-1" />
                                    Bild hochladen
                                </Button>
                            </div>
                            <Input v-model="heroData.image.alt" placeholder="Alt-Text (z. B. Beschreibung des Bildes)" />
                        </div>
                        <div class="space-y-2">
                            <Label>Buttons</Label>
                            <div
                                v-for="(btn, i) in heroData.buttons"
                                :key="i"
                                class="flex gap-2"
                            >
                                <Input v-model="(btn as HeroButton).text" placeholder="Text" />
                                <Input v-model="(btn as HeroButton).href" placeholder="Link" />
                                <Button type="button" variant="ghost" size="icon" @click="removeHeroButton(i)">
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                            <Button type="button" variant="outline" size="sm" @click="addHeroButton">
                                <Plus class="h-4 w-4" /> Button
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>

        <Card>
            <CardHeader>
                <CardTitle>Kurzvorstellung (About)</CardTitle>
                <CardDescription>Überschrift, Text, Features</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Überschrift</Label>
                    <Input v-model="(props.pageData as SitePageData).about.heading" />
                </div>
                <div class="space-y-2">
                    <Label>Text</Label>
                    <textarea
                        v-model="(props.pageData as SitePageData).about.text"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows="3"
                    />
                </div>
                <div class="space-y-2">
                    <Label>Features</Label>
                    <div
                        v-for="(f, i) in (props.pageData as SitePageData).about.features"
                        :key="i"
                        class="grid gap-2 border-b pb-2 sm:grid-cols-3 @sm:grid-cols-3"
                    >
                        <Input v-model="(f as AboutFeature).icon" placeholder="Icon" />
                        <Input v-model="(f as AboutFeature).title" placeholder="Titel" />
                        <div class="flex gap-2">
                            <Input v-model="(f as AboutFeature).desc" placeholder="Beschreibung" />
                            <Button type="button" variant="ghost" size="icon" @click="removeAboutFeature(i)">
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" @click="addAboutFeature">
                        <Plus class="h-4 w-4" /> Feature
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Öffnungszeiten</CardTitle>
                <CardDescription>Überschrift, Hinweis, Tabelle</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Überschrift</Label>
                    <Input v-model="(props.pageData as SitePageData).hours.heading" />
                </div>
                <div class="space-y-2">
                    <Label>Hinweistext</Label>
                    <Input v-model="(props.pageData as SitePageData).hours.infoText" />
                </div>
                <div class="space-y-2">
                    <Label>Zeiten</Label>
                    <div
                        v-for="(row, i) in (props.pageData as SitePageData).hours.hours"
                        :key="i"
                        class="flex gap-2"
                    >
                        <Input v-model="(row as DayHours).day" class="w-28" />
                        <Input v-model="(row as DayHours).hours" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>CTA (Call-to-Action)</CardTitle>
                <CardDescription>Überschrift, Text, Links, Bild</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Überschrift</Label>
                    <Input v-model="(props.pageData as SitePageData).cta.heading" />
                </div>
                <div class="space-y-2">
                    <Label>Text</Label>
                    <textarea
                        v-model="(props.pageData as SitePageData).cta.text"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows="2"
                    />
                </div>
                <div class="space-y-2">
                    <Label>Bild</Label>
                    <div class="flex flex-wrap items-center gap-2">
                        <Input
                            v-model="(props.pageData as SitePageData).cta.image.src"
                            placeholder="URL oder Bild hochladen"
                            class="flex-1 min-w-[200px]"
                        />
                        <input
                            ref="ctaImageInputRef"
                            type="file"
                            accept="image/*"
                            class="sr-only"
                            @change="(e) => (e.target as HTMLInputElement).files?.[0] && uploadCtaImage((e.target as HTMLInputElement).files![0])"
                        />
                        <Button type="button" variant="outline" size="sm" @click="ctaImageInputRef?.click()">
                            <Upload class="h-4 w-4 mr-1" />
                            Bild hochladen
                        </Button>
                    </div>
                    <Input v-model="(props.pageData as SitePageData).cta.image.alt" placeholder="Alt-Text (z. B. Beschreibung des Bildes)" />
                </div>
                <div class="space-y-2">
                    <Label>Links</Label>
                    <div
                        v-for="(link, i) in (props.pageData as SitePageData).cta.links"
                        :key="i"
                        class="flex gap-2"
                    >
                        <Input v-model="(link as CtaLink).text" placeholder="Text" />
                        <Input v-model="(link as CtaLink).href" placeholder="URL" />
                        <Button type="button" variant="ghost" size="icon" @click="removeCtaLink(i)">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                    <Button type="button" variant="outline" size="sm" @click="addCtaLink">
                        <Plus class="h-4 w-4" /> Link
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
