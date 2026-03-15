<!-- Admin: System-Einstellungen -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
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
    BBadge,
    BTable,
    BNav,
    BNavItem,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { countriesSortedByName } from '@/lib/countries';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type TicketCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

type TicketPriority = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
    is_active: boolean;
};

type Brand = {
    id: number;
    key: string;
    name: string;
    is_default: boolean;
    domains: string[] | null;
    logo_url: string | null;
    logo_collapsed_url: string | null;
    theme_colors: Record<string, string> | null;
    features: Record<string, boolean | number> | null;
    salutation: string | null;
    seo: Record<string, string> | null;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type TicketMessageTemplate = {
    id: number;
    name: string;
    body: string | null;
    sort_order: number;
};

type Props = {
    settings: {
        app_name: string;
        billing_grace_period_days: string;
        pin_max_attempts: string;
        pin_lockout_minutes: string;
        inactivity_lock_default_minutes: string;
        invoice_ustg_19_text: string;
        invoice_company_name: string;
        invoice_company_street: string;
        invoice_company_postal_code: string;
        invoice_company_city: string;
        invoice_company_country: string;
        invoice_company_vat_id: string;
        invoice_company_logo: string;
        mail_from_name: string;
        mail_from_address: string;
        mail_reply_to_address: string;
        dunning_fee_level_1: string;
        dunning_fee_level_2: string;
        dunning_fee_level_3: string;
        domains_base_domain: string;
        main_app_hosts: string;
        support_enabled: boolean;
        support_max_open_tickets_per_user: string;
    };
    brands: Brand[];
    ticketCategories: { data: TicketCategory[]; links: PaginationLink[] };
    ticketPriorities: { data: TicketPriority[]; links: PaginationLink[] };
    ticketMessageTemplates: TicketMessageTemplate[];
    initialTab: string;
};

const props = defineProps<Props>();

const validTabs = ['allgemein', 'sicherheit', 'rechnung', 'mahnung', 'domains', 'mail', 'support', 'vorlagen', 'marken'];
const activeTab = ref(validTabs.includes(props.initialTab) ? props.initialTab : 'allgemein');

const form = useForm({
    app_name: props.settings.app_name,
    billing_grace_period_days: props.settings.billing_grace_period_days,
    pin_max_attempts: props.settings.pin_max_attempts,
    pin_lockout_minutes: props.settings.pin_lockout_minutes,
    inactivity_lock_default_minutes: props.settings.inactivity_lock_default_minutes,
    invoice_ustg_19_text: props.settings.invoice_ustg_19_text,
    invoice_company_name: props.settings.invoice_company_name,
    invoice_company_street: props.settings.invoice_company_street,
    invoice_company_postal_code: props.settings.invoice_company_postal_code,
    invoice_company_city: props.settings.invoice_company_city,
    invoice_company_country: props.settings.invoice_company_country,
    invoice_company_vat_id: props.settings.invoice_company_vat_id,
    invoice_company_logo: props.settings.invoice_company_logo,
    mail_from_name: props.settings.mail_from_name,
    mail_from_address: props.settings.mail_from_address,
    mail_reply_to_address: props.settings.mail_reply_to_address,
    dunning_fee_level_1: props.settings.dunning_fee_level_1,
    dunning_fee_level_2: props.settings.dunning_fee_level_2,
    dunning_fee_level_3: props.settings.dunning_fee_level_3,
    domains_base_domain: props.settings.domains_base_domain ?? '',
    main_app_hosts: props.settings.main_app_hosts ?? '',
    support_enabled: props.settings.support_enabled ?? true,
    support_max_open_tickets_per_user: props.settings.support_max_open_tickets_per_user ?? '0',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '#' },
];

function destroyCategory(id: number) {
    if (confirm('Kategorie wirklich löschen?')) {
        router.delete(`/admin/ticket-categories/${id}`);
    }
}

function destroyPriority(id: number) {
    if (confirm('Priorität wirklich löschen?')) {
        router.delete(`/admin/ticket-priorities/${id}`);
    }
}

function destroyTemplate(id: number) {
    if (confirm('Vorlage wirklich löschen?')) {
        router.delete(`/admin/ticket-message-templates/${id}`);
    }
}

function stripHtml(html: string | null): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.trim().slice(0, 80) ?? '';
}

