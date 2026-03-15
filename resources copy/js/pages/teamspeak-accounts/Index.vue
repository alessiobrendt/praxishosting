<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Headphones, ChevronRight, Calendar, Package } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = { id: number; name: string };

type TeamSpeakServerAccount = {
    uuid: string;
    name: string;
    status: string;
    port: number | null;
    current_period_ends_at: string | null;
    hosting_plan: HostingPlan;
    is_shared_with_me?: boolean;
};

type ServerInfo = {
    address?: string;
    connection_uri?: string;
    virtualserver_uptime?: number;
    virtualserver_clientsonline?: number;
    virtualserver_maxclients?: number;
    virtualserver_version?: string;
    virtualserver_status?: string;
};

type Props = {
    teamSpeakServerAccounts: TeamSpeakServerAccount[];
    serverInfos: Record<string, ServerInfo>;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine TeamSpeak Server', href: '/teamspeak-accounts' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function getInfo(acc: TeamSpeakServerAccount): ServerInfo | null {
    return props.serverInfos[String(acc.uuid)] ?? null;
}

function displayStatus(info: ServerInfo | null, fallbackStatus: string): string {
    if (info?.virtualserver_status === 'online') return 'Online';
    if (info?.virtualserver_status === 'offline') return 'Offline';
    return fallbackStatus;
}

function statusVariant(info: ServerInfo | null, fallbackStatus: string): 'success' | 'default' | 'error' {
    const s = info?.virtualserver_status ?? fallbackStatus?.toLowerCase();
    if (s === 'online') return 'success';
    if (s === 'offline') return 'default';
    return 'default';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine TeamSpeak Server" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Meine TeamSpeak Server</Heading>
                    <Text class="mt-2" muted>
                        Ihre TeamSpeak-Server – Status, Paket und Verlängerung
                    </Text>
                </div>
                <Link href="/teamspeak">
                    <Button>
                        <Headphones class="mr-2 h-4 w-4" />
                        TeamSpeak Server mieten
                    </Button>
                </Link>
            </div>

            <div v-if="props.teamSpeakServerAccounts.length === 0" class="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-12 text-center">
                <Headphones class="mx-auto h-12 w-12 text-muted-foreground/50" />
                <Heading level="h2" class="mt-4 text-lg font-semibold">Noch keine TeamSpeak-Server</Heading>
                <Text class="mt-2" muted>
                    Sie haben noch keine TeamSpeak-Server. Buchen Sie Ihren ersten Server.
                </Text>
                <Link href="/teamspeak">
                    <Button class="mt-4">TeamSpeak Server mieten</Button>
                </Link>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="acc in props.teamSpeakServerAccounts"
                    :key="acc.uuid"
                    :href="`/teamspeak-accounts/${acc.uuid}`"
                    class="block"
                >
                    <Card class="transition-colors hover:bg-muted/50">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="flex items-center gap-2 text-base">
                                <Headphones class="h-4 w-4" />
                                {{ acc.name }}
                                <Badge v-if="acc.is_shared_with_me" variant="secondary" size="sm">Geteilt</Badge>
                            </CardTitle>
                            <Badge :variant="statusVariant(getInfo(acc), acc.status)">
                                {{ displayStatus(getInfo(acc), acc.status) }}
                            </Badge>
                        </CardHeader>
                        <CardContent class="space-y-1">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Package class="h-4 w-4 shrink-0" />
                                {{ acc.hosting_plan?.name ?? '–' }}
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar class="h-4 w-4 shrink-0" />
                                Läuft bis {{ formatDate(acc.current_period_ends_at) }}
                            </div>
                            <div class="mt-2 flex items-center text-sm text-primary">
                                Öffnen
                                <ChevronRight class="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
