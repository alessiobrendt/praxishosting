<!-- Admin: Hosting-Server Karte (Name, Status, API-Check, Aktionen) -->
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { BCard, BCardBody, BButton, BBadge } from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import hostingServers from '@/routes/admin/hosting-servers/index';

export type HostingServerCardData = {
    id: number;
    name: string | null;
    hostname: string;
    ip_address: string | null;
    panel_type?: string;
    is_active: boolean;
    api_checked_at?: string | null;
    api_check_status?: string | null;
    api_check_message?: string | null;
};

const props = defineProps<{
    server: HostingServerCardData;
}>();

const panelLabel = computed(() => {
    const t = props.server.panel_type;
    if (t === 'pterodactyl') return 'Pterodactyl';
    return t === 'plesk' ? 'Plesk' : t === 'teamspeak' ? 'TeamSpeak' : '–';
});

const panelIcon = computed(() => {
    const t = props.server.panel_type;
    if (t === 'pterodactyl') return 'device-gamepad-2';
    if (t === 'teamspeak') return 'headset';
    return 'server';
});

const panelBadgeVariant = computed(() => {
    const t = props.server.panel_type;
    if (t === 'pterodactyl') return 'primary';
    if (t === 'teamspeak') return 'success';
    return 'info';
});

type CheckState = 'idle' | 'loading' | 'ok' | 'error';
const checkState = ref<CheckState>('idle');
const checkMessage = ref<string>('');
const lastCheckedAt = ref<string | null>(null);

const checkUrl = computed(() => hostingServers.check.url(props.server.id));

const displayStatus = computed(() => {
    if (checkState.value === 'loading') return null;
    if (checkState.value === 'ok') return { status: 'ok' as const, message: checkMessage.value || 'Erreichbar' };
    if (checkState.value === 'error') return { status: 'error' as const, message: checkMessage.value };
    if (props.server.api_checked_at && props.server.api_check_status) {
        return {
            status: props.server.api_check_status as 'ok' | 'error',
            message: props.server.api_check_message || (props.server.api_check_status === 'ok' ? 'Erreichbar' : 'Fehler'),
        };
    }
    return null;
});

const displayCheckedAt = computed(() => {
    const at = lastCheckedAt.value || props.server.api_checked_at;
    if (!at) return null;
    const date = new Date(at);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Gerade eben geprüft';
    if (diffMins < 60) return `Vor ${diffMins} Min. geprüft`;
    if (diffHours < 24) return `Vor ${diffHours} Std. geprüft`;
    if (diffDays === 1) return 'Gestern geprüft';
    if (diffDays < 7) return `Vor ${diffDays} Tagen geprüft`;
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
});

const runApiCheck = async () => {
    checkState.value = 'loading';
    checkMessage.value = '';
    try {
        const res = await fetch(checkUrl.value, {
            method: 'GET',
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        });
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
            await res.text();
            checkState.value = 'error';
            checkMessage.value = res.ok
                ? 'Ungültige Antwort vom Server.'
                : `Serverfehler (${res.status}). Bitte Logs prüfen.`;
            return;
        }
        const data = (await res.json()) as { success?: boolean; message?: string; checked_at?: string };
        if (data.success) {
            checkState.value = 'ok';
            checkMessage.value = data.message ?? 'Erreichbar';
        } else {
            checkState.value = 'error';
            checkMessage.value = data.message ?? 'Unbekannter Fehler';
        }
        if (data.checked_at) lastCheckedAt.value = data.checked_at;
    } catch (e) {
        checkState.value = 'error';
        checkMessage.value = e instanceof Error ? e.message : 'Verbindung fehlgeschlagen';
    }
};
</script>

<template>
    <BCard no-body class="h-100 overflow-hidden">
        <BCardBody class="p-3">
            <div class="d-flex align-items-start gap-3">
                <div
                    class="rounded d-flex align-items-center justify-content-center flex-shrink-0 bg-opacity-25 p-2"
                    :class="{
                        'bg-primary': server.panel_type === 'pterodactyl',
                        'bg-info': server.panel_type === 'plesk',
                        'bg-success': server.panel_type === 'teamspeak',
                        'bg-secondary': !server.panel_type || !['plesk', 'pterodactyl', 'teamspeak'].includes(server.panel_type),
                    }"
                >
                    <Icon :icon="panelIcon" class="fs-4" />
                </div>
                <div class="min-w-0 flex-grow-1">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <span class="fw-semibold">{{ server.name || server.hostname }}</span>
                        <BBadge :variant="server.is_active ? 'success' : 'secondary'" class="text-nowrap">
                            {{ server.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </BBadge>
                        <BBadge :variant="panelBadgeVariant" class="text-nowrap">{{ panelLabel }}</BBadge>
                    </div>
                    <code class="d-block mt-1 small rounded bg-light px-2 py-1 text-break">
                        {{ server.hostname }} {{ server.ip_address ? `(${server.ip_address})` : '' }}
                    </code>
                </div>
            </div>

            <!-- API-Check -->
            <div class="mt-3 rounded border bg-light bg-opacity-50 p-2">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="d-flex align-items-center gap-1 small fw-medium">
                        <Icon icon="wifi" class="text-muted" />
                        API-Status
                    </span>
                    <BButton
                        variant="outline-primary"
                        size="sm"
                        :disabled="checkState === 'loading'"
                        @click="runApiCheck"
                    >
                        <span v-if="checkState === 'loading'" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                        {{ checkState === 'loading' ? 'Prüfe…' : 'API prüfen' }}
                    </BButton>
                </div>
                <template v-if="displayStatus">
                    <div
                        v-if="displayStatus.status === 'ok'"
                        class="mt-2 d-flex align-items-center gap-2 small text-success"
                    >
                        <Icon icon="circle-check" />
                        <span>{{ displayStatus.message }}</span>
                    </div>
                    <div v-else class="mt-2 d-flex align-items-start gap-2 small text-danger">
                        <Icon icon="circle-x" class="mt-1 flex-shrink-0" />
                        <span class="break-word">{{ displayStatus.message }}</span>
                    </div>
                </template>
                <p v-if="displayCheckedAt" class="mt-1 mb-0 small text-muted">
                    {{ displayCheckedAt }}
                </p>
                <p v-else-if="!displayStatus && checkState !== 'loading'" class="mt-1 mb-0 small text-muted">
                    Noch nicht geprüft
                </p>
            </div>

            <div class="mt-3 d-flex gap-2">
                <Link :href="hostingServers.show.url(server.id)" class="flex-grow-1">
                    <BButton variant="outline-primary" size="sm" class="w-100">
                        <Icon icon="eye" class="me-1" />
                        Anzeigen
                    </BButton>
                </Link>
                <Link :href="hostingServers.edit.url(server.id)" class="flex-grow-1">
                    <BButton variant="primary" size="sm" class="w-100">
                        <Icon icon="pencil" class="me-1" />
                        Bearbeiten
                    </BButton>
                </Link>
            </div>
        </BCardBody>
    </BCard>
</template>
