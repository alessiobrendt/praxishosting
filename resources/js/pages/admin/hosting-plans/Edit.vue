<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ref, computed, watch, onMounted } from 'vue';

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

type Props = {
    hostingPlan: HostingPlan;
    allowedPanelTypes: PanelTypeOption[];
    pterodactylHostingServers: PterodactylServer[];
};

const props = defineProps<Props>();

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
    <AppLayout :breadcrumbs="breadcrumbs">
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

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Paket-Details</CardTitle>
                    <CardDescription>Name, Panel-Typ und Limits (Plesk: Paketname + Webspace-Limits; Pterodactyl: Nest/Egg + Ressourcen)</CardDescription>
                </CardHeader>
                <Form
                    :action="`/admin/hosting-plans/${hostingPlan.id}`"
                    method="post"
                    class="space-y-6"
                    v-slot="{ errors }"
                >
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
                            <Label for="price">Preis (€/Monat) *</Label>
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
                </Form>
            </Card>
        </div>
    </AppLayout>
</template>
