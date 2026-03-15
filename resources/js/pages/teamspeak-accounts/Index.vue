<template>
  <DefaultLayout>
    <Head title="Meine TeamSpeak Server" />
    <PageBreadcrumb title="Meine TeamSpeak Server" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 class="mb-1">Meine TeamSpeak Server</h4>
        <p class="text-muted mb-0">
          Ihre TeamSpeak-Server – Status, Paket und Verlängerung
        </p>
      </div>
      <Link href="/teamspeak" class="btn btn-primary">
        <Icon icon="headphones" class="me-2" />
        TeamSpeak Server mieten
      </Link>
    </div>

    <div v-if="teamSpeakServerAccounts.length === 0" class="text-center py-5 px-3 border border-dashed rounded">
      <Icon icon="headphones" class="fs-1 text-muted opacity-50" />
      <h5 class="mt-3">Noch keine TeamSpeak-Server</h5>
      <p class="text-muted">
        Sie haben noch keine TeamSpeak-Server. Buchen Sie Ihren ersten Server.
      </p>
      <Link href="/teamspeak" class="btn btn-primary mt-3">TeamSpeak Server mieten</Link>
    </div>

    <BRow v-else class="g-4">
      <BCol v-for="acc in teamSpeakServerAccounts" :key="acc.uuid" xs="12" md="6" lg="4">
        <Link :href="`/teamspeak-accounts/${acc.uuid}`" class="text-decoration-none text-body">
          <BCard no-body class="h-100 hover-shadow">
            <BCardBody>
              <div class="d-flex align-items-start justify-content-between gap-2 mb-3">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <div class="rounded bg-primary bg-opacity-10 p-2 flex-shrink-0">
                    <Icon icon="headphones" class="text-primary" />
                  </div>
                  <div class="min-w-0">
                    <h6 class="mb-0">{{ acc.name }}</h6>
                    <BBadge v-if="acc.is_shared_with_me" variant="secondary" class="ms-1">Geteilt</BBadge>
                    <small class="text-muted d-flex align-items-center gap-1 mt-1">
                      <Icon icon="package" />
                      {{ acc.hosting_plan?.name ?? '–' }}
                    </small>
                  </div>
                </div>
                <BBadge :variant="statusVariant(getInfo(acc), acc.status)">
                  {{ displayStatus(getInfo(acc), acc.status) }}
                </BBadge>
              </div>
              <div class="small text-muted d-flex align-items-center gap-1">
                <Icon icon="calendar" />
                Läuft bis: {{ formatDate(acc.current_period_ends_at) }}
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
type TeamSpeakServerAccount = {
  uuid: string
  name: string
  status: string
  port: number | null
  current_period_ends_at: string | null
  hosting_plan: HostingPlan
  is_shared_with_me?: boolean
}
type ServerInfo = {
  address?: string
  connection_uri?: string
  virtualserver_status?: string
}

const props = defineProps<{
  teamSpeakServerAccounts: TeamSpeakServerAccount[]
  serverInfos: Record<string, ServerInfo>
}>()

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}

function getInfo(acc: TeamSpeakServerAccount): ServerInfo | null {
  return props.serverInfos[String(acc.uuid)] ?? null
}

function displayStatus(info: ServerInfo | null, fallbackStatus: string): string {
  if (info?.virtualserver_status === 'online') return 'Online'
  if (info?.virtualserver_status === 'offline') return 'Offline'
  return fallbackStatus || '–'
}

function statusVariant(info: ServerInfo | null, fallbackStatus: string): 'success' | 'secondary' | 'danger' {
  const s = info?.virtualserver_status ?? fallbackStatus?.toLowerCase()
  if (s === 'online') return 'success'
  if (s === 'offline') return 'secondary'
  return 'secondary'
}
</script>
