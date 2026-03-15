<template>
  <DefaultLayout>
    <Head :title="`Newsletter – ${site?.name ?? ''}`" />
    <PageBreadcrumb
      :title="`Newsletter – ${site?.name ?? ''}`"
      subtitle="Newsletter"
      subtitle-url="/modules/newsletter"
    />

    <div class="mb-4">
      <Link href="/modules/newsletter" class="d-inline-flex align-items-center gap-1 text-muted small text-decoration-none mb-2">
        <Icon icon="arrow-left" />
        Zurück zur Übersicht
      </Link>
      <h4 class="mb-1">Newsletter – {{ site?.name }}</h4>
      <p class="text-muted mb-0">{{ subscribers_count }} Abonnenten · News verfassen und versenden</p>
    </div>

    <BCard no-body class="mb-4">
      <BCardHeader>
        <h5 class="mb-0">News verfassen</h5>
        <p class="text-muted small mb-0">Betreff und Nachricht eingeben. Als Entwurf speichern oder an Abonnenten senden.</p>
      </BCardHeader>
      <BCardBody>
        <BForm @submit.prevent="submitDraftOrSend">
          <div class="mb-3">
            <label class="form-label" for="subject">Betreff</label>
            <BFormInput
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Betreff der E-Mail"
              :class="{ 'is-invalid': form.errors.subject }"
            />
            <div v-if="form.errors.subject" class="invalid-feedback d-block">{{ form.errors.subject }}</div>
          </div>
          <div class="mb-4">
            <label class="form-label" for="body">Nachricht</label>
            <BFormTextarea
              id="body"
              v-model="form.body"
              rows="8"
              placeholder="Inhalt der Newsletter-Nachricht (Markdown wird unterstützt)"
              :class="{ 'is-invalid': form.errors.body }"
            />
            <div v-if="form.errors.body" class="invalid-feedback d-block">{{ form.errors.body }}</div>
          </div>
          <div class="d-flex gap-2">
            <BButton type="button" variant="outline-secondary" :disabled="form.processing" @click="saveDraft">
              <Icon icon="save" class="me-1" />
              Entwurf speichern
            </BButton>
            <BButton type="button" variant="primary" :disabled="form.processing" @click="openSendConfirm">
              <Icon icon="send" class="me-1" />
              An Abonnenten senden
            </BButton>
          </div>
        </BForm>
      </BCardBody>
    </BCard>

    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">News & Entwürfe</h5>
        <p class="text-muted small mb-0">Bereits verfasste und gesendete News</p>
      </BCardHeader>
      <BCardBody>
        <BTable v-if="posts.length > 0" :items="posts" :fields="postFields" responsive stacked="sm">
          <template #cell(status)="{ item }">
            <BBadge :variant="item.status === 'sent' ? 'success' : 'warning'">
              {{ item.status === 'sent' ? 'Gesendet' : 'Entwurf' }}
            </BBadge>
          </template>
          <template #cell(created_at)="{ item }">
            <span class="text-muted">{{ formatPostDate(item) }}</span>
          </template>
        </BTable>
        <p v-else class="text-muted mb-0 py-4 text-center">Noch keine News verfasst.</p>
      </BCardBody>
    </BCard>

    <BModal v-model="sendConfirmOpen" title="Newsletter versenden?" @hidden="sendConfirmOpen = false">
      <p>Die News werden an {{ subscribers_count }} Abonnenten gesendet. Dieser Vorgang kann nicht rückgängig gemacht werden.</p>
      <template #footer>
        <BButton variant="secondary" @click="sendConfirmOpen = false">Abbrechen</BButton>
        <BButton variant="primary" :disabled="form.processing" @click="confirmSend">Jetzt senden</BButton>
      </template>
    </BModal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import {
  BBadge,
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BForm,
  BFormInput,
  BFormTextarea,
  BModal,
  BTable,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type Post = { id: number; subject: string; status: string; sent_at: string | null; created_at: string }
type Site = { uuid: string; name: string; slug: string }

const props = defineProps<{
  site: Site
  subscribers_count: number
  posts: Post[]
}>()

const form = useForm({ subject: '', body: '', action: 'save_draft' as 'save_draft' | 'send' })
const sendConfirmOpen = ref(false)

const postFields = [
  { key: 'subject', label: 'Betreff' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Datum' },
]

function formatPostDate(item: Post): string {
  const d = item.sent_at || item.created_at
  return d ? new Date(d).toLocaleString('de-DE') : '–'
}

function saveDraft() {
  form.action = 'save_draft'
  form.post(`/modules/newsletter/sites/${props.site.uuid}/posts`)
}

function openSendConfirm() {
  form.action = 'send'
  form.clearErrors()
  sendConfirmOpen.value = true
}

function confirmSend() {
  form.action = 'send'
  form.post(`/modules/newsletter/sites/${props.site.uuid}/posts`, {
    onSuccess: () => {
      sendConfirmOpen.value = false
      form.reset()
    },
  })
}

function submitDraftOrSend() {
  saveDraft()
}
</script>
