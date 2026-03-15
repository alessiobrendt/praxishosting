<template>
  <div id="monochrome-toggler" class="topbar-item d-none d-xl-flex">
    <button class="topbar-link" type="button" data-toggle="monochrome" @click="toggleMonoChromeMode">
      <span class="topbar-link-icon">
        <Icon icon="palette" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/wrappers/Icon.vue'

const toggleMonoChromeMode = () => {
  const html = document.documentElement
  if (html) {
    html.classList.toggle('monochrome')
  }
}
</script>
