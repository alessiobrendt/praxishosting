<template>
  <DefaultLayout>
    <Head :title="`Domain bestellen: ${domain}`" />
    <PageBreadcrumb title="Domain bestellen" subtitle="Domains" subtitle-url="/domains" />

    <div class="mb-4">
      <h4 class="mb-1">Domain bestellen</h4>
      <p class="text-muted mb-0">
        {{ domain }} – {{ effectiveTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € (inkl. Registrierung)
      </p>
    </div>

    <BForm @submit.prevent="submit">
      <input v-model="form.domain" type="hidden" />
      <input v-model="form.sale_price" type="hidden" />
      <input v-model="form.tld" type="hidden" />

      <BCard v-if="transfer" no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Auth-Code (EPP-Code) für Domain-Transfer</h5>
          <p class="text-muted small mb-0">
            Der Auth-Code wird von Ihrem bisherigen Registrar bereitgestellt. Ohne diesen Code kann der Transfer nicht durchgeführt werden.
          </p>
        </BCardHeader>
        <BCardBody>
          <div class="mb-3">
            <label class="form-label" for="auth_code">Auth-Code *</label>
            <BFormInput
              id="auth_code"
              v-model="form.auth_code"
              type="text"
              autocomplete="off"
              placeholder="z. B. ABC123XYZ"
              :class="{ 'is-invalid': form.errors.auth_code }"
            />
            <div v-if="form.errors.auth_code" class="invalid-feedback d-block">{{ form.errors.auth_code }}</div>
          </div>
        </BCardBody>
      </BCard>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Kontaktdaten für die Domain-Registrierung</h5>
          <p class="text-muted small mb-0">Diese Daten werden an den Registrar übermittelt (WHOIS).</p>
        </BCardHeader>
        <BCardBody>
          <div class="mb-4">
            <BFormRadio v-model="form.use_profile_contact" :value="true" name="use_profile_contact" class="me-3">Adresse aus meinem Profil verwenden</BFormRadio>
            <BFormRadio v-model="form.use_profile_contact" :value="false" name="use_profile_contact">Andere Kontaktdaten angeben</BFormRadio>
          </div>

          <BRow v-if="!form.use_profile_contact" class="g-3 mb-4">
            <BCol md="6">
              <label class="form-label">Vorname</label>
              <BFormInput v-model="form.contact.firstname" :class="{ 'is-invalid': form.errors['contact.firstname'] }" />
              <div v-if="form.errors['contact.firstname']" class="invalid-feedback d-block">{{ form.errors['contact.firstname'] }}</div>
            </BCol>
            <BCol md="6">
              <label class="form-label">Nachname</label>
              <BFormInput v-model="form.contact.lastname" :class="{ 'is-invalid': form.errors['contact.lastname'] }" />
              <div v-if="form.errors['contact.lastname']" class="invalid-feedback d-block">{{ form.errors['contact.lastname'] }}</div>
            </BCol>
            <BCol xs="12">
              <label class="form-label">Straße</label>
              <BFormInput v-model="form.contact.street" :class="{ 'is-invalid': form.errors['contact.street'] }" />
              <div v-if="form.errors['contact.street']" class="invalid-feedback d-block">{{ form.errors['contact.street'] }}</div>
            </BCol>
            <BCol md="6">
              <label class="form-label">Hausnummer</label>
              <BFormInput v-model="form.contact.number" :class="{ 'is-invalid': form.errors['contact.number'] }" />
              <div v-if="form.errors['contact.number']" class="invalid-feedback d-block">{{ form.errors['contact.number'] }}</div>
            </BCol>
            <BCol md="6">
              <label class="form-label">PLZ</label>
              <BFormInput v-model="form.contact.postcode" :class="{ 'is-invalid': form.errors['contact.postcode'] }" />
              <div v-if="form.errors['contact.postcode']" class="invalid-feedback d-block">{{ form.errors['contact.postcode'] }}</div>
            </BCol>
            <BCol md="6">
              <label class="form-label">Ort</label>
              <BFormInput v-model="form.contact.city" :class="{ 'is-invalid': form.errors['contact.city'] }" />
              <div v-if="form.errors['contact.city']" class="invalid-feedback d-block">{{ form.errors['contact.city'] }}</div>
            </BCol>
            <BCol md="6">
              <label class="form-label">Bundesland / State</label>
              <BFormInput v-model="form.contact.state" placeholder="z. B. Bayern" />
            </BCol>
            <BCol md="6">
              <label class="form-label">Land (ISO 2)</label>
              <BFormInput v-model="form.contact.country" placeholder="DE" />
            </BCol>
            <BCol md="6">
              <label class="form-label">E-Mail</label>
              <BFormInput v-model="form.contact.email" type="email" />
            </BCol>
            <BCol md="6">
              <label class="form-label">Telefon</label>
              <BFormInput v-model="form.contact.phone" />
            </BCol>
            <BCol xs="12">
              <label class="form-label">Firma (optional)</label>
              <BFormInput v-model="form.contact.company" />
            </BCol>
          </BRow>

          <div class="border rounded p-3 bg-light mb-4">
            <h6 class="mb-2">Rechtliches</h6>
            <BFormCheckbox v-model="form.accept_tos" name="accept_tos" :class="{ 'is-invalid': form.errors.accept_tos }">
              Ich habe die
              <a :href="tosUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">AGB</a>
              und
              <a :href="privacyUrl ?? '#'" target="_blank" rel="noopener" class="text-decoration-underline">Datenschutzerklärung</a>
              gelesen und akzeptiere diese.
            </BFormCheckbox>
            <div v-if="form.errors.accept_tos" class="invalid-feedback d-block">{{ form.errors.accept_tos }}</div>
            <BFormCheckbox v-model="form.accept_early_execution" name="accept_early_execution" :class="{ 'is-invalid': form.errors.accept_early_execution }" class="mt-2">
              Ich wünsche die vollständige Ausführung der Dienstleistung vor Fristablauf des Widerrufsrechts gemäß Fernabsatzgesetz.
            </BFormCheckbox>
            <div v-if="form.errors.accept_early_execution" class="invalid-feedback d-block">{{ form.errors.accept_early_execution }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Rabattcode</label>
            <BFormInput v-model="form.discount_code" placeholder="Gutscheincode (optional)" />
          </div>

          <div v-if="canPayWithBalance" class="mb-4">
            <label class="form-label">Zahlungsart</label>
            <div class="d-flex flex-column gap-2">
              <BFormRadio v-model="form.payment_method" value="mollie" name="payment_method">
                Karte, PayPal, SEPA, … (Mollie)
              </BFormRadio>
              <BFormRadio v-model="form.payment_method" value="balance" name="payment_method" :disabled="!canSubmitWithBalance">
                Mit Guthaben bezahlen
                <span v-if="canSubmitWithBalance" class="text-muted small">(Aktuell {{ (customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)</span>
                <span v-else class="text-muted small">– Guthaben reicht nicht aus (mind. {{ (amountRequired ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € nötig)</span>
              </BFormRadio>
            </div>
          </div>

          <BButton type="submit" variant="primary" :disabled="form.processing || !canSubmit">
            {{ form.payment_method === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Weiter zur Zahlung' }}
          </BButton>
        </BCardBody>
      </BCard>
    </BForm>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BForm,
  BFormCheckbox,
  BFormInput,
  BFormRadio,
  BRow,
} from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type Contact = {
  firstname: string
  lastname: string
  street: string
  number: string
  postcode: string
  city: string
  state: string
  country: string
  email: string
  phone: string
  company?: string
}

const props = defineProps<{
  domain: string
  sale_price: number
  tld: string
  transfer?: boolean
  profile_contact: Contact
  canPayWithBalance?: boolean
  customerBalance?: number
  amountRequired?: number
  tosUrl?: string
  privacyUrl?: string
}>()

const effectiveTotal = ref(props.sale_price)

const form = useForm({
  domain: props.domain,
  sale_price: props.sale_price,
  discount_code: '',
  purchase_price: 0,
  tld: props.tld,
  transfer: Boolean(props.transfer),
  auth_code: '',
  use_profile_contact: true,
  payment_method: 'mollie' as 'mollie' | 'balance',
  accept_tos: false,
  accept_early_execution: false,
  contact: {
    firstname: props.profile_contact.firstname,
    lastname: props.profile_contact.lastname,
    street: props.profile_contact.street,
    number: props.profile_contact.number,
    postcode: props.profile_contact.postcode,
    city: props.profile_contact.city,
    state: props.profile_contact.state,
    country: props.profile_contact.country,
    email: props.profile_contact.email,
    phone: props.profile_contact.phone,
    company: props.profile_contact.company ?? '',
  },
})

const canSubmit = computed(() => {
  if (!form.accept_tos || !form.accept_early_execution) return false
  if (props.transfer) return Boolean((form.auth_code ?? '').toString().trim())
  return true
})

const canSubmitWithBalance = computed(() =>
  props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value,
)

watch(() => form.payment_method, (v) => { form.payment_method = v }, { immediate: true })

function submit() {
  form.post('/domains/checkout')
}
</script>
