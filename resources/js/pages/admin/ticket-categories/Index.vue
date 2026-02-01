<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-vue-next';

type TicketCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    ticketCategories: { data: TicketCategory[]; links: { url: string | null; label: string; active: boolean }[] };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Kategorien', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Kategorie wirklich löschen?')) {
        router.delete(`/admin/ticket-categories/${id}`);
    }
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Ticket-Kategorien" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Ticket-Kategorien</Heading>
                    <Text class="mt-2" muted>Kategorien für Support-Tickets verwalten</Text>
                </div>
                <Link href="/admin/ticket-categories/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kategorien</CardTitle>
                    <CardDescription>Name, Slug, Sortierung, Aktiv</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Sortierung</TableHead>
                                <TableHead>Aktiv</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="tc in ticketCategories.data" :key="tc.id">
                                <TableCell>{{ tc.name }}</TableCell>
                                <TableCell><code class="text-sm">{{ tc.slug }}</code></TableCell>
                                <TableCell>{{ tc.sort_order }}</TableCell>
                                <TableCell><Badge :variant="tc.is_active ? 'success' : 'secondary'">{{ tc.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/ticket-categories/${tc.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(tc.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="ticketCategories.data.length === 0">
                                <TableCell colspan="5" class="text-center text-muted">Keine Kategorien.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="ticketCategories.links.length > 3" :links="ticketCategories.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
