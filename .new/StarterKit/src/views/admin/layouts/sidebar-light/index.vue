<template>
  <PageBreadcrumb title="Light Menu" subtitle="Layouts" />
  <LayoutInfo option="sidenavColor" value="light" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ sidenavColor: 'light' })
})
</script>
