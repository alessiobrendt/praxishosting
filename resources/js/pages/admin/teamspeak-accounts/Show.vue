<!-- Admin: TeamSpeak-Server-Account (Detail) -->
<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string; config?: { plan_options?: unknown[] } };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    uuid: string;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    option_values?: Record<string, unknown> | null;
    mollie_subscription_id?: string | null;
    cancel_at_period_end?: boolean;
    renewal_type?: string | null;
    monthly_amount?: number;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccount: TeamSpeakServerAccount;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
    { title: props.teamSpeakServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

const slots = (props.teamSpeakServerAccount.option_values?.slots as number) ?? null;
const renewalLabel = props.teamSpeakServerAccount.renewal_type === 'auto' ? 'Auto (Mollie-Abo)' : 'Manuell';
const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`TeamSpeak: ${teamSpeakServerAccount.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <Icon icon="headphones" class="fs-4 text-primary" />
                        <div>
                            <h4 class="mb-1">{{ teamSpeakServerAccount.name }}</h4>
                            <p class="text-muted small mb-0">
                                TeamSpeak-Server – Kunde: {{ teamSpeakServerAccount.user.name }}
                            </p>
                        </div>
                    </div>
                    <BBadge variant="secondary">{{ teamSpeakServerAccount.status }}</BBadge>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Account-Daten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde und Zuordnung</p>
                    </BCardHeader>
                    <BCardBody>
                        <BRow>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Kunde</p>
                                <p class="fw-medium mb-0">{{ teamSpeakServerAccount.user.name }}</p>
                                <p class="small text-muted mb-0">{{ teamSpeakServerAccount.user.email }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Server-Name</p>
                                <p class="fw-medium mb-0">{{ teamSpeakServerAccount.name }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Port / Virtual Server ID</p>
                                <p class="fw-medium mb-0">
                                    <span v-if="teamSpeakServerAccount.port != null">{{ teamSpeakServerAccount.port }}</span>
                                    <span v-else class="text-muted">–</span>
                                    <span v-if="teamSpeakServerAccount.virtual_server_id != null" class="text-muted">
                                        (ID: {{ teamSpeakServerAccount.virtual_server_id }})
                                    </span>
                                </p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Plan / Hosting-Server</p>
                                <p class="fw-medium mb-0">{{ teamSpeakServerAccount.hosting_plan.name }}</p>
                                <p class="small text-muted mb-0">{{ teamSpeakServerAccount.hosting_server?.name ?? teamSpeakServerAccount.hosting_server?.hostname ?? '–' }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Abo-Ende</p>
                                <p class="fw-medium mb-0">{{ formatDate(teamSpeakServerAccount.current_period_ends_at) }}</p>
                            </BCol>
                            <BCol v-if="slots != null" md="6">
                                <p class="text-muted small mb-1">Slots</p>
                                <p class="fw-medium mb-0">{{ slots }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Verlängerung</p>
                                <p class="fw-medium mb-0">{{ renewalLabel }}</p>
                            </BCol>
                            <BCol v-if="teamSpeakServerAccount.monthly_amount != null" md="6">
                                <p class="text-muted small mb-1">Monatspreis</p>
                                <p class="fw-medium mb-0">{{ teamSpeakServerAccount.monthly_amount?.toFixed(2) }} €</p>
                            </BCol>
                        </BRow>
                    </BCardBody>
                    <BCardFooter class="d-flex flex-wrap gap-2">
                        <Link :href="`/admin/teamspeak-accounts/${teamSpeakServerAccount.uuid}/edit`">
                            <BButton variant="primary">
                                <Icon icon="pencil" class="me-1" />Bearbeiten
                            </BButton>
                        </Link>
                        <a :href="`/teamspeak-accounts/${teamSpeakServerAccount.uuid}`" target="_blank" rel="noopener noreferrer">
                            <BButton variant="outline-secondary">
                                <Icon icon="external-link" class="me-1" />Als Kunde ansehen
                            </BButton>
                        </a>
                    </BCardFooter>
                </BCard>

                <BCard v-if="teamSpeakServerAccount.mollie_subscription_id" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                            <Icon icon="credit-card" />Mollie-Abo
                        </BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Subscription bei Mollie – Abo kündigen zum Periodenende</p>
                    </BCardHeader>
                    <BCardBody>
                        <p class="text-muted small mb-1">Subscription-ID</p>
                        <p class="font-monospace small mb-0">{{ teamSpeakServerAccount.mollie_subscription_id }}</p>
                        <p v-if="teamSpeakServerAccount.cancel_at_period_end" class="text-warning small mt-2 mb-0">
                            Wird zum Periodenende gekündigt.
                        </p>
                    </BCardBody>
                    <BCardFooter class="d-flex flex-wrap gap-2">
                        <a href="https://www.mollie.com/dashboard/customers" target="_blank" rel="noopener noreferrer">
                            <BButton variant="outline-secondary" size="sm">
                                <Icon icon="external-link" class="me-1" />Bei Mollie anzeigen
                            </BButton>
                        </a>
                        <Form
                            v-if="!teamSpeakServerAccount.cancel_at_period_end"
                            :action="`/admin/teamspeak-accounts/${teamSpeakServerAccount.uuid}/subscription/cancel`"
                            method="post"
                            class="d-inline"
                        >
                            <input type="hidden" name="_token" :value="csrfToken()" />
                            <BButton type="submit" variant="outline-warning" size="sm">Abo kündigen</BButton>
                        </Form>
                    </BCardFooter>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
