<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SiteSubscription = {
    id: number;
    stripe_status: string;
    current_period_ends_at: string | null;
};

type Site = {
    id: number;
    name: string;
    slug: string;
    status: string;
    is_legacy: boolean;
    template?: { name: string };
    user?: { id: number; name: string; email: string };
    siteSubscription?: SiteSubscription | null;
};

type Props = {
    sites: { data: Site[]; links: { url: string | null; label: string; active: boolean }[] };
    filters: { status?: string; legacy?: string };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Sites', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const applyFilter = (key: string, value: string | null) => {
    router.get('/admin/sites', { ...props.filters, [key]: value || undefined }, { preserveState: true });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Sites (Admin)" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Sites</Heading>
                <Text class="mt-2" muted>
                    Alle Webseiten mit Status und Abo
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Sites</CardTitle>
                    <CardDescription>
                        Filter:
                        <Button variant="ghost" size="sm" :class="!filters.status ? 'font-bold' : ''" @click="applyFilter('status', null)">
                            Alle
                        </Button>
                        <Button variant="ghost" size="sm" :class="filters.status === 'active' ? 'font-bold' : ''" @click="applyFilter('status', 'active')">
                            Aktiv
                        </Button>
                        <Button variant="ghost" size="sm" :class="filters.status === 'suspended' ? 'font-bold' : ''" @click="applyFilter('status', 'suspended')">
                            Gesperrt
                        </Button>
                        |
                        <Button variant="ghost" size="sm" :class="filters.legacy === '1' ? 'font-bold' : ''" @click="applyFilter('legacy', filters.legacy === '1' ? '' : '1')">
                            Nur Legacy
                        </Button>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Besitzer</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Legacy</TableHead>
                                <TableHead>Abo Ende</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in sites.data" :key="site.id">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <span v-if="site.user">{{ site.user.name }} ({{ site.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ site.template?.name ?? '–' }}</TableCell>
                                <TableCell>
                                    <Badge :variant="site.status === 'active' ? 'success' : 'secondary'">{{ site.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ site.is_legacy ? 'Ja' : 'Nein' }}</TableCell>
                                <TableCell>{{ site.siteSubscription?.current_period_ends_at ?? '–' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/sites/${site.id}`">
                                        <Button variant="ghost" size="sm">Verwalten</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="sites.data.length === 0">
                                <TableCell colspan="7" class="text-center text-muted">Keine Sites.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="sites.links.length > 3"
                        :links="sites.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
