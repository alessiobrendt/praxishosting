<template>
  <DefaultLayout>
    <Head title="Kontaktformular" />
    <PageBreadcrumb title="Kontaktformular" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Kontaktformular</h4>
      <p class="text-muted mb-0">Eingegangene Kontaktanfragen einsehen</p>
    </div>

    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">Sites mit Kontaktformular-Modul</h5>
        <p class="text-muted small mb-0">Sites, auf denen das Kontaktformular aktiv ist</p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="sites.length > 0" :items="sites" :fields="contactFields" responsive stacked="sm">
          <template #cell(name)="{ item }">
            <span class="fw-medium">{{ item.name }}</span>
          </template>
          <template #cell(module_label)="{ item }">
            {{ item.module_label ?? '–' }}
          </template>
          <template #cell(submissions_count)="{ item }">
            {{ item.submissions_count }}
          </template>
          <template #cell(actions)="{ item }">
            <Link :href="`/modules/contact/submissions/${item.uuid}`" class="btn btn-sm btn-outline-primary">
              <Icon icon="message-square" class="me-1" />
              Anfragen anzeigen
            </Link>
          </template>
        </BTable>
        <p v-else class="text-muted mb-0 py-4 text-center">
          Keine Sites mit aktivem Kontaktformular-Modul. Fügen Sie das Kontaktformular im Page Designer hinzu.
        </p>
      </BCardBody>
    </BCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BCard, BCardBody, BCardHeader, BTable } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type Site = {
  uuid: string
  name: string
  slug: string
  submissions_count: number
  module_label: string | null
}

defineProps<{
  sites: Site[]
}>()

const contactFields = [
  { key: 'name', label: 'Site' },
  { key: 'module_label', label: 'Name' },
  { key: 'submissions_count', label: 'Eingänge' },
  { key: 'actions', label: 'Aktionen', thClass: 'text-end' },
]
</script>
