<!-- Admin: Marke bearbeiten -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import InputError from '@/components/InputError.vue';
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
    { key: 'secondary', label: 'Sekundär' },
    { key: 'secondary_foreground', label: 'Sekundär (Schrift)' },
];

type ThemeColors = Record<string, string>;

const defaultThemeColors: ThemeColors = {
    primary: '#059669',
    primary_hover: '#047857',
    primary_light: '#ecfdf5',
    primary_dark: '#065f46',
    secondary: '#64748b',
    secondary_foreground: '#ffffff',
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
    feature_gameserver_cloud: props.brand.features?.gameserver_cloud ?? false,
    feature_teamspeak: props.brand.features?.teamspeak ?? false,
    feature_discord_notifications: props.brand.features?.discord_notifications ?? false,
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
            gameserver_cloud: data.feature_gameserver_cloud,
            teamspeak: data.feature_teamspeak,
            discord_notifications: data.feature_discord_notifications,
            prepaid_balance: data.feature_prepaid_balance,
            balance_topup: data.feature_balance_topup,
            balance_period_months: Math.max(1, Math.min(24, Number(data.feature_balance_period_months) || 1)),
        },
        salutation: data.salutation,
        mail_header: data.mail_header,
        mail_footer: data.mail_footer,
    })).put(`/admin/brands/${props.brand.id}`);
};

const seoRobotsOptions = [
    { value: 'index, follow', text: 'index, follow' },
    { value: 'noindex, nofollow', text: 'noindex, nofollow' },
];

