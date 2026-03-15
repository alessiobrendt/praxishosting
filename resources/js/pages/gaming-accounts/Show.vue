<template>
  <DefaultLayout>
    <Head :title="gameServerAccount?.name ?? 'Game Server'" />
    <PageBreadcrumb
      :title="gameServerAccount?.name ?? 'Game Server'"
      subtitle="Meine Game Server"
      subtitle-url="/gaming-accounts"
    />

    <BAlert v-if="flash.success" variant="success" show dismissible class="mb-3">{{ flash.success }}</BAlert>
    <BAlert v-if="flash.error" variant="danger" show dismissible class="mb-3">{{ flash.error }}</BAlert>
    <BAlert v-if="copyFeedback" variant="info" show class="mb-3 py-2">In die Zwischenablage kopiert.</BAlert>

    <div v-if="!gameServerAccount" class="alert alert-warning">
      Server-Daten werden geladen oder der Server wurde nicht gefunden.
    </div>

    <BRow v-else>
      <BCol lg="4" class="mb-4">
        <BCard no-body>
          <BCardBody class="text-center">
            <BBadge :variant="statusVariant" class="mb-2">{{ displayStatus }}</BBadge>
            <div class="mb-2">
              <Icon icon="gamepad" class="fs-1 text-muted" />
            </div>
            <h5 class="mb-1">Game-Server</h5>
            <p class="text-muted small mb-0">{{ gameServerAccount?.name }}</p>
            <p class="text-muted small mb-0">{{ planLabel }}</p>
            <div class="border rounded p-2 mt-3 bg-light">
              <span class="text-muted small">Läuft bis</span>
              <div class="fw-semibold">{{ formatDate(periodEnd) }}</div>
            </div>
            <div class="d-flex flex-column gap-2 mt-3">
              <a
                v-if="loginUrl && isOnline && !isSuspendedOrExpired"
                :href="loginUrl"
                target="_blank"
                rel="noopener"
                class="btn btn-primary"
              >
                <Icon icon="external-link" class="me-2" />
                Zum Panel verbinden
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
        <BNav tabs class="mb-3 flex-wrap">
          <BNavItem :active="activeTab === 'console'" @click="activeTab = 'console'">
            <Icon icon="terminal" class="me-1" /> Konsole
          </BNavItem>
          <BNavItem :active="activeTab === 'files'" @click="activeTab = 'files'">
            <Icon icon="folder" class="me-1" /> Dateien
          </BNavItem>
          <BNavItem :active="activeTab === 'backups'" @click="activeTab = 'backups'">
            <Icon icon="archive" class="me-1" /> Backups
          </BNavItem>
          <BNavItem :active="activeTab === 'databases'" @click="activeTab = 'databases'">
            <Icon icon="database" class="me-1" /> Datenbank
          </BNavItem>
          <BNavItem :active="activeTab === 'schedules'" @click="activeTab = 'schedules'">
            <Icon icon="calendar" class="me-1" /> Schedules
          </BNavItem>
          <BNavItem :active="activeTab === 'overview'" @click="activeTab = 'overview'">
            <Icon icon="layout-dashboard" class="me-1" /> Übersicht
          </BNavItem>
          <BNavItem :active="activeTab === 'access'" @click="activeTab = 'access'">
            <Icon icon="external-link" class="me-1" /> Zugang
          </BNavItem>
          <BNavItem :active="activeTab === 'rename'" @click="activeTab = 'rename'">
            <Icon icon="pencil" class="me-1" /> Umbenennen
          </BNavItem>
          <BNavItem
            v-if="connectDomainShowUrl || (subdomainUpdateUrl && subdomainSuffix)"
            :active="activeTab === 'domain'"
            @click="activeTab = 'domain'"
          >
            <Icon icon="globe" class="me-1" /> Domain
          </BNavItem>
          <BNavItem
            v-if="isCloudAccount && cloudResourcesUpdateUrl && !isSuspendedOrExpired"
            :active="activeTab === 'ressourcen'"
            @click="activeTab = 'ressourcen'"
          >
            <Icon icon="cpu" class="me-1" /> Ressourcen
          </BNavItem>
          <BNavItem
            v-if="canManageCollaborators"
            :active="activeTab === 'sharing'"
            @click="activeTab = 'sharing'"
          >
            <Icon icon="share" class="me-1" /> Teilen
          </BNavItem>
        </BNav>

        <!-- Konsole -->
        <GamingAccountConsoleTab
          v-if="activeTab === 'console' && gameServerAccount?.uuid"
          :game-server-account-id="gameServerAccount.uuid"
        />
        <BCard v-else-if="activeTab === 'console'" no-body>
          <BCardBody>
            <p class="text-muted small mb-3">Die Live-Konsole ist im Pterodactyl-Panel verfügbar.</p>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon icon="external-link" class="me-1" /> Zum Panel (Konsole)
            </a>
          </BCardBody>
        </BCard>

        <!-- Dateien -->
        <GamingAccountFilesTab
          v-if="activeTab === 'files' && gameServerAccount?.uuid"
          :game-server-account-id="gameServerAccount.uuid"
          :login-url="loginUrl"
        />
        <BCard v-else-if="activeTab === 'files'" no-body>
          <BCardBody>
            <p class="text-muted small mb-3">Dateiverwaltung und Editor sind im Pterodactyl-Panel verfügbar.</p>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon icon="external-link" class="me-1" /> Zum Panel (Dateien)
            </a>
          </BCardBody>
        </BCard>

        <!-- Backups -->
        <GamingAccountBackupsTab
          v-if="activeTab === 'backups' && gameServerAccount?.uuid"
          :game-server-account-id="gameServerAccount.uuid"
        />
        <BCard v-else-if="activeTab === 'backups'" no-body>
          <BCardBody>
            <p class="text-muted small mb-3">Backups erstellen und wiederherstellen können Sie im Pterodactyl-Panel.</p>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon icon="external-link" class="me-1" /> Zum Panel (Backups)
            </a>
          </BCardBody>
        </BCard>

        <!-- Datenbank -->
        <GamingAccountDatabasesTab
          v-if="activeTab === 'databases' && gameServerAccount?.uuid"
          :game-server-account-id="gameServerAccount.uuid"
          :phpmyadmin-available="phpmyadminAvailable"
        />
        <BCard v-else-if="activeTab === 'databases'" no-body>
          <BCardBody>
            <p class="text-muted small mb-3">Datenbanken verwalten Sie im Pterodactyl-Panel unter „Databases“.</p>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon icon="external-link" class="me-1" /> Zum Panel (Datenbank)
            </a>
          </BCardBody>
        </BCard>

        <!-- Schedules -->
        <GamingAccountSchedulesTab
          v-if="activeTab === 'schedules' && gameServerAccount?.uuid"
          :game-server-account-id="gameServerAccount.uuid"
          :login-url="loginUrl"
        />
        <BCard v-else-if="activeTab === 'schedules'" no-body>
          <BCardBody>
            <p class="text-muted small mb-3">Geplante Aufgaben (Schedules) richten Sie im Pterodactyl-Panel ein.</p>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon icon="external-link" class="me-1" /> Zum Panel (Schedules)
            </a>
          </BCardBody>
        </BCard>

        <!-- Übersicht -->
        <BCard v-else-if="activeTab === 'overview'" no-body>
          <BCardBody>
            <BTable :items="overviewRows" :fields="overviewFields" small stacked>
              <template #cell(value)="{ item }">
                <span v-if="item.key === 'allocation'" class="d-flex align-items-center gap-1">
                  <code class="small">{{ item.value }}</code>
                  <BButton v-if="item.value" size="sm" variant="outline-secondary" class="py-0 px-1" @click="copyToClipboard(item.value)">
                    <Icon icon="copy" />
                  </BButton>
                </span>
                <span v-else>{{ item.value }}</span>
              </template>
            </BTable>
            <div v-if="displayOverviewUsage" class="row g-3 mt-2 mb-3">
              <div class="col-6 col-md">
                <div class="rounded border bg-light p-2">
                  <span class="text-muted small">CPU</span>
                  <div class="fw-semibold small">{{ formatCpu(displayOverviewUsage.cpu_absolute) }}</div>
                </div>
              </div>
              <div class="col-6 col-md">
                <div class="rounded border bg-light p-2">
                  <span class="text-muted small">RAM</span>
                  <div class="fw-semibold small">{{ formatBytes(displayOverviewUsage.memory_bytes) }}</div>
                </div>
              </div>
              <div class="col-6 col-md">
                <div class="rounded border bg-light p-2">
                  <span class="text-muted small">Disk</span>
                  <div class="fw-semibold small">{{ formatBytes(displayOverviewUsage.disk_bytes) }}</div>
                </div>
              </div>
              <div class="col-6 col-md" v-if="displayOverviewNetwork">
                <div class="rounded border bg-light p-2">
                  <span class="text-muted small">Network</span>
                  <div class="fw-semibold small">↓ {{ formatBytes(displayOverviewNetwork.rx) }} / ↑ {{ formatBytes(displayOverviewNetwork.tx) }}</div>
                </div>
              </div>
              <div class="col-6 col-md" v-if="displayOverviewPlayers">
                <div class="rounded border bg-light p-2">
                  <span class="text-muted small">Spieler</span>
                  <div class="fw-semibold small">{{ displayOverviewPlayers }}</div>
                </div>
              </div>
            </div>
            <div v-if="!isSuspendedOrExpired" class="d-flex flex-wrap gap-2 mt-3">
              <BButton size="sm" variant="success" :disabled="isOnline || powerLoading !== null" @click="sendPower('start')">
                <Icon icon="power" class="me-1" />
                Start
              </BButton>
              <BButton size="sm" variant="outline-warning" :disabled="powerLoading !== null" @click="sendPower('restart')">
                Restart
              </BButton>
              <BButton size="sm" variant="danger" :disabled="!isOnline || powerLoading !== null" @click="sendPower('stop')">
                <Icon icon="power-off" class="me-1" />
                Stop
              </BButton>
              <BButton size="sm" variant="outline-danger" :disabled="!isOnline || powerLoading !== null" @click="sendPower('kill')">
                Kill
              </BButton>
            </div>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'access'" no-body>
          <BCardBody>
            <div v-if="gameServerAccount?.name" class="mb-3">
              <label class="form-label small">Server-Name</label>
              <div class="d-flex gap-2">
                <BFormInput :value="gameServerAccount.name" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(gameServerAccount.name)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div v-if="gameServerAccount?.identifier" class="mb-3">
              <label class="form-label small">Server-ID (Identifier)</label>
              <div class="d-flex gap-2">
                <BFormInput :value="gameServerAccount.identifier" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(gameServerAccount.identifier!)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div v-if="userEmail" class="mb-3">
              <label class="form-label small">E-Mail-Adresse</label>
              <div class="d-flex gap-2">
                <BFormInput :value="userEmail" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(userEmail)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div v-if="loginUrl" class="mb-3">
              <label class="form-label small">Panel-URL</label>
              <div class="d-flex gap-2">
                <BFormInput :value="loginUrl" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(loginUrl)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div v-if="displayAllocation" class="mb-3">
              <label class="form-label small">Server-Adresse</label>
              <div class="d-flex gap-2">
                <BFormInput :value="displayAllocation" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(displayAllocation)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div v-if="gameServerAccount?.allocation?.subdomain" class="mb-3">
              <label class="form-label small">Subdomain</label>
              <div class="d-flex gap-2">
                <BFormInput :value="gameServerAccount.allocation.subdomain" readonly class="font-monospace" />
                <BButton size="sm" variant="outline-secondary" @click="copyToClipboard(gameServerAccount.allocation!.subdomain!)">
                  <Icon icon="copy" />
                </BButton>
              </div>
            </div>
            <div class="pt-2 border-top">
              <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                <Icon icon="external-link" class="me-1" />
                Im Panel anmelden
              </a>
              <p v-else-if="isSuspendedOrExpired" class="text-muted small mb-0">Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.</p>
            </div>
            <div class="mt-4 pt-3 border-top">
              <h6 class="mb-2">Passwort</h6>
              <p class="text-muted small mb-2">
                Ihr Panel-Passwort können Sie im Pterodactyl-Panel unter „Zugangsdaten“ oder „Passwort“ anzeigen und ändern.
              </p>
              <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm">
                <Icon icon="external-link" class="me-1" />
                Panel öffnen (Passwort verwalten)
              </a>
            </div>
          </BCardBody>
        </BCard>

        <!-- Umbenennen -->
        <BCard v-else-if="activeTab === 'rename'" no-body>
          <BCardBody>
            <h6 class="mb-2">Server umbenennen</h6>
            <p class="text-muted small mb-3">
              Den Anzeigenamen Ihres Servers können Sie im Pterodactyl-Panel unter Einstellungen ändern.
            </p>
            <div v-if="gameServerAccount?.name" class="mb-3">
              <label class="form-label small">Aktueller Name</label>
              <BFormInput :value="gameServerAccount.name" readonly />
            </div>
            <a v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm">
              <Icon icon="pencil" class="me-1" />
              Im Panel umbenennen
            </a>
            <p v-else-if="isSuspendedOrExpired" class="text-muted small mb-0">Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.</p>
          </BCardBody>
        </BCard>

        <BCard v-else-if="activeTab === 'domain' && (connectDomainShowUrl || (subdomainUpdateUrl && subdomainSuffix))" no-body>
          <BCardBody>
            <p class="text-muted small mb-4">
              Mit einer eigenen Domain wirkt dein Server professioneller (z. B. mc.deinedomain.de).
            </p>
            <div v-if="connectDomainShowUrl" class="mb-4">
              <Link :href="connectDomainShowUrl" class="btn btn-primary btn-sm">Eigene Domain verbinden</Link>
            </div>
            <div v-if="subdomainUpdateUrl && subdomainSuffix" class="border-top pt-3">
              <h6 class="mb-2">Subdomain ändern</h6>
              <p class="text-muted small mb-2">Aktuelle Subdomain: {{ gameServerAccount?.allocation?.subdomain ?? '–' }}</p>
              <div class="d-flex flex-wrap align-items-end gap-2">
                <div>
                  <label class="form-label small">Neue Subdomain</label>
                  <div class="d-flex align-items-center gap-1">
                    <BFormInput v-model="subdomainPart" type="text" placeholder="mein-server" class="w-auto" maxlength="32" />
                    <span class="text-muted small">{{ subdomainSuffix }}</span>
                  </div>
                </div>
                <BButton size="sm" variant="secondary" :disabled="subdomainCheckLoading" @click="checkSubdomainAvailability">
                  Prüfen ob frei
                </BButton>
                <BButton size="sm" :disabled="subdomainUpdateLoading || !subdomainPart.trim()" @click="submitSubdomainChange">
                  Subdomain ändern
                </BButton>
              </div>
              <p
                v-if="subdomainCheckResult"
                class="mt-2 small mb-0"
                :class="subdomainCheckResult.available ? 'text-success' : 'text-danger'"
              >
                {{ subdomainCheckResult.available ? (subdomainCheckResult.message ?? 'Subdomain ist frei.') : (subdomainCheckResult.error ?? 'Subdomain vergeben.') }}
              </p>
            </div>
          </BCardBody>
        </BCard>

        <!-- Ressourcen (Cloud) -->
        <BCard v-else-if="activeTab === 'ressourcen' && isCloudAccount && cloudResourcesUpdateUrl && !isSuspendedOrExpired" no-body>
          <BCardBody>
            <h6 class="mb-2">Ressourcen anpassen</h6>
            <p class="text-muted small mb-4">
              CPU, RAM und Speicher innerhalb Ihres Abo-Kontingents anpassen.
            </p>
            <BForm @submit.prevent="submitResources" class="d-flex flex-wrap align-items-end gap-3">
              <div>
                <label class="form-label small">CPU (%)</label>
                <BFormInput
                  v-model.number="resourcesForm.cpu"
                  type="number"
                  min="0"
                  :max="resourcesMax.cpu"
                  step="1"
                  class="w-auto"
                  style="width: 6rem"
                />
              </div>
              <div>
                <label class="form-label small">RAM (MB)</label>
                <BFormInput
                  v-model.number="resourcesForm.memory_mb"
                  type="number"
                  min="64"
                  :max="resourcesMax.memory_mb"
                  step="64"
                  class="w-auto"
                  style="width: 7rem"
                />
              </div>
              <div>
                <label class="form-label small">Speicher (MB)</label>
                <BFormInput
                  v-model.number="resourcesForm.disk_mb"
                  type="number"
                  min="256"
                  :max="resourcesMax.disk_mb"
                  step="256"
                  class="w-auto"
                  style="width: 7rem"
                />
              </div>
              <BButton type="submit" :disabled="resourcesSubmitting">
                <Icon v-if="resourcesSubmitting" icon="loader-2" class="me-1" />
                Übernehmen
              </BButton>
            </BForm>
          </BCardBody>
        </BCard>

        <!-- Teilen -->
        <BCard v-else-if="activeTab === 'sharing' && canManageCollaborators" no-body>
          <BCardBody>
            <p class="text-muted small mb-0">
              Produkt teilen: Diese Funktion können Sie über das Panel oder den Support nutzen.
            </p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  BAlert,
  BButton,
  BCard,
  BCardBody,
  BCol,
  BForm,
  BFormInput,
  BNav,
  BNavItem,
  BRow,
  BTable,
  BBadge,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'
