<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const typeLabels: Record<string, string> = {
    meine_seiten: 'Meine Seiten',
    webspace: 'Webspace',
    domain: 'Domain',
};

type Product = {
    id: number;
    name: string;
    key: string;
    type: string;
    productable_name: string;
    edit_url: string | null;
    stripe_product_id: string | null;
    is_active: boolean;
    brand?: { id: number; key: string; name: string } | null;
};

type Props = {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Produkte', href: '/admin/products' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Produkte" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Produkte</Heading>
                    <Text class="mt-2" muted>
                        Gemeinsame Übersicht aller verkaufbaren Produkte
                    </Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Produkte</CardTitle>
                    <CardDescription>Meine Seiten, Webspace und Domain-Angebote</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>Marke</TableHead>
                                <TableHead>Verknüpftes Angebot</TableHead>
                                <TableHead>Produkt-ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="product in props.products.data" :key="product.id">
                                <TableCell class="font-medium">{{ product.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ product.key }}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {{ typeLabels[product.type] ?? product.type }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge v-if="product.brand" variant="outline">{{ product.brand.name }}</Badge>
                                    <span v-else class="text-muted-foreground text-sm">Alle</span>
                                </TableCell>
                                <TableCell>{{ product.productable_name }}</TableCell>
                                <TableCell>
                                    <code class="text-xs">{{ product.stripe_product_id ?? '-' }}</code>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="product.is_active ? 'success' : 'error'">
                                        {{ product.is_active ? 'Aktiv' : 'Inaktiv' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link
                                        v-if="product.edit_url"
                                        :href="product.edit_url"
                                    >
                                        <Button variant="ghost" size="sm">
                                            <Edit class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <span v-else class="text-gray-400">-</span>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.products.data.length === 0">
                                <TableCell colspan="8" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Produkte vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="props.products.links && props.products.links.length > 3" class="flex justify-center">
                <Pagination :links="props.products.links" @navigate="handlePagination" />
            </div>
        </div>
    </AdminLayout>
</template>
