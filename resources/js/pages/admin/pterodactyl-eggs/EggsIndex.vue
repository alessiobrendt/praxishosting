<!-- Admin: Pterodactyl Eggs (pro Nest) -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
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

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
                    <Link :href="nestsUrl()">
                        <BButton variant="outline-secondary" size="sm">
                            <Icon icon="arrow-left" class="me-2" />
                            Zurück zu Nests
                        </BButton>
                    </Link>
                    <div>
                        <h4 class="mb-1">Eggs – {{ nest.name }}</h4>
                        <p class="text-muted small mb-0">
                            {{ hostingServer.name }} – Wählen Sie ein Egg für Konfiguration (Variablen, Subdomain).
                        </p>
                    </div>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Eggs</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Eggs sind konkrete Server-Konfigurationen innerhalb des Nests. Klicken Sie auf ein Egg,
                            um Variablen-Prefill und Subdomain-Einstellungen zu verwalten.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div
                            v-if="eggs.length === 0"
                            class="rounded border-2 border-dashed border-secondary py-5 text-center text-muted"
                        >
                            Keine Eggs in diesem Nest.
                        </div>
                        <BRow v-else>
                            <BCol
                                v-for="egg in eggs"
                                :key="egg.id"
                                sm="6"
                                lg="4"
                                class="mb-3"
                            >
                                <Link
                                    :href="eggShowUrl(egg.id)"
                                    class="text-decoration-none d-block rounded border border-secondary p-3 h-100 transition bg-light-hover"
                                >
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-2 text-primary">
                                            <Icon icon="egg" />
                                        </div>
                                        <div class="min-w-0 flex-grow-1">
                                            <p class="fw-medium text-body mb-0">{{ egg.name }}</p>
                                            <p
                                                v-if="egg.description"
                                                class="small text-muted text-truncate mb-0 mt-1"
                                                :title="egg.description"
                                            >
                                                {{ egg.description }}
                                            </p>
                                        </div>
                                        <Icon icon="chevron-right" class="flex-shrink-0 text-muted" />
                                    </div>
                                </Link>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
