<!-- Admin: Support-Tickets-Übersicht -->
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { reactive } from 'vue';
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
    BFormSelect,
    BFormGroup,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import adminTickets from '@/routes/admin/tickets';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email?: string };
type Site = { id: number; name: string; slug: string } | null;
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;

type Ticket = {
    id: number;
    uuid?: string;
    subject: string;
    status: string;
    created_at: string;
    user?: User;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority;
    site?: Site;
    assigned_to?: User | null;
};

type Props = {
    tickets: { data: Ticket[]; links: { url: string | null; label: string; active: boolean }[] };
    categories: TicketCategory[];
    priorities: TicketPriority[];
    admins: User[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Tickets', href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const filters = reactive({
    status: '',
    ticket_category_id: '',
    ticket_priority_id: '',
    user_id: '',
    assigned_to: '',
});

function applyFilters(): void {
    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.ticket_category_id) params.ticket_category_id = filters.ticket_category_id;
    if (filters.ticket_priority_id) params.ticket_priority_id = filters.ticket_priority_id;
    if (filters.user_id) params.user_id = filters.user_id;
    if (filters.assigned_to) params.assigned_to = filters.assigned_to;
    router.get('/admin/tickets', params);
}

const statusOptions = [
    { value: '', text: 'Alle' },
    ...Object.entries(statusLabels).map(([value, text]) => ({ value, text })),
];

const tableFields = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'customer', label: 'Kunde', sortable: false },
    { key: 'subject', label: 'Betreff', sortable: false },
    { key: 'category', label: 'Kategorie', sortable: false },
    { key: 'priority', label: 'Priorität', sortable: false },
    { key: 'site_name', label: 'Site', sortable: false },
    { key: 'status_display', label: 'Status', sortable: false },
    { key: 'assigned_to_name', label: 'Zugewiesen', sortable: false },
    { key: 'created_at', label: 'Erstellt', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Support-Tickets" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Support-Tickets</h4>
                    <p class="text-muted small mb-0">Alle Support-Anfragen verwalten</p>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Filter</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Status, Kategorie, Priorität</p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex flex-wrap align-items-end gap-3">
                            <BFormGroup label="Status" label-for="filter_status" class="mb-0">
                                <BFormSelect
                                    id="filter_status"
                                    v-model="filters.status"
                                    :options="statusOptions"
                                    class="form-select-sm"
                                    style="min-width: 12rem"
                                />
                            </BFormGroup>
                            <BFormGroup label="Kategorie" label-for="filter_category" class="mb-0">
                                <BFormSelect
                                    id="filter_category"
                                    v-model="filters.ticket_category_id"
                                    :options="[{ value: '', text: 'Alle' }, ...categories.map((c) => ({ value: String(c.id), text: c.name }))]"
                                    class="form-select-sm"
                                    style="min-width: 12rem"
                                />
                            </BFormGroup>
                            <BFormGroup label="Priorität" label-for="filter_priority" class="mb-0">
                                <BFormSelect
                                    id="filter_priority"
                                    v-model="filters.ticket_priority_id"
                                    :options="[{ value: '', text: 'Alle' }, ...priorities.map((p) => ({ value: String(p.id), text: p.name }))]"
                                    class="form-select-sm"
                                    style="min-width: 12rem"
                                />
                            </BFormGroup>
                            <BButton variant="primary" @click="applyFilters">Filter anwenden</BButton>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Tickets</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde, Betreff, Status, Priorität, Produkt</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tickets.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Tickets"
                        >
                            <template #cell(id)="row">
                                #{{ row.item.id }}
                            </template>
                            <template #cell(customer)="row">
                                <span v-if="row.item.user">{{ row.item.user.name }}</span>
                                <br v-if="row.item.user?.email" />
                                <span v-if="row.item.user?.email" class="small text-muted">{{ row.item.user.email }}</span>
                                <span v-if="!row.item.user">–</span>
                            </template>
                            <template #cell(category)="row">
                                {{ row.item.ticket_category?.name ?? '–' }}
                            </template>
                            <template #cell(priority)="row">
                                <BBadge
                                    v-if="row.item.ticket_priority"
                                    :style="
                                        row.item.ticket_priority.color
                                            ? {
                                                  backgroundColor: row.item.ticket_priority.color,
                                                  color: '#fff',
                                                  border: 'none',
                                              }
                                            : undefined
                                    "
                                >
                                    {{ row.item.ticket_priority.name }}
                                </BBadge>
                                <span v-else>–</span>
                            </template>
                            <template #cell(site_name)="row">
                                {{ row.item.site?.name ?? '–' }}
                            </template>
                            <template #cell(status_display)="row">
                                {{ statusLabels[row.item.status] ?? row.item.status }}
                            </template>
                            <template #cell(assigned_to_name)="row">
                                {{ row.item.assigned_to?.name ?? '–' }}
                            </template>
                            <template #cell(created_at)="row">
                                {{ new Date(row.item.created_at).toLocaleDateString('de-DE') }}
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="adminTickets.show(row.item.uuid ?? row.item.id).url">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="message-circle" />
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav v-if="tickets.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in tickets.links"
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
