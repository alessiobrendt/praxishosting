<script setup lang="ts">
import { Form, Head, Link, router, usePage } from '@inertiajs/vue3';
import { ref, computed, watch, onMounted } from 'vue';
import {
    Cloud,
    Server,
    Plus,
    RefreshCw,
    ArrowLeft,
    Cpu,
    HardDrive,
    MemoryStick,
    Calendar,
    Trash2,
    ExternalLink,
    Info,
    Zap,
    Gamepad2,
    Play,
    Square,
    RotateCw,
    Share2,
} from 'lucide-vue-next';
import ProductSharingCard from '@/components/product-sharing/ProductSharingCard.vue';
import Alert from '@/components/ui/alert/Alert.vue';
import InputError from '@/components/InputError.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { storeServer } from '@/actions/App/Http/Controllers/GameserverCloudSubscriptionController';
import AutoRenewModal from '@/components/AutoRenewModal.vue';
import PaymentMethodModal from '@/components/PaymentMethodModal.vue';
import { notify } from '@/composables/useNotify';

type GameServerAccount = {
    uuid: string;
    name: string;
    status: string;
    identifier: string | null;
    allocation: { cpu?: number; memory_mb?: number; disk_mb?: number } | null;
    nest_name?: string;
    egg_name?: string;
    server_status?: string;
};

type Egg = { id: number; name: string };

type Nest = { id: number; name: string; eggs: Egg[] };

type Subscription = {
    uuid: string;
    status: string;
    current_period_ends_at: string | null;
    created_at: string | null;
    plan: { id: number; name: string; price: string; config: Record<string, unknown> };
    nests?: Nest[];
    used_cpu: number;
    used_memory_mb: number;
    used_disk_mb: number;
    remaining_cpu: number;
    remaining_memory_mb: number;
    remaining_disk_mb: number;
    max_cpu?: number;
    max_memory_mb?: number;
    max_disk_gb?: number;
    total_cpu?: number;
    total_memory_mb?: number;
    total_disk_mb?: number;
    game_server_accounts: GameServerAccount[];
};

type Props = {
    subscription: Subscription;
    canPayWithBalance: boolean;
    customerBalance: number;
    renewUrl: string;
    auto_renew_with_balance: boolean;
    has_mollie_subscription: boolean;
    balanceUrl: string;
    mollieUrl: string;
    domainsSearchUrl?: string;
    canManageCollaborators?: boolean;
    productShares?: Array<{ id: number; user: { id: number; name: string; email: string } | null; permissions: string[]; update_url: string; destroy_url: string }>;
    productInvitations?: Array<{ id: number; email: string; permissions: string[]; expires_at: string | null; destroy_url: string }>;
    allowedSharePermissions?: string[];
    storeInvitationUrl?: string | null;
};

const props = withDefaults(defineProps<Props>(), {
    canManageCollaborators: false,
    productShares: () => [],
    productInvitations: () => [],
    allowedSharePermissions: () => [],
    storeInvitationUrl: null,
});

const hasAnySubdomain = computed(() =>
    props.subscription.game_server_accounts?.some((acc) => acc.allocation?.subdomain) ?? false,
);

const SUBSCRIPTION_DOMAIN_HINT_STORAGE_KEY = 'gameserver-subscription-domain-hint-dismissed';
const subscriptionDomainHintDismissed = ref(
    typeof localStorage !== 'undefined' && localStorage.getItem(SUBSCRIPTION_DOMAIN_HINT_STORAGE_KEY) === '1',
);
function dismissSubscriptionDomainHint() {
    subscriptionDomainHintDismissed.value = true;
    try {
        localStorage.setItem(SUBSCRIPTION_DOMAIN_HINT_STORAGE_KEY, '1');
    } catch {
        // ignore
    }
}

const renewModalOpen = ref(false);
const autoRenewModalOpen = ref(false);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gameserver Cloud', href: '/gaming/cloud' },
    { title: 'Meine Cloud-Abos', href: '/gaming/cloud/subscriptions' },
    { title: props.subscription.plan.name, href: '#' },
];

const showAddServerForm = ref(false);
const createServer = ref({
    name: '',
    custom_subdomain: '',
    nest_id: 0,
    egg_id: 0,
    memory_mb: 512,
    cpu: 50,
    disk_mb: 1024,
    environment: {} as Record<string, string>,
});
const createServerSubmitting = ref(false);
const createServerTimeoutMessage = ref('');

const page = usePage();
const flash = computed(() => (page.props.flash as { error?: string; success?: string }) ?? {});
const formErrors = computed(() => (page.props.errors as Record<string, string>) ?? {});

const nests = computed(() => props.subscription.nests ?? []);
const selectedNest = computed(() => nests.value.find((n) => n.id === createServer.value.nest_id));
const eggsForSelectedNest = computed(() => selectedNest.value?.eggs ?? []);
const subdomainSuffix = computed(
    () => (props.subscription.plan.config?.subdomain_suffix as string) || '.neroserv.cloud',
);

const selectedEgg = computed(() => eggsForSelectedNest.value.find((e) => e.id === createServer.value.egg_id));
const selectedEggName = computed(() => selectedEgg.value?.name ?? '');
const showHytaleFields = computed(() => selectedEggName.value.toLowerCase().includes('hytale'));
const showFiveMFields = computed(() => selectedEggName.value.toLowerCase().includes('fivem'));

