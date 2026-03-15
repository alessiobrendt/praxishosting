<!-- Admin: Sites-Übersicht -->
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
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SiteSubscription = {
    id: number;
    mollie_status: string;
    current_period_ends_at: string | null;
};

type Site = {
    id: number;
    uuid?: string;
    name: string;
    slug: string;
    status: string;
    is_legacy: boolean;
    template?: { name: string };
    user?: { id: number; name: string; email: string };
    siteSubscription?: SiteSubscription | null;
};

type Props = {
    sites: { data: Site[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { status?: string; legacy?: string };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Sites', href: '#' },
];

function applyFilter(key: string, value: string | null): void {
    router.get('/admin/sites', { ...props.filters, [key]: value || undefined }, { preserveState: true });
}

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'owner', label: 'Besitzer', sortable: false },
    { key: 'template', label: 'Template', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'legacy', label: 'Legacy', sortable: false },
    { key: 'period_end', label: 'Abo Ende', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Sites (Admin)" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Sites</h4>
                    <p class="text-muted small mb-0">Alle Webseiten mit Status und Abo</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Sites</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Filter:
                            <BButton
                                variant="link"
                                size="sm"
                                class="p-0 me-2 text-dark"
                                :class="{ 'fw-bold': !filters.status }"
                                @click="applyFilter('status', null)"
                            >
                                Alle
                            </BButton>
                            <BButton
                                variant="link"
                                size="sm"
                                class="p-0 me-2 text-dark"
                                :class="{ 'fw-bold': filters.status === 'active' }"
                                @click="applyFilter('status', 'active')"
                            >
                                Aktiv
                            </BButton>
                            <BButton
                                variant="link"
                                size="sm"
                                class="p-0 me-2 text-dark"
                                :class="{ 'fw-bold': filters.status === 'suspended' }"
                                @click="applyFilter('status', 'suspended')"
                            >
                                Gesperrt
                            </BButton>
                            |
                            <BButton
                                variant="link"
                                size="sm"
                                class="p-0 ms-1 text-dark"
                                :class="{ 'fw-bold': filters.legacy === '1' }"
                                @click="applyFilter('legacy', filters.legacy === '1' ? '' : '1')"
                            >
                                Nur Legacy
                            </BButton>
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="sites.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Sites"
                        >
                            <template #cell(owner)="row">
                                <span v-if="row.item.user">{{ row.item.user.name }} ({{ row.item.user.email }})</span>
                                <span v-else>–</span>
                            </template>
                            <template #cell(template)="row">
                                {{ row.item.template?.name ?? '–' }}
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item.status === 'active' ? 'success' : 'secondary'">
                                    {{ row.item.status }}
                                </BBadge>
                            </template>
                            <template #cell(legacy)="row">
                                {{ row.item.is_legacy ? 'Ja' : 'Nein' }}
                            </template>
                            <template #cell(period_end)="row">
                                {{ row.item.siteSubscription?.current_period_ends_at ?? '–' }}
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/sites/${row.item.uuid ?? row.item.id}`">
                                    <BButton variant="outline-primary" size="sm">Verwalten</BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav v-if="sites.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in sites.links"
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
