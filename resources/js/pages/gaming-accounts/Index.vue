<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Gamepad2, ExternalLink } from 'lucide-vue-next';

type HostingPlan = { id: number; name: string };

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    current_period_ends_at: string | null;
    hosting_plan: HostingPlan;
};

type Props = {
    gameServerAccounts: GameServerAccount[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
];

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('de-DE') : '-');
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Game Server" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Meine Game Server</Heading>
                    <Text class="mt-2" muted>
                        Ihre Pterodactyl Game-Server-Accounts
                    </Text>
                </div>
                <Link href="/gaming">
                    <Button>
                        <Gamepad2 class="mr-2 h-4 w-4" />
                        Game Server mieten
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Accounts</CardTitle>
                    <CardDescription>Name, Paket, Status und Abo-Ende</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Paket</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verlängerung</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="acc in props.gameServerAccounts" :key="acc.id">
                                <TableCell>
                                    <span class="font-medium">{{ acc.name }}</span>
                                </TableCell>
                                <TableCell>{{ acc.hosting_plan.name }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ formatDate(acc.current_period_ends_at) }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/gaming-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm">
                                            <ExternalLink class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.gameServerAccounts.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground">
                                    Sie haben noch keine Game-Server-Accounts.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
