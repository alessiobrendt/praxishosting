<!-- Admin: Webspace-Account (Detail) -->
<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
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
import { notify } from '@/composables/useNotify';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type WebspaceAccount = {
    id: number;
    uuid: string;
    domain: string;
    plesk_username: string;
    status: string;
    mollie_subscription_id: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    ends_at: string | null;
    user: { id: number; name: string; email: string };
    hosting_plan: { id: number; name: string };
    hosting_server: { id: number; hostname: string } | null;
};

type Props = {
    webspaceAccount: WebspaceAccount;
};

const props = defineProps<Props>();

const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';

watch(
    () => (page.props.flash as { error?: string; success?: string; warning?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const canRetryPlesk = () =>
    props.webspaceAccount.status === 'pending' || props.webspaceAccount.status === 'active';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Accounts', href: '/admin/webspace-accounts' },
    { title: props.webspaceAccount.domain, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="webspaceAccount.domain" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <Icon icon="server" class="fs-4 text-primary" />
                        <div>
                            <h4 class="mb-1">{{ webspaceAccount.domain }}</h4>
                            <p class="text-muted small mb-0">
                                Webspace-Account · {{ webspaceAccount.hosting_plan.name }}
                            </p>
                        </div>
                    </div>
                    <Form
                        v-if="canRetryPlesk()"
                        :action="`/admin/webspace-accounts/${webspaceAccount.uuid}/retry-plesk`"
                        method="post"
                        class="d-inline"
                    >
                        <input type="hidden" name="_token" :value="csrfToken()" />
                        <BButton type="submit" variant="outline-primary">Plesk-Anlage erneut ausführen</BButton>
                    </Form>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Details</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde, Domain, Plan, Server, Status, Abo-Ende</p>
                    </BCardHeader>
                    <BCardBody>
                        <BRow>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Kunde</p>
                                <p class="fw-medium mb-0">{{ webspaceAccount.user.name }}</p>
                                <p class="small text-muted mb-0">{{ webspaceAccount.user.email }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Domain</p>
                                <code class="bg-light rounded px-2 py-1 small">{{ webspaceAccount.domain }}</code>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Plesk-Benutzer</p>
                                <p class="font-monospace small mb-0">{{ webspaceAccount.plesk_username }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Plan</p>
                                <Link :href="`/admin/hosting-plans/${webspaceAccount.hosting_plan.id}`" class="text-primary fw-medium">
                                    {{ webspaceAccount.hosting_plan.name }}
                                </Link>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Server</p>
                                <p class="fw-medium mb-0">{{ webspaceAccount.hosting_server?.hostname ?? '–' }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Status</p>
                                <BBadge variant="secondary">{{ webspaceAccount.status }}</BBadge>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Abo-Ende (aktueller Zeitraum)</p>
                                <p class="fw-medium mb-0">{{ formatDate(webspaceAccount.current_period_ends_at) }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Kündigung zum Periodenende</p>
                                <p class="fw-medium mb-0">{{ webspaceAccount.cancel_at_period_end ? 'Ja' : 'Nein' }}</p>
                            </BCol>
                            <BCol md="6">
                                <p class="text-muted small mb-1">Beendet am</p>
                                <p class="fw-medium mb-0">{{ formatDate(webspaceAccount.ends_at) }}</p>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>

                <BCard v-if="webspaceAccount.mollie_subscription_id" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                            <Icon icon="credit-card" />Mollie-Abo
                        </BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Subscription bei Mollie – Abo kündigen zum Periodenende</p>
                    </BCardHeader>
                    <BCardBody>
                        <p class="text-muted small mb-1">Subscription-ID</p>
                        <p class="font-monospace small mb-0">{{ webspaceAccount.mollie_subscription_id }}</p>
                        <p v-if="webspaceAccount.cancel_at_period_end" class="text-warning small mt-2 mb-0">
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
                            v-if="!webspaceAccount.cancel_at_period_end"
                            :action="`/admin/webspace-accounts/${webspaceAccount.uuid}/subscription/cancel`"
                            method="post"
                            class="d-inline"
                        >
                            <input type="hidden" name="_token" :value="csrfToken()" />
                            <BButton type="submit" variant="outline-warning" size="sm">Abo kündigen</BButton>
                        </Form>
                    </BCardFooter>
                </BCard>

                <div class="mt-3">
                    <Link href="/admin/webspace-accounts">
                        <BButton variant="outline-secondary">Zurück zur Liste</BButton>
                    </Link>
                </div>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
