<template>
  <button class="button-close-offcanvas" @click="toggleMobileMenu">
    <Icon icon="menu-4" class="align-middle" />
  </button>
</template>

<script setup lang="ts">
import Icon from '@/components/wrappers/Icon.vue'
import { useLayout } from '@/stores/layout'
const { toggleMobileMenu } = useLayout()
</script>
