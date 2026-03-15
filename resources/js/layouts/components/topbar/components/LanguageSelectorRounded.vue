<template>
  <div id="language-selector-rounded" class="topbar-item">
    <BDropdown
      v-model="isOpen"
      teleport-disabled
      placement="bottom-end"
      :variant="null"
      no-caret
      toggle-class="topbar-link fw-bold"
      offset="5"
    >
      <template #button-content>
        <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="rounded-circle me-2" height="18" />
        <span id="selected-language-code"> {{ currentLanguage.code.toUpperCase() }} </span>
      </template>

      <template v-if="isOpen">
      <BDropdownItem v-for="(language, idx) in languageData" :key="idx" @click="() => setCurrentLanguage(language)">
        <img :src="language.flag" :alt="language.title" class="me-1 rounded-circle" height="18" />
        <span class="align-middle">{{ language.name }}</span>
      </BDropdownItem>
      </template>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayout } from '@/stores/layout'
import { topbarDropdownKey } from '@/composables/useTopbarDropdown'

const topbarDropdown = inject(topbarDropdownKey)
const DROPDOWN_ID = 'language'
const isOpen = computed({
    get: () => topbarDropdown?.openDropdownId.value === DROPDOWN_ID,
    set: (v: boolean) => topbarDropdown?.setOpen(v ? DROPDOWN_ID : null),
})

const FlagDe = '/images/flags/de.svg'
const FlagEs = '/images/flags/es.svg'
const FlagIn = '/images/flags/in.svg'
const FlagIt = '/images/flags/it.svg'
const FlagRu = '/images/flags/ru.svg'
const FlagSa = '/images/flags/sa.svg'
const FlagUs = '/images/flags/us.svg'

type LanguageType = {
  code: string
  name: string
  flag: string
  title: string
}

const languageData: LanguageType[] = [
  { code: 'EN', name: 'English', flag: FlagUs, title: 'English' },
  { code: 'DE', name: 'Deutsch', flag: FlagDe, title: 'German' },
  { code: 'IT', name: 'Italiano', flag: FlagIt, title: 'Italian' },
  { code: 'ES', name: 'Español', flag: FlagEs, title: 'Spanish' },
  { code: 'RU', name: 'Русский', flag: FlagRu, title: 'Russian' },
  { code: 'HI', name: 'हिन्दी', flag: FlagIn, title: 'Hindi' },
  { code: 'SA', name: 'عربي', flag: FlagSa, title: 'Arabic' },
]

const layoutStore = useLayout()
const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore

const currentLanguage = ref<LanguageType>(languageData[0]!)
const setCurrentLanguage = (language: LanguageType) => {
  currentLanguage.value = language
  if (language.code === 'SA' && layout.value.dir === 'ltr') {
    updateLayout({ dir: 'rtl' })
  } else if (language.code !== 'SA' && layout.value.dir === 'rtl') {
    updateLayout({ dir: 'ltr' })
  }
}
</script>
