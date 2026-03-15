<template>
  
    <VueApexCharts v-if="options?.chart?.height" :height="height ?? options.chart.height" v-bind="$attrs" :options="options" :series="options.series ?? series" :class="className" :width="width ?? options.chart.width" />
  
</template>

<script setup lang="ts">
import { watch, computed, shallowRef } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { getDefaultFontFamily } from '~/utils/helpers'
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'
const props = defineProps<{
  type?: string
  height?: number | string
  width?: number | string
  getOptions: () => ApexOptions
  series?: ApexOptions['series']
  className?: string
}>()

const layoutStore = useLayout()
const { layout } = storeToRefs(layoutStore)

const layoutKey = computed(() => `${layout.value.theme}-${layout.value.skin}`)
const options = shallowRef<ApexOptions>()

watch(
  layoutKey,
  () => {
    if (typeof window === 'undefined') return
    window.requestAnimationFrame(() => {
      const baseOptions = props.getOptions()
      options.value = {
        ...baseOptions,
        colors: [...(baseOptions.colors || []), getDefaultFontFamily()],
      } as ApexOptions
    })
  },
  { immediate: true }
)
</script>
