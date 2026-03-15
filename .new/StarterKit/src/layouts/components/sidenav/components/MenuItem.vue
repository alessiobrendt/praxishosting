<template>
  <li class="side-nav-item" :class="{ active: isActive }">
    <RouterLink :to="item.url ?? ''" class="side-nav-link" :class="{ disabled: item.isDisabled, 'special-menu': item.isSpecial, active: isActive }">
      <span v-if="item.icon && !isTopLevel" class="menu-icon">
        <Icon :icon="item.icon" />
      </span>
      <span class="menu-text">{{ item.label }}</span>
      <span v-if="item.badge" :class="item.badge.className" class="badge">{{ item.badge.text }}</span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'
import { useRoute } from 'vue-router'; 
import { computed } from 'vue'
import type { MenuItemType } from '~/types'

type PropsType = {
  item: MenuItemType
  isTopLevel?: boolean
}

const props = defineProps<PropsType>()

const route = useRoute()
const pathname = computed(() => route.path)

const isActive = computed(() => {
  return props.item.url && pathname.value.endsWith(props.item.url)
})
</script>
