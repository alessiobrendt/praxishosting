<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import hostingServers from '@/routes/admin/hosting-servers';
import { Eye, Edit } from 'lucide-vue-next';

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
    return type === 'plesk' ? 'Plesk' : type ?? '–';
};
</script>

<template>
    <TableRow>
        <TableCell class="font-medium">{{ server.name ?? '–' }}</TableCell>
        <TableCell>
            <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                {{ server.hostname }}
            </code>
        </TableCell>
        <TableCell class="text-muted-foreground">
            {{ panelTypeLabel(server.panel_type) }}
        </TableCell>
        <TableCell>{{ server.ip_address ?? '–' }}</TableCell>
        <TableCell>
            <Badge :variant="server.is_active ? 'success' : 'error'">
                {{ server.is_active ? 'Aktiv' : 'Inaktiv' }}
            </Badge>
        </TableCell>
        <TableCell class="text-right">
            <div class="flex items-center justify-end gap-2">
                <Link :href="hostingServers.show.url(server.id)">
                    <Button variant="ghost" size="sm" aria-label="Anzeigen">
                        <Eye class="h-4 w-4" />
                    </Button>
                </Link>
                <Link :href="hostingServers.edit.url(server.id)">
                    <Button variant="ghost" size="sm" aria-label="Bearbeiten">
                        <Edit class="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </TableCell>
    </TableRow>
</template>
