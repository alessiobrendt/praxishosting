<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import {
    Copy,
    ExternalLink,
    Globe,
    Pencil,
    LayoutDashboard,
    Terminal,
    FolderOpen,
    Archive,
    Calendar,
    Power,
    PowerOff,
    RotateCcw,
    Loader2,
    Cpu,
    HardDrive,
    MemoryStick,
    Network,
} from 'lucide-vue-next';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import AutoRenewModal from '@/components/AutoRenewModal.vue';
import PaymentMethodModal from '@/components/PaymentMethodModal.vue';
import GamingAccountSidebar from '@/components/gaming-accounts/GamingAccountSidebar.vue';
import GamingAccountOverviewTab from '@/components/gaming-accounts/GamingAccountOverviewTab.vue';
import GamingAccountAccessTab from '@/components/gaming-accounts/GamingAccountAccessTab.vue';
import GamingAccountPasswordTab from '@/components/gaming-accounts/GamingAccountPasswordTab.vue';
import GamingAccountRenameTab from '@/components/gaming-accounts/GamingAccountRenameTab.vue';
import GamingAccountConsoleTab from '@/components/gaming-accounts/GamingAccountConsoleTab.vue';
import GamingAccountFilesTab from '@/components/gaming-accounts/GamingAccountFilesTab.vue';
import GamingAccountBackupsTab from '@/components/gaming-accounts/GamingAccountBackupsTab.vue';
import GamingAccountSchedulesTab from '@/components/gaming-accounts/GamingAccountSchedulesTab.vue';
import Alert from '@/components/ui/alert/Alert.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import {
    copyToClipboard as copyToClipboardUtil,
    formatBytes,
    formatCpu,
    displayStatus,
    statusVariant,
} from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import gamingAccounts, { autoRenewBalance, autoRenewMollieSubscription } from '@/routes/gaming-accounts';
import type { BreadcrumbItem } from '@/types';

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    identifier: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan?: { name: string };
    allocation?: { subdomain?: string; [key: string]: unknown };
};

type GameserverCloudSubscription = {
    id: number;
    current_period_ends_at: string | null;
    cancel_at_period_end?: boolean;
    plan: { name: string };
    remaining_cpu?: number;
    remaining_memory_mb?: number;
    remaining_disk_mb?: number;
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
    auto_renew_with_balance?: boolean;
    has_mollie_subscription?: boolean;
    gameserverCloudSubscription?: GameserverCloudSubscription | null;
    cloudSubscriptionUrl?: string | null;
    cloudResourcesUpdateUrl?: string | null;
    domainsSearchUrl?: string | null;
    connectDomainShowUrl?: string | null;
    subdomainCheckUrl?: string | null;
    subdomainUpdateUrl?: string | null;
    subdomainSuffix?: string | null;
    currentSubdomainPart?: string | null;
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
    gameserverCloudSubscription: null,
    cloudSubscriptionUrl: null,
    cloudResourcesUpdateUrl: null,
    domainsSearchUrl: null,
    connectDomainShowUrl: null,
    subdomainCheckUrl: null,
    subdomainUpdateUrl: null,
    subdomainSuffix: null,
    currentSubdomainPart: null,
});

const subdomainPart = ref('');
const subdomainCheckResult = ref<{ available?: boolean; error?: string; message?: string } | null>(null);
const subdomainCheckLoading = ref(false);
const subdomainUpdateLoading = ref(false);

function initSubdomainPart() {
    subdomainPart.value = props.currentSubdomainPart ?? '';
}

