<!-- Admin: Kundenübersicht -->
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
import { index as customersIndex, show as customersShow } from '@/routes/admin/customers';
import type { BreadcrumbItem } from '@/types';

type Customer = {
    id: number;
    name: string;
    email: string;
    sites_count: number;
    brand?: { id: number; key: string; name: string } | null;
};

type Props = {
    customers: {
        data: Customer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
];

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'email', label: 'E-Mail', sortable: false },
    { key: 'brand_name', label: 'Marke', sortable: false },
    { key: 'sites_count', label: 'Anzahl Sites', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];

</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Kunden" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Kunden</h4>
                    <p class="text-muted small mb-0">Übersicht aller Kunden und deren Webseiten</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Kunden</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Verwaltung der Kundenkonten</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="customers.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Kunden vorhanden"
                        >
                            <template #cell(brand_name)="row">
                                <BBadge v-if="row.item.brand" variant="secondary">
                                    {{ row.item.brand.name }}
                                </BBadge>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(sites_count)="row">
                                <BBadge variant="info">{{ row.item.sites_count }}</BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="customersShow({ customer: row.item.id }).url">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="eye" class="me-1" />
                                        Details
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav v-if="customers.links && customers.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in customers.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a
                                        v-if="link.url"
                                        class="page-link"
                                        :href="link.url"
                                        v-html="link.label"
                                    />
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
