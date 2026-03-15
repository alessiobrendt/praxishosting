<!-- Admin: Hosting-Server Tabellenzeile (für BTable) -->
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { BButton, BBadge } from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import hostingServers from '@/routes/admin/hosting-servers/index';

export type HostingServerRowData = {
    id: number;
    name: string | null;
    hostname: string;
    ip_address: string | null;
    panel_type?: string;
    is_active: boolean;
};

defineProps<{
    server: HostingServerRowData;
}>();

const panelTypeLabel = (type: string | undefined): string => {
    if (type === 'pterodactyl') return 'Pterodactyl';
    return type === 'plesk' ? 'Plesk' : type === 'teamspeak' ? 'TeamSpeak' : type ?? '–';
};
</script>

<template>
    <tr>
        <td class="fw-medium">{{ server.name ?? '–' }}</td>
        <td>
            <code class="rounded bg-light px-2 py-1 small">{{ server.hostname }}</code>
        </td>
        <td class="text-muted">{{ panelTypeLabel(server.panel_type) }}</td>
        <td>{{ server.ip_address ?? '–' }}</td>
        <td>
            <BBadge :variant="server.is_active ? 'success' : 'secondary'">
                {{ server.is_active ? 'Aktiv' : 'Inaktiv' }}
            </BBadge>
        </td>
        <td class="text-end">
            <div class="d-flex align-items-center justify-content-end gap-1">
                <Link :href="hostingServers.show.url(server.id)">
                    <BButton variant="outline-primary" size="sm" aria-label="Anzeigen">
                        <Icon icon="eye" />
                    </BButton>
                </Link>
                <Link :href="hostingServers.edit.url(server.id)">
                    <BButton variant="outline-primary" size="sm" aria-label="Bearbeiten">
                        <Icon icon="pencil" />
                    </BButton>
                </Link>
            </div>
        </td>
    </tr>
</template>
