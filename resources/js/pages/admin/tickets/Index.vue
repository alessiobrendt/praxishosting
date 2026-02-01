<script setup lang="ts">
import { reactive } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import adminTickets from '@/routes/admin/tickets';
import type { BreadcrumbItem } from '@/types';
import { MessageCircle } from 'lucide-vue-next';

type User = { id: number; name: string; email?: string };
type Site = { id: number; name: string; slug: string } | null;
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;

type Ticket = {
    id: number;
    subject: string;
    status: string;
    created_at: string;
    user?: User;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority;
    site?: Site;
    assigned_to?: User | null;
};

type Props = {
    tickets: { data: Ticket[]; links: { url: string | null; label: string; active: boolean }[] };
    categories: TicketCategory[];
    priorities: TicketPriority[];
    admins: User[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Tickets', href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const filters = reactive({
    status: '',
    ticket_category_id: '',
    ticket_priority_id: '',
    user_id: '',
    assigned_to: '',
});

function applyFilters() {
    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.ticket_category_id) params.ticket_category_id = filters.ticket_category_id;
    if (filters.ticket_priority_id) params.ticket_priority_id = filters.ticket_priority_id;
    if (filters.user_id) params.user_id = filters.user_id;
    if (filters.assigned_to) params.assigned_to = filters.assigned_to;
    router.get('/admin/tickets', params);
}

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Support-Tickets" />

        <div class="space-y-6">
            <Heading level="h1">Support-Tickets</Heading>
            <Text class="mt-2" muted>Alle Support-Anfragen verwalten</Text>

            <Card>
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                    <CardDescription>Status, Kategorie, Priorität</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-wrap items-end gap-4">
                    <div class="space-y-1">
                        <label class="text-sm font-medium">Status</label>
                        <Select v-model="filters.status" class="w-48">
                            <option value="">Alle</option>
                            <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
                        </Select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-sm font-medium">Kategorie</label>
                        <Select v-model="filters.ticket_category_id" class="w-48">
                            <option value="">Alle</option>
                            <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
                        </Select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-sm font-medium">Priorität</label>
                        <Select v-model="filters.ticket_priority_id" class="w-48">
                            <option value="">Alle</option>
                            <option v-for="p in priorities" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
                        </Select>
                    </div>
                    <Button type="button" @click="applyFilters">Filter anwenden</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription>Kunde, Betreff, Status, Priorität, Produkt</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Betreff</TableHead>
                                <TableHead>Kategorie</TableHead>
                                <TableHead>Priorität</TableHead>
                                <TableHead>Site</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Zugewiesen</TableHead>
                                <TableHead>Erstellt</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="t in tickets.data" :key="t.id">
                                <TableCell>#{{ t.id }}</TableCell>
                                <TableCell>{{ t.user?.name ?? '–' }}<br /><span class="text-muted-foreground text-xs">{{ t.user?.email }}</span></TableCell>
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
                                <TableCell>{{ t.assigned_to?.name ?? '–' }}</TableCell>
                                <TableCell>{{ new Date(t.created_at).toLocaleDateString('de-DE') }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="adminTickets.show(t.id).url">
                                        <Button variant="ghost" size="sm"><MessageCircle class="h-4 w-4" /></Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="tickets.data.length === 0">
                                <TableCell colspan="10" class="text-center text-muted">Keine Tickets.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="tickets.links.length > 3" :links="tickets.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
