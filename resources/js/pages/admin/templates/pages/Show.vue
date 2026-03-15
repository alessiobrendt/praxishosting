<!-- Admin: Template-Seite (Detail) -->
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
};

type Props = {
    template: Template;
    page: TemplatePage;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: props.page.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="page.name" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h4 class="mb-1">{{ page.name }}</h4>
                        <p class="text-muted small mb-0">Seite für Template: {{ template.name }}</p>
                    </div>
                    <div class="d-flex gap-2">
                        <Link :href="templates.pages.index({ template: template.id }).url">
                            <BButton variant="outline-secondary">
                                <Icon icon="arrow-left" class="me-2" />Zurück
                            </BButton>
                        </Link>
                        <Link :href="`/admin/templates/${template.id}/pages/${page.id}/data`">
                            <BButton variant="outline-primary">
                                <Icon icon="pencil" class="me-2" />Daten bearbeiten
                            </BButton>
                        </Link>
                        <Link :href="templates.pages.edit({ template: template.id, page: page.id }).url">
                            <BButton variant="outline-primary">Einstellungen</BButton>
                        </Link>
                    </div>
                </div>

                <BRow>
                    <BCol md="6">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Grundinformationen</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">Basis-Details der Seite</p>
                            </BCardHeader>
                            <BCardBody>
                                <p class="text-muted small mb-1">Name:</p>
                                <p class="fw-medium mb-0">{{ page.name }}</p>
                                <p class="text-muted small mb-1 mt-3">Slug:</p>
                                <code class="small">{{ page.slug }}</code>
                                <p class="text-muted small mb-1 mt-3">Reihenfolge:</p>
                                <p class="fw-medium mb-0">#{{ page.order }}</p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="6">
                        <BCard v-if="page.data" no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0">Seiten-Daten</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">JSON-Daten dieser Seite</p>
                            </BCardHeader>
                            <BCardBody>
                                <pre class="small bg-light p-3 rounded overflow-auto mb-0" style="max-height: 24rem">{{ JSON.stringify(page.data, null, 2) }}</pre>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
