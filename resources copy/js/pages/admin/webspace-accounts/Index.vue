<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Eye } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; hostname: string } | null;

type WebspaceAccount = {
    id: number;
    domain: string;
    status: string;
    current_period_ends_at: string | null;
    mollie_subscription_id: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    webspaceAccounts: {
        data: WebspaceAccount[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Accounts', href: '/admin/webspace-accounts' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Webspace-Accounts" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Webspace-Accounts</Heading>
                <Text class="mt-2" muted>
                    Alle verkauften Plesk-Webspace-Accounts
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Accounts</CardTitle>
                    <CardDescription>Kunde, Domain, Plan, Status</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Abo-Ende</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="acc in props.webspaceAccounts.data" :key="acc.id">
                                <TableCell>
                                    <div class="font-medium">{{ acc.user.name }}</div>
                                    <div class="text-sm text-muted-foreground">{{ acc.user.email }}</div>
                                </TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ acc.domain }}</code>
                                </TableCell>
                                <TableCell>{{ acc.hosting_plan.name }}</TableCell>
                                <TableCell>{{ acc.hosting_server?.hostname ?? '-' }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ formatDate(acc.current_period_ends_at) }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/webspace-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.webspaceAccounts.data.length === 0">
                                <TableCell colspan="7" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Webspace-Accounts vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="props.webspaceAccounts.links && props.webspaceAccounts.links.length > 3" class="flex justify-center">
                <Pagination :links="props.webspaceAccounts.links" @navigate="handlePagination" />
            </div>
        </div>
    </AdminLayout>
</template>
