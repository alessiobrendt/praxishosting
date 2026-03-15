<template>
  <DefaultLayout>
    <Head :title="webspaceAccount?.domain ?? 'Webspace'" />
    <PageBreadcrumb
      :title="webspaceAccount?.domain ?? 'Webspace'"
      subtitle="Meine Webspace-Accounts"
      subtitle-url="/webspace-accounts"
    />

    <BRow>
      <BCol lg="4" class="mb-4">
        <BCard no-body>
          <BCardBody class="text-center">
            <BBadge :variant="statusVariant(webspaceAccount?.status ?? '')" class="mb-2">
              {{ displayStatus(webspaceAccount?.status ?? '') }}
            </BBadge>
            <div class="mb-2">
              <Icon icon="server" class="fs-1 text-muted" />
            </div>
            <h5 class="mb-1">Webspace</h5>
            <p class="font-monospace small mb-0 text-break">{{ webspaceAccount?.domain }}</p>
            <p class="text-muted small mb-0">{{ webspaceAccount?.hosting_plan?.name }}</p>
            <div class="border rounded p-2 mt-3 bg-light">
              <span class="text-muted small">Läuft bis</span>
              <div class="fw-semibold">{{ formatDate(webspaceAccount?.current_period_ends_at) }}</div>
            </div>
            <div class="d-flex flex-column gap-2 mt-3">
              <a
                v-if="!isSuspendedOrExpired"
                :href="pleskLoginUrl"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
              >
                <Icon icon="external-link" class="me-2" />
                Zum Plesk-Panel
              </a>
              <a v-else class="btn btn-secondary disabled">Gesperrt – bitte verlängern</a>
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
        </BNav>

        <BCard v-if="activeTab === 'overview'" no-body>
          <BCardBody>
            <BTable :items="overviewRows" :fields="[{ key: 'label', label: '' }, { key: 'value', label: '' }]" small stacked="">
              <template #cell(label)="{ item }">{{ item.label }}</template>
              <template #cell(value)="{ item }">
                <BBadge v-if="item.key === 'status'" :variant="statusVariant(item.value)">{{ displayStatus(item.value) }}</BBadge>
                <span v-else>{{ item.value }}</span>
              </template>
            </BTable>
            <template v-if="resourceUsage">
              <h6 class="mt-4 mb-2">Genutzte Ressourcen</h6>
              <div class="small">
                <div class="mb-2">
                  <div class="d-flex justify-content-between mb-1">
                    <span>Speicherplatz</span>
                    <span>{{ formatBytesToGb(resourceUsage.disk_used_bytes) }} / {{ formatBytesToGb(resourceUsage.disk_limit_bytes) }} GB</span>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar" :style="{ width: resourcePercent(resourceUsage.disk_used_bytes, resourceUsage.disk_limit_bytes) + '%' }" />
                  </div>
                </div>
                <div class="mb-2">
                  <div class="d-flex justify-content-between mb-1">
                    <span>Domains</span>
                    <span>{{ resourceUsage.domains_used }} / {{ resourceUsage.domains_limit }}</span>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar" :style="{ width: resourcePercent(resourceUsage.domains_used, resourceUsage.domains_limit) + '%' }" />
                  </div>
                </div>
                <div class="mb-2">
                  <div class="d-flex justify-content-between mb-1">
                    <span>E-Mail-Postfächer</span>
                    <span>{{ resourceUsage.mailboxes_used }} / {{ resourceUsage.mailboxes_limit }}</span>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar" :style="{ width: resourcePercent(resourceUsage.mailboxes_used, resourceUsage.mailboxes_limit) + '%' }" />
                  </div>
                </div>
                <div>
                  <div class="d-flex justify-content-between mb-1">
                    <span>Datenbanken</span>
                    <span>{{ resourceUsage.databases_used }} / {{ resourceUsage.databases_limit }}</span>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar" :style="{ width: resourcePercent(resourceUsage.databases_used, resourceUsage.databases_limit) + '%' }" />
                  </div>
                </div>
              </div>
            </template>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'access'" no-body>
          <BCardBody>
            <div class="mb-3">
              <label class="form-label small">Plesk-Nutzername</label>
              <div class="d-flex gap-2">
                <BFormInput :value="webspaceAccount?.plesk_username ?? '–'" readonly class="font-monospace" />
                <BButton v-if="webspaceAccount?.plesk_username" size="sm" variant="outline-secondary" @click="copyToClipboard(webspaceAccount!.plesk_username!)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div class="mb-3" v-if="pleskPassword != null">
              <label class="form-label small">Passwort</label>
              <div class="d-flex gap-2">
                <BFormInput :type="showPassword ? 'text' : 'password'" :value="displayPassword" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="showPassword = !showPassword">
                  <Icon :icon="showPassword ? 'eye-off' : 'eye'" />
                </BButton>
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(pleskPassword ?? '')">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <a v-if="webmailUrl" :href="webmailUrl" target="_blank" rel="noopener" class="btn btn-outline-primary">
              <Icon icon="mail" class="me-2" />
              Webmail öffnen
            </a>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import {
  BBadge,
  BCard,
  BCardBody,
  BButton,
  BCol,
  BFormInput,
  BNav,
  BNavItem,
  BRow,
  BTable,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type WebspaceAccount = {
  id?: number
  uuid?: string
  domain: string
  plesk_username: string
  status: string
  current_period_ends_at: string | null
  cancel_at_period_end: boolean
  hosting_plan: { name: string }
}
type ResourceUsage = {
  disk_used_bytes: number
  disk_limit_bytes: number
  domains_used: number
  domains_limit: number
  subdomains_used?: number
  subdomains_limit?: number
  mailboxes_used: number
  mailboxes_limit: number
  databases_used: number
  databases_limit: number
}

const props = defineProps<{
  webspaceAccount: WebspaceAccount | null
  pleskPassword: string | null
  webmailUrl: string
  resourceUsage: ResourceUsage | null
  renewUrl?: string
  isSuspendedOrExpired?: boolean
  connectDomainShowUrl?: string
}>()

const activeTab = ref('overview')
const showPassword = ref(false)

const isSuspendedOrExpired = computed(() => props.isSuspendedOrExpired ?? false)
const pleskLoginUrl = computed(() => {
  const acc = props.webspaceAccount
  if (!acc?.uuid) return '#'
  return `/webspace-accounts/${acc.uuid}/plesk-login`
})

const displayPassword = computed(() =>
  props.pleskPassword
    ? showPassword.value
      ? props.pleskPassword
      : '••••••••••••••••••••'
    : '—',
)

const overviewRows = computed(() => {
  const acc = props.webspaceAccount
  if (!acc) return []
  return [
    { key: 'domain', label: 'Domain', value: acc.domain },
    { key: 'plesk_username', label: 'Plesk-Nutzername', value: acc.plesk_username },
    { key: 'status', label: 'Status', value: acc.status },
    { key: 'plan', label: 'Paket', value: acc.hosting_plan?.name ?? '–' },
  ]
})

const resourceUsage = computed(() => props.resourceUsage)

function formatDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}

function displayStatus(status: string): string {
  const s = status?.toLowerCase() ?? ''
  if (s === 'active' || s === 'aktiv') return 'Aktiv'
  if (s === 'pending' || s === 'ausstehend') return 'Ausstehend'
  if (s === 'suspended' || s === 'gesperrt') return 'Gesperrt'
  if (s === 'cancelled') return 'Gekündigt'
  return status || '–'
}

function statusVariant(status: string): 'success' | 'secondary' | 'danger' {
  const s = status?.toLowerCase() ?? ''
  if (s === 'active' || s === 'aktiv') return 'success'
  if (s === 'suspended' || s === 'gesperrt' || s === 'cancelled') return 'danger'
  return 'secondary'
}

function formatBytesToGb(bytes: number): string {
  if (bytes === 0) return '0,00'
  const gb = bytes / (1024 * 1024 * 1024)
  return gb.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function resourcePercent(used: number, limit: number): number {
  if (limit <= 0) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>
