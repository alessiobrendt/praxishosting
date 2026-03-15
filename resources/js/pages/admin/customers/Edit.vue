<!-- Admin: Kunde bearbeiten -->
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
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { index as customersIndex } from '@/routes/admin/customers';
import type { BreadcrumbItem } from '@/types';

type Brand = { id: number; key: string; name: string };

type RankOption = { value: string; label: string };

type Group = { id: number; key: string; name: string; label: string };

type Customer = {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
    brand_id?: number | null;
    brand?: Brand | null;
    is_admin?: boolean;
    rank?: string | null;
    group_ids?: number[];
};

type Props = {
    customer: Customer;
    brands: Brand[];
    groups: Group[];
    countries: Record<string, string>;
    ranks: RankOption[];
};

const props = defineProps<Props>();

const countryOptions = computed(() => [
    { value: '', text: 'Bitte wählen' },
    ...Object.entries(props.countries)
        .map(([code, name]) => ({ value: code, text: name }))
        .sort((a, b) => a.text.localeCompare(b.text, 'de')),
]);

const brandOptions = computed(() => [
    { value: '', text: '– Keine –' },
    ...props.brands.map((b) => ({ value: String(b.id), text: `${b.name} (${b.key})` })),
]);

const form = useForm({
    brand_id: props.customer.brand_id ?? '',
    name: props.customer.name,
    email: props.customer.email,
    company: props.customer.company ?? '',
    street: props.customer.street ?? '',
    postal_code: props.customer.postal_code ?? '',
    city: props.customer.city ?? '',
    country: props.customer.country ?? '',
    is_admin: props.customer.is_admin ?? false,
    rank: props.customer.rank ?? '',
    group_ids: props.customer.group_ids ?? [],
});

function setGroup(id: number, checked: boolean) {
    if (checked) {
        form.group_ids = [...form.group_ids, id];
    } else {
        form.group_ids = form.group_ids.filter((x) => x !== id);
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
    { title: props.customer.name, href: `/admin/customers/${props.customer.id}` },
    { title: 'Bearbeiten', href: '#' },
];

function submit() {
    form.put(`/admin/customers/${props.customer.id}`);
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde bearbeiten: ${customer.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Stammdaten bearbeiten</h4>
                    <p class="text-muted small mb-0">{{ customer.name }}</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Kundendaten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Name, E-Mail, Firma, Adresse</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm id="customer-edit-form" @submit.prevent="submit">
                            <BFormGroup label="Gruppen" label-for="groups">
                                <p class="text-muted small mb-2">Gruppen-Labels erscheinen im Admin-Header. Benutzer kann mehreren Gruppen angehören.</p>
                                <div class="border rounded p-3 overflow-auto" style="max-height: 10rem">
                                    <div v-for="g in groups" :key="g.id" class="form-check">
                                        <BFormCheckbox
                                            :id="`group-${g.id}`"
                                            :model-value="form.group_ids.includes(g.id)"
                                            @update:model-value="(v: boolean) => setGroup(g.id, v)"
                                        >
                                            {{ g.label }} ({{ g.key }})
                                        </BFormCheckbox>
                                    </div>
                                </div>
                                <InputError :message="form.errors.group_ids" />
                            </BFormGroup>
                            <BFormGroup>
                                <BFormCheckbox id="is_admin" v-model="form.is_admin">
                                    Administrator
                                </BFormCheckbox>
                            </BFormGroup>
                            <BFormGroup label="Marke" label-for="brand_id">
                                <BFormSelect
                                    id="brand_id"
                                    v-model="form.brand_id"
                                    :options="brandOptions"
                                    :aria-invalid="!!form.errors.brand_id"
                                />
                                <InputError :message="form.errors.brand_id" />
                            </BFormGroup>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput
                                    id="name"
                                    v-model="form.name"
                                    required
                                    :aria-invalid="!!form.errors.name"
                                />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="E-Mail" label-for="email">
                                <BFormInput
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    required
                                    :aria-invalid="!!form.errors.email"
                                />
                                <InputError :message="form.errors.email" />
                            </BFormGroup>
                            <BFormGroup label="Firma (optional)" label-for="company">
                                <BFormInput
                                    id="company"
                                    v-model="form.company"
                                    :aria-invalid="!!form.errors.company"
                                />
                                <InputError :message="form.errors.company" />
                            </BFormGroup>
                            <BFormGroup label="Straße (optional)" label-for="street">
                                <BFormInput
                                    id="street"
                                    v-model="form.street"
                                    :aria-invalid="!!form.errors.street"
                                />
                                <InputError :message="form.errors.street" />
                            </BFormGroup>
                            <BRow>
                                <BCol md="6">
                                    <BFormGroup label="PLZ (optional)" label-for="postal_code">
                                        <BFormInput
                                            id="postal_code"
                                            v-model="form.postal_code"
                                            :aria-invalid="!!form.errors.postal_code"
                                        />
                                        <InputError :message="form.errors.postal_code" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6">
                                    <BFormGroup label="Ort (optional)" label-for="city">
                                        <BFormInput
                                            id="city"
                                            v-model="form.city"
                                            :aria-invalid="!!form.errors.city"
                                        />
                                        <InputError :message="form.errors.city" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup label="Land (optional)" label-for="country">
                                <BFormSelect
                                    id="country"
                                    v-model="form.country"
                                    :options="countryOptions"
                                    :aria-invalid="!!form.errors.country"
                                />
                                <InputError :message="form.errors.country" />
                            </BFormGroup>
                        </BForm>
                    </BCardBody>
                    <BCardFooter class="d-flex gap-2">
                        <BButton type="submit" form="customer-edit-form" variant="primary" :disabled="form.processing">Speichern</BButton>
                        <Link :href="`/admin/customers/${customer.id}`">
                            <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                        </Link>
                    </BCardFooter>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
