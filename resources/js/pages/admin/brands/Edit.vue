<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = {
    id: number;
    key: string;
    name: string;
    domains: string[] | null;
    admin_domains: string[] | null;
    is_default: boolean;
    logo_url: string | null;
    logo_collapsed_url: string | null;
    seo: Record<string, string> | null;
    theme_colors: Record<string, string> | null;
    features: Record<string, boolean | number> | null;
    salutation: string | null;
    mail_header: string | null;
    mail_footer: string | null;
};

const defaultSeo: Record<string, string> = {
    favicon_url: '',
    meta_description: '',
    meta_robots: 'index, follow',
    theme_color: '',
    og_type: 'website',
    og_site_name: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_locale: 'de_DE',
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
    admin_domains: (props.brand.admin_domains ?? []).join('\n'),
    is_default: props.brand.is_default ?? false,
    logo_url: props.brand.logo_url ?? '',
    logo_collapsed_url: props.brand.logo_collapsed_url ?? '',
    seo: {
        ...defaultSeo,
        ...(props.brand.seo ?? {}),
    } as Record<string, string>,
    theme_colors: {
        ...defaultThemeColors,
        ...(props.brand.theme_colors ?? {}),
    } as ThemeColors,
    feature_sites_editor: props.brand.features?.sites_editor ?? true,
    feature_webspace: props.brand.features?.webspace ?? true,
    feature_domains_shop: props.brand.features?.domains_shop ?? true,
    feature_ai_tokens: props.brand.features?.ai_tokens ?? true,
    feature_gaming: props.brand.features?.gaming ?? false,
    feature_prepaid_balance: props.brand.features?.prepaid_balance ?? false,
    feature_balance_topup: props.brand.features?.balance_topup ?? false,
    feature_balance_period_months: props.brand.features?.balance_period_months ?? 1,
    salutation: props.brand.salutation ?? 'formal',
    mail_header: props.brand.mail_header ?? '',
    mail_footer: props.brand.mail_footer ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Marken', href: '/admin/settings?tab=marken' },
    { title: props.brand.name, href: '#' },
];

