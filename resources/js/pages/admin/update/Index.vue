<!-- Admin: Panel-Update -->
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BTable,
    BBadge,
    BButton,
    BAlert,
} from 'bootstrap-vue-next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type CommitItem = {
    hash: string;
    message: string;
    author: string;
    date: string;
};

type Props = {
    currentCommit: string;
    remoteCommit: string | null;
    updateAvailable: boolean;
    recentCommits: CommitItem[];
    error: string | null;
    canRunUpdate: boolean;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Panel-Update', href: '#' },
];

const consoleOpen = ref(false);
const consoleLines = ref<{ text: string; channel: string }[]>([]);
const consoleRunning = ref(false);
const consoleDone = ref<{ success: boolean; error?: string } | null>(null);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && (meta as HTMLMetaElement).content) || '';
}

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

const canStartUpdate = computed(
    () => props.updateAvailable && props.canRunUpdate && !consoleRunning.value,
);

async function startUpdate() {
    if (!canStartUpdate.value) return;
    consoleOpen.value = true;
    consoleLines.value = [];
    consoleDone.value = null;
    consoleRunning.value = true;

    try {
        const response = await fetch('/admin/update/run', {
            method: 'POST',
            headers: {
                Accept: 'text/event-stream',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        });

        if (!response.ok || !response.body) {
            consoleDone.value = {
                success: false,
                error: response.statusText || 'Request fehlgeschlagen',
            };
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() ?? '';
            for (const part of parts) {
                const match = part.match(/^data:\s*(.+)$/m);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]) as {
                            line?: string;
                            channel?: string;
                            done?: boolean;
                            error?: string;
                            exitCode?: number;
                            result?: string;
                        };
                        if (data.line !== undefined && data.channel) {
                            consoleLines.value.push({
                                text: data.line,
                                channel: data.channel,
                            });
                        }
                        if (data.done) {
                            if (data.error) {
                                consoleDone.value = {
                                    success: false,
                                    error: data.error,
                                };
                            } else {
                                consoleDone.value = {
                                    success: data.result === 'success' && data.exitCode === 0,
                                };
                            }
                        }
                    } catch {
                        // ignore parse errors for non-JSON lines
                    }
                }
            }
        }

        if (!consoleDone.value && buffer) {
            try {
                const match = buffer.match(/^data:\s*(.+)$/m);
                if (match) {
                    const data = JSON.parse(match[1]) as { done?: boolean; error?: string; result?: string; exitCode?: number };
                    if (data.done) {
                        consoleDone.value = data.error
                            ? { success: false, error: data.error }
                            : { success: data.result === 'success' && data.exitCode === 0 };
                    }
                }
            } catch {
                // ignore
            }
        }

        if (!consoleDone.value) {
            consoleDone.value = { success: false, error: 'Stream unerwartet beendet' };
        }
    } catch (e) {
        consoleDone.value = {
            success: false,
            error: e instanceof Error ? e.message : 'Netzwerkfehler',
        };
    } finally {
        consoleRunning.value = false;
    }
}

function closeConsole() {
    if (!consoleRunning.value) {
        consoleOpen.value = false;
        consoleLines.value = [];
        consoleDone.value = null;
    }
}

const commitFields = [
    { key: 'hash', label: 'Hash' },
    { key: 'message', label: 'Nachricht' },
    { key: 'author', label: 'Autor' },
    { key: 'date', label: 'Datum' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Panel-Update" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Panel-Update Neroserv Dashboard</h4>
                    <p class="text-muted small mb-0">
                        Prüfen Sie den Git-Status und führen Sie Updates aus dem main-Branch aus.
                    </p>
                </div>

                <BAlert v-if="error" variant="danger" show class="mb-4">
                    {{ error }}
                </BAlert>

                <template v-else>
                    <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
                        <BBadge :variant="updateAvailable ? 'primary' : 'secondary'">
                            {{ updateAvailable ? 'Update verfügbar' : 'System ist aktuell' }}
                        </BBadge>
                        <div class="d-flex flex-wrap gap-4 small">
                            <span>
                                <span class="text-muted">Aktuell installiert:</span>
                                <code class="ms-1 bg-light rounded px-1 py-0 font-monospace">{{ currentCommit || '–' }}</code>
                            </span>
                            <span>
                                <span class="text-muted">Neuester Remote:</span>
                                <code class="ms-1 bg-light rounded px-1 py-0 font-monospace">{{ remoteCommit ?? '–' }}</code>
                            </span>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap align-items-center gap-2 mb-4">
                        <BButton
                            variant="primary"
                            :disabled="!canStartUpdate"
                            @click="startUpdate"
                        >
                            Update ausführen
                        </BButton>
                        <p v-if="updateAvailable && !canRunUpdate" class="text-muted small mb-0">
                            Sie haben nur Leseberechtigung. Update kann nicht ausgeführt werden.
                        </p>
                    </div>

                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Letzte Commits (main)</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Änderungen die im nächsten Update enthalten sind</p>
                        </BCardHeader>
                        <BCardBody>
                            <BTable
                                v-if="recentCommits.length"
                                :items="recentCommits"
                                :fields="commitFields"
                                striped
                                responsive
                                small
                            >
                                <template #cell(hash)="row">
                                    <code class="small bg-light rounded px-1 py-0">{{ row.item.hash }}</code>
                                </template>
                                <template #cell(message)="row">
                                    <span class="text-truncate d-inline-block fw-medium" style="max-width: 24rem">{{ row.item.message }}</span>
                                </template>
                                <template #cell(author)="row">
                                    <span class="text-muted">{{ row.item.author }}</span>
                                </template>
                                <template #cell(date)="row">
                                    <span class="text-muted small">{{ formatDate(row.item.date) }}</span>
                                </template>
                            </BTable>
                            <p v-else class="text-muted small mb-0">Keine Commits geladen.</p>
                        </BCardBody>
                    </BCard>
                </template>
            </BCol>
        </BRow>

        <Dialog :open="consoleOpen" @update:open="(v) => { if (!v) closeConsole(); }">
            <DialogContent
                class="max-w-4xl"
                :show-close-button="!consoleRunning"
                @pointer-down-outside="(e) => { if (consoleRunning) e.preventDefault(); }"
                @escape-key-down="(e) => { if (consoleRunning) e.preventDefault(); }"
            >
                <DialogHeader>
                    <DialogTitle>Update-Konsole</DialogTitle>
                    <DialogDescription>
                        Live-Ausgabe der Update-Befehle. Bitte nicht schließen, bis der Vorgang abgeschlossen ist.
                    </DialogDescription>
                </DialogHeader>
                <div
                    class="max-h-[70vh] overflow-auto rounded border bg-dark p-3 font-monospace small text-light"
                >
                    <div
                        v-for="(line, i) in consoleLines"
                        :key="i"
                        class="whitespace-pre-wrap break-all"
                        :class="line.channel === 'err' ? 'text-danger' : ''"
                    >
                        {{ line.text }}
                    </div>
                    <div v-if="consoleRunning && consoleLines.length === 0" class="text-body-secondary">
                        Befehl wird ausgeführt…
                    </div>
                    <div v-if="consoleDone" class="mt-2 border-top border-secondary pt-2">
                        <span v-if="consoleDone.success" class="text-success">
                            Update erfolgreich abgeschlossen.
                        </span>
                        <span v-else class="text-danger">
                            {{ consoleDone.error ?? 'Update fehlgeschlagen.' }}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </AdminLayout>
</template>
