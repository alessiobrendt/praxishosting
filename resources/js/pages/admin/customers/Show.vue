<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { index as customersIndex } from '@/routes/admin/customers';
import { show as sitesShow } from '@/routes/sites';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ExternalLink } from 'lucide-vue-next';

type Site = {
    id: number;
    name: string;
    slug: string;
    template?: { name: string };
};

type Customer = {
    id: number;
    name: string;
    email: string;
    sites: Site[];
};

type Props = {
    customer: Customer;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
    { title: props.customer.name, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde: ${customer.name}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">{{ customer.name }}</Heading>
                <Text class="mt-2" muted>
                    {{ customer.email }}
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kundeninformationen</CardTitle>
                    <CardDescription>Details zu diesem Kunden</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <Text variant="small" muted>E-Mail:</Text>
                        <Text class="ml-2">{{ customer.email }}</Text>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Webseiten</CardTitle>
                    <CardDescription>Alle Sites dieses Kunden</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in customer.sites" :key="site.id">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ site.slug }}
                                    </code>
                                </TableCell>
                                <TableCell>{{ site.template?.name ?? '-' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="sitesShow({ site: site.id }).url">
                                        <Button variant="ghost" size="sm">
                                            Bearbeiten
                                            <ExternalLink class="ml-2 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="customer.sites.length === 0">
                                <TableCell colspan="4" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Sites vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
