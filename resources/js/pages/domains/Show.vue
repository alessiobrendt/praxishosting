<template>
  <DefaultLayout>
    <Head :title="`Domain: ${domain.domain}`" />
    <PageBreadcrumb :title="domain.domain" subtitle="Meine Domains" :subtitle-url="domains_index_url" />

    <div class="row g-4">
      <aside class="col-lg-3">
        <BCard no-body>
          <BCardBody class="text-center border-bottom">
            <Icon icon="server" class="fs-1 text-muted" />
            <h5 class="mt-2 mb-0">Domain</h5>
            <p class="text-muted small mb-3">{{ domain.domain }}</p>
            <BBadge variant="success">Aktiv</BBadge>
          </BCardBody>
          <BCardBody>
            <div class="d-grid gap-2">
              <BButton variant="outline-danger" size="sm" class="text-start" @click="openNameserverDialog">
                <Icon icon="pencil" class="me-2" />
                Nameserver ändern
              </BButton>
              <BButton variant="outline-secondary" size="sm" class="text-start" @click="openDnssecDialog">
                <Icon icon="shield-check" class="me-2" />
                DNSSEC verwalten
              </BButton>
              <BButton v-if="domain.renew_price != null" variant="outline-primary" size="sm" class="text-start" @click="renewDialogOpen = true">
                Verlängern
              </BButton>
            </div>
          </BCardBody>
        </BCard>
      </aside>
      <div class="col-lg-9">
        <BNav tabs class="mb-3">
          <BNavItem :active="activeTab === 'overview'" @click="activeTab = 'overview'">Übersicht</BNavItem>
          <BNavItem :active="activeTab === 'dns'" @click="activeTab = 'dns'; loadDnsRecords()">DNS Manager</BNavItem>
          <BNavItem :active="activeTab === 'contact'" @click="activeTab = 'contact'; loadContact()">Kontakt</BNavItem>
          <BNavItem :active="activeTab === 'whois'" @click="activeTab = 'whois'; loadWhoisLookup()">Whois Privacy</BNavItem>
          <BNavItem v-if="canManageCollaborators" :active="activeTab === 'sharing'" @click="activeTab = 'sharing'">Teilen</BNavItem>
        </BNav>

        <BCard v-show="activeTab === 'overview'" no-body>
          <BCardBody>
            <BTable :items="overviewRows" :fields="[{ key: 'label', label: '' }, { key: 'value', label: '' }]" small>
              <template #cell(value)="{ item }">
                <span v-if="item.key === 'authcode'">
                  <BButton size="sm" variant="outline-secondary" @click="fetchAuthcode">Authcode anzeigen</BButton>
                </span>
                <template v-else>{{ item.value }}</template>
              </template>
            </BTable>
          </BCardBody>
        </BCard>

        <BCard v-show="activeTab === 'dns'" no-body>
          <BCardBody>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">DNS-Einträge</h6>
              <BButton size="sm" @click="loadDnsRecords" :disabled="dnsLoading">Einträge laden</BButton>
            </div>
            <p v-if="dnsError" class="text-danger small">{{ dnsError }}</p>
            <BTable v-else :items="dnsRecords" :fields="[{ key: 'type', label: 'Typ' }, { key: 'name', label: 'Name' }, { key: 'data', label: 'Inhalt' }]" small responsive />
          </BCardBody>
        </BCard>

        <BCard v-show="activeTab === 'contact'" no-body>
          <BCardBody>
            <p v-if="contactError" class="text-danger small">{{ contactError }}</p>
            <BForm v-else @submit.prevent="submitContact" class="row g-3">
              <BCol md="6"><label class="form-label">Firma</label><BFormInput v-model="contactForm.company" /></BCol>
              <BCol md="6"><label class="form-label">Vorname</label><BFormInput v-model="contactForm.firstname" /></BCol>
              <BCol md="6"><label class="form-label">Nachname</label><BFormInput v-model="contactForm.lastname" /></BCol>
              <BCol md="6"><label class="form-label">Straße</label><BFormInput v-model="contactForm.street" /></BCol>
              <BCol md="6"><label class="form-label">Hausnr.</label><BFormInput v-model="contactForm.number" /></BCol>
              <BCol md="6"><label class="form-label">PLZ</label><BFormInput v-model="contactForm.postcode" /></BCol>
              <BCol md="6"><label class="form-label">Ort</label><BFormInput v-model="contactForm.city" /></BCol>
              <BCol md="6"><label class="form-label">Bundesland</label><BFormInput v-model="contactForm.state" /></BCol>
              <BCol md="6"><label class="form-label">Land</label><BFormSelect v-model="contactForm.country" :options="countriesSortedByName" value-field="code" text-field="name" /></BCol>
              <BCol md="6"><label class="form-label">E-Mail</label><BFormInput v-model="contactForm.email" type="email" /></BCol>
              <BCol md="6"><label class="form-label">Telefon</label><BFormInput v-model="contactForm.phone" /></BCol>
              <BCol xs="12"><BButton type="submit" size="sm">Kontakt speichern</BButton></BCol>
            </BForm>
          </BCardBody>
        </BCard>

        <BCard v-show="activeTab === 'whois'" no-body>
          <BCardBody>
            <p v-if="whoisError" class="text-danger small">{{ whoisError }}</p>
            <div v-else class="mb-3">
              <pre class="bg-light p-3 rounded small overflow-auto" style="max-height: 400px;">{{ whoisResult || 'Whois wird geladen…' }}</pre>
            </div>
          </BCardBody>
        </BCard>

        <BCard v-show="activeTab === 'sharing' && canManageCollaborators" no-body>
          <BCardBody>
            <p class="text-muted small">Produktfreigaben und Einladungen können hier verwaltet werden.</p>
          </BCardBody>
        </BCard>
      </div>
    </div>

    <BModal v-model="authcodeDialogOpen" title="Authcode" hide-footer>
      <BSpinner v-if="authcodeLoading" />
      <p v-else-if="authcodeError" class="text-danger">{{ authcodeError }}</p>
      <code v-else class="d-block p-2 bg-light rounded">{{ authcodeValue || '–' }}</code>
    </BModal>

    <BModal v-model="nameserverDialogOpen" title="Nameserver ändern" hide-footer>
      <BForm @submit.prevent="submitNameserver">
        <div v-for="(ns, idx) in nameserverForm.nameservers" :key="idx" class="mb-2 d-flex gap-2">
          <BFormInput v-model="nameserverForm.nameservers[idx]" :placeholder="`Nameserver ${idx + 1}`" />
          <BButton v-if="nameserverForm.nameservers.length > 2" type="button" variant="outline-danger" size="sm" @click="removeNameserverSlot(idx)">×</BButton>
        </div>
        <BButton v-if="nameserverForm.nameservers.length < 6" type="button" variant="outline-secondary" size="sm" class="mb-2" @click="addNameserverSlot">+ Nameserver</BButton>
        <div v-if="nameserverForm.errors.nameservers" class="invalid-feedback d-block">{{ nameserverForm.errors.nameservers }}</div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <BButton type="button" variant="secondary" @click="nameserverDialogOpen = false">Abbrechen</BButton>
          <BButton type="submit" :disabled="nameserverForm.processing">Speichern</BButton>
        </div>
      </BForm>
    </BModal>

    <BModal v-model="renewDialogOpen" title="Domain verlängern" hide-footer>
      <p>Verlängerung für <strong>{{ domain.renew_price }} €</strong> pro Jahr.</p>
      <BButton variant="primary" class="w-100" @click="renew">Kostenpflichtig verlängern</BButton>
    </BModal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import {
  BButton,
  BCard,
  BCardBody,
  BCol,
  BForm,
  BFormInput,
  BFormSelect,
  BNav,
  BNavItem,
  BModal,
  BSpinner,
  BTable,
  BBadge,
} from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import { countriesSortedByName } from '@/lib/countries'

