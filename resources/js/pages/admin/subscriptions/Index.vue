<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SiteSubscription = {
    id: number;
    stripe_subscription_id: string | null;
    stripe_status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    site?: { id: number; name: string; template?: { name: string }; user?: { name: string; email: string } };
};

type Props = {
    subscriptions: {
        data: SiteSubscription[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Abos', href: '#' },
];

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Abos" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Abos</Heading>
                <Text class="mt-2" muted>
                    Übersicht aller Site-Abonnements
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Abonnements</CardTitle>
                    <CardDescription>Site, Kunde, Status, Laufzeitende</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Site</TableHead>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Laufzeitende</TableHead>
                                <TableHead>Stripe</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="sub in subscriptions.data" :key="sub.id">
                                <TableCell>
                                    <Link v-if="sub.site" :href="`/sites/${sub.site.id}`" class="font-medium text-primary hover:underline">
                                        {{ sub.site.name }}
                                    </Link>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>
                                    <span v-if="sub.site?.user">{{ sub.site.user.name }} ({{ sub.site.user.email }})</span>
                                    <span v-else>–</span>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="sub.stripe_status === 'active' ? 'success' : 'warning'">
                                        {{ sub.stripe_status }}
                                    </Badge>
                                    <span v-if="sub.cancel_at_period_end" class="ml-1 text-xs text-amber-600">Läuft aus</span>
                                </TableCell>
                                <TableCell>{{ sub.current_period_ends_at ?? '–' }}</TableCell>
                                <TableCell>
                                    <code v-if="sub.stripe_subscription_id" class="text-xs">{{ sub.stripe_subscription_id }}</code>
                                    <span v-else>–</span>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="subscriptions.data.length === 0">
                                <TableCell colspan="6" class="text-center text-muted">Keine Abos vorhanden.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="subscriptions.links.length > 3"
                        :links="subscriptions.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
