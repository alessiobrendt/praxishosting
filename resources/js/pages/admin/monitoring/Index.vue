<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Plus, Edit, Trash2, Globe, Network } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import monitoring from '@/routes/admin/monitoring/index';
import type { BreadcrumbItem } from '@/types';

type MonitorTarget = {
    id: number;
    type: string;
    name: string;
    config: Record<string, unknown>;
    is_enabled: boolean;
};

type Props = {
    monitorTargets: {
        data: MonitorTarget[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Monitoring', href: monitoring.index.url() },
];

function typeLabel(type: string): string {
    return type === 'http_url' ? 'URL' : 'TCP-Port';
}

function typeIcon(type: string) {
    return type === 'http_url' ? Globe : Network;
}

function configSummary(target: MonitorTarget): string {
    if (target.type === 'http_url' && target.config?.url) {
        return String(target.config.url);
    }
    if (target.type === 'tcp_port' && target.config?.host && target.config?.port) {
        return `${target.config.host}:${target.config.port}`;
    }
    return '–';
}

function destroy(id: number) {
    if (confirm('Monitor-Ziel wirklich löschen?')) {
        router.delete(monitoring.destroy.url(id));
    }
}

function paginationClick(url: string | null) {
    if (url) window.location.href = url;
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Monitoring" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Monitoring</Heading>
                    <Text class="mt-2" muted>
                        URL- und Port-Ziele für die automatische Prüfung. Hosting-Server-APIs werden separat geprüft.
                    </Text>
                </div>
                <Link :href="monitoring.create.url()">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neues Ziel
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monitor-Ziele</CardTitle>
                    <CardDescription>
                        Ziele werden im konfigurierten Intervall geprüft. E-Mail-Empfänger unter Einstellungen → Monitoring.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Typ</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Ziel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="target in props.monitorTargets.data" :key="target.id">
                                <TableCell>
                                    <span class="flex items-center gap-1.5">
                                        <component :is="typeIcon(target.type)" class="h-4 w-4 text-muted-foreground" />
                                        {{ typeLabel(target.type) }}
                                    </span>
                                </TableCell>
                                <TableCell class="font-medium">{{ target.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-muted px-2 py-0.5 text-sm break-all">{{ configSummary(target) }}</code>
                                </TableCell>
                                <TableCell>
                                    <Badge :variant="target.is_enabled ? 'success' : 'secondary'">
                                        {{ target.is_enabled ? 'Aktiv' : 'Deaktiviert' }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="monitoring.edit.url(target.id)">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="text-destructive"
                                        @click="destroy(target.id)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.monitorTargets.data.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                                    Keine Ziele. Legen Sie ein URL- oder Port-Ziel an.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div v-if="props.monitorTargets.links && props.monitorTargets.links.length > 3" class="flex justify-center mt-4">
                        <Pagination :links="props.monitorTargets.links" @navigate="paginationClick" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
