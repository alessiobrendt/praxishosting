<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { ArrowLeft, Save, Server } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import InputError from '@/components/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import hostingServers from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';

type HostingServer = { id: number; name: string; hostname: string };
type Nest = { id: number; name: string };
type Egg = { id: number; name: string; description: string; docker_image: string; startup: string };
type Variable = {
    id: number;
    name: string;
    env_variable: string;
    default_value: string;
    rules: string;
    user_viewable: boolean;
    user_editable: boolean;
};
type Config = {
    variable_defaults: Record<string, string>;
    required_env_variables: string[];
    optional_env_variables?: string[];
    variable_titles?: Record<string, string>;
    variable_descriptions?: Record<string, string>;
    subdomain_srv_protocol: string;
    subdomain_protocol_type: string;
    gameq_type: string;
};
type GameQTypes = Record<string, string>;

type Props = {
    hostingServer: HostingServer;
    nest: Nest;
    egg: Egg;
    variables: Variable[];
    config: Config;
    gameqTypes?: GameQTypes;
};

const props = withDefaults(defineProps<Props>(), {
    gameqTypes: () => ({}),
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: hostingServers.index.url() },
    { title: props.hostingServer.name, href: hostingServers.show.url(props.hostingServer.id) },
    {
        title: 'Nests & Eggs',
        href: `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests`,
    },
    {
        title: props.nest.name,
        href: `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests/${props.nest.id}/eggs`,
    },
    { title: props.egg.name, href: '#' },
];

const eggsIndexUrl = () =>
    `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests/${props.nest.id}/eggs`;
const configUpdateUrl = () =>
    `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests/${props.nest.id}/eggs/${props.egg.id}/config`;

const initialDefaults: Record<string, string> = { ...props.config.variable_defaults };
for (const v of props.variables) {
    if (!(v.env_variable in initialDefaults)) {
        initialDefaults[v.env_variable] = props.config.variable_defaults[v.env_variable] ?? v.default_value ?? '';
    }
}
const variableDefaults = ref<Record<string, string>>(initialDefaults);
const titlesInit: Record<string, string> = {};
const descriptionsInit: Record<string, string> = {};
for (const v of props.variables) {
    titlesInit[v.env_variable] = props.config.variable_titles?.[v.env_variable] ?? '';
    descriptionsInit[v.env_variable] = props.config.variable_descriptions?.[v.env_variable] ?? '';
}
const variableTitles = ref<Record<string, string>>(titlesInit);
const variableDescriptions = ref<Record<string, string>>(descriptionsInit);
const requiredEnvVariables = ref<Set<string>>(new Set(props.config.required_env_variables));
const optionalEnvVariables = ref<Set<string>>(new Set(props.config.optional_env_variables ?? []));
const subdomainSrvProtocol = ref(props.config.subdomain_srv_protocol);
const subdomainProtocolType = ref(props.config.subdomain_protocol_type);
const gameqType = ref(props.config.gameq_type);

type VariableBehavior = 'service_prefill' | 'user_required' | 'user_optional';
function getInitialBehavior(envVar: string): VariableBehavior {
    if (props.config.required_env_variables.includes(envVar)) return 'user_required';
    if ((props.config.optional_env_variables ?? []).includes(envVar)) return 'user_optional';
    return 'service_prefill';
}

const variableBehavior = ref<Record<string, VariableBehavior>>(
    Object.fromEntries(props.variables.map((v) => [v.env_variable, getInitialBehavior(v.env_variable)]))
);

function setVariableBehavior(envVar: string, behavior: VariableBehavior) {
    variableBehavior.value = { ...variableBehavior.value, [envVar]: behavior };
    const reqSet = new Set(requiredEnvVariables.value);
    const optSet = new Set(optionalEnvVariables.value);
    reqSet.delete(envVar);
    optSet.delete(envVar);
    if (behavior === 'user_required') reqSet.add(envVar);
    else if (behavior === 'user_optional') optSet.add(envVar);
    requiredEnvVariables.value = reqSet;
    optionalEnvVariables.value = optSet;
}

const isRequired = (envVar: string) => variableBehavior.value[envVar] === 'user_required';
const isOptional = (envVar: string) => variableBehavior.value[envVar] === 'user_optional';

function isBooleanVariable(rules: string): boolean {
    return rules.toLowerCase().includes('boolean');
}

function isBooleanDefault(val: string | undefined): boolean {
    if (val === undefined || val === null) return false;
    const s = String(val).toLowerCase().trim();
    return s === '1' || s === 'true' || s === 'yes';
}

