<!-- Admin: Hosting-Plan (Detail) -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BTable,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    plesk_package_name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
    stripe_price_id: string | null;
    is_active: boolean;
    product?: { id: number } | null;
    webspace_accounts?: Array<{ id: number; uuid: string; domain: string; status: string }>;
};

type Props = {
    hostingPlan: HostingPlan;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Hosting-Pläne', href: '/admin/hosting-plans' },
    { title: props.hostingPlan.name, href: '#' },
];

const specsRows = [
    { label: 'Webspace', value: `${props.hostingPlan.disk_gb} GB NVMe` },
    { label: 'Traffic', value: `${props.hostingPlan.traffic_gb} GB/Monat` },
    { label: 'Domains / Subdomains', value: `${props.hostingPlan.domains} / ${props.hostingPlan.subdomains}` },
    { label: 'Mailpostfächer', value: String(props.hostingPlan.mailboxes) },
    { label: 'Datenbanken', value: String(props.hostingPlan.databases) },
    { label: 'Preis', value: `${props.hostingPlan.price} €/Monat` },
    {
        label: 'Status',
        value: props.hostingPlan.is_active ? 'Aktiv' : 'Inaktiv',
        isBadge: true,
        variant: props.hostingPlan.is_active ? 'success' : 'danger',
    },
    { label: 'Stripe Price ID', value: props.hostingPlan.stripe_price_id ?? '–', isCode: true },
];

const accountTableFields = [
    { key: 'domain', label: 'Domain', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktion', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="hostingPlan.name" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    <div>
                        <h4 class="mb-1">{{ hostingPlan.name }}</h4>
                        <p class="text-muted small mb-0">
                            Plesk-Paket: {{ hostingPlan.plesk_package_name }}
                        </p>
                    </div>
                    <Link :href="`/admin/hosting-plans/${hostingPlan.id}/edit`">
                        <BButton variant="primary">
                            <Icon icon="pencil" class="me-2" />
                            Bearbeiten
                        </BButton>
                    </Link>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Specs</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Limits und Preis</p>
                    </BCardHeader>
                    <BCardBody>
                        <div
                            v-for="(row, idx) in specsRows"
                            :key="idx"
                            class="d-flex justify-content-between py-2 border-bottom"
                            :class="{ 'border-0 pb-0': idx === specsRows.length - 1 }"
                        >
                            <span class="text-muted">{{ row.label }}</span>
                            <span v-if="row.isBadge">
                                <BBadge :variant="row.variant">{{ row.value }}</BBadge>
                            </span>
                            <code v-else-if="row.isCode" class="small">{{ row.value }}</code>
                            <span v-else>{{ row.value }}</span>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard v-if="hostingPlan.webspace_accounts?.length" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Letzte Webspace-Accounts</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunden mit diesem Paket</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="hostingPlan.webspace_accounts"
                            :fields="accountTableFields"
                            striped
                            responsive
                            class="mb-0"
                        >
                            <template #cell(status)="row">
                                <BBadge variant="secondary">{{ row.item.status }}</BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/webspace-accounts/${row.item.uuid}`">
                                    <BButton variant="outline-primary" size="sm">Anzeigen</BButton>
                                </Link>
                            </template>
                        </BTable>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
