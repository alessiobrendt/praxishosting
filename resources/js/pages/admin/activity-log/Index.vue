<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type ActivityLogEntry = {
    id: number;
    action: string;
    model_type: string;
    model_id: number;
    created_at: string;
    user?: { id: number; name: string };
};

type Props = {
    activityLog: {
        data: ActivityLogEntry[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { action?: string; model_type?: string; from?: string; to?: string };
    actionOptions: Record<string, string>;
    modelTypeOptions: Record<string, string>;
};

const props = defineProps<Props>();

const filterAction = ref(props.filters.action ?? '');
const filterModelType = ref(props.filters.model_type ?? '');
const filterFrom = ref(props.filters.from ?? '');
const filterTo = ref(props.filters.to ?? '');

watch(
    () => props.filters,
    (f) => {
        filterAction.value = f.action ?? '';
        filterModelType.value = f.model_type ?? '';
        filterFrom.value = f.from ?? '';
        filterTo.value = f.to ?? '';
    },
    { deep: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Aktivitätslog', href: '#' },
];

const applyFilters = () => {
    router.get('/admin/activity-log', {
        action: filterAction.value || undefined,
        model_type: filterModelType.value || undefined,
        from: filterFrom.value || undefined,
        to: filterTo.value || undefined,
    }, { preserveState: true });
};

const clearFilters = () => {
    filterAction.value = '';
    filterModelType.value = '';
    filterFrom.value = '';
    filterTo.value = '';
    router.get('/admin/activity-log');
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

function detailUrl(entry: ActivityLogEntry): string {
    if (entry.model_type.includes('Site')) {
        return `/admin/sites/${entry.model_id}`;
    }
    if (entry.model_type.includes('User')) {
        return `/admin/customers/${entry.model_id}`;
    }
    if (entry.model_type.includes('Ticket') && !entry.model_type.includes('Todo') && !entry.model_type.includes('Category') && !entry.model_type.includes('Priority')) {
        return `/admin/tickets/${entry.model_id}`;
    }
    if (entry.model_type.includes('Invoice')) {
        return `/admin/invoices/${entry.model_id}`;
    }
    if (entry.model_type.includes('Quote')) {
        return `/admin/quotes/${entry.model_id}`;
    }
    if (entry.model_type.includes('OrderConfirmation')) {
        return `/admin/order-confirmations/${entry.model_id}`;
    }
    if (entry.model_type.includes('DiscountCode')) {
        return `/admin/discount-codes/${entry.model_id}/edit`;
    }
    if (entry.model_type.includes('Voucher')) {
        return `/admin/vouchers/${entry.model_id}/edit`;
    }
    if (entry.model_type.includes('Template') && !entry.model_type.includes('Page')) {
        return `/admin/templates/${entry.model_id}`;
    }
    if (entry.model_type === 'system') {
        return '/admin/settings';
    }
    return '#';
}

function actionLabel(action: string): string {
    return props.actionOptions[action] ?? action;
}

function modelTypeLabel(modelType: string): string {
    return props.modelTypeOptions[modelType] ?? modelType;
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Aktivitätslog" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Aktivitätslog</Heading>
                <Text class="mt-2" muted>
                    Alle Admin-Aktionen: Tickets, Rechnungen, Kunden, Einstellungen und mehr
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                    <CardDescription>Aktion, Typ, Zeitraum</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="applyFilters" class="flex flex-wrap items-end gap-4">
                        <div class="space-y-2">
                            <Label for="filter_action">Aktion</Label>
                            <Select
                                id="filter_action"
                                v-model="filterAction"
                                class="w-48"
                            >
                                <option value="">Alle</option>
                                <option
                                    v-for="(label, key) in actionOptions"
                                    :key="key"
                                    :value="key"
                                >
                                    {{ label }}
                                </option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="filter_model_type">Typ</Label>
                            <Select
                                id="filter_model_type"
                                v-model="filterModelType"
                                class="w-32"
                            >
                                <option value="">Alle</option>
                                <option
                                    v-for="(label, key) in modelTypeOptions"
                                    :key="key"
                                    :value="key"
                                >
                                    {{ label }}
                                </option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="filter_from">Von (Datum)</Label>
                            <Input
                                id="filter_from"
                                v-model="filterFrom"
                                type="date"
                                class="w-40"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="filter_to">Bis (Datum)</Label>
                            <Input
                                id="filter_to"
                                v-model="filterTo"
                                type="date"
                                class="w-40"
                            />
                        </div>
                        <Button type="submit" size="sm">Filtern</Button>
                        <Button type="button" variant="outline" size="sm" @click="clearFilters">
                            Zurücksetzen
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Einträge</CardTitle>
                    <CardDescription>Chronologisch, neueste zuerst</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Aktion</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="entry in activityLog.data" :key="entry.id">
                                <TableCell>{{ entry.created_at }}</TableCell>
                                <TableCell>{{ actionLabel(entry.action) }}</TableCell>
                                <TableCell>{{ modelTypeLabel(entry.model_type) }}</TableCell>
                                <TableCell>{{ entry.user?.name ?? '–' }}</TableCell>
                                <TableCell>
                                    <Link
                                        v-if="detailUrl(entry) !== '#'"
                                        :href="detailUrl(entry)"
                                        class="text-primary hover:underline"
                                    >
                                        #{{ entry.model_id }} anzeigen
                                    </Link>
                                    <span v-else>#{{ entry.model_id }}</span>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="!activityLog.data.length">
                                <TableCell colspan="5" class="py-8 text-center text-muted-foreground">
                                    Keine Einträge (oder Filter ohne Treffer).
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="activityLog.links.length > 3"
                        :links="activityLog.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
