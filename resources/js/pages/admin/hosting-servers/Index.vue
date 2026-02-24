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
import { Plus, Eye, Edit, Trash2 } from 'lucide-vue-next';

type HostingServer = {
    id: number;
    name: string | null;
    hostname: string;
    ip_address: string | null;
    is_active: boolean;
};

type Props = {
    hostingServers: {
        data: HostingServer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: '/admin/hosting-servers' },
];

const handlePagination = (url: string) => {
    window.location.href = url;
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Hosting-Server</Heading>
                    <Text class="mt-2" muted>
                        Plesk- und Pterodactyl-Server (nicht markenbezogen)
                    </Text>
                </div>
                <Link href="/admin/hosting-servers/create">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neuer Server
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alle Server</CardTitle>
                    <CardDescription>Übersicht der Plesk-Hosting-Server</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Hostname</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="server in props.hostingServers.data" :key="server.id">
                                <TableCell class="font-medium">{{ server.name ?? '-' }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ server.hostname }}
                                    </code>
                                </TableCell>
                                <TableCell>{{ server.ip_address ?? '-' }}</TableCell>
                                <TableCell>
                                    <Badge :variant="server.is_active ? 'success' : 'error'">
                                        {{ server.is_active ? 'Aktiv' : 'Inaktiv' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <Link :href="`/admin/hosting-servers/${server.id}`">
                                            <Button variant="ghost" size="sm">
                                                <Eye class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link :href="`/admin/hosting-servers/${server.id}/edit`">
                                            <Button variant="ghost" size="sm">
                                                <Edit class="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.hostingServers.data.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground">
                                    Keine Server vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div v-if="props.hostingServers.links && props.hostingServers.links.length > 3" class="flex justify-center">
                <Pagination :links="props.hostingServers.links" @navigate="handlePagination" />
            </div>
        </div>
    </AppLayout>
</template>
