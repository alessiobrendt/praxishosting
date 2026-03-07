<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit, Server, HardDrive, Egg } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import hostingServers from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';

type PterodactylNode = {
    id: number;
    name: string;
    fqdn: string;
    memory_total_mb: number;
    disk_total_mb: number;
    memory_allocated_mb: number;
    disk_allocated_mb: number;
    maintenance_mode: boolean;
};

type HostingServer = {
    id: number;
    name: string | null;
    hostname: string;
    ip_address: string | null;
    panel_type?: string;
    is_active: boolean;
    webspace_accounts_count: number;
    game_server_accounts_count: number;
    team_speak_server_accounts_count: number;
};

type TeamSpeakStats = {
    accounts_count: number;
    total_slots: number;
    monthly_revenue: number;
    monthly_cost: number;
    monthly_profit: number;
    cost_per_slot_per_month: number;
};

type Props = {
    hostingServer: HostingServer;
    pterodactylNodes: PterodactylNode[] | null;
    teamspeakStats: TeamSpeakStats | null;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: hostingServers.index.url() },
    { title: props.hostingServer.name ?? props.hostingServer.hostname, href: '#' },
];

const panelType = () => props.hostingServer.panel_type ?? 'plesk';
const isPterodactyl = () => panelType() === 'pterodactyl';
const isTeamSpeak = () => panelType() === 'teamspeak';

const formatMb = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`);

const progressPercent = (allocated: number, total: number) =>
    total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="hostingServer.name ?? hostingServer.hostname" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ hostingServer.name ?? hostingServer.hostname }}</Heading>
                    <Text class="mt-2" muted>
                        {{ isPterodactyl() ? 'Pterodactyl-Panel' : isTeamSpeak() ? 'TeamSpeak-Node' : 'Plesk-Hosting-Server' }}
                    </Text>
                </div>
                <div class="flex gap-2">
                    <Link
                        v-if="isPterodactyl()"
                        :href="`/admin/hosting-servers/${hostingServer.id}/pterodactyl-nests`"
                    >
                        <Button variant="outline">
                            <Egg class="mr-2 h-4 w-4" />
                            Nests & Eggs
                        </Button>
                    </Link>
                    <Link :href="hostingServers.edit.url(hostingServer.id)">
                        <Button>
                            <Edit class="mr-2 h-4 w-4" />
                            Bearbeiten
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Server-Informationen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Hostname</span>
                        <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ hostingServer.hostname }}</code>
                    </div>
                    <div v-if="hostingServer.ip_address" class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">IP-Adresse</span>
                        <span>{{ hostingServer.ip_address }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Status</span>
                        <Badge :variant="hostingServer.is_active ? 'success' : 'error'">
                            {{ hostingServer.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </Badge>
                    </div>
                    <div v-if="panelType() === 'plesk'" class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Webspace-Accounts</span>
                        <span>{{ hostingServer.webspace_accounts_count }}</span>
                    </div>
                    <div v-if="isPterodactyl()" class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Game-Server-Accounts</span>
                        <span>{{ hostingServer.game_server_accounts_count }}</span>
                    </div>
                    <div v-if="isTeamSpeak()" class="flex justify-between py-2">
                        <span class="text-muted-foreground">TeamSpeak-Accounts</span>
                        <span>{{ hostingServer.team_speak_server_accounts_count }}</span>
                    </div>
                </CardContent>
            </Card>

            <!-- TeamSpeak: Slots, Umsatz, Kosten, Gewinn -->
            <Card v-if="isTeamSpeak() && teamspeakStats">
                <CardHeader>
                    <CardTitle>TeamSpeak – Kennzahlen</CardTitle>
                    <CardDescription>
                        Slots, monatlicher Umsatz und Gewinn (Kosten: {{ formatCurrency(teamspeakStats.cost_per_slot_per_month) }} pro Slot).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <p class="text-sm text-muted-foreground">Slots gesamt</p>
                            <p class="mt-1 text-2xl font-semibold">{{ teamspeakStats.total_slots }}</p>
                        </div>
                        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <p class="text-sm text-muted-foreground">Umsatz (€/Monat)</p>
                            <p class="mt-1 text-2xl font-semibold">{{ formatCurrency(teamspeakStats.monthly_revenue) }}</p>
                        </div>
                        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <p class="text-sm text-muted-foreground">Kosten (€/Monat)</p>
                            <p class="mt-1 text-2xl font-semibold">{{ formatCurrency(teamspeakStats.monthly_cost) }}</p>
                        </div>
                        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <p class="text-sm text-muted-foreground">Gewinn (€/Monat)</p>
                            <p class="mt-1 text-2xl font-semibold" :class="teamspeakStats.monthly_profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                {{ formatCurrency(teamspeakStats.monthly_profit) }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Pterodactyl Nodes -->
            <Card v-if="isPterodactyl()">
                <CardHeader>
                    <CardTitle>Nodes (Pterodactyl)</CardTitle>
                    <CardDescription>
                        Speicher- und Disk-Nutzung pro Node laut Panel-API
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p v-if="pterodactylNodes === null" class="text-sm text-amber-600 dark:text-amber-400">
                        Node-Daten konnten nicht geladen werden. API prüfen unter Hosting-Server-Übersicht.
                    </p>
                    <div v-else-if="pterodactylNodes && pterodactylNodes.length === 0" class="text-sm text-muted-foreground">
                        Keine Nodes im Panel konfiguriert.
                    </div>
                    <div v-else class="space-y-4">
                        <div
                            v-for="node in pterodactylNodes"
                            :key="node.id"
                            class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <Server class="h-5 w-5 text-violet-500 dark:text-violet-400" />
                                    <span class="font-medium">{{ node.name }}</span>
                                    <Badge v-if="node.maintenance_mode" variant="warning" size="sm">Wartung</Badge>
                                </div>
                                <code v-if="node.fqdn" class="text-xs text-muted-foreground">{{ node.fqdn }}</code>
                            </div>
                            <div class="mt-3 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Server class="h-4 w-4" />
                                        RAM
                                    </div>
                                    <p class="mt-0.5 font-medium">
                                        {{ formatMb(node.memory_allocated_mb) }} von {{ formatMb(node.memory_total_mb) }} gebucht
                                    </p>
                                    <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            class="h-full rounded-full bg-violet-500 dark:bg-violet-600"
                                            :style="{ width: `${progressPercent(node.memory_allocated_mb, node.memory_total_mb)}%` }"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <HardDrive class="h-4 w-4" />
                                        Disk
                                    </div>
                                    <p class="mt-0.5 font-medium">
                                        {{ formatMb(node.disk_allocated_mb) }} von {{ formatMb(node.disk_total_mb) }} gebucht
                                    </p>
                                    <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            class="h-full rounded-full bg-sky-500 dark:bg-sky-600"
                                            :style="{ width: `${progressPercent(node.disk_allocated_mb, node.disk_total_mb)}%` }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
