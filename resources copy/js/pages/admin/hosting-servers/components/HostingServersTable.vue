<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import HostingServerCard from './HostingServerCard.vue';
import type { HostingServerCardData } from './HostingServerCard.vue';

export type PaginationLink = { url: string | null; label: string; active: boolean };

defineProps<{
    servers: HostingServerCardData[];
    links: PaginationLink[];
    emptyMessage?: string;
}>();

const handlePagination = (url: string) => {
    router.get(url);
};
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Alle Server</CardTitle>
            <CardDescription>
                Plesk- und Pterodactyl-Server. API prüfen prüft die Verbindung zum Panel.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div
                v-if="servers.length > 0"
                class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
                <HostingServerCard
                    v-for="server in servers"
                    :key="server.id"
                    :server="server"
                />
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700"
            >
                <p class="text-muted-foreground">
                    {{ emptyMessage ?? 'Keine Server vorhanden' }}
                </p>
            </div>
        </CardContent>
    </Card>

    <div v-if="links && links.length > 3" class="flex justify-center">
        <Pagination :links="links" @navigate="handlePagination" />
    </div>
</template>
