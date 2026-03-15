<!-- Admin: Rechnung erstellen -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
} from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { index as invoicesIndex, store } from '@/routes/admin/invoices';
import type { BreadcrumbItem } from '@/types';

type Customer = {
    id: number;
    name: string;
    email: string;
};

type LineItem = {
    position: number;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    amount: number;
};

type Props = {
    customers: Customer[];
};

const props = defineProps<Props>();

const customerOptions = computed(() => [
    { value: '', text: 'Bitte wählen' },
    ...props.customers.map((c) => ({ value: String(c.id), text: `${c.name} (${c.email})` })),
]);

const statusOptions = [
    { value: 'draft', text: 'Entwurf' },
    { value: 'sent', text: 'Versendet' },
];

const form = useForm({
    user_id: '' as string | number,
    invoice_date: new Date().toISOString().slice(0, 10),
    due_date: '' as string,
    status: 'draft' as string,
    line_items: [
        { position: 1, description: '', quantity: 1, unit: 'Stück', unit_price: 0, amount: 0 },
    ] as LineItem[],
});

function addRow() {
    const pos = form.line_items.length + 1;
    form.line_items.push({
        position: pos,
        description: '',
        quantity: 1,
        unit: 'Stück',
        unit_price: 0,
        amount: 0,
    });
}

function removeRow(index: number) {
    if (form.line_items.length <= 1) return;
    form.line_items.splice(index, 1);
    form.line_items.forEach((item, i) => {
        item.position = i + 1;
    });
}

function updateLineAmount(index: number) {
    const item = form.line_items[index];
    item.amount = Math.round(item.quantity * item.unit_price * 100) / 100;
}

const totalAmount = computed(() => {
    return form.line_items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2);
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: invoicesIndex().url },
    { title: 'Neue Rechnung', href: '#' },
];

function submit() {
    form.post(store.url());
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Rechnung erstellen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Rechnung erstellen</h4>
                    <p class="text-muted small mb-0">Manuelle Rechnung mit mehreren Positionen anlegen</p>
                </div>

                <BForm @submit.prevent="submit">
                    <BCard no-body class="mb-3">
                        <BCardHeader>
                            <BCardTitle class="mb-0">Kunde & Datum</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Rechnungsempfänger und Fälligkeit</p>
                        </BCardHeader>
                        <BCardBody>
                            <BRow>
                                <BCol sm="6" md="3">
                                    <BFormGroup label="Kunde" label-for="user_id">
                                        <BFormSelect
                                            id="user_id"
                                            v-model="form.user_id"
                                            :options="customerOptions"
                                            required
                                            :aria-invalid="!!form.errors.user_id"
                                        />
                                        <InputError :message="form.errors.user_id" />
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="6" md="3">
                                    <BFormGroup label="Rechnungsdatum" label-for="invoice_date">
                                        <BFormInput
                                            id="invoice_date"
                                            v-model="form.invoice_date"
                                            type="date"
                                            required
                                            :aria-invalid="!!form.errors.invoice_date"
                                        />
                                        <InputError :message="form.errors.invoice_date" />
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="6" md="3">
                                    <BFormGroup label="Zahlbar bis (optional)" label-for="due_date">
                                        <BFormInput
                                            id="due_date"
                                            v-model="form.due_date"
                                            type="date"
                                            :aria-invalid="!!form.errors.due_date"
                                        />
                                        <InputError :message="form.errors.due_date" />
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="6" md="3">
                                    <BFormGroup label="Status" label-for="status">
                                        <BFormSelect id="status" v-model="form.status" :options="statusOptions" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                        </BCardBody>
                    </BCard>

                    <BCard no-body class="mb-3">
                        <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <div>
                                <BCardTitle class="mb-0">Positionen</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Beschreibung, Menge, Einzelpreis – Betrag wird berechnet</p>
                            </div>
                            <BButton type="button" variant="outline-primary" size="sm" @click="addRow">
                                <Icon icon="plus" class="me-1" />
                                Zeile
                            </BButton>
                        </BCardHeader>
                        <BCardBody>
                            <div
                                v-for="(item, index) in form.line_items"
                                :key="index"
                                class="row g-2 align-items-end mb-2"
                            >
                                <BCol cols="1">
                                    <BFormGroup :label="`Pos.`" :label-for="`pos-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`pos-${index}`"
                                            v-model.number="item.position"
                                            type="number"
                                            min="1"
                                            size="sm"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="12" md="4">
                                    <BFormGroup :label="`Beschreibung`" :label-for="`desc-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`desc-${index}`"
                                            v-model="item.description"
                                            size="sm"
                                            :aria-invalid="!!form.errors[`line_items.${index}.description`]"
                                        />
                                        <InputError :message="form.errors[`line_items.${index}.description`]" />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="4" md="1">
                                    <BFormGroup :label="`Menge`" :label-for="`qty-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`qty-${index}`"
                                            v-model.number="item.quantity"
                                            type="number"
                                            min="0.001"
                                            step="0.001"
                                            size="sm"
                                            @blur="updateLineAmount(index)"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="4" md="1">
                                    <BFormGroup :label="`Einheit`" :label-for="`unit-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`unit-${index}`"
                                            v-model="item.unit"
                                            size="sm"
                                            placeholder="Stück"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="4" md="2">
                                    <BFormGroup :label="`Einzelpreis (€)`" :label-for="`price-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`price-${index}`"
                                            v-model.number="item.unit_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            size="sm"
                                            @blur="updateLineAmount(index)"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="6" md="2">
                                    <BFormGroup :label="`Betrag (€)`" :label-for="`amount-${index}`" class="mb-0">
                                        <BFormInput
                                            :id="`amount-${index}`"
                                            v-model.number="item.amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            size="sm"
                                            readonly
                                            class="bg-light"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol cols="6" md="1" class="text-end text-md-start">
                                    <BButton
                                        type="button"
                                        variant="outline-danger"
                                        size="sm"
                                        :disabled="form.line_items.length <= 1"
                                        @click="removeRow(index)"
                                        aria-label="Zeile entfernen"
                                    >
                                        <Icon icon="trash" />
                                    </BButton>
                                </BCol>
                            </div>
                            <div class="d-flex justify-content-end border-top pt-3 mt-3">
                                <span class="fw-semibold">Gesamtbetrag: {{ totalAmount }} €</span>
                            </div>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">Rechnung anlegen</BButton>
                            <Link :href="invoicesIndex().url">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BCard>
                </BForm>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
