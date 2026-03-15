<template>
  <DefaultLayout>
    <Head title="Webspace" />
    <PageBreadcrumb title="Webspace" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Webspace</h4>
      <p class="text-muted mb-0">
        Professioneller Webspace mit Plesk – wählen Sie Ihr Paket
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
            <p class="text-muted small mb-3">{{ plan.disk_gb }} GB NVMe · {{ plan.traffic_gb }} GB Traffic/Monat</p>
            <ul class="list-unstyled small text-muted mb-3">
              <li>{{ plan.disk_gb }} GB NVMe Webspace</li>
              <li>{{ plan.traffic_gb }} GB Traffic im Monat</li>
              <li>{{ plan.domains }} Domain / {{ plan.subdomains }} Subdomains</li>
              <li>{{ plan.mailboxes }} Mailpostfächer</li>
              <li>{{ plan.databases }} Datenbanken</li>
            </ul>
            <p class="mb-3">
              <span class="fs-4 fw-semibold">{{ plan.price }} €</span>
              <span class="text-muted small">/ Monat</span>
            </p>
            <div class="mt-auto">
              <Link :href="`/webspace/checkout?plan=${plan.id}`" class="btn btn-primary w-100">
                Jetzt buchen
              </Link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <p v-if="hostingPlans.length === 0" class="text-muted">
      Derzeit sind keine Webspace-Pakete verfügbar.
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
  plesk_package_name?: string
  disk_gb: number
  traffic_gb: number
  domains: number
  subdomains: number
  mailboxes: number
  databases: number
  price: string
}

defineProps<{
  hostingPlans: HostingPlan[]
}>()
</script>
