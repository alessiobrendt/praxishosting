<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
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

        <div class="space-y-6">
            <div>
                <Heading level="h1">Jobs-Monitor</Heading>
                <Text class="mt-2" muted>
                    Übersicht Queue-Statistiken: fehlgeschlagen, wartend, abgeschlossen
                </Text>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Fehlgeschlagene Jobs</CardTitle>
                        <CardDescription>Jobs die bei der Ausführung fehlgeschlagen sind</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ failedJobsCount }}</span>
                        <div class="mt-3">
                            <Link href="/admin/failed-jobs">
                                <Button variant="outline" size="sm">Zur Übersicht</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Wartende Jobs</CardTitle>
                        <CardDescription>Jobs die noch in der Queue auf Abarbeitung warten</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ waitingJobsCount }}</span>
                        <div class="mt-3">
                            <Link href="/admin/waiting-jobs">
                                <Button variant="outline" size="sm">Zur Übersicht</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Abgeschlossene Batches</CardTitle>
                        <CardDescription>Batch-Jobs die erfolgreich abgeschlossen wurden</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ finishedBatchesCount }}</span>
                        <div class="mt-3">
                            <Link href="/admin/finished-batches">
                                <Button variant="outline" size="sm">Zur Übersicht</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AdminLayout>
</template>
