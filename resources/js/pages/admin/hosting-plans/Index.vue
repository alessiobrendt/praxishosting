<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus, Eye, Edit } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    plesk_package_name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
    stripe_price_id: string | null;
    is_active: boolean;
    webspace_accounts_count: number;
};

type Props = {
    hostingPlans: {
        data: HostingPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Pakete', href: '/admin/hosting-plans' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};

const specsShort = (plan: HostingPlan) =>
    `${plan.disk_gb} GB / ${plan.traffic_gb} GB Traffic / ${plan.domains} Dom.`;
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Webspace-Pakete" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Webspace-Pakete</Heading>
                    <Text class="mt-2" muted>
                        Plesk-Pakete für den Verkauf
                    </Text>
                </div>
                <Link href="/admin/hosting-plans/create">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neues Paket
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Pakete</CardTitle>
                    <CardDescription>Plesk-Paketname = exakter Service-Plan-Name in Plesk</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Plesk-Paketname</TableHead>
                                <TableHead>Specs</TableHead>
                                <TableHead>Preis</TableHead>
                                <TableHead>Accounts</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="plan in props.hostingPlans.data" :key="plan.id">
                                <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ plan.plesk_package_name }}
                                    </code>
                                </TableCell>
                                <TableCell class="text-sm text-muted-foreground">{{ specsShort(plan) }}</TableCell>
                                <TableCell>{{ plan.price }} €</TableCell>
                                <TableCell>{{ plan.webspace_accounts_count }}</TableCell>
                                <TableCell>
                                    <Badge :variant="plan.is_active ? 'success' : 'error'">
                                        {{ plan.is_active ? 'Aktiv' : 'Inaktiv' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <Link :href="`/admin/hosting-plans/${plan.id}`">
                                            <Button variant="ghost" size="sm">
                                                <Eye class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link :href="`/admin/hosting-plans/${plan.id}/edit`">
                                            <Button variant="ghost" size="sm">
                                                <Edit class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.hostingPlans.data.length === 0">
                                <TableCell colspan="7" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Pakete vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="props.hostingPlans.links && props.hostingPlans.links.length > 3" class="flex justify-center">
                <Pagination :links="props.hostingPlans.links" @navigate="handlePagination" />
            </div>
        </div>
    </AdminLayout>
</template>
