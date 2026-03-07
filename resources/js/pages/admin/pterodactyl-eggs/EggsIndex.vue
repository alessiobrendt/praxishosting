<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Egg, ChevronRight, ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import hostingServers from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';

type HostingServer = { id: number; name: string; hostname: string };
type Nest = { id: number; name: string };
type EggItem = { id: number; name: string; description: string };

type Props = {
    hostingServer: HostingServer;
    nest: Nest;
    eggs: EggItem[];
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
    { title: props.nest.name, href: '#' },
];

const nestsUrl = () => `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests`;
const eggShowUrl = (eggId: number) =>
    `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests/${props.nest.id}/eggs/${eggId}`;
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Eggs – ${nest.name}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-4">
                <Link :href="nestsUrl()">
                    <Button variant="outline" size="sm">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        Zurück zu Nests
                    </Button>
                </Link>
                <div>
                    <Heading level="h1">Eggs – {{ nest.name }}</Heading>
                    <Text class="mt-2" muted>
                        {{ hostingServer.name }} – Wählen Sie ein Egg für Konfiguration (Variablen, Subdomain).
                    </Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Eggs</CardTitle>
                    <CardDescription>
                        Eggs sind konkrete Server-Konfigurationen innerhalb des Nests. Klicken Sie auf ein Egg, um Variablen-Prefill und Subdomain-Einstellungen zu verwalten.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        v-if="eggs.length === 0"
                        class="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center text-muted-foreground dark:border-gray-700"
                    >
                        Keine Eggs in diesem Nest.
                    </div>
                    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            v-for="egg in eggs"
                            :key="egg.id"
                            :href="eggShowUrl(egg.id)"
                            class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-modern hover:border-violet-300 hover:bg-violet-50/50 dark:border-gray-700 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
                        >
                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                            >
                                <Egg class="h-5 w-5" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="font-medium text-gray-900 dark:text-white">{{ egg.name }}</p>
                                <p
                                    v-if="egg.description"
                                    class="mt-0.5 truncate text-sm text-muted-foreground"
                                    :title="egg.description"
                                >
                                    {{ egg.description }}
                                </p>
                            </div>
                            <ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
