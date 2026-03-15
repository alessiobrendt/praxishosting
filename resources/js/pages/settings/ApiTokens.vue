<template>
  <DefaultLayout>
    <Head title="API-Tokens" />
    <PageBreadcrumb title="API-Tokens" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">API-Tokens</h4>
        <p class="text-muted mb-0">
          Erstellen Sie Tokens für den Zugriff auf die Public API (z. B. für Ihre Landing-Page). Jeder Token wird nur einmal im Klartext angezeigt – speichern Sie ihn sicher.
        </p>
      </div>

      <BCard v-if="newToken" no-body class="mb-4 border-success border">
        <BCardHeader>
          <h5 class="mb-0 text-success">Neuer Token erstellt</h5>
          <p class="text-muted small mb-0">
            Kopieren Sie den Token jetzt. Er wird nicht erneut angezeigt.
          </p>
        </BCardHeader>
        <BCardBody>
          <p class="small text-muted mb-2">{{ newToken.name }}</p>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <code class="flex-grow-1 rounded bg-light p-2 small text-break font-monospace">{{ newToken.plainTextToken }}</code>
            <BButton
              type="button"
              variant="outline-secondary"
              size="sm"
              :title="copied ? 'Kopiert' : 'Kopieren'"
              @click="copyToken(newToken.plainTextToken)"
            >
              <Icon v-if="copied" icon="check" class="text-success" />
              <Icon v-else icon="copy" />
            </BButton>
          </div>
        </BCardBody>
      </BCard>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Token erstellen</h5>
          <p class="text-muted small mb-0">
            Vergeben Sie einen Namen (z. B. „Landing Page“), um den Token später zu erkennen.
          </p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submitCreate" class="d-flex flex-column flex-md-row align-items-md-end gap-3">
            <div class="flex-grow-1" style="max-width: 20rem;">
              <label class="form-label">Name</label>
              <BFormInput
                v-model="form.name"
                type="text"
                placeholder="z. B. Landing Page"
                :disabled="form.processing"
                :class="{ 'is-invalid': form.errors.name }"
              />
              <div v-if="form.errors.name" class="invalid-feedback d-block">{{ form.errors.name }}</div>
            </div>
            <BButton type="submit" variant="primary" :disabled="form.processing">
              Token erstellen
            </BButton>
          </BForm>
        </BCardBody>
      </BCard>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Ihre Tokens</h5>
          <p class="text-muted small mb-0">
            Widerrufen Sie einen Token, um den API-Zugriff sofort zu entziehen.
          </p>
        </BCardHeader>
        <BCardBody>
          <div v-if="tokens.length === 0" class="rounded border border-secondary border-dashed p-4 text-center text-muted">
            Noch keine API-Tokens vorhanden.
          </div>
          <ul v-else class="list-unstyled mb-0">
            <li
              v-for="token in tokens"
              :key="token.id"
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-2 py-3 border-bottom border-secondary border-opacity-25"
            >
              <div>
                <p class="fw-medium mb-0">{{ token.name }}</p>
                <p class="small text-muted mb-0">
                  Erstellt: {{ formatDateTime(token.created_at) }} · Zuletzt genutzt: {{ formatDateTime(token.last_used_at) }}
                </p>
              </div>
              <BButton
                type="button"
                variant="outline-danger"
                size="sm"
                class="flex-shrink-0"
                @click="revoke(token.id)"
              >
                <Icon icon="trash" class="me-1" />
                Widerrufen
              </BButton>
            </li>
          </ul>
        </BCardBody>
      </BCard>

      <BCard no-body>
        <BCardBody>
          <p class="small text-muted mb-0">
            Die API-Übersicht und Dokumentation finden Sie im
            <Link href="/admin/api" class="text-decoration-underline">Admin-Bereich</Link>
            (wenn Sie Admin-Rechte haben).
          </p>
        </BCardBody>
      </BCard>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { BButton, BCard, BCardBody, BCardHeader, BFormInput, BForm } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import { formatDateTime } from '@/lib/utils'

type Token = { id: number; name: string; last_used_at: string | null; created_at: string }

defineProps<{ tokens: Token[] }>()

const page = usePage()
const flash = computed(() => page.props.flash as { newToken?: { plainTextToken: string; name: string } } | undefined)
const newToken = computed(() => flash.value?.newToken)
const copied = ref(false)

const form = useForm({ name: '' })

function submitCreate() {
  form.post('/settings/api-tokens', {
    preserveScroll: true,
    onSuccess: () => form.reset('name'),
  })
}

function revoke(tokenId: number) {
  if (!confirm('Token wirklich widerrufen? Er kann danach nicht mehr verwendet werden.')) return
  router.delete(`/settings/api-tokens/${tokenId}`, { preserveScroll: true })
}

function copyToken(token: string) {
  navigator.clipboard.writeText(token).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>
