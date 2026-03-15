<!-- Admin: Hosting-Server Tabelle/Karten-Grid mit Pagination -->
<script setup lang="ts">
import { BCard, BCardHeader, BCardTitle, BCardBody } from 'bootstrap-vue-next';
import HostingServerCard from './HostingServerCard.vue';
import type { HostingServerCardData } from './HostingServerCard.vue';

export type PaginationLink = { url: string | null; label: string; active: boolean };

defineProps<{
    servers: HostingServerCardData[];
    links: PaginationLink[];
    emptyMessage?: string;
}>();

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};
</script>

<template>
    <BCard no-body>
        <BCardHeader>
            <BCardTitle class="mb-0">Alle Server</BCardTitle>
            <p class="text-muted small mb-0 mt-1">
                Plesk- und Pterodactyl-Server. API prüfen prüft die Verbindung zum Panel.
            </p>
        </BCardHeader>
        <BCardBody>
            <div
                v-if="servers.length > 0"
                class="row g-3 row-cols-1 row-cols-sm-2 row-cols-xl-3"
            >
                <div v-for="server in servers" :key="server.id" class="col">
                    <HostingServerCard :server="server" />
                </div>
            </div>
            <div
                v-else
                class="text-center py-5 rounded border border-2 border-dashed"
            >
                <p class="text-muted mb-0">{{ emptyMessage ?? 'Keine Server vorhanden' }}</p>
            </div>
        </BCardBody>
    </BCard>

    <nav v-if="links && links.length > 3" class="d-flex justify-content-center p-3">
        <ul class="pagination pagination-sm mb-0">
            <li
                v-for="(link, idx) in links"
                :key="idx"
                class="page-item"
                :class="{ active: link.active, disabled: !link.url }"
            >
                <a
                    v-if="link.url"
                    class="page-link"
                    href="#"
                    @click.prevent="handlePagination(link.url!)"
                    v-html="link.label"
                />
                <span v-else class="page-link" v-html="link.label" />
            </li>
        </ul>
    </nav>
</template>
