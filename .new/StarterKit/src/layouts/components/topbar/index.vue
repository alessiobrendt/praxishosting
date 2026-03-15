<template>
  <header ref="topbar" class="app-topbar" :class="{ 'topbar-active': isActive }">
    <BContainer fluid class="topbar-menu">
      <div class="d-flex align-items-center gap-2">
        <!-- Topbar Brand Logo -->
        <div class="logo-topbar">
          <RouterLink to="/" class="logo-light">
            <span class="logo-lg">
              <img src="/images/logo.png" alt="logo" />
            </span>
            <span class="logo-sm">
              <img src="/images/logo-sm.png" alt="small logo" />
            </span>
          </RouterLink>

          <RouterLink to="/" class="logo-dark">
            <span class="logo-lg">
              <img src="/images/logo-black.png" alt="dark logo" />
            </span>
            <span class="logo-sm">
              <img src="/images/logo-sm.png" alt="small logo" />
            </span>
          </RouterLink>
        </div>

        <!-- Sidebar Menu Toggle Button -->
        <MenuToggler />

        <!-- Horizontal Menu Toggle Button -->
        <button class="topnav-toggle-button px-2" data-bs-toggle="collapse" data-bs-target="#topnav-menu">
          <Icon icon="menu-4" />
        </button>

        <SearchBoxRounded />

        <MegamenuColumns />

        <MegamenuApps />
      </div>

      <div class="d-flex align-items-center gap-2">
        <ThemeDropdown />

        <AppsDropdownGrid />

        <NotificationDropdownPeople />

        <FullscreenToggler />

        <MonochromeToggler />

        <CustomizerToggler />

        <LanguageSelectorRounded />

        <UserDropdownDetailed />
      </div>
    </BContainer>
  </header>
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'
import MenuToggler from './components/MenuToggler.vue'

import SearchBoxRounded from './components/SearchBoxRounded.vue'

import MegamenuColumns from './components/MegamenuColumns.vue'
import MegamenuApps from './components/MegamenuApps.vue'

import ThemeDropdown from './components/ThemeDropdown.vue'

import LanguageSelectorRounded from './components/LanguageSelectorRounded.vue'
import AppsDropdownGrid from './components/AppsDropdownGrid.vue'

import NotificationDropdownPeople from './components/NotificationDropdownPeople.vue'

import FullscreenToggler from './components/FullscreenToggler.vue'
import MonochromeToggler from './components/MonochromeToggler.vue'
import UserDropdownDetailed from './components/UserDropdownDetailed.vue'

import CustomizerToggler from './components/CustomizerToggler.vue'

import { ref, onMounted, onUnmounted } from 'vue'

const isActive = ref(false)
const topbar = ref<HTMLElement | null>(null)

const onScroll = () => {
  isActive.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