import {
  GamingAccountConsoleTab,
  GamingAccountFilesTab,
  GamingAccountBackupsTab,
  GamingAccountDatabasesTab,
  GamingAccountSchedulesTab,
} from '@/components/gaming-accounts'

type ServerOverview = {
  status?: string
  suspended?: boolean
  allocation?: string
  usage?: { cpu_absolute?: number; memory_bytes?: number; disk_bytes?: number; network_rx_bytes?: number; network_tx_bytes?: number }
  limits?: { memory?: number; disk?: number; cpu?: number }
  server_query?: { num_players?: number; max_players?: number }
}
type GameServerAccount = {
  uuid: string
  name: string
  status: string
  identifier?: string | null
  current_period_ends_at: string | null
  cancel_at_period_end?: boolean
  hosting_plan?: { name: string }
  allocation?: { subdomain?: string; cpu?: number; memory_mb?: number; disk_mb?: number; [key: string]: unknown }
}
type GameserverCloudSubscription = {
  current_period_ends_at: string | null
  plan: { name: string }
  remaining_cpu?: number
  remaining_memory_mb?: number
  remaining_disk_mb?: number
}

const props = withDefaults(
  defineProps<{
    gameServerAccount: GameServerAccount | null
    loginUrl: string | null
    userEmail?: string
    serverOverview: ServerOverview | null
    renewUrl?: string
    isSuspendedOrExpired?: boolean
    connectDomainShowUrl?: string
    domainsSearchUrl?: string | null
    subdomainCheckUrl?: string | null
    subdomainUpdateUrl?: string | null
    subdomainSuffix?: string | null
    currentSubdomainPart?: string | null
    gameserverCloudSubscription?: GameserverCloudSubscription | null
    cloudResourcesUpdateUrl?: string | null
    canManageCollaborators?: boolean
    phpmyadminAvailable?: boolean
  }>(),
  {
    userEmail: '',
    renewUrl: '',
    isSuspendedOrExpired: false,
    connectDomainShowUrl: '',
    domainsSearchUrl: null,
    subdomainCheckUrl: null,
    subdomainUpdateUrl: null,
    subdomainSuffix: null,
    currentSubdomainPart: null,
    gameserverCloudSubscription: null,
    cloudResourcesUpdateUrl: null,
    canManageCollaborators: false,
    phpmyadminAvailable: false,
  },
)

