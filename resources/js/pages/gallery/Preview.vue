<template>
  <DefaultLayout>
    <Head :title="`Vorschau: ${template.name}`" />
    <PageBreadcrumb :title="template.name" subtitle="Template-Galerie" subtitle-url="/gallery" />

    <div
      class="site-preview"
      :style="cssVars"
    >
      <div class="mb-4">
        <h4 class="mb-1">Vorschau: {{ template.name }}</h4>
        <p class="text-muted mb-0">
          Template-Vorschau. Die Sektionen (Hero, About, etc.) werden hier angezeigt, sobald die entsprechenden Komponenten eingebunden sind.
        </p>
      </div>
      <BCard no-body class="bg-light">
        <BCardBody class="text-center py-5">
          <Icon icon="layout-template" class="fs-1 text-muted opacity-50" />
          <p class="text-muted mt-2 mb-0">Template „{{ template.name }}“ – Vorschau-Inhalt wird geladen.</p>
          <Link href="/gallery" class="btn btn-outline-secondary mt-3">Zur Galerie</Link>
        </BCardBody>
      </BCard>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { BCard, BCardBody } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type Template = {
  id: number
  name: string
  slug: string
  colors: Record<string, string> | null
  page_data: Record<string, unknown> | null
  pages?: Array<{ id: number; name: string; slug: string; order: number; data: Record<string, unknown> | null }>
}

const props = defineProps<{ template: Template }>()

const colors = computed(() => props.template.colors ?? {})
const cssVars = computed(() => ({
  '--primary': colors.value.primary,
  '--primary-hover': colors.value.primaryHover,
  '--primary-light': colors.value.primaryLight,
  '--primary-dark': colors.value.primaryDark,
  '--secondary': colors.value.secondary,
  '--tertiary': colors.value.tertiary,
  '--quaternary': colors.value.quaternary,
  '--quinary': colors.value.quinary,
}))
</script>
