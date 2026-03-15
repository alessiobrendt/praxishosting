<template>
  <BButton variant="primary" class="sidenav-toggle-button btn-icon" @click="toggleSideNav">
    <Icon icon="menu-4" />
  </BButton>
</template>

<script setup lang="ts">
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'
import Icon from '~/components/wrappers/Icon.vue'

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout, toggleMobileMenu } = layoutStore

const toggleSideNav = () => {
  const currentSize = layout.value.sidenavSize

  if (currentSize === 'offcanvas') {
    toggleMobileMenu()
  } else if (currentSize === 'compact') {
    updateLayout({ sidenavSize: 'condensed' })
  } else {
    updateLayout({ sidenavSize: currentSize === 'condensed' ? 'default' : 'condensed' })
  }
}
</script>
