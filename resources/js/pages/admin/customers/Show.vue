<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { pushAdminRecent } from '@/composables/useAdminRecent';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/InputError.vue';
import { index as customersIndex } from '@/routes/admin/customers';
import { show as sitesShow } from '@/routes/sites';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ExternalLink, Pencil } from 'lucide-vue-next';

type Site = {
    id: number;
    name: string;
    slug: string;
    template?: { name: string };
};

type BalanceTransaction = {
    id: number;
    amount: string;
    type: string;
    description: string | null;
    created_at: string;
};

type CustomerBalance = {
    id: number;
    balance: string;
} | null;

type CustomerNote = {
    id: number;
    body: string;
    created_at: string;
    admin?: { id: number; name: string };
};

type Customer = {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
    sites: Site[];
    customerBalance: CustomerBalance;
    balanceTransactions: BalanceTransaction[];
    customer_notes?: CustomerNote[];
};

type ActivityLogEntry = {
    id: number;
    action: string;
    created_at: string;
    user?: { id: number; name: string };
};

type Props = {
    customer: Customer;
    activityLog?: ActivityLogEntry[];
};

const props = defineProps<Props>();

const actionLabels: Record<string, string> = {
    customer_updated: 'Stammdaten geändert',
};

const balanceForm = useForm({
    amount: '',
    description: 'Guthaben aufladen (Admin)',
});

const noteForm = useForm({
    body: '',
});

const submitBalance = () => {
    balanceForm.post(`/admin/customers/${props.customer.id}/balance`, {
        preserveScroll: true,
        onSuccess: () => balanceForm.reset('amount', 'description'),
    });
};

const submitNote = () => {
    noteForm.post(`/admin/customers/${props.customer.id}/notes`, {
        preserveScroll: true,
        onSuccess: () => noteForm.reset('body'),
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
    { title: props.customer.name, href: '#' },
];

onMounted(() => {
    pushAdminRecent({
        type: 'customer',
        id: props.customer.id,
        label: props.customer.name,
        url: `/admin/customers/${props.customer.id}`,
    });
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde: ${customer.name}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">{{ customer.name }}</Heading>
                    <Text class="mt-2" muted>
                        {{ customer.email }}
                    </Text>
                </div>
                <Link :href="`/admin/customers/${customer.id}/edit`">
                    <Button variant="outline" size="sm">
                        <Pencil class="mr-2 h-4 w-4" />
                        Bearbeiten
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Stammdaten</CardTitle>
                    <CardDescription>Name, E-Mail, Firma, Adresse</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div class="grid gap-2 sm:grid-cols-2">
                        <div>
                            <Text variant="small" muted>Name</Text>
                            <Text class="block">{{ customer.name }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>E-Mail</Text>
                            <Text class="block">{{ customer.email }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Firma</Text>
                            <Text class="block">{{ customer.company ?? '–' }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Straße</Text>
                            <Text class="block">{{ customer.street ?? '–' }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>PLZ</Text>
                            <Text class="block">{{ customer.postal_code ?? '–' }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Ort</Text>
                            <Text class="block">{{ customer.city ?? '–' }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Land</Text>
                            <Text class="block">{{ customer.country ?? '–' }}</Text>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="customer.customer_notes !== undefined">
                <CardHeader>
                    <CardTitle>Notizen</CardTitle>
                    <CardDescription>Kundennotizen; neue Notiz anlegen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <form @submit.prevent="submitNote" class="space-y-3">
                        <div class="space-y-2">
                            <Label for="note_body">Neue Notiz</Label>
                            <Textarea
                                id="note_body"
                                v-model="noteForm.body"
                                rows="3"
                                placeholder="Notiz eingeben…"
                                :aria-invalid="!!noteForm.errors.body"
                            />
                            <InputError :message="noteForm.errors.body" />
                        </div>
                        <Button type="submit" size="sm" :disabled="noteForm.processing">Notiz speichern</Button>
                    </form>
                    <div v-if="customer.customer_notes?.length" class="space-y-2 border-t pt-4">
                        <Text variant="small" muted class="block">Letzte Notizen</Text>
                        <ul class="space-y-2">
                            <li
                                v-for="note in customer.customer_notes"
                                :key="note.id"
                                class="rounded-md border bg-muted/30 p-3 text-sm"
                            >
                                <Text class="whitespace-pre-wrap">{{ note.body }}</Text>
                                <Text variant="small" muted class="mt-1 block">
                                    {{ note.created_at }}
                                    <span v-if="note.admin"> · {{ note.admin.name }}</span>
                                </Text>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Guthaben</CardTitle>
                    <CardDescription>Aktuelles Guthaben und Transaktionen; Guthaben aufladen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <Text variant="small" muted>Aktuelles Guthaben:</Text>
                        <Text class="ml-2 font-medium">{{ customer.customerBalance ? `${customer.customerBalance.balance} €` : '0,00 €' }}</Text>
                    </div>
                    <form @submit.prevent="submitBalance" class="space-y-3">
                        <div class="space-y-2">
                            <Label for="balance_amount">Betrag (€)</Label>
                            <Input
                                id="balance_amount"
                                v-model="balanceForm.amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0,00"
                                :aria-invalid="!!balanceForm.errors.amount"
                            />
                            <InputError :message="balanceForm.errors.amount" />
                        </div>
                        <div class="space-y-2">
                            <Label for="balance_description">Beschreibung (optional)</Label>
                            <Input
                                id="balance_description"
                                v-model="balanceForm.description"
                                placeholder="Guthaben aufladen (Admin)"
                                :aria-invalid="!!balanceForm.errors.description"
                            />
                            <InputError :message="balanceForm.errors.description" />
                        </div>
                        <Button type="submit" :disabled="balanceForm.processing">Guthaben aufladen</Button>
                    </form>
                    <div v-if="customer.balanceTransactions?.length">
                        <Text variant="small" muted class="block mt-4">Letzte Transaktionen</Text>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Datum</TableHead>
                                    <TableHead>Typ</TableHead>
                                    <TableHead>Betrag</TableHead>
                                    <TableHead>Beschreibung</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="tx in customer.balanceTransactions" :key="tx.id">
                                    <TableCell>{{ tx.created_at }}</TableCell>
                                    <TableCell>{{ tx.type }}</TableCell>
                                    <TableCell :class="parseFloat(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'">{{ tx.amount }} €</TableCell>
                                    <TableCell>{{ tx.description ?? '–' }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Webseiten</CardTitle>
                    <CardDescription>Alle Sites dieses Kunden</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in customer.sites" :key="site.id">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ site.slug }}
                                    </code>
                                </TableCell>
                                <TableCell>{{ site.template?.name ?? '-' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="sitesShow({ site: site.id }).url">
                                        <Button variant="ghost" size="sm">
                                            Bearbeiten
                                            <ExternalLink class="ml-2 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="customer.sites.length === 0">
                                <TableCell colspan="4" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Sites vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card v-if="activityLog?.length">
                <CardHeader>
                    <CardTitle>Letzte Änderungen</CardTitle>
                    <CardDescription>Aktivitätslog für diesen Kunden</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-2">
                        <li
                            v-for="entry in activityLog"
                            :key="entry.id"
                            class="flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                        >
                            <span class="font-medium">{{ actionLabels[entry.action] ?? entry.action }}</span>
                            <span class="text-muted-foreground">{{ entry.created_at }}</span>
                            <span v-if="entry.user" class="text-muted-foreground">· {{ entry.user.name }}</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
