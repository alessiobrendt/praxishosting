<template>
  <PageBreadcrumb title="Offcanvas Menu" subtitle="Layouts" />
  <LayoutInfo option="sidenavSize" value="offcanvas" />
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import LayoutInfo from '../components/LayoutInfo.vue'
import { useLayout } from '~/stores/layout'
import { onMounted } from 'vue'

const layoutStore = useLayout()
const { updateLayout } = layoutStore

onMounted(() => {
  updateLayout({ sidenavSize: 'offcanvas' })
})
</script>
