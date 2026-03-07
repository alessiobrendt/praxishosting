<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Terminal, Send, Loader2, Wifi, WifiOff, RefreshCw, ArrowDown, Eraser } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { notify } from '@/composables/useNotify';
import gamingAccounts from '@/routes/gaming-accounts';

const MAX_LOG_LINES = 2000;

const props = defineProps<{
    gameServerAccountId: number;
}>();

const command = ref('');
const sending = ref(false);
const logLines = ref<string[]>([]);
const consoleContainer = ref<HTMLElement | null>(null);

const ws = ref<WebSocket | null>(null);
const connectionState = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
const connectionError = ref<string | null>(null);
const autoscroll = ref(true);

const api = computed(() => gamingAccounts.api.console);

/** Strip ANSI escape sequences and terminal control artifacts for clean display. */
function cleanConsoleLine(raw: string): string {
    let s = raw
        .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
        .replace(/\x1b\[[?][0-9;]*[a-zA-Z]/g, '')
        .replace(/\x1b[=?\][^\\]*\\/g, '')
        .replace(/\x1b./g, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    if (/^>\.+$/.test(s.trim()) || s.trim() === '[K') return '';
    return s.trimEnd();
}

/** Line type for styling. */
type LineKind = 'status' | 'daemon' | 'command' | 'system' | 'output';

function lineKind(line: string): LineKind {
    if (line.startsWith('[Status] ')) return 'status';
    if (line.startsWith('[Daemon] ') || line.includes('[Pterodactyl Daemon]:')) return 'daemon';
    if (line.startsWith('> ')) return 'command';
    if (line.startsWith('[Verbunden') || line.startsWith('[Fehler]')) return 'system';
    return 'output';
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && (meta as HTMLMetaElement).content) || '';
}

function appendLog(raw: string) {
    const cleaned = cleanConsoleLine(raw);
    if (!cleaned) return;
    const toAdd = cleaned.includes('\n') ? cleaned.split('\n').filter((l) => l.length > 0) : [cleaned];
    if (toAdd.length === 0) return;
    logLines.value = [...logLines.value.slice(-(MAX_LOG_LINES - toAdd.length)), ...toAdd];
    nextTick(() => {
        if (autoscroll.value && consoleContainer.value) {
            consoleContainer.value.scrollTop = consoleContainer.value.scrollHeight;
        }
    });
}

function scrollToBottom() {
    nextTick(() => {
        if (consoleContainer.value) {
            consoleContainer.value.scrollTop = consoleContainer.value.scrollHeight;
        }
    });
}

function closeSocket() {
    if (ws.value) {
        ws.value.close(1000, 'close');
        ws.value = null;
    }
    connectionState.value = 'disconnected';
    connectionError.value = null;
}

async function fetchTicket(): Promise<{ token: string; socket: string }> {
    const url = api.value.websocket.url(props.gameServerAccountId);
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!data.success || !data.token || !data.socket) {
        throw new Error(data.message ?? 'WebSocket-Ticket konnte nicht geladen werden.');
    }
    return { token: data.token, socket: data.socket };
}