function setBooleanDefault(envVar: string, checked: boolean): void {
    variableDefaults.value[envVar] = checked ? '1' : '0';
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Egg: ${egg.name}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-4">
                <Link :href="eggsIndexUrl()">
                    <Button variant="outline" size="sm">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        Zurück zu Eggs
                    </Button>
                </Link>
                <div>
                    <Heading level="h1">{{ egg.name }}</Heading>
                    <Text class="mt-2" muted>
                        {{ nest.name }} – Variablen-Prefill, Pflichtfelder und Subdomain-Einstellungen für dieses Egg.
                    </Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Egg-Details</CardTitle>
                    <CardDescription>Vom Pterodactyl-Panel (nur Leseansicht)</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <p v-if="egg.description" class="text-sm text-muted-foreground">{{ egg.description }}</p>
                    <div class="flex flex-wrap gap-4">
                        <div class="rounded bg-muted/50 px-3 py-2">
                            <span class="text-xs text-muted-foreground">Docker Image</span>
                            <code class="ml-2 text-sm">{{ egg.docker_image }}</code>
                        </div>
                    </div>
                    <div v-if="egg.startup" class="rounded bg-muted/50 p-3">
                        <span class="text-xs text-muted-foreground">Startup</span>
                        <pre class="mt-1 max-w-full whitespace-pre-wrap break-words text-sm">{{ egg.startup }}</pre>
                    </div>
                </CardContent>
            </Card>

            <Form
                :action="configUpdateUrl()"
                method="post"
                class="block"
                v-slot="{ errors }"
            >
                <input type="hidden" name="_method" value="PUT" />

                <Card>
                    <CardHeader>
                        <CardTitle>Service-Variablen</CardTitle>
                        <CardDescription>
                            <strong>Durch Service vorbefüllen:</strong> Wert von uns setzen, User sieht das Feld nicht. –
                            <strong>Vom User ausfüllen (Pflichtfeld):</strong> Kunde muss es beim Server-Erstellen ausfüllen. –
                            <strong>Vom User ausfüllen (Optional):</strong> Kunde kann es ausfüllen, ist aber nicht verpflichtet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            v-if="variables.length === 0"
                            class="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center text-muted-foreground dark:border-gray-700"
                        >
                            Dieses Egg hat keine Variablen.
                        </div>
                        <div v-else class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="border-b border-gray-200 dark:border-gray-700">
                                        <th class="pb-2 pr-4 text-left font-medium">Variable / Env</th>
                                        <th class="pb-2 pr-4 text-left font-medium">Titel (für User)</th>
                                        <th class="pb-2 pr-4 text-left font-medium">Beschreibung (für User)</th>
                                        <th class="pb-2 pr-4 text-left font-medium">Default / Prefill (Service-Wert)</th>
                                        <th class="pb-2 pr-4 text-left font-medium">Verhalten</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="v in variables"
                                        :key="v.id"
                                        class="border-b border-gray-100 dark:border-gray-800"
                                    >
                                        <td class="py-3 pr-4">
                                            <span class="font-medium">{{ v.name }}</span>
                                            <code class="ml-2 rounded bg-muted px-1.5 text-xs">{{ v.env_variable }}</code>
                                            <p v-if="v.rules" class="mt-1 text-xs text-muted-foreground">{{ v.rules }}</p>
                                        </td>
                                        <td class="py-3 pr-4">
                                            <Input
                                                :name="`config[variable_titles][${v.env_variable}]`"
                                                v-model="variableTitles[v.env_variable]"
                                                type="text"
                                                :placeholder="v.name"
                                                class="max-w-[180px]"
                                            />
                                        </td>
                                        <td class="py-3 pr-4">
                                            <textarea
                                                :name="`config[variable_descriptions][${v.env_variable}]`"
                                                v-model="variableDescriptions[v.env_variable]"
                                                rows="2"
                                                placeholder="Optionale Beschreibung für den User"
                                                class="flex min-h-[60px] w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </td>
                                        <td class="py-3 pr-4">
                                            <template v-if="isBooleanVariable(v.rules)">
                                                <input
                                                    type="hidden"
                                                    :name="`config[variable_defaults][${v.env_variable}]`"
                                                    :value="variableDefaults[v.env_variable] ?? '0'"
                                                />
                                                <label class="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        :checked="isBooleanDefault(variableDefaults[v.env_variable])"
                                                        class="h-4 w-4 rounded border-input"
                                                        @change="
                                                            setBooleanDefault(
                                                                v.env_variable,
                                                                (($event.target as HTMLInputElement).checked)
                                                            )
                                                        "
                                                    />
                                                    <span class="text-sm">An</span>
                                                </label>
                                            </template>
                                            <Input
                                                v-else
                                                :name="`config[variable_defaults][${v.env_variable}]`"
                                                v-model="variableDefaults[v.env_variable]"
                                                type="text"
                                                :placeholder="v.default_value"
                                                class="max-w-xs"
                                            />
                                        </td>
                                        <td class="py-3">
                                            <div class="flex flex-col gap-2">
                                                <label class="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        :name="`behavior_${v.env_variable}`"
                                                        value="service_prefill"
                                                        :checked="variableBehavior[v.env_variable] === 'service_prefill'"
                                                        class="rounded-full border-input"
                                                        @change="setVariableBehavior(v.env_variable, 'service_prefill')"
                                                    />
                                                    <span class="text-sm">Durch Service vorbefüllen</span>
                                                </label>
                                                <label class="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        :name="`behavior_${v.env_variable}`"
                                                        value="user_required"
                                                        :checked="variableBehavior[v.env_variable] === 'user_required'"
                                                        class="rounded-full border-input"
                                                        @change="setVariableBehavior(v.env_variable, 'user_required')"
                                                    />
                                                    <span class="text-sm">Vom User ausfüllen (Pflichtfeld)</span>
                                                </label>
                                                <label class="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        :name="`behavior_${v.env_variable}`"
                                                        value="user_optional"
                                                        :checked="variableBehavior[v.env_variable] === 'user_optional'"
                                                        class="rounded-full border-input"
                                                        @change="setVariableBehavior(v.env_variable, 'user_optional')"
                                                    />
                                                    <span class="text-sm">Vom User ausfüllen (Optional)</span>
                                                </label>
                                            </div>
                                            <input
                                                v-if="variableBehavior[v.env_variable] === 'user_required'"
                                                type="hidden"
                                                :name="`config[required_env_variables][]`"
                                                :value="v.env_variable"
                                            />
                                            <input
                                                v-if="variableBehavior[v.env_variable] === 'user_optional'"
                                                type="hidden"
                                                :name="`config[optional_env_variables][]`"
                                                :value="v.env_variable"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card class="mt-6">
                    <CardHeader>
                        <CardTitle>GameQ / Spieler-Anzeige</CardTitle>
                        <CardDescription>
                            Wenn gesetzt, wird auf der Gaming-Account-Seite die aktuelle Spieleranzahl (GameQ bzw. FiveM) neben der Netzwerk-Card angezeigt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <Label for="gameq_type">Spiel / Protokoll</Label>
                            <select
                                id="gameq_type"
                                name="config[gameq_type]"
                                v-model="gameqType"
                                class="flex h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                                <option
                                    v-for="(label, value) in gameqTypes"
                                    :key="value"
                                    :value="value"
                                >
                                    {{ label }}
                                </option>
                            </select>
                            <InputError :message="errors['config.gameq_type']" />
                        </div>
                    </CardContent>
                </Card>

                <Card class="mt-6">
                    <CardHeader>
                        <CardTitle>Subdomain (SRV)</CardTitle>
                        <CardDescription>
                            Beim optionalen Subdomain-Feature wird ein SRV-Eintrag angelegt (Node:Port). SRV-Protokoll z. B. <code>_minecraft</code>; Typ: tcp, udp oder tls. Ohne Protokoll: Subdomain zeigt z. B. myserver.example.com:25565; mit SRV: myserver.example.com.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="subdomain_srv_protocol">SRV-Protokoll</Label>
                            <Input
                                id="subdomain_srv_protocol"
                                name="config[subdomain_srv_protocol]"
                                v-model="subdomainSrvProtocol"
                                placeholder="z. B. _minecraft"
                                maxlength="64"
                            />
                            <InputError :message="errors['config.subdomain_srv_protocol']" />
                        </div>
                        <div class="space-y-2">
                            <Label for="subdomain_protocol_type">Protokoll-Typ</Label>
                            <select
                                id="subdomain_protocol_type"
                                name="config[subdomain_protocol_type]"
                                v-model="subdomainProtocolType"
                                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                                <option value="none">none</option>
                                <option value="tcp">tcp</option>
                                <option value="udp">udp</option>
                                <option value="tls">tls</option>
                            </select>
                            <InputError :message="errors['config.subdomain_protocol_type']" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                            <Save class="mr-2 h-4 w-4" />
                            Konfiguration speichern
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </div>
    </AdminLayout>
</template>
