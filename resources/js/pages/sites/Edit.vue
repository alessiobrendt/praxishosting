<template>
  <DefaultLayout>
    <Head :title="`Bearbeiten: ${site?.name ?? ''}`" />
    <PageBreadcrumb
      title="Bearbeiten"
      :subtitle="site?.name ?? 'Site'"
      :subtitle-url="site ? `/sites/${site.uuid}` : '/sites'"
    />

    <div v-if="!site" class="text-muted">Lade …</div>

    <template v-else>
      <div class="mb-4">
        <h4 class="mb-1">Inhalt bearbeiten</h4>
        <p class="text-muted mb-0">{{ site.name }}</p>
      </div>

      <BCard no-body class="mb-4">
        <BCardHeader>
          <h5 class="mb-0">Name</h5>
          <p class="text-muted small mb-0">Name der Praxis / Site</p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label" for="name">Name</label>
              <BFormInput
                id="name"
                v-model="form.name"
                name="name"
                :class="{ 'is-invalid': form.errors.name }"
              />
              <div v-if="form.errors.name" class="invalid-feedback d-block">{{ form.errors.name }}</div>
            </div>
            <div class="d-flex gap-2">
              <BButton type="submit" variant="primary" :disabled="form.processing">Speichern</BButton>
              <Link :href="`/sites/${site.uuid}`" class="btn btn-outline-secondary">Abbrechen</Link>
              <Link v-if="site.has_page_designer" :href="`/sites/${site.uuid}/design`" class="btn btn-outline-primary ms-auto">
                <Icon icon="layout" class="me-1" />
                Page Designer
              </Link>
            </div>
          </BForm>
        </BCardBody>
      </BCard>

      <Link href="/sites" class="btn btn-outline-secondary">Zurück zur Übersicht</Link>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { BButton, BCard, BCardBody, BCardHeader, BForm, BFormInput } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'
import Icon from '@/components/wrappers/Icon.vue'

type Site = {
  uuid: string
  name: string
  slug: string
  has_page_designer?: boolean
  template: { name: string; slug: string }
}

const props = defineProps<{
  site: Site | null
}>()

const form = useForm({
  name: props.site?.name ?? '',
})

function submit() {
  if (!props.site) return
  form.put(`/sites/${props.site.uuid}`)
}
</script>