type EggVariable = {
    id: number;
    name: string;
    env_variable: string;
    default_value: string;
    rules: string;
    user_viewable: boolean;
    user_editable: boolean;
    required_from_user: boolean;
    optional_from_user?: boolean;
    display_title?: string;
    display_description?: string;
    is_boolean?: boolean;
};
const eggVariables = ref<EggVariable[]>([]);

function isBooleanEnvValue(val: string | undefined): boolean {
    if (val === undefined || val === null) return false;
    const s = String(val).toLowerCase().trim();
    return s === '1' || s === 'true' || s === 'yes';
}

function setBooleanEnv(envVar: string, checked: boolean): void {
    createServer.value.environment[envVar] = checked ? '1' : '0';
}
const eggVariablesLoading = ref(false);

function eggVariablesUrl() {
    return `/gaming/cloud/subscriptions/${props.subscription.uuid}/egg-variables?nest_id=${createServer.value.nest_id}&egg_id=${createServer.value.egg_id}`;
}

async function fetchEggVariables() {
    if (createServer.value.nest_id < 1 || createServer.value.egg_id < 1) {
        eggVariables.value = [];
        return;
    }
    eggVariablesLoading.value = true;
    eggVariables.value = [];
    try {
        const res = await fetch(eggVariablesUrl(), {
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        });
        if (!res.ok) return;
        const data = (await res.json()) as { variables?: EggVariable[] };
        const vars = data.variables ?? [];
        eggVariables.value = vars;
        const env = { ...createServer.value.environment };
        for (const v of vars) {
            if (!v.env_variable) continue;
            if (env[v.env_variable] !== undefined && env[v.env_variable] !== '') continue;
            if (v.is_boolean) {
                env[v.env_variable] = isBooleanEnvValue(v.default_value) ? '1' : '0';
            } else {
                env[v.env_variable] = v.default_value ?? '';
            }
        }
        createServer.value.environment = env;
    } finally {
        eggVariablesLoading.value = false;
    }
}

const maxMemoryMb = computed(() => Math.max(512, props.subscription.remaining_memory_mb));
const maxCpu = computed(() => Math.max(50, props.subscription.remaining_cpu));
const maxDiskMb = computed(() => Math.max(1024, props.subscription.remaining_disk_mb));

function initAddServerForm() {
    const firstNest = nests.value[0];
    const firstEgg = firstNest?.eggs?.[0];
    const firstEggName = firstEgg?.name ?? '';
    const env: Record<string, string> = {};
    if (firstEggName.toLowerCase().includes('hytale')) {
        Object.assign(env, {
            AUTH_MODE: 'AUTHENTICATED',
            PATCHLINE: 'release',
            GAME_PROFILE: '',
            BOOT_COMMANDS: '',
            ENABLE_BACKUPS: '',
            DISABLE_SENTRY: '1',
            AUTOMATIC_UPDATE: '1',
        });
    }
    if (firstEggName.toLowerCase().includes('fivem')) {
        Object.assign(env, {
            FIVEM_LICENSE: '',
            FIVEM_FRAMEWORK: 'esx',
            MAX_PLAYERS: '48',
            SERVER_HOSTNAME: 'Mein FiveM Server',
            STEAM_WEBAPIKEY: '',
        });
    }
    createServer.value = {
        name: '',
        custom_subdomain: '',
        nest_id: firstNest?.id ?? 0,
        egg_id: firstEgg?.id ?? 0,
        memory_mb: Math.min(1024, maxMemoryMb.value),
        cpu: Math.min(100, maxCpu.value),
        disk_mb: Math.min(10240, maxDiskMb.value),
        environment: env,
    };
    if (createServer.value.nest_id && createServer.value.egg_id) {
        fetchEggVariables();
    } else {
        eggVariables.value = [];
    }
}

watch(
    () => createServer.value.nest_id,
    (newNestId) => {
        const nest = nests.value.find((n) => n.id === newNestId);
        const firstEgg = nest?.eggs?.[0];
        createServer.value.egg_id = firstEgg?.id ?? 0;
    },
    { immediate: false },
);

watch(
    () => [createServer.value.nest_id, createServer.value.egg_id] as const,
    ([nestId, eggId]) => {
        if (nestId && eggId) {
            fetchEggVariables();
        } else {
            eggVariables.value = [];
        }
    },
    { immediate: false },
);

onMounted(() => {
    if (flash.value.error || Object.keys(formErrors.value).length > 0) {
        showAddServerForm.value = true;
        initAddServerForm();
    }
});

watch(
    () => {
        if (flash.value.error) return flash.value.error;
        if (formErrors.value.allocation) return formErrors.value.allocation;
        const keys = Object.keys(formErrors.value);
        return keys.length > 0 ? formErrors.value[keys[0]] : null;
    },
    (message) => {
        if (message) notify.error(message, 6000);
    },
    { immediate: true },
);

