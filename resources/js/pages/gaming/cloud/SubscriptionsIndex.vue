<template>
  <DefaultLayout>
    <Head title="Meine Gameserver-Cloud-Abos" />
    <PageBreadcrumb title="Meine Gameserver-Cloud-Abos" subtitle="Gameserver Cloud" subtitle-url="/gaming/cloud" />

    <div class="mb-4">
      <h4 class="mb-1">Meine Gameserver-Cloud-Abos</h4>
      <p class="text-muted mb-0">
        Verwalten Sie Ihre Cloud-Abos und legen Sie Game-Server aus dem Ressourcen-Pool an.
      </p>
    </div>

    <div v-if="subscriptions.length === 0" class="text-center py-5 px-3 border border-dashed rounded">
      <Icon icon="cloud" class="fs-1 text-muted opacity-50" />
      <p class="mt-2 mb-0">Sie haben noch kein Cloud-Abo.</p>
      <Link href="/gaming/cloud" class="btn btn-primary mt-3">Pläne ansehen</Link>
    </div>

    <BRow v-else class="g-4">
      <BCol v-for="sub in subscriptions" :key="sub.uuid" xs="12" md="6">
        <BCard no-body class="h-100">
          <BCardBody class="d-flex flex-column">
            <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
              <div class="d-flex align-items-center gap-2">
                <Icon icon="cloud" class="text-primary" />
                <h5 class="mb-0">{{ sub.plan.name }}</h5>
                <BBadge v-if="sub.is_shared_with_me" variant="secondary" class="ms-1">Geteilt</BBadge>
              </div>
              <BBadge :variant="sub.status === 'active' ? 'success' : 'secondary'">
                {{ sub.status === 'active' ? 'Aktiv' : sub.status }}
              </BBadge>
            </div>
            <p class="text-muted small mb-3">Läuft bis {{ formatDate(sub.current_period_ends_at) }}</p>
            <p class="small text-muted mb-2 mb-auto">
              Genutzt: {{ sub.used_cpu }} % CPU · {{ Math.round(sub.used_memory_mb / 1024) }} GB RAM · {{ Math.round(sub.used_disk_mb / 1024) }} GB Disk<br />
              Verfügbar: {{ sub.remaining_cpu }} % CPU · {{ Math.round(sub.remaining_memory_mb / 1024) }} GB RAM · {{ Math.round(sub.remaining_disk_mb / 1024) }} GB Disk
            </p>
            <Link :href="`/gaming/cloud/subscriptions/${sub.uuid}`" class="btn btn-outline-primary w-100">
              Abo verwalten
              <Icon icon="chevron-right" class="ms-1" />
            </Link>
          </BCardBody>
        </BCard>
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

type Subscription = {
  uuid: string
  status: string
  current_period_ends_at: string | null
  is_shared_with_me?: boolean
  plan: { id: number; name: string; price: string; config: Record<string, number> }
  used_cpu: number
  used_memory_mb: number
  used_disk_mb: number
  remaining_cpu: number
  remaining_memory_mb: number
  remaining_disk_mb: number
}

defineProps<{
  subscriptions: Subscription[]
}>()

function formatDate(d: string | null): string {
  return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–'
}
</script>
