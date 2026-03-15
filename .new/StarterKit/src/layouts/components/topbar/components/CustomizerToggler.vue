<template>
  <div class="topbar-item d-none d-sm-flex">
    <button @click="toggleCustomizer" class="topbar-link btn-theme-setting" type="button">
      <span class="topbar-link-icon">
        <Icon icon="settings" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'
import { useLayout } from '~/stores/layout'

const layoutStore = useLayout()

const { toggleCustomizer } = layoutStore
</script>
