<!-- Admin: Domains (Reseller/Skrime) Übersicht -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
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
    BModal,
    BFormGroup,
    BFormInput,
    BFormSelect,
} from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { notify } from '@/composables/useNotify';

type User = {
    id: number;
    name: string;
    email: string;
} | null;

type ResellerDomain = {
    id: number;
    uuid: string;
    domain: string;
    user_id: number | null;
    status: string;
    expires_at: string | null;
    registered_at: string | null;
    auto_renew: boolean;
    purchase_price: string | null;
    sale_price: string | null;
    profit_margin: number;
    tld: string | null;
    user?: User;
};

type Customer = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    domains: {
        data: ResellerDomain[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    customers: Customer[];
    stats: {
        total: number;
        without_skrime: number;
    };
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
};

const props = withDefaults(defineProps<Props>(), {
    stats: () => ({ total: 0, without_skrime: 0 }),
    pagination: () => ({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    }),
});

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

const importForm = useForm({
    domain: '',
    product_id: '',
    user_id: '',
});

const importDialogOpen = ref(false);

const submitImport = () => {
    importForm.post('/admin/domains/import', {
        preserveScroll: true,
        onSuccess: () => {
            importDialogOpen.value = false;
            importForm.reset();
        },
    });
};

const syncLoading = ref(false);
const syncFromSkrime = () => {
    syncLoading.value = true;
    router.post('/admin/domains/sync', {}, {
        preserveScroll: true,
        onFinish: () => {
            syncLoading.value = false;
        },
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
];

const domainUrl = (uuid: string) => `/admin/domains/${uuid}`;

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const tableItems = computed(() => (props.domains?.data ?? []).filter((d) => d != null));

const tableFields = [
    { key: 'domain', label: 'Domain' },
    { key: 'customer', label: 'Kunde' },
    { key: 'status', label: 'Status' },
    { key: 'expires_at', label: 'Ablaufdatum' },
    { key: 'auto_renew', label: 'Auto-Renew' },
    { key: 'purchase_price', label: 'Einkauf' },
    { key: 'sale_price', label: 'Verkauf' },
    { key: 'profit_margin', label: 'Gewinn' },
    { key: 'actions', label: 'Aktionen', thClass: 'text-end' },
];

const customerOptions = computed(() => [
    { value: '', text: '– Kein Kunde –' },
    ...props.customers.map((c) => ({ value: String(c.id), text: `${c.name} (${c.email})` })),
]);

const HINT_STORAGE_KEY = 'admin-domains-hint-dismissed';
const hintDismissed = ref(typeof localStorage !== 'undefined' && localStorage.getItem(HINT_STORAGE_KEY) === '1');
function dismissHint() {
    hintDismissed.value = true;
    try {
        localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
        // ignore
    }
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Domains" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Domains</h4>
                        <p class="text-muted small mb-0">
                            Reseller-Domains (Skrime) – Übersicht, Kunde zuweisen, Verlängern
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <BButton
                            variant="outline-primary"
                            :disabled="syncLoading"
                            @click="syncFromSkrime"
                        >
                            <span v-if="syncLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            <Icon v-else icon="refresh" class="me-2" />
                            {{ syncLoading ? 'Synchronisiere…' : 'Alle Domains von Skrime' }}
                        </BButton>
                        <BButton variant="outline-primary" @click="importDialogOpen = true">
                            <Icon icon="download" class="me-2" />
                            Domain von Skrime importieren
                        </BButton>
                    </div>
                </div>

                <div
                    v-if="!hintDismissed"
                    class="alert alert-info alert-dismissible fade show mb-3"
                    role="alert"
                >
                    <p class="small mb-0">
                        Domains, die bei Skrime existieren aber hier fehlen, können Sie mit
                        <strong>„Alle Domains von Skrime“</strong> nachladen.
                        Der Queue-Worker muss laufen: <code class="rounded bg-dark bg-opacity-10 px-1">php artisan queue:work</code>
                    </p>
                    <button type="button" class="btn-close" aria-label="Schließen" @click="dismissHint" />
                </div>

                <BCard no-body>
                    <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <BCardTitle class="mb-0">Alle Domains</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Domain, Kunde, Status, Ablauf, Auto-Renew, Preise</p>
                        </div>
                        <div class="d-flex flex-wrap align-items-center gap-3 small text-muted">
                            <span><strong class="text-body">{{ props.stats.total }}</strong> Domains in der Datenbank</span>
                            <span v-if="props.stats.without_skrime > 0">
                                <strong class="text-body">{{ props.stats.without_skrime }}</strong> ohne Skrime-Zuordnung
                            </span>
                        </div>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tableItems"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Domains vorhanden"
                        >
                            <template #cell(domain)="row">
                                <span class="fw-medium">{{ row.item?.domain }}</span>
                            </template>
                            <template #cell(customer)="row">
                                <template v-if="row.item?.user">
                                    <Link
                                        :href="`/admin/customers/${row.item.user.id}`"
                                        class="text-primary text-decoration-none"
                                    >
                                        {{ row.item.user.name }}
                                    </Link>
                                    <span class="text-muted small"> ({{ row.item.user.email }})</span>
                                </template>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(status)="row">
                                <BBadge :variant="row.item?.status === 'active' ? 'success' : 'secondary'">
                                    {{ row.item?.status ?? '–' }}
                                </BBadge>
                            </template>
                            <template #cell(expires_at)="row">
                                {{ row.item?.expires_at ?? '–' }}
                            </template>
                            <template #cell(auto_renew)="row">
                                <BBadge v-if="row.item?.auto_renew" variant="info">Ja</BBadge>
                                <span v-else>Nein</span>
                            </template>
                            <template #cell(purchase_price)="row">
                                {{ row.item?.purchase_price != null ? `${row.item.purchase_price} €` : '–' }}
                            </template>
                            <template #cell(sale_price)="row">
                                {{ row.item?.sale_price != null ? `${row.item.sale_price} €` : '–' }}
                            </template>
                            <template #cell(profit_margin)="row">
                                {{ row.item?.profit_margin != null ? `${row.item.profit_margin} €` : '–' }}
                            </template>
                            <template #cell(actions)="row">
                                <Link v-if="row.item" :href="domainUrl(row.item.uuid)">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="eye" class="me-1" />
                                        Details
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                        <div
                            v-if="props.pagination.total > 0 || (domains.links && domains.links.length > 3)"
                            class="d-flex flex-wrap align-items-center justify-content-center gap-3 p-3 border-top"
                        >
                            <span class="small text-muted">
                                Seite {{ props.pagination.current_page }} von {{ props.pagination.last_page }}
                                ({{ props.pagination.total }} Einträge)
                            </span>
                            <nav v-if="domains.links && domains.links.length > 3">
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in domains.links"
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
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>

        <BModal
            v-model="importDialogOpen"
            title="Skrime-Domain importieren"
            hide-footer
            @hidden="importForm.reset()"
        >
            <p class="text-muted small mb-3">
                Domainname oder Skrime-Produkt-ID angeben. Optional einen Kunden zuweisen.
            </p>
            <BForm @submit.prevent="submitImport">
                <BFormGroup label="Domain (z. B. example.de)" label-for="import-domain">
                    <BFormInput
                        id="import-domain"
                        v-model="importForm.domain"
                        placeholder="example.de"
                    />
                </BFormGroup>
                <BFormGroup label="oder Skrime Produkt-ID (UUID)" label-for="import-product_id">
                    <BFormInput
                        id="import-product_id"
                        v-model="importForm.product_id"
                        placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    />
                </BFormGroup>
                <BFormGroup label="Kunde (optional)" label-for="import-user">
                    <BFormSelect
                        id="import-user"
                        v-model="importForm.user_id"
                        :options="customerOptions"
                    />
                </BFormGroup>
                <div class="d-flex justify-content-end gap-2 mt-3">
                    <BButton variant="outline-secondary" @click="importDialogOpen = false">
                        Abbrechen
                    </BButton>
                    <BButton type="submit" variant="primary" :disabled="importForm.processing">
                        Importieren
                    </BButton>
                </div>
            </BForm>
        </BModal>
    </AdminLayout>
</template>
