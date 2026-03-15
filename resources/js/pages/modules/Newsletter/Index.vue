<template>
  <DefaultLayout>
    <Head title="Newsletter" />
    <PageBreadcrumb title="Newsletter" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Newsletter</h4>
      <p class="text-muted mb-0">News schreiben und Abonnenten verwalten</p>
    </div>

    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">Sites mit Newsletter-Modul</h5>
        <p class="text-muted small mb-0">Sites, auf denen das Newsletter-Modul aktiv ist</p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="sites.length > 0" :items="sites" :fields="newsletterFields" responsive stacked="sm">
          <template #cell(name)="{ item }">
            <Link :href="`/modules/newsletter/sites/${item.uuid}`" class="fw-medium text-decoration-none">{{ item.name }}</Link>
          </template>
          <template #cell(subscribers_count)="{ item }">
            {{ item.subscribers_count }}
          </template>
          <template #cell(actions)="{ item }">
            <Link :href="`/modules/newsletter/sites/${item.uuid}`" class="btn btn-sm btn-outline-primary">
              <Icon icon="edit" class="me-1" />
              News schreiben
            </Link>
          </template>
        </BTable>
        <p v-else class="text-muted mb-0 py-4 text-center">
          Keine Sites mit aktivem Newsletter-Modul. Fügen Sie das Newsletter-Modul im Page Designer hinzu.
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
  subscribers_count: number
}

defineProps<{
  sites: Site[]
}>()

const newsletterFields = [
  { key: 'name', label: 'Site' },
  { key: 'subscribers_count', label: 'Abonnenten' },
  { key: 'actions', label: 'Aktionen', thClass: 'text-end' },
]
</script>
