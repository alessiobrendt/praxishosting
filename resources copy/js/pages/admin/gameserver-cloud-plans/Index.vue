<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';
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

type HostingServer = { id: number; name: string; hostname: string };

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    is_active: boolean;
    sort_order: number;
    hosting_server: HostingServer | null;
};

type Props = {
    gameserverCloudPlans: {
        data: GameserverCloudPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Gameserver-Cloud-Pläne', href: '#' },
];

function destroy(plan: GameserverCloudPlan) {
    if (!confirm(`Plan „${plan.name}" wirklich löschen?`)) return;
    router.delete(`/admin/gameserver-cloud-plans/${plan.id}`);
}

const handlePagination = (url: string) => {
    window.location.href = url;
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gameserver-Cloud-Pläne" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Gameserver-Cloud-Pläne</Heading>
                    <Text class="mt-2" muted>
                        Ressourcen-Pools für die Gameserver Cloud (CPU, RAM, Disk). Kunden kaufen ein Abo und legen daraus beliebig viele Game-Server an.
                    </Text>
                </div>
                <Link href="/admin/gameserver-cloud-plans/create">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neuer Plan
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Pläne</CardTitle>
                    <CardDescription>Pro Brand; Pterodactyl-Server und Limits (max_cpu, max_memory_mb, max_disk_gb) in config.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Preis</TableHead>
                                <TableHead>Pterodactyl-Server</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="plan in props.gameserverCloudPlans.data"
                                :key="plan.id"
                            >
                                <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                <TableCell>{{ plan.price }} €</TableCell>
                                <TableCell class="text-sm text-muted-foreground">
                                    {{ plan.hosting_server?.name ?? plan.hosting_server?.hostname ?? '–' }}
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="plan.is_active ? 'success' : 'secondary'">
                                        {{ plan.is_active ? 'Aktiv' : 'Inaktiv' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/gameserver-cloud-plans/${plan.id}/edit`">
                                        <Button variant="ghost" size="icon" title="Bearbeiten">
                                            <Pencil class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Löschen"
                                        @click="destroy(plan)"
                                    >
                                        <Trash2 class="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination
                        v-if="props.gameserverCloudPlans.links.length > 3"
                        :links="props.gameserverCloudPlans.links"
                        @page-click="handlePagination"
                    />
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
