<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import {
    index as invoicesIndex,
    create as invoicesCreate,
    show as invoicesShow,
    exportMethod as invoicesExport,
} from '@/routes/admin/invoices';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type Invoice = {
    id: number;
    number: string;
    type: string;
    amount: string;
    status: string;
    invoice_date: string;
    pdf_path: string | null;
    invoice_xml_path: string | null;
    user: User | null;
};

type Props = {
    invoices: {
        data: Invoice[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const INVOICE_STATUS_LABELS: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
};

const invoiceStatusLabel = (status: string): string =>
    INVOICE_STATUS_LABELS[status] ?? status;

const invoiceStatusClass = (status: string): string => {
    const base = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium';
    switch (status) {
        case 'paid':
            return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
        case 'pending':
            return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`;
        case 'draft':
            return `${base} bg-muted text-muted-foreground`;
        case 'sent':
            return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
        default:
            return `${base} bg-muted text-muted-foreground`;
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const exportFrom = ref<string>('');
const exportTo = ref<string>('');

const exportUrl = computed(() => {
    const query: Record<string, string> = {};
    if (exportFrom.value) query.from = exportFrom.value;
    if (exportTo.value) query.to = exportTo.value;
    return invoicesExport.url({ query });
});

const openExport = () => {
    window.open(exportUrl.value, '_blank');
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Rechnungen" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Rechnungen</Heading>
                    <Text class="mt-2" muted>
                        Übersicht aller Rechnungen (§ 19 UStG)
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Link :href="invoicesCreate().url">
                        <Button>Rechnung erstellen</Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Umsatz exportieren (CSV)</CardTitle>
                    <CardDescription>
                        Bezahlte Rechnungen als CSV – optional Zeitraum wählen (von/bis), sonst alle.
                    </CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col sm:flex-row sm:items-end gap-4 pb-6">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="space-y-2">
                            <Label for="export-from">Von</Label>
                            <Input
                                id="export-from"
                                v-model="exportFrom"
                                type="date"
                                class="w-full sm:w-auto"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="export-to">Bis</Label>
                            <Input
                                id="export-to"
                                v-model="exportTo"
                                type="date"
                                class="w-full sm:w-auto"
                            />
                        </div>
                        <Button variant="outline" @click="openExport">
                            Export starten
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rechnungsübersicht</CardTitle>
                    <CardDescription>
                        Übersicht aller Rechnungen (§ 19 UStG)
                    </CardDescription>
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
                            <TableRow
                                v-for="invoice in invoices.data"
                                :key="invoice.id"
                            >
                                <TableCell>
                                    <Link
                                        :href="invoicesShow({ invoice: invoice.id }).url"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        {{ invoice.number }}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <span v-if="invoice.user">{{ invoice.user.name }} ({{ invoice.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>{{ invoice.amount }} €</TableCell>
                                <TableCell>
                                    <span :class="invoiceStatusClass(invoice.status)">
                                        {{ invoiceStatusLabel(invoice.status) }}
                                    </span>
                                </TableCell>
                                <TableCell>{{ invoice.invoice_date }}</TableCell>
                                <TableCell class="text-right">
                                    <a
                                        :href="`/invoices/${invoice.id}`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        Anzeigen
                                    </a>
                                    <a
                                        v-if="invoice.pdf_path"
                                        :href="`/invoices/${invoice.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-muted-foreground hover:underline text-sm ml-2"
                                    >
                                        PDF
                                    </a>
                                    <a
                                        v-if="invoice.invoice_xml_path"
                                        :href="`/invoices/${invoice.id}/xml`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-muted-foreground hover:underline text-sm ml-1"
                                    >
                                        XML
                                    </a>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="invoices.links.length > 3"
                        :links="invoices.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
