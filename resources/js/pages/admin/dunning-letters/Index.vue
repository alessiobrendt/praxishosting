<!-- Admin: Mahnungsübersicht -->
<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
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
    user_id: number;
    user: User | null;
};

type DunningLetter = {
    id: number;
    invoice_id: number;
    level: number;
    sent_at: string;
    fee_amount: string;
    pdf_path: string | null;
    invoice: Invoice;
};

type Props = {
    dunningLetters: {
        data: DunningLetter[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const tableItems = computed(() => (props.dunningLetters?.data ?? []).filter((d) => d != null));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Mahnungen', href: '#' },
];

const tableFields = [
    { key: 'invoice_number', label: 'Rechnung', sortable: false },
    { key: 'customer', label: 'Kunde', sortable: false },
    { key: 'level', label: 'Stufe', sortable: false },
    { key: 'sent_at', label: 'Datum', sortable: false },
    { key: 'fee_amount', label: 'Gebühr', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Mahnungen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Mahnungen</h4>
                    <p class="text-muted small mb-0">Übersicht aller versendeten Mahnungen</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Mahnungsübersicht</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Rechnung, Kunde, Stufe, Datum, Gebühr, PDF</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tableItems"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Noch keine Mahnungen erstellt"
                        >
                            <template #cell(invoice_number)="row">
                                <Link
                                    :href="`/admin/invoices/${row.item.invoice?.uuid ?? row.item.invoice_id}`"
                                    class="text-primary text-decoration-none fw-medium"
                                >
                                    {{ row.item.invoice?.number ?? '–' }}
                                </Link>
                            </template>
                            <template #cell(customer)="row">
                                <span v-if="row.item.invoice?.user">
                                    {{ row.item.invoice.user.name }} ({{ row.item.invoice.user.email }})
                                </span>
                                <span v-else>–</span>
                            </template>
                            <template #cell(level)="row">
                                {{ row.item.level }}. Mahnung
                            </template>
                            <template #cell(fee_amount)="row">
                                {{ row.item.fee_amount }} €
                            </template>
                            <template #cell(actions)="row">
                                <a
                                    v-if="row.item.pdf_path"
                                    :href="`/admin/invoices/${row.item.invoice?.uuid ?? row.item.invoice_id}/dunning/${row.item.id}/pdf`"
                                    target="_blank"
                                    rel="noopener"
                                    class="text-primary"
                                >
                                    PDF
                                </a>
                                <span v-else class="text-muted">–</span>
                            </template>
                        </BTable>
                        <nav v-if="dunningLetters.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in dunningLetters.links"
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
