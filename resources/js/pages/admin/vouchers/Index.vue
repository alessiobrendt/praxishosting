<!-- Admin: Gutscheinübersicht -->
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

type Voucher = {
    id: number;
    code: string;
    balance: string;
    use_type: string;
    redeemed_at: string | null;
    is_active: boolean;
    user?: { id: number; name: string; email: string } | null;
};

type Props = {
    vouchers: {
        data: Voucher[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gutscheine', href: '#' },
];

const tableFields = [
    { key: 'code', label: 'Code', sortable: false },
    { key: 'balance', label: 'Betrag', sortable: false },
    { key: 'use_type_display', label: 'Typ', sortable: false },
    { key: 'user_display', label: 'Kunde', sortable: false },
    { key: 'redeemed', label: 'Eingelöst', sortable: false },
    { key: 'is_active', label: 'Aktiv', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gutscheine" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Gutscheine</h4>
                        <p class="text-muted small mb-0">Gutscheincodes für Guthaben verwalten</p>
                    </div>
                    <Link href="/admin/vouchers/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Gutscheine</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Code, Betrag, Einmal-/Mehrfachnutzung</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="vouchers.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Gutscheine"
                        >
                            <template #cell(code)="row">
                                <code class="small">{{ row.item.code }}</code>
                            </template>
                            <template #cell(balance)="row">
                                {{ row.item.balance }} €
                            </template>
                            <template #cell(use_type_display)="row">
                                {{ row.item.use_type === 'single_use' ? 'Einmal' : 'Mehrfach' }}
                            </template>
                            <template #cell(user_display)="row">
                                {{ row.item.user ? row.item.user.name : '–' }}
                            </template>
                            <template #cell(redeemed)="row">
                                {{ row.item.redeemed_at ? 'Ja' : 'Nein' }}
                            </template>
                            <template #cell(is_active)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Ja' : 'Nein' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/vouchers/${row.item.id}/edit`">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav v-if="vouchers.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in vouchers.links"
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
