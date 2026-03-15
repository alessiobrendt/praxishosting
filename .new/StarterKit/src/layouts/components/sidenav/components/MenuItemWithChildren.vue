<template>
  <li class="side-nav-item" :class="{ active: isOpen }">
    <button class="side-nav-link" :aria-expanded="isOpen" @click="toggleOpen">
      <span v-if="item.icon && isTopLevel" class="menu-icon"><Icon :icon="item.icon" /></span>
      <span class="menu-text">{{ item.label }}</span>
      <span v-if="item.badge" :class="item.badge.className" class="badge">{{ item.badge.text }}</span>
      <span v-else class="menu-arrow"></span>
    </button>
    <BCollapse v-model="isOpen">
      <ul class="sub-menu">
        <template v-for="(child, idx) in item.children">
          <MenuItemWithChildren v-if="child.children" :key="child.slug" :item="child" :level="(level ?? 0) + 1" />
          <MenuItem v-else :key="idx" :item="child" :isTopLevel="isTopLevel" />
        </template>
      </ul>
    </BCollapse>
  </li>
</template>

<script setup lang="ts">
import type { MenuItemType } from '~/types'
import MenuItem from '~/layouts/components/sidenav/components/MenuItem.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { useRoute } from 'vue-router'; 
import { computed, ref, watchEffect } from 'vue'

type PropsType = {
  item: MenuItemType
  openMenuKey?: string | null
  setOpenMenuKey?: (key: string | null) => void
  level?: number
}

const props = defineProps<PropsType>()

const route = useRoute()
const pathname = computed(() => route.path)
const isTopLevel = computed(() => (props.level ?? 0) === 0)

const isActive = computed(() => {
  const isChildActive = (children: MenuItemType[]): boolean => children.some((child) => (child.url && pathname.value.includes(child.url)) || (child.children && isChildActive(child.children)))
  return isChildActive(props.item.children || [])
})

const isOpen = computed(() => {
  return isTopLevel.value ? props.openMenuKey === props.item.slug : localOpen.value
})

const localOpen = ref(false)
const didAutoOpen = ref(false)

watchEffect(() => {
  if (isActive.value && !didAutoOpen.value) {
    if (isTopLevel.value && props.setOpenMenuKey) {
      props.setOpenMenuKey(props.item.slug)
    } else {
      localOpen.value = true
    }
    didAutoOpen.value = true
  }
})

const toggleOpen = () => {
  if (isTopLevel.value && props.setOpenMenuKey) {
    props.setOpenMenuKey(isOpen.value ? null : props.item.slug)
  } else {
    localOpen.value = !localOpen.value
  }
}
</script>
