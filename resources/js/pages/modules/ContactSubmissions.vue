<template>
  <DefaultLayout>
    <Head :title="`Kontaktanfragen – ${site?.name ?? ''}`" />
    <PageBreadcrumb
      :title="`Kontaktanfragen – ${site?.name ?? ''}`"
      subtitle="Kontaktformular"
      subtitle-url="/modules/contact"
    />

    <div class="mb-4">
      <Link href="/modules/contact" class="d-inline-flex align-items-center gap-1 text-muted small text-decoration-none mb-2">
        <Icon icon="arrow-left" />
        Zurück zur Übersicht
      </Link>
      <h4 class="mb-1">Kontaktanfragen – {{ site?.name }}</h4>
      <p class="text-muted mb-0">Eingegangene Nachrichten über das Kontaktformular</p>
    </div>

    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">Eingegangene Anfragen</h5>
        <p class="text-muted small mb-0">{{ submissions.length }} Einträge</p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="submissions.length > 0" :items="submissions" :fields="submissionFields" responsive stacked="sm">
          <template #cell(created_at)="{ item }">
            <span class="text-muted">{{ new Date(item.created_at).toLocaleString('de-DE') }}</span>
          </template>
          <template #cell(email)="{ item }">
            <a :href="`mailto:${item.email}`" class="text-primary text-decoration-none">{{ item.email }}</a>
          </template>
          <template #cell(subject)="{ item }">
            {{ item.subject ?? '–' }}
          </template>
          <template #cell(message)="{ item }">
            <span class="text-truncate d-inline-block" style="max-width: 200px">{{ item.message }}</span>
          </template>
        </BTable>
        <p v-else class="text-muted mb-0 py-4 text-center">Noch keine Kontaktanfragen eingegangen.</p>
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

type Submission = {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  custom_fields: Record<string, unknown> | null
  created_at: string
}

type Site = { uuid: string; name: string; slug: string }

defineProps<{
  site: Site
  submissions: Submission[]
}>()

const submissionFields = [
  { key: 'created_at', label: 'Datum' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'E-Mail' },
  { key: 'subject', label: 'Betreff' },
  { key: 'message', label: 'Nachricht' },
]
</script>
