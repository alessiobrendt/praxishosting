<!-- Admin: Gameserver-Cloud-Accounts -->
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

type User = { id: number; name: string; email: string } | null;
type GameserverCloudPlan = {
    id: number;
    name: string;
    config: Record<string, number>;
};

type Subscription = {
    id: number;
    uuid: string;
    user: User;
    gameserver_cloud_plan: GameserverCloudPlan;
    status: string;
    current_period_ends_at: string | null;
    used_cpu: number;
    used_memory_mb: number;
    used_disk_mb: number;
    remaining_cpu: number;
    remaining_memory_mb: number;
    remaining_disk_mb: number;
    max_cpu: number;
    max_memory_mb: number;
    max_disk_gb: number;
    servers_count: number;
};

type Props = {
    subscriptions: {
        data: Subscription[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasGameserverCloud: boolean;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gameserver-Cloud-Accounts', href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function usageLabel(sub: Subscription): string {
    const parts: string[] = [];
    parts.push(`${sub.used_cpu} % CPU`);
    parts.push(`${Math.round(sub.used_memory_mb / 1024)} GB RAM`);
    parts.push(`${Math.round(sub.used_disk_mb / 1024)} GB Disk`);
    return parts.join(' · ');
}

const tableFields = [
    { key: 'customer', label: 'Kunde', sortable: false },
    { key: 'plan', label: 'Cloud-Plan', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'period_end', label: 'Abo-Ende', sortable: false },
    { key: 'usage', label: 'Verbrauch', sortable: false },
    { key: 'servers_count', label: 'Server', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gameserver-Cloud-Accounts" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Gameserver-Cloud-Accounts</h4>
                    <p class="text-muted small mb-0">
                        Gemietete Clouds (Abos) mit zugehörigen Game-Servern
                    </p>
                </div>

                <BCard v-if="!brandHasGameserverCloud" no-body>
                    <BCardBody class="py-5 text-center text-muted">
                        Für diese Marke ist das Feature „Gameserver Cloud“ nicht aktiviert.
                    </BCardBody>
                </BCard>

                <template v-else>
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Alle Cloud-Abos</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Kunde, Cloud-Plan, Status, Abo-Ende, Verbrauch, Anzahl Server
                            </p>
                        </BCardHeader>
                        <BCardBody class="p-0">
                            <BTable
                                :items="props.subscriptions.data"
                                :fields="tableFields"
                                striped
                                responsive
                                class="mb-0"
                                show-empty
                                empty-text="Keine Gameserver-Cloud-Abos vorhanden"
                            >
                                <template #cell(customer)="row">
                                    <template v-if="row.item.user">
                                        <div class="fw-medium">{{ row.item.user.name }}</div>
                                        <div class="small text-muted">{{ row.item.user.email }}</div>
                                    </template>
                                    <span v-else class="text-muted">–</span>
                                </template>
                                <template #cell(plan)="row">
                                    {{ row.item.gameserver_cloud_plan?.name ?? '–' }}
                                </template>
                                <template #cell(status)="row">
                                    <BBadge variant="secondary">{{ row.item.status }}</BBadge>
                                </template>
                                <template #cell(period_end)="row">
                                    {{ formatDate(row.item.current_period_ends_at) }}
                                </template>
                                <template #cell(usage)="row">
                                    <span class="small text-muted">{{ usageLabel(row.item) }}</span>
                                </template>
                                <template #cell(actions)="row">
                                    <Link :href="`/admin/gameserver-cloud-accounts/${row.item.uuid}`">
                                        <BButton variant="outline-primary" size="sm">
                                            <Icon icon="eye" class="me-1" />
                                            Ansehen
                                        </BButton>
                                    </Link>
                                </template>
                            </BTable>
                            <nav
                                v-if="props.subscriptions.links && props.subscriptions.links.length > 3"
                                class="d-flex justify-content-center p-3"
                            >
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in props.subscriptions.links"
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
                </template>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