const props = withDefaults(
  defineProps<{
    domain: { uuid: string; domain: string; status: string; expires_at: string | null; auto_renew: boolean; nameservers: string[]; renew_price: number | null }
    domains_index_url: string
    canManageCollaborators?: boolean
  }>(),
  { canManageCollaborators: false },
)

const baseUrl = () => `/domains/${props.domain.uuid}`
const activeTab = ref('overview')

const overviewRows = computed(() => [
  { key: 'domain', label: 'Domain', value: props.domain.domain },
  { key: 'authcode', label: 'Authcode', value: '' },
  { key: 'status', label: 'Registry Status', value: 'OK' },
  { key: 'dns', label: 'DNS Status', value: 'Aktiv' },
])

const nameserverDialogOpen = ref(false)
const nameserverForm = useForm({
  nameservers: props.domain.nameservers?.length ? [...props.domain.nameservers] : ['', ''],
})
const DEFAULT_NS = ['nameserver01.eu', 'nameserver02.eu', 'nameserver03.eu', 'nameserver04.eu', 'nameserver05.eu', 'nameserver06.eu']
function openNameserverDialog() {
  nameserverForm.nameservers = props.domain.nameservers?.length ? [...props.domain.nameservers] : ['', '']
  if (nameserverForm.nameservers.length < 2) {
    while (nameserverForm.nameservers.length < 2) nameserverForm.nameservers.push('')
  }
  nameserverDialogOpen.value = true
}
function addNameserverSlot() {
  if (nameserverForm.nameservers.length < 6) nameserverForm.nameservers.push('')
}
function removeNameserverSlot(index: number) {
  if (nameserverForm.nameservers.length > 2) nameserverForm.nameservers.splice(index, 1)
}
function submitNameserver() {
  const ns = nameserverForm.nameservers.filter(Boolean)
  if (ns.length < 2 || ns.length > 6) {
    nameserverForm.setError('nameservers', 'Es sind 2 bis 6 Nameserver erforderlich.')
    return
  }
  nameserverForm.nameservers = ns
  nameserverForm.put(`${baseUrl()}/nameserver`, { preserveScroll: true, onSuccess: () => { nameserverDialogOpen.value = false } })
}

