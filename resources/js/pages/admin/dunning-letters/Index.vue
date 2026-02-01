<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type Invoice = {
    id: number;
    number: string;
    user_id: number;
    user: User | null;
};

type DunningLetter = {
    id: number;
    invoice_id: number;
    level: number;
    sent_at: string;
    fee_amount: string;
    pdf_path: string | null;
    invoice: Invoice;
};

type Props = {
    dunningLetters: {
        data: DunningLetter[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Mahnungen', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Mahnungen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Mahnungen</Heading>
                <Text class="mt-2" muted>
                    Übersicht aller versendeten Mahnungen
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mahnungsübersicht</CardTitle>
                    <CardDescription>Rechnung, Kunde, Stufe, Datum, Gebühr, PDF</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rechnung</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Stufe</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Gebühr</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="d in dunningLetters.data"
                                :key="d.id"
                            >
                                <TableCell>
                                    <Link
                                        :href="`/admin/invoices/${d.invoice.id}`"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        {{ d.invoice?.number ?? '–' }}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <span v-if="d.invoice?.user">{{ d.invoice.user.name }} ({{ d.invoice.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ d.level }}. Mahnung</TableCell>
                                <TableCell>{{ d.sent_at }}</TableCell>
                                <TableCell>{{ d.fee_amount }} €</TableCell>
                                <TableCell class="text-right">
                                    <a
                                        v-if="d.pdf_path"
                                        :href="`/admin/invoices/${d.invoice_id}/dunning/${d.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline"
                                    >
                                        PDF
                                    </a>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-if="!dunningLetters.data.length" class="py-8 text-center text-muted-foreground">
                        Noch keine Mahnungen erstellt.
                    </p>
                    <Pagination
                        v-if="dunningLetters.links.length > 3"
                        :links="dunningLetters.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
