<!-- Admin: Wartende Jobs -->
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

type WaitingJob = {
    id: number;
    queue: string;
    attempts: number;
    available_at: string;
    created_at: string;
};

type Props = {
    waitingJobs: {
        data: WaitingJob[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Jobs-Monitor', href: '/admin/jobs-monitor' },
    { title: 'Wartende Jobs', href: '#' },
];

const tableFields = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'queue', label: 'Queue', sortable: false },
    { key: 'attempts', label: 'Versuche', sortable: false },
    { key: 'available_at', label: 'Verfügbar ab', sortable: false },
    { key: 'created_at', label: 'Erstellt', sortable: false },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Wartende Jobs" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Wartende Jobs</h4>
                        <p class="text-muted small mb-0">Jobs in der Queue, die noch auf Abarbeitung warten</p>
                    </div>
                    <Link href="/admin/jobs-monitor">
                        <BButton variant="outline-secondary" size="sm">Zurück zum Jobs-Monitor</BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Wartende Jobs</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Liste der Jobs in der Datenbank-Queue (paginiert)</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="waitingJobs.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine wartenden Jobs"
                        >
                            <template #cell(id)="row">
                                <span class="font-monospace small">{{ row.item.id }}</span>
                            </template>
                        </BTable>
                        <nav
                            v-if="waitingJobs.links && waitingJobs.links.length > 3"
                            class="d-flex justify-content-center p-3"
                        >
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in waitingJobs.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" href="#" @click.prevent="link.url && (window.location.href = link.url)" v-html="link.label" />
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
