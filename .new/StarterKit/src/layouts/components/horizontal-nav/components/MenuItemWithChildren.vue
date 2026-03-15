<template>
  
    <Dropdown :is="menuLevel > 1 ? 'div' : 'li'" :class="`${menuLevel > 1 ? 'dropend' : 'dropdown'} ${wrapperClass} ${isActive ? 'active' : ''}`">
      <a :class="`dropdown-toggle drop-arrow-none ${togglerClass} ${isActive ? 'active' : ''}`" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span v-if="item.icon && menuLevel < 2" class="menu-icon"><Icon :icon="item.icon" class="fs-xl" /></span>
        <span class="menu-text">{{ item.label }}</span>
        <span v-if="item.badge" class="badge" :class="item.badge.className">{{ item.badge.text }}</span>
        <span v-else class="menu-arrow" />
      </a>

      <div class="dropdown-menu">
        <template v-for="(child, idx) in item.children">
          <MenuItemWithChildren v-if="child.children" :key="child.slug" :item="child" toggler-class="dropdown-item" :level="menuLevel + 1" />
          <MenuItem v-else :key="idx" :item="child" link-class="dropdown-item" :level="menuLevel + 1" />
        </template>
      </div>
    </Dropdown>
  
</template>

<script setup lang="ts">
import type { MenuItemType } from '~/types'
import MenuItemWithChildren from '~/layouts/components/horizontal-nav/components/MenuItemWithChildren.vue'
import MenuItem from '~/layouts/components/horizontal-nav/components/MenuItem.vue'
import { useRoute } from 'vue-router'; 
import { computed } from 'vue'

type PropsType = {
  item: MenuItemType
  wrapperClass?: string
  togglerClass?: string
  level?: number
}

const props = defineProps<PropsType>()

const menuLevel = props.level ?? 1

const route = useRoute()
const pathname = computed(() => route.path)

const isActive = computed(() => {
  const isChildActive = (children: MenuItemType[]): boolean => children.some((child) => (child.url && pathname.value.includes(child.url)) || (child.children && isChildActive(child.children)))
  return isChildActive(props.item.children || [])
})
</script>
