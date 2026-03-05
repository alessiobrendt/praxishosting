<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
    ExternalLink,
    Pencil,
    Sparkles,
    LogIn,
    Globe,
    FileText,
    MessageCircle,
    HardDrive,
    Server,
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Heading, Text } from '@/components/ui/typography';
import { pushAdminRecent } from '@/composables/useAdminRecent';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import { impersonate } from '@/routes/admin';
import { index as customersIndex } from '@/routes/admin/customers/index';
import { show as sitesShow } from '@/routes/sites';
import type { BreadcrumbItem } from '@/types';

type Site = {
    uuid: string;
    name: string;
    slug: string;
    template?: { name: string };
    site_subscription?: { current_period_ends_at?: string } | null;
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

type Invoice = {
    id: number;
    number: string;
    invoice_date: string | null;
    due_date: string | null;
    amount: string;
    status: string;
};

type Ticket = {
    id: number;
    subject: string;
    status: string;
    ticket_category?: { name: string };
    ticket_priority?: { name: string; color?: string };
    assigned_to?: { name: string } | null;
};

type ResellerDomain = {
    id: number;
    domain: string;
    status: string;
    expires_at?: string | null;
};

type WebspaceAccount = {
    id: number;
    hosting_plan?: { name: string };
    hosting_server?: { hostname: string };
};

type GameServerAccount = {
    id: number;
    name: string;
    hosting_plan?: { name: string };
    hosting_server?: { hostname: string };
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
    phone?: string | null;
    brand?: { id: number; key: string; name: string } | null;
    is_admin?: boolean;
    rank?: string | null;
    sites: Site[];
    customerBalance: CustomerBalance;
    balanceTransactions: BalanceTransaction[];
    customer_notes?: CustomerNote[];
    invoices?: Invoice[];
    invoices_count?: number;
    tickets?: Ticket[];
    tickets_count?: number;
    reseller_domains?: ResellerDomain[];
    reseller_domains_count?: number;
    webspace_accounts?: WebspaceAccount[];
    game_server_accounts?: GameServerAccount[];
};

type ActivityLogEntry = {
    id: number;
    action: string;
    created_at: string;
    user?: { id: number; name: string };
};

type AiTokenTransaction = {
    id: number;
    amount: number;
    type: string;
    description: string | null;
    created_at: string;
};

const RANK_LABELS: Record<string, string> = {
    customer: 'Kunde',
    reseller: 'Reseller',
    partner: 'Partner',
};

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

type Props = {
    customer: Customer;
    activityLog?: ActivityLogEntry[];
    aiTokenBalance: number;
    aiTokenTransactions: AiTokenTransaction[];
    can_impersonate?: boolean;
    can_be_impersonated?: boolean;
};

const props = defineProps<Props>();

const actionLabels: Record<string, string> = {
    customer_updated: 'Stammdaten geändert',
};

const balanceAmount = computed(() => {
    const b = props.customer.customerBalance;
    return b ? `${Number(b.balance).toFixed(2)} €` : '0,00 €';
});

const invoicesCount = computed(() => props.customer.invoices_count ?? props.customer.invoices?.length ?? 0);
const ticketsCount = computed(() => props.customer.tickets_count ?? props.customer.tickets?.length ?? 0);
const domainsCount = computed(() => props.customer.reseller_domains_count ?? props.customer.reseller_domains?.length ?? 0);

const rankLabel = computed(() => {
    const r = props.customer.rank;
    return r ? (RANK_LABELS[r] ?? r) : null;
});

const impersonateUrl = computed(() => impersonate.url({ id: props.customer.id }));
const showImpersonateButton = computed(
    () => props.can_impersonate && props.can_be_impersonated,
);

const balanceModalOpen = ref(false);
const aiTokensModalOpen = ref(false);

const balanceForm = useForm({
    amount: '',
    description: 'Guthaben aufladen (Admin)',
});

const noteForm = useForm({
    body: '',
});

const aiTokensForm = useForm({
    amount: '',
    description: 'Admin-Anpassung',
});

const submitBalance = () => {
    balanceForm.post(`/admin/customers/${props.customer.id}/balance`, {
        preserveScroll: true,
        onSuccess: () => {
            balanceForm.reset('amount', 'description');
            balanceModalOpen.value = false;
        },
    });
};

const submitNote = () => {
    noteForm.post(`/admin/customers/${props.customer.id}/notes`, {
        preserveScroll: true,
        onSuccess: () => noteForm.reset('body'),
    });
};

const submitAiTokens = () => {
    aiTokensForm.post(`/admin/customers/${props.customer.id}/ai-tokens`, {
        preserveScroll: true,
        onSuccess: () => {
            aiTokensForm.reset('amount', 'description');
            aiTokensModalOpen.value = false;
        },
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
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde: ${customer.name}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">{{ customer.name }}</Heading>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                        <Text muted>{{ customer.email }}</Text>
                        <Badge v-if="customer.brand" variant="secondary">{{ customer.brand.name }}</Badge>
                        <Badge v-if="rankLabel" variant="outline">{{ rankLabel }}</Badge>
                        <Badge v-if="customer.is_admin" variant="default">Administrator</Badge>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <Link v-if="showImpersonateButton" :href="impersonateUrl">
                        <Button variant="outline" size="sm">
                            <LogIn class="mr-2 h-4 w-4" />
                            Als Kunde anmelden
                        </Button>
                    </Link>
                    <Link :href="`/admin/customers/${customer.id}/edit`">
                        <Button variant="outline" size="sm">
                            <Pencil class="mr-2 h-4 w-4" />
                            Bearbeiten
                        </Button>
                    </Link>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Link
                    :href="`#sites`"
                    class="rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                >
                    <div class="flex items-center gap-2">
                        <Globe class="h-4 w-4 text-muted-foreground" />
                        <span class="text-2xl font-semibold">{{ customer.sites?.length ?? 0 }}</span>
                    </div>
                    <Text variant="small" muted>Sites</Text>
                </Link>
                <Link
                    :href="`/admin/invoices?user_id=${customer.id}`"
                    class="rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                >
                    <div class="flex items-center gap-2">
                        <FileText class="h-4 w-4 text-muted-foreground" />
                        <span class="text-2xl font-semibold">{{ invoicesCount }}</span>
                    </div>
                    <Text variant="small" muted>Rechnungen</Text>
                </Link>
                <Link
                    :href="`/admin/tickets?user_id=${customer.id}`"
                    class="rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                >
                    <div class="flex items-center gap-2">
                        <MessageCircle class="h-4 w-4 text-muted-foreground" />
                        <span class="text-2xl font-semibold">{{ ticketsCount }}</span>
                    </div>
                    <Text variant="small" muted>Tickets</Text>
                </Link>
                <Link
                    :href="`/admin/domains?customer_id=${customer.id}`"
                    class="rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                >
                    <div class="flex items-center gap-2">
                        <Globe class="h-4 w-4 text-muted-foreground" />
                        <span class="text-2xl font-semibold">{{ domainsCount }}</span>
                    </div>
                    <Text variant="small" muted>Domains</Text>
                </Link>
                <button
                    type="button"
                    class="rounded-lg border bg-card p-3 text-left text-card-foreground shadow-sm transition-colors hover:bg-muted/50 cursor-pointer w-full"
                    @click="balanceModalOpen = true"
                >
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-semibold">{{ balanceAmount }}</span>
                    </div>
                    <Text variant="small" muted>Guthaben</Text>
                </button>
                <button
                    type="button"
                    class="rounded-lg border bg-card p-3 text-left text-card-foreground shadow-sm transition-colors hover:bg-muted/50 cursor-pointer w-full"
                    @click="aiTokensModalOpen = true"
                >
                    <div class="flex items-center gap-2">
                        <Sparkles class="h-4 w-4 text-muted-foreground" />
                        <span class="text-2xl font-semibold">{{ aiTokenBalance }}</span>
                    </div>
                    <Text variant="small" muted>AI-Tokens</Text>
                </button>
            </div>

            <Dialog v-model:open="balanceModalOpen">
                <DialogContent class="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Guthaben</DialogTitle>
                        <DialogDescription>Aktuelles Guthaben und Transaktionen; Guthaben aufladen</DialogDescription>
                    </DialogHeader>
                    <div class="space-y-4">
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
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="aiTokensModalOpen">
                <DialogContent class="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle class="flex items-center gap-2">
                            <Sparkles class="h-5 w-5" />
                            AI Tokens
                        </DialogTitle>
                        <DialogDescription>
                            Aktueller Token-Stand und manuelle Anpassung (hinzufügen oder abziehen)
                        </DialogDescription>
                    </DialogHeader>
                    <div class="space-y-4">
                        <div>
                            <Text variant="small" muted>Aktueller Token-Stand:</Text>
                            <Text class="ml-2 font-medium">{{ aiTokenBalance }}</Text>
                        </div>
                        <form @submit.prevent="submitAiTokens" class="space-y-3">
                            <div class="space-y-2">
                                <Label for="ai_tokens_amount">Anzahl (+ hinzufügen, − abziehen)</Label>
                                <Input
                                    id="ai_tokens_amount"
                                    v-model="aiTokensForm.amount"
                                    type="number"
                                    step="1"
                                    placeholder="z.B. 500 oder -100"
                                    :aria-invalid="!!aiTokensForm.errors.amount"
                                />
                                <InputError :message="aiTokensForm.errors.amount" />
                            </div>
                            <div class="space-y-2">
                                <Label for="ai_tokens_description">Beschreibung</Label>
                                <Input
                                    id="ai_tokens_description"
                                    v-model="aiTokensForm.description"
                                    placeholder="Admin-Anpassung"
                                    :aria-invalid="!!aiTokensForm.errors.description"
                                />
                                <InputError :message="aiTokensForm.errors.description" />
                            </div>
                            <Button type="submit" :disabled="aiTokensForm.processing">Tokens anpassen</Button>
                        </form>
                        <div v-if="aiTokenTransactions?.length">
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
                                    <TableRow v-for="tx in aiTokenTransactions" :key="tx.id">
                                        <TableCell>{{ tx.created_at }}</TableCell>
                                        <TableCell>{{ tx.type }}</TableCell>
                                        <TableCell :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                                            {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount }}
                                        </TableCell>
                                        <TableCell>{{ tx.description ?? '–' }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div class="grid gap-6 lg:grid-cols-2">
                <div class="space-y-6">
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
                                    <Text variant="small" muted>Telefon</Text>
                                    <Text class="block">{{ customer.phone ?? '–' }}</Text>
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
                </div>

                <div class="space-y-6">
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Rechnungen</CardTitle>
                                <CardDescription>Letzte Rechnungen</CardDescription>
                            </div>
                            <Link :href="`/admin/invoices?user_id=${customer.id}`">
                                <Button variant="ghost" size="sm">Alle anzeigen</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table v-if="customer.invoices?.length" class="text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nr.</TableHead>
                                        <TableHead>Datum</TableHead>
                                        <TableHead>Betrag</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="inv in customer.invoices.slice(0, 5)" :key="inv.id">
                                        <TableCell class="font-medium">{{ inv.number }}</TableCell>
                                        <TableCell>{{ inv.invoice_date ?? '–' }}</TableCell>
                                        <TableCell>{{ inv.amount }} €</TableCell>
                                        <TableCell>
                                            <span :class="invoiceStatusClass(inv.status)">
                                                {{ invoiceStatusLabel(inv.status) }}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Link :href="`/admin/invoices/${inv.id}`">
                                                <Button variant="ghost" size="sm" aria-label="Anzeigen"><ExternalLink class="h-3 w-3" /></Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Text v-else variant="small" muted>Keine Rechnungen</Text>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Tickets</CardTitle>
                                <CardDescription>Support-Tickets</CardDescription>
                            </div>
                            <Link :href="`/admin/tickets?user_id=${customer.id}`">
                                <Button variant="ghost" size="sm">Alle anzeigen</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table v-if="customer.tickets?.length" class="text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Betreff</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="t in customer.tickets.slice(0, 5)" :key="t.id">
                                        <TableCell class="font-medium">{{ t.subject }}</TableCell>
                                        <TableCell>{{ t.status }}</TableCell>
                                        <TableCell>
                                            <Link :href="`/admin/tickets/${t.id}`">
                                                <Button variant="ghost" size="sm" aria-label="Anzeigen"><ExternalLink class="h-3 w-3" /></Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Text v-else variant="small" muted>Keine Tickets</Text>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card id="sites">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>Produkte &amp; Domains</CardTitle>
                        <CardDescription>Webseiten, Webspace, Game-Server und Reseller-Domains dieses Kunden</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs default-tab="sites" class="w-full">
                        <TabsList class="mb-4 flex flex-wrap gap-1">
                            <TabsTrigger value="sites">
                                <Globe class="mr-1.5 h-4 w-4" />
                                Webseiten ({{ customer.sites?.length ?? 0 }})
                            </TabsTrigger>
                            <TabsTrigger value="webspace">
                                <HardDrive class="mr-1.5 h-4 w-4" />
                                Webspace ({{ customer.webspace_accounts?.length ?? 0 }})
                            </TabsTrigger>
                            <TabsTrigger value="gaming">
                                <Server class="mr-1.5 h-4 w-4" />
                                Game-Server ({{ customer.game_server_accounts?.length ?? 0 }})
                            </TabsTrigger>
                            <TabsTrigger value="domains">
                                <Globe class="mr-1.5 h-4 w-4" />
                                Reseller-Domains ({{ customer.reseller_domains?.length ?? 0 }})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="sites" class="mt-0">
                            <div class="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Laufzeit Ende</TableHead>
                                            <TableHead class="text-right w-20">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="site in customer.sites" :key="site.uuid">
                                            <TableCell class="font-medium">{{ site.name }}</TableCell>
                                            <TableCell>
                                                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ site.slug }}</code>
                                            </TableCell>
                                            <TableCell class="text-muted-foreground">{{ site.template?.name ?? '–' }}</TableCell>
                                            <TableCell class="text-muted-foreground text-sm">
                                                {{ site.site_subscription?.current_period_ends_at ?? '–' }}
                                            </TableCell>
                                            <TableCell class="text-right">
                                                <Link :href="sitesShow({ site: site.uuid }).url">
                                                    <Button variant="ghost" size="sm" aria-label="Bearbeiten">
                                                        <ExternalLink class="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="!customer.sites?.length">
                                            <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                                                Keine Webseiten
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="webspace" class="mt-0">
                            <div class="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Paket / Plan</TableHead>
                                            <TableHead>Server / Node</TableHead>
                                            <TableHead class="text-right w-20">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="wa in customer.webspace_accounts" :key="wa.id">
                                            <TableCell class="font-mono text-sm text-muted-foreground">{{ wa.id }}</TableCell>
                                            <TableCell class="font-medium">{{ wa.hosting_plan?.name ?? '–' }}</TableCell>
                                            <TableCell>
                                                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ wa.hosting_server?.hostname ?? '–' }}</code>
                                            </TableCell>
                                            <TableCell class="text-right">
                                                <Link :href="`/admin/webspace-accounts/${wa.id}`">
                                                    <Button variant="ghost" size="sm" aria-label="Anzeigen">
                                                        <ExternalLink class="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="!customer.webspace_accounts?.length">
                                            <TableCell colspan="4" class="text-center text-muted-foreground py-8">
                                                Keine Webspace-Accounts
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <Link
                                v-if="customer.webspace_accounts?.length"
                                :href="`/admin/webspace-accounts?user_id=${customer.id}`"
                                class="mt-3 inline-block text-sm text-primary hover:underline"
                            >
                                Alle Webspace-Accounts anzeigen →
                            </Link>
                        </TabsContent>

                        <TabsContent value="gaming" class="mt-0">
                            <div class="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Paket / Plan</TableHead>
                                            <TableHead>Server / Node</TableHead>
                                            <TableHead class="text-right w-20">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="ga in customer.game_server_accounts" :key="ga.id">
                                            <TableCell class="font-mono text-sm text-muted-foreground">{{ ga.id }}</TableCell>
                                            <TableCell class="font-medium">{{ ga.name ?? '–' }}</TableCell>
                                            <TableCell>{{ ga.hosting_plan?.name ?? '–' }}</TableCell>
                                            <TableCell>
                                                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ ga.hosting_server?.hostname ?? '–' }}</code>
                                            </TableCell>
                                            <TableCell class="text-right">
                                                <Link :href="`/admin/gaming-accounts/${ga.id}`">
                                                    <Button variant="ghost" size="sm" aria-label="Anzeigen">
                                                        <ExternalLink class="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="!customer.game_server_accounts?.length">
                                            <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                                                Keine Game-Server-Accounts
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <Link
                                v-if="customer.game_server_accounts?.length"
                                :href="`/admin/gaming-accounts?user_id=${customer.id}`"
                                class="mt-3 inline-block text-sm text-primary hover:underline"
                            >
                                Alle Game-Server anzeigen →
                            </Link>
                        </TabsContent>

                        <TabsContent value="domains" class="mt-0">
                            <div class="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Domain</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ablauf</TableHead>
                                            <TableHead class="text-right w-20">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="d in customer.reseller_domains" :key="d.id">
                                            <TableCell class="font-medium">{{ d.domain }}</TableCell>
                                            <TableCell>
                                                <span class="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                {{ d.status }}
                                            </span>
                                            </TableCell>
                                            <TableCell class="text-muted-foreground text-sm">{{ d.expires_at ?? '–' }}</TableCell>
                                            <TableCell class="text-right">
                                                <Link :href="`/admin/domains/${d.id}`">
                                                    <Button variant="ghost" size="sm" aria-label="Anzeigen">
                                                        <ExternalLink class="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="!customer.reseller_domains?.length">
                                            <TableCell colspan="4" class="text-center text-muted-foreground py-8">
                                                Keine Reseller-Domains
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <Link
                                v-if="customer.reseller_domains?.length"
                                :href="`/admin/domains?customer_id=${customer.id}`"
                                class="mt-3 inline-block text-sm text-primary hover:underline"
                            >
                                Alle Domains anzeigen →
                            </Link>
                        </TabsContent>
                    </Tabs>
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
    </AdminLayout>
</template>
