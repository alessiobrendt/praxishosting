<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
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

type PanelTypeOption = { value: string; label: string };

type Props = {
    allowedPanelTypes: PanelTypeOption[];
};

const props = defineProps<Props>();

const isActive = ref(true);
const panelType = ref(props.allowedPanelTypes[0]?.value ?? 'plesk');
const showPleskFields = computed(() => panelType.value === 'plesk');
const showPterodactylFields = computed(() => panelType.value === 'pterodactyl');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: '/admin/hosting-servers' },
    { title: 'Neuer Server', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server anlegen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Neuer Hosting-Server</Heading>
                <Text class="mt-2" muted>
                    Plesk-Server für Webspace-Accounts anlegen
                </Text>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Server-Details</CardTitle>
                    <CardDescription>
                    Panel-Typ wählen, dann Hostname und API-Zugang. Plesk: REST API. Pterodactyl: Application API (Panel-URL + API Key).
                </CardDescription>
                </CardHeader>
                <Form
                    action="/admin/hosting-servers"
                    method="post"
                    class="space-y-6"
                    v-slot="{ errors }"
                >
                    <CardContent class="space-y-4">
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
                        <template v-if="showPterodactylFields">
                            <div class="space-y-2">
                                <Label for="config_base_uri">Panel-URL (Base URI) *</Label>
                                <Input
                                    id="config_base_uri"
                                    name="config[base_uri]"
                                    placeholder="https://panel.example.com"
                                    :aria-invalid="!!errors['config.base_uri']"
                                />
                                <InputError :message="errors['config.base_uri']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="config_api_key">Application API Key *</Label>
                                <Input
                                    id="config_api_key"
                                    name="config[api_key]"
                                    type="password"
                                    placeholder="Pterodactyl Application API Key"
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
                                    placeholder="Für eingebettete Panel-Funktionen (Console, Files, …)"
                                />
                                <InputError :message="errors['config.client_api_key']" />
                            </div>
                        </template>
                        <div class="space-y-2">
                            <Label for="name">Name (optional)</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="z. B. Plesk Server 1 / Pterodactyl Panel"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="hostname">Hostname *</Label>
                            <Input
                                id="hostname"
                                name="hostname"
                                required
                                :placeholder="showPterodactylFields ? 'panel.example.com' : 'plesk.example.com'"
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
                                    placeholder="leer = Standard (443/80)"
                                />
                                <InputError :message="errors.port" />
                            </div>
                            <div class="flex items-center space-x-2 pt-8">
                                <input type="hidden" name="use_ssl" value="0" />
                                <input type="checkbox" id="use_ssl" name="use_ssl" value="1" checked class="rounded" />
                                <Label for="use_ssl">HTTPS (SSL)</Label>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="api_username">API-Benutzername (optional)</Label>
                            <Input
                                id="api_username"
                                name="api_username"
                                placeholder="admin"
                            />
                            <Text class="text-sm" muted>Bei Angabe: REST API v2 mit Basic Auth (Benutzer + API-Token als Passwort)</Text>
                            <InputError :message="errors.api_username" />
                        </div>
                        <div class="space-y-2">
                            <Label for="ip_address">IP-Adresse</Label>
                            <Input
                                id="ip_address"
                                name="ip_address"
                                placeholder="z. B. Shared-IP aus dem Reseller-Pool"
                            />
                            <Text class="text-sm" muted>Für Plesk Reseller: Muss eine IP aus Ihrem Reseller-IP-Pool sein (Plesk → IP-Adressen).</Text>
                            <InputError :message="errors.ip_address" />
                        </div>
                        <div v-if="showPleskFields" class="space-y-2">
                            <Label for="api_token">API-Token / Passwort *</Label>
                            <Input
                                id="api_token"
                                name="api_token"
                                type="password"
                                :required="showPleskFields"
                                placeholder="Plesk API Key oder Passwort bei Basic Auth"
                                :aria-invalid="!!errors.api_token"
                            />
                            <InputError :message="errors.api_token" />
                        </div>
                        <template v-if="showPterodactylFields">
                            <input type="hidden" name="api_token" value="pterodactyl" />
                            <input type="hidden" name="port" value="443" />
                            <input type="hidden" name="use_ssl" value="1" />
                        </template>
                        <div class="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                name="is_active"
                                :checked="isActive"
                                @update:checked="isActive = $event"
                            />
                            <Label for="is_active">Aktiv</Label>
                        </div>
                        <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                        </template>
                    </CardContent>
                    <CardFooter class="flex gap-2">
                        <Button type="submit">Speichern</Button>
                        <Link href="/admin/hosting-servers">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    </AdminLayout>
</template>