const countryOptions = computed(() => [
    { value: '', text: 'Bitte wählen' },
    ...countriesSortedByName.map((c) => ({ value: c.code, text: c.name })),
]);

const ticketCategoryFields = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'sort_order', label: 'Sortierung' },
    { key: 'is_active', label: 'Aktiv' },
    { key: 'actions', label: '', tdClass: 'text-end' },
];

const ticketPriorityFields = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'color', label: 'Farbe' },
    { key: 'sort_order', label: 'Sortierung' },
    { key: 'is_active', label: 'Aktiv' },
    { key: 'actions', label: '', tdClass: 'text-end' },
];

const templateFields = [
    { key: 'name', label: 'Name' },
    { key: 'body', label: 'Vorschau' },
    { key: 'sort_order', label: 'Sortierung' },
    { key: 'actions', label: '', tdClass: 'text-end' },
];

function paginationClick(url: string) {
    if (url) window.location.href = url;
}

function firstDomains(domains: string[] | null, max = 2): string[] {
    if (!domains?.length) return [];
    return domains.slice(0, max);
}

function primaryColor(brand: Brand): string {
    return (
        brand.theme_colors?.primary ??
        brand.seo?.theme_color ??
        'var(--primary, #059669)'
    );
}

const FEATURE_LABELS: Record<string, string> = {
    sites_editor: 'Sites',
    webspace: 'Webspace',
    domains_shop: 'Domains',
    ai_tokens: 'AI',
    gaming: 'Gaming',
    prepaid_balance: 'Guthaben',
    balance_topup: 'Aufladung',
};

function activeFeatures(features: Record<string, boolean | number> | null): string[] {
    if (!features) return [];
    return Object.entries(FEATURE_LABELS)
        .filter(([key]) => features[key] === true)
        .map(([, label]) => label);
}

