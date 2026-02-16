<script setup lang="ts">
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { notify } from '@/composables/useNotify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Download, Percent, Search } from 'lucide-vue-next';

type TldItem = {
    id: number;
    tld: string;
    create_price: number;
    renew_price: number;
    margin_type: string;
    margin_value: number;
    sale_price: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    items: TldItem[];
    links: PaginationLink[];
    filters: {
        search: string;
    };
};

const props = withDefaults(defineProps<Props>(), {
    links: () => [],
    filters: () => ({ search: '' }),
});

const searchInput = ref(props.filters.search);

function applySearch() {
    router.get('/admin/domains/tld-pricelist', {
        search: searchInput.value || undefined,
        page: undefined,
    }, { preserveState: true });
}

function handlePagination(url: string) {
    if (url) window.location.href = url;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: 'TLD-Preise', href: '#' },
];

const selectedTlds = ref<Set<string>>(new Set());

const applyMarginToAll = ref(false);

const bulkForm = useForm({
    margin_type: 'percent',
    margin_value: '10',
    tlds: [] as string[],
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

const syncLoading = ref(false);
const syncPricelist = () => {
    syncLoading.value = true;
    router.post('/admin/domains/tld-pricelist/sync', {}, {
        preserveScroll: true,
        onFinish: () => {
            syncLoading.value = false;
        },
    });
};

const toggleAll = (checked: boolean) => {
    if (checked) {
        selectedTlds.value = new Set(props.items.map((i) => i.tld));
    } else {
        selectedTlds.value = new Set();
    }
};

watch(
    () => props.filters.search,
    (v) => {
        searchInput.value = v;
    },
);

const toggleOne = (tld: string, checked: boolean) => {
    const next = new Set(selectedTlds.value);
    if (checked) next.add(tld);
    else next.delete(tld);
    selectedTlds.value = next;
};

const allSelected = () => props.items.length > 0 && selectedTlds.value.size === props.items.length;

const submitBulk = () => {
    bulkForm.tlds = applyMarginToAll.value ? [] : Array.from(selectedTlds.value);
    if (!applyMarginToAll.value && bulkForm.tlds.length === 0) {
        bulkForm.errors.tlds = 'Bitte mindestens eine TLD auswählen oder „Für alle TLDs“ aktivieren.';
        return;
    }
    bulkForm.put('/admin/domains/tld-pricelist/bulk', {
        preserveScroll: true,
        onSuccess: () => {
            selectedTlds.value = new Set();
            applyMarginToAll.value = false;
            bulkForm.reset();
        },
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="TLD-Preise" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">TLD-Preise</Heading>
                    <Text class="mt-2" muted>
                        Einkaufspreise und Marge pro Domain-Endung. Bulk-Import aus Skrime, Massen-Edit der Gewinn-Marge.
                    </Text>
                </div>
                <Button
                    variant="outline"
                    :disabled="syncLoading"
                    @click="syncPricelist"
                >
                    <Download class="mr-2 h-4 w-4" />
                    {{ syncLoading ? 'Importiere…' : 'Pricelist von Skrime importieren' }}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Marge setzen</CardTitle>
                    <CardDescription>
                        Margin-Typ und Wert wählen. Entweder TLDs in der Tabelle auswählen oder „Für alle TLDs“ aktivieren.
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <form @submit.prevent="submitBulk" class="flex flex-wrap items-end gap-4">
                        <div class="space-y-2 min-w-[140px]">
                            <Label for="bulk-margin-type">Typ</Label>
                            <select
                                id="bulk-margin-type"
                                v-model="bulkForm.margin_type"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            >
                                <option value="percent">Prozent (%)</option>
                                <option value="fixed">Festbetrag (€)</option>
                            </select>
                        </div>
                        <div class="space-y-2 min-w-[120px]">
                            <Label for="bulk-margin-value">Wert</Label>
                            <Input
                                id="bulk-margin-value"
                                v-model="bulkForm.margin_value"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="z. B. 10"
                            />
                            <p v-if="bulkForm.errors.margin_value" class="text-sm text-destructive">
                                {{ bulkForm.errors.margin_value }}
                            </p>
                        </div>
                        <div class="flex items-end gap-2">
                            <label class="flex items-center gap-2 text-sm">
                                <input
                                    v-model="applyMarginToAll"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-input"
                                />
                                Für alle TLDs
                            </label>
                        </div>
                        <Button
                            type="submit"
                            :disabled="bulkForm.processing || (!applyMarginToAll && selectedTlds.size === 0)"
                        >
                            <Percent class="mr-2 h-4 w-4" />
                            {{ applyMarginToAll ? 'Marge für alle TLDs übernehmen' : `Marge für ${selectedTlds.size} TLD(s) übernehmen` }}
                        </Button>
                    </form>
                    <p v-if="bulkForm.errors.tlds" class="text-sm text-destructive">
                        {{ bulkForm.errors.tlds }}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Alle TLDs</CardTitle>
                    <CardDescription>
                        Einkauf (Create/Renew), Marge, berechneter Verkaufspreis (Create).
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex flex-wrap items-center gap-4">
                        <div class="relative flex-1 min-w-[200px] max-w-sm">
                            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                v-model="searchInput"
                                type="search"
                                placeholder="TLD suchen (z. B. de, com)"
                                class="pl-9"
                                @keydown.enter.prevent="applySearch"
                            />
                        </div>
                        <Button variant="secondary" @click="applySearch">
                            Suchen
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-12">
                                    <input
                                        type="checkbox"
                                        :checked="allSelected()"
                                        :indeterminate="selectedTlds.size > 0 && selectedTlds.size < items.length"
                                        class="rounded border-input"
                                        @change="toggleAll(($event.target as HTMLInputElement).checked)"
                                    />
                                </TableHead>
                                <TableHead>TLD</TableHead>
                                <TableHead>Einkauf (Create)</TableHead>
                                <TableHead>Einkauf (Renew)</TableHead>
                                <TableHead>Marge</TableHead>
                                <TableHead>Verkauf (Create)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="item in items" :key="item.id">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        :checked="selectedTlds.has(item.tld)"
                                        class="rounded border-input"
                                        @change="toggleOne(item.tld, ($event.target as HTMLInputElement).checked)"
                                    />
                                </TableCell>
                                <TableCell class="font-medium">.{{ item.tld }}</TableCell>
                                <TableCell>{{ item.create_price.toFixed(2) }} €</TableCell>
                                <TableCell>{{ item.renew_price.toFixed(2) }} €</TableCell>
                                <TableCell>
                                    {{ item.margin_type === 'percent' ? `${item.margin_value} %` : `${item.margin_value} €` }}
                                </TableCell>
                                <TableCell>{{ item.sale_price.toFixed(2) }} €</TableCell>
                            </TableRow>
                            <TableRow v-if="items.length === 0">
                                <TableCell colspan="6" class="text-center text-muted">
                                    Keine TLDs. Klicken Sie auf „Pricelist von Skrime importieren“, um alle verfügbaren Endungen zu laden.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div v-if="links && links.length > 3" class="flex justify-center pt-4">
                        <Pagination :links="links" @navigate="handlePagination" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
