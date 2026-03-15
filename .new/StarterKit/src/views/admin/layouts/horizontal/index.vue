<template>
  <PageBreadcrumb title="Horizontal" subtitle="Layouts" />
  <LayoutInfo option="orientation" value="horizontal" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted, onUnmounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ orientation: 'horizontal' })
})

onUnmounted(() => {
  updateLayout({ orientation: 'vertical' })
})
</script>
