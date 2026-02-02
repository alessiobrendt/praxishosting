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
import { ArrowLeft } from 'lucide-vue-next';

type Submission = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    custom_fields: Record<string, unknown> | null;
    created_at: string;
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
};

type Props = {
    site: Site;
    submissions: Submission[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Module', href: '#' },
    { title: 'Kontaktformular', href: modules.contact.index.url() },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kontaktanfragen – ${site.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Link
                        :href="modules.contact.index.url()"
                        class="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft class="h-4 w-4" /> Zurück zur Übersicht
                    </Link>
                    <Heading level="h1">Kontaktanfragen – {{ site.name }}</Heading>
                    <Text class="mt-2" muted>Eingegangene Nachrichten über das Kontaktformular</Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Eingegangene Anfragen</CardTitle>
                    <CardDescription>{{ submissions.length }} Einträge</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="submissions.length > 0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>E-Mail</TableHead>
                                <TableHead>Betreff</TableHead>
                                <TableHead>Nachricht</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="s in submissions" :key="s.id">
                                <TableCell class="whitespace-nowrap text-muted-foreground">
                                    {{ new Date(s.created_at).toLocaleString('de-DE') }}
                                </TableCell>
                                <TableCell>{{ s.name }}</TableCell>
                                <TableCell>
                                    <a :href="`mailto:${s.email}`" class="text-primary hover:underline">{{ s.email }}</a>
                                </TableCell>
                                <TableCell>{{ s.subject ?? '–' }}</TableCell>
                                <TableCell class="max-w-xs truncate">{{ s.message }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="py-8 text-center text-muted-foreground">
                        Noch keine Kontaktanfragen eingegangen.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
