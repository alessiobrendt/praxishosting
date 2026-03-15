<template>
  <BCard no-body>
    <BCardBody>
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h6 class="mb-0">Schedules</h6>
        <div class="d-flex gap-2">
          <BButton size="sm" variant="outline-primary" :disabled="creating" @click="openCreateModal">
            <Icon v-if="creating" icon="loader-2" class="me-1" />
            <Icon v-else icon="plus" class="me-1" />
            Neuer Schedule
          </BButton>
          <a v-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-outline-secondary btn-sm">
            <Icon icon="external-link" class="me-1" />
            Im Panel
          </a>
        </div>
      </div>
      <div v-if="loading" class="text-center py-5">
        <Icon icon="loader-2" class="fs-2 text-muted" />
      </div>
      <div v-else-if="error" class="alert alert-danger small mb-0">
        {{ error }}
      </div>
      <div v-else-if="schedules.length === 0" class="text-center py-5 text-muted">
        <Icon icon="calendar" class="fs-1 opacity-50 mb-2" />
        <p class="mb-0">Keine Schedules</p>
      </div>
      <div v-else class="table-responsive">
        <BTable :items="schedules" :fields="scheduleFields" small striped>
          <template #cell(name)="{ item }">
            {{ item.name ?? `Schedule #${item.id}` }}
          </template>
          <template #cell(cron)="{ item }">
            <code class="small">{{ cronString(item) }}</code>
          </template>
          <template #cell(is_active)="{ item }">
            <BBadge :variant="item.is_active !== false ? 'success' : 'secondary'">
              {{ item.is_active !== false ? 'Aktiv' : 'Inaktiv' }}
            </BBadge>
          </template>
          <template #cell(next_run_at)="{ item }">
            {{ formatDate(item.next_run_at) }}
          </template>
          <template #cell(actions)="{ item }">
            <BButton size="sm" variant="outline-primary" class="me-1" @click="executeSchedule(item.id)">
              <Icon icon="play" class="me-1" />
              Ausführen
            </BButton>
            <BButton size="sm" variant="outline-danger" @click="deleteSchedule(item.id)">
              <Icon icon="trash" />
            </BButton>
          </template>
        </BTable>
      </div>

      <BModal v-model="createModalOpen" title="Neuer Schedule" hide-footer>
        <BForm @submit.prevent="submitCreate">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <BFormInput v-model="form.name" placeholder="z. B. Backup täglich" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small">Minute</label>
              <BFormInput v-model="form.minute" placeholder="*/5" />
            </div>
            <div class="col-6">
              <label class="form-label small">Stunde</label>
              <BFormInput v-model="form.hour" placeholder="*" />
            </div>
            <div class="col-6">
              <label class="form-label small">Tag (Monat)</label>
              <BFormInput v-model="form.day_of_month" placeholder="*" />
            </div>
            <div class="col-6">
              <label class="form-label small">Monat</label>
              <BFormInput v-model="form.month" placeholder="*" />
            </div>
            <div class="col-6">
              <label class="form-label small">Tag (Woche)</label>
              <BFormInput v-model="form.day_of_week" placeholder="*" />
            </div>
          </div>
          <div class="mb-3">
            <BFormCheckbox v-model="form.is_active">Aktiv</BFormCheckbox>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <BButton variant="secondary" @click="createModalOpen = false">Abbrechen</BButton>
            <BButton type="submit" :disabled="creating">Erstellen</BButton>
          </div>
        </BForm>
      </BModal>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BButton, BBadge, BCard, BCardBody, BForm, BFormInput, BFormCheckbox, BModal, BTable } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'

const props = defineProps<{
  gameServerAccountId: string
  loginUrl?: string | null
}>()

type Schedule = {
  id: number
  name?: string
  cron?: {
    minute?: string
    hour?: string
    day_of_month?: string
    month?: string
    day_of_week?: string
  }
  is_active?: boolean
  next_run_at?: string
}

const schedules = ref<Schedule[]>([])
const loading = ref(false)
const creating = ref(false)
const error = ref<string | null>(null)
const createModalOpen = ref(false)
const form = ref({
  name: '',
  minute: '*/5',
  hour: '*',
  day_of_month: '*',
  month: '*',
  day_of_week: '*',
  is_active: true,
})

const baseUrl = () => `/gaming-accounts/${props.gameServerAccountId}/api/schedules`
const scheduleFields = [
  { key: 'name', label: 'Name' },
  { key: 'cron', label: 'Cron' },
  { key: 'is_active', label: 'Status' },
  { key: 'next_run_at', label: 'Nächste Ausführung' },
  { key: 'actions', label: 'Aktionen' },
]

function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  const meta = document.querySelector('meta[name="csrf-token"]')
  return (meta && (meta as HTMLMetaElement).content) || ''
}

function fetchSchedules() {
  loading.value = true
  error.value = null
  fetch(baseUrl(), { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && Array.isArray(data.schedules)) {
        schedules.value = data.schedules
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

watch(() => props.gameServerAccountId, fetchSchedules, { immediate: true })

function cronString(s: Schedule) {
  const c = s.cron ?? {}
  const parts = [
    c.minute ?? '*',
    c.hour ?? '*',
    c.day_of_month ?? '*',
    c.month ?? '*',
    c.day_of_week ?? '*',
  ]
  return parts.join(' ')
}

function openCreateModal() {
  form.value = {
    name: '',
    minute: '*/5',
    hour: '*',
    day_of_month: '*',
    month: '*',
    day_of_week: '*',
    is_active: true,
  }
  createModalOpen.value = true
}

function submitCreate() {
  if (creating.value) return
  creating.value = true
  const payload = {
    name: form.value.name.trim() || 'Schedule',
    minute: form.value.minute || '*',
    hour: form.value.hour || '*',
    day_of_month: form.value.day_of_month || '*',
    month: form.value.month || '*',
    day_of_week: form.value.day_of_week || '*',
    is_active: form.value.is_active,
  }
  fetch(baseUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getCsrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        createModalOpen.value = false
        fetchSchedules()
      } else {
        error.value = data.message ?? 'Fehler'
      }
    })
    .catch(() => { error.value = 'Verbindungsfehler' })
    .finally(() => { creating.value = false })
}

function deleteSchedule(scheduleId: number) {
  if (!confirm('Schedule wirklich löschen?')) return
  fetch(`${baseUrl()}/${scheduleId}`, {
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
        fetchSchedules()
      } else {
        error.value = data?.message ?? 'Fehler'
      }
    })
    .catch(() => { error.value = 'Verbindungsfehler' })
}

function executeSchedule(scheduleId: number) {
  fetch(`${baseUrl()}/${scheduleId}/execute`, {
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
    .then((r) => r.json().catch(() => ({})))
    .then((data) => {
      if (data?.success !== false) {
        fetchSchedules()
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
