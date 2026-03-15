<!-- Admin: TLD-Preise (Pricelist) -->
<script setup lang="ts">
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import { notify } from '@/composables/useNotify';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type TldItem = {
    id: number;
    tld: string;
    create_price: number;
    renew_price: number;
    transfer_price: number;
    margin_type: string;
    margin_value: number;
    margin_renew_value: number | null;
    margin_transfer_value: number | null;
    sale_price: number;
    sale_price_renew: number;
    sale_price_transfer: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    items: TldItem[];
    links: PaginationLink[];
    filters: {
        search: string;
    };
};

const props = withDefaults(defineProps<Props>(), {
    links: () => [],
    filters: () => ({ search: '' }),
});

const searchInput = ref(props.filters.search);

function applySearch() {
    router.get('/admin/domains/tld-pricelist', {
        search: searchInput.value || undefined,
        page: undefined,
    }, { preserveState: true });
}

function handlePagination(url: string) {
    if (url) window.location.href = url;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: 'TLD-Preise', href: '#' },
];

const selectedTlds = ref<Set<string>>(new Set());

const applyMarginToAll = ref(false);

const bulkForm = useForm({
    margin_type: 'percent',
    margin_value: '10',
    margin_renew_value: '' as string,
    margin_transfer_value: '' as string,
    tlds: [] as string[],
});

const marginTypeOptions = [
    { value: 'percent', text: 'Prozent (%)' },
    { value: 'fixed', text: 'Festbetrag (€)' },
];

const page = usePage();
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const syncLoading = ref(false);
const syncPricelist = () => {
    syncLoading.value = true;
    router.post('/admin/domains/tld-pricelist/sync', {}, {
        preserveScroll: true,
        onFinish: () => {
            syncLoading.value = false;
        },
    });
};

const toggleAll = (checked: boolean) => {
    if (checked) {
        selectedTlds.value = new Set(props.items.map((i) => i.tld));
    } else {
        selectedTlds.value = new Set();
    }
};

watch(
    () => props.filters.search,
    (v) => {
        searchInput.value = v;
    },
);

const toggleOne = (tld: string, checked: boolean) => {
    const next = new Set(selectedTlds.value);
    if (checked) next.add(tld);
    else next.delete(tld);
    selectedTlds.value = next;
};

const allSelected = () => props.items.length > 0 && selectedTlds.value.size === props.items.length;

