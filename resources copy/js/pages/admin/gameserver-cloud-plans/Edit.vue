<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type PterodactylServer = { id: number; name: string; hostname: string };

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
    source?: string;
    placeholder?: string;
    max_length?: number;
};

type AvailableOptionId = { value: string; label: string };

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    hosting_server_id: number;
    config: Record<string, unknown> | null;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    gameserverCloudPlan: GameserverCloudPlan;
    pterodactylHostingServers: PterodactylServer[];
    availableOptionIdsCloud: AvailableOptionId[];
};

const props = withDefaults(defineProps<Props>(), {
    availableOptionIdsCloud: () => [],
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Pläne', href: '/admin/hosting-plans' },
    { title: 'Gameserver-Cloud-Pläne', href: '/admin/hosting-plans?tab=cloud' },
    { title: props.gameserverCloudPlan.name, href: '#' },
];

const cfg = (props.gameserverCloudPlan.config ?? {}) as Record<string, unknown>;
const rawPlanOptions = Array.isArray(cfg.plan_options) ? cfg.plan_options : [];

function normalizePlanOption(o: unknown): PlanOption {
    const row = o && typeof o === 'object' ? o as Record<string, unknown> : {};
    const choices = Array.isArray(row.choices)
        ? (row.choices as Record<string, unknown>[]).map((c) => ({
              value: String(c?.value ?? ''),
              label: String(c?.label ?? ''),
              price_delta: Number(c?.price_delta ?? 0),
          }))
        : undefined;
    return {
        id: String(row.id ?? ''),
        name: String(row.name ?? ''),
        type: (['free', 'choice', 'text', 'range_slider', 'select'].includes(String(row.type)) ? row.type : 'free') as PlanOption['type'],
        price_per_unit: Number(row.price_per_unit ?? 0),
        sort_order: Number(row.sort_order ?? 0),
        choices,
        min: row.min != null ? Number(row.min) : undefined,
        max: row.max != null ? Number(row.max) : undefined,
        step: row.step != null ? Number(row.step) : undefined,
        unit: row.unit != null ? String(row.unit) : undefined,
        source: row.source != null ? String(row.source) : undefined,
        placeholder: row.placeholder != null ? String(row.placeholder) : undefined,
        max_length: row.max_length != null ? Number(row.max_length) : undefined,
    };
}

const hostingServerId = ref(String(props.gameserverCloudPlan.hosting_server_id));
const name = ref(props.gameserverCloudPlan.name);
const price = ref(props.gameserverCloudPlan.price);
const isActive = ref(props.gameserverCloudPlan.is_active);
const sortOrder = ref(props.gameserverCloudPlan.sort_order);
const configMaxCpu = ref(cfg.max_cpu !== undefined ? String(cfg.max_cpu) : '');
const configMaxMemoryMb = ref(cfg.max_memory_mb !== undefined ? String(cfg.max_memory_mb) : '');
const configMaxDiskGb = ref(cfg.max_disk_gb !== undefined ? String(cfg.max_disk_gb) : '');
const configNestId = ref(cfg.nest_id !== undefined ? String(cfg.nest_id) : '');
const configEggId = ref(cfg.egg_id !== undefined ? String(cfg.egg_id) : '');

const configPlanOptions = ref<PlanOption[]>(rawPlanOptions.map(normalizePlanOption));

const planOptions = computed({
    get: () => configPlanOptions.value,
    set: (val: PlanOption[]) => {
        configPlanOptions.value = val;
    },
});

function addPlanOption() {
    configPlanOptions.value = [
        ...configPlanOptions.value,
        {
            id: '',
            name: '',
            type: 'free',
            price_per_unit: 0,
            sort_order: configPlanOptions.value.length,
        },
    ];
}

function removePlanOption(index: number) {
    const opts = [...configPlanOptions.value];
    opts.splice(index, 1);
    configPlanOptions.value = opts;
}

function movePlanOption(index: number, direction: -1 | 1) {
    const opts = [...configPlanOptions.value];
    const ni = index + direction;
    if (ni < 0 || ni >= opts.length) return;
    [opts[index], opts[ni]] = [opts[ni], opts[index]];
    opts.forEach((o, i) => (o.sort_order = i));
    configPlanOptions.value = opts;
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
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Plan bearbeiten: ${gameserverCloudPlan.name}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Gameserver-Cloud-Plan bearbeiten</Heading>
                <Text class="mt-2" muted>
                    Name, Preis, Pterodactyl-Server und Ressourcen-Limits. Paket-Optionen (z. B. max_memory_mb, max_disk_gb) für die Kundenauswahl.
                </Text>
            </div>

            <Form
                :action="`/admin/gameserver-cloud-plans/${gameserverCloudPlan.id}`"
                method="post"
                class="block"
                v-slot="{ errors }"
            >
                <input type="hidden" name="_method" value="PUT" />
                <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card class="max-w-2xl xl:max-w-none">
                        <CardHeader>
                            <CardTitle>Paket-Details</CardTitle>
                            <CardDescription>Name, Preis, Pterodactyl-Server und Ressourcen-Limits</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-2">
                                <Label for="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    v-model="name"
                                    required
                                    placeholder="z. B. Cloud Small"
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </div>
                            <div class="space-y-2">
                                <Label for="price">Preis (€/Monat) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    v-model="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="9.99"
                                    :aria-invalid="!!errors.price"
                                />
                                <InputError :message="errors.price" />
                            </div>
                            <div class="space-y-2">
                                <Label for="hosting_server_id">Pterodactyl-Server *</Label>
                                <Select
                                    id="hosting_server_id"
                                    name="hosting_server_id"
                                    v-model="hostingServerId"
                                    required
                                    :aria-invalid="!!errors.hosting_server_id"
                                >
                                    <option value="">Bitte wählen – Game-Server werden sonst nicht eingerichtet</option>
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
                                    Pterodactyl-Server für die Bereitstellung der Cloud-Game-Server.
                                </p>
                            </div>

                            <div class="rounded-lg border bg-muted/30 p-3">
                                <h4 class="mb-3 text-sm font-medium">Ressourcen-Limits (Pool-Obergrenzen)</h4>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div class="space-y-2">
                                        <Label for="config_max_cpu">max_cpu (%)</Label>
                                        <Input
                                            id="config_max_cpu"
                                            name="config[max_cpu]"
                                            v-model="configMaxCpu"
                                            type="number"
                                            min="0"
                                            placeholder="400"
                                        />
                                        <InputError :message="errors['config.max_cpu']" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="config_max_memory_mb">max_memory_mb</Label>
                                        <Input
                                            id="config_max_memory_mb"
                                            name="config[max_memory_mb]"
                                            v-model="configMaxMemoryMb"
                                            type="number"
                                            min="0"
                                            placeholder="32768"
                                        />
                                        <InputError :message="errors['config.max_memory_mb']" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="config_max_disk_gb">max_disk_gb</Label>
                                        <Input
                                            id="config_max_disk_gb"
                                            name="config[max_disk_gb]"
                                            v-model="configMaxDiskGb"
                                            type="number"
                                            min="0"
                                            placeholder="200"
                                        />
                                        <InputError :message="errors['config.max_disk_gb']" />
                                    </div>
                                </div>
                                <p class="mt-2 text-xs text-muted-foreground">
                                    Obergrenzen für den gesamten Pool. Kunden können daraus Server anlegen; Paket-Optionen (rechts) steuern die Auswahl (z. B. RAM/Disk als Range).
                                </p>
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="config_nest_id">nest_id (Default, optional)</Label>
                                    <Input
                                        id="config_nest_id"
                                        name="config[nest_id]"
                                        v-model="configNestId"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                    />
                                    <InputError :message="errors['config.nest_id']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_egg_id">egg_id (Default, optional)</Label>
                                    <Input
                                        id="config_egg_id"
                                        name="config[egg_id]"
                                        v-model="configEggId"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                    />
                                    <InputError :message="errors['config.egg_id']" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="sort_order">Sortierung</Label>
                                <Input
                                    id="sort_order"
                                    name="sort_order"
                                    type="number"
                                    min="0"
                                    v-model.number="sortOrder"
                                />
                                <InputError :message="errors.sort_order" />
                            </div>
                            <div class="flex items-center space-x-2">
                                <Switch id="is_active" v-model="isActive" />
                                <Label for="is_active">Aktiv</Label>
                            </div>
                            <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                        </CardContent>
                        <CardFooter class="flex gap-2">
                            <Button type="submit">Speichern</Button>
                            <Link href="/admin/hosting-plans?tab=cloud">
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
                                        Optionen, die Kunden beim Checkout auswählen können. ID = max_memory_mb oder max_disk_gb (oder benutzerdefiniert). Typ „Range“ z. B. für RAM/Disk-Slider.
                                    </CardDescription>
                                </div>
                                <Button type="button" variant="outline" size="sm" @click="addPlanOption">
                                    Option hinzufügen
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div
                                v-if="planOptions.length === 0"
                                class="rounded-md border border-dashed p-4 text-sm text-muted-foreground"
                            >
                                Noch keine Optionen. Klicken Sie auf „Option hinzufügen“.
                            </div>
                            <div v-else class="space-y-4">
                                <div
                                    v-for="(opt, idx) in planOptions"
                                    :key="idx"
                                    class="space-y-3 rounded-lg border bg-muted/30 p-4"
                                >
                                    <input type="hidden" :name="`config[plan_options][${idx}][id]`" :value="opt.id" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][name]`" :value="opt.name" />
                                    <input type="hidden" :name="`config[plan_options][${idx}][type]`" :value="opt.type" />
                                    <input
                                        type="hidden"
                                        :name="`config[plan_options][${idx}][price_per_unit]`"
                                        :value="opt.price_per_unit"
                                    />
                                    <input
                                        type="hidden"
                                        :name="`config[plan_options][${idx}][sort_order]`"
                                        :value="idx"
                                    />
                                    <div class="flex flex-wrap items-start gap-2">
                                        <div class="min-w-[120px] space-y-1">
                                            <Label class="text-xs">ID</Label>
                                            <Select
                                                :model-value="availableOptionIdsCloud.some((o) => o.value === opt.id) ? opt.id : '__custom__'"
                                                class="h-9"
                                                @update:model-value="(v: string) => { opt.id = v === '__custom__' ? '' : v; }"
                                            >
                                                <option value="">Bitte wählen</option>
                                                <option
                                                    v-for="o in availableOptionIdsCloud"
                                                    :key="o.value"
                                                    :value="o.value"
                                                >
                                                    {{ o.label }}
                                                </option>
                                                <option value="__custom__">Benutzerdefiniert</option>
                                            </Select>
                                            <Input
                                                v-if="!availableOptionIdsCloud.some((o) => o.value === opt.id)"
                                                v-model="opt.id"
                                                class="mt-1 h-8 text-sm"
                                                placeholder="z. B. max_memory_mb"
                                            />
                                        </div>
                                        <div class="min-w-[120px] flex-1 space-y-1">
                                            <Label class="text-xs">Name</Label>
                                            <Input v-model="opt.name" class="h-9" placeholder="z. B. Arbeitsspeicher (MB)" />
                                        </div>
                                        <div class="min-w-[90px] space-y-1">
                                            <Label class="text-xs">Typ</Label>
                                            <Select v-model="opt.type" class="h-9">
                                                <option value="free">Kostenlos</option>
                                                <option value="choice">Auswahl</option>
                                                <option value="text">Text</option>
                                                <option value="range_slider">Range</option>
                                                <option value="select">Select</option>
                                            </Select>
                                        </div>
                                        <div class="w-20 space-y-1">
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
                                        <div class="flex items-end gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                class="h-9"
                                                :disabled="idx === 0"
                                                @click="movePlanOption(idx, -1)"
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                class="h-9"
                                                :disabled="idx === planOptions.length - 1"
                                                @click="movePlanOption(idx, 1)"
                                            >
                                                ↓
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                class="h-9 text-destructive"
                                                @click="removePlanOption(idx)"
                                            >
                                                Entfernen
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        v-if="opt.type === 'choice' || (opt.type === 'select' && !opt.source)"
                                        class="ml-0 space-y-2"
                                    >
                                        <Label class="text-xs">Optionen (value, label, Aufpreis €)</Label>
                                        <div
                                            v-for="(ch, cIdx) in (opt.choices ?? [])"
                                            :key="cIdx"
                                            class="flex items-center gap-2"
                                        >
                                            <Input
                                                v-model="ch.value"
                                                placeholder="value"
                                                class="h-8 max-w-[80px] flex-1"
                                            />
                                            <Input v-model="ch.label" placeholder="Label" class="h-8 flex-1" />
                                            <Input
                                                v-model.number="ch.price_delta"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0"
                                                class="h-8 w-16"
                                            />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][choices][${cIdx}][value]`"
                                                :value="ch.value"
                                            />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][choices][${cIdx}][label]`"
                                                :value="ch.label"
                                            />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][choices][${cIdx}][price_delta]`"
                                                :value="ch.price_delta ?? 0"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                class="h-8 shrink-0 text-destructive"
                                                @click="removeChoice(opt, cIdx)"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" class="h-8" @click="addChoice(opt)">
                                            + Option
                                        </Button>
                                    </div>
                                    <div v-if="opt.type === 'range_slider'" class="ml-0 grid grid-cols-2 gap-2">
                                        <div class="space-y-1">
                                            <Label class="text-xs">Min</Label>
                                            <Input v-model.number="opt.min" type="number" class="h-8" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][min]`"
                                                :value="opt.min !== undefined && opt.min !== null ? opt.min : ''"
                                            />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Max</Label>
                                            <Input v-model.number="opt.max" type="number" class="h-8" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][max]`"
                                                :value="opt.max !== undefined && opt.max !== null ? opt.max : ''"
                                            />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Step</Label>
                                            <Input v-model.number="opt.step" type="number" min="0" class="h-8" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][step]`"
                                                :value="opt.step !== undefined && opt.step !== null ? opt.step : ''"
                                            />
                                        </div>
                                        <div class="space-y-1">
                                            <Label class="text-xs">Einheit</Label>
                                            <Input v-model="opt.unit" class="h-8" placeholder="MB" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][unit]`"
                                                :value="opt.unit ?? ''"
                                            />
                                        </div>
                                    </div>
                                    <div v-if="opt.type === 'text'" class="ml-0 flex gap-2">
                                        <div class="flex-1 space-y-1">
                                            <Label class="text-xs">Placeholder</Label>
                                            <Input v-model="opt.placeholder" class="h-8" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][placeholder]`"
                                                :value="opt.placeholder ?? ''"
                                            />
                                        </div>
                                        <div class="w-20 space-y-1">
                                            <Label class="text-xs">Max. Länge</Label>
                                            <Input v-model.number="opt.max_length" type="number" min="0" class="h-8" />
                                            <input
                                                type="hidden"
                                                :name="`config[plan_options][${idx}][max_length]`"
                                                :value="opt.max_length ?? ''"
                                            />
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