function submitCreateServer() {
    const env = { ...createServer.value.environment };
    Object.keys(env).forEach((k) => {
        if (env[k] === '' || env[k] == null) delete env[k];
    });
    const payload = {
        name: createServer.value.name.trim() || undefined,
        custom_subdomain: createServer.value.custom_subdomain.trim() || undefined,
        nest_id: createServer.value.nest_id,
        egg_id: createServer.value.egg_id,
        cpu: createServer.value.cpu,
        memory_mb: createServer.value.memory_mb,
        disk_mb: createServer.value.disk_mb,
        environment: Object.keys(env).length ? env : undefined,
    };
    createServerSubmitting.value = true;
    createServerTimeoutMessage.value = '';
    const timeoutMs = 90000;
    const timeoutId = window.setTimeout(() => {
        if (createServerSubmitting.value) {
            createServerSubmitting.value = false;
            createServerTimeoutMessage.value =
                'Die Erstellung dauert ungewöhnlich lange. Prüfen Sie unter „Meine Gameserver“, ob der Server angelegt wurde, oder die Logs (z. B. Pterodactyl / Laravel).';
        }
    }, timeoutMs);
    router.post(storeServer.url({ subscription: props.subscription.uuid }), payload, {
        preserveScroll: true,
        onFinish: () => {
            window.clearTimeout(timeoutId);
            createServerSubmitting.value = false;
        },
        onSuccess: () => {
            showAddServerForm.value = false;
        },
    });
}

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
}

const totalCpu = computed(() => props.subscription.total_cpu ?? props.subscription.used_cpu + props.subscription.remaining_cpu);
const totalMemoryMb = computed(() => props.subscription.total_memory_mb ?? props.subscription.used_memory_mb + props.subscription.remaining_memory_mb);
const totalDiskMb = computed(() => props.subscription.total_disk_mb ?? props.subscription.used_disk_mb + props.subscription.remaining_disk_mb);
const totalMemoryGb = computed(() => (totalMemoryMb.value / 1024).toFixed(1));
const totalDiskGb = computed(() => (totalDiskMb.value / 1024).toFixed(1));
const usedMemoryGb = computed(() => (props.subscription.used_memory_mb / 1024).toFixed(1));
const usedDiskGb = computed(() => (props.subscription.used_disk_mb / 1024).toFixed(1));

const ramPercent = computed(() => (totalMemoryMb.value > 0 ? Math.round((props.subscription.used_memory_mb / totalMemoryMb.value) * 100) : 0));
const cpuPercent = computed(() => (totalCpu.value > 0 ? Math.round((props.subscription.used_cpu / totalCpu.value) * 100) : 0));
const diskPercent = computed(() => (totalDiskMb.value > 0 ? Math.round((props.subscription.used_disk_mb / totalDiskMb.value) * 100) : 0));

const canAddServer = computed(
    () =>
        props.subscription.status === 'active' &&
        (props.subscription.remaining_cpu > 0 || props.subscription.remaining_memory_mb > 0 || props.subscription.remaining_disk_mb > 0),
);

const renewPeriodOptions = [
    { months: 1, label: '1 Monat' },
    { months: 3, label: '3 Monate' },
    { months: 6, label: '6 Monate' },
    { months: 12, label: '12 Monate' },
];

function allocationLabel(acc: GameServerAccount): string {
    const a = acc.allocation;
    if (!a) return '–';
    const parts = [];
    if (a.memory_mb != null) parts.push(`${(a.memory_mb / 1024).toFixed(1)} GB`);
    if (a.cpu != null) parts.push(`${a.cpu}% CPU`);
    if (a.disk_mb != null) parts.push(`${(a.disk_mb / 1024).toFixed(1)} GB`);
    return parts.length ? parts.join(' · ') : '–';
}

function isServerOnline(acc: GameServerAccount): boolean {
    const s = (acc.server_status ?? '').toLowerCase();
    return s === 'running' || s === 'starting';
}

