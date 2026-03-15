<template>
  <DefaultLayout>
    <Head :title="teamSpeakServerAccount?.name ?? 'TeamSpeak Server'" />
    <PageBreadcrumb
      :title="teamSpeakServerAccount?.name ?? 'TeamSpeak Server'"
      subtitle="Meine TeamSpeak Server"
      subtitle-url="/teamspeak-accounts"
    />

    <BRow>
      <BCol lg="4" class="mb-4">
        <BCard no-body>
          <BCardBody class="text-center">
            <BBadge :variant="statusVariant" class="mb-2">{{ displayStatus }}</BBadge>
            <div class="mb-2">
              <Icon icon="headphones" class="fs-1 text-muted" />
            </div>
            <h5 class="mb-1">TeamSpeak-Server</h5>
            <p class="text-muted small mb-0">{{ teamSpeakServerAccount?.name }}</p>
            <p class="text-muted small mb-0">{{ teamSpeakServerAccount?.hosting_plan?.name }}</p>
            <div class="border rounded p-2 mt-3 bg-light">
              <span class="text-muted small">Läuft bis</span>
              <div class="fw-semibold">{{ formatDate(teamSpeakServerAccount?.current_period_ends_at) }}</div>
            </div>
            <div class="d-flex flex-column gap-2 mt-3">
              <a
                v-if="displayInfo?.connection_uri && isOnline && !isSuspendedOrExpired"
                :href="displayInfo.connection_uri"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
              >
                <Icon icon="external-link" class="me-2" />
                Zum Server verbinden
              </a>
              <a v-if="renewUrl && !isSuspendedOrExpired" :href="renewUrl" class="btn btn-outline-primary">
                <Icon icon="calendar-plus" class="me-2" />
                Verlängern
              </a>
              <Link href="/billing/subscriptions" class="btn btn-outline-secondary">Abo verwalten</Link>
              <Link v-if="connectDomainShowUrl && !isSuspendedOrExpired" :href="connectDomainShowUrl" class="btn btn-outline-secondary">
                <Icon icon="globe" class="me-2" />
                Domain verbinden
              </Link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="8">
        <BNav tabs class="mb-3">
          <BNavItem :active="activeTab === 'overview'" @click="activeTab = 'overview'">Übersicht</BNavItem>
          <BNavItem :active="activeTab === 'access'" @click="activeTab = 'access'">Zugang</BNavItem>
          <BNavItem :active="activeTab === 'tokens'" @click="activeTab = 'tokens'">Tokens</BNavItem>
          <BNavItem :active="activeTab === 'backups'" @click="activeTab = 'backups'">Backups</BNavItem>
        </BNav>

        <BCard v-if="activeTab === 'overview'" no-body>
          <BCardBody>
            <BTable :items="overviewRows" :fields="[{ key: 'label', label: '' }, { key: 'value', label: '' }]" small stacked="">
              <template #cell(value)="{ item }">
                <span v-if="item.key === 'address'" class="d-flex align-items-center gap-1">
                  <code class="small">{{ item.value }}</code>
                  <BButton v-if="item.value" size="sm" variant="outline-secondary" class="py-0 px-1" @click="copyToClipboard(displayInfo?.connection_uri ?? '')">
                    <Icon icon="copy" />
                  </BButton>
                </span>
                <span v-else>{{ item.value }}</span>
              </template>
            </BTable>
            <div v-if="!isSuspendedOrExpired" class="d-flex flex-wrap gap-2 mt-3">
              <BButton size="sm" variant="success" :disabled="isOnline" @click="sendPower('start')">
                <Icon icon="power" class="me-1" />
                Start
              </BButton>
              <BButton size="sm" variant="danger" :disabled="!isOnline" @click="sendPower('stop')">
                <Icon icon="power-off" class="me-1" />
                Stop
              </BButton>
            </div>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'access'" no-body>
          <BCardBody>
            <div class="mb-3">
              <label class="form-label small">Adresse (IP:Port)</label>
              <div class="d-flex gap-2">
                <BFormInput :value="displayInfo?.address ?? '–'" readonly class="font-monospace" />
                <BButton v-if="displayInfo?.address" size="sm" variant="outline-secondary" @click="copyToClipboard(displayInfo!.address!)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label small">Verbindung (ts3server://)</label>
              <div class="d-flex gap-2">
                <BFormInput :value="displayInfo?.connection_uri ?? '–'" readonly class="font-monospace" />
                <BButton v-if="displayInfo?.connection_uri" size="sm" variant="outline-secondary" @click="copyToClipboard(displayInfo!.connection_uri!)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'tokens'" no-body>
          <BCardHeader class="d-flex align-items-center justify-content-between">
            <h6 class="mb-0">Privilege Keys (Tokens)</h6>
            <BButton v-if="!isSuspendedOrExpired" size="sm" @click="tokenModalOpen = true">
              <Icon icon="key" class="me-1" />
              Neuen Token erstellen
            </BButton>
          </BCardHeader>
          <BCardBody>
            <BTable v-if="tokens.length" :items="tokens" :fields="tokenFields" small />
            <p v-else class="text-muted small mb-0">Keine Tokens</p>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'backups'" no-body>
          <BCardHeader class="d-flex align-items-center justify-content-between">
            <h6 class="mb-0">Backups</h6>
            <BButton v-if="!isSuspendedOrExpired" size="sm" @click="createBackup">
              <Icon icon="save" class="me-1" />
              Neues Backup
            </BButton>
          </BCardHeader>
          <BCardBody>
            <BTable v-if="snapshots.length" :items="snapshots" :fields="snapshotFields" small>
              <template #cell(created_at)="{ item }">
                {{ formatSnapshotDate(item.created_at) }}
              </template>
              <template #cell(actions)="{ item }">
                <BButton v-if="!isSuspendedOrExpired" size="sm" variant="outline-primary" class="me-1" @click="deployBackup(item.id)">Wiederherstellen</BButton>
                <BButton v-if="!isSuspendedOrExpired" size="sm" variant="outline-danger" @click="deleteBackup(item.id)">Löschen</BButton>
              </template>
            </BTable>
            <p v-else class="text-muted small mb-0">Keine Backups vorhanden</p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <BModal v-model="tokenModalOpen" title="Neuen Token erstellen" hide-footer>
      <div class="mb-3">
        <label class="form-label">Beschreibung (optional)</label>
        <BFormInput v-model="newTokenDescription" placeholder="z. B. für Bot" />
      </div>
      <div class="d-flex justify-content-end gap-2">
        <BButton variant="secondary" @click="tokenModalOpen = false">Abbrechen</BButton>
        <BButton @click="createToken">Erstellen</BButton>
      </div>
    </BModal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BFormInput,
  BNav,
  BNavItem,
  BRow,
  BTable,
  BModal,
  BBadge,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type TeamSpeakServerAccount = {
  uuid: string
  name: string
  status: string
  port: number | null
  current_period_ends_at: string | null
  cancel_at_period_end: boolean
  hosting_plan: { name: string; price: string }
  hosting_server?: { name: string } | null
}
type ServerInfo = {
  address?: string
  connection_uri?: string
  virtualserver_uptime?: number
  virtualserver_clientsonline?: number
  virtualserver_maxclients?: number
  virtualserver_version?: string
  virtualserver_status?: string
}
type TokenRow = { token: string; group: string; description: string }
type SnapshotRow = { id: number; created_at: string }

const props = defineProps<{
  teamSpeakServerAccount: TeamSpeakServerAccount | null
  serverInfo: ServerInfo | null
  tokens: TokenRow[]
  snapshots: SnapshotRow[]
  renewUrl?: string
  isSuspendedOrExpired?: boolean
  connectDomainShowUrl?: string
}>()

const activeTab = ref('overview')
const tokenModalOpen = ref(false)
const newTokenDescription = ref('')

const displayInfo = computed(() => props.serverInfo ?? null)
const isOnline = computed(() => (displayInfo.value?.virtualserver_status ?? '') === 'online')
const isSuspendedOrExpired = computed(() => props.isSuspendedOrExpired ?? false)

const displayStatus = computed(() => {
  if (isSuspendedOrExpired.value) return 'Gesperrt'
  const s = displayInfo.value?.virtualserver_status ?? props.teamSpeakServerAccount?.status ?? ''
  if (s === 'online') return 'Online'
  if (s === 'offline' || s === 'stopped') return 'Offline'
  return s || '–'
})

const statusVariant = computed((): 'success' | 'secondary' | 'danger' => {
  if (isSuspendedOrExpired.value) return 'danger'
  const s = displayInfo.value?.virtualserver_status ?? ''
  if (s === 'online') return 'success'
  return 'secondary'
})

const overviewRows = computed(() => {
  const d = displayInfo.value
  const acc = props.teamSpeakServerAccount
  const uptime = d?.virtualserver_uptime != null ? formatUptime(d.virtualserver_uptime) : '–'
  return [
    { key: 'address', label: 'Adresse', value: d?.address ?? '–' },
    { key: 'uptime', label: 'Online-Zeit', value: uptime },
    { key: 'clients', label: 'User online', value: d != null ? `${d.virtualserver_clientsonline ?? 0} / ${d.virtualserver_maxclients ?? 0}` : '–' },
    { key: 'version', label: 'Version', value: d?.virtualserver_version ?? '–' },
    { key: 'node', label: 'Node', value: acc?.hosting_server?.name ?? '–' },
  ]
})

const tokenFields = [
  { key: 'token', label: 'Token' },
  { key: 'group', label: 'Gruppe' },
  { key: 'description', label: 'Beschreibung' },
]
const snapshotFields = [
  { key: 'created_at', label: 'Erstellt am' },
  { key: 'actions', label: 'Aktionen' },
]

function formatDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}

