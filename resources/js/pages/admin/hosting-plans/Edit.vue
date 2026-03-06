<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed, watch, onMounted } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    brand_id: number | null;
    hosting_server_id: number | null;
    panel_type: string;
    config: Record<string, unknown> | null;
    name: string;
    plesk_package_name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
    stripe_price_id: string | null;
    is_active: boolean;
    sort_order: number;
};

type PanelTypeOption = { value: string; label: string };

type PterodactylServer = { id: number; name: string; hostname: string };

type PterodactylOption = { id: number; name: string };

type PlanOptionChoice = { value: string; label: string; price_delta?: number };

type PlanOption = {
    id: string;
    name: string;
    type: 'free' | 'choice' | 'text' | 'range_slider' | 'select';
    price_per_unit: number;
    sort_order: number;
    choices?: PlanOptionChoice[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    source?: 'pterodactyl_nests' | 'pterodactyl_eggs';
    placeholder?: string;
    max_length?: number;
};

type AvailableOptionId = { value: string; label: string };

type Props = {
    hostingPlan: HostingPlan;
    allowedPanelTypes: PanelTypeOption[];
    pterodactylHostingServers: PterodactylServer[];
    teamspeakHostingServers: PterodactylServer[];
    availableOptionIdsPterodactyl: AvailableOptionId[];
    availableOptionIdsPlesk: AvailableOptionId[];
    availableOptionIdsTeamspeak: AvailableOptionId[];
};

const props = withDefaults(defineProps<Props>(), {
    teamspeakHostingServers: () => [],
    availableOptionIdsTeamspeak: () => [],
});

function normalizePlanOptions(raw: unknown): PlanOption[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item: Record<string, unknown>, index: number) => {
        const choices = Array.isArray(item.choices)
            ? (item.choices as Record<string, unknown>[]).map((c) => ({
                  value: String(c.value ?? ''),
                  label: String(c.label ?? ''),
                  price_delta: typeof c.price_delta === 'number' ? c.price_delta : 0,
              }))
            : [];
        return {
            id: String(item.id ?? ''),
            name: String(item.name ?? ''),
            type: (['free', 'choice', 'text', 'range_slider', 'select'].includes(String(item.type)) ? item.type : 'free') as PlanOption['type'],
            price_per_unit: Number(item.price_per_unit ?? 0),
            sort_order: typeof item.sort_order === 'number' ? item.sort_order : index,
            choices: choices.length ? choices : undefined,
            min: item.min !== undefined && item.min !== null && item.min !== '' ? Number(item.min) : undefined,
            max: item.max !== undefined && item.max !== null && item.max !== '' ? Number(item.max) : undefined,
            step: item.step !== undefined && item.step !== null && item.step !== '' ? Number(item.step) : undefined,
            unit: item.unit != null && item.unit !== '' ? String(item.unit) : undefined,
            source: item.source === 'pterodactyl_nests' || item.source === 'pterodactyl_eggs' ? item.source : undefined,
            placeholder: item.placeholder ? String(item.placeholder) : undefined,
            max_length: typeof item.max_length === 'number' ? item.max_length : undefined,
        };
    });
}

function normalizeConfig(c: Record<string, unknown> | null): Record<string, unknown> {
    const raw = c ?? {};
    const locIds = raw.location_ids;
    const pr = raw.port_range;
    return {
        ...raw,
        nest_id: raw.nest_id ?? '',
        egg_id: raw.egg_id ?? '',
        location_ids: Array.isArray(locIds) ? locIds : (locIds ? [Number(locIds)] : []),
        node: raw.node ?? '',
        memory: String(raw.memory ?? '512'),
        swap: String(raw.swap ?? '0'),
        disk: String(raw.disk ?? '5120'),
        io: String(raw.io ?? '500'),
        cpu: String(raw.cpu ?? '0'),
        cpu_pinning: String(raw.cpu_pinning ?? ''),
        databases: String(raw.databases ?? '0'),
        backups: String(raw.backups ?? '0'),
        additional_allocations: String(raw.additional_allocations ?? '0'),
        port_array: String(raw.port_array ?? ''),
        port_range: Array.isArray(pr) ? pr : (pr ? [String(pr)] : []),
        allow_egg_selection_override: Boolean(raw.allow_egg_selection_override),
        skip_scripts: Boolean(raw.skip_scripts),
        dedicated_ip: Boolean(raw.dedicated_ip),
        start_on_completion: raw.start_on_completion !== false,
        oom_killer: Boolean(raw.oom_killer),
        plan_options: normalizePlanOptions(raw.plan_options),
    };
}

