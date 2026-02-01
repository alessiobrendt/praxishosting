<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { index as invoicesIndex, edit as invoicesEdit } from '@/routes/admin/invoices';
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
    unit_price: string;
    amount: string;
};

type DunningLetter = {
    id: number;
    level: number;
    sent_at: string | null;
    fee_amount: string;
    pdf_path: string | null;
};

type Invoice = {
    id: number;
    number: string;
    type: string;
    amount: string;
    status: string;
    invoice_date: string;
    due_date: string | null;
    user: User | null;
    line_items: LineItem[];
    dunning_letters: DunningLetter[];
    pdf_path: string | null;
    invoice_xml_path: string | null;
};

type Props = {
    invoice: Invoice;
};

const props = defineProps<Props>();

const dunningForm = useForm({});
const canCreateDunning = nextDunningLevel(props.invoice.dunning_letters ?? []);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: invoicesIndex().url },
    { title: props.invoice.number, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Rechnung ${invoice.number}`" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Rechnung {{ invoice.number }}</Heading>
                    <Text class="mt-2" muted>
                        {{ invoice.user?.name }} · {{ invoice.user?.email }}
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Link v-if="invoice.type === 'manual'" :href="invoicesEdit({ invoice: invoice.id }).url">
                        <Button variant="outline">Bearbeiten</Button>
                    </Link>
                    <a
                        v-if="invoice.pdf_path"
                        :href="`/invoices/${invoice.id}/pdf`"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline">PDF</Button>
                    </a>
                    <a
                        v-if="invoice.invoice_xml_path"
                        :href="`/invoices/${invoice.id}/xml`"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline">E-Rechnung (XML)</Button>
                    </a>
                </div>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Betrag, Status, Datum</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between">
                        <Text muted>Betrag</Text>
                        <Text class="font-semibold">{{ invoice.amount }} €</Text>
                    </div>
                    <div class="flex justify-between">
                        <Text muted>Status</Text>
                        <Badge :variant="invoice.status === 'paid' ? 'success' : 'secondary'">
                            {{ invoice.status }}
                        </Badge>
                    </div>
                    <div class="flex justify-between">
                        <Text muted>Rechnungsdatum</Text>
                        <Text>{{ invoice.invoice_date }}</Text>
                    </div>
                    <div v-if="invoice.due_date" class="flex justify-between">
                        <Text muted>Zahlbar bis</Text>
                        <Text>{{ invoice.due_date }}</Text>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="invoice.line_items?.length" class="max-w-2xl">
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
                            <TableRow v-for="item in invoice.line_items" :key="item.position">
                                <TableCell>{{ item.position }}</TableCell>
                                <TableCell>{{ item.description }}</TableCell>
                                <TableCell class="text-right">{{ item.quantity }} {{ item.unit }}</TableCell>
                                <TableCell class="text-right">{{ item.amount }} €</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Mahnungen</CardTitle>
                    <CardDescription>
                        {{ invoice.dunning_letters?.length ? 'Versendete Mahnungen zu dieser Rechnung' : 'Noch keine Mahnung erstellt' }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <form
                        v-if="canCreateDunning"
                        :action="`/admin/invoices/${invoice.id}/dunning-letters`"
                        method="post"
                        class="inline"
                        @submit="(e) => { e.preventDefault(); dunningForm.post(`/admin/invoices/${invoice.id}/dunning-letters`); }"
                    >
                        <Button type="submit" variant="outline" :disabled="dunningForm.processing">
                            {{ canCreateDunning }}. Mahnung erstellen
                        </Button>
                    </form>
                    <ul v-if="invoice.dunning_letters?.length" class="space-y-2">
                        <li
                            v-for="d in invoice.dunning_letters"
                            :key="d.id"
                            class="flex items-center justify-between"
                        >
                            <Text>{{ d.level }}. Mahnung · Gebühr {{ d.fee_amount }} €</Text>
                            <a
                                v-if="d.pdf_path"
                                :href="`/admin/invoices/${invoice.id}/dunning/${d.id}/pdf`"
                                target="_blank"
                                rel="noopener"
                                class="text-primary hover:underline text-sm"
                            >
                                PDF
                            </a>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
