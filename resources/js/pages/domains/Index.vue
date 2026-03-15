<template>
  <DefaultLayout>
    <Head title="Meine Domains" />
    <PageBreadcrumb title="Meine Domains" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 class="mb-1">Meine Domains</h4>
        <p class="text-muted mb-0">
          Ihre über uns registrierten Domains – Status und Ablaufdatum
        </p>
      </div>
      <Link href="/domains/search" class="btn btn-primary">
        <Icon icon="search" class="me-2" />
        Domain suchen
      </Link>
    </div>

    <div v-if="domains.length === 0" class="rounded border border-secondary border-dashed bg-light p-5 text-center">
      <Icon icon="world" class="fs-1 text-muted opacity-50" />
      <h5 class="mt-3">Noch keine Domains</h5>
      <p class="text-muted mb-0">
        Sie haben noch keine Domains. Suchen Sie eine Domain und bestellen Sie sie.
      </p>
      <Link href="/domains/search" class="btn btn-primary mt-3">Domain suchen</Link>
    </div>

    <div v-else class="row g-4">
      <div v-for="d in domains" :key="d.uuid" class="col-sm-6 col-lg-4">
        <Link :href="`/domains/${d.uuid}`" class="text-decoration-none text-body d-block h-100">
          <BCard no-body class="h-100 hover-shadow">
            <BCardBody>
              <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <div class="rounded bg-primary bg-opacity-10 p-2 flex-shrink-0">
                    <Icon icon="world" class="text-primary" />
                  </div>
                  <div class="min-w-0">
                    <h6 class="mb-0 font-monospace text-truncate">{{ d.domain }}</h6>
                    <small class="text-muted">{{ d.auto_renew ? 'Auto-Verlängerung: Ja' : 'Auto-Verlängerung: Nein' }}</small>
                  </div>
                </div>
                <Icon icon="chevron-right" class="text-muted flex-shrink-0" />
              </div>
              <div class="d-flex align-items-center justify-content-between small">
                <span class="text-muted">Status</span>
                <BBadge :variant="statusVariant(d.status)">
                  {{ displayStatus(d.status) }}
                </BBadge>
              </div>
              <div class="d-flex align-items-center gap-1 small text-muted mt-1">
                <Icon icon="calendar" />
                Ablauf: {{ d.expires_at ?? '–' }}
              </div>
              <div class="mt-2">
                <span class="btn btn-sm btn-link p-0 text-primary">Domain verwalten</span>
              </div>
            </BCardBody>
          </BCard>
        </Link>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BBadge, BCard, BCardBody } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type Domain = {
  uuid: string
  domain: string
  status: string
  expires_at: string | null
  auto_renew: boolean
  is_shared_with_me?: boolean
}

defineProps<{ domains: Domain[] }>()

function statusVariant(status: string): 'success' | 'secondary' | 'danger' {
  const s = status?.toLowerCase() ?? ''
  if (s === 'active' || s === 'aktiv') return 'success'
  if (s === 'expired' || s === 'abgelaufen' || s === 'cancelled') return 'danger'
  return 'secondary'
}

function displayStatus(status: string): string {
  const s = status?.toLowerCase() ?? ''
  if (s === 'active' || s === 'aktiv') return 'Aktiv'
  if (s === 'expired' || s === 'abgelaufen') return 'Abgelaufen'
  if (s === 'cancelled') return 'Gekündigt'
  if (s === 'pending') return 'Ausstehend'
  return status || '–'
}
</script>
