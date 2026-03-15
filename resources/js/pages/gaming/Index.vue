<template>
  <DefaultLayout>
    <Head title="Game Server" />
    <PageBreadcrumb title="Game Server" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Game Server mieten</h4>
      <p class="text-muted mb-0">
        Pterodactyl Game Server – wählen Sie Ihr Paket
      </p>
    </div>

    <BRow class="g-4">
      <BCol v-for="plan in hostingPlans" :key="plan.id" xs="12" md="6" lg="4">
        <BCard no-body class="h-100">
          <BCardBody class="d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="rounded bg-primary bg-opacity-10 p-2">
                <Icon icon="server" class="fs-5 text-primary" />
              </div>
              <h5 class="mb-0">{{ plan.name }}</h5>
            </div>
            <p class="text-muted small mb-3">{{ planSpec(plan) }}</p>
            <ul class="list-unstyled small text-muted mb-3">
              <li>Eigener Game Server (Pterodactyl)</li>
              <li>Vollständiger Zugang zum Panel</li>
              <li>Start, Stop, Restart nach Bedarf</li>
            </ul>
            <p class="mb-3">
              <span class="fs-4 fw-semibold">{{ plan.price }} €</span>
              <span class="text-muted small">/ Monat</span>
            </p>
            <div class="mt-auto">
              <Link :href="`/gaming/checkout?plan=${plan.id}`" class="btn btn-primary w-100">
                Jetzt buchen
              </Link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <p v-if="hostingPlans.length === 0" class="text-muted">
      Derzeit sind keine Game-Server-Pakete verfügbar.
    </p>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BCol, BCard, BCardBody, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type HostingPlan = {
  id: number
  name: string
  price: string
  config?: { memory?: number; disk?: number; cpu?: number }
}

defineProps<{
  hostingPlans: HostingPlan[]
}>()

function planSpec(plan: HostingPlan): string {
  const c = plan.config ?? {}
  const mem = c.memory ?? 0
  const disk = c.disk ?? 0
  const cpu = c.cpu ?? 0
  const parts = []
  if (mem) parts.push(`${mem} MB RAM`)
  if (disk) parts.push(`${Math.round(disk / 1024)} GB SSD`)
  if (cpu) parts.push(`${cpu} % CPU`)
  return parts.length ? parts.join(' · ') : 'Game Server'
}
</script>
