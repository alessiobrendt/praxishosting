<!-- Admin: Rabattcodes-Übersicht -->
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

type DiscountCode = {
    id: number;
    code: string;
    type: string;
    value: string;
    recurrence: string;
    valid_from: string | null;
    valid_until: string | null;
    max_redemptions: number | null;
    times_redeemed: number;
    is_active: boolean;
};

type Props = {
    discountCodes: {
        data: DiscountCode[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rabattcodes', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Rabattcode wirklich löschen?')) {
        router.delete(`/admin/discount-codes/${id}`);
    }
}

const tableFields = [
    { key: 'code', label: 'Code', sortable: false },
    { key: 'type', label: 'Typ', sortable: false },
    { key: 'value_display', label: 'Wert', sortable: false },
    { key: 'redeemed', label: 'Eingelöst', sortable: false },
    { key: 'is_active', label: 'Aktiv', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Rabattcodes" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Rabattcodes</h4>
                        <p class="text-muted small mb-0">Rabattcodes für den Checkout verwalten</p>
                    </div>
                    <Link href="/admin/discount-codes/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Rabattcodes</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Code, Typ (percent/fixed), Wert, Gültigkeit</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="discountCodes.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Rabattcodes"
                        >
                            <template #cell(code)="row">
                                <code class="small">{{ row.item.code }}</code>
                            </template>
                            <template #cell(value_display)="row">
                                {{ row.item.type === 'percent' ? row.item.value + '%' : row.item.value + ' €' }}
                            </template>
                            <template #cell(redeemed)="row">
                                {{ row.item.times_redeemed }}{{ row.item.max_redemptions ? ` / ${row.item.max_redemptions}` : '' }}
                            </template>
                            <template #cell(is_active)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Ja' : 'Nein' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/discount-codes/${row.item.id}/edit`" class="me-1">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                    <Icon icon="trash" />
                                </BButton>
                            </template>
                        </BTable>
                        <nav v-if="discountCodes.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in discountCodes.links"
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
