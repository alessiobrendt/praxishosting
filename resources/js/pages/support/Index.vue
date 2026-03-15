<template>
    <DefaultLayout>
        <Head title="Meine Tickets" />
        <PageBreadcrumb
            title="Support Tickets"
            subtitle="Dashboard"
            subtitle-url="/dashboard"
        />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Support Tickets</h4>
                        <p class="text-muted small mb-0">Deine Support-Anfragen und Nachrichtenverlauf</p>
                    </div>
                    <Link :href="supportCreate.url">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Ticket erstellen
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tickets.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Tickets."
                        >
                            <template #cell(ticket_category)="row">
                                {{ row.item.ticket_category?.name ?? '–' }}
                            </template>
                            <template #cell(ticket_priority)="row">
                                <BBadge
                                    v-if="row.item.ticket_priority"
                                    :style="row.item.ticket_priority.color ? { backgroundColor: row.item.ticket_priority.color, color: '#fff', border: 'none' } : undefined"
                                >
                                    {{ row.item.ticket_priority.name }}
                                </BBadge>
                                <span v-else>–</span>
                            </template>
                            <template #cell(site)="row">
                                {{ row.item.site?.name ?? '–' }}
                            </template>
                            <template #cell(status)="row">
                                {{ statusLabels[row.item.status] ?? row.item.status }}
                            </template>
                            <template #cell(created_at)="row">
                                {{ new Date(row.item.created_at).toLocaleDateString('de-DE') }}
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="supportShow(row.item.uuid).url">
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
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { BRow, BCol, BCard, BCardBody, BTable, BButton, BBadge } from 'bootstrap-vue-next';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import PageBreadcrumb from '@/components/PageBreadcrumb.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import { index as supportIndex, create as supportCreate, show as supportShow } from '@/routes/support';

type Site = { id: number; name: string; slug: string } | null;
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;

type Ticket = {
    id: number;
    uuid: string;
    subject: string;
    status: string;
    created_at: string;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority;
    site?: Site;
};

const props = defineProps<{
    tickets: { data: Ticket[]; links: { url: string | null; label: string; active: boolean }[] };
}>();

const tickets = props.tickets;

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const tableFields = [
    { key: 'subject', label: 'Betreff' },
    { key: 'ticket_category', label: 'Kategorie' },
    { key: 'ticket_priority', label: 'Priorität' },
    { key: 'site', label: 'Produkt/Site' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Erstellt' },
    { key: 'actions', label: '', tdClass: 'text-end' },
];
</script>
