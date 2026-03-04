<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    Copy,
    ExternalLink,
    KeyRound,
    Pencil,
    LayoutDashboard,
    Server,
    Power,
    PowerOff,
    RotateCw,
    Loader2,
    CalendarPlus,
    Calendar,
} from 'lucide-vue-next';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { notify } from '@/composables/useNotify';
import PaymentMethodModal from '@/components/PaymentMethodModal.vue';

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    identifier: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan: { name: string };
};

type ServerOverview = {
    name: string;
    status: string;
    allocation: string;
    limits: { memory: number; disk: number; cpu: number; swap?: number; io?: number };
    usage: {
        memory_bytes: number;
        disk_bytes: number;
        cpu_absolute: number;
        network_rx_bytes: number;
        network_tx_bytes: number;
    };
    can_power: boolean;
    is_installing?: boolean;
    suspended?: boolean;
};

type Props = {
    gameServerAccount: GameServerAccount;
    loginUrl: string | null;
    userEmail: string;
    serverOverview: ServerOverview | null;
    canRenew?: boolean;
    renewalAmount?: number;
    canPayWithBalance?: boolean;
    customerBalance?: number;
    renewUrl?: string;
    isSuspendedOrExpired?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    canRenew: false,
    renewalAmount: 0,
    canPayWithBalance: false,
    customerBalance: 0,
    renewUrl: '',
    isSuspendedOrExpired: false,
});

const powerLoading = ref<string | null>(null);
const liveOverview = ref<ServerOverview | null>(props.serverOverview ?? null);
const renewModalOpen = ref(false);

const renewalPeriodOptions: { months: 1 | 3 | 6 | 12; label: string }[] = [
    { months: 1, label: '30 Tage (1 Monat)' },
    { months: 3, label: '3 Monate' },
    { months: 6, label: '6 Monate' },
    { months: 12, label: '12 Monate' },
];

const displayOverview = computed(() => liveOverview.value ?? props.serverOverview ?? null);

const page = usePage();
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean> | undefined) ?? {});
const showAboVerwalten = computed(
    () => !brandFeatures.value?.prepaid_balance && !props.canRenew,
);
const showRenewButton = computed(
    () => props.renewUrl && (props.canRenew || brandFeatures.value?.prepaid_balance === true),
);

let overviewPollInterval: ReturnType<typeof setInterval> | null = null;

function fetchOverview() {
    if (!props.gameServerAccount.identifier) return;
    fetch(`/gaming-accounts/${props.gameServerAccount.id}/overview`, {
        method: 'GET',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.serverOverview !== undefined) {
                liveOverview.value = data.serverOverview;
            }
        })
        .catch(() => {});
}

