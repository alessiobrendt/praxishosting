<!-- Admin: Antwort-Vorlage bearbeiten -->
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
    BFormTextarea,
    BButton,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    body: string | null;
    sort_order: number;
};

type Props = { template: Template };

const props = defineProps<Props>();

const form = useForm({
    name: props.template.name,
    body: props.template.body ?? '',
    sort_order: props.template.sort_order,
});

const settingsVorlagenUrl = '/admin/settings?tab=vorlagen';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: props.template.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Vorlage: ${template.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Vorlage bearbeiten</h4>
                    <p class="text-muted small mb-0">{{ template.name }}</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">{{ template.name }}</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Platzhalter:
                            <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>
                        </p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.put(`/admin/ticket-message-templates/${template.id}`)">
                        <BCardBody>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Inhalt (HTML erlaubt)" label-for="body">
                                <BFormTextarea id="body" v-model="form.body" rows="6" :aria-invalid="!!form.errors.body" />
                                <InputError :message="form.errors.body" />
                            </BFormGroup>
                            <BFormGroup label="Sortierung" label-for="sort_order">
                                <BFormInput id="sort_order" v-model="form.sort_order" type="number" min="0" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
                            <Link :href="settingsVorlagenUrl">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
