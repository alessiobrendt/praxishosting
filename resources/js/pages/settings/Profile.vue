<template>
  <DefaultLayout>
    <Head title="Profil" />
    <PageBreadcrumb title="Profil" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Profilinformationen</h4>
        <p class="text-muted mb-0">
          Aktualisieren Sie Ihren Namen, Ihre E-Mail-Adresse und Ihre Rechnungsadresse
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Persönliche Daten</h5>
          <p class="text-muted small mb-0">Ihre Kontoinformationen</p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submit">
            <BRow class="g-3">
              <BCol md="6">
                <label class="form-label">Name <span class="text-danger">*</span></label>
                <BFormInput
                  v-model="form.name"
                  name="name"
                  required
                  autocomplete="name"
                  placeholder="Vollständiger Name"
                  :class="{ 'is-invalid': form.errors.name }"
                />
                <div v-if="form.errors.name" class="invalid-feedback d-block">{{ form.errors.name }}</div>
              </BCol>
              <BCol md="6">
                <label class="form-label">E-Mail <span class="text-danger">*</span></label>
                <BFormInput
                  v-model="form.email"
                  type="email"
                  name="email"
                  required
                  autocomplete="username"
                  placeholder="E-Mail-Adresse"
                  :class="{ 'is-invalid': form.errors.email }"
                />
                <div v-if="form.errors.email" class="invalid-feedback d-block">{{ form.errors.email }}</div>
              </BCol>
              <BCol md="6">
                <label class="form-label">Unternehmen (optional)</label>
                <BFormInput v-model="form.company" name="company" autocomplete="organization" placeholder="Firma / Unternehmen" :class="{ 'is-invalid': form.errors.company }" />
                <div v-if="form.errors.company" class="invalid-feedback d-block">{{ form.errors.company }}</div>
              </BCol>
              <BCol md="6">
                <label class="form-label">Telefonnummer</label>
                <BFormInput v-model="form.phone" name="phone" type="tel" autocomplete="tel" placeholder="z. B. +49 123 456789" :class="{ 'is-invalid': form.errors.phone }" />
                <div v-if="form.errors.phone" class="invalid-feedback d-block">{{ form.errors.phone }}</div>
                <BFormText class="text-muted small">
                  Wird u. a. für Domain-Registrierung (WHOIS) benötigt. Format z. B. +49.123456789.
                </BFormText>
              </BCol>
              <BCol xs="12">
                <BAlert variant="info" show class="small mb-0">
                  Für Rechnungen und den Abschluss von Bestellungen benötigen wir Ihre vollständige Rechnungsadresse (Straße, PLZ, Ort, Land).
                </BAlert>
              </BCol>
              <BCol xs="12">
                <label class="form-label">Straße und Hausnummer</label>
                <BFormInput v-model="form.street" name="street" autocomplete="street-address" placeholder="Musterstraße 1" :class="{ 'is-invalid': form.errors.street }" />
                <div v-if="form.errors.street" class="invalid-feedback d-block">{{ form.errors.street }}</div>
              </BCol>
              <BCol md="4">
                <label class="form-label">PLZ</label>
                <BFormInput v-model="form.postal_code" name="postal_code" autocomplete="postal-code" placeholder="12345" :class="{ 'is-invalid': form.errors.postal_code }" />
                <div v-if="form.errors.postal_code" class="invalid-feedback d-block">{{ form.errors.postal_code }}</div>
              </BCol>
              <BCol md="4">
                <label class="form-label">Ort</label>
                <BFormInput v-model="form.city" name="city" autocomplete="address-level2" placeholder="Stadt" :class="{ 'is-invalid': form.errors.city }" />
                <div v-if="form.errors.city" class="invalid-feedback d-block">{{ form.errors.city }}</div>
              </BCol>
              <BCol md="4">
                <label class="form-label">Bundesland / State</label>
                <BFormInput v-model="form.state" name="state" autocomplete="address-level1" placeholder="z. B. Bayern oder BY" :class="{ 'is-invalid': form.errors.state }" />
                <div v-if="form.errors.state" class="invalid-feedback d-block">{{ form.errors.state }}</div>
                <BFormText class="text-muted small">
                  Erforderlich für Domain-Registrierung (WHOIS).
                </BFormText>
              </BCol>
              <BCol xs="12">
                <label class="form-label">Land</label>
                <BFormSelect v-model="form.country" name="country" autocomplete="country-code" :class="{ 'is-invalid': form.errors.country }">
                  <option value="">Bitte wählen</option>
                  <option v-for="c in countriesSortedByName" :key="c.code" :value="c.code">
                    {{ c.name }}
                  </option>
                </BFormSelect>
                <div v-if="form.errors.country" class="invalid-feedback d-block">{{ form.errors.country }}</div>
              </BCol>
              <BCol v-if="isAdmin" xs="12" class="border-top pt-3">
                <label class="form-label">Signatur für Support-Tickets</label>
                <BFormTextarea
                  v-model="form.ticket_signature"
                  name="ticket_signature"
                  placeholder="Wird automatisch unter jeder Ihrer Ticket-Antworten eingefügt."
                  rows="4"
                  :class="{ 'is-invalid': form.errors.ticket_signature }"
                />
                <div v-if="form.errors.ticket_signature" class="invalid-feedback d-block">{{ form.errors.ticket_signature }}</div>
                <BFormText class="text-muted small">
                  Nur für Mitarbeiter sichtbar. Wird unter jeder Ihrer Antworten im Support-Ticket-System angehängt.
                </BFormText>
              </BCol>
              <BCol xs="12">
                <BAlert v-if="mustVerifyEmail && !(authUser?.email_verified_at)" variant="warning" show>
                  Ihre E-Mail-Adresse ist nicht verifiziert.
                  <Link href="/email/verification-notification" method="post" as="button" class="alert-link">Verifizierungs-E-Mail erneut senden</Link>
                </BAlert>
                <BAlert v-if="status === 'verification-link-sent'" variant="success" show>
                  Ein neuer Verifizierungslink wurde an Ihre E-Mail-Adresse gesendet.
                </BAlert>
              </BCol>
              <BCol xs="12" class="d-flex align-items-center gap-3">
                <BButton type="submit" variant="primary" :disabled="form.processing" data-test="update-profile-button">
                  Speichern
                </BButton>
                <span v-if="form.recentlySuccessful" class="text-success small">Gespeichert.</span>
              </BCol>
            </BRow>
          </BForm>
        </BCardBody>
      </BCard>

      <DeleteUser />
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import {
  BAlert,
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BForm,
  BFormInput,
  BFormSelect,
  BFormText,
  BFormTextarea,
  BRow,
} from 'bootstrap-vue-next'
import DeleteUser from '@/components/DeleteUser.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import { countriesSortedByName } from '@/lib/countries'

defineProps<{
  mustVerifyEmail?: boolean
  status?: string
}>()

const page = usePage()
const authUser = (page.props.auth as { user?: Record<string, unknown> & { is_admin?: boolean } })?.user
const isAdmin = computed(() => authUser?.is_admin === true)

const form = useForm({
  name: (authUser?.name as string) ?? '',
  email: (authUser?.email as string) ?? '',
  company: (authUser?.company as string) ?? '',
  phone: (authUser?.phone as string) ?? '',
  street: (authUser?.street as string) ?? '',
  postal_code: (authUser?.postal_code as string) ?? '',
  city: (authUser?.city as string) ?? '',
  state: (authUser?.state as string) ?? '',
  country: (authUser?.country as string) ?? '',
  ticket_signature: (authUser?.ticket_signature as string) ?? '',
})

function submit() {
  form.patch('/settings/profile')
}
</script>
