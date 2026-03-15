<!-- Admin: Pterodactyl Nests -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
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

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Nests & Eggs</h4>
                    <p class="text-muted small mb-0">
                        {{ hostingServer.name }} – Wählen Sie ein Nest, um die Eggs anzuzeigen.
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Nests</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Nests gruppieren ähnliche Server-Typen (z. B. Minecraft, Discord Bots). Klicken Sie auf ein
                            Nest, um die Eggs zu sehen.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div
                            v-if="nests.length === 0"
                            class="rounded border-2 border-dashed border-secondary py-5 text-center text-muted"
                        >
                            Keine Nests vom Panel geladen.
                        </div>
                        <BRow v-else>
                            <BCol
                                v-for="nest in nests"
                                :key="nest.id"
                                sm="6"
                                lg="4"
                                class="mb-3"
                            >
                                <Link
                                    :href="eggsUrl(nest.id)"
                                    class="text-decoration-none d-block rounded border border-secondary p-3 h-100 transition bg-light-hover"
                                >
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-2 text-primary">
                                            <Icon icon="egg" />
                                        </div>
                                        <div class="min-w-0 flex-grow-1">
                                            <p class="fw-medium text-body mb-0">{{ nest.name }}</p>
                                            <p
                                                v-if="nest.description"
                                                class="small text-muted text-truncate mb-0 mt-1"
                                                :title="nest.description"
                                            >
                                                {{ nest.description }}
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
