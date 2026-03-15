<template>
  <DefaultLayout>
    <Head title="Webspace buchen" />
    <PageBreadcrumb title="Checkout" subtitle="Webspace" subtitle-url="/webspace" />

    <div class="mb-4">
      <h4 class="mb-1">Webspace buchen</h4>
      <p class="text-muted mb-0">Domain angeben, Paket und Laufzeit wählen</p>
    </div>

    <BForm @submit.prevent="submit">
      <BRow>
        <BCol lg="8">
          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0">Bestellübersicht</h5>
              <p class="text-muted small mb-0">Hauptdomain und Paket</p>
            </BCardHeader>
            <BCardBody>
              <div class="mb-3">
                <label class="form-label" for="domain">Domain *</label>
                <BFormInput
                  id="domain"
                  v-model="form.domain"
                  name="domain"
                  type="text"
                  required
                  placeholder="beispiel.de"
                  :class="{ 'is-invalid': form.errors.domain }"
                />
                <div v-if="form.errors.domain" class="invalid-feedback d-block">{{ form.errors.domain }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="hosting_plan_id">Paket *</label>
                <BFormSelect
                  id="hosting_plan_id"
                  v-model="form.hosting_plan_id"
                  name="hosting_plan_id"
                  required
                  :options="planOptions"
                  :class="{ 'is-invalid': form.errors.hosting_plan_id }"
                />
                <div v-if="form.errors.hosting_plan_id" class="invalid-feedback d-block">{{ form.errors.hosting_plan_id }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="period_months">Laufzeit *</label>
                <BFormSelect
                  id="period_months"
                  v-model="form.period_months"
                  name="period_months"
                  required
                  :options="periodOptions"
                  :class="{ 'is-invalid': form.errors.period_months }"
                />
                <div v-if="form.errors.period_months" class="invalid-feedback d-block">{{ form.errors.period_months }}</div>
              </div>
            </BCardBody>
          </BCard>

          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0">Rechtliches</h5>
            </BCardHeader>
            <BCardBody>
              <BFormCheckbox v-model="form.accept_tos" :class="{ 'is-invalid': form.errors.accept_tos }">
                Ich habe die
                <a :href="tosUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">AGB</a>
                und
                <a :href="privacyUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">Datenschutzerklärung</a>
                gelesen und akzeptiere diese.
              </BFormCheckbox>
              <div v-if="form.errors.accept_tos" class="invalid-feedback d-block">{{ form.errors.accept_tos }}</div>
              <BFormCheckbox v-model="form.accept_early_execution" class="mt-2" :class="{ 'is-invalid': form.errors.accept_early_execution }">
                Ich wünsche die vollständige Ausführung der Dienstleistung vor Fristablauf des Widerrufsrechts gemäß Fernabsatzgesetz.
              </BFormCheckbox>
              <div v-if="form.errors.accept_early_execution" class="invalid-feedback d-block">{{ form.errors.accept_early_execution }}</div>
            </BCardBody>
          </BCard>
        </BCol>
        <BCol lg="4">
          <BCard no-body class="mb-4">
            <BCardHeader><h5 class="mb-0">Kostenübersicht</h5></BCardHeader>
            <BCardBody>
              <template v-if="currentPlan">
                <div class="small mb-2">
                  <div class="d-flex justify-content-between"><span class="text-muted">Paket</span><span>{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span></div>
                  <div class="d-flex justify-content-between"><span class="text-muted">Laufzeit</span><span>{{ form.period_months }} Monat(e)</span></div>
                </div>
                <div class="border-top pt-2 fw-semibold">
                  <div class="d-flex justify-content-between">
                    <span>Heute fällig</span>
                    <span>{{ effectiveTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</span>
                  </div>
                </div>
                <div v-if="canPayWithBalance" class="mt-3 pt-3 border-top">
                  <label class="form-label small">Zahlungsart</label>
                  <BFormRadio v-model="form.payment_method" value="mollie" class="mb-1">Karte, PayPal, SEPA, …</BFormRadio>
                  <BFormRadio v-model="form.payment_method" value="balance" :disabled="!canSubmitWithBalance">
                    Mit Guthaben ({{ (customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                  </BFormRadio>
                </div>
                <div class="mt-3 d-grid gap-2">
                  <BButton type="submit" variant="primary" :disabled="form.processing || !canSubmit">
                    {{ form.processing ? 'Wird weitergeleitet…' : (form.payment_method === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Kostenpflichtig bestellen') }}
                  </BButton>
                  <Link href="/webspace" class="btn btn-outline-secondary">Abbrechen</Link>
                </div>
              </template>
              <template v-else>
                <p class="text-muted small mb-0">Bitte wählen Sie links ein Paket aus.</p>
                <Link href="/webspace" class="btn btn-outline-primary mt-3">Zur Übersicht</Link>
              </template>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BForm>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed } from 'vue'
import { BButton, BCard, BCardBody, BCardHeader, BCol, BForm, BFormCheckbox, BFormInput, BFormRadio, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type HostingPlan = {
  id: number
  name: string
  disk_gb: number
  traffic_gb: number
  domains: number
  subdomains: number
  mailboxes: number
  databases: number
  price: string
}

const props = defineProps<{
  hostingPlans: HostingPlan[]
  selectedPlan: HostingPlan | null
  canPayWithBalance?: boolean
  customerBalance?: number
  amountRequired?: number
  tosUrl?: string
  privacyUrl?: string
}>()

const form = useForm({
  domain: '',
  hosting_plan_id: (props.selectedPlan?.id ?? '') as number | '',
  period_months: 1,
  accept_tos: false,
  accept_early_execution: false,
  payment_method: 'mollie',
})

const currentPlan = computed((): HostingPlan | null => {
  const id = Number(form.hosting_plan_id)
  if (!id) return null
  return props.hostingPlans.find((p) => p.id === id) ?? null
})

const basePrice = computed(() => (currentPlan.value ? Number(currentPlan.value.price) : 0))
const effectiveTotal = computed(() => Math.round(basePrice.value * form.period_months * 100) / 100)
const canSubmitWithBalance = computed(
  () => Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
)
const canSubmit = computed(
  () => Boolean(form.accept_tos && form.accept_early_execution && currentPlan.value && form.domain?.trim()),
)

const planOptions = computed(() => [
  { value: '' as number | '', text: 'Bitte wählen' },
  ...props.hostingPlans.map((p) => ({
    value: p.id,
    text: `${p.name} – ${p.price} €/Monat (${p.disk_gb} GB / ${p.traffic_gb} GB Traffic)`,
  })),
])

const periodOptions = [
  { value: 1, text: '1 Monat(e)' },
  { value: 3, text: '3 Monate' },
  { value: 6, text: '6 Monate' },
]

function submit() {
  if (!canSubmit.value) return
  form.post('/webspace/checkout')
}
</script>
