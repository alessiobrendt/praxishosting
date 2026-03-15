<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Eye } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string } | null;
type GameserverCloudPlan = {
    id: number;
    name: string;
    config: Record<string, number>;
};

type Subscription = {
    id: number;
    user: User;
    gameserver_cloud_plan: GameserverCloudPlan;
    status: string;
    current_period_ends_at: string | null;
    used_cpu: number;
    used_memory_mb: number;
    used_disk_mb: number;
    remaining_cpu: number;
    remaining_memory_mb: number;
    remaining_disk_mb: number;
    max_cpu: number;
    max_memory_mb: number;
    max_disk_gb: number;
    servers_count: number;
};

type Props = {
    subscriptions: {
        data: Subscription[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasGameserverCloud: boolean;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Gameserver-Cloud-Accounts', href: '/admin/gameserver-cloud-accounts' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function usageLabel(sub: Subscription): string {
    const parts: string[] = [];
    parts.push(`${sub.used_cpu} % CPU`);
    parts.push(`${Math.round(sub.used_memory_mb / 1024)} GB RAM`);
    parts.push(`${Math.round(sub.used_disk_mb / 1024)} GB Disk`);
    return parts.join(' · ');
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gameserver-Cloud-Accounts" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Gameserver-Cloud-Accounts</Heading>
                <Text class="mt-2" muted>
                    Gemietete Clouds (Abos) mit zugehörigen Game-Servern
                </Text>
            </div>

            <Card v-if="!brandHasGameserverCloud">
                <CardContent class="py-8 text-center text-muted-foreground">
                    Für diese Marke ist das Feature „Gameserver Cloud“ nicht aktiviert.
                </CardContent>
            </Card>

            <Card v-else>
                <CardHeader>
                    <CardTitle>Alle Cloud-Abos</CardTitle>
                    <CardDescription>
                        Kunde, Cloud-Plan, Status, Abo-Ende, Verbrauch, Anzahl Server
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kunde</TableHead>
                                <TableHead>Cloud-Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Abo-Ende</TableHead>
                                <TableHead>Verbrauch</TableHead>
                                <TableHead>Server</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="sub in props.subscriptions.data"
                                :key="sub.id"
                            >
                                <TableCell>
                                    <div v-if="sub.user" class="font-medium">{{ sub.user.name }}</div>
                                    <div
                                        v-if="sub.user"
                                        class="text-sm text-muted-foreground"
                                    >
                                        {{ sub.user.email }}
                                    </div>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                                <TableCell>{{ sub.gameserver_cloud_plan?.name ?? '–' }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ sub.status }}</Badge>
                                </TableCell>
                                <TableCell>{{ formatDate(sub.current_period_ends_at) }}</TableCell>
                                <TableCell class="text-sm text-muted-foreground">
                                    {{ usageLabel(sub) }}
                                </TableCell>
                                <TableCell>{{ sub.servers_count }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/gameserver-cloud-accounts/${sub.id}`">
                                        <Button variant="ghost" size="sm">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.subscriptions.data.length === 0">
                                <TableCell
                                    colspan="7"
                                    class="text-center text-gray-500 dark:text-gray-400"
                                >
                                    Keine Gameserver-Cloud-Abos vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div
                v-if="
                    brandHasGameserverCloud &&
                    props.subscriptions.links &&
                    props.subscriptions.links.length > 3
                "
                class="flex justify-center"
            >
                <Pagination
                    :links="props.subscriptions.links"
                    @navigate="handlePagination"
                />
            </div>
        </div>
    </AdminLayout>
</template>
