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
import templatesRoutes from '@/routes/admin/templates';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    price: string;
};

type Props = {
    templates: {
        data: Template[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templatesRoutes.index().url },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Templates" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Templates</Heading>
                    <Text class="mt-2" muted>
                        Verwalten Sie Website-Templates
                    </Text>
                </div>
                <Link :href="templatesRoutes.create().url">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neues Template
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Templates</CardTitle>
                    <CardDescription>Übersicht aller verfügbaren Templates</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Preis</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="template in props.templates.data" :key="template.id">
                                <TableCell class="font-medium">{{ template.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ template.slug }}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="template.is_active ? 'success' : 'error'">
                                        {{ template.is_active ? 'Aktiv' : 'Inaktiv' }}
                                    </Badge>
                                </TableCell>
                                <TableCell>{{ template.price }} €</TableCell>
                                <TableCell class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <Link :href="templatesRoutes.show({ template: template.id }).url">
                                            <Button variant="ghost" size="sm">
                                                <Eye class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link :href="templatesRoutes.edit({ template: template.id }).url">
                                            <Button variant="ghost" size="sm">
                                                <Edit class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.templates.data.length === 0">
                                <TableCell colspan="5" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Templates vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="props.templates.links && props.templates.links.length > 3" class="flex justify-center">
                <Pagination :links="props.templates.links" @navigate="handlePagination" />
            </div>
        </div>
    </AdminLayout>
</template>
