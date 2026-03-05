<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Eye, Edit, Server, Gamepad2, CheckCircle2, XCircle, Loader2, Wifi } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    return t === 'plesk' ? 'Plesk' : t ?? '–';
});

const panelIcon = computed(() => (props.server.panel_type === 'pterodactyl' ? Gamepad2 : Server));

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
    <Card class="overflow-hidden transition-modern hover:shadow-modern-lg" hover>
        <CardContent class="p-5">
            <div class="flex items-start gap-4">
                <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    :class="
                        server.panel_type === 'pterodactyl'
                            ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400'
                            : 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400'
                    "
                >
                    <component :is="panelIcon" class="h-6 w-6" />
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="font-semibold text-gray-900 dark:text-white">
                            {{ server.name || server.hostname }}
                        </span>
                        <Badge :variant="server.is_active ? 'success' : 'error'" size="sm">
                            {{ server.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </Badge>
                        <Badge
                            size="sm"
                            :class="
                                server.panel_type === 'pterodactyl'
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300'
                                    : 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                            "
                        >
                            {{ panelLabel }}
                        </Badge>
                    </div>
                    <code
                        class="mt-1 block truncate rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                        {{ server.hostname }} {{ server.ip_address ? `(${server.ip_address})` : '' }}
                    </code>
                
                </div>
            </div>

            <!-- API-Check -->
            <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Wifi class="h-4 w-4 text-muted-foreground" />
                        API-Status
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="checkState === 'loading'"
                        @click="runApiCheck"
                    >
                        <Loader2 v-if="checkState === 'loading'" class="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        {{ checkState === 'loading' ? 'Prüfe…' : 'API prüfen' }}
                    </Button>
                </div>
                <template v-if="displayStatus">
                    <div
                        v-if="displayStatus.status === 'ok'"
                        class="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                        <CheckCircle2 class="h-4 w-4 shrink-0" />
                        <span>{{ displayStatus.message }}</span>
                    </div>
                    <div
                        v-else
                        class="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                        <XCircle class="mt-0.5 h-4 w-4 shrink-0" />
                        <span class="break-words">{{ displayStatus.message }}</span>
                    </div>
                </template>
                <p v-if="displayCheckedAt" class="mt-1 text-xs text-muted-foreground">
                    {{ displayCheckedAt }}
                </p>
                <p v-else-if="!displayStatus && checkState !== 'loading'" class="mt-1 text-xs text-muted-foreground">
                    Noch nicht geprüft
                </p>
            </div>

            <div class="mt-4 flex gap-2">
                <Link :href="hostingServers.show.url(server.id)" class="flex-1">
                    <Button variant="outline" size="sm" class="w-full">
                        <Eye class="mr-1.5 h-4 w-4" />
                        Anzeigen
                    </Button>
                </Link>
                <Link :href="hostingServers.edit.url(server.id)" class="flex-1">
                    <Button size="sm" class="w-full">
                        <Edit class="mr-1.5 h-4 w-4" />
                        Bearbeiten
                    </Button>
                </Link>
            </div>
        </CardContent>
    </Card>
</template>