const salutationOptions = [
    { value: 'formal', text: 'Formell (Sie)' },
    { value: 'informal', text: 'Informell (Du)' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Marke: ${props.brand.name}`" />

        <BForm @submit.prevent="submit">
            <BRow>
                <BCol cols="12">
                    <div class="mb-3">
                        <h4 class="mb-1">Marke bearbeiten</h4>
                        <p class="text-muted small mb-0">
                            {{ props.brand.key }} – Name, Domains, Features und E-Mail-Inhalte
                        </p>
                    </div>
                </BCol>
            </BRow>

            <BRow>
                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Allgemein</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Name und Domains (eine pro Zeile)</p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput id="name" v-model="form.name" :aria-invalid="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Domains" label-for="domains">
                                <BFormTextarea
                                    id="domains"
                                    v-model="form.domains"
                                    rows="3"
                                    placeholder="b2b.praxishosting.de&#10;localhost"
                                    :aria-invalid="!!form.errors.domains"
                                />
                                <InputError :message="form.errors.domains" />
                            </BFormGroup>
                            <BFormGroup label="Admin-Domains" label-for="admin_domains">
                                <BFormTextarea
                                    id="admin_domains"
                                    v-model="form.admin_domains"
                                    rows="2"
                                    placeholder="admin.praxishosting.de"
                                    :aria-invalid="!!form.errors.admin_domains"
                                />
                                <InputError :message="form.errors.admin_domains" />
                                <p class="text-muted small mb-0 mt-1">
                                    Eine pro Zeile (nur Hostname, z. B. admin.neroserv.test). Beim Aufruf dieser URL
                                    gelangt man nach Login ins Admin-Panel. Die Domain muss auf dieses Projekt zeigen.
                                </p>
                            </BFormGroup>
                            <BFormGroup>
                                <BFormCheckbox id="is_default" v-model="form.is_default">
                                    Als Standard-Marke (z. B. für localhost)
                                </BFormCheckbox>
                            </BFormGroup>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Logos</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Logo-URLs für Header und eingeklappte Sidebar</p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup label="Logo-URL" label-for="logo_url">
                                <BFormInput id="logo_url" v-model="form.logo_url" placeholder="https://…" />
                                <InputError :message="form.errors.logo_url" />
                            </BFormGroup>
                            <BFormGroup label="Logo (eingeklappte Sidebar)" label-for="logo_collapsed_url">
                                <BFormInput
                                    id="logo_collapsed_url"
                                    v-model="form.logo_collapsed_url"
                                    placeholder="URL für kleines Logo (z. B. Icon), sonst wird das normale Logo verkleinert"
                                />
                                <InputError :message="form.errors.logo_collapsed_url" />
                            </BFormGroup>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Theme-Farben</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Farben fürs Kunden-Panel (CSS-Variablen wie --primary)
                            </p>
                        </BCardHeader>
                        <BCardBody>
                            <div
                                v-for="item in THEME_COLOR_KEYS"
                                :key="item.key"
                                class="d-flex flex-wrap align-items-center gap-2 mb-3"
                            >
                                <label :for="`theme-${item.key}`" class="form-label mb-0 text-nowrap" style="min-width: 8rem">
                                    {{ item.label }}
                                </label>
                                <input
                                    :id="`theme-${item.key}`"
                                    v-model="form.theme_colors[item.key]"
                                    type="color"
                                    class="form-control form-control-color p-1"
                                    style="width: 3rem; height: 2.25rem"
                                    :aria-invalid="!!form.errors['theme_colors.' + item.key]"
                                />
                                <BFormInput
                                    v-model="form.theme_colors[item.key]"
                                    class="font-monospace small"
                                    style="max-width: 8rem"
                                    placeholder="#000000"
                                />
                            </div>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Features</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Welche Produkte in diesem Portal sichtbar sind – aktivieren oder deaktivieren
                            </p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_sites" v-model="form.feature_sites_editor">
                                    Webseiten-Editor (Meine Sites)
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_webspace" v-model="form.feature_webspace">
                                    Webspace
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_domains" v-model="form.feature_domains_shop">
                                    Domains-Shop
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_ai" v-model="form.feature_ai_tokens">
                                    AI-Tokens
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_gaming" v-model="form.feature_gaming">
                                    Gaming (Game-Server / Pterodactyl)
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_gameserver_cloud" v-model="form.feature_gameserver_cloud">
                                    Gameserver Cloud
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_teamspeak" v-model="form.feature_teamspeak">
                                    TeamSpeak (TeamSpeak-Server mieten)
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_discord_notifications" v-model="form.feature_discord_notifications">
                                    Discord-Benachrichtigungen (E-Mail-Vorlagen optional per Discord-DM)
                                </BFormCheckbox>
                            </BFormGroup>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Prepaid / Guthaben</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Guthaben anzeigen, Selbstaufladung und Zahlung mit Guthaben im Checkout. Vertragslaufzeit
                                bei Guthaben-Zahlung (Webspace/Game-Server).
                            </p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_prepaid_balance" v-model="form.feature_prepaid_balance">
                                    Prepaid: Guthaben anzeigen & mit Guthaben bezahlen
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup class="mb-2">
                                <BFormCheckbox id="feat_balance_topup" v-model="form.feature_balance_topup">
                                    Selbstaufladung (Guthaben per Mollie aufladen)
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup label="Vertragslaufzeit bei Guthaben-Zahlung (Monate)" label-for="balance_period_months">
                                <BFormInput
                                    id="balance_period_months"
                                    v-model.number="form.feature_balance_period_months"
                                    type="number"
                                    min="1"
                                    max="24"
                                    class="form-control w-auto"
                                    style="max-width: 5rem"
                                />
                                <p class="text-muted small mb-0 mt-1">1–24 Monate, z. B. 1 für monatlich</p>
                            </BFormGroup>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol lg="6" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">SEO & Vorschau</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Meta-Tags und Open Graph für Suchmaschinen und Social-Sharing.
                            </p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup label="Favicon-URL" label-for="seo_favicon_url">
                                <BFormInput
                                    id="seo_favicon_url"
                                    v-model="form.seo.favicon_url"
                                    placeholder="https://…/favicon.ico"
                                />
                                <InputError :message="form.errors['seo.favicon_url']" />
                            </BFormGroup>
                            <BFormGroup label="Meta-Beschreibung" label-for="seo_meta_description">
                                <BFormTextarea
                                    id="seo_meta_description"
                                    v-model="form.seo.meta_description"
                                    rows="2"
                                    placeholder="Kurzbeschreibung für Suchmaschinen"
                                />
                                <InputError :message="form.errors['seo.meta_description']" />
                            </BFormGroup>
                            <BFormGroup label="Robots" label-for="seo_meta_robots">
                                <BFormSelect
                                    id="seo_meta_robots"
                                    v-model="form.seo.meta_robots"
                                    :options="seoRobotsOptions"
                                />
                            </BFormGroup>
                            <BFormGroup label="Theme-Color (Browser-UI)" label-for="seo_theme_color">
                                <div class="d-flex flex-wrap align-items-center gap-2">
                                    <input
                                        id="seo_theme_color"
                                        v-model="form.seo.theme_color"
                                        type="color"
                                        class="form-control form-control-color p-1"
                                        style="width: 3rem; height: 2.25rem"
                                    />
                                    <BFormInput
                                        v-model="form.seo.theme_color"
                                        class="font-monospace small"
                                        style="max-width: 8rem"
                                        placeholder="#1E1E1E"
                                    />
                                </div>
                                <InputError :message="form.errors['seo.theme_color']" />
                            </BFormGroup>
                            <BFormGroup label="Og:Site-Name" label-for="seo_og_site_name">
                                <BFormInput
                                    id="seo_og_site_name"
                                    v-model="form.seo.og_site_name"
                                    placeholder="z. B. neroserv CDN"
                                />
                                <InputError :message="form.errors['seo.og_site_name']" />
                            </BFormGroup>
                            <BFormGroup label="Og:Title" label-for="seo_og_title">
                                <BFormInput
                                    id="seo_og_title"
                                    v-model="form.seo.og_title"
                                    placeholder="Titel für Social-Sharing"
                                />
                                <InputError :message="form.errors['seo.og_title']" />
                            </BFormGroup>
                            <BFormGroup label="Og:Description" label-for="seo_og_description">
                                <BFormTextarea
                                    id="seo_og_description"
                                    v-model="form.seo.og_description"
                                    rows="2"
                                    placeholder="Beschreibung für Social-Sharing"
                                />
                                <InputError :message="form.errors['seo.og_description']" />
                            </BFormGroup>
                            <BFormGroup label="Og:Image-URL" label-for="seo_og_image">
                                <BFormInput
                                    id="seo_og_image"
                                    v-model="form.seo.og_image"
                                    placeholder="https://…/og.png"
                                />
                                <InputError :message="form.errors['seo.og_image']" />
                            </BFormGroup>
                            <BFormGroup label="Og:Locale" label-for="seo_og_locale">
                                <BFormInput id="seo_og_locale" v-model="form.seo.og_locale" placeholder="de_DE" />
                                <InputError :message="form.errors['seo.og_locale']" />
                            </BFormGroup>
                        </BCardBody>
                    </BCard>
                </BCol>

                <BCol cols="12" class="mb-4">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Anrede & E-Mail</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Für E-Mails an Kunden dieser Marke</p>
                        </BCardHeader>
                        <BCardBody>
                            <BRow>
                                <BCol md="4">
                                    <BFormGroup label="Anrede" label-for="salutation">
                                        <BFormSelect
                                            id="salutation"
                                            v-model="form.salutation"
                                            :options="salutationOptions"
                                        />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup label="E-Mail-Header (HTML)" label-for="mail_header">
                                <BFormTextarea id="mail_header" v-model="form.mail_header" rows="2" />
                            </BFormGroup>
                            <BFormGroup label="E-Mail-Footer (HTML oder Text)" label-for="mail_footer">
                                <BFormTextarea id="mail_footer" v-model="form.mail_footer" rows="2" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                Speichern
                            </BButton>
                            <Link href="/admin/settings?tab=marken">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BCard>
                </BCol>
            </BRow>
        </BForm>
    </AdminLayout>
</template>
