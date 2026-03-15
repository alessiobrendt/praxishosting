<template>
  <PageBreadcrumb title="Boxed" subtitle="Layouts" />
  <LayoutInfo option="width" value="boxed" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted, onUnmounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ width: 'boxed' })
})

onUnmounted(() => {
  updateLayout({ width: 'fluid' })
})
</script>
