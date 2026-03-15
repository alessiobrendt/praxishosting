<template>
  <DefaultLayout>
    <Head title="TeamSpeak Server buchen" />
    <PageBreadcrumb title="Checkout" subtitle="TeamSpeak Server" subtitle-url="/teamspeak" />

    <div class="mb-4">
      <h4 class="mb-1">TeamSpeak Server buchen</h4>
      <p class="text-muted mb-0">Paket wählen, Slots anpassen und zur Kasse</p>
    </div>

    <BForm v-if="currentPlan" @submit.prevent="submit">
      <BRow>
        <BCol lg="8">
          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0 d-flex align-items-center gap-2">
                <Icon icon="headphones" />
                Paket & Optionen
              </h5>
              <p class="text-muted small mb-0 mt-1">Wählen Sie Ihr TeamSpeak-Paket und passen Sie die Slots an.</p>
            </BCardHeader>
            <BCardBody>
              <div class="mb-3">
                <label class="form-label">Paket *</label>
                <BFormSelect v-model="selectedPlanId" required :options="planOptions" :class="{ 'is-invalid': form.errors.hosting_plan_id }" />
                <div v-if="form.errors.hosting_plan_id" class="invalid-feedback d-block">{{ form.errors.hosting_plan_id }}</div>
              </div>

              <template v-if="planOptions.length > 0 && currentPlan">
                <h6 class="mb-2">Paket-Optionen</h6>
                <div class="row g-3 mb-4">
                  <div v-for="opt in planOptionsList" :key="opt.id" :class="opt.type === 'range_slider' ? 'col-12' : 'col-sm-6'">
                    <label class="form-label small">{{ opt.name }}</label>
                    <template v-if="opt.type === 'free'">
                      <div class="form-check">
                        <input
                          :id="`opt_${opt.id}`"
                          type="checkbox"
                          :checked="optionChoices[opt.id] !== undefined && optionChoices[opt.id] !== ''"
                          class="form-check-input"
                          @change="(e) => { if ((e.target as HTMLInputElement).checked) optionChoices[opt.id] = '1'; else delete optionChoices[opt.id] }"
                        />
                        <label :for="`opt_${opt.id}`" class="form-check-label small">Inklusive</label>
                      </div>
                    </template>
                    <template v-else-if="opt.type === 'choice' || opt.type === 'select'">
                      <BFormSelect v-model="optionChoices[opt.id]" size="sm" :options="choiceOptions(opt)" />
                    </template>
                    <template v-else-if="opt.type === 'text'">
                      <BFormInput v-model="optionChoices[opt.id]" size="sm" :placeholder="opt.placeholder" />
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
              <div class="mb-3">
                <label class="form-label">Server-Name (optional)</label>
                <BFormInput v-model="form.server_name" name="server_name" placeholder="z. B. Mein TeamSpeak" />
                <div v-if="form.errors.server_name" class="invalid-feedback d-block">{{ form.errors.server_name }}</div>
              </div>
              <div class="border rounded p-3 bg-light">
                <h6 class="mb-2">Rechtliches</h6>
                <BFormCheckbox v-model="acceptTos" :class="{ 'is-invalid': form.errors.accept_tos }">
                  Ich habe die
                  <a :href="tosUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">AGB</a>
                  und
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
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Basis-Preis</span>
                  <span v-if="!isPricePerSlotOnly">{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span>
                  <span v-else class="text-muted">– (nur pro Slot)</span>
                </div>
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
                  {{ form.processing ? 'Wird weitergeleitet…' : (paymentMethod === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Kostenpflichtig bestellen') }}
                </BButton>
                <Link href="/teamspeak" class="btn btn-outline-secondary">Abbrechen</Link>
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BForm>

    <BCard v-else no-body>
      <BCardBody>
        <p class="text-muted mb-0">Bitte wählen Sie auf der <Link href="/teamspeak">TeamSpeak-Übersicht</Link> ein Paket.</p>
        <Link href="/teamspeak" class="btn btn-outline-primary mt-3">Zur Übersicht</Link>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
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

type HostingPlan = {
  id: number
  name: string
  price: string
  config?: { plan_options?: PlanOption[]; [k: string]: unknown }
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

const periodMonths = ref(1)
const acceptTos = ref(false)
const acceptEarlyExecution = ref(false)
const paymentMethod = ref<'mollie' | 'balance'>('mollie')
const selectedPlanId = ref(String(props.selectedPlan?.id ?? ''))
const optionChoices = ref<Record<string, string | number>>({})

const PERIOD_OPTIONS = [1, 3, 6] as const

const form = useForm({
  hosting_plan_id: props.selectedPlan?.id ?? 0,
  period_months: 1,
  server_name: '' as string,
  accept_tos: false,
  accept_early_execution: false,
  payment_method: 'mollie',
  option_choices: {} as Record<string, string | number>,
})

const currentPlan = computed((): HostingPlan | null => {
  const id = Number(selectedPlanId.value)
  if (!id) return null
  return props.hostingPlans.find((p) => p.id === id) ?? null
})

const planOptionsList = computed((): PlanOption[] => {
  const opts = currentPlan.value?.config?.plan_options
  if (!Array.isArray(opts)) return []
  return [...opts].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})

const planOptions = computed(() => [
  { value: '', text: 'Bitte wählen' },
  ...props.hostingPlans.map((p) => ({ value: String(p.id), text: `${p.name} – ${planPriceLabel(p)}` })),
])

function planPriceLabel(plan: HostingPlan): string {
  const p = Number(plan.price ?? 0)
  if (p > 0) return `${plan.price} €/Monat`
  const opts = plan.config?.plan_options ?? []
  const slotsOpt = opts.find((o) => o.id === 'slots')
  const slotPrice = slotsOpt?.price_per_unit ?? 0
  if (slotPrice > 0) return `ab ${slotPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € pro Slot`
  return 'Preis pro Slot'
}

function optionSurcharge(opt: PlanOption, value: string | number | undefined): number {
  if (opt.type === 'free') return 0
  if (value === undefined || value === '') return 0
  if (opt.type === 'choice' || opt.type === 'select') {
    const choice = opt.choices?.find((c) => String(c.value) === String(value))
    return Number(choice?.price_delta ?? 0)
  }
  if (opt.type === 'range_slider') {
    const num = Number(value)
    if (opt.id === 'slots' && num >= 0) return Number(opt.price_per_unit ?? 0) * num
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
  for (const opt of planOptionsList.value) sum += optionSurcharge(opt, optionChoices.value[opt.id])
  return sum
})

const optionSurchargeItems = computed(() => {
  const items: { name: string; surcharge: number }[] = []
  for (const opt of planOptionsList.value) {
    const value = optionChoices.value[opt.id]
    if (value === undefined || value === '') continue
    items.push({ name: opt.name, surcharge: optionSurcharge(opt, value) })
  }
  return items
})

const basePrice = computed(() => Number(currentPlan.value?.price ?? 0))
const monthlyTotal = computed(() => basePrice.value + totalOptionSurcharge.value)
const effectiveTotal = computed(() => Math.round(monthlyTotal.value * periodMonths.value * 100) / 100)
const isPricePerSlotOnly = computed(() => basePrice.value === 0 && currentPlan.value != null)
const canSubmitWithBalance = computed(
  () => Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
)
const canSubmit = computed(
  () => Boolean(acceptTos.value && acceptEarlyExecution.value && currentPlan.value),
)

const periodOptions = computed(() =>
  PERIOD_OPTIONS.map((m) => ({
    value: m,
    text: `${m} Monat(e) – ${(monthlyTotal.value * m).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
  })),
)

function choiceOptions(opt: PlanOption): { value: string; text: string }[] {
  const list = [{ value: '', text: 'Bitte wählen' }]
  for (const ch of opt.choices ?? []) {
    const label = (ch.price_delta ?? 0) > 0 ? `${ch.label} (+ ${Number(ch.price_delta).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €)` : ch.label
    list.push({ value: String(ch.value), text: label })
  }
  return list
}

watch(selectedPlanId, (planId) => {
  if (!planId) {
    optionChoices.value = {}
    return
  }
  const plan = props.hostingPlans.find((p) => String(p.id) === planId) ?? null
  if (!plan) return
  const next: Record<string, string | number> = {}
  const opts = plan.config?.plan_options ?? []
  for (const opt of opts) {
    const existing = optionChoices.value[opt.id]
    if (existing !== undefined) next[opt.id] = existing
    else if (opt.type === 'range_slider') next[opt.id] = opt.min != null && opt.min !== '' ? Number(opt.min) : 0
    else if (opt.type === 'choice' || opt.type === 'select') {
      const first = opt.choices?.[0]
      if (first) next[opt.id] = first.value
    }
  }
  optionChoices.value = next
}, { immediate: true })

function submit() {
  if (!currentPlan.value || !canSubmit.value) return
  form.hosting_plan_id = currentPlan.value.id
  form.period_months = periodMonths.value
  form.accept_tos = acceptTos.value
  form.accept_early_execution = acceptEarlyExecution.value
  form.payment_method = paymentMethod.value
  form.option_choices = { ...optionChoices.value }
  form.post('/teamspeak/checkout')
}
</script>
