<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { index as customersIndex, show as customersShow } from '@/routes/admin/customers';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Eye } from 'lucide-vue-next';

type Customer = {
    id: number;
    name: string;
    email: string;
    sites_count: number;
};

type Props = {
    customers: {
        data: Customer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Kunden" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Kunden</Heading>
                <Text class="mt-2" muted>
                    Übersicht aller Kunden und deren Webseiten
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Kunden</CardTitle>
                    <CardDescription>Verwaltung der Kundenkonten</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>E-Mail</TableHead>
                                <TableHead>Anzahl Sites</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="customer in customers.data" :key="customer.id">
                                <TableCell class="font-medium">{{ customer.name }}</TableCell>
                                <TableCell>{{ customer.email }}</TableCell>
                                <TableCell>
                                    <Badge variant="info">{{ customer.sites_count }}</Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="customersShow({ customer: customer.id }).url">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="mr-2 h-4 w-4" />
                                            Details
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="customers.data.length === 0">
                                <TableCell colspan="4" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Kunden vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="customers.links && customers.links.length > 3" class="flex justify-center">
                <Pagination :links="customers.links" @navigate="handlePagination" />
            </div>
        </div>
    </AppLayout>
</template>
