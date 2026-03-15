<template>
  <DefaultLayout>
    <Head title="Passwort-Einstellungen" />
    <PageBreadcrumb title="Passwort" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Passwort aktualisieren</h4>
        <p class="text-muted mb-0">
          Stellen Sie sicher, dass Ihr Konto ein langes, zufälliges Passwort verwendet, um sicher zu bleiben.
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Passwort ändern</h5>
          <p class="text-muted small mb-0">Geben Sie Ihr aktuelles und neues Passwort ein</p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submit">
            <BRow class="g-3">
              <BCol md="6">
                <label class="form-label">Aktuelles Passwort</label>
                <BFormInput
                  v-model="form.current_password"
                  type="password"
                  name="current_password"
                  autocomplete="current-password"
                  placeholder="Aktuelles Passwort"
                  :class="{ 'is-invalid': form.errors.current_password }"
                />
                <div v-if="form.errors.current_password" class="invalid-feedback d-block">{{ form.errors.current_password }}</div>
              </BCol>
              <BCol xs="12" />
              <BCol md="6">
                <label class="form-label">Neues Passwort</label>
                <BFormInput
                  v-model="form.password"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  placeholder="Neues Passwort"
                  :class="{ 'is-invalid': form.errors.password }"
                />
                <div v-if="form.errors.password" class="invalid-feedback d-block">{{ form.errors.password }}</div>
              </BCol>
              <BCol md="6">
                <label class="form-label">Passwort bestätigen</label>
                <BFormInput
                  v-model="form.password_confirmation"
                  type="password"
                  name="password_confirmation"
                  autocomplete="new-password"
                  placeholder="Passwort bestätigen"
                  :class="{ 'is-invalid': form.errors.password_confirmation }"
                />
                <div v-if="form.errors.password_confirmation" class="invalid-feedback d-block">{{ form.errors.password_confirmation }}</div>
              </BCol>
              <BCol xs="12" class="d-flex align-items-center gap-3">
                <BButton type="submit" variant="primary" :disabled="form.processing" data-test="update-password-button">
                  Passwort speichern
                </BButton>
                <span v-if="form.recentlySuccessful" class="text-success small">Gespeichert.</span>
              </BCol>
            </BRow>
          </BForm>
        </BCardBody>
      </BCard>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BForm,
  BFormInput,
  BRow,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

const form = useForm({
  current_password: '',
  password: '',
  password_confirmation: '',
})

function submit() {
  form.put('/settings/password', {
    preserveScroll: true,
    onSuccess: () => form.reset('password', 'password_confirmation', 'current_password'),
  })
}
</script>
