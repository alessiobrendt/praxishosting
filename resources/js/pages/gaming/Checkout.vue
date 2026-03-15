<template>
  <DefaultLayout>
    <Head title="Game Server – Checkout" />
    <PageBreadcrumb title="Checkout" subtitle="Game Server" subtitle-url="/gaming" />

    <div class="mb-4">
      <h4 class="mb-1">Game Server bestellen</h4>
      <p class="text-muted mb-0">
        Wählen Sie Ihr Paket und fahren Sie zur Zahlung fort.
      </p>
    </div>

    <BRow>
      <BCol lg="8">
        <BCard v-if="selectedPlan" no-body class="mb-4">
          <BCardBody>
            <h5 class="mb-3">{{ selectedPlan.name }}</h5>
            <p class="text-muted small mb-0">{{ planSpec(selectedPlan) }}</p>
            <p class="mt-2 mb-0 fs-5 fw-semibold">{{ selectedPlan.price }} € <span class="fw-normal text-muted small">/ Monat</span></p>
          </BCardBody>
        </BCard>

        <BCard no-body>
          <BCardHeader><h5 class="mb-0">Bestelldaten</h5></BCardHeader>
          <BCardBody>
            <BForm @submit.prevent="submit">
              <div class="mb-3">
                <label class="form-label">Servername (optional)</label>
                <BFormInput v-model="form.server_name" name="server_name" placeholder="Mein Game Server" />
              </div>
              <div v-if="canPayWithBalance" class="mb-3">
                <label class="form-label">Zahlungsart</label>
                <BFormSelect v-model="form.payment_method" name="payment_method">
                  <option value="mollie">Karte / PayPal / Sonstiges (Mollie)</option>
                  <option value="balance">Guthaben ({{ formatCurrency(customerBalance ?? 0) }} € verfügbar)</option>
                </BFormSelect>
              </div>
              <BButton type="submit" variant="primary" :disabled="form.processing || !selectedPlan">
                Weiter zur Zahlung
              </BButton>
              <div v-if="form.errors.hosting_plan_id" class="text-danger small mt-2">{{ form.errors.hosting_plan_id }}</div>
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol lg="4">
        <BCard no-body>
          <BCardHeader><h5 class="mb-0">Übersicht</h5></BCardHeader>
          <BCardBody>
            <p v-if="selectedPlan" class="mb-0">
              <strong>{{ selectedPlan.name }}</strong><br />
              <span class="text-muted small">{{ selectedPlan.price }} € / Monat</span>
            </p>
            <p v-else class="text-muted mb-0">Bitte wählen Sie auf der <Link href="/gaming">Game-Server-Übersicht</Link> ein Paket.</p>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { BButton, BCard, BCardBody, BCardHeader, BCol, BForm, BFormInput, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type HostingPlan = {
  id: number
  name: string
  price: string
  config?: { memory?: number; disk?: number; cpu?: number }
}


const propsForForm = defineProps<{
  hostingPlans: HostingPlan[]
  selectedPlan: HostingPlan | null
  canPayWithBalance?: boolean
  customerBalance?: number
  amountRequired?: number
  tosUrl?: string
  privacyUrl?: string
}>()

const form = useForm({
  hosting_plan_id: propsForForm.selectedPlan?.id ?? 0,
  server_name: '',
  payment_method: 'mollie',
})

function planSpec(plan: HostingPlan): string {
  const c = plan.config ?? {}
  const parts = []
  if (c.memory) parts.push(`${c.memory} MB RAM`)
  if (c.disk) parts.push(`${Math.round(c.disk / 1024)} GB SSD`)
  if (c.cpu) parts.push(`${c.cpu} % CPU`)
  return parts.length ? parts.join(' · ') : 'Game Server'
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

function submit() {
  if (!propsForForm.selectedPlan) return
  form.transform((data) => ({ ...data, hosting_plan_id: propsForForm.selectedPlan!.id })).post('/gaming/checkout')
}
</script>
