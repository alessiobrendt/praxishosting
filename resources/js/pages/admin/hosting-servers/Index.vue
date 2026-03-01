<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import hostingServers from '@/routes/admin/hosting-servers';
import type { BreadcrumbItem } from '@/types';
import PageHeader from './components/PageHeader.vue';
import HostingServersTable from './components/HostingServersTable.vue';
import { Plus } from 'lucide-vue-next';

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
    { title: 'Hosting-Server', href: hostingServers.index.url() },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Server" />

        <div class="space-y-6">
            <PageHeader
                title="Hosting-Server"
                description="Plesk- und Pterodactyl-Server (nicht markenbezogen)"
            >
                <template #action>
                    <Link :href="hostingServers.create.url()">
                        <Button>
                            <Plus class="mr-2 h-4 w-4" />
                            Neuer Server
                        </Button>
                    </Link>
                </template>
            </PageHeader>

            <HostingServersTable
                :servers="props.hostingServers.data"
                :links="props.hostingServers.links"
            />
        </div>
    </AppLayout>
</template>
