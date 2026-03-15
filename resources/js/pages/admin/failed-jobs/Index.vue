<!-- Admin: Fehlgeschlagene Jobs -->
<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
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

type FailedJob = {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    exception_preview: string;
    failed_at: string;
};

type Props = {
    failedJobs: {
        data: FailedJob[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Fehlgeschlagene Jobs', href: '#' },
];

function retry(id: number): void {
    router.post(`/admin/failed-jobs/${id}/retry`);
}

function retryAll(): void {
    if (!confirm('Alle fehlgeschlagenen Jobs erneut in die Queue stellen?')) return;
    router.post('/admin/failed-jobs/retry-all');
}

function destroy(id: number): void {
    if (!confirm('Diesen fehlgeschlagenen Job endgültig löschen?')) return;
    router.delete(`/admin/failed-jobs/${id}`);
}

function flush(): void {
    if (
        !confirm(
            'Alle fehlgeschlagenen Jobs endgültig löschen? Dies kann nicht rückgängig gemacht werden.',
        )
    )
        return;
    router.post('/admin/failed-jobs/flush');
}

const tableFields = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'uuid', label: 'UUID', sortable: false },
    { key: 'queue', label: 'Queue', sortable: false },
    { key: 'connection', label: 'Connection', sortable: false },
    { key: 'exception_preview', label: 'Fehler (Auszug)', sortable: false },
    { key: 'failed_at', label: 'Fehlgeschlagen am', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Fehlgeschlagene Jobs" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Fehlgeschlagene Jobs</h4>
                        <p class="text-muted small mb-0">
                            Queue-Jobs die fehlgeschlagen sind – erneut ausführen oder löschen
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <BButton
                            variant="outline-primary"
                            :disabled="!failedJobs.data?.length"
                            @click="retryAll"
                        >
                            Alle erneut ausführen
                        </BButton>
                        <BButton
                            variant="danger"
                            :disabled="!failedJobs.data?.length"
                            @click="flush"
                        >
                            Alle löschen
                        </BButton>
                    </div>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Fehlgeschlagene Jobs</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Liste der Jobs, die bei der Ausführung einen Fehler verursacht haben
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="failedJobs.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine fehlgeschlagenen Jobs"
                        >
                            <template #cell(id)="row">
                                <span class="font-monospace small">{{ row.item.id }}</span>
                            </template>
                            <template #cell(uuid)="row">
                                <span
                                    class="font-monospace small text-truncate d-inline-block"
                                    style="max-width: 10rem"
                                    :title="row.item.uuid"
                                >
                                    {{ row.item.uuid }}
                                </span>
                            </template>
                            <template #cell(exception_preview)="row">
                                <span
                                    class="text-muted text-truncate d-inline-block"
                                    style="max-width: 20rem"
                                    :title="row.item.exception_preview"
                                >
                                    {{ row.item.exception_preview || '–' }}
                                </span>
                            </template>
                            <template #cell(actions)="row">
                                <BButton
                                    variant="outline-primary"
                                    size="sm"
                                    class="me-2"
                                    @click="retry(row.item.id)"
                                >
                                    Erneut ausführen
                                </BButton>
                                <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                    Löschen
                                </BButton>
                            </template>
                        </BTable>
                        <nav
                            v-if="failedJobs.links && failedJobs.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in failedJobs.links"
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
