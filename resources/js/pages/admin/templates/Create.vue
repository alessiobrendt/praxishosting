<!-- Admin: Template erstellen -->
<script setup lang="ts">
import { ref } from 'vue';
import { Form, Head, Link } from '@inertiajs/vue3';
import TemplateController from '@/actions/App/Http/Controllers/Admin/TemplateController';
import InputError from '@/components/InputError.vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BFormGroup,
    BFormInput,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { index as templatesIndex } from '@/routes/admin/templates';
import type { BreadcrumbItem } from '@/types';

const colors = ref({
    primary: '',
    primaryHover: '',
    primaryLight: '',
    primaryDark: '',
    secondary: '',
    tertiary: '',
    quaternary: '',
    quinary: '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templatesIndex().url },
    { title: 'Neues Template', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Template erstellen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Neues Template</h4>
                    <p class="text-muted small mb-0">Template anlegen</p>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Template-Details</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Geben Sie die Informationen für das neue Template ein</p>
                    </BCardHeader>
                    <BCardBody>
                        <Form v-bind="TemplateController.store.form()" v-slot="{ errors }">
                            <BFormGroup label="Name" label-for="name">
                                <BFormInput
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Name"
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Slug" label-for="slug">
                                <BFormInput
                                    id="slug"
                                    name="slug"
                                    required
                                    placeholder="slug-url"
                                    :aria-invalid="!!errors.slug"
                                />
                                <InputError :message="errors.slug" />
                            </BFormGroup>
                            <BFormGroup label="Preis" label-for="price">
                                <BFormInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value="0"
                                    :aria-invalid="!!errors.price"
                                />
                                <InputError :message="errors.price" />
                            </BFormGroup>
                            <p class="text-muted small mb-2">Farben</p>
                            <div class="border rounded p-3 mb-4">
                                <BRow>
                                    <BCol md="6">
                                        <BFormGroup label="Primary" label-for="color-primary" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-primary"
                                                    name="colors[primary]"
                                                    v-model="colors.primary"
                                                    placeholder="#059669"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.primary || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Primary Hover" label-for="color-primaryHover" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-primaryHover"
                                                    name="colors[primaryHover]"
                                                    v-model="colors.primaryHover"
                                                    placeholder="#047857"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.primaryHover || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Primary Light" label-for="color-primaryLight" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-primaryLight"
                                                    name="colors[primaryLight]"
                                                    v-model="colors.primaryLight"
                                                    placeholder="#ecfdf5"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.primaryLight || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Primary Dark" label-for="color-primaryDark" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-primaryDark"
                                                    name="colors[primaryDark]"
                                                    v-model="colors.primaryDark"
                                                    placeholder="#065f46"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.primaryDark || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Secondary" label-for="color-secondary" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-secondary"
                                                    name="colors[secondary]"
                                                    v-model="colors.secondary"
                                                    placeholder="#0f172a"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.secondary || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Tertiary" label-for="color-tertiary" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-tertiary"
                                                    name="colors[tertiary]"
                                                    v-model="colors.tertiary"
                                                    placeholder="#334155"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.tertiary || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Quaternary" label-for="color-quaternary" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-quaternary"
                                                    name="colors[quaternary]"
                                                    v-model="colors.quaternary"
                                                    placeholder="#f8fafc"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.quaternary || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Quinary" label-for="color-quinary" label-size="sm">
                                            <div class="d-flex gap-2 align-items-center">
                                                <BFormInput
                                                    id="color-quinary"
                                                    name="colors[quinary]"
                                                    v-model="colors.quinary"
                                                    placeholder="#f1f5f9"
                                                />
                                                <div
                                                    class="rounded border flex-shrink-0"
                                                    style="width: 4rem; height: 2.25rem"
                                                    :style="{ backgroundColor: colors.quinary || 'transparent' }"
                                                />
                                            </div>
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                                <InputError :message="(errors as Record<string, string>).colors" />
                            </div>
                            <div class="d-flex gap-2 mt-3">
                                <BButton type="submit" variant="primary">Speichern</BButton>
                                <Link :href="templatesIndex().url">
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
