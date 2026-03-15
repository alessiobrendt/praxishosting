<!-- Admin: Kunde (Detail) -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BNav,
    BNavItem,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    BBadge,
    BTable,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { pushAdminRecent } from '@/composables/useAdminRecent';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { impersonate } from '@/routes/admin';
import { index as customersIndex } from '@/routes/admin/customers/index';
import { show as sitesShow } from '@/routes/sites';
import type { BreadcrumbItem } from '@/types';

type Site = {
    uuid: string;
    name: string;
    slug: string;
    template?: { name: string };
    site_subscription?: { current_period_ends_at?: string } | null;
};

type BalanceTransaction = {
    id: number;
    amount: string;
    type: string;
    description: string | null;
    created_at: string;
};

type CustomerBalance = {
    id: number;
    balance: string;
} | null;

type CustomerNote = {
    id: number;
    body: string;
    created_at: string;
    admin?: { id: number; name: string };
};

type Invoice = {
    id: number;
    uuid?: string;
    number: string;
    invoice_date: string | null;
    due_date: string | null;
    amount: string;
    status: string;
};

type Ticket = {
    id: number;
    uuid?: string;
    subject: string;
    status: string;
    ticket_category?: { name: string };
    ticket_priority?: { name: string; color?: string };
    assigned_to?: { name: string } | null;
};

type ResellerDomain = {
    id: number;
    uuid?: string;
    domain: string;
    status: string;
    expires_at?: string | null;
};

type WebspaceAccount = {
    id: number;
    uuid: string;
    hosting_plan?: { name: string };
    hosting_server?: { hostname: string };
};

type GameServerAccount = {
    id: number;
    uuid: string;
    name: string;
    hosting_plan?: { name: string };
    hosting_server?: { hostname: string };
};

type TeamSpeakServerAccount = {
    id: number;
    uuid: string;
    name: string;
    status: string;
    current_period_ends_at?: string | null;
    hosting_plan?: { name: string };
    hosting_server?: { hostname: string };
    mollie_subscription_id?: string | null;
    cancel_at_period_end?: boolean;
};

type Customer = {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
    phone?: string | null;
    brand?: { id: number; key: string; name: string } | null;
    is_admin?: boolean;
    rank?: string | null;
    sites: Site[];
    customerBalance: CustomerBalance;
    balanceTransactions: BalanceTransaction[];
    customer_notes?: CustomerNote[];
    invoices?: Invoice[];
    invoices_count?: number;
    tickets?: Ticket[];
    tickets_count?: number;
    reseller_domains?: ResellerDomain[];
    reseller_domains_count?: number;
    webspace_accounts?: WebspaceAccount[];
    game_server_accounts?: GameServerAccount[];
    team_speak_server_accounts?: TeamSpeakServerAccount[];
    mollie_customer_id?: string | null;
    support_pin?: string;
    support_pin_valid_until?: string;
};

type ActivityLogEntry = {
    id: number;
    action: string;
    created_at: string;
    user?: { id: number; name: string };
};

type AiTokenTransaction = {
    id: number;
    amount: number;
    type: string;
    description: string | null;
    created_at: string;
};

const RANK_LABELS: Record<string, string> = {
    customer: 'Kunde',
    reseller: 'Reseller',
    partner: 'Partner',
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
};

const invoiceStatusLabel = (status: string): string =>
    INVOICE_STATUS_LABELS[status] ?? status;

const invoiceStatusVariant = (status: string): string => {
    switch (status) {
        case 'paid': return 'success';
        case 'pending': return 'warning';
        case 'draft': return 'secondary';
        case 'sent': return 'info';
        default: return 'secondary';
    }
};

type Props = {
    customer: Customer;
    activityLog?: ActivityLogEntry[];
    aiTokenBalance: number;
    aiTokenTransactions: AiTokenTransaction[];
    can_impersonate?: boolean;
    can_be_impersonated?: boolean;
};

const props = defineProps<Props>();

const actionLabels: Record<string, string> = {
    customer_updated: 'Stammdaten geändert',
};

const balanceAmount = computed(() => {
    const b = props.customer.customerBalance;
    return b ? `${Number(b.balance).toFixed(2)} €` : '0,00 €';
});

