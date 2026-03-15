<template>
  <div id="language-selector-rounded" class="topbar-item">
    <BDropdown placement="bottom-end" :variant="null" no-caret toggle-class="topbar-link fw-bold" offset="5">
      <template #button-content>
        <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="rounded-circle me-2" height="18" />
        <span id="selected-language-code"> {{ currentLanguage.code.toUpperCase() }} </span>
      </template>

      <BDropdownItem v-for="(language, idx) in languageData" :key="idx" @click="() => setCurrentLanguage(language)">
        <img :src="language.flag" :alt="language.title" class="me-1 rounded-circle" height="18" />
        <span class="align-middle">{{ language.name }}</span>
      </BDropdownItem>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayout } from '~/stores/layout'

import FlagDe from '/images/flags/de.svg'
import FlagEs from '/images/flags/es.svg'
import FlagIn from '/images/flags/in.svg'
import FlagIt from '/images/flags/it.svg'
import FlagRu from '/images/flags/ru.svg'
import FlagSa from '/images/flags/sa.svg'
import FlagUs from '/images/flags/us.svg'

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
