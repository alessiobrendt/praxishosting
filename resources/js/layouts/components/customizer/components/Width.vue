<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Layout Width</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in widthOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-layout-width" :id="`layout-width-${option.value}`" :value="option.value" :checked="layout.width === option.value" @change="() => updateLayout({ width: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-width-${option.value}`">
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

const fluidImg = '/images/layouts/width-fluid.png'
const boxedImg = '/images/layouts/width-boxed.png'

const widthOptions: CustomizationOptionType[] = [
  { value: 'fluid', image: fluidImg },
  { value: 'boxed', image: boxedImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