function checkSubdomainAvailability() {
    const part = subdomainPart.value.trim().toLowerCase();
    if (!part || !props.subdomainCheckUrl) return;
    if (!/^[a-z0-9-]+$/.test(part) || part.length > 32) {
        subdomainCheckResult.value = { available: false, error: 'Nur Kleinbuchstaben, Ziffern und Bindestriche (max. 32 Zeichen).' };
        return;
    }
    subdomainCheckLoading.value = true;
    subdomainCheckResult.value = null;
    fetch(`${props.subdomainCheckUrl}?subdomain=${encodeURIComponent(part)}`, {
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
    })
        .then((res) => res.json())
        .then((data) => {
            subdomainCheckResult.value = data;
        })
        .catch(() => {
            subdomainCheckResult.value = { available: false, error: 'Prüfung fehlgeschlagen.' };
        })
        .finally(() => {
            subdomainCheckLoading.value = false;
        });
}

function submitSubdomainChange() {
    const part = subdomainPart.value.trim().toLowerCase();
    if (!part || !props.subdomainUpdateUrl) return;
    if (!/^[a-z0-9-]+$/.test(part) || part.length > 32) return;
    subdomainUpdateLoading.value = true;
    router.put(props.subdomainUpdateUrl, { subdomain: part }, {
        preserveScroll: true,
        onFinish: () => { subdomainUpdateLoading.value = false; },
    });
}

const powerLoading = ref<string | null>(null);
const liveOverview = ref<ServerOverview | null>(props.serverOverview ?? null);
const renewModalOpen = ref(false);
const autoRenewModalOpen = ref(false);

const currentAllocation = computed(() => {
    const a = props.gameServerAccount.allocation;
    if (!a || typeof a !== 'object') return { cpu: 0, memory_mb: 512, disk_mb: 1024 };
    return {
        cpu: typeof a.cpu === 'number' ? a.cpu : 0,
        memory_mb: typeof a.memory_mb === 'number' ? a.memory_mb : 512,
        disk_mb: typeof a.disk_mb === 'number' ? a.disk_mb : 1024,
    };
});

const resourcesMax = computed(() => {
    const sub = props.gameserverCloudSubscription;
    if (!sub) return { cpu: 0, memory_mb: 512, disk_mb: 1024 };
    const cur = currentAllocation.value;
    return {
        cpu: cur.cpu + (sub.remaining_cpu ?? 0),
        memory_mb: cur.memory_mb + (sub.remaining_memory_mb ?? 0),
        disk_mb: cur.disk_mb + (sub.remaining_disk_mb ?? 0),
    };
});

const resourcesForm = ref({
    cpu: 0,
    memory_mb: 512,
    disk_mb: 1024,
});
const resourcesSubmitting = ref(false);

function initResourcesForm() {
    const cur = currentAllocation.value;
    resourcesForm.value = { cpu: cur.cpu, memory_mb: cur.memory_mb, disk_mb: cur.disk_mb };
}

function submitResources() {
    if (!props.cloudResourcesUpdateUrl) return;
    resourcesSubmitting.value = true;
    router.put(props.cloudResourcesUpdateUrl, {
        cpu: resourcesForm.value.cpu,
        memory_mb: resourcesForm.value.memory_mb,
        disk_mb: resourcesForm.value.disk_mb,
    }, {
        preserveScroll: true,
        onFinish: () => { resourcesSubmitting.value = false; },
    });
}

const renewalPeriodOptions: { months: 1 | 3 | 6 | 12; label: string }[] = [
    { months: 1, label: '30 Tage (1 Monat)' },
    { months: 3, label: '3 Monate' },
    { months: 6, label: '6 Monate' },
    { months: 12, label: '12 Monate' },
];

const displayOverview = computed(() => liveOverview.value ?? props.serverOverview ?? null);

const isCloudAccount = computed(() => !!props.gameserverCloudSubscription);
const planLabel = computed(() =>
    isCloudAccount.value && props.gameserverCloudSubscription
        ? props.gameserverCloudSubscription.plan.name
        : props.gameServerAccount.hosting_plan?.name ?? '',
);
const periodEnd = computed(() =>
    isCloudAccount.value && props.gameserverCloudSubscription
        ? props.gameserverCloudSubscription.current_period_ends_at
        : props.gameServerAccount.current_period_ends_at,
);
const cancelAtPeriodEnd = computed(
    () =>
        (isCloudAccount.value && props.gameserverCloudSubscription?.cancel_at_period_end) ||
        props.gameServerAccount.cancel_at_period_end,
);

