<template>
  <DefaultLayout>
    <Head title="Weiterleitung zur Zahlung" />
    <PageBreadcrumb title="Weiterleitung" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="d-flex min-vh-50 flex-column align-items-center justify-content-center gap-3 py-5">
      <BSpinner variant="primary" style="width: 3rem; height: 3rem;" />
      <p class="text-muted mb-0">Weiterleitung zur Zahlung…</p>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { onMounted } from 'vue'
import { BSpinner } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

const props = defineProps<{ redirectUrl: string }>()

onMounted(() => {
  if (props.redirectUrl && props.redirectUrl.startsWith('https://')) {
    window.location.href = props.redirectUrl
  }
})
</script>
