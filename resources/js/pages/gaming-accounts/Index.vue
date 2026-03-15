<template>
  <DefaultLayout>
    <Head title="Meine Game Server" />
    <PageBreadcrumb title="Meine Game Server" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 class="mb-1">Meine Game Server</h4>
        <p class="text-muted mb-0">
          Ihre Pterodactyl Game-Server – Status, Paket und Verlängerung
        </p>
      </div>
      <Link href="/gaming" class="btn btn-primary">
        <Icon icon="gamepad" class="me-2" />
        Game Server mieten
      </Link>
    </div>

    <div v-if="gameServerAccounts.length === 0" class="text-center py-5 px-3 border border-dashed rounded">
      <Icon icon="gamepad" class="fs-1 text-muted opacity-50" />
      <h5 class="mt-3">Noch keine Game-Server</h5>
      <p class="text-muted">
        Sie haben noch keine Game-Server-Accounts. Buchen Sie Ihren ersten Server.
      </p>
      <Link href="/gaming" class="btn btn-primary mt-3">Game Server mieten</Link>
    </div>

    <BRow v-else class="g-4">
      <BCol v-for="acc in gameServerAccounts" :key="acc.uuid" xs="12" md="6" lg="4">
        <Link :href="`/gaming-accounts/${acc.uuid}`" class="text-decoration-none text-body">
          <BCard no-body class="h-100 hover-shadow">
            <BCardBody>
              <div class="d-flex align-items-start justify-content-between gap-2 mb-3">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <div class="rounded bg-primary bg-opacity-10 p-2 flex-shrink-0">
                    <Icon icon="gamepad" class="text-primary" />
                  </div>
                  <div class="min-w-0">
                    <h6 class="mb-0">{{ acc.name }}</h6>
                    <BBadge v-if="acc.is_shared_with_me" variant="secondary" class="ms-1">Geteilt</BBadge>
                    <small class="text-muted d-flex align-items-center gap-1 mt-1">
                      <Icon icon="package" />
                      {{ planLabel(acc) }}
                    </small>
                  </div>
                </div>
                <BBadge :variant="statusVariant(getOverview(acc), acc.status)">
                  {{ displayStatus(getOverview(acc), acc.status) }}
                </BBadge>
              </div>
              <div class="small text-muted d-flex align-items-center gap-1">
                <Icon icon="calendar" />
                Läuft bis: {{ formatDate(periodEnd(acc)) }}
              </div>
              <div class="mt-2 pt-2 border-top">
                <span class="small text-primary">Öffnen</span>
                <Icon icon="chevron-right" class="small ms-1" />
              </div>
            </BCardBody>
          </BCard>
        </Link>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BBadge, BCard, BCardBody, BCol, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type HostingPlan = { id: number; name: string }
type GameserverCloudSubscription = {
  current_period_ends_at: string | null
  gameserver_cloud_plan: { name: string }
}
type GameServerAccount = {
  uuid: string
  name: string
  status: string
  current_period_ends_at: string | null
  hosting_plan: HostingPlan | null
  gameserver_cloud_subscription?: GameserverCloudSubscription | null
  is_shared_with_me?: boolean
}
type ServerOverview = {
  status: string
  suspended?: boolean
  is_installing?: boolean
}

const props = defineProps<{
  gameServerAccounts: GameServerAccount[]
  serverOverviews: Record<string, ServerOverview>
}>()

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}

function getOverview(acc: GameServerAccount): ServerOverview | null {
  return props.serverOverviews[String(acc.uuid)] ?? null
}

function planLabel(acc: GameServerAccount): string {
  return acc.hosting_plan?.name ?? acc.gameserver_cloud_subscription?.gameserver_cloud_plan?.name ?? '–'
}

function periodEnd(acc: GameServerAccount): string | null {
  return acc.gameserver_cloud_subscription?.current_period_ends_at ?? acc.current_period_ends_at ?? null
}

function displayStatus(overview: ServerOverview | null, fallbackStatus: string): string {
  if (overview?.suspended) return 'Gesperrt'
  if (overview?.is_installing) return 'Installation'
  if (overview?.status) {
    const s = overview.status.toLowerCase()
    if (s === 'running' || s === 'started') return 'Online'
    if (s === 'stopped' || s === 'offline') return 'Offline'
    if (s === 'stopping') return 'Wird gestoppt …'
    if (s === 'starting') return 'Wird gestartet …'
    return overview.status
  }
  return fallbackStatus || '–'
}

function statusVariant(overview: ServerOverview | null, fallbackStatus: string): 'success' | 'secondary' | 'danger' {
  if (overview?.suspended) return 'danger'
  const s = overview?.status?.toLowerCase() ?? fallbackStatus?.toLowerCase()
  if (s === 'running' || s === 'started') return 'success'
  if (s === 'stopping' || s === 'starting') return 'secondary'
  return 'secondary'
}
</script>
