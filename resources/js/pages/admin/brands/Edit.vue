<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = {
    id: number;
    key: string;
    name: string;
    domains: string[] | null;
    is_default: boolean;
    logo_url: string | null;
    theme_colors: Record<string, string> | null;
    features: Record<string, boolean> | null;
    salutation: string | null;
    mail_header: string | null;
    mail_footer: string | null;
};

type Props = {
    brand: Brand;
};

const props = defineProps<Props>();

const THEME_COLOR_KEYS: { key: string; label: string }[] = [
    { key: 'primary', label: 'Primär' },
    { key: 'primary_hover', label: 'Primär (Hover)' },
    { key: 'primary_light', label: 'Primär (hell)' },
    { key: 'primary_dark', label: 'Primär (dunkel)' },
];

type ThemeColors = Record<string, string>;

const defaultThemeColors: ThemeColors = {
    primary: '#059669',
    primary_hover: '#047857',
    primary_light: '#ecfdf5',
    primary_dark: '#065f46',
};

const form = useForm({
    name: props.brand.name,
    domains: (props.brand.domains ?? []).join('\n'),
    is_default: props.brand.is_default ?? false,
    logo_url: props.brand.logo_url ?? '',
    theme_colors: {
        ...defaultThemeColors,
        ...(props.brand.theme_colors ?? {}),
    } as ThemeColors,
    feature_sites_editor: props.brand.features?.sites_editor ?? true,
    feature_webspace: props.brand.features?.webspace ?? true,
    feature_domains_shop: props.brand.features?.domains_shop ?? true,
    feature_ai_tokens: props.brand.features?.ai_tokens ?? true,
    feature_gaming: props.brand.features?.gaming ?? false,
    salutation: props.brand.salutation ?? 'formal',
    mail_header: props.brand.mail_header ?? '',
    mail_footer: props.brand.mail_footer ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Marken', href: '/admin/brands' },
    { title: props.brand.name, href: '#' },
];

const submit = () => {
    form.transform((data) => ({
        name: data.name,
        domains: form.domains.split('\n').map((d) => d.trim()).filter(Boolean),
        is_default: data.is_default,
        logo_url: data.logo_url,
        theme_colors: data.theme_colors,
        features: {
            sites_editor: data.feature_sites_editor,
            webspace: data.feature_webspace,
            domains_shop: data.feature_domains_shop,
            ai_tokens: data.feature_ai_tokens,
            gaming: data.feature_gaming,
        },
        salutation: data.salutation,
        mail_header: data.mail_header,
        mail_footer: data.mail_footer,
    })).put(`/admin/brands/${props.brand.id}`);
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Marke: ${brand.name}`" />

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <Heading level="h1">Marke bearbeiten</Heading>
                <Text class="mt-2" muted>
                    {{ brand.key }} – Name, Domains, Features und E-Mail-Inhalte
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Allgemein</CardTitle>
                    <CardDescription>Name und Domains (eine pro Zeile)</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Name</Label>
                        <Input id="name" v-model="form.name" :aria-invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div class="space-y-2">
                        <Label for="domains">Domains</Label>
                        <Textarea
                            id="domains"
                            v-model="form.domains"
                            rows="3"
                            placeholder="b2b.praxishosting.de&#10;localhost"
                            :aria-invalid="!!form.errors.domains"
                        />
                        <InputError :message="form.errors.domains" />
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="is_default" v-model="form.is_default" />
                        <Label for="is_default">Als Standard-Marke (z. B. für localhost)</Label>
                    </div>
                    <div class="space-y-2">
                        <Label for="logo_url">Logo-URL</Label>
                        <Input id="logo_url" v-model="form.logo_url" placeholder="https://…" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Theme-Farben</CardTitle>
                    <CardDescription>Farben fürs Kunden-Panel (CSS-Variablen wie --primary)</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div
                        v-for="item in THEME_COLOR_KEYS"
                        :key="item.key"
                        class="flex flex-wrap items-center gap-3 gap-y-2"
                    >
                        <Label :for="`theme-${item.key}`" class="w-36 shrink-0">{{ item.label }}</Label>
                        <input
                            :id="`theme-${item.key}`"
                            v-model="form.theme_colors[item.key]"
                            type="color"
                            class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800"
                            :aria-invalid="!!form.errors['theme_colors.' + item.key]"
                        />
                        <Input
                            v-model="form.theme_colors[item.key]"
                            class="w-28 font-mono text-sm"
                            placeholder="#000000"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Welche Produkte in diesem Portal sichtbar sind – aktivieren oder deaktivieren</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Checkbox id="feat_sites" v-model="form.feature_sites_editor" />
                        <Label for="feat_sites">Webseiten-Editor (Meine Sites)</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="feat_webspace" v-model="form.feature_webspace" />
                        <Label for="feat_webspace">Webspace</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="feat_domains" v-model="form.feature_domains_shop" />
                        <Label for="feat_domains">Domains-Shop</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="feat_ai" v-model="form.feature_ai_tokens" />
                        <Label for="feat_ai">AI-Tokens</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="feat_gaming" v-model="form.feature_gaming" />
                        <Label for="feat_gaming">Gaming (Game-Server / Pterodactyl)</Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Anrede & E-Mail</CardTitle>
                    <CardDescription>Für E-Mails an Kunden dieser Marke</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="salutation">Anrede</Label>
                        <Select id="salutation" v-model="form.salutation">
                            <option value="formal">Formell (Sie)</option>
                            <option value="informal">Informell (Du)</option>
                        </Select>
                    </div>
                    <div class="space-y-2">
                        <Label for="mail_header">E-Mail-Header (HTML)</Label>
                        <Textarea id="mail_header" v-model="form.mail_header" rows="2" />
                    </div>
                    <div class="space-y-2">
                        <Label for="mail_footer">E-Mail-Footer (HTML oder Text)</Label>
                        <Textarea id="mail_footer" v-model="form.mail_footer" rows="2" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" :disabled="form.processing">Speichern</Button>
                    <Link href="/admin/brands">
                        <Button type="button" variant="outline" class="ml-2">Abbrechen</Button>
                    </Link>
                </CardFooter>
            </Card>
        </form>
    </AppLayout>
</template>
