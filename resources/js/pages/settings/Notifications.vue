<template>
  <DefaultLayout>
    <Head title="Benachrichtigungen" />
    <PageBreadcrumb title="Benachrichtigungen" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Benachrichtigungen</h4>
        <p class="text-muted mb-0">
          Wählen Sie für jede E-Mail-Vorlage, ob Sie keine, E-Mail, Discord-DM oder beides erhalten möchten.
        </p>
        <div
          v-if="!discordAvailable || !discordConnected"
          class="mt-3 rounded border border-secondary bg-light p-3 small text-muted"
        >
          <template v-if="!discordAvailable">
            Discord-Benachrichtigungen sind für Ihre Marke derzeit nicht aktiviert. Wenden Sie sich an den Administrator.
          </template>
          <template v-else-if="!discordConnected">
            Um „Discord DM“ oder „E-Mail & Discord-DM“ zu nutzen, verbinden Sie zuerst Ihr Discord-Konto unter
            <Link href="/settings/integration" class="text-primary text-decoration-underline">
              Einstellungen → Integration
            </Link>.
          </template>
        </div>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Benachrichtigungskanäle</h5>
          <p class="text-muted small mb-0">
            Diese E-Mails werden automatisch versendet. Sie können sie pro Typ ausschalten oder auf E-Mail, Discord-DM oder beides stellen.
          </p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submit">
            <div
              v-for="(template, index) in templates"
              :key="template.key"
              class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-2 py-3 border-bottom border-secondary border-opacity-25"
              :class="{ 'border-0': index === templates.length - 1 }"
            >
              <label class="form-label mb-0 text-nowrap me-2" style="min-width: 12rem;">
                {{ template.name }}
              </label>
              <div class="btn-group flex-nowrap" role="group" :aria-label="`Kanal für ${template.name}`">
                <BButton
                  v-for="opt in channelOptions.filter((o) => o.showWhenDiscord !== true || (discordAvailable && discordConnected))"
                  :key="opt.value"
                  type="button"
                  :variant="getPreference(template.key) === opt.value ? 'primary' : 'outline-secondary'"
                  size="sm"
                  @click="setPreference(template.key, opt.value)"
                >
                  {{ opt.label }}
                </BButton>
              </div>
            </div>
            <div class="pt-3">
              <BButton type="submit" variant="primary" :disabled="form.processing">
                Speichern
              </BButton>
            </div>
          </BForm>
        </BCardBody>
      </BCard>

      <BModal v-model="consentModalOpen" title="Zustimmung zu Discord-Benachrichtigungen" hide-footer @hidden="pendingConsentPreference = null">
        <p class="text-body-secondary">
          Discord ist ein externer Dienst. Die Nutzung von Discord erfolgt auf Ihre eigene Verantwortung. Wir übermitteln nur die für die Benachrichtigung nötigen Daten an Discord. Mit Ihrer Zustimmung bestätigen Sie, dass Sie diese Nutzung wünschen und die Verantwortung dafür tragen.
        </p>
        <div class="d-flex justify-content-end gap-2">
          <BButton variant="secondary" @click="declineConsent">Ablehnen</BButton>
          <BButton variant="primary" @click="acceptConsent">Zustimmen</BButton>
        </div>
      </BModal>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { BButton, BCard, BCardBody, BCardHeader, BForm, BModal } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type EmailTemplate = { key: string; name: string }

const props = defineProps<{
  templates: EmailTemplate[]
  preferences: Record<string, string>
  discordAvailable: boolean
  discordConnected: boolean
  discordConsentGiven: boolean
}>()

const initialPreferences: Record<string, string> = {}
for (const t of props.templates) {
  initialPreferences[t.key] = props.preferences[t.key] ?? 'email'
}

const form = useForm<{
  preferences: Record<string, string>
  discord_consent_accepted: boolean
}>({
  preferences: initialPreferences,
  discord_consent_accepted: false,
})

const channelOptions: { value: string; label: string; showWhenDiscord?: boolean }[] = [
  { value: 'none', label: 'Keine' },
  { value: 'email', label: 'E-Mail' },
  { value: 'discord', label: 'Discord DM', showWhenDiscord: true },
  { value: 'email_discord', label: 'E-Mail & Discord-DM', showWhenDiscord: true },
]

const consentModalOpen = ref(false)
const pendingConsentPreference = ref<{ key: string; value: string } | null>(null)

function getPreference(key: string): string {
  return form.preferences[key] ?? 'email'
}

function setPreference(key: string, value: string) {
  const needsConsent =
    (value === 'discord' || value === 'email_discord') && !props.discordConsentGiven
  if (needsConsent) {
    pendingConsentPreference.value = { key, value }
    consentModalOpen.value = true
    return
  }
  form.preferences = { ...form.preferences, [key]: value }
}

function acceptConsent() {
  if (pendingConsentPreference.value) {
    form.preferences = {
      ...form.preferences,
      [pendingConsentPreference.value.key]: pendingConsentPreference.value.value,
    }
    form.discord_consent_accepted = true
    consentModalOpen.value = false
    pendingConsentPreference.value = null
    form.patch('/settings/notifications')
  }
}

function declineConsent() {
  consentModalOpen.value = false
  pendingConsentPreference.value = null
}

function submit() {
  form.patch('/settings/notifications')
}
</script>
