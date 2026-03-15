<!-- Admin: Partner anlegen -->
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
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormTextarea,
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = { id: number; key: string; name: string };
type User = { id: number; name: string; email: string };

type Props = { brands: Brand[]; users: User[] };

const props = defineProps<Props>();

const form = useForm({
    brand_id: '' as number | '',
    name: '',
    description: '',
    image: null as File | null,
    user_id: '' as number | '',
    discount_percent: '0',
    expires_at: '',
    is_active: true,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Partner', href: '/admin/partners' },
    { title: 'Neu', href: '#' },
];

function onImageChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    form.image = target.files?.[0] ?? null;
}

function submit(): void {
    form.post('/admin/partners', { forceFormData: true });
}

const brandOptions = computed(() => [
    { value: '', text: 'Bitte wählen' },
    ...props.brands.map((b) => ({ value: b.id, text: b.name })),
]);

const userOptions = computed(() => [
    { value: '', text: '– Keiner –' },
    ...props.users.map((u) => ({ value: u.id, text: `${u.name} (${u.email})` })),
]);
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Partner anlegen" />

        <BRow>
            <BCol cols="12" lg="8" xl="6">
                <div class="mb-3">
                    <h4 class="mb-1">Partner anlegen</h4>
                    <p class="text-muted small mb-0">
                        Brand, Name, Beschreibung, Bild, Nutzer, Rabatt %, Ablaufdatum, Aktiv
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Partner</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Brand, Name, Beschreibung, Bild, Nutzer, Rabatt %, Ablaufdatum, Aktiv
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submit">
                            <BFormGroup label="Brand" label-for="brand_id">
                                <BFormSelect
                                    id="brand_id"
                                    v-model="form.brand_id"
                                    required
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
                            <BFormGroup label="Beschreibung" label-for="description">
                                <BFormTextarea
                                    id="description"
                                    v-model="form.description"
                                    rows="3"
                                    :aria-invalid="!!form.errors.description"
                                />
                                <InputError :message="form.errors.description" />
                            </BFormGroup>
                            <BFormGroup label="Bild (optional, max. 2 MB)" label-for="image">
                                <BFormInput
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    :aria-invalid="!!form.errors.image"
                                    @change="onImageChange"
                                />
                                <InputError :message="form.errors.image" />
                            </BFormGroup>
                            <BFormGroup label="Nutzer (optional)" label-for="user_id">
                                <BFormSelect
                                    id="user_id"
                                    v-model="form.user_id"
                                    :options="userOptions"
                                    :aria-invalid="!!form.errors.user_id"
                                />
                                <InputError :message="form.errors.user_id" />
                            </BFormGroup>
                            <BRow>
                                <BCol md="6">
                                    <BFormGroup label="Rabatt %" label-for="discount_percent">
                                        <BFormInput
                                            id="discount_percent"
                                            v-model="form.discount_percent"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            :aria-invalid="!!form.errors.discount_percent"
                                        />
                                        <InputError :message="form.errors.discount_percent" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6">
                                    <BFormGroup label="Ablaufdatum (optional)" label-for="expires_at">
                                        <BFormInput
                                            id="expires_at"
                                            v-model="form.expires_at"
                                            type="date"
                                            :aria-invalid="!!form.errors.expires_at"
                                        />
                                        <InputError :message="form.errors.expires_at" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup>
                                <BFormCheckbox id="is_active" v-model="form.is_active">
                                    Aktiv
                                </BFormCheckbox>
                            </BFormGroup>
                            <div class="d-flex gap-2 pt-3">
                                <BButton type="submit" variant="primary" :disabled="form.processing">
                                    Anlegen
                                </BButton>
                                <Link href="/admin/partners">
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
