<!-- Admin: Legacy-Migration -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Site = {
    id: number;
    uuid?: string;
    name: string;
    slug: string;
    template?: { name: string };
    user?: { name: string; email: string };
};

type Props = {
    legacySites: { data: Site[]; links: { url: string | null; label: string; active: boolean }[] };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Legacy-Migration', href: '#' },
];

const tableFields = [
    { key: 'name', label: 'Site', sortable: false },
    { key: 'owner', label: 'Besitzer', sortable: false },
    { key: 'template', label: 'Template', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Legacy-Migration" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Legacy-Migration</h4>
                    <p class="text-muted small mb-0">
                        Sites ohne Abo (Legacy). Kunden können über „Neue Site erstellen“ ein Abo abschließen.
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Legacy-Sites ohne Abo</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Diese Sites wurden vor dem Abo-System angelegt. Der Kunde kann im Panel „Neue Site
                            erstellen“ nutzen und wird zum Checkout geführt.
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="legacySites.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Legacy-Sites ohne Abo"
                        >
                            <template #cell(name)="row">
                                <span class="fw-medium">{{ row.item.name }}</span>
                            </template>
                            <template #cell(owner)="row">
                                <span v-if="row.item.user">
                                    {{ row.item.user.name }} ({{ row.item.user.email }})
                                </span>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(template)="row">
                                {{ row.item.template?.name ?? '–' }}
                            </template>
                            <template #cell(actions)="row">
                                <Link
                                    :href="`/sites/${row.item.uuid ?? row.item.slug ?? row.item.id}`"
                                >
                                    <BButton variant="outline-primary" size="sm">Site ansehen</BButton>
                                </Link>
                            </template>
                        </BTable>
                        <nav
                            v-if="legacySites.links && legacySites.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in legacySites.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" :href="link.url" v-html="link.label" />
                                    <span v-else class="page-link" v-html="link.label" />
                                </li>
                            </ul>
                        </nav>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