onMounted(() => {
    fetchOverview();
    overviewPollInterval = setInterval(fetchOverview, 3000);
});
onUnmounted(() => {
    if (overviewPollInterval) clearInterval(overviewPollInterval);
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
    { title: props.gameServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
}

function formatCpu(cpu: number): string {
    if (cpu === 0) return '∞';
    return `${Number(cpu).toFixed(1)}%`;
}

function displayStatus(overview: ServerOverview | null): string {
    if (overview?.suspended) return 'Gesperrt';
    if (overview?.is_installing) return 'Installation';
    if (overview?.status) {
        const s = overview.status.toLowerCase();
        if (s === 'running' || s === 'started') return 'Online';
        if (s === 'stopped' || s === 'offline') return 'Offline';
        return overview.status;
    }
    return props.gameServerAccount.status;
}

function statusVariant(overview: ServerOverview | null): 'success' | 'default' | 'error' {
    if (overview?.suspended) return 'error';
    const s = overview?.status?.toLowerCase() ?? props.gameServerAccount.status?.toLowerCase();
    if (s === 'running' || s === 'started') return 'success';
    return 'default';
}

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

function sendPower(action: 'start' | 'stop' | 'restart') {
    powerLoading.value = action;
    router.post(`/gaming-accounts/${props.gameServerAccount.id}/power`, { action }, {
        preserveScroll: true,
        onSuccess: () => {
            notify.success('Befehl gesendet.');
            powerLoading.value = null;
        },
        onError: (errors) => {
            notify.error(errors?.action ?? 'Aktion fehlgeschlagen.');
            powerLoading.value = null;
        },
        onFinish: () => {
            powerLoading.value = null;
        },
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="gameServerAccount.name" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <!-- Sidebar (wie Domains) -->
            <div class="lg:col-span-1">
                <Card class="rounded-lg p-4">
                    <div class="border-b pb-3 text-center">
                        <div class="mb-3 flex items-center justify-between">
                            <Badge :variant="statusVariant(displayOverview)" class="gap-1">
                                <span
                                    v-if="statusVariant(displayOverview) === 'success'"
                                    class="relative flex h-1.5 w-1.5"
                                >
                                    <span
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
                                    />
                                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                </span>
                                {{ displayStatus(displayOverview) }}
                            </Badge>
                        </div>
                        <div class="flex justify-center text-muted-foreground">
                            <Server class="h-12 w-12" />
                        </div>
                        <Heading level="h5" class="mt-2">Game Server</Heading>
                        <Text class="mt-0.5 text-sm" muted>{{ gameServerAccount.name }}</Text>
                        <Text class="mt-0.5 text-xs" muted>{{ gameServerAccount.hosting_plan.name }}</Text>
                        <div class="mt-3 rounded-lg border bg-muted/40 px-3 py-2 text-center">
                            <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Läuft bis</span>
                            </div>
                            <div class="mt-0.5 text-sm font-semibold">{{ formatDate(gameServerAccount.current_period_ends_at) }}</div>
                            <div v-if="gameServerAccount.cancel_at_period_end" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
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
                        <Link v-else-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                            <Button class="w-full justify-start gap-2">
                                <ExternalLink class="h-4 w-4" />
                                Zum Pterodactyl-Panel
                            </Button>
                        </Link>
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
                        <Link v-if="showAboVerwalten" href="/billing/subscriptions">
                            <Button variant="outline" class="w-full justify-start gap-2">
                                Abo verwalten
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <!-- Hauptbereich: Tabs -->
            <div class="lg:col-span-3">
                <Card
                    v-if="!loginUrl && gameServerAccount.status === 'pending'"
                    class="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                >
                    <CardContent class="pt-6">
                        <Text>
                            Ihr Game-Server wird eingerichtet, oder für das zugehörige Hosting-Paket ist im Admin kein
                            Pterodactyl-Panel-Server hinterlegt. Bitte im Admin unter Hosting-Pakete beim betreffenden
                            Paket einen Panel-Server angeben bzw. uns kontaktieren.
                        </Text>
                    </CardContent>
                </Card>

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
                        <TabsTrigger value="password" class="gap-2 px-3 py-2">
                            <KeyRound class="h-4 w-4" />
                            <span class="hidden sm:inline">Passwort</span>
                        </TabsTrigger>
                        <TabsTrigger value="rename" class="gap-2 px-3 py-2">
                            <Pencil class="h-4 w-4" />
                            <span class="hidden sm:inline">Umbenennen</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" class="mt-0">
                        <div class="grid gap-4 md:grid-cols-2">
                            <!-- Informationen (wie Domain-Übersicht) -->
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informationen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableHead class="w-36 font-medium">Server-Name</TableHead>
                                                <TableCell>{{ displayOverview?.name ?? gameServerAccount.name }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">IP & Port</TableHead>
                                                <TableCell class="font-mono text-sm">
                                                    {{ displayOverview?.allocation ?? '—' }}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Status</TableHead>
                                                <TableCell>
                                                    <Badge :variant="statusVariant(displayOverview)">
                                                        {{ displayStatus(displayOverview) }}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow v-if="gameServerAccount.identifier">
                                                <TableHead class="font-medium">Identifier</TableHead>
                                                <TableCell class="flex items-center gap-1">
                                                    <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{{
                                                        gameServerAccount.identifier
                                                    }}</code>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        class="h-7 w-7"
                                                        title="Kopieren"
                                                        @click="copyToClipboard(gameServerAccount.identifier!)"
                                                    >
                                                        <Copy class="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <!-- Power & Abo -->
                            <Card>
                                <CardHeader>
                                    <CardTitle>Steuerung & Abo</CardTitle>
                                    <CardDescription v-if="displayOverview?.can_power">
                                        Start, Stop und Neustart des Game-Servers.
                                    </CardDescription>
                                    <CardDescription v-else>
                                        Power-Steuerung im Panel oder Client-API nicht verfügbar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <div
                                        v-if="isSuspendedOrExpired"
                                        class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                                    >
                                        Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie, um die Steuerung wieder zu nutzen.
                                    </div>
                                    <div v-else-if="displayOverview?.can_power" class="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            class="bg-green-600 hover:bg-green-700"
                                            :disabled="!!powerLoading"
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
                                            :disabled="!!powerLoading"
                                            @click="sendPower('restart')"
                                        >
                                            <Loader2
                                                v-if="powerLoading === 'restart'"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            <RotateCw v-else class="mr-2 h-4 w-4" />
                                            Neustart
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            :disabled="!!powerLoading"
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
                                    <!-- Abo-Infos nur bei Abo (nicht bei Prepaid/Verlängerung) -->
                                    <dl v-if="!canRenew" class="grid gap-2 text-sm">
                                        <div class="flex justify-between py-2 border-b">
                                            <dt class="text-muted-foreground">Nächste Verlängerung</dt>
                                            <dd>{{ formatDate(gameServerAccount.current_period_ends_at) }}</dd>
                                        </div>
                                        <div class="flex justify-between py-2">
                                            <span class="text-muted-foreground">Kündigung zum Periodenende</span>
                                            <Badge v-if="gameServerAccount.cancel_at_period_end" variant="default">
                                                Ja
                                            </Badge>
                                            <span v-else>Nein</span>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </div>

                        <!-- Ressourcen (CPU, RAM, Disk) – Live-Aktualisierung alle 3 s -->
                        <Card class="mt-4">
                            <CardHeader>
                                <CardTitle>Ressourcen</CardTitle>
                                <CardDescription>
                                    Nutzung von CPU, Arbeitsspeicher und Festplatte (Live-Aktualisierung).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    v-if="displayOverview"
                                    class="grid grid-cols-1 gap-4 sm:grid-cols-3"
                                >
                                    <div class="rounded-lg border bg-muted/30 p-4">
                                        <p class="text-xs text-muted-foreground">CPU</p>
                                        <p class="text-xl font-semibold">
                                            {{ formatCpu(displayOverview.usage.cpu_absolute) }}
                                            <span class="text-sm font-normal text-muted-foreground">
                                                / {{ formatCpu(displayOverview.limits.cpu) }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="rounded-lg border bg-muted/30 p-4">
                                        <p class="text-xs text-muted-foreground">RAM</p>
                                        <p class="text-xl font-semibold">
                                            {{ formatBytes(displayOverview.usage.memory_bytes) }}
                                            <span class="text-sm font-normal text-muted-foreground">
                                                / {{ formatBytes(displayOverview.limits.memory * 1024 * 1024) }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="rounded-lg border bg-muted/30 p-4">
                                        <p class="text-xs text-muted-foreground">Disk</p>
                                        <p class="text-xl font-semibold">
                                            {{ formatBytes(displayOverview.usage.disk_bytes) }}
                                            <span class="text-sm font-normal text-muted-foreground">
                                                / {{ formatBytes(displayOverview.limits.disk * 1024 * 1024) }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <p v-else class="text-sm text-muted-foreground">
                                    Live-Daten werden vom Panel geladen. Seite neu laden oder im Panel prüfen.
                                </p>
                            </CardContent>
                        </Card>

                        <!-- Netzwerk (Inbound / Outbound) – Live-Aktualisierung -->
                        <Card class="mt-4">
                            <CardHeader>
                                <CardTitle>Netzwerk</CardTitle>
                                <CardDescription>
                                    Inbound- und Outbound-Datenverbrauch (Live-Aktualisierung).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    v-if="displayOverview"
                                    class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                >
                                    <div class="rounded-lg border bg-muted/30 p-4">
                                        <p class="text-xs text-muted-foreground">Inbound</p>
                                        <p class="text-lg font-semibold">
                                            {{ formatBytes(displayOverview.usage.network_rx_bytes) }}
                                        </p>
                                    </div>
                                    <div class="rounded-lg border bg-muted/30 p-4">
                                        <p class="text-xs text-muted-foreground">Outbound</p>
                                        <p class="text-lg font-semibold">
                                            {{ formatBytes(displayOverview.usage.network_tx_bytes) }}
                                        </p>
                                    </div>
                                </div>
                                <p v-else class="text-sm text-muted-foreground">
                                    Live-Daten werden vom Panel geladen. Seite neu laden oder im Panel prüfen.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="access" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Zugangsdaten</CardTitle>
                                <CardDescription>
                                    Server-Name, Identifier und E-Mail für die Anmeldung im Pterodactyl-Panel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">Server-Name</label>
                                        <div class="flex gap-2">
                                            <Input
                                                :model-value="gameServerAccount.name"
                                                readonly
                                                class="font-mono bg-muted"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                title="Kopieren"
                                                @click="copyToClipboard(gameServerAccount.name)"
                                            >
                                                <Copy class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium">Server-ID (Identifier)</label>
                                        <div class="flex gap-2">
                                            <Input
                                                :model-value="gameServerAccount.identifier ?? '—'"
                                                readonly
                                                class="font-mono bg-muted"
                                            />
                                            <Button
                                                v-if="gameServerAccount.identifier"
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                title="Kopieren"
                                                @click="copyToClipboard(gameServerAccount.identifier)"
                                            >
                                                <Copy class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">E-Mail-Adresse</label>
                                    <div class="flex gap-2">
                                        <Input :model-value="userEmail" readonly class="font-mono bg-muted" />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            title="Kopieren"
                                            @click="copyToClipboard(userEmail)"
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div class="pt-2">
                                    <a
                                        v-if="loginUrl && !isSuspendedOrExpired"
                                        :href="loginUrl"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center justify-center w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
                                    >
                                        <ExternalLink class="mr-2 h-4 w-4" />
                                        Im Panel anmelden
                                    </a>
                                    <p v-else-if="isSuspendedOrExpired" class="text-sm text-muted-foreground">
                                        Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Passwort</CardTitle>
                                <CardDescription>
                                    Ihr Panel-Passwort wurde bei der Einrichtung gesetzt. Sie können es im
                                    Pterodactyl-Panel unter „Zugangsdaten“ oder „Passwort“ anzeigen und ändern.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                                    <Button>
                                        <ExternalLink class="mr-2 h-4 w-4" />
                                        Panel öffnen (Passwort verwalten)
                                    </Button>
                                </Link>
                                <Text v-else-if="isSuspendedOrExpired" class="text-muted-foreground">
                                    Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
                                </Text>
                                <Text v-else class="text-muted-foreground">
                                    Sobald der Server aktiv ist, können Sie sich im Panel anmelden und dort das
                                    Passwort verwalten.
                                </Text>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rename" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Server umbenennen</CardTitle>
                                <CardDescription>
                                    Den Anzeigenamen Ihres Servers können Sie im Pterodactyl-Panel unter Einstellungen
                                    ändern. Die Änderung gilt im Panel und hier in der Übersicht.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div class="mb-4 space-y-2">
                                    <label class="text-sm font-medium">Aktueller Name</label>
                                    <Input :model-value="gameServerAccount.name" readonly class="bg-muted" />
                                </div>
                                <Link v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline">
                                        <Pencil class="mr-2 h-4 w-4" />
                                        Im Panel umbenennen
                                    </Button>
                                </Link>
                                <Text v-else-if="isSuspendedOrExpired" class="text-muted-foreground">
                                    Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
                                </Text>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <PaymentMethodModal
            v-if="showRenewButton"
            :open="renewModalOpen"
            :amount="renewalAmount"
            title="Verlängerung bezahlen"
            description="Game-Server verlängern."
            :can-pay-with-balance="canPayWithBalance"
            :customer-balance="customerBalance"
            :submit-url="renewUrl"
            :period-options="renewalPeriodOptions"
            :base-amount-per-month="renewalAmount"
            @update:open="renewModalOpen = $event"
        />
    </AppLayout>
</template>
