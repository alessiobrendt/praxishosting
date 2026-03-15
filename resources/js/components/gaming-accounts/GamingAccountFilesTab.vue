<template>
  <BCard no-body>
    <BCardBody>
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h6 class="mb-0">Dateien</h6>
        <div class="d-flex align-items-center gap-2">
          <BButton size="sm" variant="outline-secondary" :disabled="loading || currentDir === '/'" @click="navigateTo(parentPath)">
            <Icon icon="arrow-up" class="me-1" />
            Hoch
          </BButton>
          <a v-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            <Icon icon="external-link" class="me-1" />
            Im Panel öffnen
          </a>
        </div>
      </div>
      <nav v-if="breadcrumbs.length" class="mb-2 small">
        <BButton size="sm" variant="link" class="p-0 text-decoration-none" @click="navigateTo('')">
          <Icon icon="home" class="me-1" />
          /
        </BButton>
        <span v-for="(part, i) in breadcrumbs" :key="i" class="text-muted">
          <BButton
            size="sm"
            variant="link"
            class="p-0 text-decoration-none"
            @click="navigateTo(breadcrumbPath(i))"
          >
            {{ part }}
          </BButton>
          <span v-if="i < breadcrumbs.length - 1">/</span>
        </span>
      </nav>
      <div v-if="loading" class="text-center py-5">
        <Icon icon="loader-2" class="fs-2 text-muted" />
      </div>
      <div v-else-if="error" class="alert alert-danger small mb-0">
        {{ error }}
      </div>
      <div v-else-if="files.length === 0" class="text-center py-5 text-muted">
        <Icon icon="folder" class="fs-1 opacity-50 mb-2" />
        <p class="mb-0">Dieser Ordner ist leer</p>
      </div>
      <BTable v-else :items="files" :fields="fileFields" small striped>
        <template #cell(name)="{ item }">
          <span class="d-inline-flex align-items-center gap-1">
            <Icon v-if="isFile(item)" icon="file" class="text-muted" />
            <Icon v-else icon="folder" class="text-warning" />
            <BButton
              v-if="!isFile(item)"
              variant="link"
              class="p-0 text-start text-decoration-none"
              @click="navigateTo(getFilePath(item.name))"
            >
              {{ item.name }}
            </BButton>
            <span v-else>{{ item.name }}</span>
          </span>
        </template>
        <template #cell(size)="{ item }">
          <span v-if="isFile(item) && item.size != null">{{ formatBytes(item.size) }}</span>
          <span v-else class="text-muted">–</span>
        </template>
        <template #cell(modified_at)="{ item }">
          {{ formatDate(item.modified_at) }}
        </template>
        <template #cell(actions)="{ item }">
          <span v-if="isFile(item)" class="d-inline-flex gap-1">
            <BButton
              v-if="isEditableFile(item)"
              size="sm"
              variant="outline-secondary"
              @click="openEditor(item.name)"
            >
              <Icon icon="edit" class="me-1" />
              Öffnen
            </BButton>
            <BButton size="sm" variant="outline-primary" @click="downloadFile(item.name)">
              <Icon icon="download" class="me-1" />
              Download
            </BButton>
          </span>
        </template>
      </BTable>
    </BCardBody>
  </BCard>

  <!-- Editor-Modal -->
  <BModal
    v-model="editorVisible"
    :title="editorFileName ? `Bearbeiten: ${editorFileName}` : 'Datei bearbeiten'"
    size="xl"
    body-class="p-0"
    hide-footer
    @hidden="editorVisible = false"
  >
    <div v-if="editorLoading" class="text-center py-5">
      <Icon icon="loader-2" class="fs-2 text-muted" />
    </div>
    <div v-else-if="editorError" class="alert alert-danger m-3 mb-0">
      {{ editorError }}
    </div>
    <template v-else>
      <BFormTextarea
        v-model="editorContent"
        class="font-monospace border-0 rounded-0"
        rows="20"
        placeholder="Inhalt wird geladen…"
        spellcheck="false"
      />
      <BCardBody class="d-flex justify-content-end gap-2 border-top">
        <BButton variant="outline-secondary" @click="editorVisible = false">Abbrechen</BButton>
        <BButton variant="primary" :disabled="editorSaving" @click="saveFile">
          <Icon v-if="editorSaving" icon="loader-2" class="me-1" />
          Speichern
        </BButton>
      </BCardBody>
    </template>
  </BModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BButton, BCard, BCardBody, BTable, BModal, BFormTextarea } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import { formatBytes } from './formatBytes'

