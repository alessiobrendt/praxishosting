<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import {
    Copy,
    Globe,
    Headphones,
    Power,
    PowerOff,
    RotateCw,
    CalendarPlus,
    Calendar,
    Pencil,
    Key,
    Trash2,
    Save,
    Loader2,
    LayoutDashboard,
    ExternalLink,
    RefreshCcw,
    Share2,
} from 'lucide-vue-next';
import ProductSharingCard from '@/components/product-sharing/ProductSharingCard.vue';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import AutoRenewModal from '@/components/AutoRenewModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import teamspeakAccounts, { autoRenewBalance, autoRenewMollieSubscription } from '@/routes/teamspeak-accounts';
import type { BreadcrumbItem } from '@/types';

type TeamSpeakServerAccount = {
    id: number;
    name: string;
    status: string;
    port: number | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan: { name: string; price: string };
    hosting_server: { name: string } | null;
};

type ServerInfo = {
    address?: string;
    connection_uri?: string;
    virtualserver_uptime?: number;
    virtualserver_clientsonline?: number;
    virtualserver_queryclientsonline?: number;
    virtualserver_maxclients?: number;
    virtualserver_version?: string;
    virtualserver_status?: string;
};

type TokenRow = { token: string; group: string; description: string };

type SnapshotRow = { id: number; created_at: string };

type ViewerTree = {
    server: { id?: number; name?: string; clients_online?: number; maxclients?: number };
    channels: { id: number; name: string; order: number }[];
    clients: { id: number; nickname: string; type: number; channel_id: number }[];
};

type Props = {
    teamSpeakServerAccount: TeamSpeakServerAccount;
    serverInfo: ServerInfo | null;
    tokens: TokenRow[];
    snapshots: SnapshotRow[];
    viewerTree: ViewerTree;
    canRenew?: boolean;
    renewalAmount?: number;
    canPayWithBalance?: boolean;
    customerBalance?: number;
    renewUrl?: string;
    isSuspendedOrExpired?: boolean;
    auto_renew_with_balance?: boolean;
    has_mollie_subscription?: boolean;
    canManageCollaborators?: boolean;
    productShares?: Array<{ id: number; user: { id: number; name: string; email: string } | null; permissions: string[]; update_url: string; destroy_url: string }>;
    productInvitations?: Array<{ id: number; email: string; permissions: string[]; expires_at: string | null; destroy_url: string }>;
    allowedSharePermissions?: string[];
    storeInvitationUrl?: string | null;
    connectDomainShowUrl?: string;
};

const props = withDefaults(defineProps<Props>(), {
    canRenew: false,
    renewalAmount: 0,
    canPayWithBalance: false,
    customerBalance: 0,
    renewUrl: '',
    isSuspendedOrExpired: false,
    auto_renew_with_balance: false,
    has_mollie_subscription: false,
    canManageCollaborators: false,
    productShares: () => [],
    productInvitations: () => [],
    allowedSharePermissions: () => [],
    storeInvitationUrl: null,
    connectDomainShowUrl: '',
});

const powerLoading = ref<'start' | 'stop' | null>(null);
const reinstallLoading = ref(false);
const nameModalOpen = ref(false);
const renewModalOpen = ref(false);
const autoRenewModalOpen = ref(false);
const tokenModalOpen = ref(false);
const newName = ref(props.teamSpeakServerAccount.name);
const newTokenDescription = ref('');
const liveServerInfo = ref<ServerInfo | null>(props.serverInfo ?? null);
const liveViewerTree = ref<ViewerTree>(props.viewerTree);
const paymentMethod = ref<'balance' | 'mollie'>('balance');
const renewPeriodMonths = ref(1);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine TeamSpeak Server', href: '/teamspeak-accounts' },
    { title: props.teamSpeakServerAccount.name, href: '#' },
];

