<!-- Admin: Template-Übersicht -->
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
import templatesRoutes from '@/routes/admin/templates';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    price: string;
};

type Props = {
    templates: {
        data: Template[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templatesRoutes.index().url },
];

function handlePagination(url: string): void {
    if (url) window.location.href = url;
}

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'slug', label: 'Slug', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Templates" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h4 class="mb-1">Templates</h4>
                        <p class="text-muted small mb-0">Verwalten Sie Website-Templates</p>
                    </div>
                    <Link :href="templatesRoutes.create().url">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />Neues Template
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle Templates</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Übersicht aller verfügbaren Templates</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="props.templates.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Templates vorhanden"
                        >
                            <template #cell(name)="row">
                                <span class="fw-medium">{{ row.item.name }}</span>
                            </template>
                            <template #cell(slug)="row">
                                <code class="bg-light rounded px-2 py-1 small">{{ row.item.slug }}</code>
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'danger'">
                                    {{ row.item.is_active ? 'Aktiv' : 'Inaktiv' }}
                                </BBadge>
                            </template>
                            <template #cell(price)="row">
                                {{ row.item.price }} €
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="templatesRoutes.show({ template: row.item.id }).url" class="me-1">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="eye" />
                                    </BButton>
                                </Link>
                                <Link :href="templatesRoutes.edit({ template: row.item.id }).url">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav v-if="props.templates.links && props.templates.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in props.templates.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" href="#" @click.prevent="handlePagination(link.url!)" v-html="link.label" />
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
