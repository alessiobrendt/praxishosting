<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Site = {
    id: number;
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

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Legacy-Migration" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Legacy-Migration</Heading>
                <Text class="mt-2" muted>
                    Sites ohne Abo (Legacy). Kunden können über „Neue Site erstellen“ ein Abo abschließen.
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Legacy-Sites ohne Abo</CardTitle>
                    <CardDescription>
                        Diese Sites wurden vor dem Abo-System angelegt. Der Kunde kann im Panel „Neue Site erstellen“ nutzen und wird zum Checkout geführt. Alternativ können Sie den Kunden per E-Mail zur Abo-Buchung auffordern.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Site</TableHead>
                                <TableHead>Besitzer</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in legacySites.data" :key="site.uuid">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <span v-if="site.user">{{ site.user.name }} ({{ site.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ site.template?.name ?? '–' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/sites/${site.uuid}`">
                                        <Button variant="ghost" size="sm">Site ansehen</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="legacySites.data.length === 0">
                                <TableCell colspan="4" class="text-center text-muted">Keine Legacy-Sites ohne Abo.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="legacySites.links.length > 3"
                        :links="legacySites.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
