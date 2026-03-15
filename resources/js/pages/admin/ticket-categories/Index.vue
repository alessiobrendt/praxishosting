<!-- Admin: Ticket-Kategorien -->
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

type TicketCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    ticketCategories: {
        data: TicketCategory[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Kategorien', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Kategorie wirklich löschen?')) {
        router.delete(`/admin/ticket-categories/${id}`);
    }
}

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'slug', label: 'Slug', sortable: false },
    { key: 'sort_order', label: 'Sortierung', sortable: false },
    { key: 'is_active', label: 'Aktiv', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Ticket-Kategorien" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Ticket-Kategorien</h4>
                        <p class="text-muted small mb-0">Kategorien für Support-Tickets verwalten</p>
                    </div>
                    <Link href="/admin/ticket-categories/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Kategorien</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Name, Slug, Sortierung, Aktiv</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="ticketCategories.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Kategorien"
                        >
                            <template #cell(slug)="row">
                                <code class="small">{{ row.item.slug }}</code>
                            </template>
                            <template #cell(is_active)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Ja' : 'Nein' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/ticket-categories/${row.item.id}/edit`" class="me-1">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                    <Icon icon="trash" />
                                </BButton>
                            </template>
                        </BTable>
                        <nav v-if="ticketCategories.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in ticketCategories.links"
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