const submit = () => {
    form.transform((data) => ({
        name: data.name,
        domains: form.domains.split('\n').map((d) => d.trim()).filter(Boolean),
        admin_domains: form.admin_domains.split('\n').map((d) => d.trim()).filter(Boolean),
        is_default: data.is_default,
        logo_url: data.logo_url,
        logo_collapsed_url: data.logo_collapsed_url,
        seo: data.seo,
        theme_colors: data.theme_colors,
        features: {
            sites_editor: data.feature_sites_editor,
            webspace: data.feature_webspace,
            domains_shop: data.feature_domains_shop,
            ai_tokens: data.feature_ai_tokens,
            gaming: data.feature_gaming,
            prepaid_balance: data.feature_prepaid_balance,
            balance_topup: data.feature_balance_topup,
            balance_period_months: Math.max(1, Math.min(24, Number(data.feature_balance_period_months) || 1)),
        },
        salutation: data.salutation,
        mail_header: data.mail_header,
        mail_footer: data.mail_footer,
    })).put(`/admin/brands/${props.brand.id}`);
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Marke: ${props.brand.name}`" />

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <Heading level="h1">Marke bearbeiten</Heading>
                <Text class="mt-2" muted>
                    {{ props.brand.key }} – Name, Domains, Features und E-Mail-Inhalte
                </Text>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        <div class="space-y-2">
                            <Label for="admin_domains">Admin-Domains</Label>
                            <Textarea
                                id="admin_domains"
                                v-model="form.admin_domains"
                                rows="2"
                                placeholder="admin.praxishosting.de"
                                :aria-invalid="!!form.errors.admin_domains"
                            />
                            <InputError :message="form.errors.admin_domains" />
                            <p class="text-muted-foreground text-sm">Eine pro Zeile (nur Hostname, z. B. admin.neroserv.test). Beim Aufruf dieser URL gelangt man nach Login ins Admin-Panel. Die Domain muss auf dieses Projekt zeigen (z. B. in Laravel Herd unter dem Projekt als „Additional Domain“ eintragen).</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox id="is_default" v-model="form.is_default" />
                            <Label for="is_default">Als Standard-Marke (z. B. für localhost)</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Logos</CardTitle>
                        <CardDescription>Logo-URLs für Header und eingeklappte Sidebar</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="logo_url">Logo-URL</Label>
                            <Input id="logo_url" v-model="form.logo_url" placeholder="https://…" />
                            <InputError :message="form.errors.logo_url" />
                        </div>
                        <div class="space-y-2">
                            <Label for="logo_collapsed_url">Logo (eingeklappte Sidebar)</Label>
                            <Input
                                id="logo_collapsed_url"
                                v-model="form.logo_collapsed_url"
                                placeholder="URL für kleines Logo (z. B. Icon), sonst wird das normale Logo verkleinert"
                            />
                            <InputError :message="form.errors.logo_collapsed_url" />
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
                        <CardTitle>Prepaid / Guthaben</CardTitle>
                        <CardDescription>
                            Guthaben anzeigen, Selbstaufladung und Zahlung mit Guthaben im Checkout. Vertragslaufzeit bei Guthaben-Zahlung (Webspace/Game-Server).
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div class="flex items-center gap-2">
                            <Checkbox id="feat_prepaid_balance" v-model="form.feature_prepaid_balance" />
                            <Label for="feat_prepaid_balance">Prepaid: Guthaben anzeigen & mit Guthaben bezahlen</Label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox id="feat_balance_topup" v-model="form.feature_balance_topup" />
                            <Label for="feat_balance_topup">Selbstaufladung (Guthaben per Stripe aufladen)</Label>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <Label for="balance_period_months" class="shrink-0">Vertragslaufzeit bei Guthaben-Zahlung (Monate)</Label>
                            <Input
                                id="balance_period_months"
                                v-model.number="form.feature_balance_period_months"
                                type="number"
                                min="1"
                                max="24"
                                class="w-20"
                            />
                            <span class="text-muted-foreground text-sm">(1–24 Monate, z. B. 1 für monatlich)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>SEO & Vorschau</CardTitle>
                        <CardDescription>
                            Meta-Tags und Open Graph für Suchmaschinen und Social-Sharing. Canonical und og:url werden dynamisch aus der aktuellen URL gesetzt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="seo_favicon_url">Favicon-URL</Label>
                            <Input id="seo_favicon_url" v-model="form.seo.favicon_url" placeholder="https://…/favicon.ico" />
                            <InputError :message="form.errors['seo.favicon_url']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_meta_description">Meta-Beschreibung</Label>
                            <Textarea
                                id="seo_meta_description"
                                v-model="form.seo.meta_description"
                                rows="2"
                                placeholder="Kurzbeschreibung für Suchmaschinen"
                            />
                            <InputError :message="form.errors['seo.meta_description']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_meta_robots">Robots</Label>
                            <Select id="seo_meta_robots" v-model="form.seo.meta_robots">
                                <option value="index, follow">index, follow</option>
                                <option value="noindex, nofollow">noindex, nofollow</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_theme_color">Theme-Color (Browser-UI)</Label>
                            <div class="flex flex-wrap items-center gap-2">
                                <input
                                    id="seo_theme_color"
                                    v-model="form.seo.theme_color"
                                    type="color"
                                    class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <Input
                                    v-model="form.seo.theme_color"
                                    class="w-28 font-mono text-sm"
                                    placeholder="#1E1E1E"
                                />
                            </div>
                            <InputError :message="form.errors['seo.theme_color']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_og_site_name">Og:Site-Name</Label>
                            <Input id="seo_og_site_name" v-model="form.seo.og_site_name" placeholder="z. B. neroserv CDN" />
                            <InputError :message="form.errors['seo.og_site_name']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_og_title">Og:Title</Label>
                            <Input id="seo_og_title" v-model="form.seo.og_title" placeholder="Titel für Social-Sharing" />
                            <InputError :message="form.errors['seo.og_title']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_og_description">Og:Description</Label>
                            <Textarea id="seo_og_description" v-model="form.seo.og_description" rows="2" placeholder="Beschreibung für Social-Sharing" />
                            <InputError :message="form.errors['seo.og_description']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_og_image">Og:Image-URL</Label>
                            <Input id="seo_og_image" v-model="form.seo.og_image" placeholder="https://…/og.png" />
                            <InputError :message="form.errors['seo.og_image']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="seo_og_locale">Og:Locale</Label>
                            <Input id="seo_og_locale" v-model="form.seo.og_locale" placeholder="de_DE" />
                            <InputError :message="form.errors['seo.og_locale']" />
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                    <Link href="/admin/settings?tab=marken">
                        <Button type="button" variant="outline" class="ml-2">Abbrechen</Button>
                    </Link>
                </CardFooter>
            </Card>
        </form>
    </AdminLayout>
</template>
