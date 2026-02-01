<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    company?: string;
    street?: string;
    postal_code?: string;
    city?: string;
    country?: string;
};

type Quote = {
    id: number;
    number: string;
} | null;

type LineItem = {
    position: number;
    description: string;
    quantity: string;
    unit: string;
    amount: string;
};

type OrderConfirmation = {
    id: number;
    number: string;
    order_date: string;
    amount: string;
    user: User | null;
    quote: Quote;
    line_items: LineItem[];
    pdf_path: string | null;
};

type Props = {
    orderConfirmation: OrderConfirmation;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Auftragsbestätigungen', href: '/admin/order-confirmations' },
    { title: props.orderConfirmation.number, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Auftragsbestätigung ${orderConfirmation.number}`" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Auftragsbestätigung {{ orderConfirmation.number }}</Heading>
                    <Text class="mt-2" muted>
                        {{ orderConfirmation.user?.name }} · {{ orderConfirmation.user?.email }}
                    </Text>
                </div>
                <a
                    v-if="orderConfirmation.pdf_path"
                    :href="`/admin/order-confirmations/${orderConfirmation.id}/pdf`"
                    target="_blank"
                    rel="noopener"
                >
                    <Button variant="outline">PDF herunterladen</Button>
                </a>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Auftragsdatum, verknüpftes Angebot, Betrag</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between">
                        <Text muted>Auftragsdatum</Text>
                        <Text>{{ orderConfirmation.order_date }}</Text>
                    </div>
                    <div v-if="orderConfirmation.quote" class="flex justify-between">
                        <Text muted>Angebot</Text>
                        <Link
                            :href="`/admin/quotes/${orderConfirmation.quote.id}`"
                            class="text-primary hover:underline"
                        >
                            {{ orderConfirmation.quote.number }}
                        </Link>
                    </div>
                    <div class="flex justify-between">
                        <Text muted>Gesamtbetrag</Text>
                        <Text class="font-semibold">{{ orderConfirmation.amount }} €</Text>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="orderConfirmation.line_items?.length" class="max-w-2xl">
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
                            <TableRow
                                v-for="item in orderConfirmation.line_items"
                                :key="item.position"
                            >
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
