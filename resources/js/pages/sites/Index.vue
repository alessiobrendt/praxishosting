<template>
  <DefaultLayout>
    <Head title="Meine Sites" />
    <PageBreadcrumb title="Meine Sites" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 class="mb-1">Meine Sites</h4>
        <p class="text-muted mb-0">Ihre Webseiten und gemeinsam bearbeitete Sites</p>
      </div>
      <Link href="/sites/create" class="btn btn-primary">
        <Icon icon="plus" class="me-2" />
        Neue Site erstellen
      </Link>
    </div>

    <BCard no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0">Eigene Sites</h5>
        <p class="text-muted small mb-0">Von Ihnen gekaufte Templates</p>
      </BCardHeader>
      <BCardBody>
        <BTable :items="sites" :fields="siteFields" responsive stacked="sm" show-empty>
          <template #cell(name)="{ item }">
            <span class="fw-medium">{{ item.name }}</span>
          </template>
          <template #cell(slug)="{ item }">
            <code class="bg-light px-2 py-1 rounded small">{{ item.slug }}</code>
          </template>
          <template #cell(template)="{ item }">
            {{ item.template?.name ?? '–' }}
          </template>
          <template #cell(subscription)="{ item }">
            <template v-if="item.site_subscription">
              <BBadge v-if="item.site_subscription.mollie_status === 'active' && !item.site_subscription.cancel_at_period_end" variant="success">Aktiv</BBadge>
              <BBadge v-else-if="item.site_subscription.cancel_at_period_end" variant="warning">Läuft aus</BBadge>
              <BBadge v-else variant="secondary">{{ item.site_subscription.mollie_status }}</BBadge>
            </template>
            <span v-else class="text-muted">–</span>
          </template>
          <template #cell(actions)="{ item }">
            <Link :href="`/sites/${item.uuid}`" class="btn btn-sm btn-outline-primary">
              Bearbeiten
              <Icon icon="external-link" class="ms-1" />
            </Link>
          </template>
          <template #empty>
            <span class="text-muted">Keine Sites vorhanden</span>
          </template>
        </BTable>
      </BCardBody>
    </BCard>

    <BCard v-if="collaboratingSites?.length" no-body>
      <BCardHeader>
        <h5 class="mb-0">Gemeinsam bearbeitete Sites</h5>
        <p class="text-muted small mb-0">Sites, an denen Sie mitarbeiten</p>
      </BCardHeader>
      <BCardBody>
        <BTable :items="collaboratingSites" :fields="collabFields" responsive stacked="sm">
          <template #cell(name)="{ item }">
            <span class="fw-medium">{{ item.name }}</span>
          </template>
          <template #cell(slug)="{ item }">
            <code class="bg-light px-2 py-1 rounded small">{{ item.slug }}</code>
          </template>
          <template #cell(owner)="{ item }">
            {{ (item as { user?: { name: string } }).user?.name ?? '–' }}
          </template>
          <template #cell(actions)="{ item }">
            <Link :href="`/sites/${item.uuid}`" class="btn btn-sm btn-outline-primary">
              Bearbeiten
              <Icon icon="external-link" class="ms-1" />
            </Link>
          </template>
        </BTable>
      </BCardBody>
    </BCard>

    <div class="text-center">
      <Link href="/gallery" class="btn btn-outline-secondary">
        Weitere Templates in der Galerie ansehen
        <Icon icon="external-link" class="ms-2" />
      </Link>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BCard, BCardBody, BCardHeader, BBadge, BTable } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type SiteSubscription = {
  id?: number
  mollie_status: string
  current_period_ends_at: string | null
  cancel_at_period_end: boolean
}

type Site = {
  uuid: string
  name: string
  slug: string
  template?: { name: string }
  site_subscription?: SiteSubscription | null
}

defineProps<{
  sites: Site[]
  collaboratingSites?: (Site & { user?: { name: string } })[]
}>()

const siteFields = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'template', label: 'Template' },
  { key: 'subscription', label: 'Abo-Status' },
  { key: 'actions', label: 'Aktionen', thClass: 'text-end' },
]

const collabFields = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'owner', label: 'Besitzer' },
  { key: 'actions', label: 'Aktionen', thClass: 'text-end' },
]
</script>
