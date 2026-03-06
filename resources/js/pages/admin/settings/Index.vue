<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { Edit, Plus, Trash2, Globe, Building2, Mail } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
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
const defaultTab = validTabs.includes(props.initialTab) ? props.initialTab : 'allgemein';

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

        <div class="w-full space-y-6">
            <div>
                <Heading level="h1">System-Einstellungen</Heading>
                <Text class="mt-2" muted>
                    Kulanzfrist, Rechnungssteller, Rechnungstexte (§ 19 UStG), Mail-Absender
                </Text>
            </div>

            <form @submit.prevent="form.put('/admin/settings')">
                <Tabs :default-tab="defaultTab" class="w-full">
                    <TabsList class="mb-4 flex-wrap h-auto gap-1">
                        <TabsTrigger value="allgemein">Allgemein</TabsTrigger>
                        <TabsTrigger value="sicherheit">Sicherheit</TabsTrigger>
                        <TabsTrigger value="rechnung">Rechnung</TabsTrigger>
                        <TabsTrigger value="mahnung">Mahnung</TabsTrigger>
                        <TabsTrigger value="domains">Domains</TabsTrigger>
                        <TabsTrigger value="mail">Mail</TabsTrigger>
                        <TabsTrigger value="support">Support</TabsTrigger>
                        <TabsTrigger value="vorlagen">Vorlagen</TabsTrigger>
                        <TabsTrigger value="marken">Marken</TabsTrigger>
                    </TabsList>

                    <TabsContent value="allgemein">
                        <Card>
                            <CardHeader>
                                <CardTitle>Allgemein</CardTitle>
                                <CardDescription>Anzeigename der Anwendung, Abo-Logik und Kulanzfrist</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="app_name">Anzeigename der Anwendung</Label>
                                    <Input
                                        id="app_name"
                                        v-model="form.app_name"
                                        placeholder="z. B. Praxishosting"
                                        :aria-invalid="!!form.errors.app_name"
                                    />
                                    <InputError :message="form.errors.app_name" />
                                    <Text class="text-xs muted">Leer = Wert aus Konfiguration (APP_NAME). Wird in Header, E-Mails usw. verwendet.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="billing_grace_period_days">Kulanzfrist (Tage)</Label>
                                    <Input
                                        id="billing_grace_period_days"
                                        v-model="form.billing_grace_period_days"
                                        type="number"
                                        min="1"
                                        max="365"
                                        :aria-invalid="!!form.errors.billing_grace_period_days"
                                    />
                                    <InputError :message="form.errors.billing_grace_period_days" />
                                    <Text class="text-xs muted">Tage nach Abo-Ende, bis die Site endgültig gelöscht wird (davor: gesperrt).</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sicherheit">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sicherheit</CardTitle>
                                <CardDescription>PIN-Sperre und Standard für Auto-Sperre nach Inaktivität</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="pin_max_attempts">PIN – maximale Versuche</Label>
                                    <Input
                                        id="pin_max_attempts"
                                        v-model="form.pin_max_attempts"
                                        type="number"
                                        min="1"
                                        max="20"
                                        :aria-invalid="!!form.errors.pin_max_attempts"
                                    />
                                    <InputError :message="form.errors.pin_max_attempts" />
                                    <Text class="text-xs muted">Anzahl falscher PIN-Eingaben bis zur Sperre.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="pin_lockout_minutes">PIN – Sperrdauer (Minuten)</Label>
                                    <Input
                                        id="pin_lockout_minutes"
                                        v-model="form.pin_lockout_minutes"
                                        type="number"
                                        min="1"
                                        max="120"
                                        :aria-invalid="!!form.errors.pin_lockout_minutes"
                                    />
                                    <InputError :message="form.errors.pin_lockout_minutes" />
                                    <Text class="text-xs muted">Dauer der Sperre nach zu vielen Fehlversuchen.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="inactivity_lock_default_minutes">Inaktivität – Standard (Minuten)</Label>
                                    <Input
                                        id="inactivity_lock_default_minutes"
                                        v-model="form.inactivity_lock_default_minutes"
                                        type="number"
                                        min="0"
                                        max="1440"
                                        :aria-invalid="!!form.errors.inactivity_lock_default_minutes"
                                    />
                                    <InputError :message="form.errors.inactivity_lock_default_minutes" />
                                    <Text class="text-xs muted">Standardwert für „Auto-Sperre nach Inaktivität“ (0 = deaktiviert). Nutzer können unter Einstellungen abweichen.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rechnung">
                        <Card>
                            <CardHeader>
                                <CardTitle>Rechnung</CardTitle>
                                <CardDescription>Rechnungssteller und § 19 UStG-Text für PDF/E-Rechnung</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="invoice_ustg_19_text">§ 19 UStG-Text (Rechnung)</Label>
                                    <Textarea
                                        id="invoice_ustg_19_text"
                                        v-model="form.invoice_ustg_19_text"
                                        rows="3"
                                        :aria-invalid="!!form.errors.invoice_ustg_19_text"
                                    />
                                    <InputError :message="form.errors.invoice_ustg_19_text" />
                                </div>
                                <div class="border-t border-border pt-6 space-y-4">
                                    <Heading level="h3" class="text-base">Rechnungssteller</Heading>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_logo">Firmenlogo (URL oder Pfad)</Label>
                                            <Input
                                                id="invoice_company_logo"
                                                v-model="form.invoice_company_logo"
                                                placeholder="https://… oder invoices/logo.png"
                                                :aria-invalid="!!form.errors.invoice_company_logo"
                                            />
                                            <InputError :message="form.errors.invoice_company_logo" />
                                            <Text class="text-xs muted">Vollständige URL oder Pfad unter storage/app/public (z. B. invoices/logo.png).</Text>
                                        </div>
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_name">Firma / Name</Label>
                                            <Input
                                                id="invoice_company_name"
                                                v-model="form.invoice_company_name"
                                                :aria-invalid="!!form.errors.invoice_company_name"
                                            />
                                            <InputError :message="form.errors.invoice_company_name" />
                                        </div>
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_street">Straße, Hausnummer</Label>
                                            <Input
                                                id="invoice_company_street"
                                                v-model="form.invoice_company_street"
                                                :aria-invalid="!!form.errors.invoice_company_street"
                                            />
                                            <InputError :message="form.errors.invoice_company_street" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_postal_code">PLZ</Label>
                                            <Input
                                                id="invoice_company_postal_code"
                                                v-model="form.invoice_company_postal_code"
                                                :aria-invalid="!!form.errors.invoice_company_postal_code"
                                            />
                                            <InputError :message="form.errors.invoice_company_postal_code" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_city">Ort</Label>
                                            <Input
                                                id="invoice_company_city"
                                                v-model="form.invoice_company_city"
                                                :aria-invalid="!!form.errors.invoice_company_city"
                                            />
                                            <InputError :message="form.errors.invoice_company_city" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_country">Land</Label>
                                            <Select
                                                id="invoice_company_country"
                                                v-model="form.invoice_company_country"
                                                :aria-invalid="!!form.errors.invoice_company_country"
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option
                                                    v-for="c in countriesSortedByName"
                                                    :key="c.code"
                                                    :value="c.code"
                                                >
                                                    {{ c.name }}
                                                </option>
                                            </Select>
                                            <InputError :message="form.errors.invoice_company_country" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_vat_id">USt-IdNr.</Label>
                                            <Input
                                                id="invoice_company_vat_id"
                                                v-model="form.invoice_company_vat_id"
                                                placeholder="DE123456789"
                                                :aria-invalid="!!form.errors.invoice_company_vat_id"
                                            />
                                            <InputError :message="form.errors.invoice_company_vat_id" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mahnung">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mahnung</CardTitle>
                                <CardDescription>Mahngebühren in Euro für 1., 2. und 3. Mahnung</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_1">1. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_1"
                                            v-model="form.dunning_fee_level_1"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_1"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_1" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_2">2. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_2"
                                            v-model="form.dunning_fee_level_2"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_2"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_2" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_3">3. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_3"
                                            v-model="form.dunning_fee_level_3"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_3"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_3" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="domains">
                        <Card>
                            <CardHeader>
                                <CardTitle>Domains</CardTitle>
                                <CardDescription>Basis-Domain für CNAME, Hosts der Haupt-App (Dashboard)</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="domains_base_domain">Basis-Domain</Label>
                                    <Input
                                        id="domains_base_domain"
                                        v-model="form.domains_base_domain"
                                        placeholder="z. B. praxishosting.abrendt.de"
                                        :aria-invalid="!!form.errors.domains_base_domain"
                                    />
                                    <InputError :message="form.errors.domains_base_domain" />
                                    <Text class="text-xs muted">Domain, auf die Custom-Domains per CNAME zeigen. Leer = Wert aus Konfiguration.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="main_app_hosts">Haupt-App-Hosts (kommagetrennt)</Label>
                                    <Input
                                        id="main_app_hosts"
                                        v-model="form.main_app_hosts"
                                        placeholder="z. B. app.example.com, localhost"
                                        :aria-invalid="!!form.errors.main_app_hosts"
                                    />
                                    <InputError :message="form.errors.main_app_hosts" />
                                    <Text class="text-xs muted">Hosts, unter denen die Haupt-App (Dashboard, Login) läuft. Alle anderen Hosts = Site-Render. Leer = Wert aus Konfiguration.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="support">
                        <div class="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Support / Tickets</CardTitle>
                                    <CardDescription>Support-Ticket-System aktivieren und Limits</CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-6">
                                    <div class="flex items-center gap-2">
                                        <Switch
                                            id="support_enabled"
                                            :checked="form.support_enabled"
                                            @update:checked="(v: boolean) => (form.support_enabled = v)"
                                        />
                                        <Label for="support_enabled">Support-Tickets aktiviert</Label>
                                    </div>
                                    <Text class="text-xs muted">Wenn deaktiviert, können Kunden keine neuen Tickets erstellen.</Text>
                                    <div class="space-y-2">
                                        <Label for="support_max_open_tickets_per_user">Max. offene Tickets pro Kunde (0 = unbegrenzt)</Label>
                                        <Input
                                            id="support_max_open_tickets_per_user"
                                            v-model="form.support_max_open_tickets_per_user"
                                            type="number"
                                            min="0"
                                            max="100"
                                            :aria-invalid="!!form.errors.support_max_open_tickets_per_user"
                                        />
                                        <InputError :message="form.errors.support_max_open_tickets_per_user" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" :disabled="form.processing">Speichern</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Ticket-Kategorien</CardTitle>
                                            <CardDescription>Kategorien für Support-Tickets</CardDescription>
                                        </div>
                                        <Link href="/admin/ticket-categories/create">
                                            <Button size="sm"><Plus class="mr-2 h-4 w-4" />Neu</Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Sortierung</TableHead>
                                                <TableHead>Aktiv</TableHead>
                                                <TableHead class="text-right">Aktionen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow v-for="tc in ticketCategories.data" :key="tc.id">
                                                <TableCell>{{ tc.name }}</TableCell>
                                                <TableCell><code class="text-sm">{{ tc.slug }}</code></TableCell>
                                                <TableCell>{{ tc.sort_order }}</TableCell>
                                                <TableCell><Badge :variant="tc.is_active ? 'success' : 'secondary'">{{ tc.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                                <TableCell class="text-right">
                                                    <Link :href="`/admin/ticket-categories/${tc.id}/edit`">
                                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroyCategory(tc.id)">
                                                        <Trash2 class="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow v-if="ticketCategories.data.length === 0">
                                                <TableCell colspan="5" class="text-center text-muted">Keine Kategorien.</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Pagination v-if="ticketCategories.links.length > 3" :links="ticketCategories.links" @page-click="paginationClick" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Ticket-Prioritäten</CardTitle>
                                            <CardDescription>Prioritäten für Support-Tickets</CardDescription>
                                        </div>
                                        <Link href="/admin/ticket-priorities/create">
                                            <Button size="sm"><Plus class="mr-2 h-4 w-4" />Neu</Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Farbe</TableHead>
                                                <TableHead>Sortierung</TableHead>
                                                <TableHead>Aktiv</TableHead>
                                                <TableHead class="text-right">Aktionen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow v-for="tp in ticketPriorities.data" :key="tp.id">
                                                <TableCell>{{ tp.name }}</TableCell>
                                                <TableCell><code class="text-sm">{{ tp.slug }}</code></TableCell>
                                                <TableCell>
                                                    <Badge
                                                        v-if="tp.color"
                                                        :style="{ backgroundColor: tp.color, color: '#fff', border: 'none' }"
                                                    >
                                                        {{ tp.color }}
                                                    </Badge>
                                                    <span v-else>–</span>
                                                </TableCell>
                                                <TableCell>{{ tp.sort_order }}</TableCell>
                                                <TableCell><Badge :variant="tp.is_active ? 'success' : 'secondary'">{{ tp.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                                <TableCell class="text-right">
                                                    <Link :href="`/admin/ticket-priorities/${tp.id}/edit`">
                                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroyPriority(tp.id)">
                                                        <Trash2 class="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow v-if="ticketPriorities.data.length === 0">
                                                <TableCell colspan="6" class="text-center text-muted">Keine Prioritäten.</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Pagination v-if="ticketPriorities.links.length > 3" :links="ticketPriorities.links" @page-click="paginationClick" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="vorlagen">
                        <Card>
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Antwort-Vorlagen</CardTitle>
                                        <CardDescription>
                                            Vorlagen für Ticket-Antworten. Platzhalter:
                                            <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>.
                                        </CardDescription>
                                    </div>
                                    <Link href="/admin/ticket-message-templates/create">
                                        <Button size="sm"><Plus class="mr-2 h-4 w-4" />Neu</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Vorschau</TableHead>
                                            <TableHead>Sortierung</TableHead>
                                            <TableHead class="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="t in ticketMessageTemplates" :key="t.id">
                                            <TableCell>{{ t.name }}</TableCell>
                                            <TableCell class="max-w-[300px] truncate text-muted-foreground text-sm">{{ stripHtml(t.body) || '–' }}</TableCell>
                                            <TableCell>{{ t.sort_order }}</TableCell>
                                            <TableCell class="text-right">
                                                <Link :href="`/admin/ticket-message-templates/${t.id}/edit`">
                                                    <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" class="text-destructive" @click="destroyTemplate(t.id)">
                                                    <Trash2 class="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="ticketMessageTemplates.length === 0">
                                            <TableCell colspan="4" class="text-center text-muted">Keine Vorlagen.</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mail">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mail</CardTitle>
                                <CardDescription>Absender für System-E-Mails</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="mail_from_name">Mail-Absender Name</Label>
                                    <Input
                                        id="mail_from_name"
                                        v-model="form.mail_from_name"
                                        :aria-invalid="!!form.errors.mail_from_name"
                                    />
                                    <InputError :message="form.errors.mail_from_name" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="mail_from_address">Mail-Absender E-Mail</Label>
                                    <Input
                                        id="mail_from_address"
                                        v-model="form.mail_from_address"
                                        type="email"
                                        :aria-invalid="!!form.errors.mail_from_address"
                                    />
                                    <InputError :message="form.errors.mail_from_address" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="mail_reply_to_address">Reply-To Adresse (optional)</Label>
                                    <Input
                                        id="mail_reply_to_address"
                                        v-model="form.mail_reply_to_address"
                                        type="email"
                                        placeholder="z. B. support@example.com"
                                        :aria-invalid="!!form.errors.mail_reply_to_address"
                                    />
                                    <InputError :message="form.errors.mail_reply_to_address" />
                                    <Text class="text-xs muted">Falls gesetzt, wird bei allen System-E-Mails diese Adresse als Reply-To gesetzt.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="marken">
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Link
                                v-for="brand in brands"
                                :key="brand.id"
                                :href="`/admin/brands/${brand.id}/edit`"
                                class="group block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-xl"
                            >
                                <Card
                                    class="h-full overflow-hidden border-2 transition-colors group-hover:border-primary/40 group-focus:border-primary"
                                    :style="{
                                        borderLeftColor: primaryColor(brand),
                                        borderLeftWidth: '4px',
                                    }"
                                >
                                    <CardContent class="p-0">
                                        <div class="flex flex-col sm:flex-row sm:items-stretch">
                                            <div
                                                class="flex shrink-0 items-center justify-center px-6 py-8 sm:w-36 sm:flex-col sm:py-6"
                                                :style="{
                                                    backgroundColor: `${primaryColor(brand)}12`,
                                                }"
                                            >
                                                <img
                                                    v-if="brand.logo_url || brand.logo_collapsed_url"
                                                    :src="brand.logo_url || brand.logo_collapsed_url!"
                                                    :alt="brand.name"
                                                    class="max-h-16 w-auto object-contain sm:max-h-20"
                                                    loading="lazy"
                                                />
                                                <div
                                                    v-else
                                                    class="flex h-16 w-16 items-center justify-center rounded-xl text-white/80 sm:h-20 sm:w-20"
                                                    :style="{ backgroundColor: primaryColor(brand) }"
                                                >
                                                    <Building2 class="h-8 w-8 sm:h-10 sm:w-10" />
                                                </div>
                                                <div
                                                    class="mt-2 flex gap-1 sm:mt-3"
                                                    :title="primaryColor(brand)"
                                                >
                                                    <span
                                                        class="h-4 w-4 rounded-full border border-gray-300 shadow-sm dark:border-gray-600"
                                                        :style="{ backgroundColor: primaryColor(brand) }"
                                                    />
                                                    <span
                                                        v-if="brand.theme_colors?.primary_hover"
                                                        class="h-4 w-4 rounded-full border border-gray-300 shadow-sm dark:border-gray-600"
                                                        :style="{ backgroundColor: brand.theme_colors.primary_hover }"
                                                    />
                                                </div>
                                            </div>
                                            <div class="flex flex-1 flex-col justify-between p-5">
                                                <div>
                                                    <div class="flex flex-wrap items-center gap-2">
                                                        <span class="text-lg font-semibold text-foreground">{{ brand.name }}</span>
                                                        <Badge v-if="brand.is_default" variant="secondary" class="shrink-0">
                                                            Standard
                                                        </Badge>
                                                    </div>
                                                    <p class="mt-1 text-sm text-muted-foreground">{{ brand.key }}</p>
                                                    <div
                                                        v-if="firstDomains(brand.domains).length"
                                                        class="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
                                                    >
                                                        <Globe class="h-3.5 w-3.5 shrink-0" />
                                                        <span>{{ firstDomains(brand.domains).join(', ') }}</span>
                                                        <span v-if="brand.domains && brand.domains.length > 2">
                                                            (+{{ brand.domains.length - 2 }} weitere)
                                                        </span>
                                                    </div>
                                                    <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span class="flex items-center gap-1">
                                                            <Mail class="h-3.5 w-3.5" />
                                                            Anrede: {{ salutationLabel(brand.salutation) }}
                                                        </span>
                                                    </div>
                                                    <div
                                                        v-if="activeFeatures(brand.features).length"
                                                        class="mt-3 flex flex-wrap gap-1.5"
                                                    >
                                                        <span
                                                            v-for="label in activeFeatures(brand.features)"
                                                            :key="label"
                                                            class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                                                        >
                                                            {{ label }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="mt-4 flex items-center gap-2">
                                                    <Button variant="outline" size="sm" class="gap-2" as="span">
                                                        <Edit class="h-4 w-4" />
                                                        Bearbeiten
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    </AdminLayout>
</template>