const activeTab = ref('overview')
const powerLoading = ref<string | null>(null)
const liveOverview = ref<ServerOverview | null>(props.serverOverview ?? null)
const subdomainPart = ref(props.currentSubdomainPart ?? '')
const subdomainCheckResult = ref<{ available?: boolean; error?: string; message?: string } | null>(null)
const subdomainCheckLoading = ref(false)
const subdomainUpdateLoading = ref(false)
const resourcesForm = ref({ cpu: 0, memory_mb: 512, disk_mb: 1024 })
const resourcesSubmitting = ref(false)
const copyFeedback = ref(false)
const page = usePage()
const flash = computed(() => (page.props.flash as { error?: string; success?: string }) ?? {})

const currentAllocation = computed(() => {
  const a = props.gameServerAccount?.allocation
  if (!a || typeof a !== 'object') return { cpu: 0, memory_mb: 512, disk_mb: 1024 }
  return {
    cpu: typeof a.cpu === 'number' ? a.cpu : 0,
    memory_mb: typeof a.memory_mb === 'number' ? a.memory_mb : 512,
    disk_mb: typeof a.disk_mb === 'number' ? a.disk_mb : 1024,
  }
})
const resourcesMax = computed(() => {
  const sub = props.gameserverCloudSubscription
  if (!sub) return { cpu: 0, memory_mb: 512, disk_mb: 1024 }
  const cur = currentAllocation.value
  return {
    cpu: cur.cpu + (sub.remaining_cpu ?? 0),
    memory_mb: cur.memory_mb + (sub.remaining_memory_mb ?? 0),
    disk_mb: cur.disk_mb + (sub.remaining_disk_mb ?? 0),
  }
})

