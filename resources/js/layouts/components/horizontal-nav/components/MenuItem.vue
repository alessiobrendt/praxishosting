<template>
  <Link v-if="menuLevel > 1" :href="item.url ?? '#'" :class="`${linkClass} ${item.isDisabled ? 'disabled' : ''}`">
    <span v-if="item.icon && menuLevel < 2" class="menu-icon"><Icon :icon="item.icon" class="fs-xl" /></span>
    <span class="menu-text">{{ item.label }}</span>
    <span v-if="item.badge" class="badge" :class="item.badge.className">{{ item.badge.text }}</span>
  </Link>

  <li v-else :class="`${wrapperClass} ${isActive ? 'active' : ''}`">
    <Link :href="item.url ?? '#'" :class="`${linkClass} ${item.isDisabled ? 'disabled' : ''}`">
      <span v-if="item.icon" class="menu-icon"><Icon :icon="item.icon" class="fs-xl" /></span>
      <span class="menu-text">{{ item.label }}</span>
      <span v-if="item.badge" :class="item.badge.className" class="badge">{{ item.badge.text }}</span>
    </Link>
  </li>
</template>

<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { MenuItemType } from '@/types/paces';
import Icon from '@/components/wrappers/Icon.vue';

type PropsType = {
  item: MenuItemType;
  linkClass?: string;
  wrapperClass?: string;
  level?: number;
};

const props = defineProps<PropsType>();

const menuLevel = props.level ?? 1;

const page = usePage();
const pathname = computed(() => {
  const url = page.url;
  const q = url.indexOf('?');
  return q >= 0 ? url.slice(0, q) : url;
});

const isActive = !!(props.item.url && pathname.value.endsWith(props.item.url));
</script>
