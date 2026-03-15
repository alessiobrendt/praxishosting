<template>
  <DefaultLayout>
    <Head title="Domain verbinden" />
    <PageBreadcrumb
      title="Domain verbinden"
      :subtitle="teamSpeakServerAccount?.name ?? 'TeamSpeak Server'"
      :subtitle-url="teamSpeakShowUrl"
    />

    <div class="mb-4">
      <Link :href="teamSpeakShowUrl" class="btn btn-outline-secondary btn-sm mb-2">
        <Icon icon="arrow-left" class="me-1" />
        Zurück
      </Link>
      <h4 class="mb-1">Domain verbinden</h4>
      <p class="text-muted small mb-0">{{ teamSpeakServerAccount?.name }}</p>
    </div>

    <BRow>
      <BCol lg="8">
        <BCard no-body>
          <BCardBody>
            <p class="text-muted small mb-4">
              Wählen Sie eine Ihrer gekauften Domains und eine Subdomain (z. B. „ts3“ für ts3.ihredomain.de).
              Der DNS-SRV-Eintrag wird automatisch gesetzt und zeigt auf Ihren TeamSpeak-Server.
            </p>
            <p class="text-muted small mb-4">
              Die Nameserver der Domain müssen auf uns zeigen, damit die Einträge wirksam werden.
            </p>

            <BForm @submit.prevent="form.post(connectDomainUrl)">
              <div class="mb-3">
                <label class="form-label" for="reseller_domain_uuid">Domain *</label>
                <BFormSelect
                  id="reseller_domain_uuid"
                  v-model="form.reseller_domain_uuid"
                  name="reseller_domain_uuid"
                  required
                  :options="domainOptions"
                />
                <div v-if="form.errors.reseller_domain_uuid" class="invalid-feedback d-block">{{ form.errors.reseller_domain_uuid }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="subdomain">Subdomain (z. B. ts3 für ts3.ihredomain.de)</label>
                <BFormInput
                  id="subdomain"
                  v-model="form.subdomain"
                  name="subdomain"
                  type="text"
                  placeholder="ts3"
                  maxlength="63"
                />
                <div v-if="form.errors.subdomain" class="invalid-feedback d-block">{{ form.errors.subdomain }}</div>
              </div>
              <div v-if="previewHost" class="alert alert-secondary small mb-4">
                <Icon icon="globe" class="me-1" />
                {{ previewHost }} zeigt nach dem Verbinden auf Ihren TeamSpeak-Server.
              </div>
              <div class="d-flex gap-2">
                <BButton type="submit" variant="primary" :disabled="!form.reseller_domain_uuid || !(form.subdomain || '').trim() || form.processing">
                  {{ form.processing ? 'Wird verbunden…' : 'Verbinden' }}
                </BButton>
                <Link :href="teamSpeakShowUrl" class="btn btn-outline-secondary">Abbrechen</Link>
              </div>
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed } from 'vue'
import { BButton, BCard, BCardBody, BCol, BForm, BFormInput, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type TeamSpeakServerAccount = { uuid: string; name: string }
type ResellerDomain = { uuid: string; domain: string }

const props = defineProps<{
  teamSpeakServerAccount: TeamSpeakServerAccount
  resellerDomains: ResellerDomain[]
  connectDomainUrl: string
  teamSpeakShowUrl: string
}>()

const form = useForm({
  reseller_domain_uuid: '',
  subdomain: 'ts3',
})

const domainOptions = computed(() => [
  { value: '', text: 'Domain wählen…' },
  ...props.resellerDomains.map((d) => ({ value: d.uuid, text: d.domain })),
])

const selectedDomain = computed(() => props.resellerDomains.find((d) => d.uuid === form.reseller_domain_uuid))
const previewHost = computed(() => {
  const sub = (form.subdomain || 'ts3').trim() || 'ts3'
  const dom = selectedDomain.value?.domain ?? ''
  return dom ? `${sub}.${dom}` : ''
})
</script>