const isCloudAccount = computed(() => !!props.gameserverCloudSubscription)
const planLabel = computed(() =>
  isCloudAccount.value && props.gameserverCloudSubscription
    ? props.gameserverCloudSubscription.plan.name
    : props.gameServerAccount?.hosting_plan?.name ?? '–',
)
const periodEnd = computed(() =>
  isCloudAccount.value && props.gameserverCloudSubscription
    ? props.gameserverCloudSubscription.current_period_ends_at
    : props.gameServerAccount?.current_period_ends_at ?? null,
)
const displayOverview = computed(() => liveOverview.value ?? props.serverOverview ?? null)
const isOnline = computed(() => {
  const s = displayOverview.value?.status?.toLowerCase()
  return s === 'running' || s === 'started'
})
const isSuspendedOrExpired = computed(() => props.isSuspendedOrExpired ?? false)
const displayStatus = computed(() => {
  if (isSuspendedOrExpired.value) return 'Gesperrt'
  const s = displayOverview.value?.status
  if (s?.toLowerCase() === 'running' || s?.toLowerCase() === 'started') return 'Online'
  if (s?.toLowerCase() === 'stopping' || s?.toLowerCase() === 'starting') return s
  if (displayOverview.value?.suspended) return 'Gesperrt'
  return displayOverview.value?.status ?? props.gameServerAccount?.status ?? '–'
})
const statusVariant = computed((): 'success' | 'secondary' | 'danger' => {
  if (isSuspendedOrExpired.value || displayOverview.value?.suspended) return 'danger'
  const s = displayOverview.value?.status?.toLowerCase()
  if (s === 'running' || s === 'started') return 'success'
  return 'secondary'
})
const displayAllocation = computed(() => displayOverview.value?.allocation ?? null)

