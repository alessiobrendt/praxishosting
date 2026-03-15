<template>
  <ul class="navbar-nav">
    <template v-for="(item, idx) in menuItems">
      <MenuItemWithChildren v-if="item.children" :key="item.slug" :item="item" wrapper-class="nav-item" toggler-class="nav-link" />
      <MenuItem v-else :key="idx" :item="item" link-class="nav-link" wrapper-class="nav-item" />
    </template>
  </ul>
</template>

<script setup lang="ts">
import MenuItemWithChildren from '@/layouts/components/horizontal-nav/components/MenuItemWithChildren.vue'
import MenuItem from '@/layouts/components/horizontal-nav/components/MenuItem.vue'
import { useSidebarMenu } from '@/composables/useSidebarMenu'

const { menuItems } = useSidebarMenu()
</script>
