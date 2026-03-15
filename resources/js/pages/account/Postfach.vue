<template>
  <DefaultLayout>
    <Head title="Postfach" />
    <PageBreadcrumb title="Postfach" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Postfach</h4>
      <p class="text-muted mb-0">
        Alle an dich gesendeten E-Mails findest du hier zur Nachverfolgung.
      </p>
    </div>

    <BRow>
      <BCol md="4" class="mb-4 mb-md-0">
        <BCard no-body class="h-100 overflow-hidden">
          <div class="overflow-auto p-2" style="max-height: 85vh">
            <Link
              v-for="email in emails"
              :key="email.uuid"
              :href="`/account/postfach/${email.uuid}`"
              class="d-block rounded p-3 text-decoration-none text-body border border-transparent mb-2"
              :class="selectedEmail?.uuid === email.uuid ? 'bg-primary bg-opacity-10 border-primary' : 'hover-bg-light'"
            >
              <div class="d-flex justify-content-between gap-2">
                <div class="min-w-0 flex-grow-1">
                  <p class="fw-semibold mb-1 text-truncate">{{ email.subject }}</p>
                  <p class="small text-muted mb-0 line-clamp-2">{{ email.snippet || '…' }}</p>
                </div>
                <span class="badge bg-warning text-dark shrink-0">{{ email.sent_at }}</span>
              </div>
            </Link>
            <p v-if="emails.length === 0" class="text-center text-muted small p-4 mb-0">
              Noch keine E-Mails vorhanden.
            </p>
          </div>
        </BCard>
      </BCol>
      <BCol md="8">
        <BCard v-if="!selectedEmail" no-body class="d-flex align-items-center justify-content-center py-5">
          <BCardBody class="text-center">
            <Icon icon="mail" class="fs-1 text-muted opacity-50" />
            <h5 class="mt-3">Keine E-Mail ausgewählt</h5>
            <p class="text-muted mb-0">
              Bitte wähle eine E-Mail aus der Liste links, um den Inhalt hier anzuzeigen.
            </p>
          </BCardBody>
        </BCard>
        <BCard v-else no-body>
          <div class="border-bottom bg-light px-4 py-3">
            <p class="fw-semibold mb-1">{{ selectedEmail.subject }}</p>
            <p class="small text-muted mb-0">{{ selectedEmail.sent_at }}</p>
          </div>
          <div class="p-0" style="min-height: 75vh">
            <iframe
              v-if="selectedEmail.body_html"
              :srcdoc="selectedEmail.body_html"
              title="E-Mail-Inhalt"
              class="w-100 border-0"
              style="min-height: 75vh"
              sandbox="allow-same-origin"
            />
          </div>
        </BCard>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BCard, BCardBody, BCol, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type EmailListItem = {
  uuid: string
  subject: string
  snippet: string | null
  sent_at: string | null
}

type SelectedEmail = {
  uuid: string
  subject: string
  body_html: string
  sent_at: string | null
} | null

defineProps<{
  emails: EmailListItem[]
  selectedEmail: SelectedEmail
}>()
</script>
