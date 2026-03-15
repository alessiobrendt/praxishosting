<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Egg, ChevronRight } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import hostingServers from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';

type HostingServer = { id: number; name: string; hostname: string };
type Nest = { id: number; name: string; description: string };

type Props = {
    hostingServer: HostingServer;
    nests: Nest[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: hostingServers.index.url() },
    { title: props.hostingServer.name, href: hostingServers.show.url(props.hostingServer.id) },
    { title: 'Nests & Eggs', href: '#' },
];

const eggsUrl = (nestId: number) =>
    `/admin/hosting-servers/${props.hostingServer.id}/pterodactyl-nests/${nestId}/eggs`;
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Pterodactyl Nests" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Nests & Eggs</Heading>
                <Text class="mt-2" muted>
                    {{ hostingServer.name }} – Wählen Sie ein Nest, um die Eggs anzuzeigen.
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nests</CardTitle>
                    <CardDescription>
                        Nests gruppieren ähnliche Server-Typen (z. B. Minecraft, Discord Bots). Klicken Sie auf ein Nest, um die Eggs zu sehen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        v-if="nests.length === 0"
                        class="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center text-muted-foreground dark:border-gray-700"
                    >
                        Keine Nests vom Panel geladen.
                    </div>
                    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            v-for="nest in nests"
                            :key="nest.id"
                            :href="eggsUrl(nest.id)"
                            class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-modern hover:border-violet-300 hover:bg-violet-50/50 dark:border-gray-700 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
                        >
                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                            >
                                <Egg class="h-5 w-5" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="font-medium text-gray-900 dark:text-white">{{ nest.name }}</p>
                                <p
                                    v-if="nest.description"
                                    class="mt-0.5 truncate text-sm text-muted-foreground"
                                    :title="nest.description"
                                >
                                    {{ nest.description }}
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
