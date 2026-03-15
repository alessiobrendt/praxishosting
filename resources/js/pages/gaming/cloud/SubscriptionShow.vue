<template>
  <DefaultLayout>
    <Head :title="`Cloud-Abo: ${subscription?.plan?.name ?? ''}`" />
    <PageBreadcrumb
      :title="subscription?.plan?.name ?? 'Cloud-Abo'"
      subtitle="Meine Cloud-Abos"
      subtitle-url="/gaming/cloud/subscriptions"
    />

    <div v-if="!subscription" class="text-muted">Lade …</div>

    <template v-else>
      <BCard no-body class="mb-4">
        <BCardBody class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded bg-primary bg-opacity-10 p-2">
              <Icon icon="cloud" class="fs-4 text-primary" />
            </div>
            <div>
              <h4 class="mb-1 d-flex align-items-center gap-2">
                {{ subscription.plan.name }}
                <BBadge :variant="subscription.status === 'active' ? 'success' : 'secondary'">
                  {{ subscription.status === 'active' ? 'Aktiv' : subscription.status }}
                </BBadge>
              </h4>
              <p class="text-muted small mb-0">
                {{ totalMemoryGb }} GB RAM · {{ totalCpu }}% CPU · {{ totalDiskGb }} GB Disk ·
                bis {{ formatDate(subscription.current_period_ends_at) }}
              </p>
            </div>
          </div>
          <div class="d-flex gap-2">
            <Link href="/gaming/cloud/subscriptions" class="btn btn-outline-secondary btn-sm">Zurück</Link>
            <a v-if="subscription.status === 'active' && renewUrl" :href="renewUrl" class="btn btn-primary btn-sm">Verlängern</a>
          </div>
        </BCardBody>
      </BCard>

      <BRow>
        <BCol xl="8">
          <BCard no-body class="mb-4">
            <BCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h5 class="mb-0 d-flex align-items-center gap-2">
                <Icon icon="server" />
                Server
              </h5>
              <div>
                <BButton
                  v-if="canAddServer && !showAddServerForm"
                  size="sm"
                  variant="primary"
                  @click="showAddServerForm = true; initAddServerForm()"
                >
                  <Icon icon="plus" class="me-1" />
                  Server erstellen
                </BButton>
                <BButton v-else-if="showAddServerForm" size="sm" variant="outline-secondary" @click="showAddServerForm = false">
                  Abbrechen
                </BButton>
              </div>
            </BCardHeader>
            <BCardBody>
              <BAlert v-if="flash.error" variant="danger" show dismissible>{{ flash.error }}</BAlert>
              <BAlert v-if="formErrors.allocation" variant="danger" show>{{ formErrors.allocation }}</BAlert>
              <BAlert v-if="flash.success" variant="success" show>{{ flash.success }}</BAlert>

              <BForm v-if="showAddServerForm" @submit.prevent="submitCreateServer" class="border rounded p-3 bg-light mb-4">
                <div class="row g-3">
                  <BCol md="6">
                    <label class="form-label">Server-Name (optional)</label>
                    <BFormInput v-model="createServer.name" placeholder="Mein Gameserver" />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label">Spiel *</label>
                    <BFormSelect v-model="createServer.nest_id" required :options="nestOptions" />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label">Version *</label>
                    <BFormSelect v-model="createServer.egg_id" required :options="eggOptions" :disabled="!createServer.nest_id" />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label">RAM (MB) *</label>
                    <BFormInput v-model.number="createServer.memory_mb" type="number" :min="512" :max="maxMemoryMb" required />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label">CPU (%) *</label>
                    <BFormInput v-model.number="createServer.cpu" type="number" :min="50" :max="maxCpu" required />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label">Speicher (MB) *</label>
                    <BFormInput v-model.number="createServer.disk_mb" type="number" :min="1024" :max="maxDiskMb" required />
                  </BCol>
                  <BCol cols="12">
                    <BButton type="submit" variant="primary" :disabled="createServerSubmitting">
                      {{ createServerSubmitting ? 'Wird erstellt…' : 'Server erstellen' }}
                    </BButton>
                  </BCol>
                </div>
              </BForm>

              <div v-if="subscription.game_server_accounts.length === 0 && !showAddServerForm" class="text-center py-5 text-muted">
                Noch keine Server. Klicken Sie auf „Server erstellen“.
              </div>
              <BRow v-else class="g-3">
                <BCol v-for="acc in subscription.game_server_accounts" :key="acc.uuid" md="6">
                  <BCard no-body class="h-100">
                    <BCardBody>
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">{{ acc.name || 'Server' }}</h6>
                        <BBadge :variant="isServerOnline(acc) ? 'success' : 'secondary'">
                          {{ isServerOnline(acc) ? 'Online' : 'Offline' }}
                        </BBadge>
                      </div>
                      <p class="small text-muted mb-2">{{ acc.nest_name ?? '–' }} · {{ acc.egg_name ?? '–' }}</p>
                      <div class="d-flex flex-wrap gap-1 justify-content-between align-items-center">
                        <div class="d-flex gap-1">
                          <BButton
                            v-if="acc.identifier"
                            size="sm"
                            variant="outline-success"
                            class="py-0 px-1"
                            title="Start"
                            @click="sendPower(acc, 'start')"
                          >
                            <Icon icon="play" />
                          </BButton>
                          <BButton
                            v-if="acc.identifier"
                            size="sm"
                            variant="outline-warning"
                            class="py-0 px-1"
                            title="Neustart"
                            @click="sendPower(acc, 'restart')"
                          >
                            <Icon icon="rotate-cw" />
                          </BButton>
                          <BButton
                            v-if="acc.identifier"
                            size="sm"
                            variant="outline-danger"
                            class="py-0 px-1"
                            title="Stoppen"
                            @click="sendPower(acc, 'stop')"
                          >
                            <Icon icon="square" />
                          </BButton>
                        </div>
                        <Link :href="`/gaming-accounts/${acc.uuid}`" class="btn btn-sm btn-primary">Verwalten</Link>
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>
              </BRow>
            </BCardBody>
          </BCard>
        </BCol>
        <BCol xl="4">
          <BCard no-body class="mb-4">
            <BCardHeader><h6 class="mb-0">Details</h6></BCardHeader>
            <BCardBody class="small">
              <div class="d-flex justify-content-between"><span class="text-muted">Erstellt</span><span>{{ formatDate(subscription.created_at) }}</span></div>
              <div class="d-flex justify-content-between"><span class="text-muted">Läuft ab</span><span>{{ formatDate(subscription.current_period_ends_at) }}</span></div>
            </BCardBody>
          </BCard>
          <Link href="/gaming/cloud/subscriptions" class="btn btn-outline-secondary w-100">Zur Cloud-Abos</Link>
        </BCol>
      </BRow>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from 'vue'