const props = defineProps<{
  gameServerAccountId: string
  loginUrl?: string | null
}>()

type FileItem = {
  name: string
  size?: number
  is_file?: boolean
  modified_at?: string
  mimetype?: string
  mime?: string
}

const currentDir = ref('/')
const files = ref<FileItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const editorVisible = ref(false)
const editorFileName = ref('')
const editorFilePath = ref('')
const editorContent = ref('')
const editorLoading = ref(false)
const editorError = ref<string | null>(null)
const editorSaving = ref(false)

function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]')
  return (meta && (meta as HTMLMetaElement).content) || ''
}

const baseUrl = () => `/gaming-accounts/${props.gameServerAccountId}/api/files`
const fileFields = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Größe' },
  { key: 'modified_at', label: 'Geändert' },
  { key: 'actions', label: '' },
]

const breadcrumbs = computed(() => {
  if (currentDir.value === '/' || !currentDir.value) return []
  return currentDir.value.split('/').filter(Boolean)
})

const parentPath = computed(() => {
  if (!currentDir.value || currentDir.value === '/') return '/'
  const parts = currentDir.value.split('/').filter(Boolean)
  parts.pop()
  return parts.length ? `/${parts.join('/')}` : ''
})

function fetchFiles() {
  loading.value = true
  error.value = null
  const dir = currentDir.value || '/'
  const url = `${baseUrl()}/list?directory=${encodeURIComponent(dir)}`
  fetch(url, { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && Array.isArray(data.files)) {
        files.value = data.files
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

watch(
  () => [props.gameServerAccountId, currentDir.value],
  () => fetchFiles(),
  { immediate: true },
)

function getRoot() {
  return currentDir.value || '/'
}

function getFilePath(name: string) {
  const root = getRoot()
  return root === '/' ? `/${name}` : `${root}/${name}`
}

function breadcrumbPath(index: number) {
  const parts = breadcrumbs.value.slice(0, index + 1)
  return parts.length ? `/${parts.join('/')}` : ''
}

function navigateTo(path: string) {
  currentDir.value = path || '/'
}

function isFile(item: FileItem) {
  return item.is_file === true || (item.mimetype != null && item.mimetype !== 'inode/directory')
}

const textExtensions = /\.(txt|md|json|js|ts|jsx|tsx|vue|php|html|htm|css|scss|sass|env|log|yml|yaml|xml|sql|ini|conf|cfg|sh|bat|gitignore|htaccess)$/i

function isEditableFile(item: FileItem): boolean {
  if (!isFile(item)) return false
  const mime = item.mimetype ?? item.mime ?? ''
  if (typeof mime === 'string' && (mime.startsWith('text/') || mime === 'application/json' || mime === 'application/xml')) return true
  return textExtensions.test(item.name)
}

function openEditor(fileName: string) {
  const path = getFilePath(fileName)
  editorFileName.value = fileName
  editorFilePath.value = path
  editorContent.value = ''
  editorError.value = null
  editorVisible.value = true
  editorLoading.value = true
  const url = `${baseUrl()}/contents?path=${encodeURIComponent(path)}`
  fetch(url, { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.success && typeof data.content === 'string') {
        editorContent.value = data.content
      } else {
        editorError.value = data.message ?? 'Datei konnte nicht geladen werden.'
      }
    })
    .catch((e) => {
      editorError.value = e.message ?? 'Verbindungsfehler'
    })
    .finally(() => {
      editorLoading.value = false
    })
}

function saveFile() {
  if (!editorFilePath.value) return
  editorSaving.value = true
  editorError.value = null
  const url = `${baseUrl()}/write`
  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getCsrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ path: editorFilePath.value, content: editorContent.value }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        editorVisible.value = false
        fetchFiles()
      } else {
        editorError.value = data.message ?? 'Speichern fehlgeschlagen.'
      }
    })
    .catch((e) => {
      editorError.value = e.message ?? 'Verbindungsfehler'
    })
    .finally(() => {
      editorSaving.value = false
    })
}

function downloadFile(name: string) {
  const path = getFilePath(name)
  const url = `${baseUrl()}/download?path=${encodeURIComponent(path)}`
  window.open(url, '_blank')
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
