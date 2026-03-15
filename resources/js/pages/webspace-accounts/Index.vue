<template>
  <DefaultLayout>
    <Head title="Meine Webspace-Accounts" />
    <PageBreadcrumb title="Meine Webspace-Accounts" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 class="mb-1">Meine Webspace-Accounts</h4>
        <p class="text-muted mb-0">
          Ihre Plesk-Webspace-Accounts – Status, Paket und Verlängerung
        </p>
      </div>
      <Link href="/webspace" class="btn btn-primary">
        <Icon icon="server" class="me-2" />
        Webspace buchen
      </Link>
    </div>

    <div v-if="webspaceAccounts.length === 0" class="text-center py-5 px-3 border border-dashed rounded">
      <Icon icon="server" class="fs-1 text-muted opacity-50" />
      <h5 class="mt-3">Noch keine Webspace-Accounts</h5>
      <p class="text-muted">
        Sie haben noch keine Webspace-Accounts. Buchen Sie Ihren ersten Webspace.
      </p>
      <Link href="/webspace" class="btn btn-primary mt-3">Webspace buchen</Link>
    </div>

    <BRow v-else class="g-4">
      <BCol v-for="acc in webspaceAccounts" :key="acc.uuid" xs="12" md="6" lg="4">
        <Link :href="`/webspace-accounts/${acc.uuid}`" class="text-decoration-none text-body">
          <BCard no-body class="h-100 hover-shadow">
            <BCardBody>
              <div class="d-flex align-items-start justify-content-between gap-2 mb-3">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <div class="rounded bg-primary bg-opacity-10 p-2 flex-shrink-0">
                    <Icon icon="server" class="text-primary" />
                  </div>
                  <div class="min-w-0">
                    <h6 class="mb-0 font-monospace text-truncate">{{ acc.domain }}</h6>
                    <BBadge v-if="acc.is_shared_with_me" variant="secondary" class="ms-1">Geteilt</BBadge>
                    <small class="text-muted d-flex align-items-center gap-1 mt-1">
                      <Icon icon="package" />
                      {{ acc.hosting_plan?.name ?? '–' }}
                    </small>
                  </div>
                </div>
                <Icon icon="chevron-right" class="text-muted flex-shrink-0" />
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small">Status</span>
                <BBadge :variant="statusVariant(acc.status)">
                  {{ displayStatus(acc.status) }}
                </BBadge>
              </div>
              <div class="small text-muted d-flex align-items-center gap-1">
                <Icon icon="calendar" />
                Läuft bis: {{ formatDate(acc.current_period_ends_at) }}
              </div>
              <div class="mt-2 pt-2 border-top">
                <span class="small text-primary">Account öffnen</span>
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
type WebspaceAccount = {
  uuid: string
  domain: string
  status: string
  current_period_ends_at: string | null
  hosting_plan: HostingPlan
  is_shared_with_me?: boolean
}

defineProps<{
  webspaceAccounts: WebspaceAccount[]
}>()

function formatDate(d: string | null): string {
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
</script>
