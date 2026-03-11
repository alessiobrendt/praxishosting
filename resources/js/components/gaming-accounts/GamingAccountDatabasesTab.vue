<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Database, ExternalLink, Download, Loader2, Copy } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { notify } from '@/composables/useNotify';
import gamingAccounts from '@/routes/gaming-accounts';

const props = withDefaults(
    defineProps<{
        gameServerAccountId: number;
        phpmyadminAvailable?: boolean;
    }>(),
    { phpmyadminAvailable: false },
);

type DbHost = { address?: string; port?: number };
type DatabaseItem = {
    id: string;
    host?: DbHost;
    name?: string;
    username?: string;
    connections_from?: string;
    max_connections?: number;
};

const databases = ref<DatabaseItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const api = computed(() => gamingAccounts.api?.databases);

function hostPort(db: DatabaseItem): string {
    const h = db.host;
    if (!h) return '—';
    const addr = h.address ?? '127.0.0.1';
    const port = h.port ?? 3306;
    return `${addr}:${port}`;
}

function fetchDatabases() {
    if (!api.value?.list?.url) return;
    loading.value = true;
    error.value = null;
    fetch(api.value.list.url(props.gameServerAccountId), { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && Array.isArray(data.databases)) {
                databases.value = data.databases;
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

watch(() => props.gameServerAccountId, fetchDatabases, { immediate: true });

function phpmyadminUrl(databaseId: string): string {
    return api.value?.phpmyadmin?.url?.({ game_server_account: props.gameServerAccountId, databaseId }) ?? '#';
}

function exportUrl(databaseId: string): string {
    return api.value?.export?.url?.({ game_server_account: props.gameServerAccountId, databaseId }) ?? '#';
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
        () => notify.success('In die Zwischenablage kopiert.'),
        () => notify.error('Kopieren fehlgeschlagen.'),
    );
}
</script>

<template>
    <Card>
        <CardContent class="pt-6">
            <h3 class="mb-4 text-lg font-medium">Datenbanken</h3>
            <div v-if="!api" class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
                Routen für Datenbanken sind nicht verfügbar. Bitte Wayfinder ausführen.
            </div>
            <div v-else-if="loading" class="flex justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {{ error }}
            </div>
            <div v-else-if="databases.length === 0" class="py-12 text-center text-muted-foreground">
                <Database class="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Keine Datenbanken vorhanden</p>
                <p class="mt-1 text-sm">Datenbanken können im Pterodactyl-Panel unter diesem Server angelegt werden.</p>
            </div>
            <div v-else class="space-y-3">
                <div
                    v-for="db in databases"
                    :key="db.id"
                    class="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                    <div class="min-w-0 flex-1 space-y-1">
                        <p class="font-medium">{{ db.name ?? db.id }}</p>
                        <p class="text-sm text-muted-foreground">
                            Host: <code class="rounded bg-muted px-1">{{ hostPort(db) }}</code>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="ml-1 h-6 w-6"
                                @click="copyToClipboard(hostPort(db))"
                            >
                                <Copy class="h-3 w-3" />
                            </Button>
                        </p>
                        <p class="text-sm text-muted-foreground">
                            Benutzer: <code class="rounded bg-muted px-1">{{ db.username ?? '—' }}</code>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="ml-1 h-6 w-6"
                                @click="copyToClipboard(db.username ?? '')"
                            >
                                <Copy class="h-3 w-3" />
                            </Button>
                        </p>
                    </div>
                    <div class="flex shrink-0 gap-2">
                        <Button
                            v-if="phpmyadminAvailable"
                            variant="outline"
                            size="sm"
                            :href="phpmyadminUrl(db.id)"
                            target="_blank"
                            as="a"
                        >
                            <ExternalLink class="mr-1 h-4 w-4" />
                            In phpMyAdmin öffnen
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            :href="exportUrl(db.id)"
                            target="_blank"
                            as="a"
                        >
                            <Download class="mr-1 h-4 w-4" />
                            SQL-Export (Backup)
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
