<template>
  <DefaultLayout>
    <Head title="TeamSpeak Server" />
    <PageBreadcrumb title="TeamSpeak Server" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">TeamSpeak Server mieten</h4>
      <p class="text-muted mb-0">
        Eigenen TeamSpeak-Server – wählen Sie Ihr Paket
      </p>
    </div>

    <BRow class="g-4">
      <BCol v-for="plan in hostingPlans" :key="plan.id" xs="12" md="6" lg="4">
        <BCard no-body class="h-100">
          <BCardBody class="d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="rounded bg-primary bg-opacity-10 p-2">
                <Icon icon="headphones" class="fs-5 text-primary" />
              </div>
              <h5 class="mb-0">{{ plan.name }}</h5>
            </div>
            <p class="text-muted small mb-3">{{ planSpec(plan) }}</p>
            <ul class="list-unstyled small text-muted mb-3">
              <li>Eigener virtueller TeamSpeak-Server</li>
              <li>Slots nach Bedarf wählbar</li>
              <li>Token-Verwaltung & Backups</li>
            </ul>
            <p class="mb-3">
              <span class="fs-5 fw-semibold">{{ planPriceDisplay(plan) }}</span>
            </p>
            <div class="mt-auto">
              <Link :href="`/teamspeak/checkout?plan=${plan.id}`" class="btn btn-primary w-100">
                Jetzt buchen
              </Link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <p v-if="hostingPlans.length === 0" class="text-muted">
      Derzeit sind keine TeamSpeak-Pakete verfügbar.
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
  config?: { plan_options?: { id: string; name: string; min?: number; max?: number; price_per_unit?: number }[] }
}

defineProps<{
  hostingPlans: HostingPlan[]
}>()

function planSpec(plan: HostingPlan): string {
  const opts = plan.config?.plan_options ?? []
  const slotsOpt = opts.find((o) => o.id === 'slots')
  if (slotsOpt && typeof slotsOpt.min === 'number' && typeof slotsOpt.max === 'number') {
    return `${slotsOpt.min}–${slotsOpt.max} Slots wählbar`
  }
  return 'TeamSpeak Voice Server'
}

function planPriceDisplay(plan: HostingPlan): string {
  const priceNum = Number(plan.price ?? 0)
  if (priceNum > 0) return `${plan.price} € / Monat`
  const opts = plan.config?.plan_options ?? []
  const slotsOpt = opts.find((o) => o.id === 'slots')
  const slotPrice = slotsOpt?.price_per_unit ?? 0
  if (slotPrice > 0) return `ab ${slotPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € pro Slot`
  return 'Preis pro Slot'
}
</script>
