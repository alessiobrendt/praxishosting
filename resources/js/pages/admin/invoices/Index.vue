<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
                                    <Badge :variant="invoice.status === 'paid' ? 'success' : 'secondary'">
                                        {{ invoice.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell>{{ invoice.invoice_date }}</TableCell>
                                <TableCell class="text-right">
                                    <a
                                        v-if="invoice.pdf_path"
                                        :href="`/invoices/${invoice.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline mr-2"
                                    >
                                        PDF
                                    </a>
                                    <a
                                        v-if="invoice.invoice_xml_path"
                                        :href="`/invoices/${invoice.id}/xml`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline"
                                    >
                                        XML
                                    </a>
                                    <span v-if="!invoice.pdf_path && !invoice.invoice_xml_path" class="text-muted">–</span>
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
