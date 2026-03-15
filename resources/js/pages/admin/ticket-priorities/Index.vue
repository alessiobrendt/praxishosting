<!-- Admin: Ticket-Prioritäten -->
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

type TicketPriority = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    ticketPriorities: {
        data: TicketPriority[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Prioritäten', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Priorität wirklich löschen?')) {
        router.delete(`/admin/ticket-priorities/${id}`);
    }
}

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'slug', label: 'Slug', sortable: false },
    { key: 'color', label: 'Farbe', sortable: false },
    { key: 'sort_order', label: 'Sortierung', sortable: false },
    { key: 'is_active', label: 'Aktiv', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Ticket-Prioritäten" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Ticket-Prioritäten</h4>
                        <p class="text-muted small mb-0">Prioritäten für Support-Tickets verwalten</p>
                    </div>
                    <Link href="/admin/ticket-priorities/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Prioritäten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Name, Slug, Farbe, Sortierung, Aktiv</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="ticketPriorities.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Prioritäten"
                        >
                            <template #cell(slug)="row">
                                <code class="small">{{ row.item.slug }}</code>
                            </template>
                            <template #cell(color)="row">
                                <BBadge
                                    v-if="row.item.color"
                                    :style="{
                                        backgroundColor: row.item.color,
                                        color: '#fff',
                                        border: 'none',
                                    }"
                                >
                                    {{ row.item.color }}
                                </BBadge>
                                <span v-else>–</span>
                            </template>
                            <template #cell(is_active)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Ja' : 'Nein' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/ticket-priorities/${row.item.id}/edit`" class="me-1">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                    <Icon icon="trash" />
                                </BButton>
                            </template>
                        </BTable>
                        <nav v-if="ticketPriorities.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in ticketPriorities.links"
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
