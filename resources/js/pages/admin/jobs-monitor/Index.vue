<!-- Admin: Jobs-Monitor -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    failedJobsCount: number;
    waitingJobsCount: number;
    finishedBatchesCount: number;
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Jobs-Monitor', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Jobs-Monitor" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Jobs-Monitor</h4>
                    <p class="text-muted small mb-0">
                        Übersicht Queue-Statistiken: fehlgeschlagen, wartend, abgeschlossen
                    </p>
                </div>

                <BRow>
                    <BCol md="4" class="mb-4">
                        <BCard no-body class="h-100">
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Fehlgeschlagene Jobs</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">
                                    Jobs die bei der Ausführung fehlgeschlagen sind
                                </p>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-2 fw-bold">{{ failedJobsCount }}</span>
                                <div class="mt-3">
                                    <Link href="/admin/failed-jobs">
                                        <BButton variant="outline-primary" size="sm">Zur Übersicht</BButton>
                                    </Link>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="4" class="mb-4">
                        <BCard no-body class="h-100">
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Wartende Jobs</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">
                                    Jobs die noch in der Queue auf Abarbeitung warten
                                </p>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-2 fw-bold">{{ waitingJobsCount }}</span>
                                <div class="mt-3">
                                    <Link href="/admin/waiting-jobs">
                                        <BButton variant="outline-primary" size="sm">Zur Übersicht</BButton>
                                    </Link>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="4" class="mb-4">
                        <BCard no-body class="h-100">
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Abgeschlossene Batches</BCardTitle>
                                <p class="text-muted small mb-0 mt-1">
                                    Batch-Jobs die erfolgreich abgeschlossen wurden
                                </p>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-2 fw-bold">{{ finishedBatchesCount }}</span>
                                <div class="mt-3">
                                    <Link href="/admin/finished-batches">
                                        <BButton variant="outline-primary" size="sm">Zur Übersicht</BButton>
                                    </Link>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
