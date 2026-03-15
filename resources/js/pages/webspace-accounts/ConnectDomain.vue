<template>
  <DefaultLayout>
    <Head title="Domain verbinden" />
    <PageBreadcrumb
      title="Domain verbinden"
      :subtitle="webspaceAccount?.name || webspaceAccount?.domain"
      :subtitle-url="webspaceShowUrl"
    />

    <div class="mb-4">
      <Link :href="webspaceShowUrl" class="btn btn-outline-secondary btn-sm mb-2">
        <Icon icon="arrow-left" class="me-1" />
        Zurück
      </Link>
      <h4 class="mb-1">Domain verbinden</h4>
      <p class="text-muted small mb-0">{{ webspaceAccount?.name || webspaceAccount?.domain }}</p>
    </div>

    <BRow>
      <BCol lg="10">
        <BCard no-body>
          <BCardBody>
            <p class="text-muted small mb-4">
              Wählen Sie die Domain, die Sie mit diesem Webspace verbinden möchten. Die DNS-Einträge werden
              automatisch aus der Server-Vorlage erzeugt (<code class="rounded bg-light px-1 font-monospace small">meinedomain.de</code>
              wird durch Ihre Domain ersetzt). Mit „DNS-Einträge erstellen“ werden die Einträge bei uns gesetzt.
            </p>
            <p class="text-muted small mb-4">
              Die Nameserver der Domain müssen auf uns zeigen. Sie können die Zone unten prüfen oder kopieren.
            </p>

            <BForm @submit.prevent="form.post(connectDomainConfirmUrl)">
              <div class="mb-4">
                <label class="form-label" for="reseller_domain_uuid">Domain *</label>
                <BFormSelect
                  id="reseller_domain_uuid"
                  v-model="form.reseller_domain_uuid"
                  :options="domainOptions"
                />
                <div v-if="form.errors.reseller_domain_uuid" class="invalid-feedback d-block">{{ form.errors.reseller_domain_uuid }}</div>
              </div>

              <template v-if="selectedDomain">
                <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                  <span class="small fw-medium">Erzeugte Bind-Zone für {{ selectedDomain.domain }}</span>
                  <BButton size="sm" variant="outline-secondary" @click="copyBindZone">
                    <Icon icon="copy" class="me-1" />
                    Kopieren
                  </BButton>
                </div>
                <pre class="border rounded p-3 bg-light small font-monospace overflow-auto mb-4" style="max-height: 400px">{{ displayedZone }}</pre>
              </template>
              <div v-else class="border border-dashed rounded p-4 text-center text-muted small mb-4">
                Bitte wählen Sie oben eine Domain, um die DNS-Zone zu erzeugen.
              </div>

              <div class="d-flex flex-wrap gap-2 border-top pt-3">
                <BButton type="submit" variant="primary" :disabled="!selectedDomain || form.processing">
                  <Icon icon="file-text" class="me-1" />
                  {{ form.processing ? 'Wird erstellt…' : 'DNS-Einträge erstellen' }}
                </BButton>
                <Link :href="webspaceShowUrl" class="btn btn-outline-secondary">Abbrechen</Link>
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
import { BButton, BCard, BCardBody, BCol, BForm, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type WebspaceAccount = { uuid: string; name?: string; domain: string }
type ResellerDomain = { uuid: string; domain: string }

const props = defineProps<{
  webspaceAccount: WebspaceAccount
  bindZoneTemplate: string
  resellerDomains: ResellerDomain[]
  connectDomainConfirmUrl: string
  webspaceShowUrl: string
}>()

const form = useForm({
  reseller_domain_uuid: '',
})

const selectedDomain = computed(() => props.resellerDomains.find((d) => d.uuid === form.reseller_domain_uuid))

const templateDomain = 'meinedomain.de'
const displayedZone = computed(() => {
  const domain = selectedDomain.value?.domain
  if (!domain || !props.bindZoneTemplate) return ''
  const re = new RegExp(templateDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return props.bindZoneTemplate.replace(re, domain)
})

const domainOptions = computed(() => [
  { value: '', text: 'Domain wählen…' },
  ...props.resellerDomains.map((d) => ({ value: d.uuid, text: d.domain })),
])

function copyBindZone() {
  if (!displayedZone.value) return
  navigator.clipboard.writeText(displayedZone.value)
}
</script>