const displayInfo = computed(() => liveServerInfo.value ?? props.serverInfo);
const page = usePage();
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean> | undefined) ?? {});
const showAboVerwalten = computed(
    () => !brandFeatures.value?.prepaid_balance && !props.canRenew,
);
const showRenewButton = computed(
    () => props.renewUrl && (props.canRenew || brandFeatures.value?.prepaid_balance === true),
);
const showAutoRenewButton = computed(
    () => showRenewButton.value && brandFeatures.value?.prepaid_balance === true,
);

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function formatSnapshotDate(iso: string): string {
    return new Date(iso).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatUptime(seconds: number): string {
    if (seconds < 0) return '–';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d} Tag(e)`);
    parts.push(`${h} Std`);
    parts.push(`${m} Min`);
    return parts.join(', ');
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => notify.success('In Zwischenablage kopiert'));
}

function displayStatus(): string {
    if (props.isSuspendedOrExpired) return 'Gesperrt';
    const s = displayInfo.value?.virtualserver_status ?? props.teamSpeakServerAccount.status ?? '';
    if (s === 'online') return 'Online';
    if (s === 'offline' || s === 'stopped') return 'Offline';
    return s || '–';
}

function statusVariant(): 'success' | 'default' | 'error' {
    if (props.isSuspendedOrExpired) return 'error';
    const s = displayInfo.value?.virtualserver_status ?? '';
    if (s === 'online') return 'success';
    return 'default';
}

const isOnline = computed(() => (displayInfo.value?.virtualserver_status ?? '') === 'online');

function fetchOverview() {
    fetch(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/overview`, {
        method: 'GET',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.serverInfo !== undefined) liveServerInfo.value = data.serverInfo;
            if (data.viewerTree !== undefined) liveViewerTree.value = data.viewerTree;
        })
        .catch(() => {});
}

let pollInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
    fetchOverview();
    pollInterval = setInterval(fetchOverview, 10000);
});
onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
});

watch(
    () => (usePage().props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (usePage().props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

function sendPower(action: 'start' | 'stop') {
    powerLoading.value = action;
    // Optimistisch Status setzen, damit nach „Stop“ nicht weiter „Online“ angezeigt wird
    const current = liveServerInfo.value ?? props.serverInfo;
    if (action === 'stop') {
        liveServerInfo.value = current ? { ...current, virtualserver_status: 'offline' } : { virtualserver_status: 'offline' };
    } else {
        liveServerInfo.value = current ? { ...current, virtualserver_status: 'online' } : { virtualserver_status: 'online' };
    }
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/power`, { action }, {
        preserveScroll: true,
        onSuccess: () => {
            powerLoading.value = null;
            fetchOverview();
        },
        onError: () => {
            powerLoading.value = null;
            liveServerInfo.value = props.serverInfo ?? null;
        },
        onFinish: () => {
            powerLoading.value = null;
        },
    });
}

function reinstall() {
    if (!confirm('Möchten Sie den TeamSpeak-Server wirklich neu einrichten? Alle Daten gehen verloren!')) return;
    reinstallLoading.value = true;
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/reinstall`, {}, {
        preserveScroll: true,
        onFinish: () => { reinstallLoading.value = false; },
    });
}

function submitName() {
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/name`, { name: newName.value }, {
        preserveScroll: true,
        onSuccess: () => { nameModalOpen.value = false; },
    });
}

function submitRenew() {
    router.post(props.renewUrl, {
        payment_method: paymentMethod.value,
        period_months: renewPeriodMonths.value,
    }, {
        preserveScroll: true,
        onSuccess: () => { renewModalOpen.value = false; },
    });
}

function createToken() {
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/tokens`, {
        description: newTokenDescription.value,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            tokenModalOpen.value = false;
            newTokenDescription.value = '';
        },
    });
}

function deleteToken(token: string) {
    if (!confirm('Token wirklich löschen?')) return;
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/tokens/delete`, { token }, {
        preserveScroll: true,
    });
}

function createBackup() {
    router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups`, {}, {
        preserveScroll: true,
    });
}

