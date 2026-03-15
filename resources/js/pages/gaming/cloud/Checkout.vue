<template>
  <DefaultLayout>
    <Head title="Gameserver Cloud – Checkout" />
    <PageBreadcrumb title="Checkout" subtitle="Gameserver Cloud" subtitle-url="/gaming/cloud" />

    <div class="mb-4">
      <h4 class="mb-1">Gameserver Cloud buchen</h4>
      <p class="text-muted mb-0">
        Plan bestätigen, Optionen anpassen und zur Kasse
      </p>
    </div>

    <BForm v-if="selectedPlan" @submit.prevent="submit">

      <BRow>
        <BCol lg="8">
          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0 d-flex align-items-center gap-2">
                <Icon icon="cloud" />
                Paket & Optionen
              </h5>
              <p class="text-muted small mb-0 mt-1">Ihr Cloud-Plan und optionale Erweiterungen</p>
            </BCardHeader>
            <BCardBody>
              <div class="border rounded p-3 bg-light mb-4">
                <p class="fw-semibold mb-1">{{ selectedPlan.name }}</p>
                <p class="text-muted small mb-0">{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</p>
              </div>

              <template v-if="planOptions.length > 0">
                <h6 class="mb-2">Paket-Optionen</h6>
                <div class="row g-3 mb-4">
                  <div
                    v-for="opt in planOptions"
                    :key="opt.id"
                    :class="opt.type === 'range_slider' ? 'col-12' : 'col-sm-6'"
                  >
                    <label class="form-label small">{{ opt.name }}</label>
                    <template v-if="opt.type === 'free'">
                      <div class="form-check">
                        <input
                          :id="`opt_${opt.id}`"
                          type="checkbox"
                          class="form-check-input"
                          :checked="optionChoices[opt.id] !== undefined && optionChoices[opt.id] !== ''"
                          @change="(e) => { if ((e.target as HTMLInputElement).checked) optionChoices[opt.id] = '1'; else delete optionChoices[opt.id] }"
                        />
                        <label :for="`opt_${opt.id}`" class="form-check-label small">Inklusive</label>
                      </div>
                    </template>
                    <template v-else-if="opt.type === 'choice' || opt.type === 'select'">
                      <BFormSelect
                        v-model="optionChoices[opt.id]"
                        size="sm"
                        :options="choiceOptions(opt)"
                      />
                    </template>
                    <template v-else-if="opt.type === 'text'">
                      <BFormInput
                        v-model="optionChoices[opt.id]"
                        size="sm"
                        :placeholder="opt.placeholder"
                      />
                    </template>
                    <template v-else-if="opt.type === 'range_slider'">
                      <div class="d-flex align-items-center gap-2">
                        <input
                          v-model.number="optionChoices[opt.id]"
                          type="range"
                          class="form-range flex-grow-1"
                          :min="opt.min ?? 0"
                          :max="opt.max ?? 100"
                          :step="opt.step ?? 1"
                        />
                        <span class="small text-muted" style="min-width: 3rem">{{ optionChoices[opt.id] ?? opt.min ?? 0 }} {{ opt.unit ?? '' }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <div class="mb-3">
                <label class="form-label">Laufzeit *</label>
                <BFormSelect v-model="periodMonths" required :options="periodOptions" />
                <div v-if="form.errors.period_months" class="invalid-feedback d-block">{{ form.errors.period_months }}</div>
              </div>

              <div class="border rounded p-3 bg-light">
                <h6 class="mb-2">Rechtliches</h6>
                <BFormCheckbox v-model="acceptTos" :class="{ 'is-invalid': form.errors.accept_tos }">
                  Ich habe die
                  <a :href="tosUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">AGB</a>
                  und die
                  <a :href="privacyUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">Datenschutzerklärung</a>
                  gelesen und akzeptiere diese.
                </BFormCheckbox>
                <div v-if="form.errors.accept_tos" class="invalid-feedback d-block">{{ form.errors.accept_tos }}</div>
                <BFormCheckbox v-model="acceptEarlyExecution" class="mt-2" :class="{ 'is-invalid': form.errors.accept_early_execution }">
                  Ich wünsche die vollständige Ausführung der Dienstleistung vor Fristablauf des Widerrufsrechts gemäß Fernabsatzgesetz.
                </BFormCheckbox>
                <div v-if="form.errors.accept_early_execution" class="invalid-feedback d-block">{{ form.errors.accept_early_execution }}</div>
              </div>
            </BCardBody>
          </BCard>
        </BCol>
        <BCol lg="4">
          <BCard no-body class="mb-4">
            <BCardHeader><h5 class="mb-0">Zusammenfassung</h5></BCardHeader>
            <BCardBody>
              <div class="small mb-2">
                <div class="d-flex justify-content-between"><span class="text-muted">Basis-Preis</span><span>{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span></div>
                <template v-for="item in optionSurchargeItems" :key="item.name">
                  <div class="d-flex justify-content-between">
                    <span class="text-muted">{{ item.name }}</span>
                    <span>{{ item.surcharge > 0 ? `+ ${item.surcharge.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €` : 'inkl.' }}</span>
                  </div>
                </template>
                <div class="d-flex justify-content-between"><span class="text-muted">Laufzeit</span><span>{{ periodMonths }} Monat(e)</span></div>
              </div>
              <div class="border-top pt-2 fw-semibold">
                <div class="d-flex justify-content-between">
                  <span>Heute fällig</span>
                  <span>{{ effectiveTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</span>
                </div>
              </div>
              <template v-if="canPayWithBalance">
                <div class="mt-3 pt-3 border-top">
                  <label class="form-label small">Zahlungsart</label>
                  <BFormRadio v-model="paymentMethod" value="mollie" class="mb-1">Karte, PayPal, SEPA, …</BFormRadio>
                  <BFormRadio v-model="paymentMethod" value="balance" :disabled="!canSubmitWithBalance">
                    Mit Guthaben ({{ (customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                  </BFormRadio>
                </div>
              </template>
              <div class="mt-3 d-grid gap-2">
                <BButton type="submit" variant="primary" :disabled="form.processing || !canSubmit">
                  {{ form.processing ? 'Wird weitergeleitet…' : (paymentMethod === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Weiter zur Zahlung') }}
                </BButton>
                <Link href="/gaming/cloud" class="btn btn-outline-secondary">Abbrechen</Link>
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BForm>

    <BCard v-else no-body>
      <BCardBody>
        <p class="text-muted mb-0">Bitte wählen Sie auf der <Link href="/gaming/cloud">Cloud-Übersicht</Link> einen Plan.</p>
        <Link href="/gaming/cloud" class="btn btn-outline-primary mt-3">Zur Cloud-Übersicht</Link>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BForm,
  BFormCheckbox,
  BFormInput,
  BFormRadio,
  BFormSelect,
  BRow,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type PlanOptionChoice = { value: string; label: string; price_delta?: number }
type PlanOption = {
  id: string
  name: string
  type: 'free' | 'choice' | 'text' | 'range_slider' | 'select'
  price_per_unit: number
  sort_order: number
  choices?: PlanOptionChoice[]
  min?: number
  max?: number
  step?: number
  unit?: string
  placeholder?: string
}

type GameserverCloudPlan = {
  id: number
  name: string
  price: string
  config?: { plan_options?: PlanOption[]; [k: string]: unknown }
}

const props = withDefaults(
  defineProps<{
    gameserverCloudPlans: GameserverCloudPlan[]
    selectedPlan: GameserverCloudPlan | null
    canPayWithBalance?: boolean
    customerBalance?: number
    amountRequired?: number
    tosUrl?: string
    privacyUrl?: string
  }>(),
  { canPayWithBalance: false, customerBalance: 0, amountRequired: 0, tosUrl: '#', privacyUrl: '#' },
)

const periodMonths = ref(1)
const acceptTos = ref(false)
const acceptEarlyExecution = ref(false)
const paymentMethod = ref<'mollie' | 'balance'>('mollie')
const optionChoices = ref<Record<string, string | number>>({})

const PERIOD_OPTIONS = [
  { value: 1, text: '1 Monat' },
  { value: 3, text: '3 Monate' },
  { value: 6, text: '6 Monate' },
  { value: 12, text: '12 Monate' },
]

const form = useForm({
  gameserver_cloud_plan_id: props.selectedPlan?.id ?? 0,
  period_months: 1,
  accept_tos: false,
  accept_early_execution: false,
  payment_method: 'mollie',
  option_choices: {} as Record<string, string | number>,
})

const planOptions = computed((): PlanOption[] => {
  const opts = props.selectedPlan?.config?.plan_options
  if (!Array.isArray(opts)) return []
  return [...opts].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})

function optionSurcharge(opt: PlanOption, value: string | number | undefined): number {
  if (opt.type === 'free') return 0
  if (value === undefined || value === '') return 0
  if (opt.type === 'choice' || opt.type === 'select') {
    const choice = opt.choices?.find((c) => String(c.value) === String(value))
    return Number(choice?.price_delta ?? 0)
  }
  if (opt.type === 'range_slider') {
    const num = Number(value)
    const min = Number(opt.min ?? 0)
    const step = Number(opt.step ?? 1)
    if (step <= 0) return 0
    return Number(opt.price_per_unit ?? 0) * ((num - min) / step)
  }
  if (opt.type === 'text') return Number(opt.price_per_unit ?? 0)
  return 0
}

const totalOptionSurcharge = computed(() => {
  let sum = 0
  for (const opt of planOptions.value) {
    sum += optionSurcharge(opt, optionChoices.value[opt.id])
  }
  return sum
})

const optionSurchargeItems = computed(() => {
  const items: { name: string; surcharge: number }[] = []
  for (const opt of planOptions.value) {
    const value = optionChoices.value[opt.id]
    if (value === undefined || value === '') continue
    items.push({ name: opt.name, surcharge: optionSurcharge(opt, value) })
  }
  return items
})

const basePrice = computed(() => Number(props.selectedPlan?.price ?? 0))
const monthlyTotal = computed(() => basePrice.value + totalOptionSurcharge.value)
const effectiveTotal = computed(() => Math.round(monthlyTotal.value * periodMonths.value * 100) / 100)
const canSubmitWithBalance = computed(
  () => Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
)
const canSubmit = computed(
  () => Boolean(acceptTos.value && acceptEarlyExecution.value && props.selectedPlan),
)

function choiceOptions(opt: PlanOption): { value: string; text: string }[] {
  const list = [{ value: '', text: 'Bitte wählen' }]
  for (const ch of opt.choices ?? []) {
    const label = (ch.price_delta ?? 0) > 0 ? `${ch.label} (+ ${Number(ch.price_delta).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €)` : ch.label
    list.push({ value: String(ch.value), text: label })
  }
  return list
}

function initOptionChoices() {
  const plan = props.selectedPlan
  if (!plan) {
    optionChoices.value = {}
    return
  }
  const opts = plan.config?.plan_options ?? []
  const next: Record<string, string | number> = {}
  for (const opt of opts) {
    if (opt.type === 'range_slider' && typeof opt.min === 'number') next[opt.id] = opt.min
    else if (opt.type === 'choice' || opt.type === 'select') {
      const first = opt.choices?.[0]
      if (first) next[opt.id] = first.value
    }
  }
  optionChoices.value = next
}

onMounted(initOptionChoices)
watch(() => props.selectedPlan, initOptionChoices, { deep: true })

function submit() {
  if (!props.selectedPlan || !canSubmit.value) return
  form.gameserver_cloud_plan_id = props.selectedPlan.id
  form.period_months = periodMonths.value
  form.accept_tos = acceptTos.value
  form.accept_early_execution = acceptEarlyExecution.value
  form.payment_method = paymentMethod.value
  form.option_choices = { ...optionChoices.value }
  form.post('/gaming/cloud/checkout')
}
</script>
