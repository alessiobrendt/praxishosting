<template>
  <DefaultLayout>
    <Head title="Neue Site erstellen" />
    <PageBreadcrumb title="Neue Site erstellen" subtitle="Meine Sites" subtitle-url="/sites" />

    <div class="mb-4">
      <h4 class="mb-1">Neue Site erstellen</h4>
      <p class="text-muted mb-0">Wählen Sie ein Template und geben Sie einen Namen ein</p>
    </div>

    <BRow>
      <BCol lg="8">
    <BCard no-body>
      <BCardHeader>
        <h5 class="mb-0">Site-Details</h5>
        <p class="text-muted small mb-0">Geben Sie die Informationen für Ihre neue Site ein</p>
      </BCardHeader>
      <BCardBody>
        <BForm @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label" for="template_id">Template *</label>
            <BFormSelect
              id="template_id"
              v-model="form.template_id"
              required
              :options="templateOptions"
              :class="{ 'is-invalid': form.errors.template_id }"
            />
            <div v-if="form.errors.template_id" class="invalid-feedback d-block">{{ form.errors.template_id }}</div>
          </div>
          <div class="mb-4">
            <label class="form-label" for="name">Name der Site *</label>
            <BFormInput
              id="name"
              v-model="form.name"
              required
              placeholder="z. B. Praxis Mustermann"
              :class="{ 'is-invalid': form.errors.name }"
            />
            <div v-if="form.errors.name" class="invalid-feedback d-block">{{ form.errors.name }}</div>
          </div>
          <div class="d-flex gap-2">
            <BButton type="submit" variant="primary" :disabled="form.processing">Zur Kasse</BButton>
            <Link href="/sites" class="btn btn-outline-secondary">Abbrechen</Link>
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
import { BButton, BCard, BCardBody, BCardHeader, BCol, BForm, BFormInput, BFormSelect, BRow } from 'bootstrap-vue-next'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

type Template = { id: number; name: string; slug: string; price: string }

const props = defineProps<{
  template: Template | null
  templates: Template[]
}>()

const form = useForm({
  template_id: (props.template?.id ?? '') as string | number,
  name: '',
})

const templateOptions = computed(() => [
  { value: '', text: 'Bitte wählen...' },
  ...props.templates.map((t) => ({ value: t.id, text: `${t.name} (${t.price} €)` })),
])

function submit() {
  form.post('/sites')
}
</script>