const overviewFields = [{ key: 'label', label: '' }, { key: 'value', label: '' }]
const overviewRows = computed(() => {
  const o = displayOverview.value
  const acc = props.gameServerAccount
  return [
    { key: 'allocation', label: 'Adresse', value: o?.allocation ?? '–' },
    { key: 'status', label: 'Status', value: o?.status ?? acc?.status ?? '–' },
    { key: 'plan', label: 'Paket', value: planLabel.value },
  ]
})

const displayOverviewUsage = computed(() => {
  const u = displayOverview.value?.usage
  if (!u) return null
  return {
    cpu_absolute: u.cpu_absolute ?? 0,
    memory_bytes: u.memory_bytes ?? 0,
    disk_bytes: u.disk_bytes ?? 0,
  }
})
const displayOverviewNetwork = computed(() => {
  const u = displayOverview.value?.usage
  if (!u || (u.network_rx_bytes == null && u.network_tx_bytes == null)) return null
  return { rx: u.network_rx_bytes ?? 0, tx: u.network_tx_bytes ?? 0 }
})
const displayOverviewPlayers = computed(() => {
  const q = displayOverview.value?.server_query
  if (!q || q.max_players == null || q.max_players <= 0) return null
  return `${q.num_players ?? 0} / ${q.max_players}`
})

function formatDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
function formatCpu(cpuAbsolute: number): string {
  if (cpuAbsolute <= 0) return '0%'
  return `${Math.round(cpuAbsolute * 100)}%`
}

function copyToClipboard(text: string) {
  if (!text) return
  navigator.clipboard.writeText(text).then(
    () => {
      copyFeedback.value = true
      setTimeout(() => { copyFeedback.value = false }, 2000)
    },
    () => {},
  )
}

function sendPower(action: 'start' | 'stop' | 'restart' | 'kill') {
  if (!props.gameServerAccount?.uuid) return
  powerLoading.value = action
  const prev = displayOverview.value
  if (prev && (action === 'stop' || action === 'restart' || action === 'kill')) {
    liveOverview.value = { ...prev, status: 'stopping' }
  } else if (prev && action === 'start') {
    liveOverview.value = { ...prev, status: 'starting' }
  }
  router.post(`/gaming-accounts/${props.gameServerAccount.uuid}/power`, { action }, {
    preserveScroll: true,
    onSuccess: () => {
      powerLoading.value = null
      fetchOverview()
    },
    onError: () => {
      powerLoading.value = null
      liveOverview.value = props.serverOverview ?? null
    },
    onFinish: () => {
      powerLoading.value = null
    },
  })
}

function fetchOverview() {
  if (!props.gameServerAccount?.uuid) return
  fetch(`/gaming-accounts/${props.gameServerAccount.uuid}/overview`, {
    method: 'GET',
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'same-origin',
  })
    .then((res) => {
      if (!res.ok) return
      return res.json()
    })
    .then((data) => {
      if (data?.serverOverview !== undefined) {
        liveOverview.value = data.serverOverview
      }
    })
    .catch(() => {})
}