const isActive = ref(props.hostingPlan.is_active);
const panelType = ref(props.hostingPlan.panel_type ?? 'plesk');
const config = ref<Record<string, unknown>>(normalizeConfig(props.hostingPlan.config));
const hostingServerId = ref(String(props.hostingPlan.hosting_server_id ?? ''));
const loadingOptions = ref(false);
const pterodactylOptions = ref<{
    locations: PterodactylOption[];
    nodes: PterodactylOption[];
    nests: PterodactylOption[];
    eggs: PterodactylOption[];
}>({ locations: [], nodes: [], nests: [], eggs: [] });

const showPleskFields = computed(() => panelType.value === 'plesk');
const showPterodactylFields = computed(() => panelType.value === 'pterodactyl');
const showTeamspeakFields = computed(() => panelType.value === 'teamspeak');

const availableOptionIds = computed((): AvailableOptionId[] => {
    if (panelType.value === 'pterodactyl') return props.availableOptionIdsPterodactyl;
    if (panelType.value === 'teamspeak') return props.availableOptionIdsTeamspeak;
    return props.availableOptionIdsPlesk;
});

const planOptions = computed({
    get: () => (config.value.plan_options as PlanOption[]) ?? [],
    set: (val: PlanOption[]) => {
        config.value.plan_options = val;
    },
});

function addPlanOption() {
    const opts = (config.value.plan_options as PlanOption[]) ?? [];
    opts.push({
        id: '',
        name: '',
        type: 'free',
        price_per_unit: 0,
        sort_order: opts.length,
    });
    config.value.plan_options = opts;
}

function removePlanOption(index: number) {
    const opts = [...(config.value.plan_options as PlanOption[])];
    opts.splice(index, 1);
    config.value.plan_options = opts;
}

function movePlanOption(index: number, direction: -1 | 1) {
    const opts = [...(config.value.plan_options as PlanOption[])];
    const ni = index + direction;
    if (ni < 0 || ni >= opts.length) return;
    [opts[index], opts[ni]] = [opts[ni], opts[index]];
    opts.forEach((o, i) => (o.sort_order = i));
    config.value.plan_options = opts;
}

function addChoice(opt: PlanOption) {
    const choices = opt.choices ?? [];
    choices.push({ value: '', label: '', price_delta: 0 });
    opt.choices = choices;
}

function removeChoice(opt: PlanOption, idx: number) {
    const choices = opt.choices ?? [];
    choices.splice(idx, 1);
    opt.choices = choices.length ? choices : undefined;
}

async function fetchPterodactylOptions(nestId?: number) {
    const sid = hostingServerId.value ? Number(hostingServerId.value) : 0;
    if (sid < 1) return;
    loadingOptions.value = true;
    try {
        const url = new URL('/admin/hosting-plans/pterodactyl-options', window.location.origin);
        url.searchParams.set('hosting_server_id', String(sid));
        if (nestId && nestId > 0) url.searchParams.set('nest_id', String(nestId));
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        pterodactylOptions.value = {
            locations: data.locations ?? [],
            nodes: data.nodes ?? [],
            nests: data.nests ?? [],
            eggs: data.eggs ?? [],
        };
    } finally {
        loadingOptions.value = false;
    }
}

function onServerChange() {
    config.value.nest_id = '';
    config.value.egg_id = '';
    config.value.location_ids = [];
    config.value.node = '';
    pterodactylOptions.value = { locations: [], nodes: [], nests: [], eggs: [] };
    if (hostingServerId.value) fetchPterodactylOptions();
}

function onNestChange() {
    const nestId = config.value.nest_id ? Number(config.value.nest_id) : 0;
    config.value.egg_id = '';
    if (nestId > 0 && hostingServerId.value) fetchPterodactylOptions(nestId);
    else pterodactylOptions.value.eggs = [];
}

function refreshOptions() {
    const nestId = config.value.nest_id ? Number(config.value.nest_id) : 0;
    if (hostingServerId.value) fetchPterodactylOptions(nestId);
}

const portRangeInput = ref('');
function addPortRange() {
    const v = portRangeInput.value.trim();
    if (v) {
        (config.value.port_range as string[]).push(v);
        portRangeInput.value = '';
    }
}

