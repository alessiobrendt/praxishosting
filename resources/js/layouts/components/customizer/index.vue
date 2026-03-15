<template>
  <BOffcanvas
    v-model="isCustomizerOpenModel"
    placement="end"
    class="overflow-hidden"
    header-class="p-0"
    body-class="p-0"
    teleport-to="body"
    :teleport-disabled="false"
  >
    <template #header>
      <div class="d-flex justify-content-between text-bg-primary gap-2 p-3" style="background-image: url(/images/settings-bg.png)">
        <div>
          <h5 class="mb-1 fw-bold text-white text-uppercase">Admin Customizer</h5>
          <p class="text-white text-opacity-75 fst-italic fw-medium mb-0">Easily configure layout, styles, and preferences for your admin interface.</p>
        </div>

        <div class="flex-grow-0">
          <button type="button" class="d-block btn btn-sm bg-white bg-opacity-25 text-white rounded-circle btn-icon" @click="toggleCustomizer">
            <Icon icon="x" class="fs-lg" />
          </button>
        </div>
      </div>
    </template>

    <simplebar class="p-0 h-100 theme-customizer-bar" data-simplebar>
      <skin />

      <theme />

      <orientation />

      <topbar-color />

      <sidenav-color />

      <sidenav-size />

      <width />

      <dir />

      <position />

      <sidenav-user />
    </simplebar>

    <template #footer>
      <div class="offcanvas-footer border-top p-3 text-center">
        <BRow class="justify-content-end">
          <BCol cols="6">
            <a href="https://1.envato.market/paces" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-semibold py-2 w-100"><Icon icon="basket" class="me-2 fs-md"></Icon> Buy Now</a>
          </BCol>
          <BCol cols="6">
            <BButton @click="reset" variant="danger" class="fw-semibold py-2 w-100"><Icon icon="refresh" class="me-2 fs-md"></Icon>Reset</BButton>
          </BCol>
        </BRow>
      </div>
    </template>
  </BOffcanvas>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BButton, BCol, BOffcanvas, BRow } from 'bootstrap-vue-next'
import simplebar from 'simplebar-vue'
import { useLayout } from '@/stores/layout'
import Icon from '@/components/wrappers/Icon.vue'
import Orientation from './components/Orientation.vue'
import Position from './components/Position.vue'
import SidenavColor from './components/SidenavColor.vue'
import SidenavSize from './components/SidenavSize.vue'
import SidenavUser from './components/SidenavUser.vue'
import Skin from './components/Skin.vue'
import Dir from './components/Dir.vue'
import Theme from './components/Theme.vue'
import TopbarColor from './components/TopbarColor.vue'
import Width from './components/Width.vue'
import { storeToRefs } from 'pinia'

export type CustomizationOptionType = {
  value: string
  image: string
}

const layoutStore = useLayout()
const { isCustomizerOpen } = storeToRefs(layoutStore)
const { toggleCustomizer, reset } = layoutStore

const isCustomizerOpenModel = computed({
  get: () => isCustomizerOpen.value,
  set: (v: boolean) => {
    layoutStore.$patch({ isCustomizerOpen: v })
  },
})
</script>
