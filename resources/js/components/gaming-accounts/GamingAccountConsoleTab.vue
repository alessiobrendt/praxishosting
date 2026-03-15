<template>
  <BCard no-body>
    <BCardBody>
      <div class="d-flex flex-column gap-3">
        <div class="rounded border bg-dark text-light font-monospace overflow-hidden">
          <div class="d-flex flex-shrink-0 align-items-center justify-content-between border-bottom border-secondary px-3 py-2">
            <div class="d-flex align-items-center gap-2">
              <span
                class="badge"
                :class="{
                  'bg-success': isConnected,
                  'bg-warning text-dark': isConnecting,
                  'bg-danger': connectionState === 'error',
                  'bg-secondary': connectionState === 'disconnected',
                }"
              >
                {{ statusLabel }}
              </span>
              <small class="text-body-secondary">Live-Konsole</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <template v-if="!isConnecting && !isConnected">
                <BButton size="sm" variant="outline-light" @click="connect">Verbinden</BButton>
              </template>
              <template v-else-if="connectionState === 'error' || connectionState === 'disconnected'">
                <BButton size="sm" variant="outline-light" @click="reconnect">
                  <Icon icon="refresh" class="me-1" />
                  Erneut verbinden
                </BButton>
              </template>
              <div class="form-check form-switch form-check-inline mb-0">
                <input id="autoscroll" v-model="autoscroll" class="form-check-input" type="checkbox" />
                <label class="form-check-label small text-body-secondary" for="autoscroll">Autoscroll</label>
              </div>
              <BButton size="sm" variant="outline-light" class="py-0 px-1" title="Leeren" @click="clearLog">
                <Icon icon="eraser" />
              </BButton>
              <BButton size="sm" variant="outline-light" class="py-0 px-1" title="Nach unten" @click="scrollToBottom">
                <Icon icon="arrow-down" />
              </BButton>
            </div>
          </div>
          <div
            ref="consoleContainerRef"
            class="overflow-auto p-3 text-break small"
            style="max-height: 400px; min-height: 200px; white-space: pre-wrap"
          >
            <template v-if="logLines.length">
              <div
                v-for="(line, i) in logLines"
                :key="i"
                class="mb-1"
                :class="lineKind(line) === 'system' || lineKind(line) === 'command' ? 'text-secondary' : ''"
              >
                <span v-if="lineKind(line) === 'status'" class="badge bg-opacity-25 me-1">{{ line.replace('[Status] ', '') }}</span>
                <span v-else-if="lineKind(line) === 'daemon'" class="badge bg-warning bg-opacity-25 me-1">Daemon</span>
                <span>{{ line.includes('[Pterodactyl Daemon]:') ? line.split('[Pterodactyl Daemon]:').slice(1).join('[Pterodactyl Daemon]:').trim() : line.startsWith('[Daemon] ') ? line.slice(9) : line }}</span>
              </div>
            </template>
            <span v-else class="text-body-secondary">
              {{ isConnecting ? 'Verbinde mit Konsole…' : isConnected ? 'Live-Ausgabe erscheint hier.' : 'Verbinden Sie sich für die Live-Konsole, oder senden Sie einen Befehl (wird per API ausgeführt).' }}
            </span>
          </div>
        </div>
        <div class="d-flex gap-2">
          <BFormInput
            v-model="command"
            placeholder="Befehl eingeben..."
            class="font-monospace"
            :disabled="sending"
            @keydown.enter.prevent="sendCommand"
          />
          <BButton :disabled="sending || !command.trim()" @click="sendCommand">
            <Icon v-if="sending" icon="loader-2" class="me-1" />
            <Icon v-else icon="send" class="me-1" />
            Senden
          </BButton>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { BButton, BCard, BCardBody, BFormInput } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'

const MAX_LOG_LINES = 2000

const props = defineProps<{
  gameServerAccountId: string
}>()

const command = ref('')
const sending = ref(false)
const logLines = ref<string[]>([])
const consoleContainerRef = ref<HTMLElement | null>(null)
const ws = ref<WebSocket | null>(null)
const connectionState = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
const connectionError = ref<string | null>(null)
const autoscroll = ref(true)

const websocketUrl = computed(() => `/gaming-accounts/${props.gameServerAccountId}/api/console/websocket`)
const commandUrl = computed(() => `/gaming-accounts/${props.gameServerAccountId}/api/console/command`)

function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  const meta = document.querySelector('meta[name="csrf-token"]')
  return (meta && (meta as HTMLMetaElement).content) || ''
}

