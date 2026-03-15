<!-- Admin: Gutschein anlegen -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
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
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    code: '',
    balance: '',
    use_type: 'single_use',
    user_id: '' as string | number,
    is_active: true,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gutscheine', href: '/admin/vouchers' },
    { title: 'Neu', href: '#' },
];

const useTypeOptions = [
    { value: 'single_use', text: 'Einmal' },
    { value: 'multi_use', text: 'Mehrfach' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gutschein anlegen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Gutschein anlegen</h4>
                    <p class="text-muted small mb-0">Leer lassen = Code wird automatisch generiert.</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Gutschein</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Betrag in €, Einmal- oder Mehrfachnutzung</p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.post('/admin/vouchers')">
                        <BCardBody>
                            <BFormGroup label="Code (optional)" label-for="code">
                                <BFormInput id="code" v-model="form.code" placeholder="Leer = Auto" :aria-invalid="!!form.errors.code" />
                                <InputError :message="form.errors.code" />
                            </BFormGroup>
                            <BFormGroup label="Betrag (€)" label-for="balance">
                                <BFormInput
                                    id="balance"
                                    v-model="form.balance"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    :aria-invalid="!!form.errors.balance"
                                />
                                <InputError :message="form.errors.balance" />
                            </BFormGroup>
                            <BFormGroup label="Nutzung" label-for="use_type">
                                <BFormSelect id="use_type" v-model="form.use_type" :options="useTypeOptions" />
                            </BFormGroup>
                            <BFormGroup>
                                <BFormCheckbox id="is_active" v-model="form.is_active" switch>
                                    Aktiv
                                </BFormCheckbox>
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">Anlegen</BButton>
                            <Link href="/admin/vouchers">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
