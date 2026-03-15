<template>
  <BCard no-body>
    <BCardBody>
      <h6 class="mb-4">Datenbanken</h6>
      <div v-if="loading" class="text-center py-5">
        <Icon icon="loader-2" class="fs-2 text-muted" />
      </div>
      <div v-else-if="error" class="alert alert-danger small mb-0">
        {{ error }}
      </div>
      <div v-else-if="databases.length === 0" class="text-center py-5 text-muted">
        <Icon icon="database" class="fs-1 opacity-50 mb-2" />
        <p class="mb-0">Keine Datenbanken</p>
      </div>
      <div v-else>
        <BTable :items="databases" :fields="dbFields" small striped>
          <template #cell(host)="{ item }">
            {{ hostPort(item) }}
          </template>
          <template #cell(actions)="{ item }">
            <BButton v-if="phpmyadminAvailable" size="sm" variant="outline-primary" :href="phpmyadminUrl(item.id)" target="_blank" class="me-1">
              phpMyAdmin
            </BButton>
            <BButton size="sm" variant="outline-secondary" @click="openCredentials(item)">
              <Icon icon="key" class="me-1" />
              Zugangsdaten
            </BButton>
          </template>
        </BTable>
        <BModal v-model="credentialsModalOpen" title="Zugangsdaten" hide-footer>
          <template v-if="credentialsModalDb">
            <p class="small text-muted">{{ credentialsModalDb.name }} – {{ hostPort(credentialsModalDb) }}</p>
            <div v-if="credentialsLoading" class="text-center py-3">
              <Icon icon="loader-2" class="fs-4" />
            </div>
            <div v-else-if="credentialsError" class="alert alert-danger small">
              {{ credentialsError }}
            </div>
            <div v-else-if="credentialsModalData" class="small">
              <div class="mb-2">
                <label class="form-label small mb-0">Benutzer</label>
                <div class="d-flex gap-1">
                  <BFormInput :value="credentialsModalData.username" readonly class="font-monospace" />
                  <BButton size="sm" variant="outline-secondary" @click="copy(credentialsModalData.username)">
                    <Icon icon="copy" />
                  </BButton>
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label small mb-0">Passwort</label>
                <div class="d-flex gap-1">
                  <BFormInput :value="credentialsModalData.password" readonly class="font-monospace" type="password" />
                  <BButton size="sm" variant="outline-secondary" @click="copy(credentialsModalData.password)">
                    <Icon icon="copy" />
                  </BButton>
                </div>
              </div>
            </div>
          </template>
          <div class="d-flex justify-content-end mt-3">
            <BButton variant="secondary" size="sm" @click="credentialsModalOpen = false">Schließen</BButton>
          </div>
        </BModal>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BButton, BCard, BCardBody, BFormInput, BModal, BTable } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'

const props = withDefaults(
  defineProps<{
    gameServerAccountId: string
    phpmyadminAvailable?: boolean
  }>(),
  { phpmyadminAvailable: false },
)

type DbHost = { address?: string; port?: number }
type DatabaseItem = {
  id: string
  host?: DbHost
  name?: string
  username?: string
}
type Credentials = {
  id: string
  host: { address: string; port: number }
  name: string
  username: string
  password: string
}

const databases = ref<DatabaseItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const credentialsModalOpen = ref(false)
const credentialsModalDb = ref<DatabaseItem | null>(null)
const credentialsModalData = ref<Credentials | null>(null)
const credentialsLoading = ref(false)
const credentialsError = ref<string | null>(null)

const baseUrl = () => `/gaming-accounts/${props.gameServerAccountId}/api/databases`
const dbFields = [
  { key: 'name', label: 'Name' },
  { key: 'host', label: 'Host' },
  { key: 'username', label: 'Benutzer' },
  { key: 'actions', label: 'Aktionen' },
]

function hostPort(db: DatabaseItem): string {
  const h = db.host
  if (!h) return '–'
  const addr = h.address ?? '127.0.0.1'
  const port = h.port ?? 3306
  return `${addr}:${port}`
}

function fetchDatabases() {
  loading.value = true
  error.value = null
  fetch(baseUrl(), { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && Array.isArray(data.databases)) {
        databases.value = data.databases
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

watch(() => props.gameServerAccountId, fetchDatabases, { immediate: true })

function phpmyadminUrl(databaseId: string): string {
  return `${baseUrl()}/${databaseId}/phpmyadmin`
}

function credentialsUrl(databaseId: string): string {
  return `${baseUrl()}/${databaseId}/credentials`
}

function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  const meta = document.querySelector('meta[name="csrf-token"]')
  return (meta && (meta as HTMLMetaElement).content) || ''
}

function openCredentials(db: DatabaseItem) {
  credentialsModalDb.value = db
  credentialsModalOpen.value = true
  credentialsModalData.value = null
  credentialsError.value = null
  credentialsLoading.value = true
  fetch(credentialsUrl(db.id), {
    headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrfToken(), 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'same-origin',
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && data.credentials) {
        credentialsModalData.value = data.credentials
      } else {
        credentialsError.value = data.message ?? 'Zugangsdaten konnten nicht geladen werden.'
      }
    })
    .catch((e) => {
      credentialsError.value = e.message ?? 'Verbindungsfehler'
    })
    .finally(() => {
      credentialsLoading.value = false
    })
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
}
</script>
