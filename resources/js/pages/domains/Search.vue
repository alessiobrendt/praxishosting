<template>
  <DefaultLayout>
    <Head title="Domain suchen" />
    <PageBreadcrumb title="Domain suchen" subtitle="Domains" subtitle-url="/domains" />

    <div class="mb-4">
      <h4 class="mb-1">Domain suchen</h4>
      <p class="text-muted mb-0">
        Prüfen Sie die Verfügbarkeit und bestellen Sie Ihre Wunschdomain
      </p>
    </div>

    <BCard no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0">Verfügbarkeit prüfen</h5>
        <p class="text-muted small mb-0">
          Geben Sie den gewünschten Namen ein (ohne Endung). Es werden .de, .com, .net und .io geprüft.
        </p>
      </BCardHeader>
      <BCardBody>
        <div class="d-flex flex-wrap gap-3 align-items-end">
          <div class="flex-grow-1" style="min-width: 200px;">
            <label class="form-label" for="domain">Domain-Name</label>
            <BFormInput
              id="domain"
              v-model="domainInput"
              placeholder="meine-domain"
              @keyup.enter="search"
            />
          </div>
          <BButton :disabled="!canSearch || loading" @click="search">
            <BSpinner v-if="loading" small class="me-2" />
            <Icon v-else icon="search" class="me-2" />
            Prüfen
          </BButton>
        </div>
      </BCardBody>
    </BCard>

    <BCard v-if="results.length > 0" no-body>
      <BCardHeader>
        <h5 class="mb-0">Ergebnisse</h5>
        <p class="text-muted small mb-0">Verfügbarkeit und Preise</p>
      </BCardHeader>
      <BCardBody>
        <div class="d-flex flex-column gap-2">
          <div
            v-for="r in results"
            :key="r.domain"
            class="d-flex flex-wrap align-items-center justify-content-between gap-3 py-2 border-bottom border-secondary border-opacity-25 last-border-0"
          >
            <span class="fw-medium">{{ r.domain }}</span>
            <div class="d-flex align-items-center gap-3">
              <template v-if="r.error">
                <span class="text-muted small">Fehler beim Prüfen</span>
              </template>
              <template v-else>
                <BBadge :variant="r.available ? 'success' : 'warning'">
                  {{ r.available ? 'Verfügbar' : 'Belegt' }}
                </BBadge>
                <BBadge v-if="r.premium" variant="info">Premium</BBadge>
                <span class="fw-medium">{{ (r.available ? r.sale_price : (r.transfer_sale_price ?? 0)).toFixed(2) }} €</span>
                <BButton v-if="r.available" size="sm" @click="goToCheckout(r)">
                  Bestellen
                </BButton>
                <BButton
                  v-else-if="(r.transfer_sale_price ?? 0) > 0"
                  size="sm"
                  variant="outline-secondary"
                  @click="goToTransferCheckout(r)"
                >
                  Transfer
                </BButton>
              </template>
            </div>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { BBadge, BButton, BCard, BCardBody, BFormInput, BSpinner } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

defineProps<{ csrf_token?: string }>()

type Result = {
  domain: string
  available: boolean
  premium: boolean
  sale_price: number
  purchase_price: number
  transfer_sale_price?: number
  error?: boolean
}

const domainInput = ref('')
const loading = ref(false)
const results = ref<Result[]>([])
const defaultTlds = ['de', 'com', 'net', 'io']

const canSearch = computed(() => domainInput.value.trim().length >= 2)

async function search() {
  if (!canSearch.value) return
  loading.value = true
  results.value = []
  try {
    const res = await fetch('/domains/check-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        domain: domainInput.value.trim().toLowerCase().replace(/\.(de|com|net|io)$/, ''),
        tlds: defaultTlds,
      }),
    })
    const data = await res.json()
    results.value = data.results ?? []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

function goToCheckout(r: Result) {
  if (!r.available || r.error) return
  router.visit(`/domains/checkout?domain=${encodeURIComponent(r.domain)}&sale_price=${r.sale_price}&tld=${r.domain.split('.').pop() ?? ''}`)
}

function goToTransferCheckout(r: Result) {
  if (r.available || r.error) return
  const tld = r.domain.split('.').pop() ?? ''
  const salePrice = r.transfer_sale_price ?? 0
  if (salePrice <= 0) return
  router.visit(`/domains/checkout?domain=${encodeURIComponent(r.domain)}&sale_price=${salePrice}&tld=${tld}&transfer=1`)
}
</script>

<style scoped>
.last-border-0:last-child {
  border-bottom: 0 !important;
}
</style>
