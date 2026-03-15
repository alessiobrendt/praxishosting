<template>
  <DefaultLayout>
    <Head :title="site?.name ?? 'Site'" />
    <PageBreadcrumb
      :title="site?.name ?? 'Site'"
      subtitle="Meine Sites"
      subtitle-url="/sites"
    />

    <div v-if="!site" class="text-muted">Lade …</div>

    <template v-else>
      <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 class="mb-1">{{ site.name }}</h4>
          <p class="text-muted small mb-0">Template: {{ site.template?.name ?? '–' }}</p>
        </div>
        <div class="d-flex gap-2">
          <Link :href="`/sites/${site.uuid}/edit`" class="btn btn-outline-primary">
            <Icon icon="edit" class="me-2" />
            Inhalt bearbeiten
          </Link>
          <Link v-if="site.has_page_designer" :href="`/sites/${site.uuid}/design`" class="btn btn-outline-secondary">
            <Icon icon="layout" class="me-2" />
            Page Designer
          </Link>
        </div>
      </div>

      <BRow>
        <BCol md="6">
          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0">Site-Informationen</h5>
              <p class="text-muted small mb-0">Slug, Besitzer</p>
            </BCardHeader>
            <BCardBody>
              <p class="mb-2"><span class="text-muted small">Slug</span><br /><code class="bg-light px-2 py-1 rounded">{{ site.slug }}</code></p>
              <p class="mb-0" v-if="site.user"><span class="text-muted small">Besitzer</span><br />{{ site.user.name }}</p>
              <template v-if="primaryDomain">
                <p class="mb-2 mt-3"><span class="text-muted small">Domain</span><br />
                  <a v-if="sitePublicUrl" :href="sitePublicUrl" target="_blank" rel="noopener" class="text-primary">{{ primaryDomain.domain }}</a>
                  <span v-else>{{ primaryDomain.domain }}</span>
                  <BBadge :variant="primaryDomain.is_verified ? 'success' : 'secondary'" class="ms-1">{{ primaryDomain.is_verified ? 'Verifiziert' : 'Nicht verifiziert' }}</BBadge>
                </p>
              </template>
            </BCardBody>
          </BCard>
        </BCol>
        <BCol md="6">
          <BCard no-body class="mb-4">
            <BCardHeader>
              <h5 class="mb-0">Abo & Zahlungsart</h5>
            </BCardHeader>
            <BCardBody>
              <template v-if="site.site_subscription">
                <p class="mb-2">
                  <span class="text-muted small">Abo-Status</span><br />
                  <BBadge v-if="site.site_subscription.mollie_status === 'active' && !site.site_subscription.cancel_at_period_end" variant="success">Aktiv</BBadge>
                  <BBadge v-else-if="site.site_subscription.cancel_at_period_end" variant="warning">Läuft aus</BBadge>
                  <BBadge v-else variant="secondary">{{ site.site_subscription.mollie_status }}</BBadge>
                </p>
                <p class="mb-0 small text-muted">Läuft bis {{ formatDate(site.site_subscription.current_period_ends_at) }}</p>
              </template>
              <p v-else class="text-muted small mb-0">Kein Abo</p>
              <a v-if="billingPortalUrl" :href="billingPortalUrl" class="btn btn-sm btn-outline-primary mt-2">Abrechnung & Zahlungsart</a>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>

      <Link href="/sites" class="btn btn-outline-secondary">Zurück zur Übersicht</Link>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { BBadge, BCard, BCardBody, BCardHeader, BCol, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type User = { id: number; name: string; email: string }
type Domain = { id: number; domain: string; is_primary: boolean; is_verified: boolean; ssl_status?: string | null; ssl_expires_at?: string | null }
type SiteSubscription = { mollie_status: string; current_period_ends_at: string | null; cancel_at_period_end: boolean }

type Site = {
  uuid: string
  name: string
  slug: string
  has_page_designer?: boolean
  template: { name: string; slug: string }
  site_subscription?: SiteSubscription | null
  domains?: Domain[]
  user: User
}

const props = defineProps<{
  site: Site | null
  baseDomain?: string
  billingPortalUrl?: string
}>()

const primaryDomain = computed(() => props.site?.domains?.find((d) => d.is_primary) ?? props.site?.domains?.[0])

const sitePublicUrl = computed(() => {
  if (typeof window === 'undefined' || !primaryDomain.value?.domain) return null
  const protocol = window.location.protocol
  const host = window.location.hostname
  const domain = primaryDomain.value.domain
  if (host.endsWith('.test') && !domain.endsWith('.test')) return `${protocol}//${domain}.test/`
  return `${protocol}//${domain}/`
})

function formatDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('de-DE') : '–'
}
</script>
