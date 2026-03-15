<!-- Admin: Gameserver-Cloud-Pläne -->
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
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

type HostingServer = { id: number; name: string; hostname: string };

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    is_active: boolean;
    sort_order: number;
    hosting_server: HostingServer | null;
};

type Props = {
    gameserverCloudPlans: {
        data: GameserverCloudPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gameserver-Cloud-Pläne', href: '#' },
];

function destroy(plan: GameserverCloudPlan) {
    if (!confirm(`Plan „${plan.name}" wirklich löschen?`)) return;
    router.delete(`/admin/gameserver-cloud-plans/${plan.id}`);
}

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'server', label: 'Pterodactyl-Server', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gameserver-Cloud-Pläne" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Gameserver-Cloud-Pläne</h4>
                        <p class="text-muted small mb-0">
                            Ressourcen-Pools für die Gameserver Cloud (CPU, RAM, Disk). Kunden kaufen ein Abo und
                            legen daraus beliebig viele Game-Server an.
                        </p>
                    </div>
                    <Link href="/admin/gameserver-cloud-plans/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neuer Plan
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Pläne</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Pro Brand; Pterodactyl-Server und Limits (max_cpu, max_memory_mb, max_disk_gb) in
                            config.
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="props.gameserverCloudPlans.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Pläne"
                        >
                            <template #cell(name)="row">
                                <span class="fw-medium">{{ row.item.name }}</span>
                            </template>
                            <template #cell(price)="row">
                                {{ row.item.price }} €
                            </template>
                            <template #cell(server)="row">
                                <span class="small text-muted">
                                    {{ row.item.hosting_server?.name ?? row.item.hosting_server?.hostname ?? '–' }}
                                </span>
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Aktiv' : 'Inaktiv' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link
                                    :href="`/admin/gameserver-cloud-plans/${row.item.id}/edit`"
                                    class="me-2"
                                >
                                    <BButton variant="outline-primary" size="sm" title="Bearbeiten">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <BButton
                                    variant="outline-danger"
                                    size="sm"
                                    title="Löschen"
                                    @click="destroy(row.item)"
                                >
                                    <Icon icon="trash" />
                                </BButton>
                            </template>
                        </BTable>
                        <nav
                            v-if="props.gameserverCloudPlans.links && props.gameserverCloudPlans.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in props.gameserverCloudPlans.links"
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