function deployBackup(snapshotId: number) {
    if (!confirm('Backup wiederherstellen? Der aktuelle Serverzustand wird überschrieben.')) return;
    router.post(
        `/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups/${snapshotId}/deploy`,
        {},
        { preserveScroll: true },
    );
}

function deleteBackup(snapshotId: number) {
    if (!confirm('Backup wirklich löschen?')) return;
    router.delete(
        `/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups/${snapshotId}`,
        { preserveScroll: true },
    );
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="teamSpeakServerAccount.name" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <!-- Sidebar wie Gaming -->
            <div class="lg:col-span-1">
                <Card class="rounded-lg p-4">
                    <div class="border-b pb-3 text-center">
                        <div class="mb-3 flex items-center justify-between">
                            <Badge :variant="statusVariant()" class="gap-1">
                                <span
                                    v-if="statusVariant() === 'success'"
                                    class="relative flex h-1.5 w-1.5"
                                >
                                    <span
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
                                    />
                                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                </span>
                                {{ displayStatus() }}
                            </Badge>
                        </div>
                        <div class="flex justify-center text-muted-foreground">
                            <Headphones class="h-12 w-12" />
                        </div>
                        <Heading level="h5" class="mt-2">TeamSpeak-Server</Heading>
                        <Text class="mt-0.5 text-sm" muted>{{ teamSpeakServerAccount.name }}</Text>
                        <Text class="mt-0.5 text-xs" muted>{{ teamSpeakServerAccount.hosting_plan?.name }}</Text>
                        <div class="mt-3 rounded-lg border bg-muted/40 px-3 py-2 text-center">
                            <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Läuft bis</span>
                            </div>
                            <div class="mt-0.5 text-sm font-semibold">{{ formatDate(teamSpeakServerAccount.current_period_ends_at) }}</div>
                            <div v-if="teamSpeakServerAccount.cancel_at_period_end" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                Kündigung zum Periodenende
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-col gap-3">
                        <template v-if="isSuspendedOrExpired">
                            <Button class="w-full justify-start gap-2" disabled>
                                <ExternalLink class="h-4 w-4" />
                                Gesperrt – bitte verlängern
                            </Button>
                        </template>
                        <a
                            v-else-if="displayInfo?.connection_uri && isOnline"
                            :href="displayInfo.connection_uri"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-block"
                        >
                            <Button class="w-full justify-start gap-2">
                                <ExternalLink class="h-4 w-4" />
                                Zum Server verbinden
                            </Button>
                        </a>
                        <template v-if="showRenewButton">
                            <Button
                                variant="default"
                                class="w-full justify-start gap-2"
                                @click="renewModalOpen = true"
                            >
                                <CalendarPlus class="h-4 w-4" />
                                Verlängern
                            </Button>
                        </template>
                        <template v-if="showAutoRenewButton">
                            <Button
                                variant="outline"
                                class="w-full justify-start gap-2"
                                @click="autoRenewModalOpen = true"
                            >
                                <RefreshCcw class="h-4 w-4" />
                                Auto Renew
                            </Button>
                        </template>
                        <Link v-if="showAboVerwalten" href="/billing/subscriptions">
                            <Button variant="outline" class="w-full justify-start gap-2">
                                Abo verwalten
                            </Button>
                        </Link>
                        <Link v-if="connectDomainShowUrl && !isSuspendedOrExpired" :href="connectDomainShowUrl">
                            <Button variant="outline" class="w-full justify-start gap-2">
                                <Globe class="h-4 w-4" />
                                Domain verbinden
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <!-- Hauptbereich: Tabs -->
            <div class="lg:col-span-3">
                <Tabs default-tab="overview" class="w-full">
                    <TabsList class="mb-4 flex h-auto flex-wrap justify-start gap-1 rounded-lg bg-white p-1 dark:bg-muted/50">
                        <TabsTrigger value="overview" class="gap-2 px-3 py-2">
                            <LayoutDashboard class="h-4 w-4" />
                            <span class="hidden sm:inline">Übersicht</span>
                        </TabsTrigger>
                        <TabsTrigger value="access" class="gap-2 px-3 py-2">
                            <ExternalLink class="h-4 w-4" />
                            <span class="hidden sm:inline">Zugang</span>
                        </TabsTrigger>
                        <TabsTrigger value="tokens" class="gap-2 px-3 py-2">
                            <Key class="h-4 w-4" />
                            <span class="hidden sm:inline">Tokens</span>
                        </TabsTrigger>
                        <TabsTrigger value="backups" class="gap-2 px-3 py-2">
                            <Save class="h-4 w-4" />
                            <span class="hidden sm:inline">Backups</span>
                        </TabsTrigger>
                        <TabsTrigger value="viewer" class="gap-2 px-3 py-2">
                            <Headphones class="h-4 w-4" />
                            <span class="hidden sm:inline">Viewer</span>
                        </TabsTrigger>
                        <TabsTrigger value="rename" class="gap-2 px-3 py-2">
                            <Pencil class="h-4 w-4" />
                            <span class="hidden sm:inline">Umbenennen</span>
                        </TabsTrigger>
                        <TabsTrigger v-if="canManageCollaborators" value="sharing" class="gap-2 px-3 py-2">
                            <Share2 class="h-4 w-4" />
                            <span class="hidden sm:inline">Teilen</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" class="mt-0">
                        <div class="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informationen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableHead class="w-36 font-medium">Adresse</TableHead>
                                                <TableCell class="flex items-center gap-1">
                                                    <span class="font-mono text-sm">{{ displayInfo?.address ?? '–' }}</span>
                                                    <Button
                                                        v-if="displayInfo?.connection_uri"
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        class="h-7 w-7"
                                                        title="Kopieren"
                                                        @click="copyToClipboard(displayInfo!.connection_uri!)"
                                                    >
                                                        <Copy class="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Online-Zeit</TableHead>
                                                <TableCell>{{ displayInfo?.virtualserver_uptime != null ? formatUptime(displayInfo.virtualserver_uptime) : '–' }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">User online</TableHead>
                                                <TableCell>{{ displayInfo?.virtualserver_clientsonline ?? 0 }} / {{ displayInfo?.virtualserver_maxclients ?? 0 }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Version</TableHead>
                                                <TableCell>{{ displayInfo?.virtualserver_version ?? '–' }}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Steuerung & Abo</CardTitle>
                                    <CardDescription>
                                        Start, Stop und Neu einrichten des TeamSpeak-Servers.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <div
                                        v-if="isSuspendedOrExpired"
                                        class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                                    >
                                        Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie, um die Steuerung wieder zu nutzen.
                                    </div>
                                    <div v-else class="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            class="bg-green-600 hover:bg-green-700"
                                            :disabled="!!powerLoading || isOnline"
                                            @click="sendPower('start')"
                                        >
                                            <Loader2
                                                v-if="powerLoading === 'start'"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            <Power v-else class="mr-2 h-4 w-4" />
                                            Start
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            class="border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:border-orange-700 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 dark:hover:border-orange-700"
                                            :disabled="!!powerLoading || reinstallLoading"
                                            @click="reinstall"
                                        >
                                            <Loader2
                                                v-if="reinstallLoading"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            <RotateCw v-else class="mr-2 h-4 w-4" />
                                            Neu einrichten
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            :disabled="!!powerLoading || !isOnline"
                                            @click="sendPower('stop')"
                                        >
                                            <Loader2
                                                v-if="powerLoading === 'stop'"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            <PowerOff v-else class="mr-2 h-4 w-4" />
                                            Stop
                                        </Button>
                                    </div>
                                    <dl v-if="!canRenew" class="grid gap-2 text-sm">
                                        <div class="flex justify-between border-b py-2">
                                            <dt class="text-muted-foreground">Nächste Verlängerung</dt>
                                            <dd>{{ formatDate(teamSpeakServerAccount.current_period_ends_at) }}</dd>
                                        </div>
                                        <div class="flex justify-between py-2">
                                            <span class="text-muted-foreground">Kündigung zum Periodenende</span>
                                            <Badge v-if="teamSpeakServerAccount.cancel_at_period_end" variant="default">
                                                Ja
                                            </Badge>
                                            <span v-else>Nein</span>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </div>

                        <Card class="mt-4">
                            <CardHeader>
                                <CardTitle>System</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableHead class="w-36 font-medium">Node</TableHead>
                                            <TableCell>{{ teamSpeakServerAccount.hosting_server?.name ?? '–' }}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead class="font-medium">Preis (Paket)</TableHead>
                                            <TableCell>{{ teamSpeakServerAccount.hosting_plan?.price ?? '–' }} €/Monat</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead class="font-medium">DDoS-Schutz</TableHead>
                                            <TableCell>inkl. DDoS Protection</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="access" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Zugangsdaten</CardTitle>
                                <CardDescription>
                                    Server-Adresse und Verbindungs-URI für den TeamSpeak-Client.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Adresse (IP:Port)</label>
                                    <div class="flex gap-2">
                                        <Input
                                            :model-value="displayInfo?.address ?? '–'"
                                            readonly
                                            class="font-mono bg-muted"
                                        />
                                        <Button
                                            v-if="displayInfo?.address"
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            title="Kopieren"
                                            @click="copyToClipboard(displayInfo!.address!)"
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Verbindung (ts3server://)</label>
                                    <div class="flex gap-2">
                                        <Input
                                            :model-value="displayInfo?.connection_uri ?? '–'"
                                            readonly
                                            class="font-mono bg-muted"
                                        />
                                        <Button
                                            v-if="displayInfo?.connection_uri"
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            title="Kopieren"
                                            @click="copyToClipboard(displayInfo!.connection_uri!)"
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <a
                                    v-if="displayInfo?.connection_uri && isOnline && !isSuspendedOrExpired"
                                    :href="displayInfo.connection_uri"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
                                >
                                    <ExternalLink class="mr-2 h-4 w-4" />
                                    Im TeamSpeak-Client verbinden
                                </a>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tokens" class="mt-4 w-full">
                        <Card class="w-full">
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Privilege Keys (Tokens)</CardTitle>
                                        <CardDescription>Token erstellen und verwalten.</CardDescription>
                                    </div>
                                    <Button v-if="!isSuspendedOrExpired" size="sm" @click="tokenModalOpen = true">
                                        <Key class="mr-2 h-4 w-4" />
                                        Neuen Token erstellen
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent class="w-full">
                                <div class="w-full min-w-0 overflow-x-auto">
                                    <table class="w-full min-w-full table-fixed caption-bottom text-sm border-collapse">
                                        <thead>
                                            <tr class="w-full border-b border-gray-200 dark:border-gray-800">
                                                <th class="h-12 w-[35%] min-w-0 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400">Token</th>
                                                <th class="h-12 w-[20%] min-w-0 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400">Gruppe</th>
                                                <th class="h-12 w-[25%] min-w-0 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400">Beschreibung</th>
                                                <th class="h-12 w-[20%] min-w-0 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400">Aktionen</th>
                                            </tr>
                                        </thead>
                                        <tbody class="[&_tr:last-child]:border-0">
                                            <tr
                                                v-for="t in tokens"
                                                :key="t.token"
                                                class="w-full border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                                            >
                                                <td class="w-[35%] min-w-0 p-4 align-middle font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                                                    <span class="cursor-pointer" @click="copyToClipboard(t.token)">{{ t.token }}</span>
                                                    <Button variant="ghost" size="icon" class="ml-1 h-6 w-6 shrink-0 inline-flex" @click="copyToClipboard(t.token)">
                                                        <Copy class="h-3 w-3" />
                                                    </Button>
                                                </td>
                                                <td class="w-[20%] min-w-0 p-4 align-middle text-gray-900 dark:text-gray-100">{{ t.group }}</td>
                                                <td class="w-[25%] min-w-0 p-4 align-middle text-gray-900 dark:text-gray-100">{{ t.description || '–' }}</td>
                                                <td class="w-[20%] min-w-0 p-4 align-middle text-gray-900 dark:text-gray-100">
                                                    <Button
                                                        v-if="!isSuspendedOrExpired"
                                                        variant="destructive"
                                                        size="sm"
                                                        @click="deleteToken(t.token)"
                                                    >
                                                        <Trash2 class="h-4 w-4 shrink-0" />
                                                        <span class="ml-1.5">Löschen</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr
                                                v-if="tokens.length === 0"
                                                class="w-full border-b border-gray-200 dark:border-gray-800"
                                            >
                                                <td colspan="4" class="p-4 py-8 text-center text-muted-foreground">Keine Tokens</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="backups" class="mt-4 w-full">
                        <Card class="w-full">
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Backups</CardTitle>
                                        <CardDescription>Snapshots erstellen und wiederherstellen.</CardDescription>
                                    </div>
                                    <Button v-if="!isSuspendedOrExpired" size="sm" @click="createBackup">
                                        <Save class="mr-2 h-4 w-4" />
                                        Neues Backup
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent class="w-full">
                                <div class="w-full min-w-0 overflow-x-auto">
                                    <table class="w-full min-w-full table-fixed caption-bottom text-sm border-collapse">
                                        <thead>
                                            <tr class="w-full border-b border-gray-200 dark:border-gray-800">
                                                <th class="h-12 w-[70%] min-w-0 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400">Erstellt am</th>
                                                <th class="h-12 w-[30%] min-w-0 px-4 text-right align-middle font-medium text-gray-600 dark:text-gray-400">Aktionen</th>
                                            </tr>
                                        </thead>
                                        <tbody class="[&_tr:last-child]:border-0">
                                            <tr
                                                v-for="snap in snapshots"
                                                :key="snap.id"
                                                class="w-full border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                                            >
                                                <td class="w-[70%] min-w-0 p-4 align-middle text-gray-900 dark:text-gray-100">{{ formatSnapshotDate(snap.created_at) }}</td>
                                                <td class="w-[30%] min-w-0 p-4 text-right align-middle text-gray-900 dark:text-gray-100">
                                                    <div class="flex items-center justify-end gap-2">
                                                        <Button
                                                            v-if="!isSuspendedOrExpired"
                                                            variant="outline"
                                                            size="sm"
                                                            @click="deployBackup(snap.id)"
                                                        >
                                                            Wiederherstellen
                                                        </Button>
                                                        <Button
                                                            v-if="!isSuspendedOrExpired"
                                                            variant="destructive"
                                                            size="sm"
                                                            @click="deleteBackup(snap.id)"
                                                        >
                                                            <Trash2 class="h-4 w-4 shrink-0" />
                                                            <span class="ml-1.5">Löschen</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr
                                                v-if="snapshots.length === 0"
                                                class="w-full border-b border-gray-200 dark:border-gray-800"
                                            >
                                                <td colspan="2" class="p-4 py-8 text-center text-muted-foreground">Keine Backups vorhanden</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="viewer" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Viewer</CardTitle>
                                <CardDescription>Kanäle und verbundene Clients</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div class="space-y-1 font-mono text-sm">
                                    <div v-if="liveViewerTree.server?.name" class="font-semibold">
                                        {{ liveViewerTree.server.name }} ({{ liveViewerTree.server.clients_online ?? 0 }}/{{ liveViewerTree.server.maxclients ?? 0 }})
                                    </div>
                                    <div v-for="ch in liveViewerTree.channels" :key="ch.id" class="ml-4 text-muted-foreground">
                                        # {{ ch.name }}
                                    </div>
                                    <div v-for="cl in liveViewerTree.clients" :key="cl.id" class="ml-8 text-muted-foreground">
                                        – {{ cl.nickname || 'Unbekannt' }}
                                    </div>
                                    <p v-if="!liveViewerTree.server?.name && liveViewerTree.channels.length === 0" class="text-muted-foreground">
                                        Keine Daten oder Server offline.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rename" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Server umbenennen</CardTitle>
                                <CardDescription>
                                    Anzeigenamen des TeamSpeak-Servers ändern.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div class="mb-4 space-y-2">
                                    <Label for="account-name">Name</Label>
                                    <Input id="account-name" v-model="newName" maxlength="50" placeholder="TeamSpeak" />
                                </div>
                                <Button @click="submitName">
                                    <Pencil class="mr-2 h-4 w-4" />
                                    Name speichern
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent v-if="canManageCollaborators" value="sharing" class="mt-4">
                        <ProductSharingCard
                            :product-shares="productShares"
                            :product-invitations="productInvitations"
                            :allowed-share-permissions="allowedSharePermissions"
                            :store-invitation-url="storeInvitationUrl ?? ''"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <Dialog v-model:open="nameModalOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Name ändern</DialogTitle>
                </DialogHeader>
                <div class="space-y-2">
                    <Label for="modal-account-name">Name</Label>
                    <Input id="modal-account-name" v-model="newName" maxlength="50" placeholder="TeamSpeak" />
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="nameModalOpen = false">Abbrechen</Button>
                    <Button @click="submitName">Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="renewModalOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verlängern</DialogTitle>
                    <CardDescription>Verlängerung für {{ renewalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € pro Monat.</CardDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label>Monate</Label>
                        <select v-model.number="renewPeriodMonths" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option :value="1">1 Monat</option>
                            <option :value="3">3 Monate</option>
                            <option :value="6">6 Monate</option>
                            <option :value="12">12 Monate</option>
                        </select>
                    </div>
                    <div v-if="canPayWithBalance" class="space-y-2">
                        <Label>Zahlungsart</Label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2">
                                <input v-model="paymentMethod" type="radio" value="balance" />
                                Guthaben ({{ customerBalance?.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                            </label>
                            <label class="flex items-center gap-2">
                                <input v-model="paymentMethod" type="radio" value="mollie" />
                                Karte / PayPal
                            </label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="renewModalOpen = false">Abbrechen</Button>
                    <Button @click="submitRenew">Verlängern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <AutoRenewModal
            v-if="showAutoRenewButton"
            :open="autoRenewModalOpen"
            :balance-url="autoRenewBalance.url(props.teamSpeakServerAccount.uuid)"
            :mollie-url="autoRenewMollieSubscription.url(props.teamSpeakServerAccount.uuid)"
            :mollie-cancel-url="teamspeakAccounts.subscription.cancel.url(props.teamSpeakServerAccount.uuid)"
            :auto-renew-with-balance="props.auto_renew_with_balance"
            :has-mollie-subscription="props.has_mollie_subscription"
            @update:open="autoRenewModalOpen = $event"
        />

        <Dialog v-model:open="tokenModalOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neuen Token erstellen</DialogTitle>
                    <CardDescription>Privilege Key für Server-Admin-Rechte (Standard-Gruppe).</CardDescription>
                </DialogHeader>
                <div class="space-y-2">
                    <Label for="token-desc">Beschreibung (optional)</Label>
                    <Input id="token-desc" v-model="newTokenDescription" placeholder="z. B. für Bot" />
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="tokenModalOpen = false">Abbrechen</Button>
                    <Button @click="createToken">Erstellen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
