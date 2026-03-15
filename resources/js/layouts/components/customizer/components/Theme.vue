<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Color Scheme</h5>
    <BRow>
      <BCol cols="4" v-for="option in themeOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-bs-theme" :id="`layout-color-${option.value}`" :value="option.value" :checked="layout.theme === option.value" @change="() => updateLayout({ theme: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-color-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="text-center text-muted mt-2 mb-0">{{ toPascalCase(option.value) }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '@/layouts/components/customizer/index.vue'
import { toPascalCase } from '@/utils/helpers'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const darkImg = '/images/layouts/theme-dark.png'
const lightImg = '/images/layouts/theme-light.png'
const systemImg = '/images/layouts/theme-system.png'

const themeOptions: CustomizationOptionType[] = [
  { value: 'light', image: lightImg },
  { value: 'dark', image: darkImg },
  { value: 'system', image: systemImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
