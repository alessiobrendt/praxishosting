<template>
  <DefaultLayout>
    <Head title="Meine Rechnungen" />
    <PageBreadcrumb title="Meine Rechnungen" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Meine Rechnungen</h4>
      <p class="text-muted mb-0">
        Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download sowie Ihre Zahlungsart
      </p>
    </div>

    <BCard no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0">Meine Rechnungen</h5>
        <p class="text-muted small mb-0">Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download</p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="invoices?.length" :items="invoices" :fields="invoiceFields" responsive stacked="sm">
          <template #cell(number)="{ item }">
            <code class="small">{{ item.number }}</code>
          </template>
          <template #cell(amount)="{ item }">
            {{ item.amount }} €
          </template>
          <template #cell(actions)="{ item }">
            <a :href="`/invoices/${item.uuid}`" class="text-primary text-decoration-none me-2">Rechnung anzeigen</a>
            <template v-if="item.pdf_path || item.invoice_xml_path">
              <a v-if="item.pdf_path" :href="`/invoices/${item.uuid}/pdf`" target="_blank" rel="noopener" class="text-muted small me-1">PDF</a>
              <a v-if="item.invoice_xml_path" :href="`/invoices/${item.uuid}/xml`" target="_blank" rel="noopener" class="text-muted small">XML</a>
            </template>
          </template>
        </BTable>
        <p v-else class="text-muted small mb-0">Noch keine Rechnungen vorhanden.</p>
      </BCardBody>
    </BCard>

    <BCard v-if="prepaidEnabled" no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0 d-flex align-items-center gap-2">
          <Icon icon="wallet" />
          Guthaben
        </h5>
        <p class="text-muted small mb-0">
          Aktueller Stand: {{ (customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
          <template v-if="balanceTopUpEnabled">
            – Guthaben können Sie per Karte aufladen (Mindestbetrag {{ (balanceTopUpMinAmount ?? 5).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €).
          </template>
        </p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="balanceTransactions?.length" :items="balanceTransactions" :fields="balanceFields" responsive stacked="sm" class="mb-4">
          <template #cell(amount)="{ item }">
            <span :class="item.amount >= 0 ? 'text-success' : 'text-danger'">
              {{ item.amount >= 0 ? '+' : '' }}{{ item.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
            </span>
          </template>
          <template #cell(description)="{ item }">
            {{ item.description || item.type }}
          </template>
        </BTable>
        <p v-else class="text-muted small mb-4">Noch keine Transaktionen.</p>

        <div v-if="balanceTopUpEnabled && balanceCheckoutUrl" class="row g-4">
          <div class="col-lg-8">
            <BCard no-body class="mb-0">
              <BCardBody>
                <h6 class="mb-3">Betrag wählen</h6>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <BButton
                    v-for="opt in QUICK_AMOUNTS"
                    :key="opt.value"
                    :variant="balanceTopUpAmount === opt.value ? 'primary' : 'outline-secondary'"
                    size="sm"
                    @click="balanceTopUpAmount = opt.value"
                  >
                    {{ opt.value }}€
                  </BButton>
                </div>
                <div class="mb-3">
                  <label class="form-label">Oder eigenen Betrag (€)</label>
                  <BFormInput
                    v-model.number="balanceTopUpAmount"
                    type="number"
                    step="0.01"
                    :min="balanceTopUpMin"
                    :max="500"
                  />
                </div>
                <h6 class="mb-2">Zahlungsart</h6>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <BFormRadio
                    v-for="method in molliePaymentMethods"
                    :key="method.type"
                    v-model="selectedPaymentMethod"
                    :value="method.type"
                    name="balance_method"
                  >
                    {{ method.label }}
                  </BFormRadio>
                </div>
                <BButton
                  variant="primary"
                  :disabled="balanceTopUpSubmitting || summaryAmount < balanceTopUpMin"
                  @click="submitBalanceTopUp"
                >
                  {{ balanceTopUpSubmitting ? 'Weiterleitung…' : 'Jetzt sicher aufladen' }}
                </BButton>
              </BCardBody>
            </BCard>
          </div>
          <div class="col-lg-4">
            <BCard no-body>
              <BCardHeader>
                <h6 class="mb-0">Zusammenfassung</h6>
              </BCardHeader>
              <BCardBody>
                <p class="d-flex justify-content-between mb-0">
                  <span class="text-muted">Aufladebetrag</span>
                  <strong>{{ summaryFormatted }} €</strong>
                </p>
              </BCardBody>
            </BCard>
          </div>
        </div>
      </BCardBody>
    </BCard>

    <BCard v-if="aiTokensEnabled && aiTokenPackages?.length" no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0 d-flex align-items-center gap-2">
          <Icon icon="sparkles" />
          AI Tokens
        </h5>
        <p class="text-muted small mb-0">
          Aktueller Stand: {{ aiTokenBalance }} Tokens. Für KI-SEO und KI-Author im Page Designer.
        </p>
      </BCardHeader>
      <BCardBody>
        <div class="d-flex flex-wrap gap-2">
          <BButton
            v-for="pkg in aiTokenPackages"
            :key="pkg.amount"
            variant="outline-primary"
            size="sm"
            @click="checkoutAiTokens(pkg.amount)"
          >
            {{ pkg.label }}
          </BButton>
        </div>
      </BCardBody>
    </BCard>

    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">Zahlungsart</h5>
        <p class="text-muted small mb-0">Verwalten Sie Ihre Zahlungsmethode und Abrechnungen</p>
      </BCardHeader>
      <BCardBody>
        <p v-if="paymentMethodSummary" class="small mb-2">
          Aktuelle Zahlungsmethode: <strong>{{ paymentMethodSummary.brand }} ****{{ paymentMethodSummary.last4 ?? '****' }}</strong>
        </p>
        <p v-else class="small text-muted mb-2">
          Noch keine Zahlungsmethode hinterlegt (wird beim ersten Abo-Abschluss angelegt).
        </p>
        <a :href="billingPortalUrl" target="_self" rel="noopener" class="btn btn-outline-secondary btn-sm">
          Zahlungsart verwalten
          <Icon icon="external-link" class="ms-1" />
        </a>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BFormInput,
  BFormRadio,
  BTable,
} from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200]
const BALANCE_TOPUP_MAX = 500

const props = defineProps<{
  invoices: Array<{ uuid: string; number: string; amount: string; status: string; invoice_date: string; pdf_path: string | null; invoice_xml_path: string | null }>
  billingPortalUrl: string
  paymentMethodSummary: { brand: string; last4: string | null } | null
  aiTokensEnabled: boolean
  aiTokenBalance: number
  aiTokenPackages: Array<{ amount: number; label: string }>
  prepaidEnabled?: boolean
  customerBalance?: number
  balanceTransactions?: Array<{ id: number; amount: number; type: string; description: string | null; created_at: string }>
  balanceTopUpEnabled?: boolean
  balanceTopUpMinAmount?: number
  balanceCheckoutUrl?: string
}>()

const balanceTopUpAmount = ref<number>(props.balanceTopUpMinAmount ?? 5)
const balanceTopUpSubmitting = ref(false)
const selectedPaymentMethod = ref<string>('')

const page = usePage()
const molliePaymentMethods = computed(
  () => (page.props.molliePaymentMethods as { type: string; label: string }[]) ?? [],
)
watch(molliePaymentMethods, (methods) => {
  if (methods.length && !selectedPaymentMethod.value) {
    selectedPaymentMethod.value = methods[0].type
  }
}, { immediate: true })

watch(() => (page.props.flash as { error?: string })?.error, (message) => {
  if (message) console.warn('Flash error:', message)
}, { immediate: true })
watch(() => (page.props.flash as { success?: string })?.success, (message) => {
  if (message) console.warn('Flash success:', message)
}, { immediate: true })

const invoiceFields = [
  { key: 'number', label: 'Nummer' },
  { key: 'amount', label: 'Betrag' },
  { key: 'invoice_date', label: 'Datum' },
  { key: 'actions', label: 'Aktionen' },
]
const balanceFields = [
  { key: 'created_at', label: 'Datum' },
  { key: 'amount', label: 'Betrag' },
  { key: 'description', label: 'Beschreibung' },
]

const balanceTopUpMin = computed(() => props.balanceTopUpMinAmount ?? 5)
const summaryAmount = computed(() => {
  const raw = Number(balanceTopUpAmount.value) || 0
  const min = balanceTopUpMin.value
  const clamped = Math.min(BALANCE_TOPUP_MAX, Math.max(0, raw))
  return clamped >= min ? clamped : 0
})
const summaryFormatted = computed(() =>
  summaryAmount.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
)

function checkoutAiTokens(amount: number) {
  router.post('/billing/ai-tokens/checkout', { token_amount: amount }, { preserveScroll: true, preserveState: true })
}

function submitBalanceTopUp() {
  const url = props.balanceCheckoutUrl
  const min = balanceTopUpMin.value
  if (!url || balanceTopUpAmount.value < min) return
  balanceTopUpSubmitting.value = true
  const payload: { amount: number; method?: string } = { amount: balanceTopUpAmount.value }
  if (selectedPaymentMethod.value) payload.method = selectedPaymentMethod.value
  router.post(url, payload, {
    preserveScroll: true,
    preserveState: true,
    onFinish: () => { balanceTopUpSubmitting.value = false },
  })
}
</script>
