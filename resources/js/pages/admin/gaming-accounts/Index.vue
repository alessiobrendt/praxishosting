<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Eye } from 'lucide-vue-next';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type GameServerAccount = {
    id: number;
    name: string;
    identifier: string | null;
    status: string;
    current_period_ends_at: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    gameServerAccounts: {
        data: GameServerAccount[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasGaming: boolean;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game-Server-Accounts', href: '/admin/gaming-accounts' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('de-DE') : '-');
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Game-Server-Accounts" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Game-Server-Accounts</Heading>
                <Text class="mt-2" muted>
                    Alle verkauften Pterodactyl-Game-Server-Accounts dieser Marke
                </Text>
            </div>

            <Card v-if="!brandHasGaming">
                <CardContent class="py-8 text-center text-muted-foreground">
                    Für diese Marke ist das Feature „Gaming“ nicht aktiviert. Game-Server-Accounts werden nur für Marken mit aktiviertem Gaming angezeigt.
                </CardContent>
            </Card>

            <Card v-else>
                <CardHeader>
                    <CardTitle>Alle Accounts</CardTitle>
                    <CardDescription>Kunde, Server-Name, Plan, Status</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Server-Name</TableHead>
                                <TableHead>Identifier</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Abo-Ende</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="acc in props.gameServerAccounts.data" :key="acc.id">
                                <TableCell>
                                    <div class="font-medium">{{ acc.user.name }}</div>
                                    <div class="text-sm text-muted-foreground">{{ acc.user.email }}</div>
                                </TableCell>
                                <TableCell>{{ acc.name }}</TableCell>
                                <TableCell>
                                    <code v-if="acc.identifier" class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ acc.identifier }}</code>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                                <TableCell>{{ acc.hosting_plan.name }}</TableCell>
                                <TableCell>{{ acc.hosting_server?.name ?? acc.hosting_server?.hostname ?? '-' }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ formatDate(acc.current_period_ends_at) }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/gaming-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.gameServerAccounts.data.length === 0">
                                <TableCell colspan="8" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Game-Server-Accounts vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="brandHasGaming && props.gameServerAccounts.links && props.gameServerAccounts.links.length > 3" class="flex justify-center">
                <Pagination :links="props.gameServerAccounts.links" @navigate="handlePagination" />
            </div>
        </div>
    </AppLayout>
</template>
