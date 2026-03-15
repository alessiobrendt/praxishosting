<!-- Admin: TeamSpeak-Server-Accounts -->
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
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    uuid: string;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccounts: {
        data: TeamSpeakServerAccount[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasTeamSpeak: boolean;
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
];

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
}

const tableFields = [
    { key: 'customer', label: 'Kunde', sortable: false },
    { key: 'name', label: 'Server-Name', sortable: false },
    { key: 'port', label: 'Port', sortable: false },
    { key: 'plan', label: 'Plan', sortable: false },
    { key: 'server', label: 'Server', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'period_end', label: 'Abo-Ende', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="TeamSpeak-Server-Accounts" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center gap-2">
                    <Icon icon="headphones" class="fs-4 text-primary" />
                    <div>
                        <h4 class="mb-1">TeamSpeak-Server-Accounts</h4>
                        <p class="text-muted small mb-0">Alle verkauften TeamSpeak-Server-Accounts dieser Marke</p>
                    </div>
                </div>

                <BCard v-if="!brandHasTeamSpeak" no-body>
                    <BCardBody class="py-5 text-center text-muted">
                        Für diese Marke ist das Feature „TeamSpeak“ nicht aktiviert. TeamSpeak-Accounts werden nur für
                        Marken mit aktiviertem TeamSpeak angezeigt.
                    </BCardBody>
                </BCard>

                <BCard v-else no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Accounts</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde, Server-Name, Plan, Status</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="teamSpeakServerAccounts.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine TeamSpeak-Server-Accounts vorhanden"
                        >
                            <template #cell(customer)="row">
                                <div class="fw-medium">{{ row.item.user.name }}</div>
                                <div class="small text-muted">{{ row.item.user.email }}</div>
                            </template>
                            <template #cell(port)="row">
                                <span v-if="row.item.port != null">{{ row.item.port }}</span>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(plan)="row">
                                {{ row.item.hosting_plan.name }}
                            </template>
                            <template #cell(server)="row">
                                {{ row.item.hosting_server?.name ?? row.item.hosting_server?.hostname ?? '–' }}
                            </template>
                            <template #cell(status)="row">
                                <BBadge variant="secondary">{{ row.item.status }}</BBadge>
                            </template>
                            <template #cell(period_end)="row">
                                {{ formatDate(row.item.current_period_ends_at) }}
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/teamspeak-accounts/${row.item.uuid}`">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="eye" />
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav
                            v-if="brandHasTeamSpeak && teamSpeakServerAccounts.links && teamSpeakServerAccounts.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in teamSpeakServerAccounts.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" :href="link.url" v-html="link.label" />
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
