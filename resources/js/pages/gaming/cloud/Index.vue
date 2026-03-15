<template>
  <DefaultLayout>
    <Head title="Gameserver Cloud" />
    <PageBreadcrumb title="Gameserver Cloud" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Gameserver Cloud</h4>
      <p class="text-muted mb-0">
        Kaufen Sie einen Cloud-Plan und legen Sie beliebig viele Game-Server aus Ihrem Ressourcen-Pool an.
      </p>
    </div>

    <BRow class="g-4">
      <BCol v-for="plan in gameserverCloudPlans" :key="plan.id" xs="12" md="6" lg="4">
        <BCard no-body class="h-100">
          <BCardBody class="d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="rounded bg-primary bg-opacity-10 p-2">
                <Icon icon="cloud" class="fs-5 text-primary" />
              </div>
              <h5 class="mb-0">{{ plan.name }}</h5>
            </div>
            <p class="text-muted small mb-3">{{ planSpec(plan) }}</p>
            <ul class="list-unstyled small text-muted mb-3">
              <li>Ressourcen-Pool (CPU, RAM, Disk)</li>
              <li>Beliebig viele Game-Server anlegen</li>
              <li>Ressourcen frei aufteilen</li>
            </ul>
            <p class="mb-3">
              <span class="fs-4 fw-semibold">{{ plan.price }} €</span>
              <span class="text-muted small">/ Monat</span>
            </p>
            <div class="mt-auto">
              <Link :href="`/gaming/cloud/checkout/${plan.id}`" class="btn btn-primary w-100">
                Jetzt buchen
              </Link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <p v-if="gameserverCloudPlans.length === 0" class="text-muted">
      Derzeit sind keine Gameserver-Cloud-Pläne verfügbar.
    </p>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BCol, BCard, BCardBody, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type GameserverCloudPlan = {
  id: number
  name: string
  price: string
  config?: { max_cpu?: number; max_memory_mb?: number; max_disk_gb?: number }
}

defineProps<{
  gameserverCloudPlans: GameserverCloudPlan[]
}>()

function planSpec(plan: GameserverCloudPlan): string {
  const c = plan.config ?? {}
  const cpu = c.max_cpu ?? 0
  const mem = c.max_memory_mb ?? 0
  const disk = c.max_disk_gb ?? 0
  const parts = []
  if (cpu) parts.push(`${cpu} % CPU`)
  if (mem) parts.push(`${Math.round(mem / 1024)} GB RAM`)
  if (disk) parts.push(`${disk} GB Disk`)
  return parts.length ? parts.join(' · ') : 'Ressourcen-Pool'
}
</script>
