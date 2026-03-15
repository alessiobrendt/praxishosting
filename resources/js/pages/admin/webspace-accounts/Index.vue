<!-- Admin: Webspace-Accounts-Übersicht -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; hostname: string } | null;

type WebspaceAccount = {
    id: number;
    uuid: string;
    domain: string;
    status: string;
    current_period_ends_at: string | null;
    mollie_subscription_id: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    webspaceAccounts: {
        data: WebspaceAccount[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Accounts', href: '/admin/webspace-accounts' },
];

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
}

const tableFields = [
    { key: 'user_display', label: 'Kunde', sortable: false },
    { key: 'domain', label: 'Domain', sortable: false },
    { key: 'plan', label: 'Plan', sortable: false },
    { key: 'server', label: 'Server', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'period_end', label: 'Abo-Ende', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Webspace-Accounts" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Webspace-Accounts</h4>
                    <p class="text-muted small mb-0">Alle verkauften Plesk-Webspace-Accounts</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Accounts</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde, Domain, Plan, Status</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="webspaceAccounts.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Webspace-Accounts vorhanden"
                        >
                            <template #cell(user_display)="row">
                                <div class="fw-medium">{{ row.item.user.name }}</div>
                                <div class="small text-muted">{{ row.item.user.email }}</div>
                            </template>
                            <template #cell(domain)="row">
                                <code class="bg-light rounded px-2 py-1 small">{{ row.item.domain }}</code>
                            </template>
                            <template #cell(plan)="row">
                                {{ row.item.hosting_plan.name }}
                            </template>
                            <template #cell(server)="row">
                                {{ row.item.hosting_server?.hostname ?? '–' }}
                            </template>
                            <template #cell(status)="row">
                                <BBadge variant="secondary">{{ row.item.status }}</BBadge>
                            </template>
                            <template #cell(period_end)="row">
                                {{ formatDate(row.item.current_period_ends_at) }}
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/webspace-accounts/${row.item.uuid}`">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="eye" class="me-1" />
                                        Details
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav
                            v-if="webspaceAccounts.links && webspaceAccounts.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in webspaceAccounts.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" href="#" @click.prevent="link.url && (window.location.href = link.url)" v-html="link.label" />
                                    <span v-else class="page-link" v-html="link.label" />
                                </li>
                            </ul>
                        </nav>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
