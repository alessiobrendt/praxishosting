<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Database, ExternalLink, Download, Loader2, Copy, KeyRound } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { notify } from '@/composables/useNotify';
import gamingAccounts from '@/routes/gaming-accounts';

const props = withDefaults(
    defineProps<{
        gameServerAccountId: string;
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
type Credentials = {
    id: string;
    host: { address: string; port: number };
    name: string;
    username: string;
    password: string;
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

const connectionModalOpen = ref(false);
const connectionModalDb = ref<DatabaseItem | null>(null);
const connectionModalCredentials = ref<Credentials | null>(null);
const connectionModalCredentialsLoading = ref(false);
const connectionModalCredentialsError = ref<string | null>(null);

function hostPortFromCredentials(c: Credentials): string {
    return `${c.host?.address ?? '127.0.0.1'}:${c.host?.port ?? 3306}`;
}

function openConnectionModal(db: DatabaseItem) {
    connectionModalDb.value = db;
    connectionModalOpen.value = true;
    connectionModalCredentials.value = null;
    connectionModalCredentialsError.value = null;
    const credentialsUrl = api.value?.credentials?.url?.({
        game_server_account: props.gameServerAccountId,
        databaseId: db.id,
    });
    if (!credentialsUrl) {
        connectionModalCredentialsError.value = 'Route nicht verfügbar.';
        return;
    }
    connectionModalCredentialsLoading.value = true;
    fetch(credentialsUrl, { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && data.credentials) {
                connectionModalCredentials.value = data.credentials;
                connectionModalCredentialsError.value = null;
            } else {
                connectionModalCredentialsError.value = data.message ?? 'Zugangsdaten konnten nicht geladen werden.';
            }
        })
        .catch((e) => {
            connectionModalCredentialsError.value = e.message ?? 'Verbindungsfehler';
        })
        .finally(() => {
            connectionModalCredentialsLoading.value = false;
        });
}

function closeConnectionModal() {
    connectionModalOpen.value = false;
    connectionModalDb.value = null;
    connectionModalCredentials.value = null;
    connectionModalCredentialsError.value = null;
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

                        <Button
                            variant="outline"
                            size="sm"
                            class="mt-2"
                            @click="openConnectionModal(db)"
                        >
                            <KeyRound class="mr-1 h-4 w-4" />
                            Verbindungsinformationen
                        </Button>
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

    <Dialog :open="connectionModalOpen" @update:open="(v) => !v && closeConnectionModal()">
        <DialogContent class="sm:max-w-md" :show-close-button="true">
            <DialogHeader>
                <DialogTitle>Verbindungsinformationen</DialogTitle>
                <DialogDescription>
                    Zugangsdaten für die Datenbank {{ connectionModalDb?.name ?? connectionModalDb?.id ?? '—' }}. Mit dem Button kopieren Sie den jeweiligen Wert.
                </DialogDescription>
            </DialogHeader>
            <div v-if="connectionModalDb" class="space-y-3 py-2">
                <div v-if="connectionModalCredentialsLoading" class="flex justify-center py-6">
                    <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <div v-else-if="connectionModalCredentialsError" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    {{ connectionModalCredentialsError }}
                </div>
                <template v-else-if="connectionModalCredentials">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-sm text-muted-foreground">Host</span>
                        <div class="flex items-center gap-1">
                            <code class="rounded bg-muted px-2 py-1 text-sm">{{ hostPortFromCredentials(connectionModalCredentials) }}</code>
                            <Button variant="ghost" size="icon" class="h-8 w-8" @click="copyToClipboard(hostPortFromCredentials(connectionModalCredentials))">
                                <Copy class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-sm text-muted-foreground">Benutzer</span>
                        <div class="flex items-center gap-1">
                            <code class="rounded bg-muted px-2 py-1 text-sm">{{ connectionModalCredentials.username }}</code>
                            <Button variant="ghost" size="icon" class="h-8 w-8" @click="copyToClipboard(connectionModalCredentials.username)">
                                <Copy class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-sm text-muted-foreground">Passwort</span>
                        <div class="flex items-center gap-1">
                            <code class="rounded bg-muted px-2 py-1 text-sm">{{ connectionModalCredentials.password }}</code>
                            <Button variant="ghost" size="icon" class="h-8 w-8" @click="copyToClipboard(connectionModalCredentials.password)">
                                <Copy class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-sm text-muted-foreground">Verbindungen von</span>
                        <code class="rounded bg-muted px-2 py-1 text-sm">{{ connectionModalDb.connections_from ?? '—' }}</code>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-sm text-muted-foreground">Max. Verbindungen</span>
                        <code class="rounded bg-muted px-2 py-1 text-sm">{{ connectionModalDb.max_connections ?? '—' }}</code>
                    </div>
                </template>
            </div>
        </DialogContent>
    </Dialog>
</template>
