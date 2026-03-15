<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Sidebar Size</h5>
    <BRow class="g-3">
      <BCol cols="4" v-for="option in sidenavSizeOptions" :key="option.value">
        <div class="form-check sidebar-setting card-radio">
          <input class="form-check-input" type="radio" name="data-sidenav-size" :id="`layout-sidenav-size-${option.value}`" :value="option.value" :checked="layout.sidenavSize === option.value" @change="() => updateLayout({ sidenavSize: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`layout-sidenav-size-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="mb-0 text-center text-muted mt-2">{{ toPascalCase(option.value) }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '@/layouts/components/customizer/index.vue'
import { toPascalCase } from '@/utils/helpers'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const defaultImg = '/images/layouts/sidenav-size-default.png'
const onHoverActiveImg = '/images/layouts/sidenav-size-default.png'
const compactImg = '/images/layouts/sidenav-size-compact.png'
const offcanvasImg = '/images/layouts/sidenav-size-offcanvas.png'
const onHoverImg = '/images/layouts/sidenav-size-condensed.png'
const condensedImg = '/images/layouts/sidenav-size-condensed.png'

const sidenavSizeOptions: CustomizationOptionType[] = [
  { value: 'default', image: defaultImg },
  { value: 'compact', image: compactImg },
  { value: 'condensed', image: condensedImg },
  { value: 'on-hover', image: onHoverImg },
  { value: 'on-hover-active', image: onHoverActiveImg },
  { value: 'offcanvas', image: offcanvasImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
