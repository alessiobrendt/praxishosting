<template>
  <BCard no-body>
    <BCardBody>
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h6 class="mb-0">Backups</h6>
        <BButton size="sm" :disabled="creating" @click="createBackup">
          <Icon v-if="creating" icon="loader-2" class="me-1" />
          <Icon v-else icon="plus" class="me-1" />
          Backup erstellen
        </BButton>
      </div>
      <div v-if="loading" class="text-center py-5">
        <Icon icon="loader-2" class="fs-2 text-muted" />
      </div>
      <div v-else-if="error" class="alert alert-danger small mb-0">
        {{ error }}
      </div>
      <div v-else-if="backups.length === 0" class="text-center py-5 text-muted">
        <Icon icon="archive" class="fs-1 opacity-50 mb-2" />
        <p class="mb-0">Keine Backups vorhanden</p>
      </div>
      <div v-else class="d-flex flex-column gap-2">
        <div
          v-for="b in backups"
          :key="b.uuid"
          class="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded p-3"
        >
          <div>
            <div class="fw-semibold">{{ b.name ?? b.uuid }}</div>
            <small class="text-muted">
              {{ formatDate(b.created_at) }}
              · {{ formatBytes(b.bytes ?? 0) }}
              <span v-if="b.is_successful === false" class="text-warning">(läuft…)</span>
            </small>
          </div>
          <div class="d-flex gap-1">
            <BButton
              v-if="b.is_successful !== false"
              size="sm"
              variant="outline-primary"
              :href="downloadUrl(b.uuid)"
              target="_blank"
              tag="a"
            >
              <Icon icon="download" class="me-1" />
              Download
            </BButton>
            <BButton
              v-if="b.is_successful !== false"
              size="sm"
              variant="outline-secondary"
              @click="restoreBackup(b.uuid)"
            >
              <Icon icon="rotate-ccw" class="me-1" />
              Wiederherstellen
            </BButton>
            <BButton size="sm" variant="outline-danger" @click="deleteBackup(b.uuid)">
              <Icon icon="trash" />
            </BButton>
          </div>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BButton, BCard, BCardBody } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import { formatBytes } from './formatBytes'

const props = defineProps<{
  gameServerAccountId: string
}>()

type Backup = {
  uuid: string
  name?: string
  bytes?: number
  created_at?: string
  is_successful?: boolean
}

const backups = ref<Backup[]>([])
const loading = ref(false)
const creating = ref(false)
const error = ref<string | null>(null)

const baseUrl = () => `/gaming-accounts/${props.gameServerAccountId}/api/backups`

function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  const meta = document.querySelector('meta[name="csrf-token"]')
  return (meta && (meta as HTMLMetaElement).content) || ''
}

function fetchBackups() {
  loading.value = true
  error.value = null
  fetch(baseUrl(), { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && Array.isArray(data.backups)) {
        backups.value = data.backups
      } else {
        error.value = data.message ?? 'Fehler beim Laden'
      }
    })
    .catch((e) => {
      error.value = e.message ?? 'Verbindungsfehler'
    })
    .finally(() => {
      loading.value = false
    })
}

watch(() => props.gameServerAccountId, fetchBackups, { immediate: true })

function createBackup() {
  if (creating.value) return
  creating.value = true
  fetch(baseUrl(), {
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
        fetchBackups()
      } else {
        error.value = data.message ?? 'Fehler'
      }
    })
    .catch(() => { error.value = 'Verbindungsfehler' })
    .finally(() => { creating.value = false })
}

function downloadUrl(uuid: string) {
  return `${baseUrl()}/${uuid}/download`
}

function restoreBackup(uuid: string) {
  if (!confirm('Backup wiederherstellen? Alle aktuellen Daten werden überschrieben.')) return
  fetch(`${baseUrl()}/${uuid}/restore`, {
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
        fetchBackups()
      } else {
        error.value = data.message ?? 'Fehler'
      }
    })
    .catch(() => { error.value = 'Verbindungsfehler' })
}

function deleteBackup(uuid: string) {
  if (!confirm('Backup wirklich löschen?')) return
  fetch(`${baseUrl()}/${uuid}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': getCsrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  })
    .then((r) => {
      if (r.status === 204) return { success: true }
      return r.json().catch(() => ({}))
    })
    .then((data) => {
      if (data?.success !== false) {
        fetchBackups()
      } else {
        error.value = data?.message ?? 'Fehler'
      }
    })
    .catch(() => { error.value = 'Verbindungsfehler' })
}

function formatDate(val: string | undefined) {
  if (!val) return '–'
  try {
    return new Date(val).toLocaleString('de-DE')
  } catch {
    return '–'
  }
}
</script>
