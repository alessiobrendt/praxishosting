<!-- Admin: Aktivitätslog -->
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch, computed } from 'vue';
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
    BFormSelect,
    BFormGroup,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type ActivityLogEntry = {
    id: number;
    action: string;
    model_type: string;
    model_id: number;
    model_uuid?: string | null;
    created_at: string;
    user?: { id: number; name: string };
};

type Props = {
    activityLog: {
        data: ActivityLogEntry[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { action?: string; model_type?: string; from?: string; to?: string };
    actionOptions: Record<string, string>;
    modelTypeOptions: Record<string, string>;
};

const props = defineProps<Props>();

const filterAction = ref(props.filters.action ?? '');
const filterModelType = ref(props.filters.model_type ?? '');
const filterFrom = ref(props.filters.from ?? '');
const filterTo = ref(props.filters.to ?? '');

watch(
    () => props.filters,
    (f) => {
        filterAction.value = f.action ?? '';
        filterModelType.value = f.model_type ?? '';
        filterFrom.value = f.from ?? '';
        filterTo.value = f.to ?? '';
    },
    { deep: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Aktivitätslog', href: '#' },
];

function applyFilters(): void {
    router.get(
        '/admin/activity-log',
        {
            action: filterAction.value || undefined,
            model_type: filterModelType.value || undefined,
            from: filterFrom.value || undefined,
            to: filterTo.value || undefined,
        },
        { preserveState: true },
    );
}

function clearFilters(): void {
    filterAction.value = '';
    filterModelType.value = '';
    filterFrom.value = '';
    filterTo.value = '';
    router.get('/admin/activity-log');
}

function actionLabel(action: string): string {
    return props.actionOptions[action] ?? action;
}

function modelTypeLabel(modelType: string): string {
    return props.modelTypeOptions[modelType] ?? modelType;
}

function detailUrl(entry: ActivityLogEntry): string {
    if (entry.model_type.includes('Site')) {
        return entry.model_uuid ? `/admin/sites/${entry.model_uuid}` : `/admin/sites/${entry.model_id}`;
    }
    if (entry.model_type.includes('User')) {
        return `/admin/customers/${entry.model_id}`;
    }
    if (
        entry.model_type.includes('Ticket') &&
        !entry.model_type.includes('Todo') &&
        !entry.model_type.includes('Category') &&
        !entry.model_type.includes('Priority')
    ) {
        return entry.model_uuid ? `/admin/tickets/${entry.model_uuid}` : `/admin/tickets/${entry.model_id}`;
    }
    if (entry.model_type.includes('Invoice')) {
        return entry.model_uuid ? `/admin/invoices/${entry.model_uuid}` : `/admin/invoices/${entry.model_id}`;
    }
    if (entry.model_type.includes('DiscountCode')) {
        return `/admin/discount-codes/${entry.model_id}/edit`;
    }
    if (entry.model_type.includes('Partner')) {
        return `/admin/partners/${entry.model_id}/edit`;
    }
    if (entry.model_type.includes('Voucher')) {
        return `/admin/vouchers/${entry.model_id}/edit`;
    }
    if (entry.model_type.includes('Template') && !entry.model_type.includes('Page')) {
        return `/admin/templates/${entry.model_id}`;
    }
    if (entry.model_type === 'system') {
        return '/admin/settings';
    }
    return '#';
}

const actionSelectOptions = computed(() => [
    { value: '', text: 'Alle' },
    ...Object.entries(props.actionOptions).map(([key, label]) => ({ value: key, text: label })),
]);
const modelTypeSelectOptions = computed(() => [
    { value: '', text: 'Alle' },
    ...Object.entries(props.modelTypeOptions).map(([key, label]) => ({ value: key, text: label })),
]);

const tableFields = [
    { key: 'created_at', label: 'Datum', sortable: false },
    { key: 'action_display', label: 'Aktion', sortable: false },
    { key: 'model_type_display', label: 'Typ', sortable: false },
    { key: 'user_name', label: 'Admin', sortable: false },
    { key: 'details', label: 'Details', sortable: false },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Aktivitätslog" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Aktivitätslog</h4>
                    <p class="text-muted small mb-0">
                        Alle Admin-Aktionen: Tickets, Rechnungen, Kunden, Einstellungen und mehr
                    </p>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Filter</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Aktion, Typ, Zeitraum</p>
                    </BCardHeader>
                    <BCardBody>
                        <form class="d-flex flex-wrap align-items-end gap-3" @submit.prevent="applyFilters">
                            <BFormGroup label="Aktion" label-for="filter_action" class="mb-0">
                                <BFormSelect
                                    id="filter_action"
                                    v-model="filterAction"
                                    :options="actionSelectOptions"
                                    class="form-select-sm w-auto"
                                />
                            </BFormGroup>
                            <BFormGroup label="Typ" label-for="filter_model_type" class="mb-0">
                                <BFormSelect
                                    id="filter_model_type"
                                    v-model="filterModelType"
                                    :options="modelTypeSelectOptions"
                                    class="form-select-sm w-auto"
                                />
                            </BFormGroup>
                            <BFormGroup label="Von (Datum)" label-for="filter_from" class="mb-0">
                                <BFormInput id="filter_from" v-model="filterFrom" type="date" class="form-control-sm" />
                            </BFormGroup>
                            <BFormGroup label="Bis (Datum)" label-for="filter_to" class="mb-0">
                                <BFormInput id="filter_to" v-model="filterTo" type="date" class="form-control-sm" />
                            </BFormGroup>
                            <BButton type="submit" size="sm" variant="primary">Filtern</BButton>
                            <BButton type="button" size="sm" variant="outline-secondary" @click="clearFilters">
                                Zurücksetzen
                            </BButton>
                        </form>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Einträge</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Chronologisch, neueste zuerst</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="activityLog.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Einträge (oder Filter ohne Treffer)"
                        >
                            <template #cell(action_display)="row">
                                {{ actionLabel(row.item.action) }}
                            </template>
                            <template #cell(model_type_display)="row">
                                {{ modelTypeLabel(row.item.model_type) }}
                            </template>
                            <template #cell(user_name)="row">
                                {{ row.item.user?.name ?? '–' }}
                            </template>
                            <template #cell(details)="row">
                                <Link
                                    v-if="detailUrl(row.item) !== '#'"
                                    :href="detailUrl(row.item)"
                                    class="text-primary text-decoration-none"
                                >
                                    #{{ row.item.model_id }} anzeigen
                                </Link>
                                <span v-else>#{{ row.item.model_id }}</span>
                            </template>
                        </BTable>
                        <nav v-if="activityLog.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in activityLog.links"
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