const invoicesCount = computed(() => props.customer.invoices_count ?? props.customer.invoices?.length ?? 0);
const ticketsCount = computed(() => props.customer.tickets_count ?? props.customer.tickets?.length ?? 0);
const domainsCount = computed(() => props.customer.reseller_domains_count ?? props.customer.reseller_domains?.length ?? 0);

const rankLabel = computed(() => {
    const r = props.customer.rank;
    return r ? (RANK_LABELS[r] ?? r) : null;
});

const impersonateUrl = computed(() => impersonate.url({ id: props.customer.id }));
const showImpersonateButton = computed(
    () => props.can_impersonate && props.can_be_impersonated,
);

const balanceModalOpen = ref(false);
const aiTokensModalOpen = ref(false);
const productsTab = ref<'sites' | 'webspace' | 'gaming' | 'teamspeak' | 'domains'>('sites');

const balanceForm = useForm({
    amount: '',
    description: 'Guthaben aufladen (Admin)',
});

const noteForm = useForm({
    body: '',
});

const aiTokensForm = useForm({
    amount: '',
    description: 'Admin-Anpassung',
});

const submitBalance = () => {
    balanceForm.post(`/admin/customers/${props.customer.id}/balance`, {
        preserveScroll: true,
        onSuccess: () => {
            balanceForm.reset('amount', 'description');
            balanceModalOpen.value = false;
        },
    });
};

const submitNote = () => {
    noteForm.post(`/admin/customers/${props.customer.id}/notes`, {
        preserveScroll: true,
        onSuccess: () => noteForm.reset('body'),
    });
};