function connect() {
    if (connectionState.value === 'connecting' || connectionState.value === 'connected') {
        return;
    }
    connectionState.value = 'connecting';
    connectionError.value = null;

    fetchTicket()
        .then(({ token, socket: socketUrl }) => {
            const socket = new WebSocket(socketUrl);
            ws.value = socket;

            socket.onopen = () => {
                socket.send(
                    JSON.stringify({
                        event: 'auth',
                        args: [token],
                    }),
                );
            };

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as { event?: string; args?: string[] };
                    const ev = message.event;
                    const args = message.args ?? [];

                    switch (ev) {
                        case 'console output':
                            if (args[0] != null) appendLog(args[0]);
                            break;
                        case 'status':
                            if (args[0]) appendLog(`[Status] ${args[0]}`);
                            break;
                        case 'jwt error':
                            connectionError.value = args[0] ?? 'Token ungültig.';
                            connectionState.value = 'error';
                            notify.error('Konsole: Token abgelaufen. Bitte erneut verbinden.');
                            break;
                        case 'daemon message':
                            if (args[0]) appendLog(`[Daemon] ${args[0]}`);
                            break;
                        default:
                            break;
                    }
                } catch {
                    // ignore parse errors
                }
            };

            socket.onclose = (event) => {
                ws.value = null;
                if (connectionState.value === 'connecting') {
                    connectionState.value = 'error';
                    connectionError.value = event.reason || `Verbindung geschlossen (${event.code})`;
                } else if (connectionState.value === 'connected') {
                    connectionState.value = 'disconnected';
                }
            };

            socket.onerror = () => {
                connectionError.value = 'WebSocket-Fehler';
                if (connectionState.value === 'connecting') {
                    connectionState.value = 'error';
                }
            };

            // Consider connected after open; auth result may come later or as jwt error
            const openHandler = () => {
                connectionState.value = 'connected';
                connectionError.value = null;
                appendLog('[Verbunden mit Live-Konsole]');
            };
            socket.addEventListener('open', openHandler, { once: true });
        })
        .catch((e) => {
            connectionState.value = 'error';
            connectionError.value = e instanceof Error ? e.message : String(e);
            notify.error(connectionError.value);
        });
}

function sendCommand() {
    const cmd = command.value.trim();
    if (!cmd) return;

    if (ws.value?.readyState === WebSocket.OPEN) {
        sending.value = true;
        command.value = '';
        try {
            ws.value.send(
                JSON.stringify({
                    event: 'send command',
                    args: [cmd],
                }),
            );
            appendLog(`> ${cmd}`);
        } catch (e) {
            notify.error('Befehl konnte nicht gesendet werden.');
            appendLog(`[Fehler] ${e instanceof Error ? e.message : 'Unbekannt'}`);
        } finally {
            sending.value = false;
        }
        return;
    }

    sending.value = true;
    logLines.value.push(`> ${cmd}`);
    command.value = '';
    fetch(api.value.command.url(props.gameServerAccountId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ command: cmd }),
    })
        .then((res) => res.json().catch(() => ({})))
        .then((data) => {
            if (!data.success) {
                logLines.value.push(`[Fehler] ${data.message ?? 'Unbekannt'}`);
                notify.error(data.message ?? 'Fehler beim Senden.');
            }
        })
        .catch((e) => {
            logLines.value.push(`[Fehler] ${e instanceof Error ? e.message : 'Unbekannt'}`);
            notify.error('Verbindungsfehler.');
        })
        .finally(() => {
            sending.value = false;
        });
}

function clearLog() {
    logLines.value = [];
}

function reconnect() {
    closeSocket();
    connect();
}

const statusLabel = computed(() => {
    switch (connectionState.value) {
        case 'connecting':
            return 'Verbinde…';
        case 'connected':
            return 'Verbunden';
        case 'error':
            return connectionError.value || 'Fehler';
        default:
            return 'Getrennt';
    }
});

const isConnected = computed(() => connectionState.value === 'connected');
const isConnecting = computed(() => connectionState.value === 'connecting');

onMounted(() => {
    connect();
});

onUnmounted(() => {
    closeSocket();
});
</script>

