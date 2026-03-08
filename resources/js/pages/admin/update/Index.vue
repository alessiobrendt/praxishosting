<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Heading, Text } from '@/components/ui/typography';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Panel-Update" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Panel-Update</Heading>
                <Text class="mt-2" muted>
                    Prüfen Sie den Git-Status und führen Sie Updates aus dem main-Branch aus.
                </Text>
            </div>

            <div v-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                {{ error }}
            </div>

            <template v-else>
                <div class="flex flex-wrap items-center gap-4">
                    <Badge :variant="updateAvailable ? 'default' : 'secondary'" class="text-sm">
                        {{ updateAvailable ? 'Update verfügbar' : 'System ist aktuell' }}
                    </Badge>
                    <div class="flex flex-wrap gap-6 text-sm">
                        <span>
                            <span class="text-muted-foreground">Aktuell installiert:</span>
                            <code class="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono">{{ currentCommit || '–' }}</code>
                        </span>
                        <span>
                            <span class="text-muted-foreground">Neuester Remote:</span>
                            <code class="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono">{{ remoteCommit ?? '–' }}</code>
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    <Button
                        :disabled="!canStartUpdate"
                        @click="startUpdate"
                    >
                        Update ausführen
                    </Button>
                    <Text v-if="updateAvailable && !canRunUpdate" muted class="self-center text-sm">
                        Sie haben nur Leseberechtigung. Update kann nicht ausgeführt werden.
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Letzte Commits (main)</CardTitle>
                        <CardDescription>
                            Änderungen die im nächsten Update enthalten sind
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table v-if="recentCommits.length">
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-24">Hash</TableHead>
                                    <TableHead>Nachricht</TableHead>
                                    <TableHead class="w-40">Autor</TableHead>
                                    <TableHead class="w-40">Datum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow
                                    v-for="commit in recentCommits"
                                    :key="commit.hash"
                                >
                                    <TableCell>
                                        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{{ commit.hash }}</code>
                                    </TableCell>
                                    <TableCell class="max-w-md truncate font-medium">
                                        {{ commit.message }}
                                    </TableCell>
                                    <TableCell class="text-muted-foreground">
                                        {{ commit.author }}
                                    </TableCell>
                                    <TableCell class="text-muted-foreground text-sm">
                                        {{ formatDate(commit.date) }}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Text v-else muted>
                            Keine Commits geladen.
                        </Text>
                    </CardContent>
                </Card>
            </template>
        </div>

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
                    class="max-h-[70vh] overflow-auto rounded-lg border bg-zinc-950 p-4 font-mono text-sm text-zinc-100"
                >
                    <div
                        v-for="(line, i) in consoleLines"
                        :key="i"
                        class="whitespace-pre-wrap break-all"
                        :class="line.channel === 'err' ? 'text-red-400' : ''"
                    >
                        {{ line.text }}
                    </div>
                    <div v-if="consoleRunning && consoleLines.length === 0" class="text-zinc-500">
                        Befehl wird ausgeführt…
                    </div>
                    <div v-if="consoleDone" class="mt-2 border-t border-zinc-700 pt-2">
                        <span
                            v-if="consoleDone.success"
                            class="text-green-400"
                        >
                            Update erfolgreich abgeschlossen.
                        </span>
                        <span
                            v-else
                            class="text-red-400"
                        >
                            {{ consoleDone.error ?? 'Update fehlgeschlagen.' }}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </AdminLayout>
</template>
