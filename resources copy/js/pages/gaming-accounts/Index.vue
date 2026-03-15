<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Gamepad2, ChevronRight, Calendar, Package } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = { id: number; name: string };

type GameserverCloudSubscription = {
    current_period_ends_at: string | null;
    gameserver_cloud_plan: { name: string };
};

type GameServerAccount = {
    uuid: string;
    name: string;
    status: string;
    current_period_ends_at: string | null;
    hosting_plan: HostingPlan | null;
    gameserver_cloud_subscription?: GameserverCloudSubscription | null;
    is_shared_with_me?: boolean;
};

type ServerOverview = {
    status: string;
    suspended?: boolean;
    is_installing?: boolean;
};

type Props = {
    gameServerAccounts: GameServerAccount[];
    serverOverviews: Record<string, ServerOverview>;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function getOverview(acc: GameServerAccount): ServerOverview | null {
    return props.serverOverviews[String(acc.uuid)] ?? null;
}

function planLabel(acc: GameServerAccount): string {
    return acc.hosting_plan?.name ?? acc.gameserver_cloud_subscription?.gameserver_cloud_plan?.name ?? '–';
}

function periodEnd(acc: GameServerAccount): string | null {
    return acc.gameserver_cloud_subscription?.current_period_ends_at ?? acc.current_period_ends_at ?? null;
}

function displayStatus(overview: ServerOverview | null, fallbackStatus: string): string {
    if (overview?.suspended) return 'Gesperrt';
    if (overview?.is_installing) return 'Installation';
    if (overview?.status) {
        const s = overview.status.toLowerCase();
        if (s === 'running' || s === 'started') return 'Online';
        if (s === 'stopped' || s === 'offline') return 'Offline';
        if (s === 'stopping') return 'Wird gestoppt …';
        if (s === 'starting') return 'Wird gestartet …';
        return overview.status;
    }
    return fallbackStatus;
}

function statusVariant(overview: ServerOverview | null, fallbackStatus: string): 'success' | 'default' | 'error' {
    if (overview?.suspended) return 'error';
    const s = overview?.status?.toLowerCase() ?? fallbackStatus?.toLowerCase();
    if (s === 'running' || s === 'started') return 'success';
    if (s === 'stopping' || s === 'starting') return 'default';
    return 'default';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Game Server" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Meine Game Server</Heading>
                    <Text class="mt-2" muted>
                        Ihre Pterodactyl Game-Server – Status, Paket und Verlängerung
                    </Text>
                </div>
                <Link href="/gaming">
                    <Button>
                        <Gamepad2 class="mr-2 h-4 w-4" />
                        Game Server mieten
                    </Button>
                </Link>
            </div>

            <div v-if="props.gameServerAccounts.length === 0" class="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-12 text-center">
                <Gamepad2 class="mx-auto h-12 w-12 text-muted-foreground/50" />
                <Heading level="h2" class="mt-4 text-lg font-semibold">Noch keine Game-Server</Heading>
                <Text class="mt-2" muted>
                    Sie haben noch keine Game-Server-Accounts. Buchen Sie Ihren ersten Server.
                </Text>
                <Link href="/gaming">
                    <Button class="mt-4">Game Server mieten</Button>
                </Link>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="acc in props.gameServerAccounts"
                    :key="acc.uuid"
                    :href="`/gaming-accounts/${acc.uuid}`"
                    class="group block"
                >
                    <Card class="h-full transition-colors hover:border-primary/40 hover:bg-muted/30">
                        <CardHeader class="pb-2">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-3">
                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Gamepad2 class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <CardTitle class="truncate text-base">{{ acc.name }}</CardTitle>
                                            <Badge v-if="acc.is_shared_with_me" variant="secondary" size="sm">Geteilt</Badge>
                                        </div>
                                        <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Package class="h-3.5 w-3.5 shrink-0" />
                                            <span class="truncate">{{ planLabel(acc) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </CardHeader>
                        <CardContent class="space-y-3 pt-0">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-sm text-muted-foreground">Status</span>
                                <Badge :variant="statusVariant(getOverview(acc), acc.status)" size="sm" class="shrink-0">
                                    <span
                                        class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                                        :class="{
                                            'bg-green-500': statusVariant(getOverview(acc), acc.status) === 'success',
                                            'bg-red-500': statusVariant(getOverview(acc), acc.status) === 'error',
                                            'bg-muted-foreground': statusVariant(getOverview(acc), acc.status) === 'default',
                                        }"
                                    />
                                    {{ displayStatus(getOverview(acc), acc.status) }}
                                </Badge>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Läuft bis: {{ formatDate(periodEnd(acc)) }}</span>
                            </div>
                            <div class="flex justify-end pt-1">
                                <Button variant="ghost" size="sm" class="text-primary" as="span">
                                    Server öffnen
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
