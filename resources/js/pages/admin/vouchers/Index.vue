<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Edit, Plus } from 'lucide-vue-next';

type Voucher = {
    id: number;
    code: string;
    balance: string;
    use_type: string;
    redeemed_at: string | null;
    is_active: boolean;
    user?: { id: number; name: string; email: string } | null;
};

type Props = {
    vouchers: { data: Voucher[]; links: { url: string | null; label: string; active: boolean }[] };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gutscheine', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Gutscheine" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Gutscheine</Heading>
                    <Text class="mt-2" muted>Gutscheincodes für Guthaben verwalten</Text>
                </div>
                <Link href="/admin/vouchers/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gutscheine</CardTitle>
                    <CardDescription>Code, Betrag, Einmal-/Mehrfachnutzung</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Eingelöst</TableHead>
                                <TableHead>Aktiv</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="v in vouchers.data" :key="v.id">
                                <TableCell><code class="text-sm">{{ v.code }}</code></TableCell>
                                <TableCell>{{ v.balance }} €</TableCell>
                                <TableCell>{{ v.use_type === 'single_use' ? 'Einmal' : 'Mehrfach' }}</TableCell>
                                <TableCell>{{ v.user ? v.user.name : '–' }}</TableCell>
                                <TableCell>{{ v.redeemed_at ? 'Ja' : 'Nein' }}</TableCell>
                                <TableCell><Badge :variant="v.is_active ? 'success' : 'secondary'">{{ v.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/vouchers/${v.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="vouchers.data.length === 0">
                                <TableCell colspan="7" class="text-center text-muted">Keine Gutscheine.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="vouchers.links.length > 3" :links="vouchers.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