let overviewPollInterval: ReturnType<typeof setInterval> | null = null
function initResourcesForm() {
  const cur = currentAllocation.value
  resourcesForm.value = { cpu: cur.cpu, memory_mb: cur.memory_mb, disk_mb: cur.disk_mb }
}

function submitResources() {
  if (!props.cloudResourcesUpdateUrl) return
  resourcesSubmitting.value = true
  router.put(props.cloudResourcesUpdateUrl, {
    cpu: resourcesForm.value.cpu,
    memory_mb: resourcesForm.value.memory_mb,
    disk_mb: resourcesForm.value.disk_mb,
  }, {
    preserveScroll: true,
    onFinish: () => { resourcesSubmitting.value = false },
  })
}

onMounted(() => {
  fetchOverview()
  overviewPollInterval = setInterval(fetchOverview, 3000)
  if (props.subdomainUpdateUrl) {
    subdomainPart.value = props.currentSubdomainPart ?? ''
  }
  if (props.cloudResourcesUpdateUrl) {
    initResourcesForm()
  }
})
onUnmounted(() => {
  if (overviewPollInterval) clearInterval(overviewPollInterval)
})
watch(
  () => props.currentSubdomainPart,
  (v) => { subdomainPart.value = v ?? '' },
)

function checkSubdomainAvailability() {
  const part = subdomainPart.value.trim().toLowerCase()
  if (!part || !props.subdomainCheckUrl) return
  if (!/^[a-z0-9-]+$/.test(part) || part.length > 32) {
    subdomainCheckResult.value = { available: false, error: 'Nur Kleinbuchstaben, Ziffern und Bindestriche (max. 32 Zeichen).' }
    return
  }
  subdomainCheckLoading.value = true
  subdomainCheckResult.value = null
  fetch(`${props.subdomainCheckUrl}?subdomain=${encodeURIComponent(part)}`, {
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'same-origin',
  })
    .then((res) => res.json())
    .then((data) => { subdomainCheckResult.value = data })
    .catch(() => { subdomainCheckResult.value = { available: false, error: 'Prüfung fehlgeschlagen.' } })
    .finally(() => { subdomainCheckLoading.value = false })
}

function submitSubdomainChange() {
  const part = subdomainPart.value.trim().toLowerCase()
  if (!part || !props.subdomainUpdateUrl) return
  if (!/^[a-z0-9-]+$/.test(part) || part.length > 32) return
  subdomainUpdateLoading.value = true
  router.put(props.subdomainUpdateUrl, { subdomain: part }, {
    preserveScroll: true,
    onFinish: () => { subdomainUpdateLoading.value = false },
  })
}
</script>
