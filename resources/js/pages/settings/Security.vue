<template>
  <DefaultLayout>
    <Head title="Sicherheit" />
    <PageBreadcrumb title="Sicherheit" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Sicherheit</h4>
        <p class="text-muted mb-0">
          Sperre nach Inaktivität, PIN-Schutz und Zwei-Faktor-Authentifizierung
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Sperre nach Inaktivität</h5>
          <p class="text-muted small mb-0">
            Nach der gewählten Zeit ohne Maus- oder Tastaturaktivität wird die Sitzung gesperrt und Sie müssen Ihre PIN eingeben.
          </p>
        </BCardHeader>
        <BCardBody>
          <div class="mb-0">
            <label class="form-label" for="inactivity_lock_minutes">Nach Minuten sperren</label>
            <BFormSelect
              id="inactivity_lock_minutes"
              v-model="inactivityForm.inactivity_lock_minutes"
              :options="inactivityOptions"
              value-field="value"
              text-field="label"
              class="w-auto"
              :class="{ 'is-invalid': inactivityForm.errors.inactivity_lock_minutes }"
              @update:model-value="submitInactivity"
            />
            <div v-if="inactivityForm.errors.inactivity_lock_minutes" class="invalid-feedback d-block">
              {{ inactivityForm.errors.inactivity_lock_minutes }}
            </div>
          </div>
        </BCardBody>
      </BCard>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">PIN-Schutz</h5>
          <p class="text-muted small mb-0">
            1–8-stellige PIN zum schnellen Entsperren nach Inaktivität.
          </p>
        </BCardHeader>
        <BCardBody>
          <div v-if="!hasPin">
            <BButton variant="primary" @click="showEnablePinModal = true">
              <Icon icon="key" class="me-2" />
              PIN aktivieren
            </BButton>
          </div>
          <div v-else>
            <p class="text-muted small mb-2">PIN ist aktiviert.</p>
            <div class="d-flex flex-wrap gap-2">
              <BButton variant="secondary" @click="showChangePinModal = true">
                PIN ändern
              </BButton>
              <BButton variant="danger" @click="showDisablePinModal = true">
                PIN deaktivieren
              </BButton>
            </div>
          </div>
        </BCardBody>
      </BCard>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Zwei-Faktor-Authentifizierung</h5>
          <p class="text-muted small mb-0">
            Zusätzlicher Schutz bei der Anmeldung mit einer Authenticator-App.
          </p>
        </BCardHeader>
        <BCardBody>
          <Link href="/settings/two-factor">
            <BButton variant="secondary">
              <Icon icon="shield-check" class="me-2" />
              2FA verwalten
            </BButton>
          </Link>
        </BCardBody>
      </BCard>

      <BModal v-model="showEnablePinModal" title="PIN aktivieren" hide-footer @hidden="enablePinForm.reset()">
        <BForm @submit.prevent="submitEnablePin">
          <div class="mb-3">
            <label class="form-label">Aktuelles Passwort</label>
            <BFormInput
              v-model="enablePinForm.current_password"
              type="password"
              autocomplete="current-password"
              :class="{ 'is-invalid': enablePinForm.errors.current_password }"
            />
            <div v-if="enablePinForm.errors.current_password" class="invalid-feedback d-block">{{ enablePinForm.errors.current_password }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Neue PIN (1–8 Ziffern)</label>
            <BFormInput
              v-model="enablePinForm.pin"
              type="password"
              inputmode="numeric"
              maxlength="8"
              placeholder="••••"
              :class="{ 'is-invalid': enablePinForm.errors.pin }"
            />
            <div v-if="enablePinForm.errors.pin" class="invalid-feedback d-block">{{ enablePinForm.errors.pin }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">PIN bestätigen</label>
            <BFormInput
              v-model="enablePinForm.pin_confirmation"
              type="password"
              inputmode="numeric"
              maxlength="8"
              placeholder="••••"
              :class="{ 'is-invalid': enablePinForm.errors.pin_confirmation }"
            />
            <div v-if="enablePinForm.errors.pin_confirmation" class="invalid-feedback d-block">{{ enablePinForm.errors.pin_confirmation }}</div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <BButton type="button" variant="secondary" @click="showEnablePinModal = false">Abbrechen</BButton>
            <BButton type="submit" variant="primary" :disabled="enablePinForm.processing">PIN aktivieren</BButton>
          </div>
        </BForm>
      </BModal>

      <BModal v-model="showChangePinModal" title="PIN ändern" hide-footer @hidden="changePinForm.reset()">
        <BForm @submit.prevent="submitChangePin">
          <div class="mb-3">
            <label class="form-label">Aktuelles Passwort</label>
            <BFormInput
              v-model="changePinForm.current_password"
              type="password"
              autocomplete="current-password"
              :class="{ 'is-invalid': changePinForm.errors.current_password }"
            />
            <div v-if="changePinForm.errors.current_password" class="invalid-feedback d-block">{{ changePinForm.errors.current_password }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Neue PIN (1–8 Ziffern)</label>
            <BFormInput
              v-model="changePinForm.pin"
              type="password"
              inputmode="numeric"
              maxlength="8"
              placeholder="••••"
              :class="{ 'is-invalid': changePinForm.errors.pin }"
            />
            <div v-if="changePinForm.errors.pin" class="invalid-feedback d-block">{{ changePinForm.errors.pin }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">PIN bestätigen</label>
            <BFormInput
              v-model="changePinForm.pin_confirmation"
              type="password"
              inputmode="numeric"
              maxlength="8"
              placeholder="••••"
              :class="{ 'is-invalid': changePinForm.errors.pin_confirmation }"
            />
            <div v-if="changePinForm.errors.pin_confirmation" class="invalid-feedback d-block">{{ changePinForm.errors.pin_confirmation }}</div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <BButton type="button" variant="secondary" @click="showChangePinModal = false">Abbrechen</BButton>
            <BButton type="submit" variant="primary" :disabled="changePinForm.processing">PIN ändern</BButton>
          </div>
        </BForm>
      </BModal>

      <BModal v-model="showDisablePinModal" title="PIN deaktivieren" hide-footer @hidden="disablePinForm.reset()">
        <BForm @submit.prevent="submitDisablePin">
          <div class="mb-3">
            <label class="form-label">Aktuelles Passwort</label>
            <BFormInput
              v-model="disablePinForm.current_password"
              type="password"
              autocomplete="current-password"
              :class="{ 'is-invalid': disablePinForm.errors.current_password }"
            />
            <div v-if="disablePinForm.errors.current_password" class="invalid-feedback d-block">{{ disablePinForm.errors.current_password }}</div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <BButton type="button" variant="secondary" @click="showDisablePinModal = false">Abbrechen</BButton>
            <BButton type="submit" variant="danger" :disabled="disablePinForm.processing">PIN deaktivieren</BButton>
          </div>
        </BForm>
      </BModal>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BForm,
  BFormInput,
  BFormSelect,
  BModal,
} from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

const page = usePage()
const user = computed(
  () =>
    (page.props.auth as { user?: { has_pin?: boolean; inactivity_lock_minutes?: number } })?.user,
)
const hasPin = computed(() => Boolean(user.value?.has_pin))
const inactivityLockMinutes = computed(() => Number(user.value?.inactivity_lock_minutes ?? 0))

const inactivityForm = useForm({
  inactivity_lock_minutes: inactivityLockMinutes.value,
})

const showEnablePinModal = ref(false)
const showChangePinModal = ref(false)
const showDisablePinModal = ref(false)

const enablePinForm = useForm({
  current_password: '',
  pin: '',
  pin_confirmation: '',
})

const changePinForm = useForm({
  current_password: '',
  pin: '',
  pin_confirmation: '',
})

const disablePinForm = useForm({
  current_password: '',
})

const inactivityOptions = [
  { value: 0, label: 'Aus' },
  { value: 5, label: '5 Minuten' },
  { value: 10, label: '10 Minuten' },
  { value: 15, label: '15 Minuten' },
  { value: 30, label: '30 Minuten' },
  { value: 60, label: '60 Minuten' },
]

function submitInactivity() {
  inactivityForm.patch('/settings/security', { preserveScroll: true })
}

function submitEnablePin() {
  enablePinForm.post('/settings/security/pin', {
    preserveScroll: true,
    onSuccess: () => {
      showEnablePinModal.value = false
      enablePinForm.reset()
    },
  })
}

function submitChangePin() {
  changePinForm.put('/settings/security/pin', {
    preserveScroll: true,
    onSuccess: () => {
      showChangePinModal.value = false
      changePinForm.reset()
    },
  })
}

function submitDisablePin() {
  disablePinForm.delete('/settings/security/pin', {
    preserveScroll: true,
    onSuccess: () => {
      showDisablePinModal.value = false
      disablePinForm.reset()
    },
  })
}
</script>
