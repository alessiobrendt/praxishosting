<!-- Admin: Webspace-Paket / Hosting-Plan bearbeiten -->
<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed, watch, onMounted } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
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

const panelTypeOptions = computed(() =>
    props.allowedPanelTypes.map((o) => ({ value: o.value, text: o.label })),
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Pakete', href: '/admin/hosting-plans' },
    { title: props.hostingPlan.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`${hostingPlan.name} bearbeiten`" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">{{ hostingPlan.name }} bearbeiten</h4>
                    <p class="text-muted small mb-0">
                        {{ hostingPlan.panel_type === 'plesk' ? `Plesk-Paket: ${hostingPlan.plesk_package_name}` : 'Pterodactyl Game-Server-Paket' }}
                    </p>
                </div>

                <Form
                    :action="`/admin/hosting-plans/${hostingPlan.id}`"
                    method="post"
                    v-slot="{ errors }"
                >
                    <input type="hidden" name="_method" value="PUT" />
                    <BRow>
                        <BCol xl="6">
                            <BCard no-body class="mb-3">
                                <BCardHeader>
                                    <BCardTitle class="mb-0">Paket-Details</BCardTitle>
                                    <p class="text-muted small mb-0 mt-1">
                                        Name, Panel-Typ und Limits (Plesk: Paketname + Webspace-Limits; Pterodactyl: Nest/Egg + Ressourcen)
                                    </p>
                                </BCardHeader>
                                <BCardBody>
                                    <BFormGroup label="Panel-Typ *" label-for="panel_type">
                                        <BFormSelect
                                            id="panel_type"
                                            name="panel_type"
                                            v-model="panelType"
                                            :options="panelTypeOptions"
                                            required
                                            :aria-invalid="!!errors.panel_type"
                                        />
                                        <InputError :message="errors.panel_type" />
                                    </BFormGroup>
                                    <BFormGroup label="Name *" label-for="name">
                                        <BFormInput
                                            id="name"
                                            name="name"
                                            :model-value="hostingPlan.name"
                                            required
                                            :aria-invalid="!!errors.name"
                                        />
                                        <InputError :message="errors.name" />
                                    </BFormGroup>
                                    <BFormGroup v-if="showPleskFields" label="Plesk-Paketname (Paket-ID) *" label-for="plesk_package_name">
                                        <BFormInput
                                            id="plesk_package_name"
                                            name="plesk_package_name"
                                            :model-value="hostingPlan.plesk_package_name"
                                            required
                                            :aria-invalid="!!errors.plesk_package_name"
                                        />
                                        <InputError :message="errors.plesk_package_name" />
                                    </BFormGroup>
                                    <template v-if="showTeamspeakFields">
                                        <input type="hidden" name="plesk_package_name" value="" />
                                        <BFormGroup label="Panel-Server (TeamSpeak) *" label-for="hosting_server_id_ts">
                                            <BFormSelect
                                                id="hosting_server_id_ts"
                                                name="hosting_server_id"
                                                v-model="hostingServerId"
                                                :options="[{ value: '', text: 'Bitte wählen' }, ...teamspeakHostingServers.map(s => ({ value: String(s.id), text: `${s.name} (${s.hostname})` }))]"
                                                :aria-invalid="!!errors.hosting_server_id"
                                            />
                                            <InputError :message="errors.hosting_server_id" />
                                            <p class="text-muted small mb-0 mt-1">Option „Slots“ als Bereichs-Slider in den Paket-Optionen verwenden.</p>
                                        </BFormGroup>
                                    </template>
                                    <template v-if="showPterodactylFields">
                                        <input type="hidden" name="plesk_package_name" value="" />
                                        <BFormGroup label="Panel-Server (Pterodactyl) *" label-for="hosting_server_id">
                                            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                                                <BFormSelect
                                                    id="hosting_server_id"
                                                    name="hosting_server_id"
                                                    v-model="hostingServerId"
                                                    :options="[{ value: '', text: 'Bitte wählen' }, ...pterodactylHostingServers.map(s => ({ value: String(s.id), text: `${s.name} (${s.hostname})` }))]"
                                                    :aria-invalid="!!errors.hosting_server_id"
                                                    class="flex-grow-1"
                                                    @change="onServerChange"
                                                />
                                                <BButton
                                                    type="button"
                                                    variant="outline-primary"
                                                    size="sm"
                                                    :disabled="!hostingServerId || loadingOptions"
                                                    @click="refreshOptions"
                                                >
                                                    {{ loadingOptions ? 'Laden…' : 'Optionen aktualisieren' }}
                                                </BButton>
                                            </div>
                                            <InputError :message="errors.hosting_server_id" />
                                            <p class="text-muted small mb-0">Nach Änderung ggf. „Optionen aktualisieren“ klicken.</p>
                                        </BFormGroup>
                                        <BFormGroup label="Nest *" label-for="config_nest_id">
                                            <BFormSelect
                                                id="config_nest_id"
                                                name="config[nest_id]"
                                                v-model="config.nest_id"
                                                :options="[{ value: '', text: 'Bitte wählen' }, ...pterodactylOptions.nests.map(n => ({ value: String(n.id), text: n.name }))]"
                                                required
                                                :aria-invalid="!!errors['config.nest_id']"
                                                @change="onNestChange"
                                            />
                                            <InputError :message="errors['config.nest_id']" />
                                        </BFormGroup>
                                        <BFormGroup label="Default Egg *" label-for="config_egg_id">
                                            <BFormSelect
                                                id="config_egg_id"
                                                name="config[egg_id]"
                                                v-model="config.egg_id"
                                                :options="[{ value: '', text: 'Bitte Nest wählen' }, ...pterodactylOptions.eggs.map(e => ({ value: String(e.id), text: e.name }))]"
                                                required
                                                :aria-invalid="!!errors['config.egg_id']"
                                            />
                                            <InputError :message="errors['config.egg_id']" />
                                        </BFormGroup>
                                        <BFormGroup label="Location(s)" label-for="config_location_ids">
                                            <select
                                                id="config_location_ids"
                                                name="config[location_ids][]"
                                                multiple
                                                class="form-select"
                                                style="min-height: 80px"
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
                                        </BFormGroup>
                                        <BFormGroup label="Node" label-for="config_node">
                                            <BFormSelect
                                                id="config_node"
                                                name="config[node]"
                                                v-model="config.node"
                                                :options="[{ value: '', text: 'Automatisch' }, ...pterodactylOptions.nodes.map(n => ({ value: String(n.id), text: n.name }))]"
                                            />
                                        </BFormGroup>
                                        <BRow>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="RAM (MiB) *" label-for="config_memory">
                                                    <BFormInput id="config_memory" name="config[memory]" type="number" min="0" v-model="config.memory" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="Swap (MiB)" label-for="config_swap">
                                                    <BFormInput id="config_swap" name="config[swap]" type="number" min="-1" v-model="config.swap" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="Disk (MiB) *" label-for="config_disk">
                                                    <BFormInput id="config_disk" name="config[disk]" type="number" min="0" v-model="config.disk" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="IO Weight" label-for="config_io">
                                                    <BFormInput id="config_io" name="config[io]" type="number" min="0" v-model="config.io" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="CPU (%) *" label-for="config_cpu">
                                                    <BFormInput id="config_cpu" name="config[cpu]" type="number" min="0" v-model="config.cpu" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="CPU Pinning" label-for="config_cpu_pinning">
                                                    <BFormInput id="config_cpu_pinning" name="config[cpu_pinning]" v-model="config.cpu_pinning" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="Databases" label-for="config_databases">
                                                    <BFormInput id="config_databases" name="config[databases]" type="number" min="0" v-model="config.databases" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="Backups" label-for="config_backups">
                                                    <BFormInput id="config_backups" name="config[backups]" type="number" min="0" v-model="config.backups" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol sm="6" md="4">
                                                <BFormGroup label="Additional Allocations" label-for="config_additional_allocations">
                                                    <BFormInput id="config_additional_allocations" name="config[additional_allocations]" type="number" min="0" v-model="config.additional_allocations" />
                                                </BFormGroup>
                                            </BCol>
                                        </BRow>
                                        <BFormGroup label="Port Array (JSON)" label-for="config_port_array">
                                            <BFormInput id="config_port_array" name="config[port_array]" v-model="config.port_array" />
                                        </BFormGroup>
                                        <BFormGroup label="Port ranges">
                                            <div class="d-flex flex-wrap align-items-center gap-2">
                                                <template v-for="(tag, i) in (config.port_range as string[])" :key="i">
                                                    <input type="hidden" :name="'config[port_range][]'" :value="tag" />
                                                    <span class="badge bg-secondary d-inline-flex align-items-center gap-1">
                                                        {{ tag }}
                                                        <button type="button" class="btn btn-link btn-sm p-0 text-danger text-decoration-none" @click="(config.port_range as string[]).splice(i, 1)">×</button>
                                                    </span>
                                                </template>
                                                <BFormInput v-model="portRangeInput" placeholder="25565" class="w-auto" style="max-width: 6rem" @keydown.enter.prevent="addPortRange" />
                                                <BButton type="button" variant="outline-primary" size="sm" @click="addPortRange">Hinzufügen</BButton>
                                            </div>
                                        </BFormGroup>
                                        <div class="d-flex flex-wrap gap-3 mb-3">
                                            <BFormGroup class="mb-0">
                                                <input type="hidden" name="config[allow_egg_selection_override]" value="0" />
                                                <BFormCheckbox id="config_allow_egg" v-model="config.allow_egg_selection_override" name="config[allow_egg_selection_override]" value="1">
                                                    Allow Customer Egg Selection
                                                </BFormCheckbox>
                                            </BFormGroup>
                                            <BFormGroup class="mb-0">
                                                <input type="hidden" name="config[skip_scripts]" value="0" />
                                                <BFormCheckbox id="config_skip_scripts" v-model="config.skip_scripts" name="config[skip_scripts]" value="1">
                                                    Skip Egg Install Script
                                                </BFormCheckbox>
                                            </BFormGroup>
                                            <BFormGroup class="mb-0">
                                                <input type="hidden" name="config[dedicated_ip]" value="0" />
                                                <BFormCheckbox id="config_dedicated_ip" v-model="config.dedicated_ip" name="config[dedicated_ip]" value="1">
                                                    Dedicated IP
                                                </BFormCheckbox>
                                            </BFormGroup>
                                            <BFormGroup class="mb-0">
                                                <input type="hidden" name="config[start_on_completion]" value="0" />
                                                <BFormCheckbox id="config_start_on_completion" v-model="config.start_on_completion" name="config[start_on_completion]" value="1">
                                                    Start on completion
                                                </BFormCheckbox>
                                            </BFormGroup>
                                            <BFormGroup class="mb-0">
                                                <input type="hidden" name="config[oom_killer]" value="0" />
                                                <BFormCheckbox id="config_oom_killer" v-model="config.oom_killer" name="config[oom_killer]" value="1">
                                                    Enable OOM Killer
                                                </BFormCheckbox>
                                            </BFormGroup>
                                        </div>
                                    </template>
                                    <template v-if="showPleskFields">
                                        <BRow>
                                            <BCol md="6">
                                                <BFormGroup label="Disk (GB)" label-for="disk_gb">
                                                    <BFormInput id="disk_gb" name="disk_gb" type="number" min="0" :model-value="hostingPlan.disk_gb" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol md="6">
                                                <BFormGroup label="Traffic (GB/Monat)" label-for="traffic_gb">
                                                    <BFormInput id="traffic_gb" name="traffic_gb" type="number" min="0" :model-value="hostingPlan.traffic_gb" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol md="6">
                                                <BFormGroup label="Domains" label-for="domains">
                                                    <BFormInput id="domains" name="domains" type="number" min="0" :model-value="hostingPlan.domains" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol md="6">
                                                <BFormGroup label="Subdomains" label-for="subdomains">
                                                    <BFormInput id="subdomains" name="subdomains" type="number" min="0" :model-value="hostingPlan.subdomains" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol md="6">
                                                <BFormGroup label="Mailpostfächer" label-for="mailboxes">
                                                    <BFormInput id="mailboxes" name="mailboxes" type="number" min="0" :model-value="hostingPlan.mailboxes" />
                                                </BFormGroup>
                                            </BCol>
                                            <BCol md="6">
                                                <BFormGroup label="Datenbanken" label-for="databases">
                                                    <BFormInput id="databases" name="databases" type="number" min="0" :model-value="hostingPlan.databases" />
                                                </BFormGroup>
                                            </BCol>
                                        </BRow>
                                    </template>
                                    <template v-else>
                                        <input type="hidden" name="disk_gb" :value="hostingPlan.disk_gb" />
                                        <input type="hidden" name="traffic_gb" :value="hostingPlan.traffic_gb" />
                                        <input type="hidden" name="domains" :value="hostingPlan.domains" />
                                        <input type="hidden" name="subdomains" :value="hostingPlan.subdomains" />
                                        <input type="hidden" name="mailboxes" :value="hostingPlan.mailboxes" />
                                        <input type="hidden" name="databases" :value="hostingPlan.databases" />
                                    </template>

                                    <BFormGroup :label="showTeamspeakFields ? 'Grundpreis (€/Monat) – 0 = nur Preis pro Slot' : 'Preis (€/Monat) *'" label-for="price">
                                        <BFormInput
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
                                    </BFormGroup>
                                    <BFormGroup label="Stripe Price ID (optional)" label-for="stripe_price_id">
                                        <BFormInput
                                            id="stripe_price_id"
                                            name="stripe_price_id"
                                            :model-value="hostingPlan.stripe_price_id ?? ''"
                                        />
                                    </BFormGroup>
                                    <BFormGroup label="Sortierung" label-for="sort_order">
                                        <BFormInput id="sort_order" name="sort_order" type="number" min="0" :model-value="hostingPlan.sort_order" />
                                    </BFormGroup>
                                    <BFormGroup>
                                        <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                                        <BFormCheckbox id="is_active" v-model="isActive" switch>
                                            Aktiv
                                        </BFormCheckbox>
                                    </BFormGroup>
                                </BCardBody>
                                <BCardFooter class="d-flex gap-2">
                                    <BButton type="submit" variant="primary">Speichern</BButton>
                                    <Link :href="`/admin/hosting-plans/${hostingPlan.id}`">
                                        <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                                    </Link>
                                </BCardFooter>
                            </BCard>
                        </BCol>
                        <BCol xl="6">
                            <BCard no-body>
                                <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div>
                                        <BCardTitle class="mb-0">Paket-Optionen (Kundenauswahl)</BCardTitle>
                                        <p class="text-muted small mb-0 mt-1">
                                            Optionen, die Kunden beim Checkout auswählen können. ID = Feld aus dem Paket-Formular. Bei Select: Optionen an Nests/Eggs binden möglich.
                                        </p>
                                    </div>
                                    <BButton type="button" variant="outline-primary" size="sm" @click="addPlanOption">
                                        Option hinzufügen
                                    </BButton>
                                </BCardHeader>
                                <BCardBody>
                                    <div v-if="planOptions.length === 0" class="text-muted small rounded border border-dashed p-3">
                                        Noch keine Optionen. Klicken Sie auf „Option hinzufügen“.
                                    </div>
                                    <div v-else class="d-flex flex-column gap-3">
                                        <div
                                            v-for="(opt, idx) in planOptions"
                                            :key="idx"
                                            class="rounded border p-3 bg-light bg-opacity-50"
                                        >
                                            <input type="hidden" :name="`config[plan_options][${idx}][id]`" :value="opt.id" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][name]`" :value="opt.name" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][type]`" :value="opt.type" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][price_per_unit]`" :value="opt.price_per_unit" />
                                            <input type="hidden" :name="`config[plan_options][${idx}][sort_order]`" :value="idx" />
                                            <div class="d-flex flex-wrap align-items-end gap-2 mb-2">
                                                <BFormGroup label="ID" class="mb-0" label-class="form-label small">
                                                    <BFormSelect
                                                        :model-value="availableOptionIds.some(o => o.value === opt.id) ? opt.id : '__custom__'"
                                                        :options="[{ value: '', text: 'Bitte wählen' }, ...availableOptionIds.map(o => ({ value: o.value, text: o.label })), { value: '__custom__', text: 'Benutzerdefiniert' }]"
                                                        size="sm"
                                                        @update:model-value="(v: string) => { opt.id = v === '__custom__' ? '' : v; }"
                                                    />
                                                    <BFormInput
                                                        v-if="!availableOptionIds.some(o => o.value === opt.id)"
                                                        v-model="opt.id"
                                                        size="sm"
                                                        placeholder="z. B. opt_ram"
                                                        class="mt-1"
                                                    />
                                                </BFormGroup>
                                                <BFormGroup label="Name" class="mb-0 flex-grow-1" style="min-width: 120px" label-class="form-label small">
                                                    <BFormInput v-model="opt.name" size="sm" placeholder="z. B. Arbeitsspeicher" />
                                                </BFormGroup>
                                                <BFormGroup label="Typ" class="mb-0" label-class="form-label small">
                                                    <BFormSelect
                                                        v-model="opt.type"
                                                        :options="[
                                                            { value: 'free', text: 'Kostenlos' },
                                                            { value: 'choice', text: 'Auswahl' },
                                                            { value: 'text', text: 'Text' },
                                                            { value: 'range_slider', text: 'Range' },
                                                            { value: 'select', text: 'Select' },
                                                        ]"
                                                        size="sm"
                                                    />
                                                </BFormGroup>
                                                <BFormGroup label="Preis (€)" class="mb-0" label-class="form-label small" style="width: 5rem">
                                                    <BFormInput
                                                        v-model.number="opt.price_per_unit"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        size="sm"
                                                        :disabled="opt.type === 'free'"
                                                    />
                                                </BFormGroup>
                                                <div class="d-flex gap-1">
                                                    <BButton type="button" variant="outline-secondary" size="sm" :disabled="idx === 0" @click="movePlanOption(idx, -1)">↑</BButton>
                                                    <BButton type="button" variant="outline-secondary" size="sm" :disabled="idx === planOptions.length - 1" @click="movePlanOption(idx, 1)">↓</BButton>
                                                    <BButton type="button" variant="outline-danger" size="sm" @click="removePlanOption(idx)">Entfernen</BButton>
                                                </div>
                                            </div>
                                            <div v-if="opt.type === 'choice' || (opt.type === 'select' && !opt.source)" class="mt-2">
                                                <label class="form-label small">Optionen (value, label, Aufpreis €)</label>
                                                <div v-for="(ch, cIdx) in (opt.choices ?? [])" :key="cIdx" class="d-flex gap-2 align-items-center mb-2">
                                                    <BFormInput v-model="ch.value" placeholder="value" size="sm" class="flex-grow-1" style="max-width: 6rem" />
                                                    <BFormInput v-model="ch.label" placeholder="Label" size="sm" class="flex-grow-1" />
                                                    <BFormInput v-model.number="ch.price_delta" type="number" step="0.01" min="0" placeholder="0" size="sm" class="w-25" />
                                                    <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][value]`" :value="ch.value" />
                                                    <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][label]`" :value="ch.label" />
                                                    <input type="hidden" :name="`config[plan_options][${idx}][choices][${cIdx}][price_delta]`" :value="ch.price_delta ?? 0" />
                                                    <BButton type="button" variant="outline-danger" size="sm" @click="removeChoice(opt, cIdx)">×</BButton>
                                                </div>
                                                <BButton type="button" variant="outline-primary" size="sm" @click="addChoice(opt)">+ Option</BButton>
                                            </div>
                                            <div v-if="opt.type === 'select' && showPterodactylFields" class="mt-2">
                                                <label class="form-label small">Optionen binden an</label>
                                                <BFormSelect
                                                    v-model="opt.source"
                                                    :options="[
                                                        { value: '', text: 'Statisch (manuell oben)' },
                                                        { value: 'pterodactyl_nests', text: 'Pterodactyl Nests' },
                                                        { value: 'pterodactyl_eggs', text: 'Pterodactyl Eggs (vom Nest)' },
                                                    ]"
                                                    size="sm"
                                                    class="w-100"
                                                />
                                                <input type="hidden" :name="`config[plan_options][${idx}][source]`" :value="opt.source ?? ''" />
                                                <p v-if="opt.source === 'pterodactyl_nests'" class="small text-muted mb-0 mt-1">
                                                    Optionen = verfügbare Nests des Panel-Servers.
                                                    <template v-if="pterodactylOptions.nests.length"> Aktuell {{ pterodactylOptions.nests.length }} Nests.</template>
                                                    <template v-else> Bitte „Optionen aktualisieren“ beim Panel-Server klicken.</template>
                                                </p>
                                                <p v-else-if="opt.source === 'pterodactyl_eggs'" class="small text-muted mb-0 mt-1">
                                                    Optionen = Eggs des im Plan gewählten Nests (Checkout).
                                                    <template v-if="pterodactylOptions.eggs.length"> Vorschau: {{ pterodactylOptions.eggs.length }} Eggs.</template>
                                                    <template v-else> Nest im Plan wählen und Optionen aktualisieren.</template>
                                                </p>
                                                <ul v-if="opt.source === 'pterodactyl_nests' && pterodactylOptions.nests.length" class="small text-muted list-unstyled mb-0 mt-1 overflow-auto" style="max-height: 6rem">
                                                    <li v-for="n in pterodactylOptions.nests" :key="n.id">{{ n.name }} (ID {{ n.id }})</li>
                                                </ul>
                                                <ul v-else-if="opt.source === 'pterodactyl_eggs' && pterodactylOptions.eggs.length" class="small text-muted list-unstyled mb-0 mt-1 overflow-auto" style="max-height: 6rem">
                                                    <li v-for="e in pterodactylOptions.eggs" :key="e.id">{{ e.name }} (ID {{ e.id }})</li>
                                                </ul>
                                            </div>
                                            <div v-if="opt.type === 'select' && opt.source && (opt.choices?.length ?? 0) > 0" class="small text-muted mt-1">
                                                Statische Optionen werden bei gebundener Quelle ignoriert; Anzeige kommt aus Nests/Eggs.
                                            </div>
                                            <div v-if="opt.type === 'range_slider'" class="mt-2 row g-2">
                                                <BCol md="6">
                                                    <BFormGroup label="Min" class="mb-0" label-class="form-label small">
                                                        <BFormInput v-model.number="opt.min" type="number" size="sm" />
                                                        <input type="hidden" :name="`config[plan_options][${idx}][min]`" :value="opt.min !== undefined && opt.min !== null ? opt.min : ''" />
                                                    </BFormGroup>
                                                </BCol>
                                                <BCol md="6">
                                                    <BFormGroup label="Max" class="mb-0" label-class="form-label small">
                                                        <BFormInput v-model.number="opt.max" type="number" size="sm" />
                                                        <input type="hidden" :name="`config[plan_options][${idx}][max]`" :value="opt.max !== undefined && opt.max !== null ? opt.max : ''" />
                                                    </BFormGroup>
                                                </BCol>
                                                <BCol md="6">
                                                    <BFormGroup label="Step" class="mb-0" label-class="form-label small">
                                                        <BFormInput v-model.number="opt.step" type="number" min="0" size="sm" />
                                                        <input type="hidden" :name="`config[plan_options][${idx}][step]`" :value="opt.step !== undefined && opt.step !== null ? opt.step : ''" />
                                                    </BFormGroup>
                                                </BCol>
                                                <BCol md="6">
                                                    <BFormGroup label="Einheit" class="mb-0" label-class="form-label small">
                                                        <BFormInput v-model="opt.unit" size="sm" placeholder="MB" />
                                                        <input type="hidden" :name="`config[plan_options][${idx}][unit]`" :value="opt.unit ?? ''" />
                                                    </BFormGroup>
                                                </BCol>
                                            </div>
                                            <div v-if="opt.type === 'text'" class="mt-2 d-flex gap-2">
                                                <BFormGroup label="Placeholder" class="mb-0 flex-grow-1" label-class="form-label small">
                                                    <BFormInput v-model="opt.placeholder" size="sm" />
                                                    <input type="hidden" :name="`config[plan_options][${idx}][placeholder]`" :value="opt.placeholder ?? ''" />
                                                </BFormGroup>
                                                <BFormGroup label="Max. Länge" class="mb-0" label-class="form-label small" style="width: 5rem">
                                                    <BFormInput v-model.number="opt.max_length" type="number" min="0" size="sm" />
                                                    <input type="hidden" :name="`config[plan_options][${idx}][max_length]`" :value="opt.max_length ?? ''" />
                                                </BFormGroup>
                                            </div>
                                        </div>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                    </BRow>
                </Form>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
