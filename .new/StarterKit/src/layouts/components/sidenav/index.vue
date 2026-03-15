<template>
  <div class="sidenav-menu">
    <RouterLink to="/" class="logo">
      <span class="logo logo-light">
        <span class="logo-lg"><img src="/images/logo.png" alt="logo" /></span>
        <span class="logo-sm"><img src="/images/logo-sm.png" alt="small logo" /></span>
      </span>

      <span class="logo logo-dark">
        <span class="logo-lg"><img src="/images/logo-black.png" alt="dark logo" /></span>
        <span class="logo-sm"><img src="/images/logo-sm.png" alt="small logo" /></span>
      </span>
    </RouterLink>

    <OnHoverToggle />

    <OffcanvasToggle />

    <simplebar id="sidenav" class="scrollbar">
      <UserProfileSettings />

      <AppMenu />
    </simplebar>
  </div>
</template>

<script setup lang="ts">
import simplebar from 'simplebar-vue'
import AppMenu from './components/AppMenu.vue'
import UserProfileSettings from './components/UserProfileSettings.vue'

import OnHoverToggle from './components/OnHoverToggle.vue'
import OffcanvasToggle from './components/OffcanvasToggle.vue'
</script>
