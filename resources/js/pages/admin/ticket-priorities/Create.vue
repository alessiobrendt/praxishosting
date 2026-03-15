<!-- Admin: Ticket-Priorität anlegen -->
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
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    name: '',
    slug: '',
    color: '',
    sort_order: 0 as number | string,
    is_active: true,
});

const settingsSupportUrl = '/admin/settings?tab=support';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: 'Priorität anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Priorität anlegen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Ticket-Priorität anlegen</h4>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Priorität</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Name, Slug, Farbe (z. B. #ff0000), Sortierung</p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.post('/admin/ticket-priorities')">
                        <BCardBody>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Slug" label-for="slug">
                                <BFormInput id="slug" v-model="form.slug" required :aria-invalid="!!form.errors.slug" />
                                <InputError :message="form.errors.slug" />
                            </BFormGroup>
                            <BFormGroup label="Farbe (optional, z. B. #3b82f6)" label-for="color">
                                <BFormInput id="color" v-model="form.color" type="text" placeholder="#3b82f6" />
                                <InputError :message="form.errors.color" />
                            </BFormGroup>
                            <BFormGroup label="Sortierung" label-for="sort_order">
                                <BFormInput id="sort_order" v-model="form.sort_order" type="number" min="0" />
                            </BFormGroup>
                            <BFormGroup>
                                <BFormCheckbox id="is_active" v-model="form.is_active" switch>
                                    Aktiv
                                </BFormCheckbox>
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">Anlegen</BButton>
                            <Link :href="settingsSupportUrl">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
