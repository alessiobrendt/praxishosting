<template>
  <div id="search-box-rounded" class="app-search d-none d-xl-flex">
    <BFormInput type="search" class="rounded-pill topbar-search" name="search" placeholder="Quick Search..." />
    <Icon icon="search" class="app-search-icon text-muted" />
  </div>
</template>

<script lang="ts" setup>
import Icon from '~/components/wrappers/Icon.vue'
</script>
