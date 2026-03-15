<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
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

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Abgeschlossene Batches" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Abgeschlossene Batches</Heading>
                    <Text class="mt-2" muted>
                        Batch-Jobs die erfolgreich abgeschlossen wurden
                    </Text>
                </div>
                <Link href="/admin/jobs-monitor">
                    <Button variant="outline" size="sm">Zurück zum Jobs-Monitor</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Abgeschlossene Batches</CardTitle>
                    <CardDescription>Liste der abgeschlossenen Job-Batches (paginiert)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Pending</TableHead>
                                <TableHead>Failed</TableHead>
                                <TableHead>Abgeschlossen am</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="batch in finishedBatches.data" :key="batch.id">
                                <TableCell class="font-medium">{{ batch.name }}</TableCell>
                                <TableCell>{{ batch.total_jobs }}</TableCell>
                                <TableCell>{{ batch.pending_jobs }}</TableCell>
                                <TableCell>{{ batch.failed_jobs }}</TableCell>
                                <TableCell>{{ batch.finished_at ?? '–' }}</TableCell>
                            </TableRow>
                            <TableRow v-if="!finishedBatches.data?.length">
                                <TableCell colspan="5" class="py-8 text-center text-muted-foreground">
                                    Keine abgeschlossenen Batches.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="finishedBatches.links && finishedBatches.links.length > 3"
                        :links="finishedBatches.links"
                        @navigate="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
