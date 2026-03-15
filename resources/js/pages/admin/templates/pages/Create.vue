<!-- Admin: Template-Seite erstellen -->
<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import TemplatePageController from '@/actions/App/Http/Controllers/Admin/TemplatePageController';
import InputError from '@/components/InputError.vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BFormGroup,
    BFormInput,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import templates from '@/routes/admin/templates';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: 'Neue Seite', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Neue Seite: ${template.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h4 class="mb-0">Neue Seite</h4>
                    <Link :href="`/admin/templates/${template.id}/pages`">
                        <BButton variant="outline-secondary">
                            <Icon icon="arrow-left" class="me-2" />Zurück
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Seiten-Details</BCardTitle>
                    </BCardHeader>
                    <BCardBody>
                        <Form
                            :key="template.id"
                            v-bind="
                                TemplatePageController.store.form({
                                    template: template.id,
                                })
                            "
                            v-slot="{ errors }"
                        >
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="z. B. Startseite"
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Slug" label-for="slug">
                                <BFormInput
                                    id="slug"
                                    name="slug"
                                    required
                                    placeholder="startseite"
                                    :aria-invalid="!!errors.slug"
                                />
                                <InputError :message="errors.slug" />
                            </BFormGroup>
                            <BFormGroup label="Reihenfolge" label-for="order">
                                <BFormInput
                                    id="order"
                                    name="order"
                                    type="number"
                                    value="0"
                                    min="0"
                                    :aria-invalid="!!errors.order"
                                />
                                <InputError :message="errors.order" />
                            </BFormGroup>
                            <div class="d-flex gap-2 mt-3">
                                <BButton type="submit" variant="primary">Seite erstellen</BButton>
                                <Link :href="templates.pages.index({ template: template.id }).url">
                                    <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                                </Link>
                            </div>
                        </Form>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
