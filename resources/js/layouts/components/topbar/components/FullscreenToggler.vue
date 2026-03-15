<template>
  <div id="fullscreen-toggler" class="topbar-item d-none d-sm-flex">
    <button class="topbar-link" type="button" @click="toggleFullscreen">
      <span class="topbar-link-icon" v-if="!isFullscreen">
        <Icon icon="maximize" />
      </span>
      <span class="topbar-link-icon" v-else>
        <Icon icon="minimize" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '@/components/wrappers/Icon.vue'

const isFullscreen = ref(false)

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>
