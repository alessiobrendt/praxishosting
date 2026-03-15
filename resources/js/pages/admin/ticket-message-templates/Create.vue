<!-- Admin: Antwort-Vorlage anlegen -->
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

const form = useForm({
    name: '',
    body: '',
    sort_order: 0 as number | string,
});

const settingsVorlagenUrl = '/admin/settings?tab=vorlagen';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: 'Vorlage anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Vorlage anlegen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Antwort-Vorlage anlegen</h4>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Vorlage</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Name und Inhalt. Platzhalter:
                            <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>
                        </p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.post('/admin/ticket-message-templates')">
                        <BCardBody>
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput
                                    id="name"
                                    v-model="form.name"
                                    required
                                    placeholder="z. B. Begrüßung"
                                    :aria-invalid="!!form.errors.name"
                                />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Inhalt (HTML erlaubt)" label-for="body">
                                <BFormTextarea
                                    id="body"
                                    v-model="form.body"
                                    rows="6"
                                    placeholder="z. B. Hallo {{name}},&#10;&#10;vielen Dank für Ihre Anfrage (Ticket #{{ticket_id}})."
                                    :aria-invalid="!!form.errors.body"
                                />
                                <InputError :message="form.errors.body" />
                            </BFormGroup>
                            <BFormGroup label="Sortierung" label-for="sort_order">
                                <BFormInput id="sort_order" v-model="form.sort_order" type="number" min="0" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">Anlegen</BButton>
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