const submitBulk = () => {
    bulkForm.tlds = applyMarginToAll.value ? [] : Array.from(selectedTlds.value);
    if (!applyMarginToAll.value && bulkForm.tlds.length === 0) {
        bulkForm.errors.tlds = 'Bitte mindestens eine TLD auswählen oder „Für alle TLDs“ aktivieren.';
        return;
    }
    bulkForm.put('/admin/domains/tld-pricelist/bulk', {
        preserveScroll: true,
        onSuccess: () => {
            selectedTlds.value = new Set();
            applyMarginToAll.value = false;
            bulkForm.reset();
        },
    });
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="TLD-Preise" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">TLD-Preise</h4>
                        <p class="text-muted small mb-0">
                            Einkaufspreise und Marge pro Domain-Endung. Bulk-Import aus Skrime, Massen-Edit der Gewinn-Marge.
                        </p>
                    </div>
                    <BButton
                        variant="outline-primary"
                        :disabled="syncLoading"
                        @click="syncPricelist"
                    >
                        <span v-if="syncLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        <Icon v-else icon="download" class="me-2" />
                        {{ syncLoading ? 'Importiere…' : 'Pricelist von Skrime importieren' }}
                    </BButton>
                </div>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Marge setzen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Margin-Typ und Wert wählen. Entweder TLDs in der Tabelle auswählen oder „Für alle TLDs“ aktivieren.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitBulk" class="d-flex flex-wrap align-items-end gap-3">
                            <BFormGroup label="Typ" class="mb-0" style="min-width: 8rem">
                                <BFormSelect
                                    id="bulk-margin-type"
                                    v-model="bulkForm.margin_type"
                                    :options="marginTypeOptions"
                                />
                            </BFormGroup>
                            <BFormGroup label="Verkauf (Create)" class="mb-0" style="min-width: 6rem">
                                <BFormInput
                                    id="bulk-margin-value"
                                    v-model="bulkForm.margin_value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="z. B. 10"
                                    :aria-invalid="!!bulkForm.errors.margin_value"
                                />
                                <p v-if="bulkForm.errors.margin_value" class="text-danger small mb-0 mt-1">
                                    {{ bulkForm.errors.margin_value }}
                                </p>
                            </BFormGroup>
                            <BFormGroup label="Verkauf (Renew)" class="mb-0" style="min-width: 6rem">
                                <BFormInput
                                    id="bulk-margin-renew"
                                    v-model="bulkForm.margin_renew_value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="leer = Create"
                                />
                            </BFormGroup>
                            <BFormGroup label="Verkauf (Transfer)" class="mb-0" style="min-width: 6rem">
                                <BFormInput
                                    id="bulk-margin-transfer"
                                    v-model="bulkForm.margin_transfer_value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="leer = Create"
                                />
                            </BFormGroup>
                            <BFormGroup class="mb-0">
                                <BFormCheckbox id="bulk-apply-all" v-model="applyMarginToAll">
                                    Für alle TLDs
                                </BFormCheckbox>
                            </BFormGroup>
                            <BButton
                                type="submit"
                                variant="primary"
                                :disabled="bulkForm.processing || (!applyMarginToAll && selectedTlds.size === 0)"
                            >
                                <Icon icon="percentage" class="me-2" />
                                {{ applyMarginToAll ? 'Marge für alle TLDs übernehmen' : `Marge für ${selectedTlds.size} TLD(s) übernehmen` }}
                            </BButton>
                        </BForm>
                        <p v-if="bulkForm.errors.tlds" class="text-danger small mb-0 mt-2">
                            {{ bulkForm.errors.tlds }}
                        </p>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Alle TLDs</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Einkauf und Verkaufspreise für Create, Renew und Transfer. Margen getrennt pro Aktion.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
                            <BFormInput
                                v-model="searchInput"
                                type="search"
                                placeholder="TLD suchen (z. B. de, com)"
                                class="flex-grow-1"
                                style="max-width: 20rem"
                                @keydown.enter.prevent="applySearch"
                            />
                            <BButton variant="secondary" @click="applySearch">Suchen</BButton>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm table-striped table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <th class="text-center" style="width: 3rem">
                                            <input
                                                type="checkbox"
                                                :checked="allSelected()"
                                                :indeterminate="selectedTlds.size > 0 && selectedTlds.size < items.length"
                                                class="form-check-input"
                                                aria-label="Alle auswählen"
                                                @change="toggleAll(($event.target as HTMLInputElement).checked)"
                                            />
                                        </th>
                                        <th>TLD</th>
                                        <th>Einkauf (Create)</th>
                                        <th>Einkauf (Renew)</th>
                                        <th>Einkauf (Transfer)</th>
                                        <th>Verkauf (Create)</th>
                                        <th>Verkauf (Renew)</th>
                                        <th>Verkauf (Transfer)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in items" :key="item.id">
                                        <td class="text-center">
                                            <input
                                                type="checkbox"
                                                :checked="selectedTlds.has(item.tld)"
                                                class="form-check-input"
                                                :aria-label="`${item.tld} auswählen`"
                                                @change="toggleOne(item.tld, ($event.target as HTMLInputElement).checked)"
                                            />
                                        </td>
                                        <td class="fw-medium">.{{ item.tld }}</td>
                                        <td>{{ item.create_price.toFixed(2) }} €</td>
                                        <td>{{ item.renew_price.toFixed(2) }} €</td>
                                        <td>{{ item.transfer_price.toFixed(2) }} €</td>
                                        <td>{{ item.sale_price.toFixed(2) }} €</td>
                                        <td>{{ item.sale_price_renew.toFixed(2) }} €</td>
                                        <td>{{ item.sale_price_transfer.toFixed(2) }} €</td>
                                    </tr>
                                    <tr v-if="items.length === 0">
                                        <td colspan="8" class="text-center text-muted py-4">
                                            Keine TLDs. Klicken Sie auf „Pricelist von Skrime importieren“, um alle verfügbaren Endungen zu laden.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav v-if="links && links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a
                                        v-if="link.url"
                                        class="page-link"
                                        href="#"
                                        @click.prevent="handlePagination(link.url!)"
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
    </AdminLayout>
</template>
