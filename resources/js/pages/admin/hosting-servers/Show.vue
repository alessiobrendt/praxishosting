<!-- Admin: Hosting-Server anzeigen -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
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

const panelType = computed(() => props.hostingServer.panel_type ?? 'plesk');
const isPterodactyl = computed(() => panelType.value === 'pterodactyl');
const isTeamSpeak = computed(() => panelType.value === 'teamspeak');
const panelLabel = computed(() => {
    const t = panelType.value;
    if (t === 'pterodactyl') return 'Pterodactyl-Panel';
    if (t === 'teamspeak') return 'TeamSpeak-Node';
    return 'Plesk-Hosting-Server';
});

const formatMb = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`);

const progressPercent = (allocated: number, total: number) =>
    total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="hostingServer.name ?? hostingServer.hostname" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">{{ hostingServer.name ?? hostingServer.hostname }}</h4>
                        <p class="text-muted small mb-0">{{ panelLabel }}</p>
                    </div>
                    <div class="d-flex gap-2">
                        <Link
                            v-if="isPterodactyl"
                            :href="`/admin/hosting-servers/${hostingServer.id}/pterodactyl-nests`"
                        >
                            <BButton variant="outline-primary" size="sm">
                                <Icon icon="egg" class="me-2" />
                                Nests &amp; Eggs
                            </BButton>
                        </Link>
                        <Link :href="hostingServers.edit.url(hostingServer.id)">
                            <BButton variant="primary" size="sm">
                                <Icon icon="pencil" class="me-2" />
                                Bearbeiten
                            </BButton>
                        </Link>
                    </div>
                </div>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Details</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Server-Informationen</p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Hostname</span>
                            <code class="rounded bg-light px-2 py-1 small">{{ hostingServer.hostname }}</code>
                        </div>
                        <div v-if="hostingServer.ip_address" class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">IP-Adresse</span>
                            <span>{{ hostingServer.ip_address }}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Status</span>
                            <BBadge :variant="hostingServer.is_active ? 'success' : 'secondary'">
                                {{ hostingServer.is_active ? 'Aktiv' : 'Inaktiv' }}
                            </BBadge>
                        </div>
                        <div v-if="panelType === 'plesk'" class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Webspace-Accounts</span>
                            <span>{{ hostingServer.webspace_accounts_count }}</span>
                        </div>
                        <div v-if="isPterodactyl" class="d-flex justify-content-between py-2 border-bottom">
                            <span class="text-muted">Game-Server-Accounts</span>
                            <span>{{ hostingServer.game_server_accounts_count }}</span>
                        </div>
                        <div v-if="isTeamSpeak" class="d-flex justify-content-between py-2">
                            <span class="text-muted">TeamSpeak-Accounts</span>
                            <span>{{ hostingServer.team_speak_server_accounts_count }}</span>
                        </div>
                    </BCardBody>
                </BCard>

                <!-- TeamSpeak: Slots, Umsatz, Kosten, Gewinn -->
                <BCard v-if="isTeamSpeak && teamspeakStats" no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">TeamSpeak – Kennzahlen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Slots, monatlicher Umsatz und Gewinn (Kosten: {{ formatCurrency(teamspeakStats.cost_per_slot_per_month) }} pro Slot).
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <BRow>
                            <BCol sm="6" lg="3" class="mb-3 mb-lg-0">
                                <div class="rounded border p-3">
                                    <p class="text-muted small mb-1">Slots gesamt</p>
                                    <p class="fs-5 fw-semibold mb-0">{{ teamspeakStats.total_slots }}</p>
                                </div>
                            </BCol>
                            <BCol sm="6" lg="3" class="mb-3 mb-lg-0">
                                <div class="rounded border p-3">
                                    <p class="text-muted small mb-1">Umsatz (€/Monat)</p>
                                    <p class="fs-5 fw-semibold mb-0">{{ formatCurrency(teamspeakStats.monthly_revenue) }}</p>
                                </div>
                            </BCol>
                            <BCol sm="6" lg="3" class="mb-3 mb-lg-0">
                                <div class="rounded border p-3">
                                    <p class="text-muted small mb-1">Kosten (€/Monat)</p>
                                    <p class="fs-5 fw-semibold mb-0">{{ formatCurrency(teamspeakStats.monthly_cost) }}</p>
                                </div>
                            </BCol>
                            <BCol sm="6" lg="3">
                                <div class="rounded border p-3">
                                    <p class="text-muted small mb-1">Gewinn (€/Monat)</p>
                                    <p
                                        class="fs-5 fw-semibold mb-0"
                                        :class="teamspeakStats.monthly_profit >= 0 ? 'text-success' : 'text-danger'"
                                    >
                                        {{ formatCurrency(teamspeakStats.monthly_profit) }}
                                    </p>
                                </div>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>

                <!-- Pterodactyl Nodes -->
                <BCard v-if="isPterodactyl" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Nodes (Pterodactyl)</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Speicher- und Disk-Nutzung pro Node laut Panel-API</p>
                    </BCardHeader>
                    <BCardBody>
                        <p v-if="pterodactylNodes === null" class="text-warning small mb-0">
                            Node-Daten konnten nicht geladen werden. API prüfen unter Hosting-Server-Übersicht.
                        </p>
                        <p v-else-if="!pterodactylNodes?.length" class="text-muted small mb-0">
                            Keine Nodes im Panel konfiguriert.
                        </p>
                        <div v-else class="d-flex flex-column gap-3">
                            <div
                                v-for="node in pterodactylNodes"
                                :key="node.id"
                                class="rounded border p-3"
                            >
                                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <Icon icon="server" class="text-primary" />
                                        <span class="fw-medium">{{ node.name }}</span>
                                        <BBadge v-if="node.maintenance_mode" variant="warning">Wartung</BBadge>
                                    </div>
                                    <code v-if="node.fqdn" class="small text-muted">{{ node.fqdn }}</code>
                                </div>
                                <BRow>
                                    <BCol sm="6" class="mb-2 mb-sm-0">
                                        <div class="d-flex align-items-center gap-1 text-muted small">
                                            <Icon icon="server" />
                                            RAM
                                        </div>
                                        <p class="fw-medium small mb-1">
                                            {{ formatMb(node.memory_allocated_mb) }} von {{ formatMb(node.memory_total_mb) }} gebucht
                                        </p>
                                        <div class="progress" style="height: 6px">
                                            <div
                                                class="progress-bar bg-primary"
                                                role="progressbar"
                                                :style="{ width: `${progressPercent(node.memory_allocated_mb, node.memory_total_mb)}%` }"
                                                :aria-valuenow="progressPercent(node.memory_allocated_mb, node.memory_total_mb)"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </BCol>
                                    <BCol sm="6">
                                        <div class="d-flex align-items-center gap-1 text-muted small">
                                            <Icon icon="device-hard-drive" />
                                            Disk
                                        </div>
                                        <p class="fw-medium small mb-1">
                                            {{ formatMb(node.disk_allocated_mb) }} von {{ formatMb(node.disk_total_mb) }} gebucht
                                        </p>
                                        <div class="progress" style="height: 6px">
                                            <div
                                                class="progress-bar bg-info"
                                                role="progressbar"
                                                :style="{ width: `${progressPercent(node.disk_allocated_mb, node.disk_total_mb)}%` }"
                                                :aria-valuenow="progressPercent(node.disk_allocated_mb, node.disk_total_mb)"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </BCol>
                                </BRow>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
