<template>
  <button class="button-on-hover" @click="toggleSidebar">
    <span class="btn-on-hover-icon"></span>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayout } from '~/stores/layout'

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore

const toggleSidebar = () => {
  updateLayout({ sidenavSize: layout.value.sidenavSize === 'on-hover-active' ? 'on-hover' : 'on-hover-active' })
}
</script>
