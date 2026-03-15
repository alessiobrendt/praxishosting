<template>
  <PageBreadcrumb title="Scrollable" subtitle="Layouts" />
  <LayoutInfo option="position" value="scrollable" />

  <div style="height: 1000px"></div>
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted, onUnmounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ position: 'scrollable' })
})

onUnmounted(() => {
  updateLayout({ position: 'fixed' })
})
</script>