<template>
    <Card>
        <CardContent class="pt-6">
            <div class="flex flex-col gap-4">
                <div class="rounded-lg border border-border bg-muted/30 font-mono text-sm overflow-hidden">
                    <div
                        class="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2"
                    >
                        <div class="flex items-center gap-2">
                            <span
                                class="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-medium"
                                :class="{
                                    'bg-emerald-500/20 text-emerald-400': isConnected,
                                    'bg-amber-500/20 text-amber-400': isConnecting,
                                    'bg-red-500/20 text-red-400': connectionState === 'error',
                                    'bg-zinc-500/20 text-zinc-400': connectionState === 'disconnected',
                                }"
                            >
                                <span
                                    class="h-1.5 w-1.5 shrink-0 rounded-full"
                                    :class="{
                                        'bg-emerald-400': isConnected,
                                        'bg-amber-400 animate-pulse': isConnecting,
                                        'bg-red-400': connectionState === 'error',
                                        'bg-zinc-400': connectionState === 'disconnected',
                                    }"
                                />
                                {{ statusLabel }}
                            </span>
                            <small class="text-zinc-500 text-[0.75rem]">Live-Konsole</small>
                        </div>
                        <div class="flex items-center gap-2">
                            <template v-if="!isConnecting && !isConnected">
                                <Button variant="outline" size="sm" class="h-7 text-xs" @click="connect">
                                    Verbinden
                                </Button>
                            </template>
                            <template v-else-if="connectionState === 'error' || connectionState === 'disconnected'">
                                <Button variant="outline" size="sm" class="h-7 text-xs" @click="reconnect">
                                    <RefreshCw class="mr-1 h-3 w-3" />
                                    Erneut verbinden
                                </Button>
                            </template>
                            <div class="flex items-center gap-1.5">
                                <Switch v-model="autoscroll" class="h-5 w-9" />
                                <span class="text-[0.75rem] text-zinc-500">Autoscroll</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-7 w-7"
                                title="Leeren"
                                @click="clearLog"
                            >
                                <Eraser class="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-7 w-7"
                                title="Nach unten"
                                @click="scrollToBottom"
                            >
                                <ArrowDown class="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                    <div
                        ref="consoleContainer"
                        class="max-h-[400px] min-h-[200px] overflow-y-auto whitespace-pre-wrap break-words rounded bg-zinc-900/80 p-3 text-xs text-zinc-200"
                    >
                        <template v-if="logLines.length">
                            <div
                                v-for="(line, i) in logLines"
                                :key="i"
                                class="mb-0.5 flex items-center gap-2"
                                :class="{
                                    'text-zinc-500': lineKind(line) === 'system' || lineKind(line) === 'command',
                                }"
                            >
                                <template v-if="lineKind(line) === 'status'">
                                    <span
                                        class="shrink-0 rounded px-1.5 py-0.5 font-medium capitalize"
                                        :class="{
                                            'bg-emerald-500/25 text-emerald-300': line === '[Status] running',
                                            'bg-amber-500/25 text-amber-300': line === '[Status] starting',
                                            'bg-red-500/25 text-red-300': line === '[Status] stopping' || line === '[Status] offline',
                                            'bg-zinc-500/25 text-zinc-400': !['[Status] running', '[Status] starting', '[Status] stopping', '[Status] offline'].includes(line),
                                        }"
                                    >
                                        {{ line.replace('[Status] ', '') }}
                                    </span>
                                </template>
                                <template v-else-if="lineKind(line) === 'daemon'">
                                    <span class="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300/90 text-[11px]">
                                        Daemon
                                    </span>
                                    <span class="min-w-0">{{
                                        line.includes('[Pterodactyl Daemon]:')
                                            ? line.split('[Pterodactyl Daemon]:').slice(1).join('[Pterodactyl Daemon]:').trim()
                                            : line.startsWith('[Daemon] ')
                                              ? line.slice(9)
                                              : line
                                    }}</span>
                                </template>
                                <template v-else>
                                    <span class="min-w-0">{{ line }}</span>
                                </template>
                            </div>
                        </template>
                        <span v-else class="text-zinc-500">
                            {{
                                isConnecting
                                    ? 'Verbinde mit Konsole…'
                                    : isConnected
                                      ? 'Live-Ausgabe erscheint hier.'
                                      : 'Verbinden Sie sich für die Live-Konsole, oder senden Sie einen Befehl (wird per API ausgeführt).'
                            }}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Input
                        v-model="command"
                        placeholder="Befehl eingeben..."
                        class="font-mono"
                        :disabled="sending"
                        @keydown.enter.prevent="sendCommand()"
                    />
                    <Button
                        :disabled="sending || !command.trim()"
                        @click="sendCommand"
                    >
                        <Loader2
                            v-if="sending"
                            class="mr-2 h-4 w-4 animate-spin"
                        />
                        <Send v-else class="mr-2 h-4 w-4" />
                        Senden
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
