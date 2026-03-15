<template>
  <DefaultLayout>
    <Head title="Abo verwalten" />
    <PageBreadcrumb title="Abo verwalten" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Abo verwalten</h4>
      <p class="text-muted mb-0">
        Ihre aktiven Abos (Game-Server, TeamSpeak-Server und Webspace). Sie können ein Abo zum Periodenende kündigen.
      </p>
    </div>

    <BCard v-if="allSubscriptions.length === 0" no-body>
      <BCardBody>
        <p class="text-muted mb-0">
          Sie haben derzeit keine Abos mit monatlicher Abbuchung. Prepaid-Produkte verlängern Sie direkt auf der jeweiligen Account-Seite (Verlängern).
        </p>
        <Link href="/dashboard" class="btn btn-outline-secondary mt-3">Zum Dashboard</Link>
      </BCardBody>
    </BCard>

    <template v-else>
      <BCard v-if="gameServerSubscriptions.length > 0" no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <Icon icon="gamepad-2" />
            Game-Server-Abos
          </h5>
          <p class="text-muted small mb-0">Abos mit monatlicher Abbuchung – Kündigung zum Ende der aktuellen Abrechnungsperiode.</p>
        </BCardHeader>
        <BCardBody>
          <BTable :items="gameServerSubscriptions" :fields="subscriptionFields" responsive stacked="sm">
            <template #cell(current_period_ends_at)="{ item }">
              {{ formatDate(item.current_period_ends_at) }}
            </template>
            <template #cell(status)="{ item }">
              <BBadge v-if="item.cancel_at_period_end" variant="secondary">Zum Periodenende gekündigt</BBadge>
              <BBadge v-else variant="success">Aktiv</BBadge>
            </template>
            <template #cell(actions)="{ item }">
              <Link :href="item.show_url" class="btn btn-sm btn-outline-secondary me-1">Zum Account</Link>
              <BButton
                v-if="!item.cancel_at_period_end"
                variant="outline-danger"
                size="sm"
                @click="cancelSubscription(item.cancel_url)"
              >
                Zum Periodenende kündigen
              </BButton>
            </template>
          </BTable>
        </BCardBody>
      </BCard>

      <BCard v-if="teamSpeakSubscriptions.length > 0" no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <Icon icon="headphones" />
            TeamSpeak-Server-Abos
          </h5>
          <p class="text-muted small mb-0">Abos mit monatlicher Abbuchung.</p>
        </BCardHeader>
        <BCardBody>
          <BTable :items="teamSpeakSubscriptions" :fields="subscriptionFields" responsive stacked="sm">
            <template #cell(current_period_ends_at)="{ item }">
              {{ formatDate(item.current_period_ends_at) }}
            </template>
            <template #cell(status)="{ item }">
              <BBadge v-if="item.cancel_at_period_end" variant="secondary">Zum Periodenende gekündigt</BBadge>
              <BBadge v-else variant="success">Aktiv</BBadge>
            </template>
            <template #cell(actions)="{ item }">
              <Link :href="item.show_url" class="btn btn-sm btn-outline-secondary me-1">Zum Account</Link>
              <BButton
                v-if="!item.cancel_at_period_end"
                variant="outline-danger"
                size="sm"
                @click="cancelSubscription(item.cancel_url)"
              >
                Zum Periodenende kündigen
              </BButton>
            </template>
          </BTable>
        </BCardBody>
      </BCard>

      <BCard v-if="webspaceSubscriptions.length > 0" no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <Icon icon="server" />
            Webspace-Abos
          </h5>
          <p class="text-muted small mb-0">Abos mit monatlicher Abbuchung.</p>
        </BCardHeader>
        <BCardBody>
          <BTable :items="webspaceSubscriptions" :fields="subscriptionFields" responsive stacked="sm">
            <template #cell(current_period_ends_at)="{ item }">
              {{ formatDate(item.current_period_ends_at) }}
            </template>
            <template #cell(name)="{ item }">
              <code class="small">{{ item.name }}</code>
            </template>
            <template #cell(status)="{ item }">
              <BBadge v-if="item.cancel_at_period_end" variant="secondary">Zum Periodenende gekündigt</BBadge>
              <BBadge v-else variant="success">Aktiv</BBadge>
            </template>
            <template #cell(actions)="{ item }">
              <Link :href="item.show_url" class="btn btn-sm btn-outline-secondary me-1">Zum Account</Link>
              <BButton
                v-if="!item.cancel_at_period_end"
                variant="outline-danger"
                size="sm"
                @click="cancelSubscription(item.cancel_url)"
              >
                Zum Periodenende kündigen
              </BButton>
            </template>
          </BTable>
        </BCardBody>
      </BCard>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { computed } from 'vue'
import { BBadge, BButton, BCard, BCardBody, BCardHeader, BTable } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import { formatDate } from '@/lib/utils'

type SubscriptionItem = {
  id: number
  type: string
  name: string
  plan_name: string | null
  current_period_ends_at: string | null
  cancel_at_period_end: boolean
  show_url: string
  cancel_url: string
}

const props = defineProps<{
  gameServerSubscriptions: SubscriptionItem[]
  webspaceSubscriptions: SubscriptionItem[]
  teamSpeakSubscriptions: SubscriptionItem[]
}>()

const allSubscriptions = computed(() => [
  ...props.gameServerSubscriptions,
  ...props.webspaceSubscriptions,
  ...props.teamSpeakSubscriptions,
])

const subscriptionFields = [
  { key: 'name', label: 'Name' },
  { key: 'plan_name', label: 'Paket' },
  { key: 'current_period_ends_at', label: 'Läuft bis' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aktionen' },
]

function cancelSubscription(cancelUrl: string) {
  router.post(cancelUrl, {}, {
    preserveScroll: true,
    onSuccess: () => {},
    onError: () => {},
  })
}
</script>