import { BAlert, BBadge, BButton, BCard, BCardBody, BCardHeader, BCol, BForm, BFormInput, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type GameServerAccount = {
  uuid: string
  name: string
  status: string
  identifier: string | null
  allocation?: { cpu?: number; memory_mb?: number; disk_mb?: number }
  nest_name?: string
  egg_name?: string
  server_status?: string
}

type Nest = { id: number; name: string; eggs: { id: number; name: string }[] }

type Subscription = {
  uuid: string
  status: string
  current_period_ends_at: string | null
  created_at: string | null
  plan: { id: number; name: string; price: string; config: Record<string, unknown> }
  nests?: Nest[]
  used_cpu: number
  used_memory_mb: number
  used_disk_mb: number
  remaining_cpu: number
  remaining_memory_mb: number
  remaining_disk_mb: number
  total_cpu?: number
  total_memory_mb?: number
  total_disk_mb?: number
  game_server_accounts: GameServerAccount[]
}

const props = defineProps<{
  subscription: Subscription | null
  renewUrl?: string
}>()

const page = usePage()
const flash = computed(() => (page.props.flash as { error?: string; success?: string }) ?? {})
const formErrors = computed(() => (page.props.errors as Record<string, string>) ?? {})

const showAddServerForm = ref(false)
const createServer = ref({
  name: '',
  nest_id: 0 as number,
  egg_id: 0 as number,
  memory_mb: 512,
  cpu: 50,
  disk_mb: 1024,
})
const createServerSubmitting = ref(false)

const nests = computed(() => props.subscription?.nests ?? [])
const selectedNest = computed(() => nests.value.find((n) => n.id === createServer.value.nest_id))
const eggOptions = computed(() => {
  const eggs = selectedNest.value?.eggs ?? []
  return [{ value: 0, text: '– Version wählen –' }, ...eggs.map((e) => ({ value: e.id, text: e.name }))]
})
const nestOptions = computed(() => [
  { value: 0, text: '– Spiel wählen –' },
  ...nests.value.map((n) => ({ value: n.id, text: n.name })),
])

const maxMemoryMb = computed(() => Math.max(512, props.subscription?.remaining_memory_mb ?? 512))
const maxCpu = computed(() => Math.max(50, props.subscription?.remaining_cpu ?? 50))
const maxDiskMb = computed(() => Math.max(1024, props.subscription?.remaining_disk_mb ?? 1024))

function initAddServerForm() {
  const firstNest = nests.value[0]
  const firstEgg = firstNest?.eggs?.[0]
  createServer.value = {
    name: '',
    nest_id: firstNest?.id ?? 0,
    egg_id: firstEgg?.id ?? 0,
    memory_mb: Math.min(1024, maxMemoryMb.value),
    cpu: Math.min(100, maxCpu.value),
    disk_mb: Math.min(10240, maxDiskMb.value),
  }
}

watch(
  () => createServer.value.nest_id,
  (id) => {
    const nest = nests.value.find((n) => n.id === id)
    createServer.value.egg_id = nest?.eggs?.[0]?.id ?? 0
  },
)

const totalCpu = computed(
  () =>
    props.subscription?.total_cpu ??
    (props.subscription ? props.subscription.used_cpu + props.subscription.remaining_cpu : 0),
)
const totalMemoryMb = computed(
  () =>
    props.subscription?.total_memory_mb ??
    (props.subscription ? props.subscription.used_memory_mb + props.subscription.remaining_memory_mb : 0),
)
const totalDiskMb = computed(
  () =>
    props.subscription?.total_disk_mb ??
    (props.subscription ? props.subscription.used_disk_mb + props.subscription.remaining_disk_mb : 0),
)
const totalMemoryGb = computed(() => (totalMemoryMb.value / 1024).toFixed(1))
const totalDiskGb = computed(() => (totalDiskMb.value / 1024).toFixed(1))

const canAddServer = computed(
  () =>
    props.subscription?.status === 'active' &&
    (props.subscription?.remaining_cpu ?? 0) > 0 &&
    (props.subscription?.remaining_memory_mb ?? 0) > 0 &&
    (props.subscription?.remaining_disk_mb ?? 0) > 0,
)

onMounted(() => {
  if (flash.value.error || Object.keys(formErrors.value).length > 0) {
    showAddServerForm.value = true
    initAddServerForm()
  }
})

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}

function isServerOnline(acc: GameServerAccount): boolean {
  const s = (acc.server_status ?? '').toLowerCase()
  return s === 'running' || s === 'starting'
}

function sendPower(acc: GameServerAccount, action: 'start' | 'stop' | 'restart') {
  if (!acc.identifier || !props.subscription) return
  router.post(
    `/gaming/cloud/subscriptions/${props.subscription.uuid}/servers/${acc.uuid}/power`,
    { action },
    { preserveScroll: true },
  )
}

function submitCreateServer() {
  if (!props.subscription) return
  const payload = {
    name: createServer.value.name.trim() || undefined,
    nest_id: createServer.value.nest_id,
    egg_id: createServer.value.egg_id,
    cpu: createServer.value.cpu,
    memory_mb: createServer.value.memory_mb,
    disk_mb: createServer.value.disk_mb,
  }
  createServerSubmitting.value = true
  router.post(
    `/gaming/cloud/subscriptions/${props.subscription.uuid}/servers`,
    payload,
    {
      preserveScroll: true,
      onFinish: () => { createServerSubmitting.value = false },
      onSuccess: () => { showAddServerForm.value = false },
    },
  )
}
</script>
