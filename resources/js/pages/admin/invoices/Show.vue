<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
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

function nextDunningLevel(dunningLetters: { level: number }[]): number {
    const existing = (dunningLetters ?? []).map((d) => d.level);
    for (const level of [1, 2, 3]) {
        if (!existing.includes(level)) {
            return level;
        }
    }
    return 0;
}

const dunningForm = useForm({});
const canCreateDunning = nextDunningLevel(props.invoice.dunning_letters ?? []);

const statusForm = useForm({ status: props.invoice.status });
const statusUpdateUrl = `/admin/invoices/${props.invoice.id}/status`;
function submitStatusChange(): void {
    statusForm.patch(statusUpdateUrl, { preserveScroll: true });
}

const INVOICE_STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'draft', label: 'Entwurf' },
    { value: 'sent', label: 'Gesendet' },
    { value: 'pending', label: 'Ausstehend' },
    { value: 'paid', label: 'Bezahlt' },
    { value: 'cancelled', label: 'Storniert' },
];

const INVOICE_STATUS_LABELS: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
    cancelled: 'Storniert',
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
        case 'cancelled':
            return `${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`;
        default:
            return `${base} bg-muted text-muted-foreground`;
    }
};

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
                    <a :href="`/invoices/${invoice.id}`" target="_blank" rel="noopener">
                        <Button>Rechnung anzeigen</Button>
                    </a>
                    <Link v-if="invoice.type === 'manual'" :href="invoicesEdit({ invoice: invoice.id }).url">
                        <Button variant="outline">Bearbeiten</Button>
                    </Link>
                    <a
                        v-if="invoice.pdf_path"
                        :href="`/invoices/${invoice.id}/pdf`"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline">PDF herunterladen</Button>
                    </a>
                    <a
                        v-if="invoice.invoice_xml_path"
                        :href="`/invoices/${invoice.id}/xml`"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline">XML herunterladen</Button>
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
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <Text muted>Status</Text>
                        <div class="flex items-center gap-2">
                            <Select
                                v-model="statusForm.status"
                                class="min-w-[140px]"
                                @update:model-value="submitStatusChange"
                            >
                                <option
                                    v-for="opt in INVOICE_STATUS_OPTIONS"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </Select>
                            <span
                                v-if="statusForm.processing"
                                class="text-xs text-muted-foreground"
                            >
                                Wird gespeichert…
                            </span>
                            <span
                                v-else
                                :class="invoiceStatusClass(statusForm.status)"
                                class="shrink-0"
                            >
                                {{ invoiceStatusLabel(statusForm.status) }}
                            </span>
                        </div>
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
