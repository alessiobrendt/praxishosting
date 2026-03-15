<!-- Admin: Rabattcode bearbeiten -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { watch } from 'vue';
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
import AdminLayout from '@/layouts/AdminLayout.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DiscountCode = {
    id: number;
    code: string;
    type: string;
    value: string;
    recurrence: string;
    applies_to: string;
    valid_from: string | null;
    valid_until: string | null;
    max_redemptions: number | null;
    times_redeemed: number;
    is_active: boolean;
};

type Props = { discountCode: DiscountCode };

const props = defineProps<Props>();

const form = useForm({
    code: props.discountCode.code,
    type: props.discountCode.type,
    value: props.discountCode.value,
    recurrence: props.discountCode.recurrence,
    applies_to: props.discountCode.applies_to ?? 'entire_duration',
    valid_from: props.discountCode.valid_from ? props.discountCode.valid_from.slice(0, 16) : '',
    valid_until: props.discountCode.valid_until ? props.discountCode.valid_until.slice(0, 16) : '',
    max_redemptions: props.discountCode.max_redemptions ?? '',
    is_active: props.discountCode.is_active,
});

watch(
    () => form.applies_to,
    (appliesTo) => {
        form.recurrence = appliesTo === 'first_period' ? 'once' : 'recurring';
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rabattcodes', href: '/admin/discount-codes' },
    { title: props.discountCode.code, href: '#' },
];

const typeOptions = [
    { value: 'percent', text: 'Prozent' },
    { value: 'fixed', text: 'Fester Betrag' },
];

const appliesToOptions = [
    { value: 'first_period', text: 'Nur erster Abrechnungszeitraum (erster Monat günstiger)' },
    { value: 'entire_duration', text: 'Gesamte Laufzeit (dauerhaft rabattiert)' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Rabattcode: ${discountCode.code}`" />

        <BRow>
            <BCol cols="12" lg="8" xl="6">
                <div class="mb-3">
                    <h4 class="mb-1">Rabattcode bearbeiten</h4>
                    <p class="text-muted small mb-0">
                        {{ discountCode.code }} – eingelöst: {{ discountCode.times_redeemed }}
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">{{ discountCode.code }}</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Eingelöst: {{ discountCode.times_redeemed }}</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm
                            @submit.prevent="
                                form.put(`/admin/discount-codes/${discountCode.id}`)
                            "
                        >
                            <BFormGroup label="Code" label-for="code">
                                <BFormInput
                                    id="code"
                                    v-model="form.code"
                                    type="text"
                                    required
                                    :aria-invalid="!!form.errors.code"
                                />
                                <InputError :message="form.errors.code" />
                            </BFormGroup>
                            <BRow>
                                <BCol md="6">
                                    <BFormGroup label="Typ" label-for="type">
                                        <BFormSelect id="type" v-model="form.type" :options="typeOptions" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6">
                                    <BFormGroup label="Wert" label-for="value">
                                        <BFormInput
                                            id="value"
                                            v-model="form.value"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            :aria-invalid="!!form.errors.value"
                                        />
                                        <InputError :message="form.errors.value" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup label="Rabatt gilt für" label-for="applies_to">
                                <BFormSelect
                                    id="applies_to"
                                    v-model="form.applies_to"
                                    :options="appliesToOptions"
                                />
                            </BFormGroup>
                            <BRow>
                                <BCol md="6">
                                    <BFormGroup label="Gültig von" label-for="valid_from">
                                        <BFormInput
                                            id="valid_from"
                                            v-model="form.valid_from"
                                            type="datetime-local"
                                        />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6">
                                    <BFormGroup label="Gültig bis" label-for="valid_until">
                                        <BFormInput
                                            id="valid_until"
                                            v-model="form.valid_until"
                                            type="datetime-local"
                                        />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup label="Max. Einlösungen (optional)" label-for="max_redemptions">
                                <BFormInput
                                    id="max_redemptions"
                                    v-model="form.max_redemptions"
                                    type="number"
                                    min="1"
                                />
                            </BFormGroup>
                            <BFormGroup>
                                <BFormCheckbox id="is_active" v-model="form.is_active">
                                    Aktiv
                                </BFormCheckbox>
                            </BFormGroup>
                            <div class="d-flex gap-2 pt-3">
                                <BButton
                                    type="submit"
                                    variant="primary"
                                    :disabled="form.processing"
                                >
                                    Speichern
                                </BButton>
                                <Link href="/admin/discount-codes">
                                    <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                                </Link>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
