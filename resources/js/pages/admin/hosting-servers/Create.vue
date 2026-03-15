<!-- Admin: Hosting-Server anlegen -->
<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
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
import hostingServersRoutes from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';

type PanelTypeOption = { value: string; label: string };

type Props = {
    allowedPanelTypes: PanelTypeOption[];
};

const props = defineProps<Props>();

const isActive = ref(true);
const useSsl = ref(true);
const panelType = ref(props.allowedPanelTypes[0]?.value ?? 'plesk');
const config = ref<Record<string, string>>({});

const showPleskFields = computed(() => panelType.value === 'plesk');
const showPterodactylFields = computed(() => panelType.value === 'pterodactyl');
const showTeamspeakFields = computed(() => panelType.value === 'teamspeak');

const panelTypeOptions = computed(() =>
    props.allowedPanelTypes.map((o) => ({ value: o.value, text: o.label })),
);

function setConfig(key: string, value: string | number | null | undefined) {
    config.value = { ...config.value, [key]: value != null ? String(value) : '' };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: hostingServersRoutes.index.url() },
    { title: 'Neuer Server', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server anlegen" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Neuer Hosting-Server</h4>
                    <p class="text-muted small mb-0">Plesk-, Pterodactyl- oder TeamSpeak-Server anlegen</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Server-Details</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Panel-Typ wählen, dann Hostname und API-Zugang. Plesk: REST API. Pterodactyl: Application API. TeamSpeak: Query-Adresse, Benutzer, Passwort und Port-Range.
                        </p>
                    </BCardHeader>
                    <Form
                        action="/admin/hosting-servers"
                        method="post"
                        v-slot="{ errors }"
                    >
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

                            <template v-if="showPterodactylFields">
                                <BFormGroup label="Panel-URL (Base URI) *" label-for="config_base_uri">
                                    <BFormInput
                                        id="config_base_uri"
                                        name="config[base_uri]"
                                        :model-value="config.base_uri ?? ''"
                                        @update:model-value="(v) => setConfig('base_uri', v)"
                                        placeholder="https://panel.example.com"
                                        :aria-invalid="!!errors['config.base_uri']"
                                    />
                                    <InputError :message="errors['config.base_uri']" />
                                </BFormGroup>
                                <BFormGroup label="Application API Key *" label-for="config_api_key">
                                    <BFormInput
                                        id="config_api_key"
                                        name="config[api_key]"
                                        type="password"
                                        :model-value="config.api_key ?? ''"
                                        @update:model-value="(v) => setConfig('api_key', v)"
                                        placeholder="Pterodactyl Application API Key"
                                        :aria-invalid="!!errors['config.api_key']"
                                    />
                                    <InputError :message="errors['config.api_key']" />
                                </BFormGroup>
                                <BFormGroup label="Client API Key (optional)" label-for="config_client_api_key">
                                    <BFormInput
                                        id="config_client_api_key"
                                        name="config[client_api_key]"
                                        type="password"
                                        :model-value="config.client_api_key ?? ''"
                                        @update:model-value="(v) => setConfig('client_api_key', v)"
                                        placeholder="Für eingebettete Panel-Funktionen"
                                    />
                                </BFormGroup>
                            </template>

                            <template v-if="showTeamspeakFields">
                                <BFormGroup label="IP-Adresse / Host *" label-for="config_host">
                                    <BFormInput
                                        id="config_host"
                                        name="config[host]"
                                        :model-value="config.host ?? ''"
                                        @update:model-value="(v) => setConfig('host', v)"
                                        placeholder="z. B. 77.90.15.7"
                                        :aria-invalid="!!errors['config.host']"
                                    />
                                    <InputError :message="errors['config.host']" />
                                </BFormGroup>
                                <BFormGroup label="Query-Port *" label-for="config_query_port">
                                    <BFormInput
                                        id="config_query_port"
                                        name="config[query_port]"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        :model-value="config.query_port ?? ''"
                                        @update:model-value="(v) => setConfig('query_port', v)"
                                        placeholder="10223"
                                        :aria-invalid="!!errors['config.query_port']"
                                    />
                                    <InputError :message="errors['config.query_port']" />
                                </BFormGroup>
                                <BFormGroup label="Benutzername *" label-for="config_username">
                                    <BFormInput
                                        id="config_username"
                                        name="config[username]"
                                        :model-value="config.username ?? ''"
                                        @update:model-value="(v) => setConfig('username', v)"
                                        placeholder="serveradmin"
                                        :aria-invalid="!!errors['config.username']"
                                    />
                                    <InputError :message="errors['config.username']" />
                                </BFormGroup>
                                <BFormGroup label="Passwort *" label-for="config_password">
                                    <BFormInput
                                        id="config_password"
                                        name="config[password]"
                                        type="password"
                                        :model-value="config.password ?? ''"
                                        @update:model-value="(v) => setConfig('password', v)"
                                        placeholder="Server-Query-Passwort"
                                        :aria-invalid="!!errors['config.password']"
                                    />
                                    <InputError :message="errors['config.password']" />
                                </BFormGroup>
                                <BRow>
                                    <BCol md="6">
                                        <BFormGroup label="Port-Range von *" label-for="config_port_range_min">
                                            <BFormInput
                                                id="config_port_range_min"
                                                name="config[port_range_min]"
                                                type="number"
                                                min="1"
                                                max="65535"
                                                :model-value="config.port_range_min ?? ''"
                                                @update:model-value="(v) => setConfig('port_range_min', v)"
                                                placeholder="10072"
                                                :aria-invalid="!!errors['config.port_range_min']"
                                            />
                                            <InputError :message="errors['config.port_range_min']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup label="Port-Range bis *" label-for="config_port_range_max">
                                            <BFormInput
                                                id="config_port_range_max"
                                                name="config[port_range_max]"
                                                type="number"
                                                min="1"
                                                max="65535"
                                                :model-value="config.port_range_max ?? ''"
                                                @update:model-value="(v) => setConfig('port_range_max', v)"
                                                placeholder="10221"
                                                :aria-invalid="!!errors['config.port_range_max']"
                                            />
                                            <InputError :message="errors['config.port_range_max']" />
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                                <input type="hidden" name="api_token" value="teamspeak" />
                            </template>

                            <BFormGroup label="Name (optional)" label-for="name">
                                <BFormInput
                                    id="name"
                                    name="name"
                                    placeholder="z. B. Plesk Server 1 / Pterodactyl Panel"
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </BFormGroup>

                            <BFormGroup v-if="!showTeamspeakFields" label="Hostname *" label-for="hostname">
                                <BFormInput
                                    id="hostname"
                                    name="hostname"
                                    required
                                    :placeholder="showPterodactylFields ? 'panel.example.com' : 'plesk.example.com'"
                                    :aria-invalid="!!errors.hostname"
                                />
                                <InputError :message="errors.hostname" />
                            </BFormGroup>
                            <BFormGroup v-if="showTeamspeakFields" label="Hostname (optional)" label-for="hostname">
                                <BFormInput
                                    id="hostname"
                                    name="hostname"
                                    placeholder="z. B. TeamSpeak Node 1"
                                    :aria-invalid="!!errors.hostname"
                                />
                                <p class="text-muted small mb-0 mt-1">Anzeigename; Verbindung nutzt IP/Port aus der TeamSpeak-Konfiguration.</p>
                                <InputError :message="errors.hostname" />
                            </BFormGroup>

                            <template v-if="showPleskFields">
                                <BRow>
                                    <BCol md="6">
                                        <BFormGroup label="Port (optional)" label-for="port">
                                            <BFormInput
                                                id="port"
                                                name="port"
                                                type="number"
                                                min="1"
                                                max="65535"
                                                placeholder="leer = Standard (443/80)"
                                                :aria-invalid="!!errors.port"
                                            />
                                            <InputError :message="errors.port" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6">
                                        <BFormGroup>
                                            <input type="hidden" name="use_ssl" :value="useSsl ? '1' : '0'" />
                                            <BFormCheckbox id="use_ssl" v-model="useSsl" switch>
                                                HTTPS (SSL)
                                            </BFormCheckbox>
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                                <BFormGroup label="API-Benutzername (optional)" label-for="api_username">
                                    <BFormInput
                                        id="api_username"
                                        name="api_username"
                                        placeholder="admin"
                                        :aria-invalid="!!errors.api_username"
                                    />
                                    <p class="text-muted small mb-0 mt-1">Bei Angabe: REST API v2 mit Basic Auth (Benutzer + API-Token als Passwort)</p>
                                    <InputError :message="errors.api_username" />
                                </BFormGroup>
                                <BFormGroup label="IP-Adresse" label-for="ip_address">
                                    <BFormInput
                                        id="ip_address"
                                        name="ip_address"
                                        placeholder="z. B. Shared-IP aus dem Reseller-Pool"
                                        :aria-invalid="!!errors.ip_address"
                                    />
                                    <p class="text-muted small mb-0 mt-1">Für Plesk Reseller: Muss eine IP aus Ihrem Reseller-IP-Pool sein (Plesk → IP-Adressen).</p>
                                    <InputError :message="errors.ip_address" />
                                </BFormGroup>
                                <BFormGroup label="API-Token / Passwort *" label-for="api_token">
                                    <BFormInput
                                        id="api_token"
                                        name="api_token"
                                        type="password"
                                        required
                                        placeholder="Plesk API Key oder Passwort bei Basic Auth"
                                        :aria-invalid="!!errors.api_token"
                                    />
                                    <InputError :message="errors.api_token" />
                                </BFormGroup>
                            </template>
                            <template v-if="showPterodactylFields">
                                <input type="hidden" name="api_token" value="pterodactyl" />
                                <input type="hidden" name="port" value="443" />
                                <input type="hidden" name="use_ssl" value="1" />
                            </template>

                            <BFormGroup>
                                <input type="hidden" name="is_active" :value="isActive ? '1' : '0'" />
                                <BFormCheckbox id="is_active" v-model="isActive" switch>
                                    Aktiv
                                </BFormCheckbox>
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary">Speichern</BButton>
                            <Link :href="hostingServersRoutes.index.url()">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </Form>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
