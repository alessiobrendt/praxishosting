<template>
  <div class="topbar-item d-none d-sm-flex">
    <button
      type="button"
      class="topbar-link btn-theme-setting"
      aria-label="Theme- und Layouteinstellungen öffnen"
      title="Theme &amp; Layout"
      @click="toggleCustomizer"
    >
      <span class="topbar-link-icon">
        <Icon icon="settings" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/wrappers/Icon.vue'
import { useLayout } from '@/stores/layout'

const layoutStore = useLayout()

const { toggleCustomizer } = layoutStore
</script>
