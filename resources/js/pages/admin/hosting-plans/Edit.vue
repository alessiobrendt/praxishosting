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
import { ref, computed } from 'vue';

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

type Props = {
    hostingPlan: HostingPlan;
    allowedPanelTypes: PanelTypeOption[];
    pterodactylHostingServers: PterodactylServer[];
};

const props = defineProps<Props>();

const isActive = ref(props.hostingPlan.is_active);
const panelType = ref(props.hostingPlan.panel_type ?? 'plesk');
const config = ref<Record<string, string>>(props.hostingPlan.config as Record<string, string> ?? {});
const showPleskFields = computed(() => panelType.value === 'plesk');
const showPterodactylFields = computed(() => panelType.value === 'pterodactyl');

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
                                <Label for="hosting_server_id">Panel-Server (Pterodactyl) *</Label>
                                <Select
                                    id="hosting_server_id"
                                    name="hosting_server_id"
                                    :model-value="String(hostingPlan.hosting_server_id ?? '')"
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
                                    Dieser Pterodactyl-Server wird für die Einrichtung neuer Game-Server dieses Pakets verwendet.
                                </p>
                            </div>
                            <div class="space-y-2">
                                <Label for="config_nest_id">Nest ID *</Label>
                                <Input
                                    id="config_nest_id"
                                    name="config[nest_id]"
                                    type="number"
                                    min="1"
                                    required
                                    :model-value="String(config.nest_id ?? '')"
                                    :aria-invalid="!!errors['config.nest_id']"
                                />
                                <InputError :message="errors['config.nest_id']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_egg_id">Egg ID *</Label>
                                <Input
                                    id="config_egg_id"
                                    name="config[egg_id]"
                                    type="number"
                                    min="1"
                                    required
                                    :model-value="String(config.egg_id ?? '')"
                                    :aria-invalid="!!errors['config.egg_id']"
                                />
                                <InputError :message="errors['config.egg_id']" />
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="space-y-2">
                                    <Label for="config_memory">RAM (MB)</Label>
                                    <Input id="config_memory" name="config[memory]" type="number" min="0" :model-value="String(config.memory ?? '')" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_disk">Disk (MB)</Label>
                                    <Input id="config_disk" name="config[disk]" type="number" min="0" :model-value="String(config.disk ?? '')" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config_cpu">CPU (%)</Label>
                                    <Input id="config_cpu" name="config[cpu]" type="number" min="0" :model-value="String(config.cpu ?? '')" />
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
