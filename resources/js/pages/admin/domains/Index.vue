<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { notify } from '@/composables/useNotify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Alert from '@/components/ui/alert/Alert.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Eye, Download, RefreshCw } from 'lucide-vue-next';

type User = {
    id: number;
    name: string;
    email: string;
} | null;

type ResellerDomain = {
    id: number;
    domain: string;
    user_id: number | null;
    status: string;
    expires_at: string | null;
    registered_at: string | null;
    auto_renew: boolean;
    purchase_price: string | null;
    sale_price: string | null;
    profit_margin: number;
    tld: string | null;
    user?: User;
};

type Customer = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    domains: {
        data: ResellerDomain[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    customers: Customer[];
    stats: {
        total: number;
        without_skrime: number;
    };
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
};

const props = withDefaults(defineProps<Props>(), {
    stats: () => ({ total: 0, without_skrime: 0 }),
    pagination: () => ({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    }),
});

const page = usePage();
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const importForm = useForm({
    domain: '',
    product_id: '',
    user_id: '',
});

const importDialogOpen = ref(false);

const submitImport = () => {
    importForm.post('/admin/domains/import', {
        preserveScroll: true,
        onSuccess: () => {
            importDialogOpen.value = false;
            importForm.reset();
        },
    });
};

const syncLoading = ref(false);
const syncFromSkrime = () => {
    syncLoading.value = true;
    router.post('/admin/domains/sync', {}, {
        preserveScroll: true,
        onFinish: () => {
            syncLoading.value = false;
        },
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '#' },
];

const domainUrl = (id: number) => `/admin/domains/${id}`;

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const HINT_STORAGE_KEY = 'admin-domains-hint-dismissed';
const hintDismissed = ref(typeof localStorage !== 'undefined' && localStorage.getItem(HINT_STORAGE_KEY) === '1');
function dismissHint() {
    hintDismissed.value = true;
    try {
        localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
        // ignore
    }
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Domains" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Domains</Heading>
                    <Text class="mt-2" muted>
                        Reseller-Domains (Skrime) – Übersicht, Kunde zuweisen, Verlängern
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        :disabled="syncLoading"
                        @click="syncFromSkrime"
                    >
                        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': syncLoading }" />
                        {{ syncLoading ? 'Synchronisiere…' : 'Alle Domains von Skrime' }}
                    </Button>
                    <Dialog v-model:open="importDialogOpen">
                        <DialogTrigger as-child>
                            <Button variant="outline">
                                <Download class="mr-2 h-4 w-4" />
                                Domain von Skrime importieren
                            </Button>
                        </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Skrime-Domain importieren</DialogTitle>
                            <DialogDescription>
                                Domainname oder Skrime-Produkt-ID angeben. Optional einen Kunden zuweisen.
                            </DialogDescription>
                        </DialogHeader>
                        <form @submit.prevent="submitImport" class="space-y-4 py-4">
                            <div class="space-y-2">
                                <Label for="import-domain">Domain (z. B. example.de)</Label>
                                <Input
                                    id="import-domain"
                                    v-model="importForm.domain"
                                    placeholder="example.de"
                                />
                            </div>
                            <div class="space-y-2">
                                <Label for="import-product-id">oder Skrime Produkt-ID (UUID)</Label>
                                <Input
                                    id="import-product_id"
                                    v-model="importForm.product_id"
                                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                                />
                            </div>
                            <div class="space-y-2">
                                <Label for="import-user">Kunde (optional)</Label>
                                <select
                                    id="import-user"
                                    v-model="importForm.user_id"
                                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                >
                                    <option value="">– Kein Kunde –</option>
                                    <option
                                        v-for="c in props.customers"
                                        :key="c.id"
                                        :value="c.id"
                                    >
                                        {{ c.name }} ({{ c.email }})
                                    </option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" @click="importDialogOpen = false">
                                    Abbrechen
                                </Button>
                                <Button type="submit" :disabled="importForm.processing">
                                    Importieren
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Alert
                v-if="!hintDismissed"
                variant="info"
                dismissible
                class="mb-4"
                @dismiss="dismissHint"
            >
                <p class="text-sm">
                    Domains, die bei Skrime existieren aber hier fehlen, können Sie mit
                    <strong>„Alle Domains von Skrime“</strong> nachladen.
                    Der Queue-Worker muss laufen: <code class="rounded bg-black/10 px-1">php artisan queue:work</code>
                </p>
            </Alert>

            <Card>
                <CardHeader>
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle>Alle Domains</CardTitle>
                            <CardDescription>Domain, Kunde, Status, Ablauf, Auto-Renew, Preise</CardDescription>
                        </div>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>
                                <strong class="text-foreground">{{ props.stats.total }}</strong> Domains in der Datenbank
                            </span>
                            <span v-if="props.stats.without_skrime > 0">
                                <strong class="text-foreground">{{ props.stats.without_skrime }}</strong> ohne Skrime-Zuordnung
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ablaufdatum</TableHead>
                                <TableHead>Auto-Renew</TableHead>
                                <TableHead>Einkauf</TableHead>
                                <TableHead>Verkauf</TableHead>
                                <TableHead>Gewinn</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="d in domains.data" :key="d.id">
                                <TableCell class="font-medium">{{ d.domain }}</TableCell>
                                <TableCell>
                                    <template v-if="d.user">
                                        <Link
                                            v-if="d.user"
                                            :href="`/admin/customers/${d.user.id}`"
                                            class="text-primary hover:underline"
                                        >
                                            {{ d.user.name }}
                                        </Link>
                                        <span class="text-muted text-sm"> ({{ d.user.email }})</span>
                                    </template>
                                    <span v-else class="text-muted">–</span>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="d.status === 'active' ? 'success' : 'secondary'">
                                        {{ d.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell>{{ d.expires_at ?? '–' }}</TableCell>
                                <TableCell>
                                    <Badge v-if="d.auto_renew" variant="info">Ja</Badge>
                                    <span v-else>Nein</span>
                                </TableCell>
                                <TableCell>{{ d.purchase_price != null ? `${d.purchase_price} €` : '–' }}</TableCell>
                                <TableCell>{{ d.sale_price != null ? `${d.sale_price} €` : '–' }}</TableCell>
                                <TableCell>{{ d.profit_margin != null ? `${d.profit_margin} €` : '–' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="domainUrl(d.id)">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="mr-2 h-4 w-4" />
                                            Details
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="domains.data.length === 0">
                                <TableCell colspan="9" class="text-center text-muted">
                                    Keine Domains vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div
                v-if="props.pagination.total > 0 || (domains.links && domains.links.length > 3)"
                class="flex flex-wrap items-center justify-center gap-4"
            >
                <span class="text-sm text-muted-foreground">
                    Seite {{ props.pagination.current_page }} von {{ props.pagination.last_page }}
                    ({{ props.pagination.total }} Einträge)
                </span>
                <Pagination
                    v-if="domains.links && domains.links.length > 3"
                    :links="domains.links"
                    @navigate="handlePagination"
                />
            </div>
        </div>
    </AppLayout>
</template>