const page = usePage();
const flash = computed(() => (page.props.flash as { error?: string; success?: string }) ?? {});
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean> | undefined) ?? {});
const showAboVerwalten = computed(
    () =>
        !isCloudAccount.value &&
        !brandFeatures.value?.prepaid_balance &&
        !props.canRenew,
);
const showRenewButton = computed(
    () =>
        !isCloudAccount.value &&
        !!props.renewUrl &&
        (props.canRenew || brandFeatures.value?.prepaid_balance === true),
);
const showAutoRenewButton = computed(
    () => showRenewButton.value && brandFeatures.value?.prepaid_balance === true,
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
    if (props.cloudResourcesUpdateUrl) {
        initResourcesForm();
    }
    if (props.subdomainUpdateUrl) {
        initSubdomainPart();
    }
});
onUnmounted(() => {
    if (overviewPollInterval) clearInterval(overviewPollInterval);
});

const DOMAIN_HINT_STORAGE_KEY = 'gameserver-domain-hint-dismissed';
const domainHintDismissed = ref(
    typeof localStorage !== 'undefined' && localStorage.getItem(DOMAIN_HINT_STORAGE_KEY) === '1',
);
function dismissDomainHint() {
    domainHintDismissed.value = true;
    try {
        localStorage.setItem(DOMAIN_HINT_STORAGE_KEY, '1');
    } catch {
        // ignore
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
    { title: props.gameServerAccount.name, href: '#' },
];

function copyToClipboard(text: string) {
    copyToClipboardUtil(text);
    notify.success('In die Zwischenablage kopiert.');
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

function sendPower(action: 'start' | 'stop' | 'restart' | 'kill') {
    powerLoading.value = action;
    const previousOverview = liveOverview.value ?? props.serverOverview;
    if (previousOverview && (action === 'stop' || action === 'restart' || action === 'kill')) {
        liveOverview.value = { ...previousOverview, status: 'stopping' };
    } else if (previousOverview && action === 'start') {
        liveOverview.value = { ...previousOverview, status: 'starting' };
    }
    router.post(gamingAccounts.power.url(props.gameServerAccount.id), { action }, {
        preserveScroll: true,
        onSuccess: () => {
            notify.success('Befehl gesendet.');
            powerLoading.value = null;
            fetchOverview();
        },
        onError: (errors) => {
            notify.error(errors?.action ?? 'Aktion fehlgeschlagen.');
            powerLoading.value = null;
            liveOverview.value = props.serverOverview ?? null;
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
            <div class="lg:col-span-1">
                <GamingAccountSidebar
                    :game-server-account="gameServerAccount"
                    :plan-label="planLabel"
                    :period-end="periodEnd"
                    :login-url="loginUrl"
                    :display-overview="displayOverview"
                    :is-suspended-or-expired="isSuspendedOrExpired"
                    :show-renew-button="showRenewButton"
                    :show-auto-renew-button="showAutoRenewButton"
                    :show-abo-verwalten="showAboVerwalten"
                    :is-cloud-account="isCloudAccount"
                    :cloud-subscription-url="cloudSubscriptionUrl"
                    :cancel-at-period-end="cancelAtPeriodEnd"
                    @renew-click="renewModalOpen = true"
                    @auto-renew-click="autoRenewModalOpen = true"
                />
            </div>

            <!-- Hauptbereich: Header, Stats, Tabs -->
            <div class="lg:col-span-3">
                <div
                    v-if="flash.success"
                    class="mb-4 rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
                >
                    {{ flash.success }}
                </div>
                <div
                    v-if="flash.error"
                    class="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {{ flash.error }}
                </div>
                <Alert
                    v-if="(domainsSearchUrl || connectDomainShowUrl) && !domainHintDismissed"
                    variant="info"
                    dismissible
                    class="mb-4"
                    @dismiss="dismissDomainHint"
                >
                    <p class="text-sm">
                        Mit einer eigenen Domain wirkt dein Server professioneller – z. B. mc.deinedomain.de
                        <Link
                            v-if="domainsSearchUrl"
                            :href="domainsSearchUrl"
                            class="ml-1 font-medium underline underline-offset-2"
                        >
                            Domain finden
                        </Link>
                        <template v-if="domainsSearchUrl && connectDomainShowUrl"> · </template>
                        <Link
                            v-if="connectDomainShowUrl"
                            :href="connectDomainShowUrl"
                            class="font-medium underline underline-offset-2"
                        >
                            Eigene Domain verbinden
                        </Link>
                    </p>
                </Alert>
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

                <!-- Header Card -->
                <Card class="mb-4">
                    <CardContent class="pt-6">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex min-w-[180px] flex-1 items-center gap-3">
                                <div
                                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15"
                                >
                                    <Power class="h-5 w-5 text-primary" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h2 class="break-words font-semibold">
                                        {{ displayOverview?.name ?? gameServerAccount.name }}
                                    </h2>
                                    <p class="break-words text-sm text-muted-foreground">{{ planLabel || 'Game Server' }}</p>
                                    <Badge
                                        :variant="statusVariant(displayOverview, gameServerAccount.status)"
                                        class="mt-1"
                                    >
                                        {{ displayStatus(displayOverview, gameServerAccount.status) }}
                                    </Badge>
                                </div>
                            </div>
                            <div
                                v-if="displayOverview?.allocation"
                                class="flex min-w-0 flex-1 flex-col items-center justify-center text-center"
                            >
                                <p class="text-xs text-muted-foreground">Server-Adresse</p>
                                <div class="mt-1 flex w-full max-w-sm items-center justify-center gap-2">
                                    <code class="min-w-0 flex-1 break-all rounded bg-muted px-2 py-1.5 text-left text-sm">
                                        {{ displayOverview.allocation }}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 shrink-0"
                                        @click="copyToClipboard(displayOverview!.allocation!)"
                                    >
                                        <Copy class="h-4 w-4" />
                                    </Button>
                                </div>
                                <div
                                    v-if="gameServerAccount.allocation?.subdomain"
                                    class="mt-2 flex w-full max-w-sm items-center justify-center gap-2"
                                >
                                    <code class="min-w-0 flex-1 break-all rounded bg-muted px-2 py-1.5 text-left text-sm">
                                        {{ gameServerAccount.allocation.subdomain }}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 shrink-0"
                                        @click="copyToClipboard(gameServerAccount.allocation!.subdomain!)"
                                    >
                                        <Copy class="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <div class="inline-flex overflow-hidden rounded-lg border">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        class="rounded-none border-0"
                                        :disabled="!!powerLoading"
                                        @click="sendPower('start')"
                                    >
                                        <Loader2
                                            v-if="powerLoading === 'start'"
                                            class="mr-1 h-4 w-4 animate-spin"
                                        />
                                        <Power v-else class="mr-1 h-4 w-4" />
                                        Start
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="rounded-none border-l"
                                        :disabled="!!powerLoading"
                                        @click="sendPower('restart')"
                                    >
                                        <Loader2
                                            v-if="powerLoading === 'restart'"
                                            class="mr-1 h-4 w-4 animate-spin"
                                        />
                                        <RotateCcw v-else class="mr-1 h-4 w-4" />
                                        Restart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="rounded-none border-l"
                                        :disabled="!!powerLoading"
                                        @click="sendPower('stop')"
                                    >
                                        <Loader2
                                            v-if="powerLoading === 'stop'"
                                            class="mr-1 h-4 w-4 animate-spin"
                                        />
                                        <PowerOff v-else class="mr-1 h-4 w-4" />
                                        Stop
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        class="rounded-none border-l"
                                        :disabled="!!powerLoading"
                                        @click="sendPower('kill')"
                                    >
                                        <Loader2
                                            v-if="powerLoading === 'kill'"
                                            class="mr-1 h-4 w-4 animate-spin"
                                        />
                                        Kill
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Stats Grid -->
                <div
                    v-if="displayOverview"
                    class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <Card>
                        <CardContent class="pt-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs text-muted-foreground">CPU</p>
                                    <p class="text-lg font-semibold">
                                        {{ formatCpu(displayOverview.usage?.cpu_absolute ?? 0) }}
                                    </p>
                                </div>
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15"
                                >
                                    <Cpu class="h-4 w-4 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="pt-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs text-muted-foreground">Memory</p>
                                    <p class="text-lg font-semibold">
                                        {{ formatBytes(displayOverview.usage?.memory_bytes ?? 0) }}
                                        <span
                                            v-if="displayOverview.limits?.memory"
                                            class="text-muted-foreground"
                                        >
                                            / {{ displayOverview.limits.memory }} MB
                                        </span>
                                    </p>
                                </div>
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15"
                                >
                                    <MemoryStick class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="pt-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs text-muted-foreground">Disk</p>
                                    <p class="text-lg font-semibold">
                                        {{ formatBytes(displayOverview.usage?.disk_bytes ?? 0) }}
                                        <span
                                            v-if="displayOverview.limits?.disk"
                                            class="text-muted-foreground"
                                        >
                                            / {{ (displayOverview.limits.disk / 1024).toFixed(1) }} GB
                                        </span>
                                    </p>
                                </div>
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15"
                                >
                                    <HardDrive class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="pt-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs text-muted-foreground">Network</p>
                                    <p class="text-sm font-semibold">
                                        <span class="text-emerald-600 dark:text-emerald-400">↓</span>
                                        {{ formatBytes(displayOverview.usage?.network_rx_bytes ?? 0) }}
                                        <span class="text-muted-foreground">/</span>
                                        <span class="text-sky-600 dark:text-sky-400">↑</span>
                                        {{ formatBytes(displayOverview.usage?.network_tx_bytes ?? 0) }}
                                    </p>
                                </div>
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15"
                                >
                                    <Network class="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs default-tab="console" class="w-full">
                    <TabsList class="mb-4 flex h-auto flex-wrap justify-start gap-1 rounded-lg bg-white p-1 dark:bg-muted/50">
                        <TabsTrigger value="console" class="gap-2 px-3 py-2">
                            <Terminal class="h-4 w-4" />
                            Konsole
                        </TabsTrigger>
                        <TabsTrigger value="files" class="gap-2 px-3 py-2">
                            <FolderOpen class="h-4 w-4" />
                            Dateien
                        </TabsTrigger>
                        <TabsTrigger value="backups" class="gap-2 px-3 py-2">
                            <Archive class="h-4 w-4" />
                            Backups
                        </TabsTrigger>
                        <TabsTrigger value="schedules" class="gap-2 px-3 py-2">
                            <Calendar class="h-4 w-4" />
                            Schedules
                        </TabsTrigger>
                        <TabsTrigger value="overview" class="gap-2 px-3 py-2">
                            <LayoutDashboard class="h-4 w-4" />
                            <span class="hidden sm:inline">Übersicht</span>
                        </TabsTrigger>
                        <TabsTrigger value="access" class="gap-2 px-3 py-2">
                            <ExternalLink class="h-4 w-4" />
                            <span class="hidden sm:inline">Zugang</span>
                        </TabsTrigger>
                        <TabsTrigger value="rename" class="gap-2 px-3 py-2">
                            <Pencil class="h-4 w-4" />
                            <span class="hidden sm:inline">Umbenennen</span>
                        </TabsTrigger>
                        <TabsTrigger
                            v-if="domainsSearchUrl || connectDomainShowUrl"
                            value="domain"
                            class="gap-2 px-3 py-2"
                        >
                            <Globe class="h-4 w-4" />
                            <span class="hidden sm:inline">Domain</span>
                        </TabsTrigger>
                        <TabsTrigger
                            v-if="isCloudAccount && cloudResourcesUpdateUrl && !isSuspendedOrExpired"
                            value="ressourcen"
                            class="gap-2 px-3 py-2"
                        >
                            <Cpu class="h-4 w-4" />
                            <span class="hidden sm:inline">Ressourcen</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="console" class="mt-0">
                        <GamingAccountConsoleTab :game-server-account-id="gameServerAccount.id" />
                    </TabsContent>

                    <TabsContent value="files" class="mt-0">
                        <GamingAccountFilesTab :game-server-account-id="gameServerAccount.id" />
                    </TabsContent>

                    <TabsContent value="backups" class="mt-0">
                        <GamingAccountBackupsTab :game-server-account-id="gameServerAccount.id" />
                    </TabsContent>

                    <TabsContent value="schedules" class="mt-0">
                        <GamingAccountSchedulesTab :game-server-account-id="gameServerAccount.id" />
                    </TabsContent>

                    <TabsContent value="overview" class="mt-0">
                        <GamingAccountOverviewTab
                            :game-server-account="gameServerAccount"
                            :display-overview="displayOverview"
                            :is-suspended-or-expired="isSuspendedOrExpired"
                            :can-renew="canRenew"
                            :power-loading="powerLoading"
                            :period-end="periodEnd"
                            :cancel-at-period-end="cancelAtPeriodEnd"
                            @send-power="sendPower"
                            @copy-to-clipboard="copyToClipboard"
                        />
                    </TabsContent>

                    <TabsContent value="access" class="mt-4">
                        <div class="space-y-4">
                            <GamingAccountAccessTab
                                :game-server-account="gameServerAccount"
                                :user-email="userEmail"
                                :login-url="loginUrl"
                                :is-suspended-or-expired="isSuspendedOrExpired"
                                @copy-to-clipboard="copyToClipboard"
                            />
                            <GamingAccountPasswordTab
                                :login-url="loginUrl"
                                :is-suspended-or-expired="isSuspendedOrExpired"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="rename" class="mt-4">
                        <GamingAccountRenameTab
                            :game-server-account="gameServerAccount"
                            :login-url="loginUrl"
                            :is-suspended-or-expired="isSuspendedOrExpired"
                        />
                    </TabsContent>

                    <TabsContent v-if="domainsSearchUrl || connectDomainShowUrl" value="domain" class="mt-4">
                        <div class="space-y-4">
                            <Card>
                                <CardContent class="pt-6">
                                    <p class="mb-4 text-sm text-muted-foreground">
                                        Mit einer eigenen Domain wirkt dein Server professioneller (z. B. mc.deinedomain.de).
                                        Gekaufte Domains können Sie mit wenigen Klicks auf diesen Server zeigen lassen.
                                    </p>
                                    <div class="flex flex-wrap gap-3">
                                        <Link v-if="domainsSearchUrl" :href="domainsSearchUrl">
                                            <Button variant="default" size="sm">
                                                Domain finden
                                            </Button>
                                        </Link>
                                        <Link v-if="connectDomainShowUrl" :href="connectDomainShowUrl">
                                            <Button variant="outline" size="sm">
                                                Eigene Domain verbinden
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card v-if="subdomainUpdateUrl && subdomainSuffix">
                                <CardContent class="pt-6">
                                    <h3 class="mb-2 font-semibold">Subdomain ändern</h3>
                                    <p class="mb-4 text-sm text-muted-foreground">
                                        Aktuelle Subdomain: {{ gameServerAccount.allocation?.subdomain ?? '—' }}
                                    </p>
                                    <div class="flex flex-wrap items-end gap-3">
                                        <div class="space-y-2">
                                            <Label for="subdomain-part">Neue Subdomain</Label>
                                            <div class="flex items-center gap-2">
                                                <Input
                                                    id="subdomain-part"
                                                    v-model="subdomainPart"
                                                    type="text"
                                                    placeholder="mein-server"
                                                    class="w-48"
                                                    maxlength="32"
                                                />
                                                <span class="text-sm text-muted-foreground">{{ subdomainSuffix }}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            :disabled="subdomainCheckLoading"
                                            @click="checkSubdomainAvailability"
                                        >
                                            <Loader2
                                                v-if="subdomainCheckLoading"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            Prüfen ob frei
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            :disabled="subdomainUpdateLoading || !subdomainPart.trim()"
                                            @click="submitSubdomainChange"
                                        >
                                            <Loader2
                                                v-if="subdomainUpdateLoading"
                                                class="mr-2 h-4 w-4 animate-spin"
                                            />
                                            Subdomain ändern
                                        </Button>
                                    </div>
                                    <p
                                        v-if="subdomainCheckResult"
                                        class="mt-3 text-sm"
                                        :class="subdomainCheckResult.available ? 'text-green-600 dark:text-green-400' : 'text-destructive'"
                                    >
                                        <template v-if="subdomainCheckResult.available">
                                            {{ subdomainCheckResult.message ?? 'Subdomain ist frei.' }}
                                        </template>
                                        <template v-else>
                                            {{ subdomainCheckResult.error ?? 'Subdomain ist vergeben.' }}
                                        </template>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent
                        v-if="isCloudAccount && cloudResourcesUpdateUrl && !isSuspendedOrExpired"
                        value="ressourcen"
                        class="mt-4"
                    >
                        <Card>
                            <CardContent class="pt-6">
                                <h3 class="mb-3 font-semibold">Ressourcen anpassen</h3>
                                <p class="mb-4 text-sm text-muted-foreground">
                                    CPU, RAM und Speicher innerhalb Ihres Abo-Kontingents anpassen.
                                </p>
                                <form
                                    class="flex flex-wrap items-end gap-4"
                                    @submit.prevent="submitResources"
                                >
                                    <div class="space-y-2">
                                        <Label for="resources-cpu">CPU (%)</Label>
                                        <Input
                                            id="resources-cpu"
                                            v-model.number="resourcesForm.cpu"
                                            type="number"
                                            :min="0"
                                            :max="resourcesMax.cpu"
                                            step="1"
                                            class="w-24"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="resources-memory">RAM (MB)</Label>
                                        <Input
                                            id="resources-memory"
                                            v-model.number="resourcesForm.memory_mb"
                                            type="number"
                                            :min="64"
                                            :max="resourcesMax.memory_mb"
                                            step="64"
                                            class="w-28"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="resources-disk">Speicher (MB)</Label>
                                        <Input
                                            id="resources-disk"
                                            v-model.number="resourcesForm.disk_mb"
                                            type="number"
                                            :min="256"
                                            :max="resourcesMax.disk_mb"
                                            step="256"
                                            class="w-28"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        :disabled="resourcesSubmitting"
                                    >
                                        <Loader2
                                            v-if="resourcesSubmitting"
                                            class="mr-2 h-4 w-4 animate-spin"
                                        />
                                        Übernehmen
                                    </Button>
                                </form>
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
        <AutoRenewModal
            v-if="showAutoRenewButton"
            :open="autoRenewModalOpen"
            :balance-url="autoRenewBalance.url(props.gameServerAccount.id)"
            :mollie-url="autoRenewMollieSubscription.url(props.gameServerAccount.id)"
            :mollie-cancel-url="gamingAccounts.subscription.cancel.url(props.gameServerAccount.id)"
            :auto-renew-with-balance="props.auto_renew_with_balance"
            :has-mollie-subscription="props.has_mollie_subscription"
            @update:open="autoRenewModalOpen = $event"
        />
    </AppLayout>
</template>
