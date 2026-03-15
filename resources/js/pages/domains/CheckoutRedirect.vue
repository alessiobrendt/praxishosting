<template>
  <DefaultLayout>
    <Head :title="`Zahlung: ${domain}`" />
    <PageBreadcrumb title="Weiter zur Zahlung" subtitle="Domains" subtitle-url="/domains" />

    <div class="mb-4">
      <h4 class="mb-1">Weiter zur Zahlung</h4>
      <p class="text-muted mb-0">Domain: {{ domain }}</p>
    </div>

    <BCard no-body class="max-w-xl">
      <BCardHeader>
        <h5 class="mb-0">Lokal (Development)</h5>
        <p class="text-muted small mb-0">
          Ohne Webhook kannst du die Zahlung simulieren: Bestellung wird ausgeführt, ohne zu Mollie zu gehen.
        </p>
      </BCardHeader>
      <BCardBody class="d-flex flex-column flex-sm-row gap-2">
        <BButton variant="outline-secondary" @click="window.location.href = stripeUrl">
          Zu Mollie Checkout (echte Test-Zahlung)
        </BButton>
        <Link :href="`/domains/checkout/dev-complete?token=${token}`" class="btn btn-primary">
          Dev: Zahlung simulieren (Domain jetzt bestellen)
        </Link>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BButton, BCard, BCardBody, BCardHeader } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

defineProps<{
  token: string
  stripeUrl: string
  domain: string
}>()
</script>
