<!-- Admin: Produktübersicht -->
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

const typeLabels: Record<string, string> = {
    meine_seiten: 'Meine Seiten',
    webspace: 'Webspace',
    domain: 'Domain',
};

type Product = {
    id: number;
    name: string;
    key: string;
    type: string;
    productable_name: string;
    edit_url: string | null;
    stripe_product_id: string | null;
    is_active: boolean;
    brand?: { id: number; key: string; name: string } | null;
};

type Props = {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Produkte', href: '/admin/products' },
];

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'key', label: 'Key', sortable: false },
    { key: 'type', label: 'Typ', sortable: false },
    { key: 'brand_name', label: 'Marke', sortable: false },
    { key: 'productable_name', label: 'Verknüpftes Angebot', sortable: false },
    { key: 'stripe_product_id', label: 'Produkt-ID', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Produkte" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Produkte</h4>
                    <p class="text-muted small mb-0">Gemeinsame Übersicht aller verkaufbaren Produkte</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Produkte</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Meine Seiten, Webspace und Domain-Angebote</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="products.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Produkte vorhanden"
                        >
                            <template #cell(key)="row">
                                <code class="bg-light rounded px-2 py-1 small">{{ row.item.key }}</code>
                            </template>
                            <template #cell(type)="row">
                                <BBadge variant="secondary">
                                    {{ typeLabels[row.item.type] ?? row.item.type }}
                                </BBadge>
                            </template>
                            <template #cell(brand_name)="row">
                                <BBadge v-if="row.item.brand" variant="secondary">
                                    {{ row.item.brand.name }}
                                </BBadge>
                                <span v-else class="text-muted">Alle</span>
                            </template>
                            <template #cell(stripe_product_id)="row">
                                <code class="small">{{ row.item.stripe_product_id ?? '–' }}</code>
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'danger'">
                                    {{ row.item.is_active ? 'Aktiv' : 'Inaktiv' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link v-if="row.item.edit_url" :href="row.item.edit_url">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <span v-else class="text-muted">–</span>
                            </template>
                        </BTable>
                        <nav v-if="products.links && products.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in products.links"
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
