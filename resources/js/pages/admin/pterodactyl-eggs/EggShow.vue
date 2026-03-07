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
    subdomain_srv_protocol: string;
    subdomain_protocol_type: string;
};

type Props = {
    hostingServer: HostingServer;
    nest: Nest;
    egg: Egg;
    variables: Variable[];
    config: Config;
};

const props = defineProps<Props>();

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
const requiredEnvVariables = ref<Set<string>>(new Set(props.config.required_env_variables));
const subdomainSrvProtocol = ref(props.config.subdomain_srv_protocol);
const subdomainProtocolType = ref(props.config.subdomain_protocol_type);

const toggleRequired = (envVar: string) => {
    const set = new Set(requiredEnvVariables.value);
    if (set.has(envVar)) {
        set.delete(envVar);
    } else {
        set.add(envVar);
    }
    requiredEnvVariables.value = set;
};

const isRequired = (envVar: string) => requiredEnvVariables.value.has(envVar);
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
                        <pre class="mt-1 overflow-x-auto text-sm">{{ egg.startup }}</pre>
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
                            Default-Werte werden im Kundenformular vorausgefüllt. „Vom User ausfüllen“ = Pflichtfeld beim Server-Erstellen.
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
                                        <th class="pb-2 pr-4 text-left font-medium">Default / Prefill</th>
                                        <th class="pb-2 pr-4 text-left font-medium">Vom User ausfüllen</th>
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
                                                v-if="v.user_editable"
                                                :name="`config[variable_defaults][${v.env_variable}]`"
                                                v-model="variableDefaults[v.env_variable]"
                                                type="text"
                                                :placeholder="v.default_value"
                                                class="max-w-xs"
                                            />
                                            <span v-else class="text-muted-foreground">–</span>
                                        </td>
                                        <td class="py-3">
                                            <label class="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    :name="`config[required_env_variables][]`"
                                                    :value="v.env_variable"
                                                    :checked="isRequired(v.env_variable)"
                                                    @change="toggleRequired(v.env_variable)"
                                                    class="rounded border-input"
                                                />
                                                <span class="text-sm">Pflichtfeld</span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
