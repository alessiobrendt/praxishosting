<template>
  
    <BOffcanvas v-model="isMobileMenuOpen" no-header width="235px" class="p-0 bg-transparent" body-class="p-0">
      <Sidenav />
    </BOffcanvas>
  
</template>

<script setup lang="ts">
import Sidenav from '@/layouts/components/sidenav/index.vue'
import { BOffcanvas } from 'bootstrap-vue-next'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const layoutStore = useLayout()
const { isMobileMenuOpen } = storeToRefs(layoutStore)
</script>
