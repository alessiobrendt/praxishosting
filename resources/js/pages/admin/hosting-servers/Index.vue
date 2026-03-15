<!-- Admin: Hosting-Server Übersicht -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { BButton } from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import hostingServersRoutes from '@/routes/admin/hosting-servers/index';
import type { BreadcrumbItem } from '@/types';
import HostingServersTable from './components/HostingServersTable.vue';
import PageHeader from './components/PageHeader.vue';

type HostingServer = {
    id: number;
    name: string | null;
    hostname: string;
    ip_address: string | null;
    panel_type?: string;
    is_active: boolean;
};

type Props = {
    hostingServers: {
        data: HostingServer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Server', href: hostingServersRoutes.index.url() },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server" />

        <div>
            <PageHeader
                title="Hosting-Server"
                description="Plesk- und Pterodactyl-Server (nicht markenbezogen)"
            >
                <template #action>
                    <Link :href="hostingServersRoutes.create.url()">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neuer Server
                        </BButton>
                    </Link>
                </template>
            </PageHeader>

            <HostingServersTable
                :servers="props.hostingServers.data"
                :links="props.hostingServers.links"
            />
        </div>
    </AdminLayout>
</template>
