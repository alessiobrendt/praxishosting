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

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Wartende Jobs" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Wartende Jobs</Heading>
                    <Text class="mt-2" muted>
                        Jobs in der Queue, die noch auf Abarbeitung warten
                    </Text>
                </div>
                <Link href="/admin/jobs-monitor">
                    <Button variant="outline" size="sm">Zurück zum Jobs-Monitor</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wartende Jobs</CardTitle>
                    <CardDescription>Liste der Jobs in der Datenbank-Queue (paginiert)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Queue</TableHead>
                                <TableHead>Versuche</TableHead>
                                <TableHead>Verfügbar ab</TableHead>
                                <TableHead>Erstellt</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="job in waitingJobs.data" :key="job.id">
                                <TableCell class="font-mono text-sm">{{ job.id }}</TableCell>
                                <TableCell>{{ job.queue }}</TableCell>
                                <TableCell>{{ job.attempts }}</TableCell>
                                <TableCell>{{ job.available_at }}</TableCell>
                                <TableCell>{{ job.created_at }}</TableCell>
                            </TableRow>
                            <TableRow v-if="!waitingJobs.data?.length">
                                <TableCell colspan="5" class="py-8 text-center text-muted-foreground">
                                    Keine wartenden Jobs.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="waitingJobs.links && waitingJobs.links.length > 3"
                        :links="waitingJobs.links"
                        @navigate="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