watch(hostingServerId, (val) => {
    if (val && showPterodactylFields.value) fetchPterodactylOptions();
});

onMounted(() => {
    if (showPterodactylFields.value && hostingServerId.value) {
        const nestId = config.value.nest_id ? Number(config.value.nest_id) : 0;
        fetchPterodactylOptions(nestId);
    }
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Pakete', href: '/admin/hosting-plans' },
    { title: props.hostingPlan.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`${hostingPlan.name} bearbeiten`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">{{ hostingPlan.name }} bearbeiten</Heading>
                <Text v-if="hostingPlan.panel_type === 'plesk'" class="mt-2" muted>
                    Plesk-Paket: {{ hostingPlan.plesk_package_name }}
                </Text>
                <Text v-else class="mt-2" muted>
                    Pterodactyl Game-Server-Paket
                </Text>
            </div>

            <Form
                :action="`/admin/hosting-plans/${hostingPlan.id}`"
                method="post"
                class="block"
                v-slot="{ errors }"
            >
                <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card class="max-w-2xl xl:max-w-none">
                        <CardHeader>
                            <CardTitle>Paket-Details</CardTitle>
                            <CardDescription>Name, Panel-Typ und Limits (Plesk: Paketname + Webspace-Limits; Pterodactyl: Nest/Egg + Ressourcen)</CardDescription>
                        </CardHeader>
                    <CardContent class="space-y-4">
                        <input type="hidden" name="_method" value="PUT" />
                        <div class="space-y-2">
                            <Label for="panel_type">Panel-Typ *</Label>
                            <Select
                                id="panel_type"
                                name="panel_type"
                                v-model="panelType"
                                required
                            >
                                <option
                                    v-for="opt in allowedPanelTypes"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </Select>
                            <InputError :message="errors.panel_type" />
                        </div>
                        <div class="space-y-2">
                            <Label for="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                :model-value="hostingPlan.name"
                                :aria-invalid="!!errors.name"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div v-if="showPleskFields" class="space-y-2">
                            <Label for="plesk_package_name">Plesk-Paketname (Paket-ID) *</Label>
                            <Input
                                id="plesk_package_name"
                                name="plesk_package_name"
                                required
                                :model-value="hostingPlan.plesk_package_name"
                                :aria-invalid="!!errors.plesk_package_name"
                            />
                            <InputError :message="errors.plesk_package_name" />
                        </div>
                        <template v-if="showTeamspeakFields">
                            <input type="hidden" name="plesk_package_name" value="" />
                            <div class="space-y-2">
                                <Label for="hosting_server_id_ts" class="mb-0">Panel-Server (TeamSpeak) *</Label>
                                <Select
                                    id="hosting_server_id_ts"
                                    name="hosting_server_id"
                                    v-model="hostingServerId"
                                    :aria-invalid="!!errors.hosting_server_id"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option
                                        v-for="s in teamspeakHostingServers"
                                        :key="s.id"
                                        :value="String(s.id)"
                                    >
                                        {{ s.name }} ({{ s.hostname }})
                                    </option>
                                </Select>
                                <InputError :message="errors.hosting_server_id" />
                                <p class="text-sm text-muted-foreground">
                                    Option „Slots“ als Bereichs-Slider in den Paket-Optionen verwenden.
                                </p>
                            </div>
                        </template>
                        <template v-if="showPterodactylFields">
                            <input type="hidden" name="plesk_package_name" value="" />
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <Label for="hosting_server_id" class="mb-0">Panel-Server (Pterodactyl) *</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        :disabled="!hostingServerId || loadingOptions"
                                        @click="refreshOptions"
                                    >
                                        {{ loadingOptions ? 'Laden…' : 'Optionen aktualisieren' }}
                                    </Button>
                                </div>
                                <Select
                                    id="hosting_server_id"
                                    name="hosting_server_id"
                                    v-model="hostingServerId"
                                    :aria-invalid="!!errors.hosting_server_id"
                                    @change="onServerChange"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option
                                        v-for="s in pterodactylHostingServers"
                                        :key="s.id"
                                        :value="String(s.id)"
                                    >
                                        {{ s.name }} ({{ s.hostname }})
                                    </option>
                                </Select>
                                <InputError :message="errors.hosting_server_id" />
                                <p class="text-sm text-muted-foreground">
                                    Nach Änderung ggf. „Optionen aktualisieren“ klicken.
                                </p>
                            </div>
                            <div class="space-y-2">
                                <Label for="config_nest_id">Nest *</Label>
                                <Select
                                    id="config_nest_id"
                                    name="config[nest_id]"
                                    v-model="config.nest_id"
                                    required
                                    :aria-invalid="!!errors['config.nest_id']"
                                    @change="onNestChange"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option
                                        v-for="n in pterodactylOptions.nests"
                                        :key="n.id"
                                        :value="String(n.id)"
                                    >
                                        {{ n.name }}
                                    </option>
                                </Select>
                                <InputError :message="errors['config.nest_id']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_egg_id">Default Egg *</Label>
                                <Select
                                    id="config_egg_id"
                                    name="config[egg_id]"
                                    v-model="config.egg_id"
                                    required
                                    :aria-invalid="!!errors['config.egg_id']"
                                >
                                    <option value="">Bitte Nest wählen</option>
                                    <option
                                        v-for="e in pterodactylOptions.eggs"
                                        :key="e.id"
                                        :value="String(e.id)"
                                    >
                                        {{ e.name }}
                                    </option>
                                </Select>
                                <InputError :message="errors['config.egg_id']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_location_ids">Location(s)</Label>
                                <select
                                    id="config_location_ids"
                                    name="config[location_ids][]"
                                    multiple
                                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm min-h-[80px]"
                                    v-model="config.location_ids"
                                >
                                    <option
                                        v-for="loc in pterodactylOptions.locations"
                                        :key="loc.id"
                                        :value="loc.id"
                                    >
                                        {{ loc.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <Label for="config_node">Node</Label>
                                <Select
                                    id="config_node"
                                    name="config[node]"
                                    v-model="config.node"
                                >
                                    <option value="">Automatisch</option>
                                    <option
                                        v-for="n in pterodactylOptions.nodes"
                                        :key="n.id"
                                        :value="String(n.id)"
                                    >
                                        {{ n.name }}
                                    </option>
                                </Select>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div class="space-y-2">
                                    <Label for="config_memory">RAM (MiB) *</Label>
                                    <Input id="config_memory" name="config[memory]" type="number" min="0" v-model="config.memory" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_swap">Swap (MiB)</Label>
                                    <Input id="config_swap" name="config[swap]" type="number" min="-1" v-model="config.swap" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_disk">Disk (MiB) *</Label>
                                    <Input id="config_disk" name="config[disk]" type="number" min="0" v-model="config.disk" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_io">IO Weight</Label>
                                    <Input id="config_io" name="config[io]" type="number" min="0" v-model="config.io" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_cpu">CPU (%) *</Label>
                                    <Input id="config_cpu" name="config[cpu]" type="number" min="0" v-model="config.cpu" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_cpu_pinning">CPU Pinning</Label>
                                    <Input id="config_cpu_pinning" name="config[cpu_pinning]" v-model="config.cpu_pinning" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_databases">Databases</Label>
                                    <Input id="config_databases" name="config[databases]" type="number" min="0" v-model="config.databases" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_backups">Backups</Label>
                                    <Input id="config_backups" name="config[backups]" type="number" min="0" v-model="config.backups" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_additional_allocations">Additional Allocations</Label>
                                    <Input id="config_additional_allocations" name="config[additional_allocations]" type="number" min="0" v-model="config.additional_allocations" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="config_port_array">Port Array (JSON)</Label>
                                <Input id="config_port_array" name="config[port_array]" v-model="config.port_array" />
                            </div>
                            <div class="space-y-2">
                                <Label>Port ranges</Label>
                                <div class="flex flex-wrap gap-2 items-center">
                                    <template v-for="(tag, i) in (config.port_range as string[])" :key="i">
                                        <input type="hidden" :name="'config[port_range][]'" :value="tag" />
                                        <span class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-sm">
                                            {{ tag }}
                                            <button type="button" class="hover:text-destructive" @click="(config.port_range as string[]).splice(i, 1)">×</button>
                                        </span>
                                    </template>
                                    <Input v-model="portRangeInput" class="w-28" placeholder="25565" @keydown.enter.prevent="addPortRange" />
                                    <Button type="button" variant="outline" size="sm" @click="addPortRange">Hinzufügen</Button>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex items-center gap-2">
                                    <input type="hidden" name="config[allow_egg_selection_override]" value="0" />
                                    <input type="checkbox" id="config_allow_egg" name="config[allow_egg_selection_override]" value="1" :checked="config.allow_egg_selection_override" @change="config.allow_egg_selection_override = (($event.target as HTMLInputElement).checked)" />
                                    <Label for="config_allow_egg">Allow Customer Egg Selection</Label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="hidden" name="config[skip_scripts]" value="0" />
                                    <input type="checkbox" id="config_skip_scripts" name="config[skip_scripts]" value="1" :checked="config.skip_scripts" @change="config.skip_scripts = (($event.target as HTMLInputElement).checked)" />
                                    <Label for="config_skip_scripts">Skip Egg Install Script</Label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="hidden" name="config[dedicated_ip]" value="0" />
                                    <input type="checkbox" id="config_dedicated_ip" name="config[dedicated_ip]" value="1" :checked="config.dedicated_ip" @change="config.dedicated_ip = (($event.target as HTMLInputElement).checked)" />
                                    <Label for="config_dedicated_ip">Dedicated IP</Label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="hidden" name="config[start_on_completion]" value="0" />
                                    <input type="checkbox" id="config_start_on_completion" name="config[start_on_completion]" value="1" :checked="config.start_on_completion" @change="config.start_on_completion = (($event.target as HTMLInputElement).checked)" />
                                    <Label for="config_start_on_completion">Start on completion</Label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="hidden" name="config[oom_killer]" value="0" />
                                    <input type="checkbox" id="config_oom_killer" name="config[oom_killer]" value="1" :checked="config.oom_killer" @change="config.oom_killer = (($event.target as HTMLInputElement).checked)" />
                                    <Label for="config_oom_killer">Enable OOM Killer</Label>
                                </div>
                            </div>
                        </template>
                        <template v-if="showPleskFields">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="disk_gb">Disk (GB)</Label>
                                    <Input id="disk_gb" name="disk_gb" type="number" min="0" :model-value="hostingPlan.disk_gb" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="traffic_gb">Traffic (GB/Monat)</Label>
                                    <Input id="traffic_gb" name="traffic_gb" type="number" min="0" :model-value="hostingPlan.traffic_gb" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="domains">Domains</Label>
                                    <Input id="domains" name="domains" type="number" min="0" :model-value="hostingPlan.domains" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="subdomains">Subdomains</Label>
                                    <Input id="subdomains" name="subdomains" type="number" min="0" :model-value="hostingPlan.subdomains" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="mailboxes">Mailpostfächer</Label>
                                    <Input id="mailboxes" name="mailboxes" type="number" min="0" :model-value="hostingPlan.mailboxes" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="databases">Datenbanken</Label>
                                    <Input id="databases" name="databases" type="number" min="0" :model-value="hostingPlan.databases" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <input type="hidden" name="disk_gb" :value="hostingPlan.disk_gb" />
                            <input type="hidden" name="traffic_gb" :value="hostingPlan.traffic_gb" />
                            <input type="hidden" name="domains" :value="hostingPlan.domains" />
                            <input type="hidden" name="subdomains" :value="hostingPlan.subdomains" />
                            <input type="hidden" name="mailboxes" :value="hostingPlan.mailboxes" />
                            <input type="hidden" name="databases" :value="hostingPlan.databases" />
                        </template>

                        <div class="space-y-2">
                            <Label for="price">
                                {{ showTeamspeakFields ? 'Grundpreis (€/Monat) – 0 = nur Preis pro Slot' : 'Preis (€/Monat) *' }}
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                :model-value="hostingPlan.price"
                                :aria-invalid="!!errors.price"
                            />
                            <InputError :message="errors.price" />
                        </div>
                        <div class="space-y-2">
                            <Label for="stripe_price_id">Stripe Price ID (optional)</Label>
                            <Input
                                id="stripe_price_id"
                                name="stripe_price_id"
                                :model-value="hostingPlan.stripe_price_id ?? ''"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="sort_order">Sortierung</Label>
                            <Input id="sort_order" name="sort_order" type="number" min="0" :model-value="hostingPlan.sort_order" />
                        </div>
                        <div class="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                :checked="isActive"
                                @update:checked="isActive = $event"
                            />
                            <Label for="is_active">Aktiv</Label>
                        </div>
                        <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                    </CardContent>
                    <CardFooter class="flex gap-2">
                        <Button type="submit">Speichern</Button>
                        <Link :href="`/admin/hosting-plans/${hostingPlan.id}`">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                    </Card>

                    <Card class="xl:max-w-none">
                        <CardHeader>
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <CardTitle>Paket-Optionen (Kundenauswahl)</CardTitle>
                                    <CardDescription>
                                        Optionen, die Kunden beim Checkout auswählen können. ID = Feld aus dem Paket-Formular. Bei Select: Optionen an Nests/Eggs binden möglich.
                                    </CardDescription>
                                </div>
                                <Button type="button" variant="outline" size="sm" @click="addPlanOption">
                                    Option hinzufügen
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div v-if="planOptions.length === 0" class="text-sm text-muted-foreground rounded-md border border-dashed p-4">
                                Noch keine Optionen. Klicken Sie auf „Option hinzufügen“.
                            </div>
                            <div v-else class="space-y-4">
                                <div
                                    v-for="(opt, idx) in planOptions"
                                    :key="idx"
                                    class="rounded-lg border p-4 space-y-3 bg-muted/30"
                                >
                                    <input type="hidden" :name="`config[plan_options][${idx}][id]`" :value="opt.id" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][name]`" :value="opt.name" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][type]`" :value="opt.type" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][price_per_unit]`" :value="opt.price_per_unit" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][sort_order]`" :value="idx" />
                                    <div class="flex flex-wrap items-start gap-2">
                                        <div class="space-y-1 min-w-[120px]">
                                            <Label class="text-xs">ID</Label>
                                            <Select
                                                :model-value="availableOptionIds.some(o => o.value === opt.id) ? opt.id : '__custom__'"
                                                class="h-9"
                                                @update:model-value="(v: string) => { opt.id = v === '__custom__' ? '' : v; }"
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option v-for="o in availableOptionIds" :key="o.value" :value="o.value">{{ o.label }}</option>
                                                <option value="__custom__">Benutzerdefiniert</option>
                                            </Select>
                                            <Input
                                                v-if="!availableOptionIds.some(o => o.value === opt.id)"
                                                v-model="opt.id"
                                                class="mt-1 h-8 text-sm"
                                                placeholder="z. B. opt_ram"
                                            />
                                        </div>
                                        <div class="space-y-1 flex-1 min-w-[120px]">
                                            <Label class="text-xs">Name</Label>
                                            <Input v-model="opt.name" class="h-9" placeholder="z. B. Arbeitsspeicher" />
                                        </div>
                                        <div class="space-y-1 min-w-[90px]">
                                            <Label class="text-xs">Typ</Label>
                                            <Select v-model="opt.type" class="h-9">
                                                <option value="free">Kostenlos</option>
                                                <option value="choice">Auswahl</option>
                                                <option value="text">Text</option>
                                                <option value="range_slider">Range</option>
                                                <option value="select">Select</option>
                                            </Select>
                                        </div>
                                        <div class="space-y-1 w-20">
                                            <Label class="text-xs">Preis (€)</Label>
                                            <Input
                                                v-model.number="opt.price_per_unit"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                class="h-9"
                                                :disabled="opt.type === 'free'"
                                            />
                                        </div>
                                        <div class="flex gap-1 items-end">
                                            <Button type="button" variant="ghost" size="sm" class="h-9" :disabled="idx === 0" @click="movePlanOption(idx, -1)">↑</Button>
                                            <Button type="button" variant="ghost" size="sm" class="h-9" :disabled="idx === planOptions.length - 1" @click="movePlanOption(idx, 1)">↓</Button>
                                            <Button type="button" variant="ghost" size="sm" class="h-9 text-destructive" @click="removePlanOption(idx)">Entfernen</Button>
                                        </div>
                                    </div>
                                    <div v-if="opt.type === 'choice' || (opt.type === 'select' && !opt.source)" class="ml-0 space-y-2">
                                        <Label class="text-xs">Optionen (value, label, Aufpreis €)</Label>
                                        <div v-for="(ch, cIdx) in (opt.choices ?? [])" :key="cIdx" class="flex gap-2 items-center">
                                            <Input v-model="ch.value" placeholder="value" class="h-8 flex-1 max-w-[80px]" />
                                            <Input v-model="ch.label" placeholder="Label" class="h-8 flex-1" />
                                            <Input v-model.number="ch.price_delta" type="number" step="0.01" min="0" placeholder="0" class="h-8 w-16" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][value]`" :value="ch.value" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][label]`" :value="ch.label" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][price_delta]`" :value="ch.price_delta ?? 0" />
                                            <Button type="button" variant="ghost" size="sm" class="h-8 shrink-0 text-destructive" @click="removeChoice(opt, cIdx)">×</Button>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" class="h-8" @click="addChoice(opt)">+ Option</Button>
                                    </div>
                                    <div v-if="opt.type === 'select' && showPterodactylFields" class="ml-0 space-y-2">
                                        <Label class="text-xs">Optionen binden an</Label>
                                        <Select v-model="opt.source" class="h-9 w-full">
                                            <option :value="undefined">Statisch (manuell oben)</option>
                                            <option value="pterodactyl_nests">Pterodactyl Nests</option>
                                            <option value="pterodactyl_eggs">Pterodactyl Eggs (vom Nest)</option>
                                        </Select>
                                        <input type="hidden" :name="`config[plan_options][${idx}][source]`" :value="opt.source ?? ''" />
                                        <p v-if="opt.source === 'pterodactyl_nests'" class="text-xs text-muted-foreground">
                                            Optionen = verfügbare Nests des Panel-Servers.
                                            <template v-if="pterodactylOptions.nests.length"> Aktuell {{ pterodactylOptions.nests.length }} Nests.</template>
                                            <template v-else> Bitte „Optionen aktualisieren“ beim Panel-Server klicken.</template>
                                        </p>
                                        <p v-else-if="opt.source === 'pterodactyl_eggs'" class="text-xs text-muted-foreground">
                                            Optionen = Eggs des im Plan gewählten Nests (Checkout).
                                            <template v-if="pterodactylOptions.eggs.length"> Vorschau: {{ pterodactylOptions.eggs.length }} Eggs.</template>
                                            <template v-else> Nest im Plan wählen und Optionen aktualisieren.</template>
                                        </p>
                                        <ul v-if="opt.source === 'pterodactyl_nests' && pterodactylOptions.nests.length" class="text-xs text-muted-foreground list-disc list-inside max-h-24 overflow-y-auto">
                                            <li v-for="n in pterodactylOptions.nests" :key="n.id">{{ n.name }} (ID {{ n.id }})</li>
                                        </ul>
                                        <ul v-else-if="opt.source === 'pterodactyl_eggs' && pterodactylOptions.eggs.length" class="text-xs text-muted-foreground list-disc list-inside max-h-24 overflow-y-auto">
                                            <li v-for="e in pterodactylOptions.eggs" :key="e.id">{{ e.name }} (ID {{ e.id }})</li>
                                        </ul>
                                    </div>
                                    <div v-if="opt.type === 'select' && opt.source && (opt.choices?.length ?? 0) > 0" class="ml-0 text-xs text-muted-foreground">
                                        Statische Optionen werden bei gebundener Quelle ignoriert; Anzeige kommt aus Nests/Eggs.
                                    </div>
                                    <div v-if="opt.type === 'range_slider'" class="ml-0 grid grid-cols-2 gap-2">
                                        <div class="space-y-1">
                                            <Label class="text-xs">Min</Label>
                                            <Input v-model.number="opt.min" type="number" class="h-8" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][min]`" :value="opt.min !== undefined && opt.min !== null ? opt.min : ''" />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Max</Label>
                                            <Input v-model.number="opt.max" type="number" class="h-8" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][max]`" :value="opt.max !== undefined && opt.max !== null ? opt.max : ''" />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Step</Label>
                                            <Input v-model.number="opt.step" type="number" min="0" class="h-8" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][step]`" :value="opt.step !== undefined && opt.step !== null ? opt.step : ''" />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Einheit</Label>
                                            <Input v-model="opt.unit" class="h-8" placeholder="MB" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][unit]`" :value="opt.unit ?? ''" />
                                        </div>
                                    </div>
                                    <div v-if="opt.type === 'text'" class="ml-0 flex gap-2">
                                        <div class="space-y-1 flex-1">
                                            <Label class="text-xs">Placeholder</Label>
                                            <Input v-model="opt.placeholder" class="h-8" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][placeholder]`" :value="opt.placeholder ?? ''" />
                                        </div>
                                        <div class="space-y-1 w-20">
                                            <Label class="text-xs">Max. Länge</Label>
                                            <Input v-model.number="opt.max_length" type="number" min="0" class="h-8" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][max_length]`" :value="opt.max_length ?? ''" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Form>
        </div>
    </AdminLayout>
</template>
