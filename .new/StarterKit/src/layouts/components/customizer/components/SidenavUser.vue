<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <label class="fw-bold m-0" for="sidebaruser-check">Sidebar User Info</label>
      </h5>
      <div class="form-check form-switch fs-lg">
        <input type="checkbox" class="form-check-input" name="sidebar-user" id="sidebaruser-check" :checked="layout.sidenavUser" @change="() => updateLayout({ sidenavUser: !layout.sidenavUser })" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