function cleanConsoleLine(raw: string): string {
  let s = raw
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1b\[[?][0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1b[=?\][^\\]*\\/g, '')
    .replace(/\x1b./g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
  if (/^>\.+$/.test(s.trim()) || s.trim() === '[K') return ''
  return s.trimEnd()
}

type LineKind = 'status' | 'daemon' | 'command' | 'system' | 'output'
function lineKind(line: string): LineKind {
  if (line.startsWith('[Status] ')) return 'status'
  if (line.startsWith('[Daemon] ') || line.includes('[Pterodactyl Daemon]:')) return 'daemon'
  if (line.startsWith('> ')) return 'command'
  if (line.startsWith('[Verbunden') || line.startsWith('[Fehler]')) return 'system'
  return 'output'
}

function appendLog(raw: string) {
  const cleaned = cleanConsoleLine(raw)
  if (!cleaned) return
  const toAdd = cleaned.includes('\n') ? cleaned.split('\n').filter((l) => l.length > 0) : [cleaned]
  if (toAdd.length === 0) return
  logLines.value = [...logLines.value.slice(-(MAX_LOG_LINES - toAdd.length)), ...toAdd]
  nextTick(() => {
    if (autoscroll.value && consoleContainerRef.value) {
      consoleContainerRef.value.scrollTop = consoleContainerRef.value.scrollHeight
    }
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (consoleContainerRef.value) {
      consoleContainerRef.value.scrollTop = consoleContainerRef.value.scrollHeight
    }
  })
}

function closeSocket() {
  if (ws.value) {
    ws.value.close(1000, 'close')
    ws.value = null
  }
  connectionState.value = 'disconnected'
  connectionError.value = null
}

async function fetchTicket(): Promise<{ token: string; socket: string }> {
  const res = await fetch(websocketUrl.value, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': getCsrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!data.success || !data.token || !data.socket) {
    throw new Error(data.message ?? 'WebSocket-Ticket konnte nicht geladen werden.')
  }
  return { token: data.token, socket: data.socket }
}

function connect() {
  if (connectionState.value === 'connecting' || connectionState.value === 'connected') return
  connectionState.value = 'connecting'
  connectionError.value = null
  fetchTicket()
    .then(({ token, socket: socketUrl }) => {
      const socket = new WebSocket(socketUrl)
      ws.value = socket
      socket.onopen = () => {
        socket.send(JSON.stringify({ event: 'auth', args: [token] }))
      }
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as { event?: string; args?: string[] }
          const ev = message.event
          const args = message.args ?? []
          switch (ev) {
            case 'console output':
              if (args[0] != null) appendLog(args[0])
              break
            case 'status':
              if (args[0]) appendLog(`[Status] ${args[0]}`)
              break
            case 'jwt error':
              connectionError.value = args[0] ?? 'Token ungültig.'
              connectionState.value = 'error'
              break
            case 'daemon message':
              if (args[0]) appendLog(`[Daemon] ${args[0]}`)
              break
            default:
              break
          }
        } catch {
          // ignore
        }
      }
      socket.onclose = (event) => {
        ws.value = null
        if (connectionState.value === 'connecting') {
          connectionState.value = 'error'
          connectionError.value = event.reason || `Verbindung geschlossen (${event.code})`
        } else if (connectionState.value === 'connected') {
          connectionState.value = 'disconnected'
        }
      }
      socket.onerror = () => {
        connectionError.value = 'WebSocket-Fehler'
        if (connectionState.value === 'connecting') connectionState.value = 'error'
      }
      socket.addEventListener('open', () => {
        connectionState.value = 'connected'
        connectionError.value = null
        appendLog('[Verbunden mit Live-Konsole]')
      }, { once: true })
    })
    .catch((e) => {
      connectionState.value = 'error'
      connectionError.value = e instanceof Error ? e.message : String(e)
    })
}

function sendCommand() {
  const cmd = command.value.trim()
  if (!cmd) return
  if (ws.value?.readyState === WebSocket.OPEN) {
    sending.value = true
    command.value = ''
    try {
      ws.value.send(JSON.stringify({ event: 'send command', args: [cmd] }))
      appendLog(`> ${cmd}`)
    } finally {
      sending.value = false
    }
    return
  }
  sending.value = true
  logLines.value.push(`> ${cmd}`)
  command.value = ''
  fetch(commandUrl.value, {
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
        logLines.value.push(`[Fehler] ${data.message ?? 'Unbekannt'}`)
      }
    })
    .catch((e) => {
      logLines.value.push(`[Fehler] ${e instanceof Error ? e.message : 'Unbekannt'}`)
    })
    .finally(() => { sending.value = false })
}

function clearLog() {
  logLines.value = []
}

function reconnect() {
  closeSocket()
  connect()
}

const statusLabel = computed(() => {
  switch (connectionState.value) {
    case 'connecting':
      return 'Verbinde…'
    case 'connected':
      return 'Verbunden'
    case 'error':
      return connectionError.value || 'Fehler'
    default:
      return 'Getrennt'
  }
})

const isConnected = computed(() => connectionState.value === 'connected')
const isConnecting = computed(() => connectionState.value === 'connecting')

onMounted(() => {
  connect()
})
onUnmounted(() => {
  closeSocket()
})
</script>