const authcodeDialogOpen = ref(false)
const authcodeValue = ref('')
const authcodeLoading = ref(false)
const authcodeError = ref('')
function fetchAuthcode() {
  authcodeLoading.value = true
  authcodeError.value = ''
  authcodeValue.value = ''
  authcodeDialogOpen.value = true
  fetch(`${baseUrl()}/authcode`)
    .then((r) => r.json())
    .then((data) => {
      if (data.error) authcodeError.value = data.error
      else authcodeValue.value = data.authcode ?? ''
    })
    .catch(() => { authcodeError.value = 'Fehler beim Laden' })
    .finally(() => { authcodeLoading.value = false })
}

const dnssecDialogOpen = ref(false)

const renewDialogOpen = ref(false)
function renew() {
  renewDialogOpen.value = false
  router.post(`${baseUrl()}/renew`)
}

const dnsRecords = ref<{ name: string; type: string; data: string }[]>([])
const dnsLoading = ref(false)
const dnsError = ref('')
function loadDnsRecords() {
  dnsLoading.value = true
  dnsError.value = ''
  fetch(`${baseUrl()}/dns`)
    .then((r) => r.json())
    .then((data) => {
      if (data.error) dnsError.value = data.error
      else dnsRecords.value = (data.records ?? []).map((r: { name: string; type: string; data: string }) => ({ name: r.name, type: r.type, data: r.data }))
    })
    .catch(() => { dnsError.value = 'Fehler beim Laden' })
    .finally(() => { dnsLoading.value = false })
}

const contactForm = useForm({
  company: '', firstname: '', lastname: '', street: '', number: '', postcode: '', city: '', state: '', country: 'DE', email: '', phone: '',
})
const contactError = ref('')
const contactLoadedOnce = ref(false)
function loadContact() {
  if (contactLoadedOnce.value) return
  fetch(`${baseUrl()}/contact`)
    .then((r) => r.json())
    .then((data) => {
      if (data.error) contactError.value = data.error
      else {
        const c = data.contact ?? {}
        contactForm.company = c.company ?? ''
        contactForm.firstname = c.firstname ?? ''
        contactForm.lastname = c.lastname ?? ''
        contactForm.street = c.street ?? ''
        contactForm.number = c.number ?? ''
        contactForm.postcode = c.postcode ?? ''
        contactForm.city = c.city ?? ''
        contactForm.state = c.state ?? ''
        contactForm.country = c.country ?? 'DE'
        contactForm.email = c.email ?? ''
        contactForm.phone = c.phone ?? ''
        contactLoadedOnce.value = true
      }
    })
    .catch(() => { contactError.value = 'Fehler' })
}
function submitContact() {
  router.put(`${baseUrl()}/contact`, {
    contact: {
      company: contactForm.company, firstname: contactForm.firstname, lastname: contactForm.lastname,
      street: contactForm.street, number: contactForm.number, postcode: contactForm.postcode,
      city: contactForm.city, state: contactForm.state, country: contactForm.country,
      email: contactForm.email, phone: contactForm.phone,
    },
  }, { preserveScroll: true })
}

const whoisResult = ref('')
const whoisLoading = ref(false)
const whoisError = ref('')
function loadWhoisLookup() {
  whoisLoading.value = true
  whoisResult.value = ''
  fetch(`${baseUrl()}/whois`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => {
      if (data.error) whoisResult.value = data.error
      else whoisResult.value = data.whois ?? ''
    })
    .catch(() => { whoisResult.value = 'Whois-Abfrage fehlgeschlagen.' })
    .finally(() => { whoisLoading.value = false })
}

</script>
