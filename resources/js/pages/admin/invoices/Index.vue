<!-- Admin: Rechnungsübersicht -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
    BFormInput,
    BFormGroup,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import {
    create as invoicesCreate,
    exportMethod as invoicesExport,
    show as invoicesShow,
} from '@/routes/admin/invoices';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type Invoice = {
    id: number;
    uuid?: string;
    number: string;
    type: string;
    amount: string;
    status: string;
    invoice_date: string;
    pdf_path: string | null;
    invoice_xml_path: string | null;
    user: User | null;
};

type Props = {
    invoices: {
        data: Invoice[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const INVOICE_STATUS_LABELS: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
};

function invoiceStatusLabel(status: string): string {
    return INVOICE_STATUS_LABELS[status] ?? status;
}

function invoiceStatusVariant(status: string): 'success' | 'warning' | 'secondary' | 'info' {
    switch (status) {
        case 'paid':
            return 'success';
        case 'pending':
            return 'warning';
        case 'sent':
            return 'info';
        default:
            return 'secondary';
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: '#' },
];

const exportFrom = ref<string>('');
const exportTo = ref<string>('');

const exportUrl = computed(() => {
    const query: Record<string, string> = {};
    if (exportFrom.value) query.from = exportFrom.value;
    if (exportTo.value) query.to = exportTo.value;
    return invoicesExport.url({ query });
});

function openExport(): void {
    window.open(exportUrl.value, '_blank');
}

const tableFields = [
    { key: 'number', label: 'Nummer', sortable: false },
    { key: 'user_display', label: 'Kunde', sortable: false },
    { key: 'amount', label: 'Betrag', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'invoice_date', label: 'Datum', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Rechnungen" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Rechnungen</h4>
                        <p class="text-muted small mb-0">Übersicht aller Rechnungen (§ 19 UStG)</p>
                    </div>
                    <Link :href="invoicesCreate().url">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Rechnung erstellen
                        </BButton>
                    </Link>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Umsatz exportieren (CSV)</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Bezahlte Rechnungen als CSV – optional Zeitraum wählen (von/bis), sonst alle.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex flex-wrap align-items-end gap-3">
                            <BFormGroup label="Von" label-for="export-from" class="mb-0">
                                <BFormInput
                                    id="export-from"
                                    v-model="exportFrom"
                                    type="date"
                                    class="form-control-sm"
                                />
                            </BFormGroup>
                            <BFormGroup label="Bis" label-for="export-to" class="mb-0">
                                <BFormInput
                                    id="export-to"
                                    v-model="exportTo"
                                    type="date"
                                    class="form-control-sm"
                                />
                            </BFormGroup>
                            <BButton variant="outline-primary" size="sm" @click="openExport">
                                Export starten
                            </BButton>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Rechnungsübersicht</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Übersicht aller Rechnungen (§ 19 UStG)</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="invoices.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Rechnungen"
                        >
                            <template #cell(number)="row">
                                <Link
                                    :href="invoicesShow({ invoice: row.item.uuid ?? row.item.id }).url"
                                    class="text-primary text-decoration-none fw-medium"
                                >
                                    {{ row.item.number }}
                                </Link>
                            </template>
                            <template #cell(user_display)="row">
                                <span v-if="row.item.user">
                                    {{ row.item.user.name }} ({{ row.item.user.email }})
                                </span>
                                <span v-else>–</span>
                            </template>
                            <template #cell(amount)="row">
                                {{ row.item.amount }} €
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="invoiceStatusVariant(row.item.status)">
                                    {{ invoiceStatusLabel(row.item.status) }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <a
                                    :href="`/admin/invoices/${row.item.uuid ?? row.item.id}`"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-primary small me-2"
                                >
                                    Anzeigen
                                </a>
                                <a
                                    v-if="row.item.pdf_path"
                                    :href="`/admin/invoices/${row.item.uuid ?? row.item.id}/pdf`"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-muted small me-1"
                                >
                                    PDF
                                </a>
                                <a
                                    v-if="row.item.invoice_xml_path"
                                    :href="`/admin/invoices/${row.item.uuid ?? row.item.id}/xml`"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-muted small"
                                >
                                    XML
                                </a>
                            </template>
                        </BTable>
                        <nav v-if="invoices.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in invoices.links"
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
