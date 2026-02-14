<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import billing from '@/routes/billing';
import type { BreadcrumbItem } from '@/types';
import { ExternalLink, Sparkles } from 'lucide-vue-next';

type Invoice = {
    id: number;
    number: string;
    amount: string;
    status: string;
    invoice_date: string;
    pdf_path: string | null;
    invoice_xml_path: string | null;
};

type PaymentMethodSummary = {
    brand: string;
    last4: string;
};

type AiTokenPackage = {
    amount: number;
    label: string;
};

type Props = {
    invoices: Invoice[];
    billingPortalUrl: string;
    paymentMethodSummary: PaymentMethodSummary | null;
    aiTokenBalance: number;
    aiTokenPackages: AiTokenPackage[];
};

const props = defineProps<Props>();

function checkoutAiTokens(amount: number): void {
    router.post(billing.aiTokens.checkout.url(), { token_amount: amount }, {
        preserveScroll: true,
        preserveState: true,
    });
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Rechnungen', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Rechnungen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Meine Rechnungen</Heading>
                <Text class="mt-2" muted>
                    Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download sowie Ihre Zahlungsart
                </Text>
            </div>

            <!-- Meine Rechnungen -->
            <Card>
                <CardHeader>
                    <CardTitle>Meine Rechnungen</CardTitle>
                    <CardDescription>Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="invoices?.length">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nummer</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead class="text-right">Download</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="inv in invoices" :key="inv.id">
                                <TableCell>
                                    <code class="text-sm">{{ inv.number }}</code>
                                </TableCell>
                                <TableCell>{{ inv.amount }} €</TableCell>
                                <TableCell>{{ inv.invoice_date }}</TableCell>
                                <TableCell class="text-right">
                                    <a
                                        v-if="inv.pdf_path"
                                        :href="`/invoices/${inv.id}/pdf`"
                                        target="_blank"
                                        rel="noopener"
                                        class="mr-2 text-primary hover:underline"
                                    >
                                        PDF
                                    </a>
                                    <a
                                        v-if="inv.invoice_xml_path"
                                        :href="`/invoices/${inv.id}/xml`"
                                        target="_blank"
                                        rel="noopener"
                                        class="text-primary hover:underline"
                                    >
                                        XML
                                    </a>
                                    <span v-if="!inv.pdf_path && !inv.invoice_xml_path" class="text-muted">–</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="text-muted text-sm">Noch keine Rechnungen vorhanden.</p>
                </CardContent>
            </Card>

            <!-- AI Tokens -->
            <Card v-if="props.aiTokenPackages?.length">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Sparkles class="h-5 w-5" />
                        AI Tokens
                    </CardTitle>
                    <CardDescription>
                        Aktueller Stand: {{ props.aiTokenBalance }} Tokens. Für KI-SEO und KI-Author im Page Designer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            v-for="pkg in props.aiTokenPackages"
                            :key="pkg.amount"
                            variant="outline"
                            size="sm"
                            @click="checkoutAiTokens(pkg.amount)"
                        >
                            {{ pkg.label }}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Zahlungsart -->
            <Card>
                <CardHeader>
                    <CardTitle>Zahlungsart</CardTitle>
                    <CardDescription>
                        Verwalten Sie Ihre Zahlungsmethode und Abrechnungen bei Stripe
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p v-if="paymentMethodSummary" class="text-sm">
                        Aktuelle Zahlungsmethode:
                        <strong>{{ paymentMethodSummary.brand }} ****{{ paymentMethodSummary.last4 }}</strong>
                    </p>
                    <p v-else class="text-sm text-muted">
                        Noch keine Zahlungsmethode hinterlegt (wird beim ersten Abo-Abschluss angelegt).
                    </p>
                    <a
                        :href="billingPortalUrl"
                        class="mt-3 inline-block"
                        target="_self"
                        rel="noopener"
                    >
                        <Button variant="outline" size="sm">
                            Zahlungsart verwalten
                            <ExternalLink class="ml-2 h-3 w-3" />
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