function sendPower(acc: GameServerAccount, action: 'start' | 'stop' | 'restart') {
    if (!acc.identifier) return;
    router.post(
        `/gaming/cloud/subscriptions/${props.subscription.uuid}/servers/${acc.uuid}/power`,
        { action },
        { preserveScroll: true },
    );
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Cloud-Abo: ${subscription.plan.name}`" />

        <div class="space-y-5 px-4 sm:px-6 lg:px-8 py-6">
            <!-- Top: Plan header card -->
            <Card class="overflow-hidden border border-border shadow-sm">
                <CardContent class="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div class="flex items-center gap-4">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Cloud class="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div class="mb-1.5 flex items-center gap-3">
                                <h1 class="m-0 text-lg font-bold">{{ subscription.plan.name }}</h1>
                                <Badge
                                    :variant="subscription.status === 'active' ? 'success' : 'secondary'"
                                    class="inline-flex items-center gap-1.5"
                                >
                                    <span
                                        v-if="subscription.status === 'active'"
                                        class="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
                                    />
                                    {{ subscription.status === 'active' ? 'Aktiv' : subscription.status }}
                                </Badge>
                            </div>
                            <div class="flex flex-wrap gap-1.5">
                                <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    <MemoryStick class="h-3 w-3 text-primary" />
                                    {{ totalMemoryGb }} GB RAM
                                </span>
                                <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    <Cpu class="h-3 w-3 text-primary" />
                                    {{ totalCpu }}% CPU
                                </span>
                                <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    <HardDrive class="h-3 w-3 text-primary" />
                                    {{ totalDiskGb }} GB Disk
                                </span>
                                <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    <Server class="h-3 w-3 text-primary" />
                                    {{ subscription.game_server_accounts.length }}/∞ Server
                                </span>
                                <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    <Calendar class="h-3 w-3 text-primary" />
                                    bis {{ formatDate(subscription.current_period_ends_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <Link href="/gaming/cloud/subscriptions">
                            <Button variant="outline" size="sm" class="gap-1.5">
                                <ArrowLeft class="h-4 w-4" />
                                Zurück
                            </Button>
                        </Link>
                        <Button
                            v-if="subscription.status === 'active'"
                            size="sm"
                            class="gap-1.5"
                            @click="renewModalOpen = true"
                        >
                            <RefreshCw class="h-4 w-4" />
                            Verlängern
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <!-- Left: Server list -->
                <div class="xl:col-span-2">
                    <Card class="overflow-hidden" id="servers">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 border-b px-5 py-3.5">
                            <div>
                                <CardTitle class="m-0 flex items-center gap-2 text-sm font-semibold">
                                    <Server class="h-4 w-4 text-primary" />
                                    Server
                                </CardTitle>
                                <CardDescription class="text-xs">
                                    {{ subscription.game_server_accounts.length }} aktiv
                                </CardDescription>
                            </div>
                            <Button
                                v-if="canAddServer && !showAddServerForm"
                                size="sm"
                                @click="showAddServerForm = true; initAddServerForm()"
                            >
                                <Plus class="mr-1.5 h-4 w-4" />
                                Server erstellen
                            </Button>
                            <Button
                                v-else-if="!canAddServer"
                                size="sm"
                                variant="secondary"
                                disabled
                                title="Nicht genug Ressourcen verfügbar"
                            >
                                <Plus class="mr-1.5 h-4 w-4" />
                                Server erstellen
                            </Button>
                            <Button v-else size="sm" variant="outline" @click="showAddServerForm = false">
                                Abbrechen
                            </Button>
                        </CardHeader>
                        <CardContent class="space-y-4 p-5">
                            <!-- Immer sichtbar: Flash nach Redirect + Timeout-Hinweis -->
                            <div
                                v-if="flash.error"
                                class="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            >
                                {{ flash.error }}
                            </div>
                            <div
                                v-if="formErrors.allocation"
                                class="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            >
                                {{ formErrors.allocation }}
                            </div>
                            <div
                                v-if="createServerTimeoutMessage"
                                class="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200"
                            >
                                {{ createServerTimeoutMessage }}
                            </div>
                            <div
                                v-if="flash.success"
                                class="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
                            >
                                {{ flash.success }}
                            </div>
                            <form
                                v-if="showAddServerForm"
                                class="space-y-4 rounded-xl border border-dashed border-border bg-muted/20 p-4"
                                @submit.prevent="submitCreateServer"
                            >
                                <div class="space-y-2">
                                    <Label for="serverName">Server Name</Label>
                                    <Input
                                        id="serverName"
                                        v-model="createServer.name"
                                        placeholder="Mein Gameserver (optional)"
                                        maxlength="255"
                                        class="w-full"
                                    />
                                    <p class="text-xs text-muted-foreground">Optional – wird automatisch generiert wenn leer</p>
                                    <InputError :message="formErrors.name" />
                                </div>

                                <div class="space-y-2">
                                    <Label for="customSubdomain">Subdomain</Label>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <Input
                                            id="customSubdomain"
                                            v-model="createServer.custom_subdomain"
                                            placeholder="mein-server"
                                            maxlength="32"
                                            class="flex-1 min-w-[120px]"
                                            :class="{ 'border-destructive': createServer.custom_subdomain && !/^[a-z0-9-]*$/.test(createServer.custom_subdomain) }"
                                        />
                                        <span class="text-sm text-muted-foreground">{{ subdomainSuffix }}</span>
                                    </div>
                                    <p class="text-xs text-muted-foreground">
                                        Leer lassen für automatische Generierung. Nur Kleinbuchstaben, Zahlen und Bindestriche.
                                    </p>
                                    <InputError :message="formErrors.custom_subdomain" />
                                </div>

                                <div class="grid gap-4 sm:grid-cols-2">
                                    <div class="space-y-2">
                                        <Label for="nestSelect">Spiel <span class="text-destructive">*</span></Label>
                                        <select
                                            id="nestSelect"
                                            v-model.number="createServer.nest_id"
                                            required
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        >
                                            <option :value="0">– Spiel wählen –</option>
                                            <option
                                                v-for="nest in nests"
                                                :key="nest.id"
                                                :value="nest.id"
                                            >
                                                {{ nest.name }}
                                            </option>
                                        </select>
                                        <InputError :message="formErrors.nest_id" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="eggSelect">Version <span class="text-destructive">*</span></Label>
                                        <select
                                            id="eggSelect"
                                            v-model.number="createServer.egg_id"
                                            required
                                            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            :disabled="!createServer.nest_id || eggsForSelectedNest.length === 0"
                                        >
                                            <option :value="0">– Version wählen –</option>
                                            <option
                                                v-for="egg in eggsForSelectedNest"
                                                :key="egg.id"
                                                :value="egg.id"
                                            >
                                                {{ egg.name }}
                                            </option>
                                        </select>
                                        <InputError :message="formErrors.egg_id" />
                                    </div>
                                </div>

                                <!-- Dynamic egg variables (from admin egg config) -->
                                <div
                                    v-if="eggVariablesLoading"
                                    class="rounded-lg border border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground"
                                >
                                    Lade Einstellungen …
                                </div>
                                <div
                                    v-else-if="eggVariables.length > 0"
                                    class="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
                                >
                                    <h6 class="flex items-center gap-2 text-sm font-semibold text-primary">
                                        <Gamepad2 class="h-4 w-4" />
                                        Egg-Einstellungen
                                    </h6>
                                    <p
                                        v-if="
                                            eggVariables.filter(
                                                (x) => x.required_from_user || x.optional_from_user
                                            ).length === 0
                                        "
                                        class="text-sm text-muted-foreground"
                                    >
                                        Alle Variablen werden durch uns vorbefüllt – keine Angaben nötig.
                                    </p>
                                    <div
                                        v-else
                                        class="grid gap-4 sm:grid-cols-2"
                                    >
                                        <div
                                            v-for="v in eggVariables.filter(
                                                (x) => x.required_from_user || x.optional_from_user
                                            )"
                                            :key="v.id"
                                            class="space-y-2"
                                        >
                                            <Label :for="`env_${v.env_variable}`">
                                                {{ v.display_title ?? v.name }}
                                                <Badge
                                                    v-if="v.required_from_user"
                                                    variant="error"
                                                    size="sm"
                                                    class="ml-1"
                                                >
                                                    Erforderlich
                                                </Badge>
                                                <Badge
                                                    v-else-if="v.optional_from_user"
                                                    variant="secondary"
                                                    class="ml-1 text-xs"
                                                >
                                                    Optional
                                                </Badge>
                                            </Label>
                                            <p
                                                v-if="v.display_description"
                                                class="mb-1 text-xs text-muted-foreground"
                                            >
                                                {{ v.display_description }}
                                            </p>
                                            <template v-if="v.is_boolean">
                                                <label class="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        :id="`env_${v.env_variable}`"
                                                        type="checkbox"
                                                        :checked="isBooleanEnvValue(createServer.environment[v.env_variable])"
                                                        class="h-4 w-4 rounded border-input"
                                                        @change="
                                                            setBooleanEnv(
                                                                v.env_variable,
                                                                (($event.target as HTMLInputElement).checked)
                                                            )
                                                        "
                                                    />
                                                    <span class="text-sm">Aktivieren</span>
                                                </label>
                                            </template>
                                            <Input
                                                v-else
                                                :id="`env_${v.env_variable}`"
                                                v-model="createServer.environment[v.env_variable]"
                                                :placeholder="v.default_value"
                                                class="w-full"
                                            />
                                            <InputError :message="formErrors[`environment.${v.env_variable}`]" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Hytale (fallback when no egg variables from API) -->
                                <div
                                    v-if="showHytaleFields && eggVariables.length === 0"
                                    class="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
                                >
                                    <h6 class="flex items-center gap-2 text-sm font-semibold text-primary">
                                        <Gamepad2 class="h-4 w-4" />
                                        Hytale Einstellungen
                                    </h6>
                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div class="space-y-2">
                                            <Label for="authMode">Authentifizierung</Label>
                                            <select
                                                id="authMode"
                                                v-model="createServer.environment.AUTH_MODE"
                                                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            >
                                                <option value="AUTHENTICATED">Authenticated (Empfohlen)</option>
                                                <option value="OFFLINE">Offline</option>
                                                <option value="INSECURE">Insecure</option>
                                            </select>
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="patchline">Update Channel</Label>
                                            <select
                                                id="patchline"
                                                v-model="createServer.environment.PATCHLINE"
                                                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            >
                                                <option value="release">Release (Stabil)</option>
                                                <option value="beta">Beta</option>
                                                <option value="experimental">Experimental</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="gameProfile">Game Profile (optional)</Label>
                                        <Input
                                            id="gameProfile"
                                            v-model="createServer.environment.GAME_PROFILE"
                                            placeholder="Leer lassen für Default-Profil"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="bootCommands">Boot Commands (optional)</Label>
                                        <textarea
                                            id="bootCommands"
                                            v-model="createServer.environment.BOOT_COMMANDS"
                                            rows="2"
                                            placeholder="say Server gestartet, whitelist add Player1"
                                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                class="rounded border-input"
                                                :checked="createServer.environment.ENABLE_BACKUPS === '1'"
                                                @change="createServer.environment.ENABLE_BACKUPS = ($event.target as HTMLInputElement).checked ? '1' : ''"
                                            />
                                            Automatische Backups aktivieren
                                        </label>
                                        <label class="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                class="rounded border-input"
                                                :checked="createServer.environment.DISABLE_SENTRY === '1'"
                                                @change="createServer.environment.DISABLE_SENTRY = ($event.target as HTMLInputElement).checked ? '1' : ''"
                                            />
                                            Crash-Reporting deaktivieren (empfohlen für Development)
                                        </label>
                                        <label class="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                class="rounded border-input"
                                                :checked="createServer.environment.AUTOMATIC_UPDATE === '1'"
                                                @change="createServer.environment.AUTOMATIC_UPDATE = ($event.target as HTMLInputElement).checked ? '1' : ''"
                                            />
                                            Automatische Updates
                                        </label>
                                    </div>
                                </div>

                                <!-- FiveM (fallback when no egg variables from API) -->
                                <div
                                    v-if="showFiveMFields && eggVariables.length === 0"
                                    class="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
                                >
                                    <h6 class="flex items-center gap-2 text-sm font-semibold text-amber-600">
                                        <Gamepad2 class="h-4 w-4" />
                                        FiveM Einstellungen
                                    </h6>
                                    <div class="space-y-2">
                                        <Label for="fivem_license">
                                            CFX.re License Key
                                            <Badge variant="error" size="sm" class="ml-1">Erforderlich</Badge>
                                        </Label>
                                        <Input
                                            id="fivem_license"
                                            v-model="createServer.environment.FIVEM_LICENSE"
                                            placeholder="cfxk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXXXX"
                                            class="w-full"
                                        />
                                        <p class="text-xs text-muted-foreground">
                                            Kostenlosen Key auf
                                            <a
                                                href="https://keymaster.fivem.net"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-primary underline"
                                            >keymaster.fivem.net</a>
                                            registrieren.
                                        </p>
                                        <InputError :message="formErrors['environment.FIVEM_LICENSE']" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label>FiveM Framework (optional)</Label>
                                        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-3 text-center text-sm transition-colors"
                                                :class="(createServer.environment.FIVEM_FRAMEWORK ?? '') === 'vanilla' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30 hover:bg-muted/50'"
                                                @click="createServer.environment.FIVEM_FRAMEWORK = 'vanilla'"
                                            >
                                                Vanilla
                                            </button>
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-3 text-center text-sm transition-colors"
                                                :class="(createServer.environment.FIVEM_FRAMEWORK ?? 'esx') === 'esx' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30 hover:bg-muted/50'"
                                                @click="createServer.environment.FIVEM_FRAMEWORK = 'esx'"
                                            >
                                                ESX Legacy
                                            </button>
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-3 text-center text-sm transition-colors"
                                                :class="(createServer.environment.FIVEM_FRAMEWORK ?? '') === 'qbcore' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30 hover:bg-muted/50'"
                                                @click="createServer.environment.FIVEM_FRAMEWORK = 'qbcore'"
                                            >
                                                QBCore
                                            </button>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <Label>Max. Spieler</Label>
                                        <div class="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-2 text-sm"
                                                :class="(createServer.environment.MAX_PLAYERS ?? '') === '32' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30'"
                                                @click="createServer.environment.MAX_PLAYERS = '32'"
                                            >
                                                32
                                            </button>
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-2 text-sm"
                                                :class="(createServer.environment.MAX_PLAYERS ?? '48') === '48' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30'"
                                                @click="createServer.environment.MAX_PLAYERS = '48'"
                                            >
                                                48
                                            </button>
                                            <button
                                                type="button"
                                                class="rounded-lg border-2 p-2 text-sm"
                                                :class="(createServer.environment.MAX_PLAYERS ?? '') === '128' ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/30'"
                                                @click="createServer.environment.MAX_PLAYERS = '128'"
                                            >
                                                128
                                            </button>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="server_hostname">Server Hostname (Anzeigename)</Label>
                                        <Input
                                            id="server_hostname"
                                            v-model="createServer.environment.SERVER_HOSTNAME"
                                            placeholder="Mein FiveM Roleplay Server"
                                        />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="steam_webapikey">Steam Web API Key (optional)</Label>
                                        <Input
                                            id="steam_webapikey"
                                            v-model="createServer.environment.STEAM_WEBAPIKEY"
                                            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div class="grid gap-4 sm:grid-cols-3">
                                    <div class="space-y-2">
                                        <Label for="memory">RAM (MB) <span class="text-destructive">*</span></Label>
                                        <Input
                                            id="memory"
                                            v-model.number="createServer.memory_mb"
                                            type="number"
                                            :min="512"
                                            :max="maxMemoryMb"
                                            required
                                        />
                                        <p class="text-xs text-muted-foreground">
                                            Verfügbar: {{ maxMemoryMb.toLocaleString('de-DE') }} MB (Min: 512)
                                        </p>
                                        <InputError :message="formErrors.memory_mb" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="cpu">CPU (%) <span class="text-destructive">*</span></Label>
                                        <Input
                                            id="cpu"
                                            v-model.number="createServer.cpu"
                                            type="number"
                                            :min="50"
                                            :max="maxCpu"
                                            required
                                        />
                                        <p class="text-xs text-muted-foreground">
                                            Verfügbar: {{ maxCpu }}% (Min: 50%)
                                        </p>
                                        <InputError :message="formErrors.cpu" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="disk">Speicher (MB) <span class="text-destructive">*</span></Label>
                                        <Input
                                            id="disk"
                                            v-model.number="createServer.disk_mb"
                                            type="number"
                                            :min="1024"
                                            :max="maxDiskMb"
                                            required
                                        />
                                        <p class="text-xs text-muted-foreground">
                                            Verfügbar: {{ maxDiskMb.toLocaleString('de-DE') }} MB (Min: 1024)
                                        </p>
                                        <InputError :message="formErrors.disk_mb" />
                                    </div>
                                </div>

                                <div class="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                                    <span class="text-destructive">*</span> = Pflichtfeld. Du kannst das Spiel und die Ressourcen später anpassen, solange die Cloud genug Kapazität hat.
                                </div>

                                <div class="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        @click="showAddServerForm = false"
                                    >
                                        Abbrechen
                                    </Button>
                                    <Button
                                        type="submit"
                                        :disabled="createServerSubmitting || !createServer.nest_id || !createServer.egg_id || (showFiveMFields && !createServer.environment.FIVEM_LICENSE?.trim())"
                                    >
                                        {{ createServerSubmitting ? 'Wird erstellt…' : 'Server erstellen' }}
                                    </Button>
                                </div>
                            </form>

                            <Alert
                                v-if="hasAnySubdomain && domainsSearchUrl && !subscriptionDomainHintDismissed"
                                variant="info"
                                dismissible
                                class="mb-3"
                                @dismiss="dismissSubscriptionDomainHint"
                            >
                                <p class="text-sm">
                                    Eigene Domain für Ihren Server?
                                    <Link :href="domainsSearchUrl" class="ml-1 font-medium underline underline-offset-2">
                                        Domain finden
                                    </Link>
                                </p>
                            </Alert>
                            <div
                                v-if="subscription.game_server_accounts.length === 0 && !showAddServerForm"
                                class="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground"
                            >
                                Noch keine Server angelegt. Klicken Sie auf „Server erstellen“, um einen Game-Server aus Ihrem Pool anzulegen.
                            </div>
                            <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <Card
                                    v-for="acc in subscription.game_server_accounts"
                                    :key="acc.uuid"
                                    class="overflow-hidden border-l-4 border-l-primary"
                                >
                                    <CardContent class="p-4">
                                        <div class="mb-2.5 flex justify-between items-start gap-2">
                                            <div class="flex min-w-0 items-center gap-2.5">
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <Server class="h-5 w-5 text-primary" />
                                                </div>
                                                <div class="min-w-0">
                                                    <h6 class="truncate text-sm font-bold">{{ acc.name || 'Server' }}</h6>
                                                    <span class="text-xs text-muted-foreground">
                                                        {{ acc.nest_name ?? '—' }} · {{ acc.egg_name ?? '—' }}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge
                                                :variant="isServerOnline(acc) ? 'success' : 'error'"
                                                class="shrink-0"
                                            >
                                                {{ isServerOnline(acc) ? 'Online' : 'Offline' }}
                                            </Badge>
                                        </div>
                                        <div class="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                            <span v-if="acc.allocation?.memory_mb" class="inline-flex items-center gap-1">
                                                <MemoryStick class="h-3 w-3" />
                                                {{ (acc.allocation.memory_mb / 1024).toFixed(1) }} GB
                                            </span>
                                            <span v-if="acc.allocation?.cpu" class="inline-flex items-center gap-1">
                                                <Cpu class="h-3 w-3" />
                                                {{ acc.allocation.cpu }}% CPU
                                            </span>
                                            <span v-if="acc.allocation?.disk_mb" class="inline-flex items-center gap-1">
                                                <HardDrive class="h-3 w-3" />
                                                {{ (acc.allocation.disk_mb / 1024).toFixed(1) }} GB
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap items-center justify-between gap-2">
                                            <div class="flex gap-1">
                                                <Button
                                                    v-if="acc.identifier"
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    class="h-8 w-8 p-0"
                                                    title="Starten"
                                                    @click="sendPower(acc, 'start')"
                                                >
                                                    <Play class="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    v-if="acc.identifier"
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    class="h-8 w-8 p-0"
                                                    title="Neustart"
                                                    @click="sendPower(acc, 'restart')"
                                                >
                                                    <RotateCw class="h-4 w-4 text-amber-600" />
                                                </Button>
                                                <Button
                                                    v-if="acc.identifier"
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    class="h-8 w-8 p-0"
                                                    title="Stoppen"
                                                    @click="sendPower(acc, 'stop')"
                                                >
                                                    <Square class="h-4 w-4 text-destructive" />
                                                </Button>
                                                <Form
                                                    method="delete"
                                                    :action="`/gaming/cloud/subscriptions/${subscription.uuid}/servers/${acc.uuid}`"
                                                    class="inline"
                                                    :data="{}"
                                                >
                                                    <Button type="submit" variant="ghost" size="sm" class="text-destructive h-8 w-8 p-0" title="Löschen">
                                                        <Trash2 class="h-4 w-4" />
                                                    </Button>
                                                </Form>
                                            </div>
                                            <Link :href="`/gaming-accounts/${acc.uuid}`">
                                                <Button size="sm" class="gap-1">
                                                    <ExternalLink class="h-3.5 w-3.5" />
                                                    Verwalten
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Right: Sidebar -->
                <div class="space-y-4">
                    <!-- Details -->
                    <Card class="overflow-hidden">
                        <CardHeader class="border-b px-5 py-3.5">
                            <CardTitle class="m-0 flex items-center gap-2 text-sm font-semibold">
                                <Info class="h-4 w-4 text-primary" />
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2.5 px-5 py-4">
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-muted-foreground">Erstellt am</span>
                                <span class="text-xs font-semibold">{{ formatDate(subscription.created_at) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-muted-foreground">Läuft ab</span>
                                <span class="text-xs font-semibold" :class="subscription.current_period_ends_at ? 'text-destructive' : ''">
                                    {{ formatDate(subscription.current_period_ends_at) }}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Schnellaktionen -->
                    <Card class="overflow-hidden">
                        <CardHeader class="border-b px-5 py-3.5">
                            <CardTitle class="m-0 flex items-center gap-2 text-sm font-semibold">
                                <Zap class="h-4 w-4 text-primary" />
                                Schnellaktionen
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-2 px-4 py-3 pb-4">
                            <Button
                                v-if="canAddServer && !showAddServerForm"
                                variant="default"
                                class="w-full gap-2"
                                @click="showAddServerForm = true; initAddServerForm()"
                            >
                                <Plus class="h-4 w-4" />
                                Neuen Server erstellen
                            </Button>
                            <Button
                                v-else-if="!canAddServer"
                                variant="secondary"
                                class="w-full gap-2"
                                disabled
                                title="Nicht genug Ressourcen"
                            >
                                <Plus class="h-4 w-4" />
                                Neuen Server erstellen
                            </Button>
                            <div
                                v-if="subscription.game_server_accounts.length > 0"
                                class="flex gap-2"
                            >
                                <Form
                                    method="post"
                                    :action="`/gaming/cloud/subscriptions/${subscription.uuid}/servers/power-all`"
                                    :data="{ action: 'start_all' }"
                                    class="flex-1"
                                >
                                    <Button type="submit" variant="outline" size="sm" class="w-full gap-1.5 text-green-600">
                                        <Play class="h-4 w-4" />
                                        Alle starten
                                    </Button>
                                </Form>
                                <Form
                                    method="post"
                                    :action="`/gaming/cloud/subscriptions/${subscription.uuid}/servers/power-all`"
                                    :data="{ action: 'stop_all' }"
                                    class="flex-1"
                                >
                                    <Button type="submit" variant="outline" size="sm" class="w-full gap-1.5 text-destructive">
                                        <Square class="h-4 w-4" />
                                        Alle stoppen
                                    </Button>
                                </Form>
                            </div>
                            <Button
                                v-if="subscription.status === 'active'"
                                variant="default"
                                type="button"
                                class="w-full justify-start gap-2"
                                @click="renewModalOpen = true"
                            >
                                <RefreshCw class="h-4 w-4" />
                                Verlängern
                            </Button>
                            <Button
                                v-if="subscription.status === 'active'"
                                variant="outline"
                                type="button"
                                class="w-full justify-start gap-2"
                                @click="autoRenewModalOpen = true"
                            >
                                <RefreshCw class="h-4 w-4" />
                                Auto Renew
                            </Button>
                            <Link href="/gaming/cloud/subscriptions" class="block">
                                <Button variant="outline" class="w-full gap-2">
                                    <ArrowLeft class="h-4 w-4" />
                                    Zur Cloud-Abos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <!-- Server compact list -->
                    <Card class="overflow-hidden">
                        <CardHeader class="border-b px-5 py-3.5">
                            <CardTitle class="m-0 flex items-center gap-2 text-sm font-semibold">
                                <Server class="h-4 w-4 text-primary" />
                                Server
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-1 px-5 py-3">
                            <div
                                v-for="acc in subscription.game_server_accounts"
                                :key="acc.uuid"
                                class="flex items-center gap-2.5 border-b border-border py-2 last:border-0"
                            >
                                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Server class="h-4 w-4 text-primary" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <span class="block truncate text-xs font-semibold">{{ acc.name || 'Server' }}</span>
                                    <span class="block truncate text-xs text-muted-foreground">{{ acc.nest_name ?? '—' }} · {{ acc.egg_name ?? '—' }}</span>
                                    <span class="text-xs" :class="isServerOnline(acc) ? 'text-green-600' : 'text-red-600 dark:text-red-400'">
                                        {{ isServerOnline(acc) ? 'Online' : 'Offline' }}
                                    </span>
                                </div>
                                <Link :href="`/gaming-accounts/${acc.uuid}`">
                                    <Button variant="ghost" size="sm" class="h-8 w-8 shrink-0 p-0">
                                        <ExternalLink class="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <p v-if="subscription.game_server_accounts.length === 0" class="py-2 text-xs text-muted-foreground">
                                Keine Server
                            </p>
                        </CardContent>
                    </Card>

                    <ProductSharingCard
                        v-if="canManageCollaborators"
                        :product-shares="productShares"
                        :product-invitations="productInvitations"
                        :allowed-share-permissions="allowedSharePermissions"
                        :store-invitation-url="storeInvitationUrl ?? ''"
                    />
                </div>
            </div>

            <PaymentMethodModal
                v-if="subscription.status === 'active'"
                :open="renewModalOpen"
                :amount="0"
                title="Verlängerung bezahlen"
                description="Gameserver Cloud verlängern."
                :can-pay-with-balance="canPayWithBalance"
                :customer-balance="customerBalance"
                :submit-url="renewUrl"
                :period-options="renewPeriodOptions"
                :base-amount-per-month="parseFloat(subscription.plan.price) || 0"
                @update:open="renewModalOpen = $event"
            />
            <AutoRenewModal
                v-if="subscription.status === 'active'"
                :open="autoRenewModalOpen"
                :balance-url="balanceUrl"
                :mollie-url="mollieUrl"
                :auto-renew-with-balance="auto_renew_with_balance"
                :has-mollie-subscription="has_mollie_subscription"
                @update:open="autoRenewModalOpen = $event"
            />
        </div>
    </AppLayout>
</template>
