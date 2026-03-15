<template>
  <div class="p-3 border-bottom border-dashed">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0">Layout Position</h5>
      <div class="d-flex gap-1">
        <div id="position-fixed">
          <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-fixed" value="fixed" :checked="layout.position === 'fixed'" @change="() => updateLayout({ position: 'fixed' })" />
          <label class="btn btn-sm btn-soft-warning w-sm" for="layout-position-fixed">Fixed</label>
        </div>
        <div id="position-scrollable">
          <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-scrollable" value="scrollable" :checked="layout.position === 'scrollable'" @change="() => updateLayout({ position: 'scrollable' })" />
          <label class="btn btn-sm btn-soft-warning w-sm ms-0" for="layout-position-scrollable">Scrollable</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
