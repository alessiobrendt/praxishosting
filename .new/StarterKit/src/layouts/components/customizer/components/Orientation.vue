<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Orientation</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in orientationOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-orientation" :id="`layout-orientation-${option.value}`" :value="option.value" :checked="layout.orientation === option.value" @change="() => updateLayout({ orientation: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-orientation-${option.value}`">
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
import { useLayout } from '~/stores/layout'
import { toPascalCase } from '~/utils/helpers'
import { storeToRefs } from 'pinia'

import verticalImg from '/images/layouts/sidenav-color-dark.png'
import horizontalImg from '/images/layouts/sidenav-size-offcanvas.png'

const orientationOptions: CustomizationOptionType[] = [
  { value: 'vertical', image: verticalImg },
  { value: 'horizontal', image: horizontalImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
