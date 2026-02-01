<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import { index as supportIndex, create as supportCreate, show as supportShow } from '@/routes/support';
import type { BreadcrumbItem } from '@/types';
import { Plus, MessageCircle } from 'lucide-vue-next';

type Site = { id: number; name: string; slug: string } | null;
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;

type Ticket = {
    id: number;
    subject: string;
    status: string;
    created_at: string;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority;
    site?: Site;
};

type Props = {
    tickets: { data: Ticket[]; links: { url: string | null; label: string; active: boolean }[] };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Support', href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Tickets" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Meine Tickets</Heading>
                    <Text class="mt-2" muted>Support-Anfragen und Nachrichtenverlauf</Text>
                </div>
                <Link :href="supportCreate().url">
                    <Button><Plus class="mr-2 h-4 w-4" />Neues Ticket</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription>Ihre Support-Anfragen</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Betreff</TableHead>
                                <TableHead>Kategorie</TableHead>
                                <TableHead>Priorität</TableHead>
                                <TableHead>Produkt/Site</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Erstellt</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="t in tickets.data" :key="t.id">
                                <TableCell>{{ t.subject }}</TableCell>
                                <TableCell>{{ t.ticket_category?.name ?? '–' }}</TableCell>
                                <TableCell>
                                    <Badge
                                        v-if="t.ticket_priority"
                                        :style="t.ticket_priority.color ? { backgroundColor: t.ticket_priority.color, color: '#fff', border: 'none' } : undefined"
                                    >
                                        {{ t.ticket_priority.name }}
                                    </Badge>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ t.site?.name ?? '–' }}</TableCell>
                                <TableCell>{{ statusLabels[t.status] ?? t.status }}</TableCell>
                                <TableCell>{{ new Date(t.created_at).toLocaleDateString('de-DE') }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="supportShow(t.id).url">
                                        <Button variant="ghost" size="sm"><MessageCircle class="h-4 w-4" /></Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="tickets.data.length === 0">
                                <TableCell colspan="7" class="text-center text-muted">Keine Tickets.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="tickets.links.length > 3" :links="tickets.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