function formatSnapshotDate(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatUptime(seconds: number): string {
  if (seconds < 0) return '–'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts = []
  if (d > 0) parts.push(`${d} Tag(e)`)
  parts.push(`${h} Std`, `${m} Min`)
  return parts.join(', ')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

function sendPower(action: 'start' | 'stop') {
  if (!props.teamSpeakServerAccount) return
  router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/power`, { action }, { preserveScroll: true })
}

function createToken() {
  if (!props.teamSpeakServerAccount) return
  router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/tokens`, { description: newTokenDescription.value }, {
    preserveScroll: true,
    onSuccess: () => { tokenModalOpen.value = false; newTokenDescription.value = '' },
  })
}

function createBackup() {
  if (!props.teamSpeakServerAccount) return
  router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups`, {}, { preserveScroll: true })
}

function deployBackup(snapshotId: number) {
  if (!confirm('Backup wiederherstellen? Der aktuelle Serverzustand wird überschrieben.') || !props.teamSpeakServerAccount) return
  router.post(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups/${snapshotId}/deploy`, {}, { preserveScroll: true })
}

function deleteBackup(snapshotId: number) {
  if (!confirm('Backup wirklich löschen?') || !props.teamSpeakServerAccount) return
  router.delete(`/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}/backups/${snapshotId}`, { preserveScroll: true })
}
</script>
