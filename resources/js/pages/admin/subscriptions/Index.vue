<!-- Admin: Abonnements-Übersicht -->
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
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SiteSubscription = {
    id: number;
    mollie_subscription_id: string | null;
    mollie_status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    site?: {
        id: number;
        uuid?: string;
        name: string;
        template?: { name: string };
        user?: { name: string; email: string };
    };
};

type Props = {
    subscriptions: {
        data: SiteSubscription[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Abos', href: '#' },
];

const tableFields = [
    { key: 'site_name', label: 'Site', sortable: false },
    { key: 'customer', label: 'Kunde', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'current_period_ends_at', label: 'Laufzeitende', sortable: false },
    { key: 'mollie_subscription_id', label: 'Mollie', sortable: false },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Abos" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Abos</h4>
                    <p class="text-muted small mb-0">Übersicht aller Site-Abonnements</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Abonnements</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Site, Kunde, Status, Laufzeitende</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="subscriptions.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Abos vorhanden"
                        >
                            <template #cell(site_name)="row">
                                <Link
                                    v-if="row.item.site"
                                    :href="`/admin/sites/${row.item.site.uuid ?? row.item.site.id}`"
                                    class="text-primary text-decoration-none fw-medium"
                                >
                                    {{ row.item.site.name }}
                                </Link>
                                <span v-else>–</span>
                            </template>
                            <template #cell(customer)="row">
                                <span v-if="row.item.site?.user">
                                    {{ row.item.site.user.name }} ({{ row.item.site.user.email }})
                                </span>
                                <span v-else>–</span>
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item.mollie_status === 'active' ? 'success' : 'warning'">
                                    {{ row.item.mollie_status }}
                                </BBadge>
                                <span v-if="row.item.cancel_at_period_end" class="ms-1 small text-warning">Läuft aus</span>
                            </template>
                            <template #cell(mollie_subscription_id)="row">
                                <code v-if="row.item.mollie_subscription_id" class="small">{{ row.item.mollie_subscription_id }}</code>
                                <span v-else>–</span>
                            </template>
                        </BTable>
                        <nav v-if="subscriptions.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in subscriptions.links"
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
