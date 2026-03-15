<template>
  <DefaultLayout>
    <Head title="Gutscheincode einlösen" />
    <PageBreadcrumb title="Gutscheincode einlösen" subtitle="Guthaben & Rechnungen" subtitle-url="/billing" />

    <div class="mx-auto" style="max-width: 36rem;">
      <div class="mb-4">
        <h4 class="mb-1">Gutscheincode einlösen</h4>
        <p class="text-muted mb-0">
          Gib deinen Gutscheincode ein, um den Betrag deinem Guthaben gutschreiben zu lassen.
        </p>
      </div>

      <BCard no-body>
        <BCardHeader>
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <Icon icon="gift" />
            Gutschein einlösen
          </h5>
          <p class="text-muted small mb-0 mt-1">Code von deinem Gutschein eingeben und auf „Einlösen“ klicken.</p>
        </BCardHeader>
        <BCardBody>
          <BForm @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label" for="code">Gutscheincode</label>
              <BFormInput
                id="code"
                v-model="form.code"
                type="text"
                name="code"
                placeholder="z. B. ABCD1234EFGH"
                autocomplete="off"
                class="font-monospace text-uppercase"
                :class="{ 'is-invalid': form.errors.code }"
                :disabled="form.processing"
              />
              <div v-if="form.errors.code" class="invalid-feedback d-block">{{ form.errors.code }}</div>
            </div>
            <BButton type="submit" variant="primary" :disabled="form.processing || !form.code.trim()">
              {{ form.processing ? 'Wird eingelöst…' : 'Einlösen' }}
            </BButton>
          </BForm>
        </BCardBody>
      </BCard>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'
import { BButton, BCard, BCardBody, BCardHeader, BForm, BFormInput } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PageBreadcrumb from '@/components/PageBreadcrumb.vue'

const form = useForm({ code: '' })

function submit() {
  form.post('/billing/redeem-voucher', {
    preserveScroll: true,
    onSuccess: () => form.reset('code'),
  })
}
</script>
