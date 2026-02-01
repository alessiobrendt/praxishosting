<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type Quote = {
    id: number;
    number: string;
    status: string;
    amount: string;
    invoice_date: string;
    valid_until: string | null;
    user: User | null;
    pdf_path: string | null;
};

type Props = {
    quotes: {
        data: Quote[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Angebote', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const statusLabel: Record<string, string> = {
    draft: 'Entwurf',
    sent: 'Versendet',
    accepted: 'Angenommen',
    rejected: 'Abgelehnt',
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Angebote" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Angebote</Heading>
                    <Text class="mt-2" muted>
                        Übersicht aller Angebote
                    </Text>
                </div>
                <Link href="/admin/quotes/create">
                    <Button>Angebot erstellen</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Angebotsübersicht</CardTitle>
                    <CardDescription>Nummer, Kunde, Betrag, Status, PDF-Download</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nummer</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="quote in quotes.data" :key="quote.id">
                                <TableCell>
                                    <Link
                                        :href="`/admin/quotes/${quote.id}`"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        {{ quote.number }}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <span v-if="quote.user">{{ quote.user.name }} ({{ quote.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ quote.amount }} €</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ statusLabel[quote.status] ?? quote.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ quote.invoice_date }}</TableCell>
                                <TableCell class="text-right">
                                    <Link
                                        v-if="quote.pdf_path"
                                        :href="`/admin/quotes/${quote.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline mr-2"
                                    >
                                        PDF
                                    </Link>
                                    <Link
                                        :href="`/admin/quotes/${quote.id}`"
                                        class="text-primary hover:underline"
                                    >
                                        Anzeigen
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="quotes.links.length > 3"
                        :links="quotes.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
