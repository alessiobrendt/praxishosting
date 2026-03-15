<template>
    <DefaultLayout>
        <Head title="Dashboard" />
        <PageBreadcrumb title="Dashboard" />

        <div class="mb-4">
            <h4 class="mb-1">Dashboard</h4>
            <p class="text-muted mb-0">
                Willkommen zurück! Hier ist eine Übersicht deiner Aktivitäten.
            </p>
        </div>

        <!-- Stats -->
        <BRow class="mb-4">
            <BCol xs="12" sm="6" xxl="3" class="mb-3">
                <BCard no-body class="h-100">
                    <BCardBody class="d-flex align-items-center gap-3">
                        <div class="rounded bg-primary bg-opacity-10 p-3">
                            <Activity class="h-5 w-5 text-primary" />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <p class="text-muted small mb-0">Aktive Dienste</p>
                            <p class="fw-semibold mb-0">
                                {{ stats.activeServicesCount }} Dienst{{ stats.activeServicesCount !== 1 ? 'e' : '' }}
                            </p>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol v-if="showBalanceCard" xs="12" sm="6" xxl="3" class="mb-3">
                <BCard no-body class="h-100">
                    <BCardBody class="d-flex align-items-center gap-3">
                        <div class="rounded bg-success bg-opacity-10 p-3">
                            <Wallet class="h-5 w-5 text-success" />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <p class="text-muted small mb-0">Aktuelles Guthaben</p>
                            <p class="fw-semibold mb-0">
                                {{ formatCurrency(stats.customerBalance ?? 0) }}
                                <Link v-if="stats.balanceTopUpUrl" :href="stats.balanceTopUpUrl" class="small text-primary text-decoration-underline">
                                    (aufladen)
                                </Link>
                            </p>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol xs="12" sm="6" xxl="3" class="mb-3">
                <BCard no-body class="h-100">
                    <BCardBody class="d-flex align-items-center gap-3">
                        <div class="rounded bg-info bg-opacity-10 p-3">
                            <Coins class="h-5 w-5 text-info" />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <p class="text-muted small mb-0">Fällig in nächste 30 Tage</p>
                            <p class="fw-semibold mb-0">{{ formatCurrency(stats.dueIn30Days) }}</p>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol xs="12" sm="6" xxl="3" class="mb-3">
                <BCard no-body class="h-100">
                    <BCardBody class="d-flex align-items-center gap-3">
                        <div class="rounded bg-warning bg-opacity-10 p-3">
                            <CalendarCheck class="h-5 w-5 text-warning" />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <p class="text-muted small mb-0">Registrierung</p>
                            <p class="fw-semibold mb-0">{{ stats.registeredAt || '–' }}</p>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol xs="12" sm="6" xxl="3" class="mb-3">
                <BCard no-body class="h-100">
                    <BCardBody class="d-flex align-items-center gap-3">
                        <div class="rounded bg-secondary bg-opacity-10 p-3">
                            <KeyRound class="h-5 w-5 text-secondary" />
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <p class="text-muted small mb-0">Support-PIN</p>
                            <p class="fw-semibold font-monospace mb-0">{{ supportPin }}</p>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>

        <BRow>
            <!-- Favoriten -->
            <BCol xxl="6" class="mb-4">
                <BCard>
                    <BCardHeader class="d-flex align-items-center">
                        <Trophy class="h-5 w-5 text-primary me-2" />
                        <BCardTitle class="mb-0">Favoriten</BCardTitle>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex flex-wrap gap-2">
                            <Link
                                v-for="(fav, idx) in favorites"
                                :key="idx"
                                :href="fav.href"
                                class="btn btn-soft-primary btn-sm"
                            >
                                {{ fav.name }}
                            </Link>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Dein Status -->
            <BCol xxl="6" class="mb-4">
                <BCard>
                    <BCardHeader class="d-flex align-items-center">
                        <HeartPulse class="h-5 w-5 text-primary me-2" />
                        <BCardTitle class="mb-0">Dein Status</BCardTitle>
                    </BCardHeader>
                    <BCardBody>
                        <p
                            class="fw-semibold mb-2"
                            :class="{
                                'text-success': status.level === 'ok',
                                'text-warning': status.level === 'warning',
                                'text-danger': status.level === 'danger',
                            }"
                        >
                            <Check v-if="status.level === 'ok'" class="me-1 inline" size="16" />
                            <AlertTriangle v-else class="me-1 inline" size="16" />
                            {{ status.label }}
                        </p>
                        <ul class="list-unstyled mb-0 small">
                            <li v-if="status.balanceOk" class="d-flex align-items-center gap-2 mb-1">
                                <Check class="text-success flex-shrink-0" size="16" />
                                Keine ungedeckten Zahlungen in den nächsten 7 Tagen
                            </li>
                            <li v-else class="d-flex align-items-start gap-2 mb-1">
                                <AlertTriangle class="text-danger flex-shrink-0 mt-1" size="16" />
                                <span>{{ status.balanceMessage }}</span>
                            </li>
                            <li v-if="status.ticketsOk" class="d-flex align-items-center gap-2 mb-1">
                                <Check class="text-success flex-shrink-0" size="16" />
                                Keine offenen, vom Support beantworteten Support-Tickets
                            </li>
                            <li v-else class="mb-1">
                                <span class="d-flex align-items-center gap-2">
                                    <AlertTriangle class="text-warning flex-shrink-0" size="16" />
                                    Es gibt offene, vom Support beantwortete Tickets:
                                </span>
                                <Link
                                    v-for="t in status.ticketItems"
                                    :key="t.id"
                                    :href="t.url"
                                    class="d-block ms-4 text-primary small"
                                >
                                    {{ t.subject }}
                                </Link>
                            </li>
                        </ul>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Aktive Dienste -->
            <BCol xxl="6" class="mb-4">
                <BCard>
                    <BCardHeader class="d-flex align-items-center">
                        <Server class="h-5 w-5 text-primary me-2" />
                        <BCardTitle class="mb-0">Aktive Dienste</BCardTitle>
                    </BCardHeader>
                    <BCardBody>
                        <div v-if="activeServices.length" class="d-flex flex-column gap-2">
                            <Link
                                v-for="(svc, idx) in activeServices"
                                :key="idx"
                                :href="svc.url"
                                class="d-flex align-items-center justify-content-between gap-3 p-3 border rounded text-decoration-none text-body hover-bg-light"
                            >
                                <div class="d-flex align-items-center gap-3 min-w-0">
                                    <div class="rounded bg-primary bg-opacity-10 p-2 text-primary">
                                        <component :is="getServiceIcon(svc.type)" class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <span class="badge bg-primary bg-opacity-10 text-primary mb-1">
                                            {{ getServiceTypeLabel(svc.type) }}
                                        </span>
                                        <p class="fw-semibold mb-0 truncate">{{ svc.name }}</p>
                                    </div>
                                </div>
                                <span class="text-primary small flex-shrink-0">
                                    Öffnen <ExternalLink class="inline ms-1" size="14" />
                                </span>
                            </Link>
                        </div>
                        <p v-else class="text-muted mb-0">Keine aktiven Dienste.</p>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Postfach -->
            <BCol xxl="6" class="mb-4">
                <BCard>
                    <BCardHeader class="d-flex align-items-center justify-content-between">
                        <BCardTitle class="d-flex align-items-center mb-0">
                            <Inbox class="h-5 w-5 text-primary me-2" />
                            Postfach
                        </BCardTitle>
                        <Link :href="postfach.index.url()" class="small text-primary">
                            Alle anzeigen
                        </Link>
                    </BCardHeader>
                    <BCardBody>
                        <div v-if="recentEmails.length" class="d-flex flex-column gap-2">
                            <Link
                                v-for="email in recentEmails"
                                :key="email.id"
                                :href="postfach.show.url(email.id)"
                                class="d-block p-3 border rounded text-decoration-none text-body hover-bg-light"
                            >
                                <p class="fw-semibold mb-1 truncate">{{ email.subject }}</p>
                                <p class="small text-muted mb-0 line-clamp-2">{{ email.snippet || '…' }}</p>
                                <span v-if="email.sent_at" class="badge bg-warning bg-opacity-10 text-warning mt-1">
                                    {{ email.sent_at }}
                                </span>
                            </Link>
                        </div>
                        <p v-else class="text-muted mb-0">Keine E-Mails im Postfach.</p>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Rechnungen -->
            <BCol xs="12" class="mb-4">
                <BCard>
                    <BCardHeader class="d-flex align-items-center justify-content-between">
                        <BCardTitle class="d-flex align-items-center mb-0">
                            <FileText class="h-5 w-5 text-primary me-2" />
                            Rechnungen
                        </BCardTitle>
                        <Link :href="billing.index.url()" class="small text-primary">
                            Alle anzeigen
                        </Link>
                    </BCardHeader>
                    <BCardBody>
                        <ul v-if="recentInvoices.length" class="list-unstyled mb-0">
                            <li
                                v-for="inv in recentInvoices"
                                :key="inv.id"
                                class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-3 border-bottom"
                            >
                                <div>
                                    <p class="fw-medium mb-0">{{ inv.invoice_date }} – {{ inv.number }}</p>
                                    <small class="text-muted">{{ inv.status }}</small>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-semibold">{{ inv.amount }}</span>
                                    <Link :href="inv.show_url" class="btn btn-soft-primary btn-sm">
                                        Zur Rechnung <ExternalLink class="inline ms-1" size="12" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                        <p v-else class="text-muted mb-0">Keine Rechnungen vorhanden.</p>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    Activity,
    Wallet,
    Coins,
    CalendarCheck,
    Trophy,
    HeartPulse,
    Server,
    Inbox,
    FileText,
    ExternalLink,
    Check,
    AlertTriangle,
    Globe,
    Gamepad2,
    KeyRound,
    Layout,
} from 'lucide-vue-next';
import {
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BCol,
    BRow,
} from 'bootstrap-vue-next';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import PageBreadcrumb from '@/components/PageBreadcrumb.vue';
import { dashboard } from '@/routes';
import billing from '@/routes/billing';
import postfach from '@/routes/postfach';

