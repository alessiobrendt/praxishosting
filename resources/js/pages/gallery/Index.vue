<template>
  <DefaultLayout>
    <Head title="Template-Galerie" />
    <PageBreadcrumb title="Website-Templates" subtitle="Dashboard" subtitle-url="/dashboard" />

    <div class="mb-4">
      <h4 class="mb-1">Website-Templates</h4>
      <p class="text-muted mb-0">
        Wählen Sie ein Template für Ihre Webseite
      </p>
    </div>

    <div class="row g-4">
      <div v-for="template in templates" :key="template.id" class="col-sm-6 col-lg-4">
        <Link :href="`/gallery/preview/${template.id}`" class="text-decoration-none text-body d-block h-100">
          <BCard no-body class="h-100 overflow-hidden">
            <div class="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center overflow-hidden">
              <img
                v-if="template.preview_image"
                :src="template.preview_image"
                :alt="template.name"
                class="img-fluid object-fit-cover"
              />
              <div v-else class="text-center text-muted py-4">
                <Icon icon="photo" class="fs-1 opacity-50" />
                <p class="small mb-0 mt-2">Kein Vorschaubild</p>
              </div>
            </div>
            <BCardBody class="d-flex align-items-center justify-content-between">
              <h5 class="mb-0">{{ template.name }}</h5>
              <BBadge variant="primary">{{ template.price }} €</BBadge>
            </BCardBody>
          </BCard>
        </Link>
      </div>
    </div>

    <p v-if="templates.length === 0" class="text-center text-muted py-5">
      Keine Templates verfügbar
    </p>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { BBadge, BCard, BCardBody } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type Template = {
  id: number
  name: string
  slug: string
  preview_image: string | null
  price: string
}

defineProps<{ templates: Template[] }>()
</script>
