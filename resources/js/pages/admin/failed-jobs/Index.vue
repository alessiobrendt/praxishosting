<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
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

function retry(id: number) {
    router.post(`/admin/failed-jobs/${id}/retry`);
}

function retryAll() {
    if (!confirm('Alle fehlgeschlagenen Jobs erneut in die Queue stellen?')) return;
    router.post('/admin/failed-jobs/retry-all');
}

function destroy(id: number) {
    if (!confirm('Diesen fehlgeschlagenen Job endgültig löschen?')) return;
    router.delete(`/admin/failed-jobs/${id}`);
}

function flush() {
    if (!confirm('Alle fehlgeschlagenen Jobs endgültig löschen? Dies kann nicht rückgängig gemacht werden.')) return;
    router.post('/admin/failed-jobs/flush');
}

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Fehlgeschlagene Jobs" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Fehlgeschlagene Jobs</Heading>
                    <Text class="mt-2" muted>
                        Queue-Jobs die fehlgeschlagen sind – erneut ausführen oder löschen
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        :disabled="!failedJobs.data?.length"
                        @click="retryAll"
                    >
                        Alle erneut ausführen
                    </Button>
                    <Button
                        variant="destructive"
                        :disabled="!failedJobs.data?.length"
                        @click="flush"
                    >
                        Alle löschen
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fehlgeschlagene Jobs</CardTitle>
                    <CardDescription>Liste der Jobs, die bei der Ausführung einen Fehler verursacht haben</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>UUID</TableHead>
                                <TableHead>Queue</TableHead>
                                <TableHead>Connection</TableHead>
                                <TableHead>Fehler (Auszug)</TableHead>
                                <TableHead>Fehlgeschlagen am</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="job in failedJobs.data" :key="job.id">
                                <TableCell class="font-mono text-sm">{{ job.id }}</TableCell>
                                <TableCell class="font-mono text-xs max-w-[8rem] truncate" :title="job.uuid">
                                    {{ job.uuid }}
                                </TableCell>
                                <TableCell>{{ job.queue }}</TableCell>
                                <TableCell>{{ job.connection }}</TableCell>
                                <TableCell class="max-w-md truncate text-muted-foreground" :title="job.exception_preview">
                                    {{ job.exception_preview || '–' }}
                                </TableCell>
                                <TableCell>{{ job.failed_at }}</TableCell>
                                <TableCell class="text-right">
                                    <Button variant="outline" size="sm" class="mr-2" @click="retry(job.id)">
                                        Erneut ausführen
                                    </Button>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(job.id)">
                                        Löschen
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="!failedJobs.data?.length">
                                <TableCell colspan="7" class="py-8 text-center text-muted-foreground">
                                    Keine fehlgeschlagenen Jobs.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="failedJobs.links && failedJobs.links.length > 3"
                        :links="failedJobs.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