type Stats = {
    activeServicesCount: number;
    customerBalance: number | null;
    dueIn30Days: number;
    registeredAt: string;
    balanceTopUpUrl: string | null;
};

type StatusData = {
    level: string;
    label: string;
    balanceOk: boolean;
    balanceMessage: string | null;
    ticketsOk: boolean;
    ticketItems: Array<{ id: number; subject: string; url: string }>;
};

type FavoriteItem = { name: string; href: string };
type ActiveServiceItem = { name: string; url: string; type: string };
type RecentEmailItem = {
    id: number;
    subject: string;
    snippet: string | null;
    sent_at: string | null;
};
type RecentInvoiceItem = {
    id: number;
    number: string;
    amount: string;
    status: string;
    invoice_date: string | null;
    pdf_path: string | null;
    show_url: string;
};

const props = defineProps<{
    stats: Stats;
    status: StatusData;
    favorites: FavoriteItem[];
    activeServices: ActiveServiceItem[];
    recentEmails: RecentEmailItem[];
    recentInvoices: RecentInvoiceItem[];
    brandFeatures: Record<string, unknown>;
    supportPin: string;
    supportPinValidUntil: string;
}>();

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

const showBalanceCard = computed(() => props.stats.customerBalance !== null);

const serviceTypeLabel: Record<string, string> = {
    site: 'Site',
    domain: 'Domain',
    webspace: 'Webspace',
    gaming: 'Game Server',
};

function getServiceTypeLabel(type: string): string {
    return serviceTypeLabel[type] ?? type;
}

const serviceTypeIcon: Record<string, typeof Server> = {
    site: Layout,
    domain: Globe,
    webspace: Server,
    gaming: Gamepad2,
};

function getServiceIcon(type: string) {
    return serviceTypeIcon[type] ?? Server;
}
</script>
