<!-- Admin: Ticket-Priorität bearbeiten -->
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

type TicketPriority = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = { ticketPriority: TicketPriority };

const props = defineProps<Props>();

const form = useForm({
    name: props.ticketPriority.name,
    slug: props.ticketPriority.slug,
    color: props.ticketPriority.color ?? '',
    sort_order: props.ticketPriority.sort_order,
    is_active: props.ticketPriority.is_active,
});

const settingsSupportUrl = '/admin/settings?tab=support';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: props.ticketPriority.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Priorität: ${ticketPriority.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Priorität bearbeiten</h4>
                    <p class="text-muted small mb-0">{{ ticketPriority.name }}</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">{{ ticketPriority.name }}</BCardTitle>
                    </BCardHeader>
                    <BForm @submit.prevent="form.put(`/admin/ticket-priorities/${ticketPriority.id}`)">
                        <BCardBody>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Slug" label-for="slug">
                                <BFormInput id="slug" v-model="form.slug" required :aria-invalid="!!form.errors.slug" />
                                <InputError :message="form.errors.slug" />
                            </BFormGroup>
                            <BFormGroup label="Farbe (optional)" label-for="color">
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
                            <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
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
