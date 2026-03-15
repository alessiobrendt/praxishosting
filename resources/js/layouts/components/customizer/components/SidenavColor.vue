<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Sidenav Color</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in sidenavColorOptions" :key="option.value">
        <div class="form-check sidebar-setting card-radio">
          <input class="form-check-input" type="radio" name="data-menu-color" :id="`layout-sidenav-color-${option.value}`" :value="option.value" :checked="layout.sidenavColor === option.value" @change="() => updateLayout({ sidenavColor: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-sidenav-color-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="fs-sm text-center text-muted mt-2 mb-0">{{ toPascalCase(option.value) }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '@/layouts/components/customizer/index.vue'
import { toPascalCase } from '@/utils/helpers'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const lightImg = '/images/layouts/sidenav-color-light.png'
const darkImg = '/images/layouts/sidenav-color-dark.png'
const gradientImg = '/images/layouts/sidenav-color-gradient.png'
const grayImg = '/images/layouts/sidenav-color-gray.png'
const imageImg = '/images/layouts/sidenav-color-image.png'

const sidenavColorOptions: CustomizationOptionType[] = [
  { value: 'light', image: lightImg },
  { value: 'dark', image: darkImg },
  { value: 'gray', image: grayImg },
  { value: 'gradient', image: gradientImg },
  { value: 'image', image: imageImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
