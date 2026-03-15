<!-- Admin: Rechnung anzeigen -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BFormSelect,
    BButton,
    BTable,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { index as invoicesIndex, edit as invoicesEdit } from '@/routes/admin/invoices';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type LineItem = {
    position: number;
    description: string;
    quantity: string;
    unit: string;
    unit_price: string;
    amount: string;
};

type DunningLetter = {
    id: number;
    level: number;
    sent_at: string | null;
    fee_amount: string;
    pdf_path: string | null;
};

type Invoice = {
    id: number;
    uuid: string;
    number: string;
    type: string;
    amount: string;
    status: string;
    invoice_date: string;
    due_date: string | null;
    user: User | null;
    line_items: LineItem[];
    dunning_letters: DunningLetter[];
    pdf_path: string | null;
    invoice_xml_path: string | null;
};

type Props = {
    invoice: Invoice;
};

const props = defineProps<Props>();

function nextDunningLevel(dunningLetters: { level: number }[]): number {
    const existing = (dunningLetters ?? []).map((d) => d.level);
    for (const level of [1, 2, 3]) {
        if (!existing.includes(level)) {
            return level;
        }
    }
    return 0;
}

const dunningForm = useForm({});
const canCreateDunning = nextDunningLevel(props.invoice.dunning_letters ?? []);

const statusForm = useForm({ status: props.invoice.status });
const statusUpdateUrl = `/admin/invoices/${props.invoice.uuid}/status`;
function submitStatusChange(): void {
    statusForm.patch(statusUpdateUrl, { preserveScroll: true });
}

const INVOICE_STATUS_OPTIONS = [
    { value: 'draft', text: 'Entwurf' },
    { value: 'sent', text: 'Gesendet' },
    { value: 'pending', text: 'Ausstehend' },
    { value: 'paid', text: 'Bezahlt' },
    { value: 'cancelled', text: 'Storniert' },
];

const INVOICE_STATUS_LABELS: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
    cancelled: 'Storniert',
};

const invoiceStatusLabel = (status: string): string =>
    INVOICE_STATUS_LABELS[status] ?? status;

const invoiceStatusVariant = (status: string): string => {
    switch (status) {
        case 'paid':
            return 'success';
        case 'pending':
            return 'warning';
        case 'draft':
            return 'secondary';
        case 'sent':
            return 'info';
        case 'cancelled':
            return 'secondary';
        default:
            return 'secondary';
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: invoicesIndex().url },
    { title: props.invoice.number, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Rechnung ${invoice.number}`" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Rechnung {{ invoice.number }}</h4>
                        <p class="text-muted small mb-0">
                            {{ invoice.user?.name }} · {{ invoice.user?.email }}
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <a :href="`/invoices/${invoice.uuid}`" target="_blank" rel="noopener">
                            <BButton variant="primary">Rechnung anzeigen</BButton>
                        </a>
                        <Link v-if="invoice.type === 'manual'" :href="invoicesEdit({ invoice: invoice.uuid }).url">
                            <BButton variant="outline-primary">Bearbeiten</BButton>
                        </Link>
                        <a
                            v-if="invoice.pdf_path"
                            :href="`/invoices/${invoice.uuid}/pdf`"
                            target="_blank"
                            rel="noopener"
                        >
                            <BButton variant="outline-primary">PDF herunterladen</BButton>
                        </a>
                        <a
                            v-if="invoice.invoice_xml_path"
                            :href="`/invoices/${invoice.uuid}/xml`"
                            target="_blank"
                            rel="noopener"
                        >
                            <BButton variant="outline-primary">XML herunterladen</BButton>
                        </a>
                    </div>
                </div>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Details</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Betrag, Status, Datum</p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Betrag</span>
                            <span class="fw-semibold">{{ invoice.amount }} €</span>
                        </div>
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2 border-bottom">
                            <span class="text-muted">Status</span>
                            <div class="d-flex align-items-center gap-2">
                                <BFormSelect
                                    v-model="statusForm.status"
                                    :options="INVOICE_STATUS_OPTIONS"
                                    size="sm"
                                    class="w-auto"
                                    @change="submitStatusChange"
                                />
                                <span v-if="statusForm.processing" class="text-muted small">Wird gespeichert…</span>
                                <span v-else class="badge" :class="`bg-${invoiceStatusVariant(statusForm.status)}`">
                                    {{ invoiceStatusLabel(statusForm.status) }}
                                </span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Rechnungsdatum</span>
                            <span>{{ invoice.invoice_date }}</span>
                        </div>
                        <div v-if="invoice.due_date" class="d-flex justify-content-between py-2">
                            <span class="text-muted">Zahlbar bis</span>
                            <span>{{ invoice.due_date }}</span>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard v-if="invoice.line_items?.length" no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Positionen</BCardTitle>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable :items="invoice.line_items" :fields="[{ key: 'position', label: 'Pos.', class: 'w-12' }, { key: 'description', label: 'Beschreibung' }, { key: 'quantity', label: 'Menge', class: 'text-end' }, { key: 'amount', label: 'Betrag', class: 'text-end' }]" striped responsive class="mb-0">
                            <template #cell(quantity)="row">
                                {{ row.item.quantity }} {{ row.item.unit }}
                            </template>
                            <template #cell(amount)="row">
                                {{ row.item.amount }} €
                            </template>
                        </BTable>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Mahnungen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            {{ invoice.dunning_letters?.length ? 'Versendete Mahnungen zu dieser Rechnung' : 'Noch keine Mahnung erstellt' }}
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <form
                            v-if="canCreateDunning"
                            :action="`/admin/invoices/${invoice.uuid}/dunning-letters`"
                            method="post"
                            class="d-inline"
                            @submit="(e) => { e.preventDefault(); dunningForm.post(`/admin/invoices/${invoice.uuid}/dunning-letters`); }"
                        >
                            <BButton type="submit" variant="outline-primary" :disabled="dunningForm.processing">
                                {{ canCreateDunning }}. Mahnung erstellen
                            </BButton>
                        </form>
                        <ul v-if="invoice.dunning_letters?.length" class="list-unstyled mb-0 mt-2">
                            <li
                                v-for="d in invoice.dunning_letters"
                                :key="d.id"
                                class="d-flex align-items-center justify-content-between py-2 border-bottom"
                            >
                                <span>{{ d.level }}. Mahnung · Gebühr {{ d.fee_amount }} €</span>
                                <a
                                    v-if="d.pdf_path"
                                    :href="`/admin/invoices/${invoice.uuid}/dunning/${d.id}/pdf`"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-primary text-decoration-none small"
                                >
                                    PDF
                                </a>
                            </li>
                        </ul>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
