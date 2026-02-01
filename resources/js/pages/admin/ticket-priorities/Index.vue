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

type TicketPriority = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    ticketPriorities: { data: TicketPriority[]; links: { url: string | null; label: string; active: boolean }[] };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Prioritäten', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Priorität wirklich löschen?')) {
        router.delete(`/admin/ticket-priorities/${id}`);
    }
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Ticket-Prioritäten" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Ticket-Prioritäten</Heading>
                    <Text class="mt-2" muted>Prioritäten für Support-Tickets verwalten</Text>
                </div>
                <Link href="/admin/ticket-priorities/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Prioritäten</CardTitle>
                    <CardDescription>Name, Slug, Farbe, Sortierung, Aktiv</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Farbe</TableHead>
                                <TableHead>Sortierung</TableHead>
                                <TableHead>Aktiv</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="tp in ticketPriorities.data" :key="tp.id">
                                <TableCell>{{ tp.name }}</TableCell>
                                <TableCell><code class="text-sm">{{ tp.slug }}</code></TableCell>
                                <TableCell>
                                    <Badge
                                        v-if="tp.color"
                                        :style="{ backgroundColor: tp.color, color: '#fff', border: 'none' }"
                                    >
                                        {{ tp.color }}
                                    </Badge>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ tp.sort_order }}</TableCell>
                                <TableCell><Badge :variant="tp.is_active ? 'success' : 'secondary'">{{ tp.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/ticket-priorities/${tp.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(tp.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="ticketPriorities.data.length === 0">
                                <TableCell colspan="6" class="text-center text-muted">Keine Prioritäten.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="ticketPriorities.links.length > 3" :links="ticketPriorities.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
