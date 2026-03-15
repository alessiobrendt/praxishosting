<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Eye, Headphones } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccounts: {
        data: TeamSpeakServerAccount[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasTeamSpeak: boolean;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="TeamSpeak-Server-Accounts" />

        <div class="space-y-6">
            <div>
                <Heading level="h1" class="flex items-center gap-2">
                    <Headphones class="h-8 w-8" />
                    TeamSpeak-Server-Accounts
                </Heading>
                <Text class="mt-2" muted>
                    Alle verkauften TeamSpeak-Server-Accounts dieser Marke
                </Text>
            </div>

            <Card v-if="!brandHasTeamSpeak">
                <CardContent class="py-8 text-center text-muted-foreground">
                    Für diese Marke ist das Feature „TeamSpeak“ nicht aktiviert. TeamSpeak-Accounts werden nur für Marken mit aktiviertem TeamSpeak angezeigt.
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
                                <TableHead>Port</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Abo-Ende</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="acc in props.teamSpeakServerAccounts.data" :key="acc.id">
                                <TableCell>
                                    <div class="font-medium">{{ acc.user.name }}</div>
                                    <div class="text-sm text-muted-foreground">{{ acc.user.email }}</div>
                                </TableCell>
                                <TableCell>{{ acc.name }}</TableCell>
                                <TableCell>
                                    <span v-if="acc.port != null">{{ acc.port }}</span>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                                <TableCell>{{ acc.hosting_plan.name }}</TableCell>
                                <TableCell>{{ acc.hosting_server?.name ?? acc.hosting_server?.hostname ?? '–' }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ formatDate(acc.current_period_ends_at) }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/teamspeak-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.teamSpeakServerAccounts.data.length === 0">
                                <TableCell colspan="8" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine TeamSpeak-Server-Accounts vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="brandHasTeamSpeak && props.teamSpeakServerAccounts.links && props.teamSpeakServerAccounts.links.length > 3" class="flex justify-center">
                <Pagination :links="props.teamSpeakServerAccounts.links" @navigate="handlePagination" />
            </div>
        </div>
    </AdminLayout>
</template>
