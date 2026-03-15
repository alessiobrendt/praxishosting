<!-- Admin: Abgeschlossene Batches -->
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

type FinishedBatch = {
    id: string;
    name: string;
    total_jobs: number;
    pending_jobs: number;
    failed_jobs: number;
    finished_at: string | null;
};

type Props = {
    finishedBatches: {
        data: FinishedBatch[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Jobs-Monitor', href: '/admin/jobs-monitor' },
    { title: 'Abgeschlossene Batches', href: '#' },
];

const tableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'total_jobs', label: 'Total', sortable: false },
    { key: 'pending_jobs', label: 'Pending', sortable: false },
    { key: 'failed_jobs', label: 'Failed', sortable: false },
    { key: 'finished_at', label: 'Abgeschlossen am', sortable: false },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Abgeschlossene Batches" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Abgeschlossene Batches</h4>
                        <p class="text-muted small mb-0">Batch-Jobs die erfolgreich abgeschlossen wurden</p>
                    </div>
                    <Link href="/admin/jobs-monitor">
                        <BButton variant="outline-secondary" size="sm">Zurück zum Jobs-Monitor</BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Abgeschlossene Batches</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Liste der abgeschlossenen Job-Batches (paginiert)</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="finishedBatches.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine abgeschlossenen Batches"
                        >
                            <template #cell(name)="row">
                                <span class="fw-medium">{{ row.item.name }}</span>
                            </template>
                            <template #cell(finished_at)="row">
                                {{ row.item.finished_at ?? '–' }}
                            </template>
                        </BTable>
                        <nav
                            v-if="finishedBatches.links && finishedBatches.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in finishedBatches.links"
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