function salutationLabel(salutation: string | null): string {
    return salutation === 'informal' ? 'Du' : 'Sie';
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="System-Einstellungen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">System-Einstellungen</h4>
                    <p class="text-muted small mb-0">
                        Kulanzfrist, Rechnungssteller, Rechnungstexte (§ 19 UStG), Mail-Absender
                    </p>
                </div>

                <BForm @submit.prevent="form.put('/admin/settings')">
                    <BNav tabs class="mb-4 flex-wrap">
                        <BNavItem :active="activeTab === 'allgemein'" @click="activeTab = 'allgemein'">Allgemein</BNavItem>
                        <BNavItem :active="activeTab === 'sicherheit'" @click="activeTab = 'sicherheit'">Sicherheit</BNavItem>
                        <BNavItem :active="activeTab === 'rechnung'" @click="activeTab = 'rechnung'">Rechnung</BNavItem>
                        <BNavItem :active="activeTab === 'mahnung'" @click="activeTab = 'mahnung'">Mahnung</BNavItem>
                        <BNavItem :active="activeTab === 'domains'" @click="activeTab = 'domains'">Domains</BNavItem>
                        <BNavItem :active="activeTab === 'mail'" @click="activeTab = 'mail'">Mail</BNavItem>
                        <BNavItem :active="activeTab === 'support'" @click="activeTab = 'support'">Support</BNavItem>
                        <BNavItem :active="activeTab === 'vorlagen'" @click="activeTab = 'vorlagen'">Vorlagen</BNavItem>
                        <BNavItem :active="activeTab === 'marken'" @click="activeTab = 'marken'">Marken</BNavItem>
                    </BNav>

                    <div v-show="activeTab === 'allgemein'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Allgemein</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Anzeigename der Anwendung, Abo-Logik und Kulanzfrist</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup label="Anzeigename der Anwendung" label-for="app_name">
                                    <BFormInput
                                        id="app_name"
                                        v-model="form.app_name"
                                        placeholder="z. B. Praxishosting"
                                        :aria-invalid="!!form.errors.app_name"
                                    />
                                    <InputError :message="form.errors.app_name" />
                                    <p class="text-muted small mb-0 mt-1">Leer = Wert aus Konfiguration (APP_NAME). Wird in Header, E-Mails usw. verwendet.</p>
                                </BFormGroup>
                                <BFormGroup label="Kulanzfrist (Tage)" label-for="billing_grace_period_days">
                                    <BFormInput
                                        id="billing_grace_period_days"
                                        v-model="form.billing_grace_period_days"
                                        type="number"
                                        min="1"
                                        max="365"
                                        :aria-invalid="!!form.errors.billing_grace_period_days"
                                    />
                                    <InputError :message="form.errors.billing_grace_period_days" />
                                    <p class="text-muted small mb-0 mt-1">Tage nach Abo-Ende, bis die Site endgültig gelöscht wird (davor: gesperrt).</p>
                                </BFormGroup>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'sicherheit'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Sicherheit</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">PIN-Sperre und Standard für Auto-Sperre nach Inaktivität</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup label="PIN – maximale Versuche" label-for="pin_max_attempts">
                                    <BFormInput
                                        id="pin_max_attempts"
                                        v-model="form.pin_max_attempts"
                                        type="number"
                                        min="1"
                                        max="20"
                                        :aria-invalid="!!form.errors.pin_max_attempts"
                                    />
                                    <InputError :message="form.errors.pin_max_attempts" />
                                    <p class="text-muted small mb-0 mt-1">Anzahl falscher PIN-Eingaben bis zur Sperre.</p>
                                </BFormGroup>
                                <BFormGroup label="PIN – Sperrdauer (Minuten)" label-for="pin_lockout_minutes">
                                    <BFormInput
                                        id="pin_lockout_minutes"
                                        v-model="form.pin_lockout_minutes"
                                        type="number"
                                        min="1"
                                        max="120"
                                        :aria-invalid="!!form.errors.pin_lockout_minutes"
                                    />
                                    <InputError :message="form.errors.pin_lockout_minutes" />
                                    <p class="text-muted small mb-0 mt-1">Dauer der Sperre nach zu vielen Fehlversuchen.</p>
                                </BFormGroup>
                                <BFormGroup label="Inaktivität – Standard (Minuten)" label-for="inactivity_lock_default_minutes">
                                    <BFormInput
                                        id="inactivity_lock_default_minutes"
                                        v-model="form.inactivity_lock_default_minutes"
                                        type="number"
                                        min="0"
                                        max="1440"
                                        :aria-invalid="!!form.errors.inactivity_lock_default_minutes"
                                    />
                                    <InputError :message="form.errors.inactivity_lock_default_minutes" />
                                    <p class="text-muted small mb-0 mt-1">Standardwert für „Auto-Sperre nach Inaktivität“ (0 = deaktiviert). Nutzer können unter Einstellungen abweichen.</p>
                                </BFormGroup>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'rechnung'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Rechnung</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Rechnungssteller und § 19 UStG-Text für PDF/E-Rechnung</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup label="§ 19 UStG-Text (Rechnung)" label-for="invoice_ustg_19_text">
                                    <BFormTextarea
                                        id="invoice_ustg_19_text"
                                        v-model="form.invoice_ustg_19_text"
                                        rows="3"
                                        :aria-invalid="!!form.errors.invoice_ustg_19_text"
                                    />
                                    <InputError :message="form.errors.invoice_ustg_19_text" />
                                </BFormGroup>
                                <hr class="my-4" />
                                <h5 class="mb-3">Rechnungssteller</h5>
                                <BRow>
                                    <BCol cols="12">
                                        <BFormGroup label="Firmenlogo (URL oder Pfad)" label-for="invoice_company_logo">
                                            <BFormInput
                                                id="invoice_company_logo"
                                                v-model="form.invoice_company_logo"
                                                placeholder="https://… oder invoices/logo.png"
                                                :aria-invalid="!!form.errors.invoice_company_logo"
                                            />
                                            <InputError :message="form.errors.invoice_company_logo" />
                                            <p class="text-muted small mb-0 mt-1">Vollständige URL oder Pfad unter storage/app/public (z. B. invoices/logo.png).</p>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol cols="12">
                                        <BFormGroup label="Firma / Name" label-for="invoice_company_name">
                                            <BFormInput
                                                id="invoice_company_name"
                                                v-model="form.invoice_company_name"
                                                :aria-invalid="!!form.errors.invoice_company_name"
                                            />
                                            <InputError :message="form.errors.invoice_company_name" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol cols="12">
                                        <BFormGroup label="Straße, Hausnummer" label-for="invoice_company_street">
                                            <BFormInput
                                                id="invoice_company_street"
                                                v-model="form.invoice_company_street"
                                                :aria-invalid="!!form.errors.invoice_company_street"
                                            />
                                            <InputError :message="form.errors.invoice_company_street" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="PLZ" label-for="invoice_company_postal_code">
                                            <BFormInput
                                                id="invoice_company_postal_code"
                                                v-model="form.invoice_company_postal_code"
                                                :aria-invalid="!!form.errors.invoice_company_postal_code"
                                            />
                                            <InputError :message="form.errors.invoice_company_postal_code" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Ort" label-for="invoice_company_city">
                                            <BFormInput
                                                id="invoice_company_city"
                                                v-model="form.invoice_company_city"
                                                :aria-invalid="!!form.errors.invoice_company_city"
                                            />
                                            <InputError :message="form.errors.invoice_company_city" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Land" label-for="invoice_company_country">
                                            <BFormSelect
                                                id="invoice_company_country"
                                                v-model="form.invoice_company_country"
                                                :options="countryOptions"
                                                :aria-invalid="!!form.errors.invoice_company_country"
                                            />
                                            <InputError :message="form.errors.invoice_company_country" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="USt-IdNr." label-for="invoice_company_vat_id">
                                            <BFormInput
                                                id="invoice_company_vat_id"
                                                v-model="form.invoice_company_vat_id"
                                                placeholder="DE123456789"
                                                :aria-invalid="!!form.errors.invoice_company_vat_id"
                                            />
                                            <InputError :message="form.errors.invoice_company_vat_id" />
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'mahnung'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Mahnung</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Mahngebühren in Euro für 1., 2. und 3. Mahnung</p>
                            </BCardHeader>
                            <BCardBody>
                                <BRow>
                                    <BCol md="4">
                                        <BFormGroup label="1. Mahnung (€)" label-for="dunning_fee_level_1">
                                            <BFormInput
                                                id="dunning_fee_level_1"
                                                v-model="form.dunning_fee_level_1"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                :aria-invalid="!!form.errors.dunning_fee_level_1"
                                            />
                                            <InputError :message="form.errors.dunning_fee_level_1" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="4">
                                        <BFormGroup label="2. Mahnung (€)" label-for="dunning_fee_level_2">
                                            <BFormInput
                                                id="dunning_fee_level_2"
                                                v-model="form.dunning_fee_level_2"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                :aria-invalid="!!form.errors.dunning_fee_level_2"
                                            />
                                            <InputError :message="form.errors.dunning_fee_level_2" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="4">
                                        <BFormGroup label="3. Mahnung (€)" label-for="dunning_fee_level_3">
                                            <BFormInput
                                                id="dunning_fee_level_3"
                                                v-model="form.dunning_fee_level_3"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                :aria-invalid="!!form.errors.dunning_fee_level_3"
                                            />
                                            <InputError :message="form.errors.dunning_fee_level_3" />
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'domains'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Domains</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Basis-Domain für CNAME, Hosts der Haupt-App (Dashboard)</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup label="Basis-Domain" label-for="domains_base_domain">
                                    <BFormInput
                                        id="domains_base_domain"
                                        v-model="form.domains_base_domain"
                                        placeholder="z. B. praxishosting.abrendt.de"
                                        :aria-invalid="!!form.errors.domains_base_domain"
                                    />
                                    <InputError :message="form.errors.domains_base_domain" />
                                    <p class="text-muted small mb-0 mt-1">Domain, auf die Custom-Domains per CNAME zeigen. Leer = Wert aus Konfiguration.</p>
                                </BFormGroup>
                                <BFormGroup label="Haupt-App-Hosts (kommagetrennt)" label-for="main_app_hosts">
                                    <BFormInput
                                        id="main_app_hosts"
                                        v-model="form.main_app_hosts"
                                        placeholder="z. B. app.example.com, localhost"
                                        :aria-invalid="!!form.errors.main_app_hosts"
                                    />
                                    <InputError :message="form.errors.main_app_hosts" />
                                    <p class="text-muted small mb-0 mt-1">Hosts, unter denen die Haupt-App (Dashboard, Login) läuft. Alle anderen Hosts = Site-Render. Leer = Wert aus Konfiguration.</p>
                                </BFormGroup>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'support'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Support / Tickets</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Support-Ticket-System aktivieren und Limits</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup>
                                    <BFormCheckbox
                                        id="support_enabled"
                                        v-model="form.support_enabled"
                                        switch
                                    >
                                        Support-Tickets aktiviert
                                    </BFormCheckbox>
                                    <p class="text-muted small mb-2">Wenn deaktiviert, können Kunden keine neuen Tickets erstellen.</p>
                                </BFormGroup>
                                <BFormGroup label="Max. offene Tickets pro Kunde (0 = unbegrenzt)" label-for="support_max_open_tickets_per_user">
                                    <BFormInput
                                        id="support_max_open_tickets_per_user"
                                        v-model="form.support_max_open_tickets_per_user"
                                        type="number"
                                        min="0"
                                        max="100"
                                        :aria-invalid="!!form.errors.support_max_open_tickets_per_user"
                                    />
                                    <InputError :message="form.errors.support_max_open_tickets_per_user" />
                                </BFormGroup>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                        <BCard no-body class="mb-4">
                            <BCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div>
                                    <BCardTitle class="mb-0">Ticket-Kategorien</BCardTitle>
                                    <p class="text-muted small mb-0 mt-1">Kategorien für Support-Tickets</p>
                                </div>
                                <Link href="/admin/ticket-categories/create" class="btn btn-sm btn-outline-primary">
                                    <Icon name="plus" class="me-2" />Neu
                                </Link>
                            </BCardHeader>
                            <BCardBody>
                                <BTable :items="ticketCategories.data" :fields="ticketCategoryFields" responsive show-empty empty-text="Keine Kategorien">
                                    <template #cell(slug)="{ item }">
                                        <code class="text-sm">{{ item.slug }}</code>
                                    </template>
                                    <template #cell(is_active)="{ item }">
                                        <BBadge :variant="item.is_active ? 'success' : 'secondary'">{{ item.is_active ? 'Ja' : 'Nein' }}</BBadge>
                                    </template>
                                    <template #cell(actions)="{ item }">
                                        <Link :href="`/admin/ticket-categories/${item.id}/edit`" class="btn btn-sm btn-link p-0 me-2">
                                            <Icon name="edit" />
                                        </Link>
                                        <BButton variant="link" size="sm" class="text-danger p-0" @click="destroyCategory(item.id)">
                                            <Icon name="trash-2" />
                                        </BButton>
                                    </template>
                                </BTable>
                                <nav v-if="ticketCategories.links.length > 3" class="d-flex justify-content-center mt-2">
                                    <ul class="pagination pagination-sm mb-0">
                                        <li v-for="(link, i) in ticketCategories.links" :key="i" class="page-item" :class="{ active: link.active, disabled: !link.url }">
                                            <a class="page-link" href="#" :aria-disabled="!link.url" @click.prevent="link.url && paginationClick(link.url)">
                                                <span v-html="link.label" />
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </BCardBody>
                        </BCard>
                        <BCard no-body class="mb-4">
                            <BCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div>
                                    <BCardTitle class="mb-0">Ticket-Prioritäten</BCardTitle>
                                    <p class="text-muted small mb-0 mt-1">Prioritäten für Support-Tickets</p>
                                </div>
                                <Link href="/admin/ticket-priorities/create" class="btn btn-sm btn-outline-primary">
                                    <Icon name="plus" class="me-2" />Neu
                                </Link>
                            </BCardHeader>
                            <BCardBody>
                                <BTable :items="ticketPriorities.data" :fields="ticketPriorityFields" responsive show-empty empty-text="Keine Prioritäten">
                                    <template #cell(slug)="{ item }">
                                        <code class="text-sm">{{ item.slug }}</code>
                                    </template>
                                    <template #cell(color)="{ item }">
                                        <BBadge v-if="item.color" :style="{ backgroundColor: item.color, color: '#fff', border: 'none' }">{{ item.color }}</BBadge>
                                        <span v-else>–</span>
                                    </template>
                                    <template #cell(is_active)="{ item }">
                                        <BBadge :variant="item.is_active ? 'success' : 'secondary'">{{ item.is_active ? 'Ja' : 'Nein' }}</BBadge>
                                    </template>
                                    <template #cell(actions)="{ item }">
                                        <Link :href="`/admin/ticket-priorities/${item.id}/edit`" class="btn btn-sm btn-link p-0 me-2">
                                            <Icon name="edit" />
                                        </Link>
                                        <BButton variant="link" size="sm" class="text-danger p-0" @click="destroyPriority(item.id)">
                                            <Icon name="trash-2" />
                                        </BButton>
                                    </template>
                                </BTable>
                                <nav v-if="ticketPriorities.links.length > 3" class="d-flex justify-content-center mt-2">
                                    <ul class="pagination pagination-sm mb-0">
                                        <li v-for="(link, i) in ticketPriorities.links" :key="i" class="page-item" :class="{ active: link.active, disabled: !link.url }">
                                            <a class="page-link" href="#" :aria-disabled="!link.url" @click.prevent="link.url && paginationClick(link.url)">
                                                <span v-html="link.label" />
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </BCardBody>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'vorlagen'">
                        <BCard no-body class="mb-4">
                            <BCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div>
                                    <BCardTitle class="mb-0">Antwort-Vorlagen</BCardTitle>
                                    <p class="text-muted small mb-0 mt-1">
                                        Vorlagen für Ticket-Antworten. Platzhalter:
                                        <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>.
                                    </p>
                                </div>
                                <Link href="/admin/ticket-message-templates/create" class="btn btn-sm btn-outline-primary">
                                    <Icon name="plus" class="me-2" />Neu
                                </Link>
                            </BCardHeader>
                            <BCardBody>
                                <BTable :items="ticketMessageTemplates" :fields="templateFields" responsive show-empty empty-text="Keine Vorlagen">
                                    <template #cell(body)="{ item }">
                                        <span class="text-muted text-truncate d-inline-block" style="max-width: 300px">{{ stripHtml(item.body) || '–' }}</span>
                                    </template>
                                    <template #cell(actions)="{ item }">
                                        <Link :href="`/admin/ticket-message-templates/${item.id}/edit`" class="btn btn-sm btn-link p-0 me-2">
                                            <Icon name="edit" />
                                        </Link>
                                        <BButton variant="link" size="sm" class="text-danger p-0" @click="destroyTemplate(item.id)">
                                            <Icon name="trash-2" />
                                        </BButton>
                                    </template>
                                </BTable>
                            </BCardBody>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'mail'">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Mail</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Absender für System-E-Mails</p>
                            </BCardHeader>
                            <BCardBody>
                                <BFormGroup label="Mail-Absender Name" label-for="mail_from_name">
                                    <BFormInput
                                        id="mail_from_name"
                                        v-model="form.mail_from_name"
                                        :aria-invalid="!!form.errors.mail_from_name"
                                    />
                                    <InputError :message="form.errors.mail_from_name" />
                                </BFormGroup>
                                <BFormGroup label="Mail-Absender E-Mail" label-for="mail_from_address">
                                    <BFormInput
                                        id="mail_from_address"
                                        v-model="form.mail_from_address"
                                        type="email"
                                        :aria-invalid="!!form.errors.mail_from_address"
                                    />
                                    <InputError :message="form.errors.mail_from_address" />
                                </BFormGroup>
                                <BFormGroup label="Reply-To Adresse (optional)" label-for="mail_reply_to_address">
                                    <BFormInput
                                        id="mail_reply_to_address"
                                        v-model="form.mail_reply_to_address"
                                        type="email"
                                        placeholder="z. B. support@example.com"
                                        :aria-invalid="!!form.errors.mail_reply_to_address"
                                    />
                                    <InputError :message="form.errors.mail_reply_to_address" />
                                    <p class="text-muted small mb-0 mt-1">Falls gesetzt, wird bei allen System-E-Mails diese Adresse als Reply-To gesetzt.</p>
                                </BFormGroup>
                            </BCardBody>
                            <BCardFooter>
                                <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            </BCardFooter>
                        </BCard>
                    </div>

                    <div v-show="activeTab === 'marken'">
                        <BRow>
                            <BCol v-for="brand in brands" :key="brand.id" md="6" class="mb-4">
                                <Link
                                    :href="`/admin/brands/${brand.id}/edit`"
                                    class="text-decoration-none text-body d-block h-100"
                                >
                                    <BCard
                                        no-body
                                        class="h-100 overflow-hidden border-2 transition-colors hover-border-primary"
                                        :style="{ borderLeftColor: primaryColor(brand), borderLeftWidth: '4px' }"
                                    >
                                        <div class="d-flex flex-column flex-sm-row">
                                            <div
                                                class="d-flex shrink-0 align-items-center justify-content-center p-4 flex-sm-column"
                                                :style="{ backgroundColor: `${primaryColor(brand)}18`, minWidth: '8rem' }"
                                            >
                                                <img
                                                    v-if="brand.logo_url || brand.logo_collapsed_url"
                                                    :src="brand.logo_url || brand.logo_collapsed_url!"
                                                    :alt="brand.name"
                                                    class="img-fluid"
                                                    style="max-height: 5rem; width: auto"
                                                    loading="lazy"
                                                />
                                                <div
                                                    v-else
                                                    class="rounded d-flex align-items-center justify-content-center text-white"
                                                    :style="{ backgroundColor: primaryColor(brand), width: '4rem', height: '4rem' }"
                                                >
                                                    <Icon name="building-2" size="24" />
                                                </div>
                                                <div class="mt-2 d-flex gap-1" :title="primaryColor(brand)">
                                                    <span
                                                        class="rounded-circle border border-secondary"
                                                        style="width: 1rem; height: 1rem"
                                                        :style="{ backgroundColor: primaryColor(brand) }"
                                                    />
                                                    <span
                                                        v-if="brand.theme_colors?.primary_hover"
                                                        class="rounded-circle border border-secondary"
                                                        style="width: 1rem; height: 1rem"
                                                        :style="{ backgroundColor: brand.theme_colors.primary_hover }"
                                                    />
                                                </div>
                                            </div>
                                            <div class="card-body d-flex flex-column">
                                                <div class="d-flex flex-wrap align-items-center gap-2">
                                                    <span class="h5 mb-0">{{ brand.name }}</span>
                                                    <BBadge v-if="brand.is_default" variant="secondary">Standard</BBadge>
                                                </div>
                                                <p class="text-muted small mb-1">{{ brand.key }}</p>
                                                <div v-if="firstDomains(brand.domains).length" class="small text-muted d-flex align-items-center gap-1 flex-wrap">
                                                    <Icon name="globe" size="14" />
                                                    <span>{{ firstDomains(brand.domains).join(', ') }}</span>
                                                    <span v-if="brand.domains && brand.domains.length > 2">(+{{ brand.domains.length - 2 }} weitere)</span>
                                                </div>
                                                <div class="small text-muted d-flex align-items-center gap-1 mt-1">
                                                    <Icon name="mail" size="14" />
                                                    Anrede: {{ salutationLabel(brand.salutation) }}
                                                </div>
                                                <div v-if="activeFeatures(brand.features).length" class="d-flex flex-wrap gap-1 mt-2">
                                                    <BBadge v-for="label in activeFeatures(brand.features)" :key="label" variant="light" class="text-muted">
                                                        {{ label }}
                                                    </BBadge>
                                                </div>
                                                <div class="mt-auto pt-3">
                                                    <BButton variant="outline-primary" size="sm">
                                                        <Icon name="edit" class="me-1" />Bearbeiten
                                                    </BButton>
                                                </div>
                                            </div>
                                        </div>
                                    </BCard>
                                </Link>
                            </BCol>
                        </BRow>
                    </div>
                </BForm>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
