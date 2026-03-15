<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Layout Direction</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in directionOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-direction" :id="`layout-direction-${option.value}`" :value="option.value" :checked="layout.dir === option.value" @change="() => updateLayout({ dir: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-direction-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="fs-sm text-center text-muted mt-2 mb-0">{{ option.value.toUpperCase() }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '~/layouts/components/customizer/index.vue'
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'

import ltrImg from '/images/layouts/dir-ltr.png'
import rtlImg from '/images/layouts/dir-rtl.png'

const directionOptions: CustomizationOptionType[] = [
  { value: 'ltr', image: ltrImg },
  { value: 'rtl', image: rtlImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
