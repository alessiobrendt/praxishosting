<script setup lang="ts">
import { uploadImage } from '@/actions/App/Http/Controllers/SiteController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ref, computed } from 'vue';
import { ChevronDown, Plus, Trash2, Upload } from 'lucide-vue-next';

const props = defineProps<{
    site: { id: number; name: string; slug: string };
    pageData: Record<string, unknown>;
}>();

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function hexForColorPicker(hex: string): string {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) return `#${hex}`;
    return '#0d9488';
}

function ensureColors(): Record<string, string> {
    if (!props.pageData.colors || typeof props.pageData.colors !== 'object') {
        props.pageData.colors = {
            primary: '#0d9488',
            primaryHover: '#0f766e',
            primaryLight: '#ccfbf1',
            primaryDark: '#134e4a',
            secondary: '#0f172a',
            tertiary: '#334155',
            quaternary: '#f8fafc',
            quinary: '#f1f5f9',
        };
    }
    return props.pageData.colors as Record<string, string>;
}

function ensureHero(): Record<string, unknown> {
    if (!props.pageData.hero || typeof props.pageData.hero !== 'object') {
        props.pageData.hero = {
            heading: '',
            text: '',
            buttons: [],
            image: { src: '', alt: '' },
        };
    }
    const hero = props.pageData.hero as Record<string, unknown>;
    if (!hero.image || typeof hero.image !== 'object') hero.image = { src: '', alt: '' };
    if (!Array.isArray(hero.buttons)) hero.buttons = [];
    return hero;
}

function ensureServices(): Array<{ title: string; shortDesc: string }> {
    if (!Array.isArray(props.pageData.services)) {
        props.pageData.services = [];
    }
    return props.pageData.services as Array<{ title: string; shortDesc: string }>;
}

function ensureAbout(): Record<string, string> {
    if (!props.pageData.about || typeof props.pageData.about !== 'object') {
        props.pageData.about = { heading: 'Über uns', text: '' };
    }
    return props.pageData.about as Record<string, string>;
}

function ensureContact(): Record<string, string> {
    if (!props.pageData.contact || typeof props.pageData.contact !== 'object') {
        props.pageData.contact = {
            heading: 'Kontakt',
            text: '',
            phone: '',
            email: '',
            address: '',
            buttonText: '',
            buttonHref: '',
        };
    }
    return props.pageData.contact as Record<string, string>;
}

const colors = computed(() => ensureColors());
const heroData = computed(() => ensureHero());
const servicesList = computed(() => ensureServices());
const aboutData = computed(() => ensureAbout());
const contactData = computed(() => ensureContact());

function addHeroButton(): void {
    (heroData.value.buttons as Array<{ text: string; href: string; variant: string }>).push({
        text: '',
        href: '',
        variant: 'default',
    });
}

function removeHeroButton(i: number): void {
    (heroData.value.buttons as unknown[]).splice(i, 1);
}

function addService(): void {
    (props.pageData.services as Array<{ title: string; shortDesc: string }>).push({
        title: '',
        shortDesc: '',
    });
}

function removeService(i: number): void {
    (props.pageData.services as unknown[]).splice(i, 1);
}

const heroImageInputRef = ref<HTMLInputElement | null>(null);

