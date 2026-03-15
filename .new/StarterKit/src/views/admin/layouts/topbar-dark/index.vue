<template>
  <PageBreadcrumb title="Dark Topbar" subtitle="Layouts" />
  <LayoutInfo option="topbarColor" value="dark" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ topbarColor: 'dark' })
})
</script>
