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
import { MessageSquare } from 'lucide-vue-next';

type Site = {
    uuid: string;
    name: string;
    slug: string;
    submissions_count: number;
    module_label: string | null;
};

type Props = {
    sites: Site[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Module', href: '#' },
    { title: 'Kontaktformular', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Kontaktformular" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Kontaktformular</Heading>
                <Text class="mt-2" muted>Eingegangene Kontaktanfragen einsehen</Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sites mit Kontaktformular-Modul</CardTitle>
                    <CardDescription>Sites, auf denen das Kontaktformular aktiv ist</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="sites.length > 0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Site</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Eingänge</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in sites" :key="site.uuid">
                                <TableCell>
                                    <span class="font-medium">{{ site.name }}</span>
                                </TableCell>
                                <TableCell>{{ site.module_label ?? '-' }}</TableCell>
                                <TableCell>{{ site.submissions_count }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="modules.contact.submissions({ site: site.uuid }).url">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare class="mr-1 h-4 w-4" />
                                            Anfragen anzeigen
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="py-8 text-center text-muted-foreground">
                        Keine Sites mit aktivem Kontaktformular-Modul. Fügen Sie das Kontaktformular im Page Designer hinzu.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
