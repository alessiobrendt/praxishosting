<template>
  <DefaultLayout>
    <Head title="Zwei-Faktor-Authentifizierung" />
    <PageBreadcrumb title="Zwei-Faktor-Authentifizierung" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Zwei-Faktor-Authentifizierung</h4>
        <p class="text-muted mb-0">
          Verwalten Sie Ihre Zwei-Faktor-Authentifizierungs-Einstellungen
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">2FA Status</h5>
          <p class="text-muted small mb-0">Schutz für Ihr Konto</p>
        </BCardHeader>
        <BCardBody>
          <div v-if="!twoFactorEnabled" class="d-flex flex-column gap-3">
            <BBadge variant="danger">Deaktiviert</BBadge>
            <p class="text-muted small mb-0">
              Wenn Sie die Zwei-Faktor-Authentifizierung aktivieren, werden Sie während der Anmeldung nach einer sicheren PIN gefragt. Diese PIN kann von einer TOTP-unterstützten Anwendung auf Ihrem Telefon abgerufen werden.
            </p>
            <div>
              <BButton v-if="hasSetupData" variant="primary" @click="showSetupModal = true">
                <Icon icon="shield-check" class="me-2" />
                Setup fortsetzen
              </BButton>
              <form v-else method="post" :action="enableUrl" class="d-inline" @submit.prevent="submitEnable">
                <BButton type="submit" variant="primary" :disabled="enableProcessing">
                  <Icon icon="shield-check" class="me-2" />
                  2FA aktivieren
                </BButton>
              </form>
            </div>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <BBadge variant="success">Aktiviert</BBadge>
            <p class="text-muted small mb-0">
              Mit aktivierter Zwei-Faktor-Authentifizierung werden Sie während der Anmeldung nach einer sicheren, zufälligen PIN gefragt, die Sie von der TOTP-unterstützten Anwendung auf Ihrem Telefon abrufen können.
            </p>
            <TwoFactorRecoveryCodes />
            <div>
              <form method="post" class="d-inline" @submit.prevent="submitDisable">
                <input type="hidden" name="_method" value="DELETE" />
                <BButton type="submit" variant="danger" :disabled="disableProcessing">
                  <Icon icon="shield-off" class="me-2" />
                  2FA deaktivieren
                </BButton>
              </form>
            </div>
          </div>
        </BCardBody>
      </BCard>

      <TwoFactorSetupModal
        v-model="showSetupModal"
        :requires-confirmation="requiresConfirmation"
        :two-factor-enabled="twoFactorEnabled"
      />
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { onUnmounted, ref } from 'vue'
import { BBadge, BButton, BCard, BCardBody, BCardHeader } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue'
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth'
import { enable, disable } from '@/routes/two-factor'

withDefaults(
  defineProps<{ requiresConfirmation?: boolean; twoFactorEnabled?: boolean }>(),
  { requiresConfirmation: false, twoFactorEnabled: false },
)

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth()
const showSetupModal = ref(false)
const enableUrl = enable.url()
const enableProcessing = ref(false)
const disableProcessing = ref(false)

function submitEnable() {
  enableProcessing.value = true
  router.post(enable.url(), {}, {
    preserveScroll: true,
    onSuccess: () => { showSetupModal.value = true },
    onFinish: () => { enableProcessing.value = false },
  })
}

function submitDisable() {
  if (!confirm('2FA wirklich deaktivieren?')) return
  disableProcessing.value = true
  router.delete(disable.url(), {
    preserveScroll: true,
    onFinish: () => { disableProcessing.value = false },
  })
}

onUnmounted(() => {
  clearTwoFactorAuthData()
})
</script>
