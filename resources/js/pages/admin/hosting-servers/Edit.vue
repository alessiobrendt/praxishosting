<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingServer = {
    id: number;
    brand_id: number | null;
    panel_type: string;
    config: Record<string, string> | null;
    name: string | null;
    hostname: string;
    port: number | null;
    use_ssl: boolean;
    ip_address: string | null;
    api_username: string | null;
    is_active: boolean;
};

type PanelTypeOption = { value: string; label: string };

type Props = {
    hostingServer: HostingServer;
    allowedPanelTypes: PanelTypeOption[];
};

const props = defineProps<Props>();

const isActive = ref(props.hostingServer.is_active);
const useSsl = ref(props.hostingServer.use_ssl ?? true);
const panelType = ref(props.hostingServer.panel_type ?? 'plesk');
const config = ref<Record<string, string>>(props.hostingServer.config ?? {});
watch(
    () => props.hostingServer,
    (server) => {
        isActive.value = server.is_active;
        useSsl.value = server.use_ssl ?? true;
        panelType.value = server.panel_type ?? 'plesk';
        config.value = server.config ?? {};
    },
    { deep: true },
);
const showPleskFields = computed(() => panelType.value === 'plesk');
const showPterodactylFields = computed(() => panelType.value === 'pterodactyl');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: '/admin/hosting-servers' },
    { title: props.hostingServer.name ?? props.hostingServer.hostname, href: '#' },
];
</script>

<template>
    <AdminLayout :key="hostingServer.id" :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server bearbeiten" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Hosting-Server bearbeiten</Heading>
                <Text class="mt-2" muted>
                    {{ hostingServer.hostname }}
                </Text>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Server-Details</CardTitle>
                    <CardDescription>
                    Panel-Typ, Hostname und API-Zugang. Plesk: REST API. Pterodactyl: Application API.
                </CardDescription>
                </CardHeader>
                <Form
                    :action="`/admin/hosting-servers/${hostingServer.id}`"
                    method="post"
                    class="space-y-6"
                    v-slot="{ errors }"
                >
                    <CardContent class="space-y-4">
                        <input type="hidden" name="_method" value="PUT" />
                        <div class="space-y-2">
                            <Label for="panel_type">Panel-Typ *</Label>
                            <!-- Native select to test: if this shows correct value, bug is in Select.vue -->
                            <select
                                id="panel_type"
                                name="panel_type"
                                v-model="panelType"
                                required
                                class="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            >
                                <option
                                    v-for="opt in allowedPanelTypes"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                            <InputError :message="errors.panel_type" />
                        </div>
                        <template v-if="showPterodactylFields">
                            <div class="space-y-2">
                                <Label for="config_base_uri">Panel-URL (Base URI) *</Label>
                                <Input
                                    id="config_base_uri"
                                    name="config[base_uri]"
                                    :model-value="config.base_uri ?? ''"
                                    placeholder="https://panel.example.com"
                                    :aria-invalid="!!errors['config.base_uri']"
                                />
                                <InputError :message="errors['config.base_uri']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_api_key">Application API Key</Label>
                                <Input
                                    id="config_api_key"
                                    name="config[api_key]"
                                    type="password"
                                    :model-value="config.api_key ?? ''"
                                    placeholder="Leer lassen um beizubehalten"
                                    :aria-invalid="!!errors['config.api_key']"
                                />
                                <InputError :message="errors['config.api_key']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_client_api_key">Client API Key (optional)</Label>
                                <Input
                                    id="config_client_api_key"
                                    name="config[client_api_key]"
                                    type="password"
                                    :model-value="config.client_api_key ?? ''"
                                    placeholder="Für eingebettete Panel-Funktionen"
                                />
                                <InputError :message="errors['config.client_api_key']" />
                            </div>
                        </template>
                        <div class="space-y-2">
                            <Label for="name">Name (optional)</Label>
                            <Input
                                id="name"
                                name="name"
                                :model-value="hostingServer.name ?? ''"
                                placeholder="z. B. Plesk Server 1"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="hostname">Hostname *</Label>
                            <Input
                                id="hostname"
                                name="hostname"
                                required
                                :model-value="hostingServer.hostname"
                                :aria-invalid="!!errors.hostname"
                            />
                            <InputError :message="errors.hostname" />
                        </div>
                        <template v-if="showPleskFields">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="port">Port (optional)</Label>
                                    <Input
                                        id="port"
                                        name="port"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        :model-value="hostingServer.port != null ? String(hostingServer.port) : ''"
                                        placeholder="leer = Standard (443/80)"
                                    />
                                    <InputError :message="errors.port" />
                                </div>
                                <div class="flex items-center space-x-2 pt-8">
                                    <input type="hidden" name="use_ssl" value="0" />
                                    <input
                                        type="checkbox"
                                        id="use_ssl"
                                        name="use_ssl"
                                        value="1"
                                        :checked="useSsl"
                                        @change="useSsl = ($event.target as HTMLInputElement).checked"
                                        class="rounded"
                                    />
                                    <Label for="use_ssl">HTTPS (SSL)</Label>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="api_username">API-Benutzername (optional)</Label>
                                <Input
                                    id="api_username"
                                    name="api_username"
                                    :model-value="hostingServer.api_username ?? ''"
                                    placeholder="admin"
                                />
                                <InputError :message="errors.api_username" />
                            </div>
                            <div class="space-y-2">
                                <Label for="ip_address">IP-Adresse</Label>
                                <Input
                                    id="ip_address"
                                    name="ip_address"
                                    :model-value="hostingServer.ip_address ?? ''"
                                    placeholder="z. B. Shared-IP aus dem Reseller-Pool"
                                />
                                <Text class="text-sm" muted>Für Plesk Reseller: Muss eine IP aus Ihrem Reseller-IP-Pool sein (Plesk → IP-Adressen).</Text>
                                <InputError :message="errors.ip_address" />
                            </div>
                        </template>
                        <div v-if="showPleskFields" class="space-y-2">
                            <Label for="api_token">API-Token / Passwort</Label>
                            <Input
                                id="api_token"
                                name="api_token"
                                type="password"
                                placeholder="Leer lassen um beizubehalten"
                            />
                            <InputError :message="errors.api_token" />
                        </div>
                        <div class="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                v-model="isActive"
                            />
                            <Label for="is_active">Aktiv</Label>
                        </div>
                        <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                    </CardContent>
                    <CardFooter class="flex gap-2">
                        <Button type="submit">Speichern</Button>
                        <Link :href="`/admin/hosting-servers/${hostingServer.id}`">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    </AdminLayout>
</template>