async function uploadHeroImage(file: File): Promise<void> {
    const fd = new FormData();
    fd.append('image', file);
    const r = await fetch(uploadImage({ site: props.site.id }).url, {
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
    if (data.url) {
        (heroData.value.image as Record<string, string>).src = data.url;
    }
}
</script>

<template>
    <div class="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Farben</CardTitle>
                <CardDescription>Primärfarben und Hintergründe für das Handwerk-Template</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4 sm:grid-cols-2">
                <div v-for="(_, key) in colors" :key="String(key)" class="flex flex-col gap-2">
                    <Label :for="`color-${key}`">{{ key }}</Label>
                    <div class="flex items-center gap-2">
                        <input
                            :id="`color-${key}`"
                            type="color"
                            :value="hexForColorPicker(colors[key])"
                            class="h-10 w-14 shrink-0 cursor-pointer rounded border border-input bg-background"
                            @input="colors[key] = ($event.target as HTMLInputElement).value"
                        />
                        <Input v-model="colors[key]" type="text" class="flex-1 font-mono" placeholder="#rrggbb" />
                    </div>
                </div>
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
                                    :model-value="(heroData.image as Record<string, string>)?.src ?? ''"
                                    placeholder="URL oder Bild hochladen"
                                    class="min-w-[200px] flex-1"
                                    @update:model-value="(v) => ((heroData.image as Record<string, string>).src = v)"
                                />
                                <input
                                    ref="heroImageInputRef"
                                    type="file"
                                    accept="image/*"
                                    class="sr-only"
                                    @change="(e) => (e.target as HTMLInputElement).files?.[0] && uploadHeroImage((e.target as HTMLInputElement).files![0])"
                                />
                                <Button type="button" variant="outline" size="sm" @click="heroImageInputRef?.click()">
                                    <Upload class="mr-1 h-4 w-4" />
                                    Bild hochladen
                                </Button>
                            </div>
                            <Input
                                :model-value="(heroData.image as Record<string, string>)?.alt ?? ''"
                                placeholder="Alt-Text"
                                @update:model-value="(v) => ((heroData.image as Record<string, string>).alt = v)"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Buttons</Label>
                            <div
                                v-for="(btn, i) in (heroData.buttons as Array<{ text: string; href: string; variant: string }>)"
                                :key="i"
                                class="flex gap-2"
                            >
                                <Input v-model="btn.text" placeholder="Text" />
                                <Input v-model="btn.href" placeholder="Link" />
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
                <CardTitle>Leistungen</CardTitle>
                <CardDescription>Titel und Kurzbeschreibung pro Leistung</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div
                    v-for="(service, i) in servicesList"
                    :key="i"
                    class="grid gap-2 border-b pb-3 sm:grid-cols-2"
                >
                    <Input v-model="service.title" placeholder="Titel" />
                    <div class="flex gap-2">
                        <Input v-model="service.shortDesc" placeholder="Kurzbeschreibung" />
                        <Button type="button" variant="ghost" size="icon" @click="removeService(i)">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Button type="button" variant="outline" size="sm" @click="addService">
                    <Plus class="h-4 w-4" /> Leistung
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Über uns</CardTitle>
                <CardDescription>Überschrift und Fließtext</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Überschrift</Label>
                    <Input v-model="aboutData.heading" />
                </div>
                <div class="space-y-2">
                    <Label>Text</Label>
                    <textarea
                        v-model="aboutData.text"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows="3"
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Kontakt</CardTitle>
                <CardDescription>Überschrift, Text, Telefon, E-Mail, Adresse, CTA-Button</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Überschrift</Label>
                    <Input v-model="contactData.heading" />
                </div>
                <div class="space-y-2">
                    <Label>Text</Label>
                    <textarea
                        v-model="contactData.text"
                        class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows="2"
                    />
                </div>
                <div class="grid gap-2 sm:grid-cols-2">
                    <div class="space-y-2">
                        <Label>Telefon</Label>
                        <Input v-model="contactData.phone" />
                    </div>
                    <div class="space-y-2">
                        <Label>E-Mail</Label>
                        <Input v-model="contactData.email" type="email" />
                    </div>
                </div>
                <div class="space-y-2">
                    <Label>Adresse</Label>
                    <Input v-model="contactData.address" />
                </div>
                <div class="grid gap-2 sm:grid-cols-2">
                    <div class="space-y-2">
                        <Label>Button-Text</Label>
                        <Input v-model="contactData.buttonText" placeholder="z. B. Jetzt anfragen" />
                    </div>
                    <div class="space-y-2">
                        <Label>Button-Link</Label>
                        <Input v-model="contactData.buttonHref" placeholder="#kontakt oder URL" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
