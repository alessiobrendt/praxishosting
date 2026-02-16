<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notify } from '@/composables/useNotify';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Search, Globe } from 'lucide-vue-next';

type Domain = {
    id: number;
    domain: string;
    status: string;
    expires_at: string | null;
    auto_renew: boolean;
};

type Props = {
    domains: Domain[];
};

defineProps<Props>();

const page = usePage();
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Domains', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Domains" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Meine Domains</Heading>
                    <Text class="mt-2" muted>
                        Ihre über uns registrierten Domains
                    </Text>
                </div>
                <div class="flex gap-2">
                    <Link href="/domains/search">
                        <Button variant="outline">
                            <Search class="mr-2 h-4 w-4" />
                            Domain suchen
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Domains</CardTitle>
                    <CardDescription>
                        Übersicht Ihrer Domains. Klicken Sie auf eine Domain, um Nameserver, DNS, DNSSEC und Verlängerung zu verwalten.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ablaufdatum</TableHead>
                                <TableHead>Auto-Verlängerung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="d in domains" :key="d.id">
                                <TableCell class="font-medium">
                                    <Link :href="`/domains/${d.id}`" class="hover:underline inline-flex items-center">
                                        <Globe class="mr-2 h-4 w-4 text-muted shrink-0" />
                                        {{ d.domain }}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="d.status === 'active' ? 'success' : 'secondary'">
                                        {{ d.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell>{{ d.expires_at ?? '–' }}</TableCell>
                                <TableCell>{{ d.auto_renew ? 'Ja' : 'Nein' }}</TableCell>
                            </TableRow>
                            <TableRow v-if="domains.length === 0">
                                <TableCell colspan="4" class="text-center text-muted">
                                    Noch keine Domains. Suchen Sie eine Domain und bestellen Sie sie.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
