<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type LineItem = {
    position: number;
    description: string;
    quantity: string;
    unit: string;
    amount: string;
};

type Quote = {
    id: number;
    number: string;
    status: string;
    amount: string;
    invoice_date: string;
    valid_until: string | null;
    user: User | null;
    line_items: LineItem[];
    pdf_path: string | null;
};

type Props = {
    quote: Quote;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Angebote', href: '/admin/quotes' },
    { title: props.quote.number, href: '#' },
];

const statusLabel: Record<string, string> = {
    draft: 'Entwurf',
    sent: 'Versendet',
    accepted: 'Angenommen',
    rejected: 'Abgelehnt',
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Angebot ${quote.number}`" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Angebot {{ quote.number }}</Heading>
                    <Text class="mt-2" muted>
                        {{ quote.user?.name }} · {{ quote.user?.email }}
                    </Text>
                </div>
                <div class="flex gap-2">
                    <Link :href="`/admin/order-confirmations/create?from_quote=${quote.id}`">
                        <Button variant="outline">Auftragsbestätigung erstellen</Button>
                    </Link>
                    <a
                        v-if="quote.pdf_path"
                        :href="`/admin/quotes/${quote.id}/pdf`"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline">PDF herunterladen</Button>
                    </a>
                </div>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Betrag, Status, Gültigkeit</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between">
                        <Text muted>Betrag</Text>
                        <Text class="font-semibold">{{ quote.amount }} €</Text>
                    </div>
                    <div class="flex justify-between">
                        <Text muted>Status</Text>
                        <Badge variant="secondary">{{ statusLabel[quote.status] ?? quote.status }}</Badge>
                    </div>
                    <div class="flex justify-between">
                        <Text muted>Angebotsdatum</Text>
                        <Text>{{ quote.invoice_date }}</Text>
                    </div>
                    <div v-if="quote.valid_until" class="flex justify-between">
                        <Text muted>Gültig bis</Text>
                        <Text>{{ quote.valid_until }}</Text>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="quote.line_items?.length" class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Positionen</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-12">Pos.</TableHead>
                                <TableHead>Beschreibung</TableHead>
                                <TableHead class="text-right">Menge</TableHead>
                                <TableHead class="text-right">Betrag</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="item in quote.line_items" :key="item.position">
                                <TableCell>{{ item.position }}</TableCell>
                                <TableCell>{{ item.description }}</TableCell>
                                <TableCell class="text-right">{{ item.quantity }} {{ item.unit }}</TableCell>
                                <TableCell class="text-right">{{ item.amount }} €</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
