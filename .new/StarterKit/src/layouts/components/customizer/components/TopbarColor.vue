<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Topbar Color</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in topbarColorOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-topbar-color" :id="`layout-topbar-color-${option.value}`" :value="option.value" :checked="layout.topbarColor === option.value" @change="() => updateLayout({ topbarColor: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-topbar-color-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="fs-sm text-center text-muted mt-2 mb-0">{{ toPascalCase(option.value) }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '~/layouts/components/customizer/index.vue'
import { toPascalCase } from '~/utils/helpers'
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'

import darkImg from '/images/layouts/topbar-color-dark.png'
import gradientImg from '/images/layouts/topbar-color-gradient.png'
import grayImg from '/images/layouts/topbar-color-gray.png'
import lightImg from '/images/layouts/topbar-color-light.png'

const topbarColorOptions: CustomizationOptionType[] = [
  { value: 'light', image: lightImg },
  { value: 'dark', image: darkImg },
  { value: 'gray', image: grayImg },
  { value: 'gradient', image: gradientImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
