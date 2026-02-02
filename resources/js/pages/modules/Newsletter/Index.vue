<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import modules from '@/routes/modules';
import type { BreadcrumbItem } from '@/types';
import { FileEdit } from 'lucide-vue-next';

type Site = {
    uuid: string;
    name: string;
    slug: string;
    subscribers_count: number;
};

type Props = {
    sites: Site[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Module', href: '#' },
    { title: 'Newsletter', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Newsletter" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Newsletter</Heading>
                <Text class="mt-2" muted>News schreiben und Abonnenten verwalten</Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sites mit Newsletter-Modul</CardTitle>
                    <CardDescription>Sites, auf denen das Newsletter-Modul aktiv ist</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="sites.length > 0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Site</TableHead>
                                <TableHead>Abonnenten</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in sites" :key="site.uuid">
                                <TableCell>
                                    <Link :href="modules.newsletter.site.url({ site: site.uuid })" class="font-medium hover:underline">
                                        {{ site.name }}
                                    </Link>
                                </TableCell>
                                <TableCell>{{ site.subscribers_count }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="modules.newsletter.site.url({ site: site.uuid })">
                                        <Button variant="outline" size="sm">
                                            <FileEdit class="mr-1 h-4 w-4" />
                                            News schreiben
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="py-8 text-center text-muted-foreground">
                        Keine Sites mit aktivem Newsletter-Modul. Fügen Sie das Newsletter-Modul im Page Designer hinzu.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
