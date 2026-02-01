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

type User = {
    id: number;
    name: string;
    email: string;
};

type Quote = {
    id: number;
    number: string;
} | null;

type OrderConfirmation = {
    id: number;
    number: string;
    amount: string;
    order_date: string;
    user: User | null;
    quote: Quote;
    pdf_path: string | null;
};

type Props = {
    orderConfirmations: {
        data: OrderConfirmation[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Auftragsbestätigungen', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Auftragsbestätigungen" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Auftragsbestätigungen</Heading>
                    <Text class="mt-2" muted>
                        Übersicht aller Auftragsbestätigungen
                    </Text>
                </div>
                <Link href="/admin/order-confirmations/create">
                    <Button>Auftragsbestätigung erstellen</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Übersicht</CardTitle>
                    <CardDescription>Nummer, Kunde, Betrag, Datum, PDF-Download</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nummer</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Angebot</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="oc in orderConfirmations.data"
                                :key="oc.id"
                            >
                                <TableCell>
                                    <Link
                                        :href="`/admin/order-confirmations/${oc.id}`"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        {{ oc.number }}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <span v-if="oc.user">{{ oc.user.name }} ({{ oc.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>
                                    <span v-if="oc.quote">{{ oc.quote.number }}</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ oc.amount }} €</TableCell>
                                <TableCell>{{ oc.order_date }}</TableCell>
                                <TableCell class="text-right">
                                    <Link
                                        v-if="oc.pdf_path"
                                        :href="`/admin/order-confirmations/${oc.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline mr-2"
                                    >
                                        PDF
                                    </Link>
                                    <Link
                                        :href="`/admin/order-confirmations/${oc.id}`"
                                        class="text-primary hover:underline"
                                    >
                                        Anzeigen
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="orderConfirmations.links.length > 3"
                        :links="orderConfirmations.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
