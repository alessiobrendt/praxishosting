<!-- Admin: Template-Detail -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import templates from '@/routes/admin/templates';
import type { BreadcrumbItem } from '@/types';

type TemplatePage = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

type Template = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    price: string;
    colors: Record<string, string> | null;
    general_information: Record<string, string> | null;
    page_data: Record<string, unknown> | null;
    pages?: TemplatePage[];
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="template.name" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h4 class="mb-1">{{ template.name }}</h4>
                        <p class="text-muted small mb-0">Template-Details</p>
                    </div>
                    <div class="d-flex gap-2">
                        <Link :href="templates.pages.index({ template: template.id }).url">
                            <BButton variant="outline-primary">
                                <Icon icon="file-text" class="me-2" />Seiten verwalten
                            </BButton>
                        </Link>
                        <Link :href="templates.edit({ template: template.id }).url">
                            <BButton variant="outline-primary">
                                <Icon icon="pencil" class="me-2" />Bearbeiten
                            </BButton>
                        </Link>
                    </div>
                </div>

                <BRow>
                    <BCol md="6">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Grundinformationen</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Basis-Details des Templates</p>
                            </BCardHeader>
                            <BCardBody>
                                <p class="text-muted small mb-1">Slug:</p>
                                <code class="bg-light rounded px-2 py-1 small">{{ template.slug }}</code>
                                <p class="text-muted small mb-1 mt-3">Status:</p>
                                <BBadge :variant="template.is_active ? 'success' : 'danger'">
                                    {{ template.is_active ? 'Aktiv' : 'Inaktiv' }}
                                </BBadge>
                                <p class="text-muted small mb-1 mt-3">Preis:</p>
                                <p class="fw-medium mb-0">{{ template.price }} €</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="6">
                        <BCard v-if="template.colors || template.page_data" no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Zusätzliche Daten</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Erweiterte Template-Informationen</p>
                            </BCardHeader>
                            <BCardBody>
                                <div v-if="template.colors">
                                    <p class="small fw-medium mb-2">Farben</p>
                                    <pre class="small bg-light p-3 rounded overflow-auto mb-0">{{ JSON.stringify(template.colors, null, 2) }}</pre>
                                </div>
                                <div v-if="template.page_data">
                                    <p class="small fw-medium mb-2">Page Data</p>
                                    <pre class="small bg-light p-3 rounded overflow-auto mb-0" style="max-height: 16rem">{{ JSON.stringify(template.page_data, null, 2) }}</pre>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>

                <BCard no-body>
                    <BCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div>
                            <BCardTitle class="mb-0">Seiten</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Seiten dieses Templates</p>
                        </div>
                        <Link :href="`/admin/templates/${template.id}/pages/create`">
                            <BButton variant="primary" size="sm">
                                <Icon icon="plus" class="me-2" />Neue Seite
                            </BButton>
                        </Link>
                    </BCardHeader>
                    <BCardBody>
                        <div v-if="!template.pages || template.pages.length === 0" class="text-center py-5 text-muted">
                            <Icon icon="file-text" class="fs-1 opacity-50 mb-2" />
                            <p class="mb-0">Noch keine Seiten vorhanden</p>
                            <Link :href="templates.pages.create({ template: template.id }).url" class="mt-3 d-inline-block">
                                <BButton variant="outline-primary" size="sm">
                                    <Icon icon="plus" class="me-2" />Erste Seite hinzufügen
                                </BButton>
                            </Link>
                        </div>
                        <div v-else class="d-flex flex-column gap-2">
                            <div
                                v-for="page in template.pages"
                                :key="page.id"
                                class="d-flex align-items-center justify-content-between p-3 rounded border"
                            >
                                <div class="d-flex align-items-center gap-3">
                                    <span class="small text-muted">#{{ page.order }}</span>
                                    <div>
                                        <p class="fw-medium mb-0">{{ page.name }}</p>
                                        <p class="small text-muted mb-0">{{ page.slug }}</p>
                                    </div>
                                </div>
                                <Link :href="templates.pages.show({ template: template.id, page: page.id }).url">
                                    <BButton variant="outline-primary" size="sm">Anzeigen</BButton>
                                </Link>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
