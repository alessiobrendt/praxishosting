<!-- Admin: Berechtigung anlegen -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
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
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    key: '',
    name: '',
    label: '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Berechtigungen', href: '/admin/permissions' },
    { title: 'Berechtigung anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Berechtigung anlegen" />

        <BRow>
            <BCol cols="12" lg="8" xl="6">
                <div class="mb-3">
                    <h4 class="mb-1">Berechtigung anlegen</h4>
                    <p class="text-muted small mb-0">
                        Key (eindeutig, z. B. admin.invoices), Name, Label
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Berechtigung</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Key (eindeutig, z. B. admin.invoices), Name, Label
                        </p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.post('/admin/permissions')">
                        <BCardBody>
                            <BFormGroup label="Key" label-for="key">
                                <BFormInput
                                    id="key"
                                    v-model="form.key"
                                    placeholder="admin.invoices"
                                    required
                                    :aria-invalid="!!form.errors.key"
                                />
                                <InputError :message="form.errors.key" />
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
                            <BFormGroup label="Label (optional)" label-for="label">
                                <BFormInput
                                    id="label"
                                    v-model="form.label"
                                    :aria-invalid="!!form.errors.label"
                                />
                                <InputError :message="form.errors.label" />
                            </BFormGroup>
                        </BCardBody>
                        <div class="card-footer d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                Anlegen
                            </BButton>
                            <Link href="/admin/permissions">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </div>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
