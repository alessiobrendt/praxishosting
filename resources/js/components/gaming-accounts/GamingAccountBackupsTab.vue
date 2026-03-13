<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Archive, Plus, Download, RotateCcw, Trash2, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { notify } from '@/composables/useNotify';
import { formatBytes } from '@/composables/useGamingAccountFormatters';
import gamingAccounts from '@/routes/gaming-accounts';

const props = defineProps<{
    gameServerAccountId: string;
}>();

type Backup = {
    uuid: string;
    name?: string;
    bytes?: number;
    created_at?: string;
    is_successful?: boolean;
};

const backups = ref<Backup[]>([]);
const loading = ref(false);
const creating = ref(false);
const error = ref<string | null>(null);

const api = computed(() => gamingAccounts.api.backups);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && (meta as HTMLMetaElement).content) || '';
}

function fetchBackups() {
    loading.value = true;
    error.value = null;
    fetch(api.value.list.url(props.gameServerAccountId), { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && Array.isArray(data.backups)) {
                backups.value = data.backups;
            } else {
                error.value = data.message ?? 'Fehler beim Laden';
            }
        })
        .catch((e) => {
            error.value = e.message ?? 'Verbindungsfehler';
        })
        .finally(() => {
            loading.value = false;
        });
}

watch(() => props.gameServerAccountId, fetchBackups, { immediate: true });

function createBackup() {
    if (creating.value) return;
    creating.value = true;
    fetch(api.value.create.url(props.gameServerAccountId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({}),
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.success) {
                notify.success('Backup wird erstellt.');
                fetchBackups();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'))
        .finally(() => {
            creating.value = false;
        });
}

function downloadUrl(uuid: string) {
    return api.value.download.url({ game_server_account: props.gameServerAccountId, backupUuid: uuid });
}

function restoreBackup(uuid: string) {
    if (!confirm('Backup wiederherstellen? Alle aktuellen Daten werden überschrieben.')) return;
    fetch(api.value.restore.url({ game_server_account: props.gameServerAccountId, backupUuid: uuid }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ truncate: true }),
    })
        .then((r) => r.json().catch(() => ({})))
        .then((data) => {
            if (data.success !== false) {
                notify.success('Wiederherstellung gestartet.');
                fetchBackups();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'));
}

function deleteBackup(uuid: string) {
    if (!confirm('Backup wirklich löschen?')) return;
    fetch(api.value.delete.url({ game_server_account: props.gameServerAccountId, backupUuid: uuid }), {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
        .then((r) => {
            if (r.status === 204) return { success: true };
            return r.json().catch(() => ({}));
        })
        .then((data) => {
            if (data?.success !== false) {
                notify.success('Backup gelöscht.');
                fetchBackups();
            } else {
                notify.error(data?.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'));
}

function formatDate(val: string | undefined) {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString('de-DE');
    } catch {
        return '—';
    }
}
</script>

<template>
    <Card>
        <CardContent class="pt-6">
            <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-medium">Backups</h3>
                <Button :disabled="creating" @click="createBackup">
                    <Loader2 v-if="creating" class="mr-2 h-4 w-4 animate-spin" />
                    <Plus v-else class="mr-2 h-4 w-4" />
                    Backup erstellen
                </Button>
            </div>
            <div v-if="loading" class="flex justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {{ error }}
            </div>
            <div v-else-if="backups.length === 0" class="py-12 text-center text-muted-foreground">
                <Archive class="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Keine Backups vorhanden</p>
            </div>
            <div v-else class="space-y-2">
                <div
                    v-for="b in backups"
                    :key="b.uuid"
                    class="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                    <div>
                        <p class="font-medium">{{ b.name ?? b.uuid }}</p>
                        <p class="text-xs text-muted-foreground">
                            {{ formatDate(b.created_at) }}
                            · {{ formatBytes(b.bytes ?? 0) }}
                            <span v-if="b.is_successful === false" class="text-amber-600">(läuft…)</span>
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <Button
                            v-if="b.is_successful !== false"
                            variant="outline"
                            size="sm"
                            :href="downloadUrl(b.uuid)"
                            target="_blank"
                            as="a"
                        >
                            <Download class="mr-1 h-4 w-4" />
                            Download
                        </Button>
                        <Button
                            v-if="b.is_successful !== false"
                            variant="outline"
                            size="sm"
                            @click="restoreBackup(b.uuid)"
                        >
                            <RotateCcw class="mr-1 h-4 w-4" />
                            Wiederherstellen
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            class="text-destructive hover:text-destructive"
                            @click="deleteBackup(b.uuid)"
                        >
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