const submitAiTokens = () => {
    aiTokensForm.post(`/admin/customers/${props.customer.id}/ai-tokens`, {
        preserveScroll: true,
        onSuccess: () => {
            aiTokensForm.reset('amount', 'description');
            aiTokensModalOpen.value = false;
        },
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
    { title: props.customer.name, href: '#' },
];

onMounted(() => {
    pushAdminRecent({
        type: 'customer',
        id: props.customer.id,
        label: props.customer.name,
        url: `/admin/customers/${props.customer.id}`,
    });
});
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde: ${customer.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                        <h4 class="mb-1">{{ customer.name }}</h4>
                        <p class="text-muted small mb-0 d-flex flex-wrap align-items-center gap-2">
                            <span>{{ customer.email }}</span>
                            <BBadge v-if="customer.brand" variant="secondary">{{ customer.brand.name }}</BBadge>
                            <BBadge v-if="rankLabel" variant="outline">{{ rankLabel }}</BBadge>
                            <BBadge v-if="customer.is_admin" variant="primary">Administrator</BBadge>
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <Link v-if="showImpersonateButton" :href="impersonateUrl">
                            <BButton variant="outline-primary" size="sm">
                                <Icon icon="login" class="me-1" /> Als Kunde anmelden
                            </BButton>
                        </Link>
                        <Link :href="`/admin/customers/${customer.id}/edit`">
                            <BButton variant="outline-primary" size="sm">
                                <Icon icon="pencil" class="me-1" /> Bearbeiten
                            </BButton>
                        </Link>
                    </div>
                </div>
                <p class="text-muted small mb-3">Kundendetail: Stammdaten, Produkte, Rechnungen und Tickets</p>
            </BCol>
        </BRow>

        <BRow class="mb-4">
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <Link :href="`#sites`" class="text-decoration-none">
                    <BCard class="h-100 hover-shadow">
                        <BCardBody class="py-3 d-flex align-items-center gap-2">
                            <Icon icon="world" class="text-muted" />
                            <span class="fs-4 fw-semibold">{{ customer.sites?.length ?? 0 }}</span>
                        </BCardBody>
                        <BCardBody class="py-2 pt-0 small text-muted">Sites</BCardBody>
                    </BCard>
                </Link>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <Link :href="`/admin/invoices?user_id=${customer.id}`" class="text-decoration-none">
                    <BCard class="h-100 hover-shadow">
                        <BCardBody class="py-3 d-flex align-items-center gap-2">
                            <Icon icon="file-text" class="text-muted" />
                            <span class="fs-4 fw-semibold">{{ invoicesCount }}</span>
                        </BCardBody>
                        <BCardBody class="py-2 pt-0 small text-muted">Rechnungen</BCardBody>
                    </BCard>
                </Link>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <Link :href="`/admin/tickets?user_id=${customer.id}`" class="text-decoration-none">
                    <BCard class="h-100 hover-shadow">
                        <BCardBody class="py-3 d-flex align-items-center gap-2">
                            <Icon icon="message-circle" class="text-muted" />
                            <span class="fs-4 fw-semibold">{{ ticketsCount }}</span>
                        </BCardBody>
                        <BCardBody class="py-2 pt-0 small text-muted">Tickets</BCardBody>
                    </BCard>
                </Link>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <Link :href="`/admin/domains?customer_id=${customer.id}`" class="text-decoration-none">
                    <BCard class="h-100 hover-shadow">
                        <BCardBody class="py-3 d-flex align-items-center gap-2">
                            <Icon icon="world" class="text-muted" />
                            <span class="fs-4 fw-semibold">{{ domainsCount }}</span>
                        </BCardBody>
                        <BCardBody class="py-2 pt-0 small text-muted">Domains</BCardBody>
                    </BCard>
                </Link>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <BCard class="h-100 cursor-pointer" @click="balanceModalOpen = true">
                    <BCardBody class="py-3">
                        <span class="fs-4 fw-semibold">{{ balanceAmount }}</span>
                    </BCardBody>
                    <BCardBody class="py-2 pt-0 small text-muted">Guthaben</BCardBody>
                </BCard>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <BCard class="h-100 cursor-pointer" @click="aiTokensModalOpen = true">
                    <BCardBody class="py-3 d-flex align-items-center gap-2">
                        <Icon icon="sparkles" class="text-muted" />
                        <span class="fs-4 fw-semibold">{{ aiTokenBalance }}</span>
                    </BCardBody>
                    <BCardBody class="py-2 pt-0 small text-muted">AI-Tokens</BCardBody>
                </BCard>
            </BCol>
            <BCol cols="6" md="4" lg="2" class="mb-3">
                <BCard class="h-100" title="Support-PIN (täglich wechselnd)">
                    <BCardBody class="py-3 d-flex align-items-center gap-2">
                        <Icon icon="key" class="text-muted" />
                        <span class="font-monospace fs-5 fw-semibold">{{ customer.support_pin ?? '–' }}</span>
                    </BCardBody>
                    <BCardBody class="py-2 pt-0 small text-muted">Support-PIN (gültig bis 00:00)</BCardBody>
                </BCard>
            </BCol>
        </BRow>

        <BModal v-model="balanceModalOpen" title="Guthaben" hide-footer>
            <p class="text-muted small mb-3">Aktuelles Guthaben und Transaktionen; Guthaben aufladen</p>
            <div class="mb-3">
                <span class="small text-muted">Aktuelles Guthaben:</span>
                <span class="ms-2 fw-medium">{{ customer.customerBalance ? `${customer.customerBalance.balance} €` : '0,00 €' }}</span>
            </div>
            <BForm @submit.prevent="submitBalance">
                <BFormGroup label="Betrag (€)" label-for="balance_amount">
                    <BFormInput
                        id="balance_amount"
                        v-model="balanceForm.amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        :aria-invalid="!!balanceForm.errors.amount"
                    />
                    <InputError :message="balanceForm.errors.amount" />
                </BFormGroup>
                <BFormGroup label="Beschreibung (optional)" label-for="balance_description">
                    <BFormInput
                        id="balance_description"
                        v-model="balanceForm.description"
                        placeholder="Guthaben aufladen (Admin)"
                        :aria-invalid="!!balanceForm.errors.description"
                    />
                    <InputError :message="balanceForm.errors.description" />
                </BFormGroup>
                <BButton type="submit" variant="primary" :disabled="balanceForm.processing">Guthaben aufladen</BButton>
            </BForm>
            <div v-if="customer.balanceTransactions?.length" class="mt-4">
                <p class="small text-muted mb-2">Letzte Transaktionen</p>
                <BTable small :items="customer.balanceTransactions" :fields="[{ key: 'created_at', label: 'Datum' }, { key: 'type', label: 'Typ' }, { key: 'amount', label: 'Betrag' }, { key: 'description', label: 'Beschreibung' }]">
                    <template #cell(amount)="{ item }">
                        <span :class="parseFloat(item.amount) >= 0 ? 'text-success' : 'text-danger'">{{ item.amount }} €</span>
                    </template>
                    <template #cell(description)="{ item }">
                        {{ item.description ?? '–' }}
                    </template>
                </BTable>
            </div>
        </BModal>

        <BModal v-model="aiTokensModalOpen" title="AI Tokens" hide-footer>
            <p class="text-muted small mb-3">Aktueller Token-Stand und manuelle Anpassung (hinzufügen oder abziehen)</p>
            <div class="mb-3">
                <span class="small text-muted">Aktueller Token-Stand:</span>
                <span class="ms-2 fw-medium">{{ aiTokenBalance }}</span>
            </div>
            <BForm @submit.prevent="submitAiTokens">
                <BFormGroup label="Anzahl (+ hinzufügen, − abziehen)" label-for="ai_tokens_amount">
                    <BFormInput
                        id="ai_tokens_amount"
                        v-model="aiTokensForm.amount"
                        type="number"
                        step="1"
                        placeholder="z.B. 500 oder -100"
                        :aria-invalid="!!aiTokensForm.errors.amount"
                    />
                    <InputError :message="aiTokensForm.errors.amount" />
                </BFormGroup>
                <BFormGroup label="Beschreibung" label-for="ai_tokens_description">
                    <BFormInput
                        id="ai_tokens_description"
                        v-model="aiTokensForm.description"
                        placeholder="Admin-Anpassung"
                        :aria-invalid="!!aiTokensForm.errors.description"
                    />
                    <InputError :message="aiTokensForm.errors.description" />
                </BFormGroup>
                <BButton type="submit" variant="primary" :disabled="aiTokensForm.processing">Tokens anpassen</BButton>
            </BForm>
            <div v-if="aiTokenTransactions?.length" class="mt-4">
                <p class="small text-muted mb-2">Letzte Transaktionen</p>
                <BTable small :items="aiTokenTransactions" :fields="[{ key: 'created_at', label: 'Datum' }, { key: 'type', label: 'Typ' }, { key: 'amount', label: 'Betrag' }, { key: 'description', label: 'Beschreibung' }]">
                    <template #cell(amount)="{ item }">
                        <span :class="item.amount >= 0 ? 'text-success' : 'text-danger'">{{ item.amount >= 0 ? '+' : '' }}{{ item.amount }}</span>
                    </template>
                    <template #cell(description)="{ item }">
                        {{ item.description ?? '–' }}
                    </template>
                </BTable>
            </div>
        </BModal>

        <BRow>
            <BCol lg="6" class="mb-4">
                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Stammdaten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Name, E-Mail, Firma, Adresse</p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="row g-2 small">
                            <div class="col-sm-6"><span class="text-muted">Name</span><div>{{ customer.name }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">E-Mail</span><div>{{ customer.email }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">Telefon</span><div>{{ customer.phone ?? '–' }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">Firma</span><div>{{ customer.company ?? '–' }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">Straße</span><div>{{ customer.street ?? '–' }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">PLZ</span><div>{{ customer.postal_code ?? '–' }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">Ort</span><div>{{ customer.city ?? '–' }}</div></div>
                            <div class="col-sm-6"><span class="text-muted">Land</span><div>{{ customer.country ?? '–' }}</div></div>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                            <Icon icon="credit-card" /> Mollie
                        </BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Zahlungen, Abos – Kunden-ID bei Mollie</p>
                    </BCardHeader>
                    <BCardBody>
                        <p class="small text-muted mb-1">Mollie-Kunden-ID</p>
                        <div class="d-flex flex-wrap align-items-center gap-2">
                            <code v-if="customer.mollie_customer_id" class="rounded bg-light px-2 py-1 small">{{ customer.mollie_customer_id }}</code>
                            <span v-else class="text-muted">–</span>
                            <a
                                v-if="customer.mollie_customer_id"
                                :href="`https://www.mollie.com/dashboard/customers/${customer.mollie_customer_id}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="small d-inline-flex align-items-center gap-1"
                            >
                                Bei Mollie anzeigen <Icon icon="external-link" />
                            </a>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard v-if="customer.customer_notes !== undefined" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Notizen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kundennotizen; neue Notiz anlegen</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitNote">
                            <BFormGroup label="Neue Notiz" label-for="note_body">
                                <textarea
                                    id="note_body"
                                    v-model="noteForm.body"
                                    class="form-control"
                                    rows="3"
                                    placeholder="Notiz eingeben…"
                                    :aria-invalid="!!noteForm.errors.body"
                                />
                                <InputError :message="noteForm.errors.body" />
                            </BFormGroup>
                            <BButton type="submit" size="sm" variant="primary" :disabled="noteForm.processing">Notiz speichern</BButton>
                        </BForm>
                        <div v-if="customer.customer_notes?.length" class="mt-4 pt-3 border-top">
                            <p class="small text-muted mb-2">Letzte Notizen</p>
                            <ul class="list-unstyled mb-0">
                                <li v-for="note in customer.customer_notes" :key="note.id" class="rounded border p-3 mb-2 bg-light small">
                                    <span class="whitespace-pre-wrap d-block">{{ note.body }}</span>
                                    <span class="text-muted small">{{ note.created_at }}<template v-if="note.admin"> · {{ note.admin.name }}</template></span>
                                </li>
                            </ul>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <BCol lg="6" class="mb-4">
                <BCard no-body class="mb-4">
                    <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <BCardTitle class="mb-0">Rechnungen</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Letzte Rechnungen</p>
                        </div>
                        <Link :href="`/admin/invoices?user_id=${customer.id}`">
                            <BButton variant="link" size="sm">Alle anzeigen</BButton>
                        </Link>
                    </BCardHeader>
                    <BCardBody>
                        <BTable v-if="customer.invoices?.length" small :items="customer.invoices.slice(0, 5)" :fields="[{ key: 'number', label: 'Nr.' }, { key: 'invoice_date', label: 'Datum' }, { key: 'amount', label: 'Betrag' }, { key: 'status', label: 'Status' }, { key: 'actions', label: '' }]">
                            <template #cell(invoice_date)="{ item }">{{ item.invoice_date ?? '–' }}</template>
                            <template #cell(amount)="{ item }">{{ item.amount }} €</template>
                            <template #cell(status)="{ item }">
                                <BBadge :variant="invoiceStatusVariant(item.status)">{{ invoiceStatusLabel(item.status) }}</BBadge>
                            </template>
                            <template #cell(actions)="{ item }">
                                <Link :href="`/admin/invoices/${(item as Invoice).uuid ?? (item as Invoice).id}`">
                                    <BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton>
                                </Link>
                            </template>
                        </BTable>
                        <p v-else class="small text-muted mb-0">Keine Rechnungen</p>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <BCardTitle class="mb-0">Tickets</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Support-Tickets</p>
                        </div>
                        <Link :href="`/admin/tickets?user_id=${customer.id}`">
                            <BButton variant="link" size="sm">Alle anzeigen</BButton>
                        </Link>
                    </BCardHeader>
                    <BCardBody>
                        <BTable v-if="customer.tickets?.length" small :items="customer.tickets.slice(0, 5)" :fields="[{ key: 'subject', label: 'Betreff' }, { key: 'status', label: 'Status' }, { key: 'actions', label: '' }]">
                            <template #cell(actions)="{ item }">
                                <Link :href="`/admin/tickets/${(item as Ticket).uuid}`">
                                    <BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton>
                                </Link>
                            </template>
                        </BTable>
                        <p v-else class="small text-muted mb-0">Keine Tickets</p>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>

        <BCard id="sites" no-body class="mb-4">
            <BCardHeader>
                <BCardTitle class="mb-0">Produkte &amp; Domains</BCardTitle>
                <p class="text-muted small mb-0 mt-1">Webseiten, Webspace, Game-Server und Reseller-Domains dieses Kunden</p>
            </BCardHeader>
            <BCardBody>
                <BNav tabs class="mb-4 flex-wrap">
                    <BNavItem :active="productsTab === 'sites'" @click="productsTab = 'sites'">
                        <Icon icon="world" class="me-1" /> Webseiten ({{ customer.sites?.length ?? 0 }})
                    </BNavItem>
                    <BNavItem :active="productsTab === 'webspace'" @click="productsTab = 'webspace'">
                        <Icon icon="device-desktop" class="me-1" /> Webspace ({{ customer.webspace_accounts?.length ?? 0 }})
                    </BNavItem>
                    <BNavItem :active="productsTab === 'gaming'" @click="productsTab = 'gaming'">
                        <Icon icon="server" class="me-1" /> Game-Server ({{ customer.game_server_accounts?.length ?? 0 }})
                    </BNavItem>
                    <BNavItem :active="productsTab === 'teamspeak'" @click="productsTab = 'teamspeak'">
                        <Icon icon="headphones" class="me-1" /> TeamSpeak ({{ customer.team_speak_server_accounts?.length ?? 0 }})
                    </BNavItem>
                    <BNavItem :active="productsTab === 'domains'" @click="productsTab = 'domains'">
                        <Icon icon="world" class="me-1" /> Reseller-Domains ({{ customer.reseller_domains?.length ?? 0 }})
                    </BNavItem>
                </BNav>

                <div v-show="productsTab === 'sites'">
                    <BTable small :items="customer.sites ?? []" :fields="[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'template_name', label: 'Template' }, { key: 'period_end', label: 'Laufzeit Ende' }, { key: 'actions', label: '', thClass: 'text-end' }]">
                        <template #cell(slug)="{ item }"><code class="rounded bg-light px-1 small">{{ item.slug }}</code></template>
                        <template #cell(template_name)="{ item }">{{ item.template?.name ?? '–' }}</template>
                        <template #cell(period_end)="{ item }">{{ item.site_subscription?.current_period_ends_at ?? '–' }}</template>
                        <template #cell(actions)="{ item }">
                            <Link :href="sitesShow({ site: item.uuid }).url"><BButton variant="link" size="sm" aria-label="Bearbeiten"><Icon icon="external-link" /></BButton></Link>
                        </template>
                    </BTable>
                    <p v-if="!customer.sites?.length" class="text-muted text-center py-4 mb-0">Keine Webseiten</p>
                </div>

                <div v-show="productsTab === 'webspace'">
                    <BTable small :items="customer.webspace_accounts ?? []" :fields="[{ key: 'id', label: 'ID' }, { key: 'plan', label: 'Paket / Plan' }, { key: 'server', label: 'Server / Node' }, { key: 'actions', label: '', thClass: 'text-end' }]">
                        <template #cell(plan)="{ item }">{{ item.hosting_plan?.name ?? '–' }}</template>
                        <template #cell(server)="{ item }"><code class="rounded bg-light px-1 small">{{ item.hosting_server?.hostname ?? '–' }}</code></template>
                        <template #cell(actions)="{ item }">
                            <Link :href="`/admin/webspace-accounts/${item.uuid}`"><BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton></Link>
                        </template>
                    </BTable>
                    <p v-if="!customer.webspace_accounts?.length" class="text-muted text-center py-4 mb-0">Keine Webspace-Accounts</p>
                    <Link v-if="customer.webspace_accounts?.length" :href="`/admin/webspace-accounts?user_id=${customer.id}`" class="small mt-2 d-inline-block">Alle Webspace-Accounts anzeigen →</Link>
                </div>

                <div v-show="productsTab === 'gaming'">
                    <BTable small :items="customer.game_server_accounts ?? []" :fields="[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'plan', label: 'Paket / Plan' }, { key: 'server', label: 'Server / Node' }, { key: 'actions', label: '', thClass: 'text-end' }]">
                        <template #cell(plan)="{ item }">{{ item.hosting_plan?.name ?? '–' }}</template>
                        <template #cell(server)="{ item }"><code class="rounded bg-light px-1 small">{{ item.hosting_server?.hostname ?? '–' }}</code></template>
                        <template #cell(actions)="{ item }">
                            <Link :href="`/admin/gaming-accounts/${item.uuid}`"><BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton></Link>
                        </template>
                    </BTable>
                    <p v-if="!customer.game_server_accounts?.length" class="text-muted text-center py-4 mb-0">Keine Game-Server-Accounts</p>
                    <Link v-if="customer.game_server_accounts?.length" :href="`/admin/gaming-accounts?user_id=${customer.id}`" class="small mt-2 d-inline-block">Alle Game-Server anzeigen →</Link>
                </div>

                <div v-show="productsTab === 'teamspeak'">
                    <BTable small :items="customer.team_speak_server_accounts ?? []" :fields="[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'plan', label: 'Paket / Plan' }, { key: 'server', label: 'Server' }, { key: 'status', label: 'Status' }, { key: 'period_end', label: 'Laufzeit Ende' }, { key: 'actions', label: '', thClass: 'text-end' }]">
                        <template #cell(plan)="{ item }">{{ item.hosting_plan?.name ?? '–' }}</template>
                        <template #cell(server)="{ item }"><code class="rounded bg-light px-1 small">{{ item.hosting_server?.hostname ?? '–' }}</code></template>
                        <template #cell(status)="{ item }">
                            <BBadge variant="secondary">{{ item.status }}</BBadge>
                            <span v-if="item.mollie_subscription_id" class="small text-success ms-1" title="Mollie-Abo aktiv">Abo</span>
                            <span v-if="item.cancel_at_period_end" class="small text-warning ms-1" title="Zum Periodenende gekündigt">↷</span>
                        </template>
                        <template #cell(period_end)="{ item }">{{ item.current_period_ends_at ?? '–' }}</template>
                        <template #cell(actions)="{ item }">
                            <Link :href="`/admin/teamspeak-accounts/${item.uuid}`"><BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton></Link>
                        </template>
                    </BTable>
                    <p v-if="!customer.team_speak_server_accounts?.length" class="text-muted text-center py-4 mb-0">Keine TeamSpeak-Server</p>
                    <Link v-if="customer.team_speak_server_accounts?.length" :href="`/admin/teamspeak-accounts?user_id=${customer.id}`" class="small mt-2 d-inline-block">Alle TeamSpeak-Server anzeigen →</Link>
                </div>

                <div v-show="productsTab === 'domains'">
                    <BTable small :items="customer.reseller_domains ?? []" :fields="[{ key: 'domain', label: 'Domain' }, { key: 'status', label: 'Status' }, { key: 'expires_at', label: 'Ablauf' }, { key: 'actions', label: '', thClass: 'text-end' }]">
                        <template #cell(expires_at)="{ item }">{{ item.expires_at ?? '–' }}</template>
                        <template #cell(status)="{ item }"><BBadge variant="secondary">{{ item.status }}</BBadge></template>
                        <template #cell(actions)="{ item }">
                            <Link :href="`/admin/domains/${(item as ResellerDomain).uuid ?? (item as ResellerDomain).id}`"><BButton variant="link" size="sm" aria-label="Anzeigen"><Icon icon="external-link" /></BButton></Link>
                        </template>
                    </BTable>
                    <p v-if="!customer.reseller_domains?.length" class="text-muted text-center py-4 mb-0">Keine Reseller-Domains</p>
                    <Link v-if="customer.reseller_domains?.length" :href="`/admin/domains?customer_id=${customer.id}`" class="small mt-2 d-inline-block">Alle Domains anzeigen →</Link>
                </div>
            </BCardBody>
        </BCard>

        <BCard v-if="activityLog?.length" no-body>
            <BCardHeader>
                <BCardTitle class="mb-0">Letzte Änderungen</BCardTitle>
                <p class="text-muted small mb-0 mt-1">Aktivitätslog für diesen Kunden</p>
            </BCardHeader>
            <BCardBody>
                <ul class="list-unstyled mb-0">
                    <li v-for="entry in activityLog" :key="entry.id" class="d-flex flex-wrap align-items-center gap-2 rounded border px-3 py-2 mb-2 small">
                        <span class="fw-medium">{{ actionLabels[entry.action] ?? entry.action }}</span>
                        <span class="text-muted">{{ entry.created_at }}</span>
                        <span v-if="entry.user" class="text-muted">· {{ entry.user.name }}</span>
                    </li>
                </ul>
            </BCardBody>
        </BCard>
    </AdminLayout>
</template>
