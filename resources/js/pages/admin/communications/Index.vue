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

type Communication = {
    source: 'dunning' | 'reminder';
    id: string;
    sent_at: string;
    sent_at_formatted: string;
    type: string;
    type_label: string;
    subject_type: string;
    subject_id: number;
    subject_display: string;
    subject_link: string | null;
    customer_name: string;
    note: string | null;
    created_by_name: string | null;
};

type Props = {
    communications: {
        data: Communication[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    typeLabels: Record<string, string>;
    filters: { from?: string; to?: string; type?: string };
};

const props = defineProps<Props>();

const filterFrom = ref(props.filters.from ?? '');
const filterTo = ref(props.filters.to ?? '');
const filterType = ref(props.filters.type ?? '');

watch(
    () => props.filters,
    (f) => {
        filterFrom.value = f.from ?? '';
        filterTo.value = f.to ?? '';
        filterType.value = f.type ?? '';
    },
    { deep: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Kommunikation & Erinnerungen', href: '#' },
];

const applyFilters = () => {
    router.get('/admin/communications', {
        from: filterFrom.value || undefined,
        to: filterTo.value || undefined,
        type: filterType.value || undefined,
    }, { preserveState: true });
};

const clearFilters = () => {
    filterFrom.value = '';
    filterTo.value = '';
    filterType.value = '';
    router.get('/admin/communications');
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Kommunikation & Erinnerungen" />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Heading level="h1">Kommunikation & Erinnerungen</Heading>
                    <Text class="mt-2" muted>
                        Mahnungen und erfasste Erinnerungen (Zahlungserinnerung, Abo endet, Telefonat, E-Mail)
                    </Text>
                </div>
                <Link href="/admin/communications/create">
                    <Button>Erinnerung erfassen</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                    <CardDescription>Zeitraum und Art</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="applyFilters" class="flex flex-wrap items-end gap-4">
                        <div class="space-y-2">
                            <Label for="filter_from">Von</Label>
                            <Input
                                id="filter_from"
                                v-model="filterFrom"
                                type="date"
                                class="w-full sm:w-auto"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="filter_to">Bis</Label>
                            <Input
                                id="filter_to"
                                v-model="filterTo"
                                type="date"
                                class="w-full sm:w-auto"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="filter_type">Art</Label>
                            <Select
                                id="filter_type"
                                v-model="filterType"
                                class="w-full sm:w-[200px]"
                            >
                                <option value="">Alle</option>
                                <option
                                    v-for="(label, value) in typeLabels"
                                    :key="value"
                                    :value="value"
                                >
                                    {{ label }}
                                </option>
                            </Select>
                        </div>
                        <Button type="submit" variant="secondary">Filter anwenden</Button>
                        <Button type="button" variant="ghost" @click="clearFilters">Zurücksetzen</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Übersicht</CardTitle>
                    <CardDescription>Datum, Art, Bezug (Rechnung/Site/Kunde), Kunde, Notiz</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Art</TableHead>
                                <TableHead>Bezug</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Notiz / Erfasser</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="c in communications.data"
                                :key="c.id"
                            >
                                <TableCell>{{ c.sent_at_formatted }}</TableCell>
                                <TableCell>{{ c.type_label }}</TableCell>
                                <TableCell>
                                    <a
                                        v-if="c.subject_link"
                                        :href="c.subject_link"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        {{ c.subject_display }}
                                    </a>
                                    <span v-else>{{ c.subject_display }}</span>
                                </TableCell>
                                <TableCell>{{ c.customer_name }}</TableCell>
                                <TableCell>
                                    <span v-if="c.note">{{ c.note }}</span>
                                    <span v-else-if="c.created_by_name" class="text-muted-foreground">{{ c.created_by_name }}</span>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-if="!communications.data.length" class="py-8 text-center text-muted-foreground">
                        Keine Einträge für die gewählten Filter.
                    </p>
                    <Pagination
                        v-if="communications.links && communications.links.length > 3"
                        :links="communications.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
