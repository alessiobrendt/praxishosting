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
import type { MenuItemType } from '@/types/paces'
import MenuItem from '@/layouts/components/sidenav/components/MenuItem.vue'
import Icon from '@/components/wrappers/Icon.vue'
import { usePage } from '@inertiajs/vue3'
import { computed, ref, watchEffect } from 'vue'

type PropsType = {
  item: MenuItemType
  openMenuKey?: string | null
  setOpenMenuKey?: (key: string | null) => void
  level?: number
}

const props = defineProps<PropsType>()

const page = usePage()
const pathname = computed(() => {
  const url = page.url
  const q = url.indexOf('?')
  return q >= 0 ? url.slice(0, q) : url
})
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
