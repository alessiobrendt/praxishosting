<template>
  <DefaultLayout>
    <Head title="Integration" />
    <PageBreadcrumb title="Integration" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Integration</h4>
        <p class="text-muted mb-0">
          Verbinden Sie externe Dienste mit Ihrem Konto. Sie können Discord später hier verbinden oder trennen.
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Discord</h5>
          <p class="text-muted small mb-0">
            Verbinden Sie Ihr Discord-Konto, um Benachrichtigungen per Direktnachricht zu erhalten und die Kunden-Rolle auf unserem Server zu nutzen.
          </p>
        </BCardHeader>
        <BCardBody>
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
            <div class="d-flex align-items-center gap-2">
              <span
                class="rounded-circle d-inline-block"
                style="width: 0.5rem; height: 0.5rem;"
                :class="discordConnected ? 'bg-success' : 'bg-secondary'"
              />
              <span class="small">
                {{ discordConnected ? 'Discord verbunden' : 'Nicht verbunden' }}
              </span>
            </div>
            <div class="d-flex gap-2">
              <BButton v-if="!discordConnected" :href="discordConnectUrl" variant="primary" as="a">
                Discord verbinden
              </BButton>
              <BButton v-else variant="outline-danger" @click="disconnect">
                Discord trennen
              </BButton>
            </div>
          </div>
        </BCardBody>
      </BCard>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { BButton, BCard, BCardBody, BCardHeader } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

defineProps<{
  discordConnected: boolean
  discordConnectUrl: string
}>()

function disconnect() {
  router.delete('/settings/integration/discord', { preserveScroll: true })
}
</script>
