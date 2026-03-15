<template>
  <div id="theme-dropdown" class="topbar-item">
    <BDropdown
      v-model="isOpen"
      teleport-disabled
      toggle-class="topbar-link drop-arrow-none"
      placement="bottom-end"
      offset="5"
    >
      <template #button-content>
        <span class="topbar-link-icon">
          <Icon v-if="layout.theme === 'light'" icon="sun" />
          <Icon v-else-if="layout.theme === 'dark'" icon="moon" />
          <Icon v-else icon="sun-moon" />
        </span>
      </template>
      <template v-if="isOpen">
      <BDropdownItem class="cursor-pointer" v-for="(theme, idx) in layoutThemes" :active="theme === layout.theme" @click="setTheme(theme)" :key="idx">
        <input class="form-check-input" type="radio" name="data-bs-theme" value="light" style="display: none" />
        <Icon v-if="theme === 'light'" icon="sun" class="align-middle me-1 fs-16" />
        <Icon v-else-if="theme === 'dark'" icon="moon" class="align-middle me-1 fs-16" />
        <Icon v-else icon="sun-moon" class="align-middle me-1 fs-16" />
        <span class="align-middle">{{ toPascalCase(theme) }}</span>
      </BDropdownItem>
      </template>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { BDropdown } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import { toPascalCase } from '@/utils/helpers'
import { topbarDropdownKey } from '@/composables/useTopbarDropdown'

const layoutStore = useLayout()
const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore

const topbarDropdown = inject(topbarDropdownKey)
const DROPDOWN_ID = 'theme'
const isOpen = computed({
    get: () => topbarDropdown?.openDropdownId.value === DROPDOWN_ID,
    set: (v: boolean) => topbarDropdown?.setOpen(v ? DROPDOWN_ID : null),
})

type ThemeType = 'light' | 'dark' | 'system'

const layoutThemes: ThemeType[] = ['light', 'dark', 'system']

const setTheme = (theme: ThemeType) => {
    updateLayout({ theme })
}
</script>
