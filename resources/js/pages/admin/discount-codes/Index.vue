<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-vue-next';

type DiscountCode = {
    id: number;
    code: string;
    type: string;
    value: string;
    recurrence: string;
    valid_from: string | null;
    valid_until: string | null;
    max_redemptions: number | null;
    times_redeemed: number;
    is_active: boolean;
};

type Props = {
    discountCodes: { data: DiscountCode[]; links: { url: string | null; label: string; active: boolean }[] };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rabattcodes', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Rabattcode wirklich löschen?')) {
        router.delete(`/admin/discount-codes/${id}`);
    }
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Rabattcodes" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Rabattcodes</Heading>
                    <Text class="mt-2" muted>Rabattcodes für den Checkout verwalten</Text>
                </div>
                <Link href="/admin/discount-codes/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rabattcodes</CardTitle>
                    <CardDescription>Code, Typ (percent/fixed), Wert, Gültigkeit</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>Wert</TableHead>
                                <TableHead>Eingelöst</TableHead>
                                <TableHead>Aktiv</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="dc in discountCodes.data" :key="dc.id">
                                <TableCell><code class="text-sm">{{ dc.code }}</code></TableCell>
                                <TableCell>{{ dc.type }}</TableCell>
                                <TableCell>{{ dc.type === 'percent' ? dc.value + '%' : dc.value + ' €' }}</TableCell>
                                <TableCell>{{ dc.times_redeemed }}{{ dc.max_redemptions ? ` / ${dc.max_redemptions}` : '' }}</TableCell>
                                <TableCell><Badge :variant="dc.is_active ? 'success' : 'secondary'">{{ dc.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/discount-codes/${dc.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(dc.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="discountCodes.data.length === 0">
                                <TableCell colspan="6" class="text-center text-muted">Keine Rabattcodes.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="discountCodes.links.length > 3" :links="discountCodes.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
