<!-- Admin: Template-Seiten (Übersicht) -->
<script setup lang="ts">
import { computed } from 'vue';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import JsonViewer from '@/components/JsonViewer.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import templates from '@/routes/admin/templates';
import { getTemplateEntry } from '@/templates/template-registry';
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
    pages: TemplatePage[];
};

const props = defineProps<Props>();

const hasPageDesigner = computed(
    () => getTemplateEntry(props.template.slug)?.getComponentRegistry != null,
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Seiten: ${template.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h4 class="mb-1">Seiten</h4>
                        <p class="text-muted small mb-0">Seiten dieses Templates: {{ template.name }}</p>
                    </div>
                    <div class="d-flex gap-2">
                        <Link :href="templates.show({ template: template.id }).url">
                            <BButton variant="outline-secondary">
                                <Icon icon="arrow-left" class="me-2" />Zurück
                            </BButton>
                        </Link>
                        <Link v-if="hasPageDesigner" :href="templates.design({ template: template.id }).url">
                            <BButton variant="primary">
                                <Icon icon="layout" class="me-2" />Standard-Seiten designen
                            </BButton>
                        </Link>
                        <Link :href="templates.pages.create({ template: template.id }).url">
                            <BButton variant="primary">
                                <Icon icon="plus" class="me-2" />Neue Seite
                            </BButton>
                        </Link>
                    </div>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Seiten dieses Templates</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Standardseiten dieser Vorlage. Kunden erhalten diese beim Kauf; hier legen Sie Inhalt und Reihenfolge fest.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div v-if="pages.length === 0" class="text-center py-5 text-muted">
                            <Icon icon="file-text" class="fs-1 opacity-50 mb-3" />
                            <p class="mb-3">Noch keine Seiten vorhanden</p>
                            <Link :href="templates.pages.create({ template: template.id }).url">
                                <BButton variant="primary">
                                    <Icon icon="plus" class="me-2" />Erste Seite hinzufügen
                                </BButton>
                            </Link>
                        </div>
                        <div v-else class="border-top">
                            <div
                                v-for="page in pages"
                                :key="page.id"
                                class="p-4 border-bottom"
                            >
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center gap-3">
                                        <span class="small text-muted font-monospace" style="width: 2rem">#{{ page.order }}</span>
                                        <div>
                                            <p class="fw-medium mb-0">{{ page.name }}</p>
                                            <p class="small text-muted mb-0">{{ page.slug }}</p>
                                        </div>
                                    </div>
                                    <Link :href="templates.pages.show({ template: template.id, page: page.id }).url">
                                        <BButton variant="outline-primary" size="sm">Anzeigen</BButton>
                                    </Link>
                                </div>
                                <Collapsible v-if="page.data" class="mt-3">
                                    <CollapsibleTrigger class="d-flex align-items-center gap-2 small text-muted text-decoration-none">
                                        <Icon icon="chevron-down" class="small" />
                                        <span>Seiten-Daten</span>
                                        <span class="ms-1">(JSON-Daten dieser Seite)</span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent class="mt-3">
                                        <JsonViewer :value="page.data" max-height="300px" />
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
