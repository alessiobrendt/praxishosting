<template>
  <DefaultLayout>
    <Head title="Erscheinungsbild" />
    <PageBreadcrumb title="Erscheinungsbild" subtitle="Einstellungen" subtitle-url="/settings/profile" />

    <SettingsLayout>
      <div class="mb-4">
        <h4 class="mb-1">Erscheinungsbild</h4>
        <p class="text-muted mb-0">
          Passen Sie das Erscheinungsbild der Anwendung an
        </p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Theme-Einstellungen</h5>
          <p class="text-muted small mb-0">Wählen Sie zwischen Hell, Dunkel und System</p>
        </BCardHeader>
        <BCardBody>
          <AppearanceTabs />
        </BCardBody>
      </BCard>
    </SettingsLayout>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { BCard, BCardBody, BCardHeader } from 'bootstrap-vue-next'
import AppearanceTabs from '@/components/AppearanceTabs.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsLayout from '@/layouts/settings/Layout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
</script>
